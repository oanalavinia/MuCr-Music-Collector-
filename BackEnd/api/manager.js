const http = require('http');
const get_error = require('./error_handler').get_error;
const config = require('./config.json');
const mongo = require('mongodb').MongoClient;

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

module.exports = {
    create_server: create_server,
    connect_mongo: connect_mongo
};