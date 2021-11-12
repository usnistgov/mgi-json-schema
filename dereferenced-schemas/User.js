var cordra = require('cordra');
var cordraUtil = require('cordraUtil');
var config = require('/cordra/schemas/Config');
var schema = require('/cordra/schemas/User.schema.json');

exports.beforeSchemaValidation = beforeSchemaValidation;
exports.objectForIndexing = objectForIndexing;
exports.onObjectResolution = onObjectResolution;

function beforeSchemaValidation(object, context) {
    if (!object.content['@id']) object.content['@id'] = "";
    if (!object.content.password) object.content.password = "";
    var password = object.content.password;
    if (context.isNew || password) {
        if (password.length < 8) {
            throw "Password is too short. Min length 8 characters";
        }
    }
    object = config.staticMethods.getJSONLD(object, schema);
    delete object.content.metadata;
    delete object.content.acl;
    return object;
}

function objectForIndexing(object, context) {
    object.content.metadata = object.metadata;
    if ('acl' in object) {
        object.content.acl = object.acl;
    }
    return object;
}

function onObjectResolution(object, context) {
    object.content.metadata = object.metadata;
    if ('acl' in object) {
        object.content.acl = object.acl;
    }
    if(config.staticMethods.checkViewRequest(context) === 'resource') {
        object = config.staticMethods.viewResource(object, schema);
        object.content.view = {};
        object.content.view.Thing = true;
        object.content.view.Person = true;
    }
    return object;
}

