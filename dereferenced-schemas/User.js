var cordra = require('cordra');
var cordraUtil = require('cordraUtil');
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
    object.content["@context"] = schema["properties"]["@context"]["default"];
    object.content["@type"] = schema["properties"]["@type"]["default"];
    delete object.content.metadata;
    return object;
}

function objectForIndexing(object, context) {
    object.content.metadata = object.metadata;
    return object;
}

function onObjectResolution(object, context) {
    object.content.metadata = object.metadata;
    return object;
}

