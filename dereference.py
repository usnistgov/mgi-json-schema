#! /usr/bin/env python
import json
import os
import copy
import dpath
from collections import OrderedDict
import glob

def cleanup_ref_links(obj):
    for k,v in obj.items():
        if isinstance(v, dict):
            cleanup_ref_links(v)
        else:
            if k == "$ref":
               obj[k] = "#" + v.split("#")[1]

def remove_extra_definitions(obj):
    test_obj = copy.deepcopy(obj)
    test_obj.pop("definitions")
    obj_str = str(test_obj)
    pop_items = list()
    for k,v in obj["definitions"].items():
        ref_str = "#/definitions/" + k
        if ref_str in obj_str:
            None
        else:
            pop_items.append(k)
    for pop_item in pop_items:
        obj["definitions"].pop(pop_item)
    if len(obj["definitions"]) == 0:
        obj.pop("definitions")

out_directory = os.getcwd()+"/dereferenced-schemas/"

main_schemas = glob.glob("*.json")
definition_schemas = glob.glob("definition-schemas/*.json")
for file_name_in in main_schemas:
    with open(file_name_in) as f:
        json_data_in = json.load(f)
    for ref_item in json_data_in["allOf"]:
        full_path = ref_item["$ref"]
        full_path_split = full_path.split("#")
        dep_file_path = full_path_split[0]
        if "Process.json" in dep_file_path:
            continue
        try:
            definition_schemas.remove(dep_file_path)
        except:
            None

definitions = dict()
print("Processing definitions:")
for file_name_in in definition_schemas:
    print("\t"+file_name_in)
    with open(file_name_in) as f:
        json_data_in = json.load(f)
    for k,v in json_data_in["definitions"].items():
        definitions[k] = v

print("\nProcessing schemas:")
for file_name_in in main_schemas:
    print("\t"+file_name_in)
    file_name_out = out_directory + file_name_in
    with open(file_name_in) as f:
        json_data_in = json.load(f)
    
    json_data_out = OrderedDict()
    json_data_out = copy.deepcopy(json_data_in)
    json_data_out.pop("allOf")
    json_data_out["definitions"] = copy.deepcopy(definitions)
    json_data_out["properties"] = OrderedDict()
    
    for ref_item in json_data_in["allOf"]:
        full_path = ref_item["$ref"]
        full_path_split = full_path.split("#")
        dep_file_path = full_path_split[0]
        dep_obj_path = full_path_split[1]
        with open(dep_file_path) as f:
            dep_obj = json.load(f)
        dep_properties = dpath.util.get(dep_obj, dep_obj_path)["properties"]
        for k,v in dep_properties.items():
            json_data_out["properties"][k] = v
    
    cleanup_ref_links(json_data_out)
    remove_extra_definitions(json_data_out)
    
    with open(file_name_out, mode='w+') as f:
        f.write(u'%s' % json.dumps(json_data_out,indent=4,separators=(',', ': ')))
