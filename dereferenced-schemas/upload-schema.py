#!/usr/bin/env python

import getpass
import requests
import sys
import json
import glob
import argparse

from urllib.parse import urlparse

DEFAULT_TIMEOUT_SECONDS = 30

def check_response(r,quiet=False):
    try:
        r_content = r.json()
    except:
        r_content = r.text
    if str(r.status_code)[0] != "2":
        if not quiet: print("Error: ",r.status_code)
        if not quiet: print(r.text)
        sys.exit(0)
    else:
        return r_content

def parse_args():
    parser = argparse.ArgumentParser(
        description="Upload Cordra schemas from local JSON files."
    )
    parser.add_argument(
        "--allow-http",
        action="store_true",
        help="Allow non-HTTPS base URLs (not recommended)."
    )
    parser.add_argument(
        "--insecure-skip-verify",
        action="store_true",
        help="Disable TLS certificate verification (not recommended)."
    )
    parser.add_argument(
        "--ca-bundle",
        help="Path to a custom CA bundle file for TLS verification."
    )
    return parser.parse_args()

def validate_base_url(base_url, allow_http=False):
    parsed = urlparse(base_url)
    if parsed.scheme not in ("http", "https"):
        raise ValueError("Base URL must start with http:// or https://")
    if parsed.scheme != "https" and not allow_http:
        raise ValueError("HTTPS is required. Use --allow-http to override.")

args = parse_args()

base_url = input("Enter cordra base url: ").strip().rstrip("/")
validate_base_url(base_url, allow_http=args.allow_http)
user = input("Enter admin username: ")
pswd = getpass.getpass()

verify = args.ca_bundle if args.ca_bundle else True
if args.insecure_skip_verify:
    verify = False
    print("WARNING: TLS certificate verification is disabled.")

schemas = glob.glob("*.json")

for schema_file_name in schemas:
    schema_name = schema_file_name.replace(".json","")
    with open(schema_file_name) as f:
        schema_data = json.load(f)

    url = base_url + "/schemas/" + schema_name
    print(url)
    try:
        r = requests.put(
            url,
            json=schema_data,
            auth=(user, pswd),
            verify=verify,
            timeout=DEFAULT_TIMEOUT_SECONDS,
        )
        print(check_response(r))
    except Exception as e:
        print(e)
