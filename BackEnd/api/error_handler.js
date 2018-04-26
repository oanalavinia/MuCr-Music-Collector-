var error = [
    {
        "code": 1000,
        "message": "OK"
    },
    {
        "code": 1001,
        "message": "Error create server"
    },
    {
        "code": 1002,
        "message": "Error database connection"
    },
    {
        "code": 1003,
        "message": "Invalid params"
    },
    {
        "code": 1004,
        "message": "Mongo error"
    },
    {
        "code": 1005,
        "message": "Userul exista"
    },
    {
        "code": 1006,
        "message": "Invalid email or pass"
    },
    {
        "code": 1007,
        "message": "Invalid credetials"
    }
];

exports.get_error = function get_error(code) {
    return error[code];
};

