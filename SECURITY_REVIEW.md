# Security and privacy publication review

Reviewed on 2026-10-27 for GoogleRefreshed v1.5.1.

## Scope

Current tracked source, complete reachable Git history, bundled screenshots and PNG metadata, release ZIP contents, repository metadata, issues, pull requests, and Actions history were checked. The repository has no issues, pull requests, or Actions runs containing additional data. npm reported zero known vulnerabilities for the development dependency set at review time. There are no runtime npm dependencies.

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

GoogleRefreshed is integrated into Google pages; the greeting and ordinary UI preferences are visible page content. Hardware/notes are isolated, but the extension does not prevent Google from executing its own page scripts or receiving searches. Optional services receive their requested queries and the client's IP address. Companion native themes are installed manually, and arbitrary websites retain their own styles. Provider internals are outside this review.

The review combines static inspection, pattern scanning, archive checks, and targeted browser tests. The scan can be rerun with `python security-audit.py`; it reports candidate paths without printing candidate secret values.

Validation includes 142 controlled Brave checks, live Google homepage/private-frame loading, live rich autocomplete, and live weather/news requests. New checks cover startup visibility and fail-open behavior, aligned chart areas, feed repair and attributed fallback, browser-sync privacy/limits, AI-overview fades, dynamic styles, and restoration of original Google variables. An automated live search navigated through Google's challenge page; it was left untouched. Result-page palette/functionality checks use controlled native-page fixtures. Repository issues/pull requests and Actions were checked again and remain empty.

The v1.3.1 patch aligns the private frame’s color scheme with its embedding element and handles live system-appearance changes. An additional 39 checks cover all 17 palettes in light/dark modes, rendered canvas pixels, System-mode changes, focus-note appearance, and frame isolation. No permissions, providers, or data-sharing behavior were added.

The v1.3.2 reverse-image dialog submits multipart files or encoded image URLs directly to Google Lens after a user search action. It adds no permissions and does not store files, image links, or upload data. Tests cover empty-query access, clearing on close, URL encoding without forwarding typed search text, and direct multipart submission. A live test with the public extension logo received a redirect response from Lens (303); no personal image was used.

Version 1.4 adds a fixed allowlist of five search providers. Non-Google selection cancels/blocks Google autocomplete prefixes; search queries are routed through URLSearchParams. Provider choice and approved widget/font preferences can sync, but the separate local focus-timer state is excluded. New font/icon files are bundled with their sources/licenses. Scene markup is produced only from fixed project-owned vector templates selected by known IDs; it contains no remote scripts or assets. Only the chosen scene is mounted. AI theming no longer rewrites shared native Google color-variable definitions; each usage is themed independently with a contrast safeguard. Dropdowns, file buttons, and theme previews are checked in light and dark appearances.
