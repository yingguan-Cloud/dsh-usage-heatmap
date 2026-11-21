# Installation

[中文](安装说明.md) · [English](INSTALL.md)

This is a [the coding assistant / DSH](https://github.com/) plugin (Cordis bundle). Recipients need the same desktop app with `plugin_manager` support.

## Option 1: Install from the GitHub repository (recommended)

In a DSH conversation, ask the assistant to run:

```
Install with plugin_manager install_bundle: https://github.com/yingguan-Cloud/dsh-usage-heatmap
```

## Option 2: Install from the release tarball

Download `dsh-usage-heatmap-1.0.0.tgz` from the [Releases](../../releases) page, then run:

```
Install with plugin_manager install_bundle: <absolute path to the .tgz file>
```

The tarball pulls the only dependency, `@deepseek-ai/schemastery`, from the public npm registry automatically — no bundled `node_modules` needed.

## Option 3: Install from a local folder

Copy the whole repository folder to the other machine (keep it intact — do not send single files), then run:

```
Install with plugin_manager install_bundle: C:\Users\<name>\Desktop\dsh-usage-heatmap
```

> The install spec must be an **absolute path**. A path containing spaces is fine when quoted.

## After installing

1. Reload the plugin, then hard-refresh the page (`Ctrl+Shift+R`) to load the new client module.
2. A green grid icon appears in the left sidebar — click it to open the Usage Heatmap panel.

## Requirements

- Only dependency: `@deepseek-ai/schemastery ^3.18.4` (fetched automatically at install time).
- The host must provide the `sessionQuery` injection, sidebar slots, and the shared `/api` channel.
- No data is uploaded; session content is never stored — only local daily aggregates.

## Verify (optional)

```sh
node --test test/rollup.test.js   # 8 tests
node --check index.js && node --check client.js && node --check rollup.js
```

中文版见 [安装说明.md](安装说明.md)。
