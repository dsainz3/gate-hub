/**
 * Node-RED flows for sun-triggered lighting automations migrated from automations.yaml.
 * After importing, point all nodes at the appropriate Home Assistant server config.
 */
module.exports = [
  {
    "id": "7f3ce8bf4c90cc0b",
    "type": "tab",
    "label": "Lighting Sun Automations",
    "disabled": false,
    "info": ""
  },
  {
    "id": "b8999f76b480f63f",
    "type": "server-state-changed",
    "z": "7f3ce8bf4c90cc0b",
    "name": "Sunset below horizon",
    "server": "",
    "version": 4,
    "exposeToHomeAssistant": false,
    "haConfig": [
      {
        "property": "name",
        "value": ""
      },
      {
        "property": "icon",
        "value": ""
      }
    ],
    "entityidfilter": "sun.sun",
    "entityidfiltertype": "exact",
    "outputinitially": false,
    "state_type": "str",
    "haltifstate": "below_horizon",
    "halt_if_type": "str",
    "halt_if_compare": "is_not",
    "outputs": 1,
    "output_only_on_state_change": true,
    "for": "0",
    "forType": "num",
    "forUnits": "minutes",
    "ignorePrevStateNull": true,
    "ignorePrevStateUnknown": true,
    "ignorePrevStateUnavailable": true,
    "ignoreCurrentStateUnknown": true,
    "ignoreCurrentStateUnavailable": true,
    "outputProperties": [],
    "x": 170,
    "y": 100,
    "wires": [
      [
        "4ec478c379d2f22a"
      ]
    ]
  },
  {
    "id": "4ec478c379d2f22a",
    "type": "delay",
    "z": "7f3ce8bf4c90cc0b",
    "name": "Offset +5 min",
    "pauseType": "delay",
    "timeout": "5",
    "timeoutUnits": "minutes",
    "rate": "1",
    "nbRateUnits": "1",
    "rateUnits": "second",
    "randomFirst": "1",
    "randomLast": "1",
    "randomUnits": "seconds",
    "drop": false,
    "x": 380,
    "y": 100,
    "wires": [
      [
        "44a6d49f3baac826"
      ]
    ]
  },
  {
    "id": "44a6d49f3baac826",
    "type": "api-current-state",
    "z": "7f3ce8bf4c90cc0b",
    "name": "Holiday mode off?",
    "server": "",
    "version": 3,
    "outputs": 1,
    "halt_if": "on",
    "halt_if_type": "str",
    "halt_if_compare": "is",
    "entity_id": "binary_sensor.holiday_mode_active",
    "state_type": "str",
    "blockInputOverrides": false,
    "outputProperties": [],
    "for": "0",
    "forType": "num",
    "forUnits": "minutes",
    "override_topic": false,
    "state_location": "payload",
    "override_payload": "msg",
    "entity_location": "data",
    "override_data": "msg",
    "x": 610,
    "y": 80,
    "wires": [
      [
        "1d65dfb43f6ac9fb"
      ]
    ]
  },
  {
    "id": "1d65dfb43f6ac9fb",
    "type": "api-current-state",
    "z": "7f3ce8bf4c90cc0b",
    "name": "Lighting hold not active?",
    "server": "",
    "version": 3,
    "outputs": 1,
    "halt_if": "on",
    "halt_if_type": "str",
    "halt_if_compare": "is",
    "entity_id": "binary_sensor.huskers_lighting_hold",
    "state_type": "str",
    "blockInputOverrides": false,
    "outputProperties": [],
    "for": "0",
    "forType": "num",
    "forUnits": "minutes",
    "override_topic": false,
    "state_location": "payload",
    "override_payload": "msg",
    "entity_location": "data",
    "override_data": "msg",
    "x": 870,
    "y": 80,
    "wires": [
      [
        "d0b2e0c68c3b971f"
      ]
    ]
  },
  {
    "id": "d0b2e0c68c3b971f",
    "type": "api-call-service",
    "z": "7f3ce8bf4c90cc0b",
    "name": "Apply interior sunset scene",
    "server": "",
    "version": 5,
    "debugenabled": false,
    "domain": "scene",
    "service": "turn_on",
    "areaId": [],
    "deviceId": [],
    "entityId": [
      "scene.lighting_evening_sunset_interior"
    ],
    "data": "{\"transition\":2}",
    "dataType": "json",
    "mergeContext": "",
    "mustacheAltTags": false,
    "outputProperties": [],
    "queue": "none",
    "x": 1160,
    "y": 80,
    "wires": [
      [
        "bb33dc04dfdcc245"
      ]
    ]
  },
  {
    "id": "bb33dc04dfdcc245",
    "type": "api-call-service",
    "z": "7f3ce8bf4c90cc0b",
    "name": "Logbook sunset interior",
    "server": "",
    "version": 5,
    "debugenabled": false,
    "domain": "logbook",
    "service": "log",
    "areaId": [],
    "deviceId": [],
    "entityId": [],
    "data": "{\"entity_id\":\"automation.evening_lights_at_sunset\",\"name\":\"Lighting Automation\",\"message\":\"Evening interior sunset scene applied\"}",
    "dataType": "json",
    "mergeContext": "",
    "mustacheAltTags": false,
    "outputProperties": [],
    "queue": "none",
    "x": 1430,
    "y": 80,
    "wires": [
      []
    ]
  },
  {
    "id": "6cf5b95faacb893d",
    "type": "server-state-changed",
    "z": "7f3ce8bf4c90cc0b",
    "name": "Sunset below horizon",
    "server": "",
    "version": 4,
    "exposeToHomeAssistant": false,
    "haConfig": [
      {
        "property": "name",
        "value": ""
      },
      {
        "property": "icon",
        "value": ""
      }
    ],
    "entityidfilter": "sun.sun",
    "entityidfiltertype": "exact",
    "outputinitially": false,
    "state_type": "str",
    "haltifstate": "below_horizon",
    "halt_if_type": "str",
    "halt_if_compare": "is_not",
    "outputs": 1,
    "output_only_on_state_change": true,
    "for": "0",
    "forType": "num",
    "forUnits": "minutes",
    "ignorePrevStateNull": true,
    "ignorePrevStateUnknown": true,
    "ignorePrevStateUnavailable": true,
    "ignoreCurrentStateUnknown": true,
    "ignoreCurrentStateUnavailable": true,
    "outputProperties": [],
    "x": 170,
    "y": 200,
    "wires": [
      [
        "1ab234dcc18c68b9"
      ]
    ]
  },
  {
    "id": "1ab234dcc18c68b9",
    "type": "delay",
    "z": "7f3ce8bf4c90cc0b",
    "name": "Offset +5 min",
    "pauseType": "delay",
    "timeout": "5",
    "timeoutUnits": "minutes",
    "rate": "1",
    "nbRateUnits": "1",
    "rateUnits": "second",
    "randomFirst": "1",
    "randomLast": "1",
    "randomUnits": "seconds",
    "drop": false,
    "x": 380,
    "y": 200,
    "wires": [
      [
        "f6bbdce98698a5b1"
      ]
    ]
  },
  {
    "id": "f6bbdce98698a5b1",
    "type": "api-current-state",
    "z": "7f3ce8bf4c90cc0b",
    "name": "Holiday mode off?",
    "server": "",
    "version": 3,
    "outputs": 1,
    "halt_if": "on",
    "halt_if_type": "str",
    "halt_if_compare": "is",
    "entity_id": "binary_sensor.holiday_mode_active",
    "state_type": "str",
    "blockInputOverrides": false,
    "outputProperties": [],
    "for": "0",
    "forType": "num",
    "forUnits": "minutes",
    "override_topic": false,
    "state_location": "payload",
    "override_payload": "msg",
    "entity_location": "data",
    "override_data": "msg",
    "x": 610,
    "y": 180,
    "wires": [
      [
        "2cf0501a9975227b"
      ]
    ]
  },
  {
    "id": "2cf0501a9975227b",
    "type": "api-current-state",
    "z": "7f3ce8bf4c90cc0b",
    "name": "Lighting hold not active?",
    "server": "",
    "version": 3,
    "outputs": 1,
    "halt_if": "on",
    "halt_if_type": "str",
    "halt_if_compare": "is",
    "entity_id": "binary_sensor.huskers_lighting_hold",
    "state_type": "str",
    "blockInputOverrides": false,
    "outputProperties": [],
    "for": "0",
    "forType": "num",
    "forUnits": "minutes",
    "override_topic": false,
    "state_location": "payload",
    "override_payload": "msg",
    "entity_location": "data",
    "override_data": "msg",
    "x": 870,
    "y": 180,
    "wires": [
      [
        "e8d2f3f3a5fcded3"
      ]
    ]
  },
  {
    "id": "e8d2f3f3a5fcded3",
    "type": "api-call-service",
    "z": "7f3ce8bf4c90cc0b",
    "name": "Apply exterior sunset scene",
    "server": "",
    "version": 5,
    "debugenabled": false,
    "domain": "scene",
    "service": "turn_on",
    "areaId": [],
    "deviceId": [],
    "entityId": [
      "scene.lighting_evening_sunset_exterior"
    ],
    "data": "{\"transition\":2}",
    "dataType": "json",
    "mergeContext": "",
    "mustacheAltTags": false,
    "outputProperties": [],
    "queue": "none",
    "x": 1160,
    "y": 180,
    "wires": [
      [
        "67c0bf108368fd66"
      ]
    ]
  },
  {
    "id": "67c0bf108368fd66",
    "type": "api-call-service",
    "z": "7f3ce8bf4c90cc0b",
    "name": "Logbook sunset exterior",
    "server": "",
    "version": 5,
    "debugenabled": false,
    "domain": "logbook",
    "service": "log",
    "areaId": [],
    "deviceId": [],
    "entityId": [],
    "data": "{\"entity_id\":\"automation.exterior_front_garage_on_sunset\",\"name\":\"Lighting Automation\",\"message\":\"Evening exterior sunset scene applied\"}",
    "dataType": "json",
    "mergeContext": "",
    "mustacheAltTags": false,
    "outputProperties": [],
    "queue": "none",
    "x": 1430,
    "y": 180,
    "wires": [
      []
    ]
  },
  {
    "id": "5bde83db0d40c1ee",
    "type": "server-state-changed",
    "z": "7f3ce8bf4c90cc0b",
    "name": "Sunrise above horizon",
    "server": "",
    "version": 4,
    "exposeToHomeAssistant": false,
    "haConfig": [
      {
        "property": "name",
        "value": ""
      },
      {
        "property": "icon",
        "value": ""
      }
    ],
    "entityidfilter": "sun.sun",
    "entityidfiltertype": "exact",
    "outputinitially": false,
    "state_type": "str",
    "haltifstate": "above_horizon",
    "halt_if_type": "str",
    "halt_if_compare": "is_not",
    "outputs": 1,
    "output_only_on_state_change": true,
    "for": "0",
    "forType": "num",
    "forUnits": "minutes",
    "ignorePrevStateNull": true,
    "ignorePrevStateUnknown": true,
    "ignorePrevStateUnavailable": true,
    "ignoreCurrentStateUnknown": true,
    "ignoreCurrentStateUnavailable": true,
    "outputProperties": [],
    "x": 170,
    "y": 320,
    "wires": [
      [
        "1c8464f425857b35"
      ]
    ]
  },
  {
    "id": "1c8464f425857b35",
    "type": "delay",
    "z": "7f3ce8bf4c90cc0b",
    "name": "Offset +15 min",
    "pauseType": "delay",
    "timeout": "15",
    "timeoutUnits": "minutes",
    "rate": "1",
    "nbRateUnits": "1",
    "rateUnits": "second",
    "randomFirst": "1",
    "randomLast": "1",
    "randomUnits": "seconds",
    "drop": false,
    "x": 390,
    "y": 320,
    "wires": [
      [
        "0f21fd581aba815c"
      ]
    ]
  },
  {
    "id": "0f21fd581aba815c",
    "type": "api-current-state",
    "z": "7f3ce8bf4c90cc0b",
    "name": "Holiday mode off?",
    "server": "",
    "version": 3,
    "outputs": 1,
    "halt_if": "on",
    "halt_if_type": "str",
    "halt_if_compare": "is",
    "entity_id": "binary_sensor.holiday_mode_active",
    "state_type": "str",
    "blockInputOverrides": false,
    "outputProperties": [],
    "for": "0",
    "forType": "num",
    "forUnits": "minutes",
    "override_topic": false,
    "state_location": "payload",
    "override_payload": "msg",
    "entity_location": "data",
    "override_data": "msg",
    "x": 620,
    "y": 300,
    "wires": [
      [
        "392ef7a648fdc3ef"
      ]
    ]
  },
  {
    "id": "392ef7a648fdc3ef",
    "type": "api-current-state",
    "z": "7f3ce8bf4c90cc0b",
    "name": "Light show off?",
    "server": "",
    "version": 3,
    "outputs": 1,
    "halt_if": "off",
    "halt_if_type": "str",
    "halt_if_compare": "is_not",
    "entity_id": "binary_sensor.huskers_light_show_active",
    "state_type": "str",
    "blockInputOverrides": false,
    "outputProperties": [],
    "for": "0",
    "forType": "num",
    "forUnits": "minutes",
    "override_topic": false,
    "state_location": "payload",
    "override_payload": "msg",
    "entity_location": "data",
    "override_data": "msg",
    "x": 890,
    "y": 300,
    "wires": [
      [
        "027b05659f4a1c42"
      ]
    ]
  },
  {
    "id": "027b05659f4a1c42",
    "type": "api-current-state",
    "z": "7f3ce8bf4c90cc0b",
    "name": "Lighting hold not active?",
    "server": "",
    "version": 3,
    "outputs": 1,
    "halt_if": "on",
    "halt_if_type": "str",
    "halt_if_compare": "is",
    "entity_id": "binary_sensor.huskers_lighting_hold",
    "state_type": "str",
    "blockInputOverrides": false,
    "outputProperties": [],
    "for": "0",
    "forType": "num",
    "forUnits": "minutes",
    "override_topic": false,
    "state_location": "payload",
    "override_payload": "msg",
    "entity_location": "data",
    "override_data": "msg",
    "x": 1170,
    "y": 300,
    "wires": [
      [
        "9d5b0032bca4d62c"
      ]
    ]
  },
  {
    "id": "9d5b0032bca4d62c",
    "type": "api-call-service",
    "z": "7f3ce8bf4c90cc0b",
    "name": "Apply morning interior off",
    "server": "",
    "version": 5,
    "debugenabled": false,
    "domain": "scene",
    "service": "turn_on",
    "areaId": [],
    "deviceId": [],
    "entityId": [
      "scene.lighting_morning_interior_off"
    ],
    "data": "{\"transition\":10}",
    "dataType": "json",
    "mergeContext": "",
    "mustacheAltTags": false,
    "outputProperties": [],
    "queue": "none",
    "x": 1470,
    "y": 300,
    "wires": [
      [
        "c83f320add963c3c"
      ]
    ]
  },
  {
    "id": "c83f320add963c3c",
    "type": "api-call-service",
    "z": "7f3ce8bf4c90cc0b",
    "name": "Logbook sunrise interior",
    "server": "",
    "version": 5,
    "debugenabled": false,
    "domain": "logbook",
    "service": "log",
    "areaId": [],
    "deviceId": [],
    "entityId": [],
    "data": "{\"entity_id\":\"automation.interior_lights_sunrise_off\",\"name\":\"Lighting Automation\",\"message\":\"Morning interior lights turned off after sunrise\"}",
    "dataType": "json",
    "mergeContext": "",
    "mustacheAltTags": false,
    "outputProperties": [],
    "queue": "none",
    "x": 1740,
    "y": 300,
    "wires": [
      []
    ]
  },
  {
    "id": "b12a63f859d39b3b",
    "type": "server-state-changed",
    "z": "7f3ce8bf4c90cc0b",
    "name": "Sunrise above horizon",
    "server": "",
    "version": 4,
    "exposeToHomeAssistant": false,
    "haConfig": [
      {
        "property": "name",
        "value": ""
      },
      {
        "property": "icon",
        "value": ""
      }
    ],
    "entityidfilter": "sun.sun",
    "entityidfiltertype": "exact",
    "outputinitially": false,
    "state_type": "str",
    "haltifstate": "above_horizon",
    "halt_if_type": "str",
    "halt_if_compare": "is_not",
    "outputs": 1,
    "output_only_on_state_change": true,
    "for": "0",
    "forType": "num",
    "forUnits": "minutes",
    "ignorePrevStateNull": true,
    "ignorePrevStateUnknown": true,
    "ignorePrevStateUnavailable": true,
    "ignoreCurrentStateUnknown": true,
    "ignoreCurrentStateUnavailable": true,
    "outputProperties": [],
    "x": 170,
    "y": 420,
    "wires": [
      [
        "ad45d6132cf7c2e1"
      ]
    ]
  },
  {
    "id": "ad45d6132cf7c2e1",
    "type": "delay",
    "z": "7f3ce8bf4c90cc0b",
    "name": "Offset +5 min",
    "pauseType": "delay",
    "timeout": "5",
    "timeoutUnits": "minutes",
    "rate": "1",
    "nbRateUnits": "1",
    "rateUnits": "second",
    "randomFirst": "1",
    "randomLast": "1",
    "randomUnits": "seconds",
    "drop": false,
    "x": 380,
    "y": 420,
    "wires": [
      [
        "6d7a47d3a4b6ee8e"
      ]
    ]
  },
  {
    "id": "6d7a47d3a4b6ee8e",
    "type": "api-current-state",
    "z": "7f3ce8bf4c90cc0b",
    "name": "Holiday mode off?",
    "server": "",
    "version": 3,
    "outputs": 1,
    "halt_if": "on",
    "halt_if_type": "str",
    "halt_if_compare": "is",
    "entity_id": "binary_sensor.holiday_mode_active",
    "state_type": "str",
    "blockInputOverrides": false,
    "outputProperties": [],
    "for": "0",
    "forType": "num",
    "forUnits": "minutes",
    "override_topic": false,
    "state_location": "payload",
    "override_payload": "msg",
    "entity_location": "data",
    "override_data": "msg",
    "x": 610,
    "y": 400,
    "wires": [
      [
        "285625658de9c738"
      ]
    ]
  },
  {
    "id": "285625658de9c738",
    "type": "api-current-state",
    "z": "7f3ce8bf4c90cc0b",
    "name": "Light show off?",
    "server": "",
    "version": 3,
    "outputs": 1,
    "halt_if": "off",
    "halt_if_type": "str",
    "halt_if_compare": "is_not",
    "entity_id": "binary_sensor.huskers_light_show_active",
    "state_type": "str",
    "blockInputOverrides": false,
    "outputProperties": [],
    "for": "0",
    "forType": "num",
    "forUnits": "minutes",
    "override_topic": false,
    "state_location": "payload",
    "override_payload": "msg",
    "entity_location": "data",
    "override_data": "msg",
    "x": 880,
    "y": 400,
    "wires": [
      [
        "fd5bd8ab4e52602a"
      ]
    ]
  },
  {
    "id": "fd5bd8ab4e52602a",
    "type": "api-current-state",
    "z": "7f3ce8bf4c90cc0b",
    "name": "Lighting hold not active?",
    "server": "",
    "version": 3,
    "outputs": 1,
    "halt_if": "on",
    "halt_if_type": "str",
    "halt_if_compare": "is",
    "entity_id": "binary_sensor.huskers_lighting_hold",
    "state_type": "str",
    "blockInputOverrides": false,
    "outputProperties": [],
    "for": "0",
    "forType": "num",
    "forUnits": "minutes",
    "override_topic": false,
    "state_location": "payload",
    "override_payload": "msg",
    "entity_location": "data",
    "override_data": "msg",
    "x": 1160,
    "y": 400,
    "wires": [
      [
        "2d9e91ac1b5ec345"
      ]
    ]
  },
  {
    "id": "2d9e91ac1b5ec345",
    "type": "api-call-service",
    "z": "7f3ce8bf4c90cc0b",
    "name": "Apply morning exterior off",
    "server": "",
    "version": 5,
    "debugenabled": false,
    "domain": "scene",
    "service": "turn_on",
    "areaId": [],
    "deviceId": [],
    "entityId": [
      "scene.lighting_morning_exterior_off"
    ],
    "data": "{\"transition\":10}",
    "dataType": "json",
    "mergeContext": "",
    "mustacheAltTags": false,
    "outputProperties": [],
    "queue": "none",
    "x": 1450,
    "y": 400,
    "wires": [
      [
        "c3b0689c8d185f6f"
      ]
    ]
  },
  {
    "id": "c3b0689c8d185f6f",
    "type": "api-call-service",
    "z": "7f3ce8bf4c90cc0b",
    "name": "Logbook sunrise exterior",
    "server": "",
    "version": 5,
    "debugenabled": false,
    "domain": "logbook",
    "service": "log",
    "areaId": [],
    "deviceId": [],
    "entityId": [],
    "data": "{\"entity_id\":\"automation.exterior_lights_sunrise_off\",\"name\":\"Lighting Automation\",\"message\":\"Morning exterior lights turned off after sunrise\"}",
    "dataType": "json",
    "mergeContext": "",
    "mustacheAltTags": false,
    "outputProperties": [],
    "queue": "none",
    "x": 1720,
    "y": 400,
    "wires": [
      []
    ]
  }
];
