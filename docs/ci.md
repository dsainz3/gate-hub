# CI Overview

## What runs
- **Checkout with submodules** (required for `external/haos`)
- (Recommended) Home Assistant config validation
- (Optional) Markdown link checks, release notes

## Required checkout
```yaml
- name: Checkout with submodules
  uses: actions/checkout@v4
  with:
    submodules: true
    fetch-depth: 0
