# Installation

[中文](安装说明.md) · [English](INSTALL.md)

## Option 1: Install from source / development (recommended)

```sh
git clone https://github.com/yingguan-Cloud/dsh-usage-heatmap.git
cd dsh-usage-heatmap
pnpm install
```

> `client.js` ships pre-built, so no `pnpm build` is needed. If a build step is added later, insert `pnpm build` here.

Then add to the `dependencies` of `~/.dsh/profiles/<your profile>/package.json`:

```json
"dsh-usage-heatmap": "link:/absolute/path/dsh-usage-heatmap"
```

And append the mount row to `~/.dsh/profiles/<your profile>/cordis.patch.yml`:

```yaml
- insert:
    - id: usage-heatmap
      name: 'dsh-usage-heatmap'
      config: {}
```

Finally, in the profile directory:

```sh
cd ~/.dsh/profiles/<your profile>
pnpm install
```

Restart DSH and hard-refresh (Cmd/Ctrl+Shift+R). A green grid icon appears in the left sidebar — click it to open Usage Heatmap.

If you hit `Ignored build scripts`, run first:

```sh
cd ~/.dsh/profiles/<your profile>
pnpm approve-builds --all
pnpm install
```

## Option 2: Install from tarball (when a release is available)

Grab `dsh-usage-heatmap-1.0.0.tgz` from [Releases](../../releases), then:

```sh
dsh plugin --profile <your profile> add /absolute/path/dsh-usage-heatmap-1.0.0.tgz
```

> If your DSH provides the `plugin_manager` tool, you can also say in a conversation: `Install with plugin_manager install_bundle: <absolute path to the .tgz>`.

## Updates

For a source install:

```sh
cd dsh-usage-heatmap
git pull
pnpm install

cd ~/.dsh/profiles/<your profile>
pnpm install
```

Restart DSH and hard-refresh (Cmd/Ctrl+Shift+R) to apply.
