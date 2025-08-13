# CI Overview

## What runs
- (Recommended) Home Assistant config validation
- (Optional) Markdown link checks, release notes

## Required checkout
```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0
```
