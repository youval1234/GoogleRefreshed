# GoogleRefreshed v1.3.0

This update fixes the native Google homepage flashing before customization, mismatched result-card and AI-overview surfaces, misaligned CPU/RAM chart areas, and unreadable news feeds.

- Starts homepage styling at document start, with a fail-open safeguard for native Google and consent controls.
- Keeps neutral Google result surfaces and fades consistent with the selected theme, including dynamically added styles. Turning result theming off restores original inline Google color variables.
- Aligns graph areas even with long CPU model names. The private hardware card resizes to fit its contents, shows the browser-reported GPU renderer and connection estimate, and labels unavailable temperature/utilization readings honestly.
- Repairs malformed news-feed entities and falls back from unavailable Bing feeds to attributed BBC coverage with available photos. Fallback coverage can differ from the selected local edition.
- Adds opt-in browser settings sync for appearance, shortcuts, and widget/feed preferences. Names, notes, photos, city coordinates, and hardware data remain local. Cross-device delivery requires matching extension IDs and browser support; Export / Import remains available.

Validation: 52 controlled Brave checks, live Google homepage and rich autocomplete, live weather/news requests, source/history/archive privacy scan, and dependency audit. Automated live Google result navigation encountered a challenge; it was left untouched and results were tested with controlled fixtures. Physical PC-to-laptop sync has not been verified.

To update an unpacked installation, replace the extension files in its existing folder, click **Reload** at **brave://extensions**, and refresh Google. Settings remain in the existing browser profile. Native Brave tabs/toolbar still use the separate, manually installed companion theme ZIP; webpage themes cannot automatically replace that native theme.
