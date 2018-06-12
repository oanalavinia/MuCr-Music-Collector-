const get_error = require('../error_handler').get_error,
    crypto = require('crypto'),
    randomstring = require('randomstring'),
    get_mbid=require('./music_brainz').get_mbid;

function register_user(env, req, callback) {
    var params = req.params;
    var query = {
        email: params.email
    };
    var user_data = {
        email: params.email,
        username: params.username,
        city: params.city,
        user_uid: crypto.createHash('md5').update(params.email).digest('hex')
    };
    var user_login = {
        email: params.email,
        pass: crypto.createHash('md5').update(params.pass).digest('hex'),
        user_uid: user_data.user_uid
    };
    env.mongo.collection('user_info').findOne(query, function (err, user) {
        if (err) { //eroare la search
            return callback(get_error(4));
        }

        if (user && user !== undefined) { //exista deja un user cu acelasi email
            return callback(get_error(5));
        }

        env.mongo.collection('user_info').insertOne(user_data, function (err, user) {
            if (err) { //eroare la search
                return callback(get_error(4));
            }
            env.mongo.collection('user_login').insertOne(user_login, function (err, user) {
                if (err) { //eroare la search
                    return callback(get_error(4));
                }
                return callback(null, get_error(0));
            });
        });

    });
}

function login_user(env, req, callback) {
    var params = req.params;
    var query = {
        email: params.email,
        pass: crypto.createHash('md5').update(params.pass).digest('hex')
    };
    env.mongo.collection('user_login').findOne(query, function (err, user) {
        if (err) { //eroare la search
            return callback(get_error(4));
        }
        if (!user || user === undefined) //user sau pass incorecte
            return callback(get_error(6));

        //generate token
        var doc = {
            token: randomstring.generate(8),
            user_uid: user.user_uid
        };
        env.mongo.collection('tokens').insertOne(doc, (err, res) => {
            if (err) { //eroare la search
                return callback(get_error(4));
            }
            else
                return callback(null, {token: doc.token, user_uid: user.user_uid});
        })
    });

}

function add_disc(env, req, callback) {
    const params = req.params;

    if (params.type === "collections")
        return get_mbid(params.data.albumName, params.data.artistName, (err, id) => {
            if (id && id !== undefined)
                params.data.mbid = id;
            insert(params, callback);
        });
    else
        return insert(params, callback);

    function insert(params, callback) {
        env.mongo.collection('disc').insertOne(params, (err, res) => {
            if (err) { //eroare la search
                return callback(get_error(4));
            }
            return callback(null, get_error(0));
        });
    }

}

function get_user_info(env, req, callback) {
    var arr = req.url.split("/");
    var user_id = arr[2];
    var query = {
        user_uid: user_id
    };
    env.mongo.collection('user_info').findOne(query, (err, res) => {
        if (err) { //eroare la search
            return callback(get_error(4));
        }

        if (!res || res === undefined) //nu exista userul
            return callback(get_error(6));

        env.mongo.collection('disc').find(query).toArray((err, disc) => {
            if (err) { //eroare la search
                return callback(get_error(4));
            }
            if (!disc || disc === undefined) //nu exista userul
                disc = [];
            var resp = get_error(0);
            resp.data = {
                user_info: res,
                disc: disc
            };
            return callback(null, resp);
        });

    });
}

module.exports = {
    register_user: register_user,
    login_user: login_user,
    add_disc: add_disc,
    get_user_info: get_user_info
};