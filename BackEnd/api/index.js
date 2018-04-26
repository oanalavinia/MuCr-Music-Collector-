var manage = require('./manager');
var async = require('async');

global.env = {};

async.waterfall([manage.create_server, manage.connect_mongo], function (err, res) {
    if (err) {
        console.log(err);
        process.exit();
    }

    else {
        env.mongo = res;
    }
});