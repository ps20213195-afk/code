# Skybase website extensions

Extensions are add-ons for this website. They are listed in `index.json`, shown in the **Extensions** catalog, and get their own navigation tab after installation. Installed extensions and their saved checkbox state are local to the current browser.

## Add an extension

1. Create a file in this folder with a filename ending in `.extensionformywebsite`, for example `my-widget.extensionformywebsite`.
2. Add it to the `extensions` array in `index.json` using just the filename.
3. Serve the site over HTTP/HTTPS, open the **Extensions** tab, then install it. (Fetching extension files does not work reliably when opening `index.html` directly with `file://`.)

Example file structure:

```text
!@TYPE: WIN;
!@NAME: My Widget;
&&START1&&;
<div class="my-widget">
  <h2>Hello!</h2>
  <p>This is my first website extension.</p>
</div>
&&END1&&;
```

## File format

- `!@TYPE:` is required. Accepted labels are `WIN`, `COL`, `PAR`, `CSS`, and `THEME`. The first four render in the extension's own page; `THEME` uses the custom theme format below.
- `!@NAME:` is the human-readable name shown in the catalog and navigation.
- Put each content block between a matching `&&START<number>&&;` and `&&END<number>&&;` pair. Numbers must match, and each block number should be unique in a file. A file needs at least one complete block.
- Blocks contain HTML. Add CSS in a `<style>...</style>` element inside a block. Selectors are automatically scoped beneath that extension's content, so use your own class names (for example `.my-widget h2`). Keep CSS rules simple and avoid `@import`, external URLs, and global selectors.
- JavaScript inside `<script>` elements is supported. The installer asks for explicit confirmation before allowing an extension's scripts to run, including if a later update adds scripts. Scripts run with the page's privileges and can read or change anything available to the website, including signed-in account data. Only install scripts you wrote or fully trust. Installing is at your own risk; uninstalling cannot undo actions a script has already taken. Inline event attributes are still removed, and forms/embedded frames are not supported.
- Native checkboxes can save their checked state in this browser by adding a unique `data-extension-persist` value, for example:

```html
<label>
  <input type="checkbox" data-extension-persist="finished-task">
  Mark this task complete
</label>
```

Each persistence value must be unique within its extension. The website stores it locally; no account data is sent to the server.

## Catalog index

`index.json` is a JSON object with an `extensions` array of filenames:

```json
{
  "extensions": [
    "my-widget.extensionformywebsite"
  ]
}
```

The sample `example.extensionformywebsite` is a complete focus checklist demonstrating metadata, an HTML content block, scoped CSS, and persistent checkboxes.

## Theme extensions

Set `!@TYPE: THEME;` to create a site-wide theme. Theme blocks use the literal `^/\^` start marker and `v\/v` end marker instead of `&&START...&&;` / `&&END...&&;`. Inside the block, put one supported token on a line, then CSS-style `property: value;` declarations on the following lines. No `#id` or `.class` selectors are needed; the token selects the target.

```text
!@TYPE: THEME;
!@NAME: My Theme;
^/\^
^theme
color-scheme: dark;
^colorset
--color-page: #17212b;
--color-text: #f4f8fa;
--color-heading: #8ed0e8;
^body
background: var(--color-page);
color: var(--color-text);
v\/v
```

Supported tokens are `^theme` and `^colorset` (both target the root theme variables), `^body`, `^panel`, `^header`, `^button`, `^text`, `^heading`, `^tab`, and `^input`. Theme declarations are parsed and limited to these targets; external URLs and executable CSS are rejected. Install the theme, open its navigation tab, and select **Apply theme**. The active theme is saved locally and restored on reload. Uninstalling the active theme removes its styling.

`aurora-theme.extensionformywebsite` is a complete theme example.
