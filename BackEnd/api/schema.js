module.exports = {
    "post.registeruser": {
        "type": "object",
        "properties": {
            "username": {
                "type": "string",
                "maxLength": 200
            },
            "city": {
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
        "required": ["username", "city", "email", "pass"]
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
    "post.addisc": {
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
            "subtype": {
                "type": "string",
                "maxLength": 200
            }
        },
        "required": ["token", "type", "subtype"]
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