# Remove trailing spaces from secrets.yaml
(Get-Content secrets.yaml) | ForEach-Object { $_ -replace '\s+

### 3. Alternative: Update yamllint config

If you prefer to keep your current comment style, you can relax yamllint rules by creating `.yamllint.yml`:

```yaml
# .yamllint.yml
extends: default
rules:
  comments:
    min-spaces-from-content: 1  # Allow 1 space instead of 2
  line-length:
    max: 120  # Reasonable line length for HA configs
  truthy:
    allowed-values: ['true', 'false', 'on', 'off']  # HA uses on/off
