# Searchscape v2.0.0

GoogleRefreshed is now Searchscape: an interactive search homepage with your choice of provider.

- Ordinary new tabs now open a local extension homepage, independent of Google or the address-bar search engine. The popup opens and customizes this same page.
- Open the homepage as a standalone extension page to avoid Brave’s surrounding new-tab footer.
- Add SearXNG with a configurable trusted instance, including subdirectory installations and HTTP localhost. Web, image and video searches go directly to that instance. The instance URL stays local.
- Switch the Services launcher between Google, Microsoft, Apple and Proton. Your ecosystem preference is saved independently of the search engine.
- Update interface branding, repository links and release names. Existing local settings and GoogleRefreshed exports remain compatible.

Private windows require Allow in Private in Brave extension details. Chromium does not allow direct private New Tab overrides. Use Open homepage from the extension button. The older optional new-tab redirect is retained with its existing Google destination; automatic review blocked the attempted expansion of this redirect.

Update files in the existing unpacked folder, reload the extension at brave://extensions and open a new tab. Reusing the folder preserves the extension ID and settings. The browser may ask you to confirm the new-tab change.
