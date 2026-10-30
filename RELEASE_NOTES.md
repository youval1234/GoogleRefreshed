# GoogleRefreshed v1.6.3

Custom shortcuts now use Brave/Chromium's favicon cache instead of falling back to initials for every website outside the built-in icon list. The exact saved website URL is used, so subdomains remain distinct and editing a shortcut updates its icon.

Bundled service icons and explicitly chosen initials remain supported. Unavailable icon images fall back to initials. The favicon permission enables browser-provided icons; no external icon aggregator or broad website access is added.

If a website's icon has not been cached, open the website once and refresh GoogleRefreshed.

Reload GoogleRefreshed at brave://extensions and refresh Google. Other installations can extract GoogleRefreshed-v1.6.3.zip over their existing extension folder and reload.
