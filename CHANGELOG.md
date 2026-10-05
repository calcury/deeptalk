# Changelog

All notable changes to DeepTalk are recorded in this file.

This is the human-readable companion to `version.json`. **Release both together**: the `notes`
array in `version.json` is what the in-app update prompt displays, and this file keeps the longer
history. When preparing a release, bump the version in `version.json`, `package.json` and here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] — 2026-10-05

### Added
- **Startup update check.** On every launch the app fetches `version.json` from the GitHub raw URL.
  When the published version differs from the one cached locally it shows an English prompt with a
  single **Update now** button. If nothing is cached yet the version is adopted silently, so the
  first run after this feature shipped does not prompt.
- Release notes are displayed inside the update prompt, before the reload happens.

### Notes
- Updating performs a cache-busting reload of every asset, including the HTML entry point, so a
  stale cached bundle is replaced.
- **No local data is ever cleared.** Conversations, word bank, usage history, settings and the API
  key all survive an update.
- A failed version check (offline, blocked, or file missing) stays completely silent.

## [1.0.0] — 2026-10-05

### Added
- First-run guide: add a DeepSeek API key, then pick a role and start talking.
- Eight conversation partners — classmate, teacher, friend, roommate, colleague, interviewer,
  doctor and waiter.
- 50 built-in situations per role, with a **Surprise me** button that draws six fresh topics at a
  time; topics can also be typed by hand.
- Two-pass turns: a streamed conversation reply plus a separate proofreading pass over the
  learner's own sentence.
- Word bank with usage counts, cost tracking with peak/off-peak pricing, and an entirely
  local-storage data model (no account, no server, no tracking).

### Changed
- Failures are reported as they happen. An invalid API key or a network error is now shown
  as-is instead of being covered up by a canned reply.
- The API key field is plain text, so it stays readable with a mobile keyboard.

### Removed
- The canned "demo mode" replies that used to stand in when no API key was configured.
