var schema = require('/cordra/schemas/Material.schema.json');
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
    obj["@id"] = ""
    obj["@context"] = schema["properties"]["@context"]["default"];
    obj["@type"] = schema["properties"]["@type"]["default"];
    return obj;
}