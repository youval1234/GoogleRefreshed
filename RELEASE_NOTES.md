# Searchscape v2.1.0

- Branded icons in the ecosystem selector and top-bar Services button, with a properly aligned dropdown arrow.
- Bundle service logos for Microsoft, Apple and Proton so new installations no longer show generic browser globes.
- Add Amazon, Adobe, Zoho, Meta and Yahoo service collections. Each ecosystem keeps its own account link and does not change the selected search engine.
- Recognize catalogued service URLs in custom shortcuts as well. Logos are local assets; no icon aggregator or new permissions.
- Add a circular light/dark reveal from the toggle, short tab and ecosystem transitions, and hover/press feedback. Animation off and reduced-motion settings remain respected.

Reload the extension at brave://extensions and open a fresh tab. Users updating from a release ZIP should replace files in the existing unpacked folder before reloading.

Toolbar-sync workarounds were researched separately; no management permission, companion, or private browser API is added. See docs/toolbar-sync-options.md in the repository.
