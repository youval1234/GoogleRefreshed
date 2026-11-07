# Searchscape v2.2.0

- Redesign the toolbar popup with bundled modern typography, the selected theme’s light/dark palette, clear homepage/customization/private-tab actions, and current engine/ecosystem status.
- Fix dark-blue AI links and unreadable text on colored language prompts. Contrast repair now considers the actual surface instead of applying the same foreground everywhere.
- Theme selected text, handle streamed links without inline styles, and restore original inline colors correctly when results theming is disabled.
- Refresh GitHub’s README, screenshots, project description and setup instructions.

Verified: five targeted contrast/popup checks, seven homepage checks, eleven existing results/engine/theme checks and seventeen core browser checks. The new contrast fixtures meet at least 4.5:1 for the covered links and language-prompt text in light/dark mode. These fixtures do not represent every possible Google layout. Existing private-redirect end-to-end verification limitations remain documented.

Reload Searchscape at brave://extensions and open a fresh tab. Release ZIP users should replace the files in the existing unpacked folder before reloading.
