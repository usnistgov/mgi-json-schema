#!/usr/bin/env python

import getpass
import requests
import sys
import json
import glob

from requests.packages.urllib3.exceptions import InsecureRequestWarning
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

def check_response(r,quiet=False):
    try:
        r_content = r.json()
    except:
        r_content = r.text
    if str(r.status_code)[0] is not "2":
        if not quiet: print("Error: ",r.status_code)
        if not quiet: print(r.text)
        sys.exit(0)
    else:
        return r_content

base_url = input("Enter cordra base url: ").strip("/")
user = input("Enter admin username: ")
pswd = getpass.getpass()

schemas = glob.glob("*.json")

for schema_file_name in schemas:
    schema_name = schema_file_name.replace(".json","")
    with open(schema_file_name) as f:
        schema_data = json.load(f)

    url = base_url + "/schemas/" + schema_name
    print(url)
    try:
        r = requests.put(url, data=json.dumps(schema_data), auth=(user, pswd), verify=False)
        print(check_response(r))
    except Exception as e:
        print(e)
