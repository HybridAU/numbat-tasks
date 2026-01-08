# Bump version util
The way UV and pnpm handle versions is slightly different when it comes to development versions. 

UV will use a fourth value like `1.2.3.dev0`

While pnpm will use a hyphen like `1.2.3-dev`

The plan is to keep a single authoritative version here, use my own tool to increment it,
and then use uv and pnpm to set the version number in the api, docs, and frontend to match
this one.

## Tests
To run tests 
```shell
uv sync --dev
uv run pytest
```

I'm not running tests as part of the ci/cd because I don't expect this utility to change much
and can run the tests manually when I do change things.