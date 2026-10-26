# Third-party assets and services

Google product icons are copied from Google's official gstatic asset host. The ChatGPT icon is copied from OpenAI's official oaistatic CDN. Original asset URLs are recorded in `extension/icons/services/sources.json`. These trademarks remain the property of their respective owners; GoogleRefreshed is an independent project and is not endorsed by Google, OpenAI, or Brave.

Weather forecasts and city search use [Open-Meteo](https://open-meteo.com/). Forecast data is attributed in the interface; see [Open-Meteo's terms](https://open-meteo.com/en/terms) and [data license](https://open-meteo.com/en/license).

Approximate city detection uses [ipwho.is](https://ipwhois.io/). It can be switched off. No GPS permission is requested, and the extension does not store the raw IP address.

Headlines use [Google News RSS](https://news.google.com/rss). Articles retain their publisher attribution and open through Google News. RSS endpoints are not a versioned Google API and may change. Full articles and article images are not copied into the extension.

Optional photo feeds use [BBC News RSS](https://feeds.bbci.co.uk/news/world/rss.xml) and [The Guardian RSS](https://www.theguardian.com/world/rss). Their article thumbnails load lazily from publisher image CDNs with no page referrer. Photographs and articles remain the property of their publishers; only the feed-provided thumbnails are displayed. Images can be switched off.
