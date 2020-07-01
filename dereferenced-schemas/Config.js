var cordra = require('cordra');

exports.staticMethods = {};
exports.staticMethods.getJSONLD = getJSONLD;

function getJSONLD(object, schema) {
    object.content["@context"] = schema["properties"]["@context"]["default"];
    object.content["@type"] = schema["properties"]["@type"]["default"];
    return object;
}