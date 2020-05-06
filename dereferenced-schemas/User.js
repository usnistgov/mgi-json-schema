var schema = require('/cordra/schemas/User.schema.json');
exports.beforeSchemaValidation = beforeSchemaValidation;

function beforeSchemaValidation(obj, context) {
    if (!context.useLegacyContentOnlyJavaScriptHooks) {
        obj.content = beforeSchemaValidationLegacy(obj.content, context);
        return obj;
    } else {
        return beforeSchemaValidationLegacy(obj, context);
    }
}

function beforeSchemaValidationLegacy(obj, context) {
    if (!obj['@id']) obj['@id'] = "";
    if (!obj.password) obj.password = "";
    var password = obj.password;
    if (context.isNew || password) {
        if (password.length < 8) {
            throw "Password is too short. Min length 8 characters";
        }
    }
    obj["@context"] = schema["properties"]["@context"]["default"];
    obj["@type"] = schema["properties"]["@type"]["default"];
    return obj;
}