var cordra = require('cordra');
var cordraUtil = require('cordraUtil');
var config = require('/cordra/schemas/Config');
var schema = require('/cordra/schemas/User.schema.json');

exports.beforeSchemaValidation = beforeSchemaValidation;
exports.objectForIndexing = objectForIndexing;
exports.onObjectResolution = onObjectResolution;

function validatePasswordComplexity(password) {
    if (password.length < 12) {
        throw "Password is too short. Min length 12 characters";
    }
    if (!/[a-z]/.test(password)) {
        throw "Password must include at least one lowercase letter";
    }
    if (!/[A-Z]/.test(password)) {
        throw "Password must include at least one uppercase letter";
    }
    if (!/[0-9]/.test(password)) {
        throw "Password must include at least one number";
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        throw "Password must include at least one special character";
    }
}

function beforeSchemaValidation(object, context) {
    if (!object.content['@id']) object.content['@id'] = "";
    if (!object.content.password) object.content.password = "";
    var password = object.content.password;
    if (context.isNew || password) {
        validatePasswordComplexity(password);
    }
    object = config.staticMethods.getJSONLD(object, schema);
    return object;
}

function objectForIndexing(object, context) {
    return object;
}

function onObjectResolution(object, context) {
    if(config.staticMethods.checkViewRequest(context) === 'resource') {
        object = config.staticMethods.viewResource(object, schema);
        object.content.view = {};
        object.content.view.Thing = true;
        object.content.view.Person = true;
    }
    return object;
}
