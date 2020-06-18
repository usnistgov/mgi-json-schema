var cordra = require('cordra');
var cordraUtil = require('cordraUtil');
var schema = require('/cordra/schemas/Instrument.schema.json');

exports.beforeSchemaValidation = beforeSchemaValidation;
exports.objectForIndexing = objectForIndexing;
exports.onObjectResolution = onObjectResolution;

function beforeSchemaValidation(object, context) {
    if (!object.content['@id']) object.content['@id'] = "";
    object.content["@context"] = schema["properties"]["@context"]["default"];
    object.content["@type"] = schema["properties"]["@type"]["default"];
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

