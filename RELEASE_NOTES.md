# GoogleRefreshed v1.3.1

Fixes the hardware monitor displaying a white rectangle and light-mode text inside a dark theme, especially after System mode changes.

- Matches the embedded frame’s color scheme to the homepage, preserving its transparent background.
- Updates hardware and note colors when the system appearance changes live.
- Keeps hardware values and focus notes isolated in the private extension frame.

Validation: 91 controlled Brave checks, including 39 checks for all 17 palettes in light/dark modes, live System-mode changes, screenshot pixel comparisons, focus notes, and frame isolation. The new regression reproduced the stale palette before the fix. Source/history/release privacy scan and dependency audit are clean.

Reload GoogleRefreshed at brave://extensions, then refresh Google. If using a downloaded copy, first replace the files in its existing extension folder. No new permissions are required.
