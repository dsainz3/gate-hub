module.exports = [
  {
    "id": "lighting_sun_automations_tab",
    "type": "tab",
    "label": "Lighting Sun Automations",
    "disabled": false,
    "info": ""
  },
  {
    "id": "77ab4d2cb0a9108a",
    "type": "api-current-state",
    "z": "lighting_sun_automations_tab",
    "name": "Holiday mode off?",
    "server": "11e9f35b.61816d",
    "version": 3,
    "outputs": 2,
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
        "4db913453dfc0f5e"
      ],
      []
    ]
  },
  {
    "id": "e6c42d139e5a9a07",
    "type": "api-current-state",
    "z": "lighting_sun_automations_tab",
    "name": "Lighting hold not active?",
    "server": "11e9f35b.61816d",
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
        "d1469db108ac4177"
      ]
    ]
  },
  {
    "id": "2183573df54169fb",
    "type": "api-call-service",
    "z": "lighting_sun_automations_tab",
    "name": "Logbook sunrise interior",
    "server": "11e9f35b.61816d",
    "version": 7,
    "debugenabled": false,
    "action": "logbook.log",
    "floorId": [],
    "areaId": [],
    "deviceId": [],
    "entityId": [],
    "labelId": [],
    "data": "{\"entity_id\":\"automation.interior_lights_sunrise_off\",\"name\":\"Lighting Automation\",\"message\":\"Morning interior lights turned off after sunrise\"}",
    "dataType": "json",
    "mergeContext": "",
    "mustacheAltTags": false,
    "outputProperties": [],
    "queue": "none",
    "blockInputOverrides": false,
    "domain": "logbook",
    "service": "log",
    "x": 1740,
    "y": 300,
    "wires": [
      []
    ]
  },
  {
    "id": "d1469db108ac4177",
    "type": "api-call-service",
    "z": "lighting_sun_automations_tab",
    "name": "Apply morning exterior off",
    "server": "11e9f35b.61816d",
    "version": 7,
    "debugenabled": false,
    "action": "scene.turn_on",
    "floorId": [],
    "areaId": [],
    "deviceId": [],
    "entityId": [
      "scene.lighting_morning_exterior_off"
    ],
    "labelId": [],
    "data": "{\"transition\":10}",
    "dataType": "json",
    "mergeContext": "",
    "mustacheAltTags": false,
    "outputProperties": [],
    "queue": "none",
    "blockInputOverrides": false,
    "domain": "scene",
    "service": "turn_on",
    "x": 1450,
    "y": 400,
    "wires": [
      [
        "f65494b184049858"
      ]
    ]
  },
  {
    "id": "c6d4debf99c8172c",
    "type": "api-current-state",
    "z": "lighting_sun_automations_tab",
    "name": "Lighting hold not active?",
    "server": "11e9f35b.61816d",
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
        "d2baa70980d575b2"
      ]
    ]
  },
  {
    "id": "82c722a5e22496d0",
    "type": "api-call-service",
    "z": "lighting_sun_automations_tab",
    "name": "Logbook sunset interior",
    "server": "11e9f35b.61816d",
    "version": 7,
    "debugenabled": false,
    "action": "logbook.log",
    "floorId": [],
    "areaId": [],
    "deviceId": [],
    "entityId": [],
    "labelId": [],
    "data": "{\"entity_id\":\"automation.evening_lights_at_sunset\",\"name\":\"Lighting Automation\",\"message\":\"Evening interior sunset scene applied\"}",
    "dataType": "json",
    "mergeContext": "",
    "mustacheAltTags": false,
    "outputProperties": [],
    "queue": "none",
    "blockInputOverrides": false,
    "domain": "logbook",
    "service": "log",
    "x": 1430,
    "y": 80,
    "wires": [
      []
    ]
  },
  {
    "id": "04aeefe00685ce3b",
    "type": "server-state-changed",
    "z": "lighting_sun_automations_tab",
    "name": "Sunset below horizon",
    "server": "11e9f35b.61816d",
    "version": 6,
    "outputs": 1,
    "exposeAsEntityConfig": "",
    "entities": {
      "entity": [
        "sun.sun"
      ],
      "substring": [],
      "regex": []
    },
    "outputInitially": false,
    "stateType": "str",
    "ifState": "below_horizon",
    "ifStateType": "str",
    "ifStateOperator": "is_not",
    "outputOnlyOnStateChange": true,
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
        "6fecdf056cb01465"
      ]
    ]
  },
  {
    "id": "30e430ba7c2ccfbf",
    "type": "delay",
    "z": "lighting_sun_automations_tab",
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
    "outputs": 1,
    "x": 380,
    "y": 100,
    "wires": [
      [
        "77ab4d2cb0a9108a"
      ]
    ]
  },
  {
    "id": "2ed73c13fd182788",
    "type": "api-call-service",
    "z": "lighting_sun_automations_tab",
    "name": "Apply exterior sunset scene",
    "server": "11e9f35b.61816d",
    "version": 7,
    "debugenabled": false,
    "action": "scene.turn_on",
    "floorId": [],
    "areaId": [],
    "deviceId": [],
    "entityId": [
      "scene.lighting_evening_sunset_exterior"
    ],
    "labelId": [],
    "data": "{\"transition\":2}",
    "dataType": "json",
    "mergeContext": "",
    "mustacheAltTags": false,
    "outputProperties": [],
    "queue": "none",
    "blockInputOverrides": false,
    "domain": "scene",
    "service": "turn_on",
    "x": 1160,
    "y": 180,
    "wires": [
      [
        "0cda0820d10b07fc"
      ]
    ]
  },
  {
    "id": "941294cd6694be9a",
    "type": "api-current-state",
    "z": "lighting_sun_automations_tab",
    "name": "Lighting hold not active?",
    "server": "11e9f35b.61816d",
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
        "2ed73c13fd182788"
      ]
    ]
  },
  {
    "id": "f65494b184049858",
    "type": "api-call-service",
    "z": "lighting_sun_automations_tab",
    "name": "Logbook sunrise exterior",
    "server": "11e9f35b.61816d",
    "version": 7,
    "debugenabled": false,
    "action": "logbook.log",
    "floorId": [],
    "areaId": [],
    "deviceId": [],
    "entityId": [],
    "labelId": [],
    "data": "{\"entity_id\":\"automation.exterior_lights_sunrise_off\",\"name\":\"Lighting Automation\",\"message\":\"Morning exterior lights turned off after sunrise\"}",
    "dataType": "json",
    "mergeContext": "",
    "mustacheAltTags": false,
    "outputProperties": [],
    "queue": "none",
    "blockInputOverrides": false,
    "domain": "logbook",
    "service": "log",
    "x": 1720,
    "y": 400,
    "wires": [
      []
    ]
  },
  {
    "id": "7fc952e7dc90bca0",
    "type": "api-call-service",
    "z": "lighting_sun_automations_tab",
    "name": "Apply interior sunset scene",
    "server": "11e9f35b.61816d",
    "version": 7,
    "debugenabled": false,
    "action": "scene.turn_on",
    "floorId": [],
    "areaId": [],
    "deviceId": [],
    "entityId": [
      "scene.lighting_evening_sunset_interior"
    ],
    "labelId": [],
    "data": "{\"transition\":2}",
    "dataType": "json",
    "mergeContext": "",
    "mustacheAltTags": false,
    "outputProperties": [],
    "queue": "none",
    "blockInputOverrides": false,
    "domain": "scene",
    "service": "turn_on",
    "x": 1160,
    "y": 80,
    "wires": [
      [
        "82c722a5e22496d0"
      ]
    ]
  },
  {
    "id": "1035e456d06765f7",
    "type": "api-current-state",
    "z": "lighting_sun_automations_tab",
    "name": "Holiday mode off?",
    "server": "11e9f35b.61816d",
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
        "815c202ff4724c85"
      ]
    ]
  },
  {
    "id": "de8bfb057bf32025",
    "type": "server-state-changed",
    "z": "lighting_sun_automations_tab",
    "name": "Sunrise above horizon",
    "server": "11e9f35b.61816d",
    "version": 6,
    "outputs": 1,
    "exposeAsEntityConfig": "",
    "entities": {
      "entity": [
        "sun.sun"
      ],
      "substring": [],
      "regex": []
    },
    "outputInitially": false,
    "stateType": "str",
    "ifState": "above_horizon",
    "ifStateType": "str",
    "ifStateOperator": "is_not",
    "outputOnlyOnStateChange": true,
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
        "ecfa60bb8e41c32d"
      ]
    ]
  },
  {
    "id": "367763fb7878b665",
    "type": "api-current-state",
    "z": "lighting_sun_automations_tab",
    "name": "Light show off?",
    "server": "11e9f35b.61816d",
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
        "e6c42d139e5a9a07"
      ]
    ]
  },
  {
    "id": "2ed6bb06cfc879e7",
    "type": "delay",
    "z": "lighting_sun_automations_tab",
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
    "outputs": 1,
    "x": 390,
    "y": 320,
    "wires": [
      [
        "1035e456d06765f7"
      ]
    ]
  },
  {
    "id": "084fcedbd24aadb2",
    "type": "server-state-changed",
    "z": "lighting_sun_automations_tab",
    "name": "Sunset below horizon",
    "server": "11e9f35b.61816d",
    "version": 6,
    "outputs": 2,
    "exposeAsEntityConfig": "",
    "entities": {
      "entity": [
        "sun.sun"
      ],
      "substring": [],
      "regex": []
    },
    "outputInitially": false,
    "stateType": "str",
    "ifState": "below_horizon",
    "ifStateType": "str",
    "ifStateOperator": "is_not",
    "outputOnlyOnStateChange": true,
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
        "30e430ba7c2ccfbf"
      ],
      []
    ]
  },
  {
    "id": "ecfa60bb8e41c32d",
    "type": "delay",
    "z": "lighting_sun_automations_tab",
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
    "outputs": 1,
    "x": 380,
    "y": 420,
    "wires": [
      [
        "8da95b7dc3c5e7ce"
      ]
    ]
  },
  {
    "id": "d2baa70980d575b2",
    "type": "api-call-service",
    "z": "lighting_sun_automations_tab",
    "name": "Apply morning interior off",
    "server": "11e9f35b.61816d",
    "version": 7,
    "debugenabled": false,
    "action": "scene.turn_on",
    "floorId": [],
    "areaId": [],
    "deviceId": [],
    "entityId": [
      "scene.lighting_morning_interior_off"
    ],
    "labelId": [],
    "data": "{\"transition\":10}",
    "dataType": "json",
    "mergeContext": "",
    "mustacheAltTags": false,
    "outputProperties": [],
    "queue": "none",
    "blockInputOverrides": false,
    "domain": "scene",
    "service": "turn_on",
    "x": 1470,
    "y": 300,
    "wires": [
      [
        "2183573df54169fb"
      ]
    ]
  },
  {
    "id": "8da95b7dc3c5e7ce",
    "type": "api-current-state",
    "z": "lighting_sun_automations_tab",
    "name": "Holiday mode off?",
    "server": "11e9f35b.61816d",
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
        "367763fb7878b665"
      ]
    ]
  },
  {
    "id": "e31caf47c7fd1751",
    "type": "server-state-changed",
    "z": "lighting_sun_automations_tab",
    "name": "Sunrise above horizon",
    "server": "11e9f35b.61816d",
    "version": 6,
    "outputs": 1,
    "exposeAsEntityConfig": "",
    "entities": {
      "entity": [
        "sun.sun"
      ],
      "substring": [],
      "regex": []
    },
    "outputInitially": false,
    "stateType": "str",
    "ifState": "above_horizon",
    "ifStateType": "str",
    "ifStateOperator": "is_not",
    "outputOnlyOnStateChange": true,
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
        "2ed6bb06cfc879e7"
      ]
    ]
  },
  {
    "id": "815c202ff4724c85",
    "type": "api-current-state",
    "z": "lighting_sun_automations_tab",
    "name": "Light show off?",
    "server": "11e9f35b.61816d",
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
        "c6d4debf99c8172c"
      ]
    ]
  },
  {
    "id": "a07c24b27cac4c0e",
    "type": "api-current-state",
    "z": "lighting_sun_automations_tab",
    "name": "Holiday mode off?",
    "server": "11e9f35b.61816d",
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
        "941294cd6694be9a"
      ]
    ]
  },
  {
    "id": "4db913453dfc0f5e",
    "type": "api-current-state",
    "z": "lighting_sun_automations_tab",
    "name": "Lighting hold not active?",
    "server": "11e9f35b.61816d",
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
        "7fc952e7dc90bca0"
      ]
    ]
  },
  {
    "id": "6fecdf056cb01465",
    "type": "delay",
    "z": "lighting_sun_automations_tab",
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
    "outputs": 1,
    "x": 380,
    "y": 200,
    "wires": [
      [
        "a07c24b27cac4c0e"
      ]
    ]
  },
  {
    "id": "0cda0820d10b07fc",
    "type": "api-call-service",
    "z": "lighting_sun_automations_tab",
    "name": "Logbook sunset exterior",
    "server": "11e9f35b.61816d",
    "version": 7,
    "debugenabled": false,
    "action": "logbook.log",
    "floorId": [],
    "areaId": [],
    "deviceId": [],
    "entityId": [],
    "labelId": [],
    "data": "{\"entity_id\":\"automation.exterior_front_garage_on_sunset\",\"name\":\"Lighting Automation\",\"message\":\"Evening exterior sunset scene applied\"}",
    "dataType": "json",
    "mergeContext": "",
    "mustacheAltTags": false,
    "outputProperties": [],
    "queue": "none",
    "blockInputOverrides": false,
    "domain": "logbook",
    "service": "log",
    "x": 1430,
    "y": 180,
    "wires": [
      []
    ]
  }
]
