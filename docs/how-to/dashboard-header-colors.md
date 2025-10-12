# Adjusting Header Colors per Dashboard View

This guide captures the takeaways from the community thread on changing the
Lovelace header background and adapts them for the Support · Test Resources
dashboard. The approach keeps the base theme intact while letting each view
opt into its own header color palette.

## 1. Extend the Theme with Header Tokens

Define CSS custom properties for every header variant in the theme package. The
`Support Test Gold` theme now exposes the following tokens for both light and
dark modes:

- `--support-test-header-test-bench-bg`
- `--support-test-header-test-bench-fg`
- `--support-test-header-plex-bg`
- `--support-test-header-plex-fg`

Update the `packages/support_test_theme.yaml` package so those variables track
the desired brand colors. Each view can reuse the same foreground token for
icons and button labels so the toolbar always stays readable.【F:packages/support_test_theme.yaml†L37-L54】【F:packages/support_test_theme.yaml†L90-L107】

## 2. Opt Views into the Tokens with `card_mod`

Apply `card_mod` at the view level to set the header colors by referencing the
new tokens. Because `card_mod` runs inside the view context, the overrides only
apply while that view is active and fall back to the base theme elsewhere. The
pattern below updates the background, title text, icon, and action button
colors in one block:

```yaml
card_mod:
  style: |
    :host {
      --app-header-background-color: var(--support-test-header-test-bench-bg,
        var(--app-header-background-color));
      --app-header-text-color: var(--support-test-header-test-bench-fg,
        var(--app-header-text-color));
      --app-header-button-text-color: var(--support-test-header-test-bench-fg,
        var(--app-header-button-text-color));
      --app-header-icon-color: var(--support-test-header-test-bench-fg,
        var(--app-header-icon-color));
    }
```

The Support · Test Resources dashboard demonstrates the technique on the
“Test Bench” and “Plex · Theater” views so you can reuse the snippet for new
views or adapt it to other themes.【F:dashboards/_support/test_resources.dashboard.yaml†L8-L21】【F:dashboards/_support/test_resources.dashboard.yaml†L142-L155】

## 3. Customize per Environment

When you need an alternate palette (for example, a staging environment), copy
the theme tokens into a variant theme or load them from package secrets. The
views continue to reference the same CSS variables, so swapping the active
theme immediately updates the toolbar colors without modifying the dashboard
YAML again.

With this process you can confidently tailor each view’s header while keeping
all other theme and layout choices untouched.
