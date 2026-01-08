import pytest
from bump_version import calculate_new_version


def test_bump_to_dev():
    """
    When bumping from a non-dev version to a dev version, the patch number should increment,
    to show we are working on the next release
    """
    assert calculate_new_version("0.15.0", "dev") == "0.15.1-dev"
    assert calculate_new_version("1.0.0", "dev") == "1.0.1-dev"
    assert calculate_new_version("1.0.1", "dev") == "1.0.2-dev"
    # It should handel multiple digits just fine
    assert calculate_new_version("1.0.9", "dev") == "1.0.10-dev"
    assert calculate_new_version("1.0.10", "dev") == "1.0.11-dev"
    # And doesn't matter what the major and minor versions are
    assert calculate_new_version("1234.5678.999", "dev") == "1234.5678.1000-dev"


def test_bump_existing_dev():
    """
    When bumping from an existing dev version, to a new dev version,
    only the dev version number should increment.
    """
    # No version number (i.e. dev 0)
    assert calculate_new_version("0.15.1-dev", "dev") == "0.15.1-dev1"
    assert calculate_new_version("1.0.1-dev", "dev") == "1.0.1-dev1"
    # We can increment numbers
    assert calculate_new_version("0.15.1-dev1", "dev") == "0.15.1-dev2"
    assert calculate_new_version("1.0.1-dev2", "dev") == "1.0.1-dev3"
    # It should handel multiple digits just fine
    assert calculate_new_version("1.0.1-dev9", "dev") == "1.0.1-dev10"
    assert calculate_new_version("1.0.1-dev10", "dev") == "1.0.1-dev11"
    # And doesn't matter what the major and minor versions are
    assert calculate_new_version("123.456.789-dev999", "dev") == "123.456.789-dev1000"


def test_from_dev_to_patch():
    """
    When bumping from a dev version, to a patch version, the dev tag should be removed
    but the patch version should remain the same.
    """
    # No version number (i.e. dev 0)
    assert calculate_new_version("0.15.1-dev", "patch") == "0.15.1"
    assert calculate_new_version("1.0.1-dev", "patch") == "1.0.1"
    # Dev version numbers make no difference
    assert calculate_new_version("0.15.1-dev1", "patch") == "0.15.1"
    assert calculate_new_version("1.0.1-dev2", "patch") == "1.0.1"
    assert calculate_new_version("1.0.1-dev9", "patch") == "1.0.1"
    assert calculate_new_version("1.0.1-dev10", "patch") == "1.0.1"
    # And doesn't matter what the major and minor versions are
    assert calculate_new_version("123.456.789-dev999", "patch") == "123.456.789"


def test_bump_patch():
    """
    Bumping the patch version, from a non-dev version
    """
    assert calculate_new_version("0.15.1", "patch") == "0.15.2"
    assert calculate_new_version("1.0.1", "patch") == "1.0.2"
    # It should handel multiple digits just fine
    assert calculate_new_version("1.0.9", "patch") == "1.0.10"
    assert calculate_new_version("1.0.10", "patch") == "1.0.11"
    # And doesn't matter what the major and minor versions are
    assert calculate_new_version("1234.5678.999", "patch") == "1234.5678.1000"


def test_bump_minor():
    """
    Bumping the minor version should increment the minor version,
    and reset the patch and dev versions
    """
    # Dev version is removed / ignored
    assert calculate_new_version("0.15.1-dev", "minor") == "0.16.0"
    assert calculate_new_version("1.1.1-dev10", "minor") == "1.2.0"
    # Can increment from zero
    assert calculate_new_version("1.0.0", "minor") == "1.1.0"
    # It should handel multiple digits just fine
    assert calculate_new_version("1.9.9-dev", "minor") == "1.10.0"
    assert calculate_new_version("1.10.10-dev", "minor") == "1.11.0"
    # And doesn't matter what the major and minor versions are
    assert calculate_new_version("1234.5678.999", "minor") == "1234.5679.0"


def test_bump_major():
    """
    Bumping the major version should increment the major version,
    and reset the minor, patch and dev versions
    """
    # Dev version is removed / ignored
    assert calculate_new_version("0.15.1-dev", "major") == "1.0.0"
    assert calculate_new_version("1.1.1-dev10", "major") == "2.0.0"
    # Can increment from zero
    assert calculate_new_version("0.0.0", "major") == "1.0.0"
    # It should handel multiple digits just fine
    assert calculate_new_version("9.9.9-dev", "major") == "10.0.0"
    assert calculate_new_version("10.10.10-dev", "major") == "11.0.0"
    # And doesn't matter what the major and minor versions are
    assert calculate_new_version("1234.5678.999", "major") == "1235.0.0"


def test_invalid_version():
    """
    Passing an invalid version number raises an exception rather than silently failing
    and doing something silly like setting the version to 0.0.0
    """
    # Dev version is removed / ignored
    with pytest.raises(ValueError, match=r"Version number .*"):
        calculate_new_version("apple", "major")
    with pytest.raises(ValueError, match=r"Version number .*"):
        calculate_new_version("banana", "minor")
    with pytest.raises(ValueError, match=r"Version number .*"):
        calculate_new_version("carrot", "patch")
    with pytest.raises(ValueError, match=r"Version number .*"):
        calculate_new_version("dewberry", "dev")


def test_invalid_increment():
    """
    Passing an invalid version number raises an exception rather than silently failing
    and doing something silly like setting the version to 0.0.0
    """
    # Dev version is removed / ignored
    with pytest.raises(ValueError, match=r"Invalid increment"):
        calculate_new_version("1.2.3", "apple")
