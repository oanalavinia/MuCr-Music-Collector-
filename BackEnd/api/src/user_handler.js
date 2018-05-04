const get_error = require('../error_handler').get_error,
    crypto = require('crypto'),
    randomstring = require('randomstring');

function register_user(env, req, callback) {
    var params = req.params;
    var query = {
        email: params.email
    };
    var user_data = {
        email: params.email,
        first_name: params.first_name,
        last_name: params.last_name,
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
                return callback(null, {token: doc.token});
        })
    });

}


module.exports = {
    register_user: register_user,
    login_user: login_user
};