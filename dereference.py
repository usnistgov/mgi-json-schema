#! /usr/bin/env python
import argparse
import json
import os
import pathlib
import jsonref

parser = argparse.ArgumentParser()
parser.add_argument("file", nargs='+')
args = vars(parser.parse_args())

out_directory = os.getcwd()+"/dereferenced-schemas/"
base_uri = pathlib.PurePosixPath(os.getcwd()).as_uri() + os.sep

for file_name_in in args['file']:
    file_name_out = out_directory + file_name_in
    with open(file_name_in) as f:
        json_data_in = json.load(f)
    json_data_out = jsonref.JsonRef.replace_refs(json_data_in, base_uri=base_uri)

    json_data_out["properties"] = dict()
    req_list = list()

    if "allOf" in json_data_out.keys():
        for schema in json_data_out["allOf"]:
            for property_name,property_content in schema["properties"].items():
                json_data_out["properties"][property_name] = property_content
            if "required" in schema:
                for req_item in schema["required"]:
                    req_list.append(req_item)
        json_data_out.pop("allOf")
        json_data_out["required"] = sorted(list(set(req_list)))
    with open(file_name_out, mode='w+') as f:
        f.write(u'%s' % json.dumps(json_data_out,indent=4,separators=(',', ': ')))
