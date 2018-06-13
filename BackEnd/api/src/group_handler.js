const get_error = require('../error_handler').get_error,
    crypto = require('crypto'),
    randomstring = require('randomstring'),
    async = require('async'),
    get_user_info = require('./user_handler').get_user_info;

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
            if (err) {
                return callback(get_error(4));
            }
            return callback(null, get_error(0));
        });
    })
}

function get_groups(env, req, callback) {
    const user_uid = req.params.user_uid;
    let owner = [];
    let member = [];
    let inactive = [];

    env.mongo.collection('groups').find({}).toArray((err, groups) => {
        if (err) {
            return callback(get_error(4));
        }
        else {
            if (req.params.req_type === "general")
                return get_groups_general_info(user_uid, groups, callback);
        }
    });

    function get_groups_general_info(user_uid, groups, callback) {
        groups.map((group_info) => {
            if (group_info.owner === user_uid) {
                owner.push({
                    group_id: group_info.group_id,
                    name: group_info.name,
                    description: group_info.description,
                    role: 1
                });
                return group_info;
            }
            if (group_info.owner !== user_uid && group_info['members'].indexOf(user_uid) >= 0) {
                member.push({
                    group_id: group_info.group_id,
                    name: group_info.name,
                    description: group_info.description,
                    role: 2
                });
                return group_info;
            }
            if (group_info.owner !== user_uid && group_info['members'].indexOf(user_uid) < 0) {
                inactive.push({
                    group_id: group_info.group_id,
                    name: group_info.name,
                    description: group_info.description,
                    role: 3
                });
                return group_info;
            }
        });

        let group_resp = owner.concat(member);
        group_resp = group_resp.concat(inactive);
        let resp = get_error(0);
        resp.data = group_resp;
        callback(null, resp);
    }
}

function get_info_group(env, req, callback) {
   // const user_uid = req.params.user_uid;
    const group_id = req.params.group_id;
    const query = {group_id: group_id};

    env.mongo.collection('groups').findOne(query, (err, group) => {
        if (err) {
            return callback(get_error(4));
        }
        else {
            const members_ids = group.members;
            async.map(members_ids, (user_uid, cb) => {
                let req = {url: "localhost:1234/user/" + user_uid};
                get_user_info(env, req, (err, info) => {
                    if (err) {
                        return cb(get_error(4));
                    } else return cb(null, processing_user_info(info.data));
                });
            }, (err, res) => {
                if (err) {
                    return callback(get_error(4));
                }
                else{
                    let response = {code:1000,disc:[].concat.apply([], res)};
                    response.name=group.name;
                    response.description=group.description;
                    return callback(null, response);
                }
            });
        }
    })
}

function processing_user_info(info) {
    const name = info.user_info.username;
    return info.disc.map((disc_item) => {
        disc_item.data['owner_name'] = name;
        return disc_item;
    });

}

module.exports = {
    register_group: register_group,
    join_group: join_group,
    get_groups: get_groups,
    get_info_group:get_info_group
};