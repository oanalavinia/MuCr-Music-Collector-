const http = require('http');
const get_error = require('./error_handler').get_error;
const config = require('./config.json');
const user = require('./src/user_handler');
const group = require('./src/group_handler');
const mongo = require('mongodb').MongoClient;
const tv4 = require('tv4');
const schema = require('./schema');

function create_server(cb) {
    const server = http.createServer(router);
    server.listen(config.port, function (err, res) {
        if (err) {
            return cb(get_error(1));
        }
        else {
            console.log("start server port " + config.port);
            return cb(null, get_error(1));
        }
    });
}

function connect_mongo(server_response, cb) {
    mongo.connect(config.mongo.url, function (err, db) {
        if (err) {
            return cb(get_error(2));

        }
        else {
            return cb(null, db.db('tw'));
        }
    });
}

function router(req, res) {
    var method = req.method;
    var arr = req.url.split("/");
    var request_id = method + "." + arr[1];
    request_id = request_id.toLowerCase();
    console.log(request_id);
    routes[request_id](env, req, function (err, result) {
        if (err) {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify(err));
            res.end();
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify(result));
            res.end();
        }
    });
}

function proxy_post(env, req, cb) {
    var method = req.method;
    var arr = req.url.split("/");
    var request_id = method + "." + arr[1];
    request_id = request_id.toLowerCase();
    var auth_method = ["post.addisc", "post.registergroup", "post.joingroup", "post.getgroups", "post.getgroupinfo", "post.deleteitem"];
    var body = [];
    req.on('data', function (chunk) {
        body.push(chunk);
    }).on('end', function () {
        body = Buffer.concat(body).toString();
        //console.log(body);
        req.params = JSON.parse(body);
        if (!tv4.validate(req.params, schema[request_id])) {
            return cb(get_error(3));
        }
        else {
            if (auth_method.indexOf(request_id) >= 0) {
                var query = {token: req.params.token};
                env.mongo.collection('tokens').findOne(query, (err, res) => {
                    if (err) { //eroare la search
                        return cb(get_error(4));
                    }
                    if (!res || res === undefined) {
                        return cb(get_error(7))
                    }
                    delete req.params.token;
                    req.params.user_uid = res.user_uid;
                    return post_routes[request_id](env, req, cb);
                });
            } else
                return post_routes[request_id](env, req, cb);
        }

    });

}


const routes = {
    "post.registeruser": proxy_post, //user.register_user
    "post.loginuser": proxy_post,
    "post.addisc": proxy_post,
    "post.registergroup": proxy_post,
    "post.joingroup": proxy_post,
    "get.user": user.get_user_info,
    "post.getgroups":proxy_post,
    "post.getgroupinfo":proxy_post,
	"post.deleteitem":proxy_post
};

const post_routes = {
    "post.registeruser": user.register_user,
    "post.loginuser": user.login_user,
    "post.addisc": user.add_disc,
    "post.registergroup": group.register_group,
    "post.joingroup": group.join_group,
    "post.getgroups": group.get_groups,
    "post.getgroupinfo":group.get_info_group,
	"post.deleteitem":user.delete_item
};


module.exports = {
    create_server: create_server,
    connect_mongo: connect_mongo
};