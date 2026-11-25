#!/usr/bin/env bash
# Publishes @evelynlearning/tutor (npm) and evelyn-tutor (PyPI) at the same version.
#
#   sdk/release.sh                         publish both (needs NPM_TOKEN and PYPI_TOKEN in the environment)
#   sdk/release.sh --dry-run               everything except the two uploads; needs no tokens
#   sdk/release.sh --dry-run --allow-dirty the same, on uncommitted work (a rehearsal before committing)
#
# It refuses to go on when: the versions in the four places disagree, a changelog has no entry for the
# version, sdk/ has uncommitted changes, either test suite fails, or the version is already on a registry.
# Steps and recovery: sdk/RELEASING.md.
set -euo pipefail

DRY_RUN=0
ALLOW_DIRTY=0
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    --allow-dirty) ALLOW_DIRTY=1 ;;
    -h|--help) sed -n '2,10p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Unknown option: $arg (options: --dry-run, --allow-dirty)" >&2; exit 2 ;;
  esac
done

SDK="$(cd "$(dirname "$0")" && pwd)"
NPM_NAME="@evelynlearning/tutor"
PYPI_NAME="evelyn-tutor"
VENV="$SDK/python/.venv-release"

step() { printf '\n== %s\n' "$1"; }
refuse() { printf '\nREFUSED: %s\n' "$1" >&2; exit 1; }

if [ "$ALLOW_DIRTY" = 1 ] && [ "$DRY_RUN" = 0 ]; then
  refuse "--allow-dirty is only for --dry-run. A release is made from committed files."
fi

step "Versions"
JS_VERSION="$(node -p "require('$SDK/js/package.json').version")"
JS_CONST="$(sed -n "s/^export const VERSION = '\(.*\)';$/\1/p" "$SDK/js/src/version.ts")"
PY_VERSION="$(sed -n 's/^version = "\(.*\)"$/\1/p' "$SDK/python/pyproject.toml")"
PY_CONST="$(sed -n 's/^__version__ = "\(.*\)"$/\1/p' "$SDK/python/src/evelyn_tutor/__init__.py")"
echo "js/package.json $JS_VERSION | js/src/version.ts $JS_CONST | python/pyproject.toml $PY_VERSION | python __version__ $PY_CONST"
if [ -z "$JS_VERSION" ] || [ "$JS_VERSION" != "$JS_CONST" ] || [ "$JS_VERSION" != "$PY_VERSION" ] || [ "$JS_VERSION" != "$PY_CONST" ]; then
  refuse "the four versions must be the same. See 'Bump the version' in sdk/RELEASING.md."
fi
VERSION="$JS_VERSION"
for changelog in "$SDK/js/CHANGELOG.md" "$SDK/python/CHANGELOG.md"; do
  grep -q "^## $VERSION\$" "$changelog" || refuse "$changelog has no '## $VERSION' entry."
done
echo "Releasing $VERSION"

step "Working tree"
DIRTY="$(git -C "$SDK" status --porcelain -- "$SDK")"
if [ -n "$DIRTY" ]; then
  echo "$DIRTY"
  if [ "$ALLOW_DIRTY" = 1 ]; then
    echo "Uncommitted changes under sdk/ (allowed: this is a dry run with --allow-dirty)."
  else
    refuse "sdk/ has uncommitted changes. Commit them first, so what is published is what is in git."
  fi
else
  echo "sdk/ is clean."
fi

if [ "$DRY_RUN" = 0 ]; then
  step "Tokens"
  [ -n "${NPM_TOKEN:-}" ] || refuse "NPM_TOKEN is not set (an npm token allowed to publish to the evelynlearning organisation)."
  [ -n "${PYPI_TOKEN:-}" ] || refuse "PYPI_TOKEN is not set (a PyPI API token, starting pypi-)."
  echo "NPM_TOKEN and PYPI_TOKEN are set."
fi

step "Registries: is $VERSION already published?"
# 200 = that version exists; 404 = it does not. Anything else means the registry could not be asked.
registry_status() { curl -s -o /dev/null -m 20 -w '%{http_code}' "$1" || true; }
check_unpublished() {
  local label="$1" status
  status="$(registry_status "$2")"
  case "$status" in
    404) echo "$label: $VERSION is not published yet." ;;
    200) refuse "$label already has version $VERSION. Bump the version (sdk/RELEASING.md)." ;;
    *)
      if [ "$DRY_RUN" = 1 ]; then echo "$label: could not be asked (HTTP $status). Ignored in a dry run."
      else refuse "$label could not be asked whether $VERSION exists (HTTP $status). Try again when it is reachable."; fi ;;
  esac
}
check_unpublished "npm" "https://registry.npmjs.org/@evelynlearning%2ftutor/$VERSION"
check_unpublished "PyPI" "https://pypi.org/pypi/$PYPI_NAME/$VERSION/json"

step "Tests: JavaScript (builds first)"
(cd "$SDK/js" && npm test) || refuse "the JavaScript tests failed."

step "Tests: Python"
(cd "$SDK/python" && PYTHONPATH=src python3 -m unittest discover -s tests) || refuse "the Python tests failed."

step "Package: npm tarball"
(cd "$SDK/js" && npm pack --dry-run)

step "Package: Python sdist and wheel"
if [ ! -x "$VENV/bin/python" ]; then
  echo "Creating $VENV (git-ignored) with build and twine."
  python3 -m venv "$VENV"
  "$VENV/bin/python" -m pip install --quiet --upgrade pip build twine
fi
rm -rf "$SDK/python/dist" "$SDK/python/build" "$SDK/python/src/evelyn_tutor.egg-info"
(cd "$SDK/python" && "$VENV/bin/python" -m build --outdir dist)
"$VENV/bin/python" -m twine check "$SDK/python/dist/"*
ls -l "$SDK/python/dist"

if [ "$DRY_RUN" = 1 ]; then
  step "Dry run complete"
  echo "Nothing was uploaded. Without --dry-run the next two steps would be:"
  echo "  npm publish --access public            (from sdk/js, $NPM_NAME@$VERSION)"
  echo "  twine upload dist/*                    (from sdk/python, $PYPI_NAME $VERSION)"
  exit 0
fi

step "Upload: npm"
# The token stays in the environment: the temporary .npmrc holds the literal text ${NPM_TOKEN}, which npm
# fills in itself. The file lives outside the repository and is removed when the script exits, however it exits.
NPMRC="$(mktemp -t evelyn-npmrc.XXXXXX)"
trap 'rm -f "$NPMRC"' EXIT
printf '%s\n' '//registry.npmjs.org/:_authToken=${NPM_TOKEN}' > "$NPMRC"
# --ignore-scripts: the tests and the build have just run above.
(cd "$SDK/js" && npm publish --access public --ignore-scripts --userconfig "$NPMRC")
echo "Published $NPM_NAME@$VERSION."

step "Upload: PyPI"
if ! TWINE_USERNAME=__token__ TWINE_PASSWORD="$PYPI_TOKEN" "$VENV/bin/python" -m twine upload --non-interactive "$SDK/python/dist/"*; then
  refuse "npm has $VERSION but the PyPI upload failed. Do not bump the version: fix the cause and finish with the command under 'If PyPI fails after npm succeeded' in sdk/RELEASING.md."
fi
echo "Published $PYPI_NAME $VERSION."

step "Done"
echo "Both packages are at $VERSION. Now tag the commit:  git tag sdk-v$VERSION && git push origin sdk-v$VERSION"
