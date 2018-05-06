const get_error = require('../error_handler').get_error,
    crypto = require('crypto'),
    randomstring = require('randomstring');

function register_group(env, req, callback) {
    var params = req.params;
    params.owner = params.user_uid;
    params.group_id = params.owner + Date.now();
    delete params.user_uid;
    env.mongo.collection('groups').insertOne(params, (err, res) => {
        if (err) { //eroare la search
            return callback(get_error(4));
        }
        //return callback(null, get_error(0));
        else {
            req.params = {user_uid: params.owner, group_id: params.group_id};
            return join_group(env, req, callback);
        }
    });
}

function join_group(env, req, callback) {
    var params = req.params;
    var query = {
        user_uid: params.user_uid
    };
    var queryGroup = {
        user_uid: params.user_uid,
        group_id: params.group_id
    };
    var update = {
        $push: {group_id: params.group_id}
    };

    env.mongo.collection('user_info').findOne(queryGroup, function (err, group_id) {
        if (err) { //eroare la search
            return callback(get_error(4));
        }

        if (group_id && group_id !== undefined) {
            return callback(get_error(8));
        }

        env.mongo.collection('user_info').updateOne(query, update, (err, res) => {
            if (err) { return callback(get_error(4)); }
            return callback(null, get_error(0));
        });
    })
};

module.exports = {
    register_group: register_group,
    join_group: join_group
};