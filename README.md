# Fix Embed Links

This plugin scans all your notes in the vault to find and fix improperly linked embedded images.

> **Note**: This plugin was prepared for publication by Gemini.

## What This Plugin Does

This plugin scans all your notes in the vault to find and fix a very specific formatting issue: **improperly linked embedded images**.

Sometimes, when you copy and paste content, an embedded image link like `![[image.png]]` can get wrapped in an extra markdown link, resulting in broken code that looks like this:

```markdown
[![[image.png]](/some/unnecessary/path)]
```

This plugin automatically finds all occurrences of this pattern and corrects them back to the simple, valid format:

```markdown
![[image.png]]
```

### Key Features:

*   **Vault-Wide Scan:** Fixes all markdown files in your entire vault with a single command.
*   **Automatic Backups:** Before modifying any file, the plugin creates a backup of the original version in a dedicated backup folder. You can configure the location of this folder in the plugin's settings.
*   **Ribbon Icon & Command:** You can run the fix process either by clicking the wand icon in the left ribbon or by using the "Fix Embed Links: Fix embedded links" command from the command palette.
*   **Detailed Summary:** After the process is complete, you will receive a notification summarizing how many files were scanned, how many were fixed, and the total number of corrections made.

## Installation

### Using the "Install from GitHub" (BRAT) plugin

1.  Install the [Obsidian BRAT](https://github.com/TfTHacker/obsidian42-brat) plugin in Obsidian.
2.  Open the BRAT settings and use the "Add Beta plugin" option.
3.  Paste this repository's URL: `https://github.com/kacperpaluch/obsidian-fix-embed-links`

## Usage

In the command palette (Cmd+P / Ctrl+P), select **Fix Embed Links: Fix embedded links**. The plugin will scan your notes and fix embedded images, creating backups of the modified files.

## Contributions

Feel free to report bugs and suggest features through Issues or Pull Requests.

## License

MIT © Kacper Paluch
