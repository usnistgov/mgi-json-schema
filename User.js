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
    return obj;
}
