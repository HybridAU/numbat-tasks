import argparse
import re


def calculate_new_version(version, increment):
    version_regex = re.compile(
        r"^(?P<major>\d+)\.(?P<minor>\d+)\.(?P<patch>\d+)(?P<is_dev>-dev)?(?P<dev>\d*)$"
    )
    result = version_regex.search(version)

    # Check for valid inputs
    if increment not in ["major", "minor", "patch", "dev"]:
        raise ValueError("Invalid increment")
    if not result:
        raise ValueError("Version number does not match the expected format")

    major = int(result.group("major"))
    minor = int(result.group("minor"))
    patch = int(result.group("patch"))
    is_dev = bool(result.group("is_dev"))
    dev = result.group("dev")
    # Dev is optional, so we check if it's an empty string before casting it as an int
    dev = 0 if dev == "" else int(dev)

    calculated_version = ""

    if increment == "major":
        calculated_version = f"{major + 1}.0.0"
    elif increment == "minor":
        calculated_version = f"{major}.{minor + 1}.0"
    elif increment == "patch":
        if is_dev:
            calculated_version = f"{major}.{minor}.{patch}"
        else:
            calculated_version = f"{major}.{minor}.{patch + 1}"
    elif increment == "dev":
        if is_dev:
            calculated_version = f"{major}.{minor}.{patch}-dev{dev + 1}"
        else:
            calculated_version = f"{major}.{minor}.{patch + 1}-dev"

    return calculated_version


if __name__ == "main":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "increment",
        help="Version to increment. Options are: major, minor, patch, and dev",
    )
    args = parser.parse_args()

    with open("VERSION") as file:
        current_version = file.read()

    new_version = calculate_new_version(current_version, args.increment)

    with open("VERSION", "w") as file:
        file.write(new_version)
