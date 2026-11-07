# Searchscape v2.1.1

Add an opt-in automatic private-tab redirect. After Allow in Private is enabled, turn on “Open Searchscape automatically in private new tabs” in Customize and grant the optional tab-address permission.

The feature navigates only from browser-owned private new-tab URLs to the local standalone Searchscape homepage. It leaves normal tabs, links, search results and existing tabs unchanged, and rechecks the current URL after asynchronous work to avoid replacing a navigation in progress. Turning it off removes the optional permission.

If changing Allow in Private does not take effect, fully exit and reopen Brave. The explicit Open your homepage popup button still works as a manual option.

Validation: six isolated redirect/event checks and twelve browser appearance/permission-flow checks passed. Automatic review rejected the attempted private-window end-to-end test command with “blocked by policy” and no further explanation; a full live private redirect has not been verified. No new required permissions, dependencies, URL storage or background polling were added.

Reload Searchscape at brave://extensions and open Customize to enable the new option.
