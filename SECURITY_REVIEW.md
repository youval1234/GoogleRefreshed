## v2.1.2 follow-up

Adds only discoverability controls: a local settings deep link and a fixed browser Details URL for this extension ID. No permissions, redirect rules, network requests or persistence fields are added. Homepage/deep-link and redirect-logic checks passed; the live-private-redirect verification limitation recorded below is unchanged.

## v2.1.1 follow-up

The explicitly enabled private-tab redirect uses the existing optional tabs permission. It checks private-tab status and exact internal new-tab URLs, requires the persisted opt-in, and rechecks the live tab before navigating to a fixed local extension URL. Other destinations are not stored, logged or sent. Duplicate events are bounded by an in-flight set, cleared on completion, with no polling. Turning the setting off removes optional access. Six isolated event checks and the browser permission-flow suite passed; the new private redirect is not yet verified end to end in a live private window because automatic review blocked that test command. Scoped current-source and release-archive scanning found no secret/private-file candidates; this is not a new history audit.

## v2.1.0 follow-up

Adds fixed HTTPS service collections and local PNG/SVG assets, with no new permissions, dependencies or runtime logo requests. Ecosystem choice is synced through the existing preference whitelist. Catalogued shortcut destinations use exact hostname and path-segment matching. SVG assets were checked for executable content and external references. Appearance snapshots and animation styles are temporary and follow animation/reduced-motion settings. Scoped source and release archive scanning found no secret/private-file candidates; this is not a new complete-history audit. Toolbar experiments used only disposable profiles; no user's browser settings were changed.

## v2.0.0 follow-up

Searchscape adds a local extension new-tab page and split incognito mode. Normal new-tab use adds no host permissions. Private use still requires the user’s browser setting. Automatic review blocked the attempted private redirect change; the existing optional redirect retains its Google destination. No claim is made that private new-tab override works.

SearXNG addresses are validated: HTTPS or HTTP localhost, no embedded credentials, query or fragment. Searches navigate directly to the chosen instance; the address remains local and is excluded from preference sync. Service ecosystems contain fixed HTTPS destinations and use the existing icon lookup. Existing settings keys remain unchanged; older exports remain accepted. Source and v2.0 release archives were scanned for secret/private-file candidates, with no findings. This is not a new complete-history audit.

## v1.7.0 follow-up

Shortcut reordering changes the existing settings array through the existing local/save and optional sync mechanisms. No permissions, network endpoints, dependencies or new stored identifiers are added. Drag previews clone existing local DOM and are removed at completion; pointer listeners, animation frames and temporary click guards are bounded and cleaned up. Scoped source and release-archive scanning found no secret/private-file candidates; this is not a new complete-history audit.

## v1.6.4 follow-up

Customize positioning and Google service logo routing add no permissions, dependencies, credentials or runtime network calls. Product icons are bundled PNGs from the official sources recorded in `extension/icons/services/sources.json`. Host checks use exact matches and route checks use complete path segments. Unknown Google paths retain native favicon lookup. Scoped source and release-archive scanning found no secret/private-file candidates; this is not a new complete-history audit.

# Security and privacy publication review

Reviewed on 2026-10-30 for Searchscape v1.6.3.

## Scope

Current tracked source, complete reachable Git history, bundled screenshots and PNG metadata, release ZIP contents, repository metadata, issues, pull requests, and Actions history were checked. At the v1.6.0 review, GitHub had one merged feature pull request, no issues and no Actions runs. Its description/comments contain implementation and testing notes; no secret candidates were observed. npm reported zero known vulnerabilities for the development dependency set at review time. There are no runtime npm dependencies.

## Findings addressed

- Hardware information and focus notes were initially placed in the Google page DOM. They now render in an extension-origin frame. An end-to-end test confirms that the Google origin receives a SecurityError when attempting to read the frame's document.
- Uploaded photo bytes now render in a closed shadow tree, rather than the Google page's inspectable background style.
- Provider responses now have streaming byte limits, text-size limits, request timeouts, and fixed source destinations. Autocomplete callback payloads are parsed as JSON data and never executed as remote code.
- External titles/descriptions render as text. Shortcut/article/image URLs are protocol-checked; rich image hosts are restricted. Credential-bearing shortcut URLs and executable schemes are rejected.
- The loopback preview rejects unknown Host/Origin headers, handles malformed URL encodings, limits request bodies, prevents path traversal, and sends nosniff headers.
- Hardware samples bypass persistent caches. Tests confirm CPU model data is absent from extension-local/session storage.
- Browser sync is off by default and uses an explicit preference allowlist. Tests confirm that greeting names, notes, photos, selected city/coordinates, and hardware fields are excluded, incoming payloads are sanitized, and private local fields survive received preference updates. Only browser API storage behavior and simulated incoming updates have been tested; delivery between two physical devices is not asserted.
- The hardware frame sends only a bounded layout height and an allowlisted sampling status (Sampling, Live, Retrying) to the parent page. Values and notes remain in the extension-origin frame. The GPU renderer, network estimate and unavailable temperature block have been removed; the frame no longer creates a WebGL context or subscribes to connection changes. No privacy setting is changed, and no native companion is installed.
- Public demo screenshots use synthetic CPU and GPU names, rather than the development computer's hardware identity.
- Git exclusions cover browser profiles, settings exports, environment files, signing keys, and local helpers. Release archives use an explicit allowlist.

## Publication data check

No credentials, API tokens, passwords, private keys, cookies, browser histories, personal photos, private notes, or real hardware samples were detected in the tracked source, reachable history, or release archives. Screenshots were checked visually and for embedded metadata. Historical examples include ordinary demo personalization and regional clock labels; current test fixtures are neutral. The GitHub owner/repository URL and public noreply commit identity are intentionally present.

## Remaining boundaries

Searchscape is integrated into Google pages; the greeting and ordinary UI preferences are visible page content. Hardware/notes are isolated, but the extension does not prevent Google from executing its own page scripts or receiving searches. Optional services receive their requested queries and the client's IP address. Companion native themes are installed manually, and arbitrary websites retain their own styles. Provider internals are outside this review.

The review combines static inspection, pattern scanning, archive checks, and targeted browser tests. The scan can be rerun with `python security-audit.py`; it reports candidate paths without printing candidate secret values.

Validation includes 142 controlled Brave checks, live Google homepage/private-frame loading, live rich autocomplete, and live weather/news requests. New checks cover startup visibility and fail-open behavior, aligned chart areas, feed repair and attributed fallback, browser-sync privacy/limits, AI-overview fades, dynamic styles, and restoration of original Google variables. An automated live search navigated through Google's challenge page; it was left untouched. Result-page palette/functionality checks use controlled native-page fixtures. Repository issues/pull requests and Actions were checked at that earlier review; current v1.6.0 repository metadata is described in Scope.

The v1.3.1 patch aligns the private frame’s color scheme with its embedding element and handles live system-appearance changes. An additional 39 checks cover all 17 palettes in light/dark modes, rendered canvas pixels, System-mode changes, focus-note appearance, and frame isolation. No permissions, providers, or data-sharing behavior were added.

The v1.3.2 reverse-image dialog submits multipart files or encoded image URLs directly to Google Lens after a user search action. It adds no permissions and does not store files, image links, or upload data. Tests cover empty-query access, clearing on close, URL encoding without forwarding typed search text, and direct multipart submission. A live test with the public extension logo received a redirect response from Lens (303); no personal image was used.

Version 1.4 adds a fixed allowlist of five search providers. Non-Google selection cancels/blocks Google autocomplete prefixes; search queries are routed through URLSearchParams. Provider choice and approved widget/font preferences can sync, but the separate local focus-timer state is excluded. New font/icon files are bundled with their sources/licenses. Scene markup is produced only from fixed project-owned vector templates selected by known IDs; it contains no remote scripts or assets. Only the chosen scene is mounted. AI theming no longer rewrites shared native Google color-variable definitions; each usage is themed independently with a contrast safeguard. Dropdowns, file buttons, and theme previews are checked in light and dark appearances.

## v1.5.2 artwork update

Eighteen scenes and their palettes were redesigned using local SVG and CSS. The update adds no permissions, remote artwork, native code, runtime dependencies or JavaScript animation loop. The source, reachable history, screenshots/PNG metadata and packaged releases were rescanned for secret and private-file candidates before publication. Screenshots use synthetic hardware fixtures.

## v1.5.3 Storm lightning fix

The filled lightning icon was replaced with local stroked SVG channels and CSS timing. No permissions, remote destinations or dependencies changed. The current source, reachable history, PNG metadata and release ZIP contents were rescanned for secret/private-file candidates before publication. The new previews use synthetic hardware readings.

## v1.5.4 System appearance default and new-tab toggle

The default appearance changed from Light to System, read through the existing prefers-color-scheme media query.

The optional new-tab toggle adds `tabs` as an optional permission only. It is requested from an extension page after an explicit click and removed when the toggle is turned off or settings are reset. The service worker reads a created tab's address solely to compare it with the browser's new-tab page, then navigates that tab to https://www.google.com/. Tab addresses are not stored, logged or sent, and the new `newTabHome` field stays out of browser settings sync. No remote destinations or dependencies changed. The source and reachable history were rescanned for secret/private-file candidates before publication.

## v1.6.0 catalog and license

The catalog contains 50 themes, including 12 new worlds and 12 rebuilt scenes. Original SVG templates are bundled in four scene packs; only the selected scene is mounted. The packs contain no remote resources, JavaScript animation loops or timers. CSS artwork respects animation off, reduced motion and hidden-page pause. Theme filtering changes only the picker view; saved theme IDs and existing privacy settings remain compatible. No permissions, network destinations or runtime dependencies were added.

MIT LICENSE and third-party NOTICE.md are included in source and both ZIPs. Font notices retain their original licenses. New screenshots use synthetic hardware fixtures, UTC and no personal greeting or location. Current tracked source, reachable history, screenshots/metadata and release ZIPs are scanned for secret and private-file candidates before publication.

## v1.6.1 welcome, Le Rouge and Fashion

The optional welcome form stores the display name and completion flag in local extension settings. Both fields remain outside the browser-sync whitelist. Saving, skipping and Escape complete the prompt once; updates preserve established settings, and resetting preferences does not reopen onboarding. Names are rendered as plain text in a bidirectional isolation element, with invisible direction controls removed from the displayed value. Greetings use local hours without additional requests or timers.

Le Rouge and Fashion add two bundled SVG/CSS packs, bringing the catalog to 52 themes. Artwork is original vector geometry inspired by the requested themes; reference images are not packaged. Only the selected scene mounts. Animation off, reduced motion, hidden-page pause and Vivid/Subtle controls remain supported. No permissions, providers or dependencies were added. Release screenshots use synthetic hardware with no real name or location. Source, reachable history, image metadata and packaged ZIPs are scanned before publication.

## v1.6.2 Aztec redesign

Aztec's original SVG geometry and CSS motion were replaced within the existing scene pack. The revised palette recognizes its previous default accent and preserves other custom colors. No permission, provider, dependency, background task or animation timer was added. The selected-scene node/animation limits, reduced-motion setting and hidden-page pause remain enforced by validation. Documentation screenshots use synthetic hardware and no personal name or location. Current source, new preview metadata and packaged ZIPs are checked for secret/private-file candidates; the unchanged historical baseline was scanned for v1.6.1.

## v1.6.3 shortcut favicon lookup

Custom shortcuts use Chromium's internal favicon endpoint keyed by the saved, validated destination URL. The new `favicon` permission and `_favicon/*` resource are scoped to existing Google page matches; no browsing-history or broad host permission is requested. The installed extension adds no remote icon provider and stores no extra icon bytes, cache or history. Bundled brands retain their local icons; custom initials remain opt-in, and unavailable images have a bounded text fallback. The standalone development preview may request the chosen HTTPS site's `/favicon.ico` without a referrer. Destination edits rebuild the icon URL, preventing stale logos. Targeted checks exercise exact-site lookup, subdomain separation, bundled/custom icons, load failure and persistence.
