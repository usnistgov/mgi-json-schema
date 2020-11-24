var cordra = require('cordra');

exports.staticMethods = {};
exports.staticMethods.getJSONLD = getJSONLD;
exports.staticMethods.contains = contains;
exports.staticMethods.checkViewRequest = checkViewRequest;
exports.staticMethods.viewResource = viewResource;

function getJSONLD(object, schema) {
    object.content["@context"] = schema["properties"]["@context"]["default"];
    object.content["@type"] = schema["properties"]["@type"]["default"];
    return object;
}

function contains(list,word) {
    var check = false;
    list.forEach( function(item) {
        if(item === word) {
            check = true;
        }
    });
    return check;
}

function checkViewRequest(context) {
    var result = null;
    if('requestContext' in context) {
        if('view' in context.requestContext) {
            result = context.requestContext.view;
        }
    }
    return result;
}

function dereferenceListPublicTypes(idList) {
    var design = cordra.get('design');
    var objectList = [];
    idList.forEach( function(referencedID) {
        var referencedObject = cordra.get(referencedID);
        if( contains(design.content.authConfig.defaultAcls.defaultAclRead,'public') ) {
            objectList.push(referencedObject.content); 
        } else if( referencedObject.type in design.content.authConfig.schemaAcls) {
            if( contains(design.content.authConfig.schemaAcls[referencedObject.type].defaultAclRead,'public') ) {
                objectList.push(referencedObject.content);
            }
        } else {
            if('acl' in referencedObject) {
                if('readers' in referencedObject.acl) {
                    var isPublic = contains(referencedObject.acl.readers,'public');
                    if(isPublic) {
                        objectList.push(referencedObject.content); 
                    }
                }
            }
        }
    });
    return objectList;
}

function viewResource(object, schema) {
    
    object.content.dereferencedProperties = [];
    
    for (var property in schema.properties) {
        
        if ( 'items' in schema.properties[property] ) {
            if( 'cordra' in schema.properties[property].items ) {
                if( 'type' in schema.properties[property].items.cordra ) {
                    if( 'handleReference' in schema.properties[property].items.cordra.type ) {
                        if( property in object.content ) {
                            object.content.dereferencedProperties.push(property);
                            object.content[property] = dereferenceListPublicTypes(object.content[property]);
                        }
                    }
                }
            }
        } 
        
        if ( '$ref' in schema.properties[property] ) {
            var pathList = schema.properties[property]['$ref'].split('/')
            if ( pathList.length === 3 ) {
                if( 'items' in schema[pathList[1]][pathList[2]] ) {
                    if( 'cordra' in schema[pathList[1]][pathList[2]].items ) {
                        if( 'type' in schema[pathList[1]][pathList[2]].items.cordra ) {
                            if( 'handleReference' in schema[pathList[1]][pathList[2]].items.cordra.type ) {
                                if( property in object.content ) {
                                    object.content.dereferencedProperties.push(property);
                                    object.content[property] = dereferenceListPublicTypes(object.content[property]);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if('parameterControlled' in object.content) {
        object.content.parameterControlled.forEach( function(item) {
            item.nested = {};
            if('parameterControlled' in item) {
                item.nested.parameterControlled = item.parameterControlled;
            }
            if('variableMeasured' in item) {
                item.nested.variableMeasured = item.variableMeasured;
            }
            if('conditionObserved' in item) {
                item.nested.variableMeasured = item.conditionObserved;
            }
        }
        );
    }

    if('variableMeasured' in object.content) {
        object.content.variableMeasured.forEach( function(item) {
            item.nested = {};
            if('parameterControlled' in item) {
                item.nested.parameterControlled = item.parameterControlled;
            }
            if('variableMeasured' in item) {
                item.nested.variableMeasured = item.variableMeasured;
            }
            if('conditionObserved' in item) {
                item.nested.variableMeasured = item.conditionObserved;
            }
        }
        );
    }

    if('conditionObserved' in object.content) {
        object.content.conditionObserved.forEach( function(item) {
            item.nested = {};
            if('parameterControlled' in item) {
                item.nested.parameterControlled = item.parameterControlled;
            }
            if('variableMeasured' in item) {
                item.nested.variableMeasured = item.variableMeasured;
            }
            if('conditionObserved' in item) {
                item.nested.variableMeasured = item.conditionObserved;
            }
        }
        );
    }
    
    return object;
}
