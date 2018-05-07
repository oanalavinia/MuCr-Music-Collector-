const get_error = require('../error_handler').get_error,
    crypto = require('crypto'),
    randomstring = require('randomstring');

function register_group(env, req, callback) {
    var params = req.params;
    params.owner = params.user_uid;
    params.group_id = params.owner + Date.now();
    delete params.user_uid;
    params.members = [];
    params.members.push(params.owner);
    env.mongo.collection('groups').insertOne(params, (err, res) => {
        if (err) { //eroare la search
            return callback(get_error(4));
        }
        else {
            return callback(null, get_error(0));
        }
    });
}

function join_group(env, req, callback) {
    var params = req.params;
    var query = {
        group_id: params.group_id
    };
    var queryGroup = {
        group_id: params.group_id,
        members: params.user_uid
    };
    var update = {
        $push: {members: params.user_uid}
    };

    env.mongo.collection('groups').findOne(queryGroup, function (err, member) {
        if (err) { //eroare la search
            return callback(get_error(4));
        }

        if (member && member !== undefined) {
            return callback(get_error(8));
        }

        env.mongo.collection('groups').updateOne(query, update, (err, res) => {
            if (err) { return callback(get_error(4)); }
            return callback(null, get_error(0));
        });
    })
};

module.exports = {
    register_group: register_group,
    join_group: join_group
};