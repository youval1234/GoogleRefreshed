# Toolbar-theme sync: practical options

Searchscape cannot call Brave's built-in Customize theme controls. Those APIs are restricted to built-in WebUI and allowlisted components. Our isolated Brave extension reported `chrome.braveTheme`, `chrome.theme` and `chrome.themePrivate` as undefined.

## Options

| Option | What it provides | User involvement |
| --- | --- | --- |
| Matching Chromium theme packages | Matching toolbar/tab/address-bar colors | Load the chosen package manually; repeat when changing palettes |
| Both appearances set to System | Coordinated OS light/dark behavior | Configure once; does not match arbitrary theme colors |
| Local desktop companion | Potential automation of browser theme installation or UI selection | Separate installation and platform-specific maintenance; not implemented or verified as a complete solution |
| Firefox port | Supported dynamic toolbar colors through `browser.theme.update` | Requires porting Searchscape and testing Firefox compatibility |

## Installed-theme switching experiment

Chromium's management API exposes installed themes and can toggle an installed theme. We tested this in a disposable Brave profile with a controller extension and two unpacked theme fixtures. Only the last theme remained discoverable; toggling that active theme succeeded. This does not establish a reliable switcher for a complete palette library, and `management` does not supply a general theme installation or manifest-reload API. No management permission was added to Searchscape. A fixed-library switcher remains an experiment rather than a promised feature.

A desktop companion could write a matching theme folder, but applying it would still need a browser-supported installation action or UI automation. Merely editing browser profile preferences while Brave runs is not a supported solution.

## Primary references

- [Brave API feature allowlists](https://github.com/brave/brave-core/blob/master/common/extensions/api/_api_features.json)
- [Chrome themes](https://developer.chrome.com/docs/extensions/develop/ui/themes)
- [Chrome management API](https://developer.chrome.com/docs/extensions/reference/api/management)
- [Chromium management implementation](https://github.com/chromium/chromium/blob/main/extensions/browser/api/management/management_api.cc)
- [Mozilla dynamic theme API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/theme/update)
