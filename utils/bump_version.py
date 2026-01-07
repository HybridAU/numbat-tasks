import argparse
import re


def calculate_new_version(version, increment):
    version_regex = re.compile(
        r"^(?P<major>\d+)\.(?P<minor>\d+)\.(?P<patch>\d+)(?P<dev>(-dev)?)$"
    )
    result = version_regex.search(version)
    major = int(result.group("major"))
    minor = int(result.group("minor"))
    patch = int(result.group("patch"))
    dev = bool(result.group("dev"))

    return_version = ""

    if increment == "major":
        return_version = f"{major + 1}.0.0"
    elif increment == "minor":
        return_version = f"{major}.{minor + 1}.0"
    elif increment == "patch":
        if dev:
            return_version = f"{major}.{minor}.{patch}"
        else:
            return_version = f"{major}.{minor}.{patch + 1}"
    elif increment == "dev":
        return_version = f"{major}.{minor}.{patch + 1}-dev"

    return return_version


if __name__ == "main":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "increment",
        help="Version to increment. Options are: major, minor, patch, and dev",
    )
    args = parser.parse_args()

    if args.increment not in ["major", "minor", "patch", "dev"]:
        raise Exception("Invalid increment")

    with open("VERSION") as file:
        current_version = file.read()

    new_version = calculate_new_version(current_version)

    with open("VERSION", "w") as file:
        file.write(new_version)
