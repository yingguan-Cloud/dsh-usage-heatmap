# Installation

[中文](安装说明.md) · [English](INSTALL.md)

This is a [the coding assistant / DSH](https://github.com/) plugin (Cordis bundle). Recipients need the same desktop app with `plugin_manager` support.

> 💡 Hover over a code block and click the copy button in its top-right corner to copy the whole instruction, then paste it into a DSH conversation.

## Option 1 · From the repository (recommended)

```
Install with plugin_manager install_bundle: https://github.com/yingguan-Cloud/dsh-usage-heatmap
```

## Option 2 · From the release tarball

Download `dsh-usage-heatmap-1.0.0.tgz` from [Releases](../../releases), then replace the path below with the real one:

```
Install with plugin_manager install_bundle: C:\path\to\dsh-usage-heatmap-1.0.0.tgz
```

## Option 3 · From a local clone

Clone or download the repo first, then replace the path below with the real absolute path (prefix with `link:` to follow future updates):

```
Install with plugin_manager install_bundle: link:C:\path\to\dsh-usage-heatmap
```

> The install spec must be an **absolute path**. A path containing spaces is fine when quoted.

## After installing

Reload the plugin, then hard-refresh the page (`Ctrl+Shift+R`) to load the new client module. A green grid icon in the left sidebar — click it to open the Usage Heatmap panel.

## Requirements

- Only dependency: `@deepseek-ai/schemastery ^3.18.4` (fetched automatically from the public npm registry).
- The host must provide the `sessionQuery` injection, sidebar slots, and the shared `/api` channel.
- No data is uploaded; session content is never stored — only local daily aggregates.

## Verify (optional)

```sh
node --test test/rollup.test.js   # 8 tests
node --check index.js && node --check client.js && node --check rollup.js
```
