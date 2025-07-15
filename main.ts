import { Plugin, TFile, Notice, normalizePath, SettingTab, PluginSettingTab, App, Setting } from "obsidian";
import * as fs from "fs";
import * as path from "path";

interface FixEmbedLinksSettings {
  backupDir: string;
}

const DEFAULT_SETTINGS: FixEmbedLinksSettings = {
  backupDir: "../Backup-Fix-Embed-Links",
};

// Regex to match external links wrapping embedded files
const EMBED_LINK_RE = /\[\s*!\[\[\s*([^\]]+?)\s*\]\]\s*\]\([^)]+?\)/gms;

export default class FixEmbedLinksPlugin extends Plugin {
  settings: FixEmbedLinksSettings = DEFAULT_SETTINGS;

  async onload() {
    await this.loadSettings();

    this.addCommand({
      id: "fix-embed-links-run",
      name: "Fix embed links (entire vault)",
      callback: () => this.runFix(),
    });

    this.addRibbonIcon('wand', 'Fix embed links (entire vault)', () => this.runFix());

    this.addSettingTab(new FixEmbedLinksSettingTab(this.app, this));
  }

  /* ---------------- Main Function ---------------- */
  async runFix() {
    const vaultFiles = this.app.vault.getMarkdownFiles();
    const basePath = (this.app.vault.adapter as any).getBasePath?.() ?? "";
    const backupRoot = path.resolve(basePath, this.settings.backupDir);

    let checked = 0, repaired = 0, replacements = 0;

    for (const file of vaultFiles) {
      checked++;
      const text = await this.app.vault.read(file);
      const { newText, nChanges } = this.replaceText(text);

      if (nChanges) {
        repaired++;
        replacements += nChanges;
        await this.backupOriginal(file, text, basePath, backupRoot);
        await this.app.vault.modify(file, newText);
      }
    }

    new Notice(
      `✔ Scanned ${checked} files • Repaired ${repaired} • Replacements ${replacements}\nBackup folder: ${backupRoot}`
    );
  }

  replaceText(text: string) {
    let nChanges = 0;
    const newText = text.replace(EMBED_LINK_RE, (_m, p1) => {
      nChanges++;
      return `![[${p1}]]`;
    });
    return { newText, nChanges };
  }

  async backupOriginal(file: TFile, original: string, basePath: string, backupRoot: string) {
    const rel = normalizePath(file.path);
    const dst = path.join(backupRoot, rel);
    await fs.promises.mkdir(path.dirname(dst), { recursive: true });
    await fs.promises.writeFile(dst, original, "utf8");
  }

  /* ---------------- Settings ---------------- */
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
}

/* -------- Settings Tab in Obsidian UI -------- */
class FixEmbedLinksSettingTab extends PluginSettingTab {
  plugin: FixEmbedLinksPlugin;
  constructor(app: App, plugin: FixEmbedLinksPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Fix Embed Links – Settings" });

    new Setting(containerEl)
      .setName("Backup folder")
      .setDesc("Relative or absolute path where backups of original files will be saved.")
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.backupDir)
          .setValue(this.plugin.settings.backupDir)
          .onChange(async (value) => {
            this.plugin.settings.backupDir = value.trim() || DEFAULT_SETTINGS.backupDir;
            await this.plugin.saveSettings();
          })
      );
  }
}