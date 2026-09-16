# Changelog

All notable changes to this project will be documented in this file.

## 0.3.0 - 2026-09-16

### Added
- **Muse Spark 1.3:** Added `muse-spark-1.3` ($1.25/$4.25 per M) and `muse-spark-1.3-contributor` ($0.10/$0.20 per M) models — released 2026-09-02, 1M context, same `openai-responses` capabilities as 1.2. Extension now registers 5 models (1.3, 1.3-contrib, 1.2, 1.2-contrib, 1.1).
- `/meta status` now shows all 5 models and defaults recommendation to `muse-spark-1.3-contributor`.

### Changed
- `package.json` version bumped to `0.3.0`, description updated for 1.3, `homepage`/`repository`/`bugs` now point to `nicklambourne/pi-muse-spark` (fork of `EclipseAditya/pi-muse-spark`).
- `models.json.example` includes 1.3 entries first.
- README updated for 1.3 install/quickstart/models table and fork lineage via `EclipseAditya/pi-muse-spark`.
- Auth / active-model detection now covers `muse-spark-1.3*` in addition to `1.2*`.

## 0.2.0 - 2026-08-11

### Forked from seemethere/pi-meta-ai

This release is a maintained fork of [`seemethere/pi-meta-ai`](https://github.com/seemethere/pi-meta-ai) (`v0.1.1`). Original work credit: `seemethere/pi-meta-ai` contributors.

### Fixed
- **Critical:** False `Meta Model API not authenticated` warning on `pi v0.84+`. Pi removed `ctx.modelRegistry.authStorage` (always returned `undefined`). Now uses canonical `ctx.modelRegistry.getProviderAuthStatus(PROVIDER_ID).configured` to correctly detect `auth.json` (stored), env var, and runtime keys. Fixes `pi install git:github.com/seemethere/pi-meta-ai` showing warning despite correct `/login` flow. ([#1](https://github.com/EclipseAditya/pi-muse-spark/issues/1))
- `/meta status` now correctly reports `Resolved: yes (source: stored/environment/runtime)` instead of `hasValidStored` false-positive, and shows provider-agnostic auth detection.
- Active model check now recognizes `muse-spark-1.2` and `muse-spark-1.2-contributor` as active, not just `1.1`.

### Changed
- Project renamed to `pi-muse-spark` (`package.json:name`, URLs, `homepage`, `repository` point to `EclipseAditya/pi-muse-spark`).
- README rewritten with fork attribution, migration instructions from old packages, and updated quickstart for `1.2-contributor`.
- Bumped `peerDependencies` / `devDependencies` to `^0.84.0` for pi v0.84+ compatibility.
- `LICENSE` retains MIT with added fork attribution; original copyright `seemethere/pi-meta-ai contributors`.

### Added
- This `CHANGELOG` entry documenting fork lineage.

## 0.1.1 - 2026-07-09 (upstream)

### Fixed
- Auth check now correctly rejects legacy `oauth` credentials unless env var present
- README env-var quickstart clarifies `pi -e ./extensions/meta-model-api` must stay loaded
- `getProviderAuthStatus` + `hasValidStored` used instead of `find()` for auth detection

### Added
- `LICENSE` file (MIT), `CONTRIBUTING.md`, `SECURITY.md`, etc.

## 0.1.0 - 2026-07-09 (upstream)

- Initial release: Pi extension for Meta Model API Muse Spark 1.1
