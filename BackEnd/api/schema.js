module.exports = {
    "post.registeruser": {
        "type": "object",
        "properties": {
            "first_name": {
                "type": "string",
                "maxLength": 200
            },
            "last_name": {
                "type": "string",
                "maxLength": 200
            },
            "email": {
                "type": "string",
                "pattern": /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "maxLength": 200
            },
            "pass": {
                "type": "string",
                "maxLength": 200
            }
        },
        "required": ["first_name", "last_name", "email", "pass"]
    },
    "post.loginuser": {
        "type": "object",
        "properties": {
            "email": {
                "type": "string",
                "pattern": /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "maxLength": 200
            },
            "pass": {
                "type": "string",
                "maxLength": 200
            }
        },
        "required": ["email", "pass"]
    },
    "post.adddisc": {
        "type": "object",
        "properties": {
            "token": {
                "type": "string",
                "maxLength": 200
            },
            "type": {
                "type": "string",
                "maxLength": 200
            },
            "author": {
                "type": "string",
                "maxLength": 200
            }
        },
        "required": ["token", "type", "author"]
    },
    "post.registergroup": {
        "type": "object",
        "properties": {
            "token": {
                "type": "string",
                "maxLength": 200
            },
            "name": {
                "type": "string",
                "maxLength": 200
            },
            "description": {
                "type": "string",
                "maxLength": 200
            }
        },
        "required": ["token", "name", "description"]
    },
    "post.joingroup": {
        "type": "object",
        "properties": {
            "token": {
                "type": "string",
                "maxLength": 200
            },
            "group_id": {
                "type": "string",
                "maxLength": 200
            }
        },
        "required": ["token", "group_id"]
    }
};