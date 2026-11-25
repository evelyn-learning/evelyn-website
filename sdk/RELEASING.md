# Releasing the developer packages

Two packages are released together, at the same version:

| Registry | Name | Source |
|---|---|---|
| npm | `@evelynlearning/tutor` | `sdk/js` |
| PyPI | `evelyn-tutor` | `sdk/python` |

`sdk/release.sh` does the release. It needs Node 18 or later, npm, Python 3.9 or later, `curl` and `git`. It creates its own Python environment for `build` and `twine` in `sdk/python/.venv-release` (git-ignored) the first time it runs; nothing is installed globally.

## 1. Bump the version

The version is written in four places and they must agree (the script refuses otherwise):

| File | Line |
|---|---|
| `sdk/js/package.json` | `"version": "X.Y.Z"` |
| `sdk/js/src/version.ts` | `export const VERSION = 'X.Y.Z';` |
| `sdk/python/pyproject.toml` | `version = "X.Y.Z"` |
| `sdk/python/src/evelyn_tutor/__init__.py` | `__version__ = "X.Y.Z"` |

Add a `## X.Y.Z` entry to both `sdk/js/CHANGELOG.md` and `sdk/python/CHANGELOG.md`.

Which number to raise:

- **Patch** (0.1.0 to 0.1.1): fixes, wording, documentation.
- **Minor** (0.1.0 to 0.2.0): anything added, such as a helper for a new endpoint, a new claim in the types, a new command or MCP tool.
- **Major**: something an existing caller must change for. The API itself only adds within `/api/portal/v1`; a breaking change to the API would be a `/v2` path served side by side, and that is when these packages get a new major version.

If the engine's integration guide changed, refresh the bundled copy (`sdk/js/docs/integration.md`) from `apps/tutor/src/lib/tutor/partner-dashboard/integration-guide.ts`. If a language was added, update the bundled lists in `sdk/js/src/languages.ts` and `sdk/python/src/evelyn_tutor/languages.py` (they are only the offline fallback, so a release is not needed just for a new language).

## 2. Commit

Commit everything under `sdk/`. The script refuses to release from a tree with uncommitted changes under `sdk/`, so that what is published is what is in git.

## 3. Rehearse

```sh
sdk/release.sh --dry-run
```

This checks the versions and changelogs, the clean tree, that the version is not already on either registry, runs both test suites, lists the npm tarball, builds the Python sdist and wheel and checks them with `twine check`. It uploads nothing and needs no tokens. To rehearse before committing, add `--allow-dirty` (accepted only with `--dry-run`).

Read the npm tarball list: it should hold `dist/`, `bin/`, `docs/integration.md`, `README.md`, `CHANGELOG.md`, `LICENSE`, `llms.txt` and `package.json`, and nothing else.

## 4. Release

```sh
NPM_TOKEN=… PYPI_TOKEN=… sdk/release.sh
```

- `NPM_TOKEN`: an npm access token that may publish to the `evelynlearning` organisation (a granular token with read and write on `@evelynlearning/tutor`, or an automation token).
- `PYPI_TOKEN`: a PyPI API token (`pypi-…`). For the first release it must be an account-wide token, because the project does not exist yet; afterwards replace it with one scoped to `evelyn-tutor`.

The npm token is never written to disk: the script points npm at a temporary `.npmrc` outside the repository that holds the text `${NPM_TOKEN}`, which npm fills in from the environment, and removes the file when it exits. The PyPI token is passed to `twine` in its environment (`TWINE_USERNAME=__token__`). Neither is printed. `--provenance` is not used: it needs a CI identity, and this runs from a laptop.

Prefer setting the tokens for the one command, as above, over exporting them into the shell.

The order is npm first, then PyPI. When both are up, tag the commit as the script says:

```sh
git tag sdk-vX.Y.Z && git push origin sdk-vX.Y.Z
```

## 5. Check

```sh
npm view @evelynlearning/tutor version
python3 -m pip index versions evelyn-tutor
npx -y @evelynlearning/tutor@latest doctor     # in a directory with the keys in .env
```

## If something goes wrong

**The script refused.** It says why in the last line. Nothing was uploaded unless the line says npm already has the version.

**If PyPI fails after npm succeeded.** npm already has the version and cannot take it again, so do not bump. Fix the cause (usually the token) and upload the files the script already built:

```sh
cd sdk/python
TWINE_USERNAME=__token__ TWINE_PASSWORD="$PYPI_TOKEN" .venv-release/bin/python -m twine upload --non-interactive dist/*
```

**A bad release is out.** A published version cannot be replaced on either registry. Release a fixed patch version. If the bad one is harmful, mark it: `npm deprecate @evelynlearning/tutor@X.Y.Z "use X.Y.Z+1"`, and yank the release on PyPI (project page, Manage, Releases, Yank). Unpublishing from npm is possible only within 72 hours and blocks that version number for good; prefer deprecating.

**The release environment is broken.** Delete `sdk/python/.venv-release`; the script makes it again.
