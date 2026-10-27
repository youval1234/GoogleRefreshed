# GoogleRefreshed v1.5.2

Eighteen distinct theme redesigns, with original local vector artwork and new light/dark palettes:

- **Code** — floating editor, source-control graph and terminal panels, syntax colors, caret motion and travelling commit traces.
- **Lunar** — shaded cratered moon with small surface details, orbiting probe, star field and layered lunar horizon.
- **Magma** — basalt formations, curved molten channels, glowing fissures, crust fragments and rising cinders.
- **Fantasy** — floating citadel, shaded spires, warm windows, leafy island, cascading waterfalls and drifting mist.
- **Math** — rotating perspective icosahedron, Archimedean spiral, saddle surface and drawn sine wave on a fine coordinate grid.
- **Rainbow** — glass prism with refracted light, layered spectrum sculpture, caustics and glints.
- **Sage** — botanical branches with shaded leaves, fine veins, small flowers and drifting motes.
- **Solar** — textured photosphere, sunspots, luminous corona, animated prominence arcs and warm dune contours.
- **Autumn** — maple woodland, individually placed leaves, layered ground and drifting mist.
- **Midnight** — observatory with telescope, star trails, crescent, constellations and lake reflections.
- **Mystic** — faceted amethyst clusters, rotating astrolabe, star chart and flowing vapor.
- **Magical** — illuminated book, gilded archway, light curtain and floating script sparks.
- **Noir** — rain on a shuttered window, cinematic light, streetlamp and reflections.
- **Sunset** — layered coastal cliffs, warm sun, sea glints, cloud ribbons and seabirds.
- **Scary** — crooked house, gnarled forest, swaying lantern, candle glow and low fog.
- **Summer** — turquoise coast, shaded palm fronds, striped parasol, beach chair and sailboat.
- **Science** — translucent laboratory glass, bubbling liquid, molecular structure, double helix and petri dish.
- **City Skyline** — layered architecture, illuminated windows, suspension bridge, river and moving metro.

Artwork stays around the page edges to preserve the search area. Only the selected scene is mounted. All eighteen honor animation off, reduced motion and hidden-page pause; no JavaScript rendering loop, remote art, new dependencies or permissions were added. Matching manual toolbar-theme packages use the updated palettes.

Validation: 153 regression checks, plus dedicated light/dark, narrow-layout, motion, pause and reduced-motion checks for all 18 redesigns in isolated Brave profiles. No malformed SVG errors were reported. Screenshots are in docs/v152. The hardware-canvas regression now samples multiple edges so an illustrated background crossing a single pixel does not cause a false failure; the reset check waits for asynchronous storage completion.

Replace the files in the existing extension folder, reload GoogleRefreshed at brave://extensions, then refresh Google. Refresh the local preview to see the updated artwork.
