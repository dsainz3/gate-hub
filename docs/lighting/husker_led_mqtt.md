# Husker LED – MQTT Controls (Permanent Outdoor Segments)

This package adds two scripts:
- **Start Husker LED Effect** – sets a scarlet & cream theme via MQTT.
- **Stop Husker LED Effect (Revert to Monthly)** – turns on and triggers your "Exterior LED - Monthly Effect" automation.

## Prereqs
- Home Assistant in YAML mode (packages enabled), MQTT configured and working.
- Your outdoor LED segments are controllable via MQTT.

## Install (Step by Step)
1. **Enable packages** (if not already):
   ```yaml
   # configuration.yaml
   homeassistant:
     packages: !include_dir_merge_named packages
