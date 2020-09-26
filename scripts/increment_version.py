import os
import json
from sys import argv

def incrementVersion(mode, release, major, minor):
    if mode == "release":
        release = release + 1
        major = 0
        minor = 0
    elif mode == "major":
        major = major + 1
        minor = 0
    elif mode == "minor":
        minor = minor + 1
    else:
        major = major + 1
        minor = 0

    newVersion = "%s.%s.%s" % (release, major, minor)

    return newVersion

release = 0
major = 0
minor = 0
mode = argv[1]
packageFile = "package.json"

with open(packageFile, "r") as pf:
    json_data = json.load(pf)
    version = json_data["version"]
    release, major, minor = map(lambda v: int(v), version.split("."))

newVersion = incrementVersion(mode, release, major, minor)

with open(packageFile, "w") as pf:
    json_data["version"] = newVersion
    json.dump(json_data, pf, indent=2)

print("New version of the backend has been set to: %s" % (newVersion))