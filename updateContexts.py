import json
import os

jprint = lambda j: print(json.dumps(j, indent=2))

for fp in os.listdir("./"):
    if fp[-5:] != ".json": continue

    print(fp)

    with open(fp, "r") as f:
        data = json.load(f)

    context = data["allOf"][0]["@context"]["default"]

    if isinstance(context, list):
        # context[0] = "https://schema.org/docs/jsonldcontext.json"
        context[1]["@vocab"] = "https://pages.nist.gov/material-schema/user-defined/"
    elif isinstance(context, str):
        # data["allOf"][0]["@context"]["default"] = "https://schema.org/docs/jsonldcontext.json"
        pass
    else:
        print("ERROR "*5)

    with open(fp, "w+") as f:
        json.dump(data, f, indent=4)
