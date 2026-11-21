<div align="center">

# the coding assistant Usage Heatmap

[中文](README.md) · **English**

</div>

![Usage Heatmap preview](preview.svg)

A [the coding assistant / DSH](https://github.com/) plugin. Click the green grid icon in the left sidebar to open the Usage Heatmap panel, which shows daily session activity and model token usage.

## Features

- **Usage stats**: token usage for today, last 7 / 15 / 30 days; today additionally breaks down into input, output and cache-read (three stacked rows, labels left-aligned, values right-aligned).
- **Heatmap**: 5 levels of daily activity intensity; switch between the "Sessions / Token usage" tabs, with ranges of the last 3/6/12/18/24 months or this year.
- **Hover**: shows the date and that day's value. **Click a cell**: lists the session IDs and timestamps with activity that day.
- Auto-refreshes every 15 seconds by default; manual "Refresh" is also available.
- Theme follows the host light/dark setting; all visible text goes through the Client locale (Chinese / English).

## Installation

See [INSTALL.md](INSTALL.md) for all three installation methods ([中文](安装说明.md)).

### From the tarball (recommended)

Download `dsh-usage-heatmap-1.0.0.tgz` from [Releases](../../releases), then in a DSH conversation run:

```
Install with plugin_manager install_bundle: <absolute path to the .tgz file>
```

### From the repository

```
Install with plugin_manager install_bundle: https://github.com/yingguan-Cloud/dsh-usage-heatmap
```

Or from a local clone (absolute path; prefix with `link:` to follow future updates):

```
Install with plugin_manager install_bundle: C:\path\to\dsh-usage-heatmap
```

After installing, reload the plugin and hard-refresh the page (`Ctrl+Shift+R`) to load the client module. A green grid icon in the left sidebar means success.

> The only dependency, `@deepseek-ai/schemastery`, is fetched from the public npm registry automatically — no bundled `node_modules` needed.

## Data semantics

- **Sessions**: a Session counts once on its creation day and on each day with its own events; derived child sessions count separately.
- **Tokens**: from assistant messages in session logs, usage of failed attempts, and compaction-summary usage — summing the four buckets input, output, cache-read and cache-write. `reasoning` is already included in output and is not double-counted. Fork-inherited history is counted only in the parent.
- The panel's token total always equals the sum of the four buckets (a test guards this).
- **No monetary Credits**: the current Harness session API has no verifiable billing field, so the second tab is explicitly "Token usage" — no made-up Token→Credits exchange rate.
- No session content, tool calls, or event copies are stored — only local daily aggregates; no external services are contacted.

## Configuration (the `usage-heatmap` row in `cordis.patch.yml`)

`defaultMetric: sessions|tokens`, `rangeMonths: 1..24`, `weekStart: 0|1`, `scale: quantile|fixed`, `backfill: true|false`, `timeZone` (default `Asia/Shanghai`).

## Agent tool

`usage_report`: returns the session count, the four token buckets plus total for a range (defaults to the current month), and token usage for today, the last 7, 15 and 30 days. It shares the same aggregation code (`readDaily`) as the panel, so the two always agree.

## API

The page calls the same-origin `GET /api/dsh-usage-heatmap?from=YYYY-MM-DD&to=YYYY-MM-DD[&day=YYYY-MM-DD]`. The route is registered on the shared `/api` channel via `ctx.connection.fetch.register`, using the same browser-cookie access control; unauthenticated requests get 401.

## Local verification

```sh
node --test test/rollup.test.js   # 8 tests: timezone buckets, four-bucket sum, retry, compaction, fork dedup
node --check index.js && node --check client.js && node --check rollup.js
```

## License

[MIT](LICENSE)
