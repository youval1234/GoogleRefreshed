# Searchscape v2.3.0

- Expand all nine service collections to 110 links. SharePoint is near the top of Microsoft’s launcher; To Do, Forms, Planner, Loop, Copilot, Power Automate, Lists, work Outlook and Admin center are included.
- Add service search with counts, empty-state feedback and Escape-to-clear. Include more Google, Apple, Proton, Amazon, Adobe, Zoho, Meta and Yahoo apps with bundled icons. SharePoint uses Microsoft’s work-account launcher; no organization URL is inferred.
- Clean startup/settings parameters out of the visible homepage address, retain a branded favicon, and keep reloads and settings deep links working. The extension ID remains browser-controlled.
- Theme the language-suggestion card’s pastel-yellow surface as well as its text. Disabling results theming restores the original styling.
- Cache the private-redirect opt-in and permission status to reduce repeated lookups, with event-driven updates and a navigation-race check.
- Add Open private Searchscape to the popup. It targets the extension URL from the outset. Brave’s normal private-window shortcut can still paint its protected start page before the redirect event; that flash cannot be guaranteed away by this extension.

Validation includes bundled icons for every catalog entry in light/dark mode, service search, clean URLs and reloads, language-prompt styling/restoration, popup launch requests and private-redirect event logic. A complete live private-redirect end-to-end test remains unverified as documented in SECURITY_REVIEW.md. No new permissions, dependencies, URL storage or polling.

Reload the extension and open a fresh tab. To enter a private window directly at Searchscape, use its toolbar popup → Open private Searchscape (Allow in Private must be enabled).
