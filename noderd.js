[
  {
    "id": "c3cbb19136a3e4ea",
    "type": "tab",
    "label": "Lighting Sun Automations",
    "disabled": false,
    "info": ""
  },
  {
    "id": "084fcedbd24aadb2",
    "type": "server-state-changed",
    "z": "c3cbb19136a3e4ea",
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
    "id": "30e430ba7c2ccfbf",
    "type": "delay",
    "z": "c3cbb19136a3e4ea",
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
    "id": "77ab4d2cb0a9108a",
    "type": "api-current-state",
    "z": "c3cbb19136a3e4ea",
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
    "id": "4db913453dfc0f5e",
    "type": "api-current-state",
    "z": "c3cbb19136a3e4ea",
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
    "id": "7fc952e7dc90bca0",
    "type": "api-call-service",
    "z": "c3cbb19136a3e4ea",
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
    "id": "82c722a5e22496d0",
    "type": "api-call-service",
    "z": "c3cbb19136a3e4ea",
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
    "z": "c3cbb19136a3e4ea",
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
    "id": "6fecdf056cb01465",
    "type": "delay",
    "z": "c3cbb19136a3e4ea",
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
    "id": "a07c24b27cac4c0e",
    "type": "api-current-state",
    "z": "c3cbb19136a3e4ea",
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
    "id": "941294cd6694be9a",
    "type": "api-current-state",
    "z": "c3cbb19136a3e4ea",
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
    "id": "2ed73c13fd182788",
    "type": "api-call-service",
    "z": "c3cbb19136a3e4ea",
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
    "id": "0cda0820d10b07fc",
    "type": "api-call-service",
    "z": "c3cbb19136a3e4ea",
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
  },
  {
    "id": "e31caf47c7fd1751",
    "type": "server-state-changed",
    "z": "c3cbb19136a3e4ea",
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
    "id": "2ed6bb06cfc879e7",
    "type": "delay",
    "z": "c3cbb19136a3e4ea",
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
    "id": "1035e456d06765f7",
    "type": "api-current-state",
    "z": "c3cbb19136a3e4ea",
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
    "id": "815c202ff4724c85",
    "type": "api-current-state",
    "z": "c3cbb19136a3e4ea",
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
    "id": "c6d4debf99c8172c",
    "type": "api-current-state",
    "z": "c3cbb19136a3e4ea",
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
    "id": "d2baa70980d575b2",
    "type": "api-call-service",
    "z": "c3cbb19136a3e4ea",
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
    "id": "2183573df54169fb",
    "type": "api-call-service",
    "z": "c3cbb19136a3e4ea",
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
    "id": "de8bfb057bf32025",
    "type": "server-state-changed",
    "z": "c3cbb19136a3e4ea",
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
    "id": "ecfa60bb8e41c32d",
    "type": "delay",
    "z": "c3cbb19136a3e4ea",
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
    "id": "8da95b7dc3c5e7ce",
    "type": "api-current-state",
    "z": "c3cbb19136a3e4ea",
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
    "id": "367763fb7878b665",
    "type": "api-current-state",
    "z": "c3cbb19136a3e4ea",
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
    "id": "e6c42d139e5a9a07",
    "type": "api-current-state",
    "z": "c3cbb19136a3e4ea",
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
    "id": "d1469db108ac4177",
    "type": "api-call-service",
    "z": "c3cbb19136a3e4ea",
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
    "id": "f65494b184049858",
    "type": "api-call-service",
    "z": "c3cbb19136a3e4ea",
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
    "id": "6493c5bc960cb82a",
    "type": "server-state-changed",
    "z": "c3cbb19136a3e4ea",
    "name": "Cloud coverage change",
    "server": "11e9f35b.61816d",
    "version": 6,
    "outputs": 1,
    "exposeAsEntityConfig": "",
    "entities": {
      "entity": [
        "sensor.openweathermap_cloud_coverage"
      ],
      "substring": [],
      "regex": []
    },
    "outputInitially": false,
    "stateType": "str",
    "ifState": "",
    "ifStateType": "str",
    "ifStateOperator": "is",
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
    "x": 160,
    "y": 520,
    "wires": [
      [
        "7cc5c68126e87d71"
      ]
    ]
  },
  {
    "id": "dd5476d6e0e0c4a2",
    "type": "inject",
    "z": "c3cbb19136a3e4ea",
    "name": "Periodic check",
    "props": [
      {
        "p": "payload"
      }
    ],
    "repeat": "",
    "crontab": "*/5 * * * *",
    "once": true,
    "onceDelay": 10,
    "topic": "",
    "payload": "",
    "payloadType": "date",
    "x": 160,
    "y": 620,
    "wires": [
      [
        "7cc5c68126e87d71"
      ]
    ]
  },
  {
    "id": "7cc5c68126e87d71",
    "type": "api-current-state",
    "z": "c3cbb19136a3e4ea",
    "name": "Cloud coverage state",
    "server": "11e9f35b.61816d",
    "version": 3,
    "outputs": 1,
    "halt_if": "",
    "halt_if_type": "str",
    "halt_if_compare": "is",
    "entity_id": "sensor.openweathermap_cloud_coverage",
    "state_type": "str",
    "blockInputOverrides": false,
    "outputProperties": [
      {
        "property": "cloud_raw",
        "propertyType": "msg",
        "value": "",
        "valueType": "entityState"
      }
    ],
    "for": "0",
    "forType": "num",
    "forUnits": "minutes",
    "override_topic": false,
    "state_location": "payload",
    "override_payload": "msg",
    "entity_location": "cloud_entity",
    "override_data": "msg",
    "x": 400,
    "y": 540,
    "wires": [
      [
        "27c6612f337da24c"
      ]
    ]
  },
  {
    "id": "27c6612f337da24c",
    "type": "api-current-state",
    "z": "c3cbb19136a3e4ea",
    "name": "Sun above horizon?",
    "server": "11e9f35b.61816d",
    "version": 3,
    "outputs": 1,
    "halt_if": "",
    "halt_if_type": "str",
    "halt_if_compare": "is",
    "entity_id": "sun.sun",
    "state_type": "str",
    "blockInputOverrides": false,
    "outputProperties": [
      {
        "property": "sun_state",
        "propertyType": "msg",
        "value": "",
        "valueType": "entityState"
      }
    ],
    "for": "0",
    "forType": "num",
    "forUnits": "minutes",
    "override_topic": false,
    "state_location": "payload",
    "override_payload": "msg",
    "entity_location": "sun_entity",
    "override_data": "msg",
    "x": 620,
    "y": 540,
    "wires": [
      [
        "41c32cc5427b6cf3"
      ]
    ]
  },
  {
    "id": "41c32cc5427b6cf3",
    "type": "api-current-state",
    "z": "c3cbb19136a3e4ea",
    "name": "Lighting hold active?",
    "server": "11e9f35b.61816d",
    "version": 3,
    "outputs": 1,
    "halt_if": "",
    "halt_if_type": "str",
    "halt_if_compare": "is",
    "entity_id": "binary_sensor.huskers_lighting_hold",
    "state_type": "str",
    "blockInputOverrides": false,
    "outputProperties": [
      {
        "property": "hold_state",
        "propertyType": "msg",
        "value": "",
        "valueType": "entityState"
      }
    ],
    "for": "0",
    "forType": "num",
    "forUnits": "minutes",
    "override_topic": false,
    "state_location": "payload",
    "override_payload": "msg",
    "entity_location": "hold_entity",
    "override_data": "msg",
    "x": 840,
    "y": 540,
    "wires": [
      [
        "22573513dc55ca2f"
      ]
    ]
  },
  {
    "id": "22573513dc55ca2f",
    "type": "function",
    "z": "c3cbb19136a3e4ea",
    "name": "Compute cloud logic",
    "func": "const unavailable = ['unknown', 'unavailable', 'none', null, '', 'None'];\nconst raw = msg.cloud_raw;\nconst available = unavailable.indexOf(raw) === -1;\nif (!available) {\n    node.status({ fill: 'grey', shape: 'ring', text: 'coverage unavailable' });\n    return null;\n}\nconst coverage = Number(raw);\nif (Number.isNaN(coverage)) {\n    node.status({ fill: 'grey', shape: 'ring', text: 'coverage invalid' });\n    return null;\n}\nif (msg.sun_state !== 'above_horizon') {\n    node.status({ fill: 'grey', shape: 'ring', text: 'sun below horizon' });\n    return null;\n}\nif ((msg.hold_state || '').toLowerCase() === 'on') {\n    node.status({ fill: 'yellow', shape: 'ring', text: 'lighting hold active' });\n    return null;\n}\nconst defaultTargetPct = 30;\nconst defaultTolerance = 26;\nconst defaultTarget = Math.round(255 * defaultTargetPct / 100);\nconst defaultLow = Math.max(defaultTarget - defaultTolerance, 1);\nconst defaultHigh = Math.min(defaultTarget + defaultTolerance, 255);\nconst shouldBeOn = coverage >= 60;\nmsg.cloud = {\n    raw,\n    available,\n    coverage,\n    targetPct: defaultTargetPct,\n    target: defaultTarget,\n    tolerance: defaultTolerance,\n    low: defaultLow,\n    high: defaultHigh,\n    shouldBeOn\n};\nmsg.should_be_on = shouldBeOn;\nmsg.coverage_percent = Math.round(coverage);\nmsg.tracked_lights = [\n    { name: 'Front porch', entity_id: 'light.front_porch_lights', target_pct: 30, tolerance: defaultTolerance },\n    { name: 'Garage', entity_id: 'light.garage_lights', target_pct: 30, tolerance: defaultTolerance },\n    { name: 'Permanent LEDs', entity_id: 'light.permanent_outdoor_lights', target_pct: 50, tolerance: defaultTolerance },\n    { name: 'Mainfloor', entity_id: 'light.mainfloor_lights', target_pct: 65, tolerance: defaultTolerance }\n];\nmsg.validation_timeout_ms = 15000;\nnode.status({\n    fill: shouldBeOn ? 'blue' : 'green',\n    shape: 'dot',\n    text: shouldBeOn ? `cloudy ${msg.coverage_percent}%` : `clearing ${msg.coverage_percent}%`\n});\nreturn msg;",
    "outputs": 1,
    "timeout": "",
    "noerr": 0,
    "initialize": "",
    "finalize": "",
    "libs": [],
    "x": 1040,
    "y": 540,
    "wires": [
      [
        "29ceb210d337ba15"
      ]
    ]
  },
  {
    "id": "29ceb210d337ba15",
    "type": "switch",
    "z": "c3cbb19136a3e4ea",
    "name": "Should lights be on?",
    "property": "should_be_on",
    "propertyType": "msg",
    "rules": [
      {
        "t": "true"
      },
      {
        "t": "false"
      }
    ],
    "checkall": "true",
    "repair": false,
    "outputs": 2,
    "x": 1240,
    "y": 540,
    "wires": [
      [
        "c9dd4e0c1c816b8b",
        "560c26bf25dc27f7"
      ],
      [
        "8d59da9ae6afbbf0",
        "9ebc977a41937ee2"
      ]
    ]
  },
  {
    "id": "c9dd4e0c1c816b8b",
    "type": "split",
    "z": "c3cbb19136a3e4ea",
    "name": "Each tracked light (cloudy)",
    "splt": "\\n",
    "spltType": "str",
    "arraySplt": "1",
    "arraySpltType": "len",
    "stream": false,
    "addname": "",
    "property": "tracked_lights",
    "x": 1440,
    "y": 480,
    "wires": [
      [
        "dfda95320614c760"
      ]
    ]
  },
  {
    "id": "dfda95320614c760",
    "type": "function",
    "z": "c3cbb19136a3e4ea",
    "name": "Set light context",
    "func": "const light = (msg.payload && typeof msg.payload === 'object') ? msg.payload : msg.light;\nif (!light || !light.entity_id) {\n    node.status({ fill: 'red', shape: 'ring', text: 'missing light context' });\n    return null;\n}\nconst targetPct = light.target_pct ?? msg.cloud.targetPct;\nconst tolerance = light.tolerance ?? msg.cloud.tolerance;\nconst target = Math.round(255 * targetPct / 100);\nconst low = Math.max(target - tolerance, 1);\nconst high = Math.min(target + tolerance, 255);\nmsg.light = light;\nmsg.light_entity = light.entity_id;\nmsg.light_name = light.name || light.entity_id;\nmsg.light_target_pct = targetPct;\nmsg.light_tolerance = tolerance;\nmsg.light_target = target;\nmsg.light_low = low;\nmsg.light_high = high;\nreturn msg;",
    "outputs": 1,
    "noerr": 0,
    "initialize": "",
    "finalize": "",
    "libs": [],
    "x": 1640,
    "y": 440,
    "wires": [
      [
        "ce38e44c10645710"
      ]
    ]
  },
  {
    "id": "ce38e44c10645710",
    "type": "api-current-state",
    "z": "c3cbb19136a3e4ea",
    "name": "Current light state",
    "server": "11e9f35b.61816d",
    "version": 3,
    "outputs": 1,
    "halt_if": "",
    "halt_if_type": "str",
    "halt_if_compare": "is",
    "entity_id": "{{light_entity}}",
    "state_type": "str",
    "blockInputOverrides": false,
    "outputProperties": [
      {
        "property": "light_state",
        "propertyType": "msg",
        "value": "",
        "valueType": "entityState"
      },
      {
        "property": "light_brightness",
        "propertyType": "msg",
        "value": "data.attributes.brightness",
        "valueType": "jsonata"
      }
    ],
    "for": "0",
    "forType": "num",
    "forUnits": "minutes",
    "override_topic": false,
    "state_location": "payload",
    "override_payload": "msg",
    "entity_location": "light_entity_state",
    "override_data": "msg",
    "x": 1840,
    "y": 440,
    "wires": [
      [
        "33e536ab52b66151"
      ]
    ]
  },
  {
    "id": "33e536ab52b66151",
    "type": "function",
    "z": "c3cbb19136a3e4ea",
    "name": "Needs cloudy adjustment?",
    "func": "const brightness = Number(msg.light_brightness ?? 0);\nconst state = (msg.light_state || '').toLowerCase();\nconst low = msg.light_low;\nconst high = msg.light_high;\nconst needs = state !== 'on' || brightness === 0 || brightness < low || brightness > high;\nmsg.needs_adjustment = needs;\nreturn msg;",
    "outputs": 1,
    "noerr": 0,
    "initialize": "",
    "finalize": "",
    "libs": [],
    "x": 2060,
    "y": 440,
    "wires": [
      [
        "006d5eac22fa714b"
      ]
    ]
  },
  {
    "id": "006d5eac22fa714b",
    "type": "switch",
    "z": "c3cbb19136a3e4ea",
    "name": "Adjust?",
    "property": "needs_adjustment",
    "propertyType": "msg",
    "rules": [
      {
        "t": "true"
      },
      {
        "t": "false"
      }
    ],
    "checkall": "true",
    "repair": false,
    "outputs": 2,
    "x": 2260,
    "y": 440,
    "wires": [
      [
        "38f902f1dd82bc58"
      ],
      []
    ]
  },
  {
    "id": "38f902f1dd82bc58",
    "type": "api-call-service",
    "z": "c3cbb19136a3e4ea",
    "name": "Bring light to cloudy level",
    "server": "11e9f35b.61816d",
    "version": 7,
    "debugenabled": false,
    "action": "light.turn_on",
    "floorId": [],
    "areaId": [],
    "deviceId": [],
    "entityId": [
      "{{light_entity}}"
    ],
    "labelId": [],
    "data": "{\"brightness_pct\": {{light_target_pct}}, \"transition\": 2}",
    "dataType": "json",
    "mergeContext": "",
    "mustacheAltTags": false,
    "outputProperties": [],
    "queue": "none",
    "blockInputOverrides": false,
    "domain": "light",
    "service": "turn_on",
    "x": 2480,
    "y": 420,
    "wires": [
      [
        "325d38e9c22ac2cc"
      ]
    ]
  },
  {
    "id": "325d38e9c22ac2cc",
    "type": "delay",
    "z": "c3cbb19136a3e4ea",
    "name": "Wait for brightness",
    "pauseType": "delay",
    "timeout": "2",
    "timeoutUnits": "seconds",
    "rate": "1",
    "nbRateUnits": "1",
    "rateUnits": "second",
    "randomFirst": "1",
    "randomLast": "1",
    "randomUnits": "seconds",
    "drop": false,
    "outputs": 1,
    "x": 2660,
    "y": 420,
    "wires": [
      [
        "bb8220780a73c397"
      ]
    ]
  },
  {
    "id": "bb8220780a73c397",
    "type": "api-current-state",
    "z": "c3cbb19136a3e4ea",
    "name": "Validate cloudy brightness",
    "server": "11e9f35b.61816d",
    "version": 3,
    "outputs": 1,
    "halt_if": "",
    "halt_if_type": "str",
    "halt_if_compare": "is",
    "entity_id": "{{light_entity}}",
    "state_type": "str",
    "blockInputOverrides": false,
    "outputProperties": [
      {
        "property": "light_state",
        "propertyType": "msg",
        "value": "",
        "valueType": "entityState"
      },
      {
        "property": "light_brightness",
        "propertyType": "msg",
        "value": "data.attributes.brightness",
        "valueType": "jsonata"
      }
    ],
    "for": "0",
    "forType": "num",
    "forUnits": "minutes",
    "override_topic": false,
    "state_location": "payload",
    "override_payload": "msg",
    "entity_location": "light_entity_state",
    "override_data": "msg",
    "x": 2860,
    "y": 420,
    "wires": [
      [
        "3f59e27265bef927"
      ]
    ]
  },
  {
    "id": "3f59e27265bef927",
    "type": "function",
    "z": "c3cbb19136a3e4ea",
    "name": "Cloudy validation result",
    "func": "const brightness = Number(msg.light_brightness ?? 0);\nconst state = (msg.light_state || '').toLowerCase();\nconst low = msg.light_low;\nconst high = msg.light_high;\nmsg.validation_success = state === 'on' && brightness >= low && brightness <= high;\nreturn msg;",
    "outputs": 1,
    "noerr": 0,
    "initialize": "",
    "finalize": "",
    "libs": [],
    "x": 3040,
    "y": 420,
    "wires": [
      [
        "be4c34eff7aece3a"
      ]
    ]
  },
  {
    "id": "be4c34eff7aece3a",
    "type": "switch",
    "z": "c3cbb19136a3e4ea",
    "name": "Success?",
    "property": "validation_success",
    "propertyType": "msg",
    "rules": [
      {
        "t": "true"
      },
      {
        "t": "false"
      }
    ],
    "checkall": "true",
    "repair": false,
    "outputs": 2,
    "x": 3220,
    "y": 420,
    "wires": [
      [
        "66c903c1f609b1c6"
      ],
      [
        "64a23074c1097f7f"
      ]
    ]
  },
  {
    "id": "66c903c1f609b1c6",
    "type": "function",
    "z": "c3cbb19136a3e4ea",
    "name": "Build cloudy success log",
    "func": "const name = (msg.light_name || '').toLowerCase();\nmsg.log_message = `Brought ${name} lights to cloudy daytime level (${msg.coverage_percent}% coverage).`;\nmsg.log_entity = \"automation.exterior_lights_cloudy_daytime\";\nreturn msg;",
    "outputs": 1,
    "noerr": 0,
    "initialize": "",
    "finalize": "",
    "libs": [],
    "x": 3420,
    "y": 380,
    "wires": [
      [
        "bcd1a40cf53e55a7"
      ]
    ]
  },
  {
    "id": "bcd1a40cf53e55a7",
    "type": "api-call-service",
    "z": "c3cbb19136a3e4ea",
    "name": "Logbook cloudy success",
    "server": "11e9f35b.61816d",
    "version": 7,
    "debugenabled": false,
    "action": "logbook.log",
    "floorId": [],
    "areaId": [],
    "deviceId": [],
    "entityId": [],
    "labelId": [],
    "data": "{\"entity_id\":\"{{log_entity}}\",\"name\":\"Cloudy Daytime Exterior\",\"message\":\"{{log_message}}\"}",
    "dataType": "json",
    "mergeContext": "",
    "mustacheAltTags": false,
    "outputProperties": [],
    "queue": "none",
    "blockInputOverrides": false,
    "domain": "logbook",
    "service": "log",
    "x": 3640,
    "y": 380,
    "wires": [
      []
    ]
  },
  {
    "id": "64a23074c1097f7f",
    "type": "function",
    "z": "c3cbb19136a3e4ea",
    "name": "Build cloudy failure log",
    "func": "const nameLower = (msg.light_name || '').toLowerCase();\nmsg.log_message = `Failed to bring ${nameLower} lights to cloudy daytime level (${msg.coverage_percent}% coverage).`;\nmsg.notification_message = `${msg.light_name} lights did not reach the expected cloudy brightness (${msg.coverage_percent}% coverage).`;\nmsg.log_entity = \"automation.exterior_lights_cloudy_daytime\";\nreturn msg;",
    "outputs": 1,
    "noerr": 0,
    "initialize": "",
    "finalize": "",
    "libs": [],
    "x": 3420,
    "y": 460,
    "wires": [
      [
        "26ee89af78cb72d3",
        "5a7b98857f9692e0"
      ]
    ]
  },
  {
    "id": "26ee89af78cb72d3",
    "type": "api-call-service",
    "z": "c3cbb19136a3e4ea",
    "name": "Logbook cloudy failure",
    "server": "11e9f35b.61816d",
    "version": 7,
    "debugenabled": false,
    "action": "logbook.log",
    "floorId": [],
    "areaId": [],
    "deviceId": [],
    "entityId": [],
    "labelId": [],
    "data": "{\"entity_id\":\"{{log_entity}}\",\"name\":\"Cloudy Daytime Exterior\",\"message\":\"{{log_message}}\"}",
    "dataType": "json",
    "mergeContext": "",
    "mustacheAltTags": false,
    "outputProperties": [],
    "queue": "none",
    "blockInputOverrides": false,
    "domain": "logbook",
    "service": "log",
    "x": 3640,
    "y": 440,
    "wires": [
      []
    ]
  },
  {
    "id": "5a7b98857f9692e0",
    "type": "api-call-service",
    "z": "c3cbb19136a3e4ea",
    "name": "Notify cloudy failure",
    "server": "11e9f35b.61816d",
    "version": 7,
    "debugenabled": false,
    "action": "persistent_notification.create",
    "floorId": [],
    "areaId": [],
    "deviceId": [],
    "entityId": [],
    "labelId": [],
    "data": "{\"title\":\"Cloudy Daytime Exterior validation failed\",\"message\":\"{{notification_message}}\",\"notification_id\":\"cloudy_daytime_exterior_validation\"}",
    "dataType": "json",
    "mergeContext": "",
    "mustacheAltTags": false,
    "outputProperties": [],
    "queue": "none",
    "blockInputOverrides": false,
    "domain": "persistent_notification",
    "service": "create",
    "x": 3660,
    "y": 500,
    "wires": [
      []
    ]
  },
  {
    "id": "560c26bf25dc27f7",
    "type": "delay",
    "z": "c3cbb19136a3e4ea",
    "name": "Delay before dismiss check (cloudy)",
    "pauseType": "delay",
    "timeout": "7",
    "timeoutUnits": "seconds",
    "rate": "1",
    "nbRateUnits": "1",
    "rateUnits": "second",
    "randomFirst": "1",
    "randomLast": "1",
    "randomUnits": "seconds",
    "drop": false,
    "outputs": 1,
    "x": 1460,
    "y": 540,
    "wires": [
      [
        "3f02d4acf97a1ed8"
      ]
    ]
  },
  {
    "id": "3f02d4acf97a1ed8",
    "type": "function",
    "z": "c3cbb19136a3e4ea",
    "name": "Dismiss notification when cloudy satisfied",
    "func": "const ha = global.get('homeassistant');\nif (!ha || !ha.homeAssistant || !ha.homeAssistant.states) {\n    return null;\n}\nconst states = ha.homeAssistant.states;\nconst lights = Array.isArray(msg.tracked_lights) ? msg.tracked_lights : [];\nif (!lights.length) {\n    return null;\n}\nconst defaultTargetPct = msg.cloud?.targetPct ?? 30;\nconst defaultTolerance = msg.cloud?.tolerance ?? 26;\nconst allGood = lights.every(light => {\n    const entity = states[light.entity_id];\n    if (!entity) {\n        return false;\n    }\n    if ((entity.state || '').toLowerCase() !== 'on') {\n        return false;\n    }\n    const targetPct = light.target_pct ?? defaultTargetPct;\n    const tolerance = light.tolerance ?? defaultTolerance;\n    const target = Math.round(255 * targetPct / 100);\n    const low = Math.max(target - tolerance, 1);\n    const high = Math.min(target + tolerance, 255);\n    const brightness = Number(entity.attributes?.brightness ?? 0);\n    return !Number.isNaN(brightness) && brightness >= low && brightness <= high;\n});\nif (!allGood) {\n    return null;\n}\nreturn msg;",
    "outputs": 1,
    "noerr": 0,
    "initialize": "",
    "finalize": "",
    "libs": [],
    "x": 1700,
    "y": 540,
    "wires": [
      [
        "83bcb361852e5626"
      ]
    ]
  },
  {
    "id": "83bcb361852e5626",
    "type": "api-call-service",
    "z": "c3cbb19136a3e4ea",
    "name": "Dismiss cloudy notification",
    "server": "11e9f35b.61816d",
    "version": 7,
    "debugenabled": false,
    "action": "persistent_notification.dismiss",
    "floorId": [],
    "areaId": [],
    "deviceId": [],
    "entityId": [],
    "labelId": [],
    "data": "{\"notification_id\":\"cloudy_daytime_exterior_validation\"}",
    "dataType": "json",
    "mergeContext": "",
    "mustacheAltTags": false,
    "outputProperties": [],
    "queue": "none",
    "blockInputOverrides": false,
    "domain": "persistent_notification",
    "service": "dismiss",
    "x": 2020,
    "y": 660,
    "wires": [
      []
    ]
  },
  {
    "id": "8d59da9ae6afbbf0",
    "type": "split",
    "z": "c3cbb19136a3e4ea",
    "name": "Each tracked light (clearing)",
    "splt": "\\n",
    "spltType": "str",
    "arraySplt": "1",
    "arraySpltType": "len",
    "stream": false,
    "addname": "",
    "property": "tracked_lights",
    "x": 1440,
    "y": 640,
    "wires": [
      [
        "f55f7dc8c9cdc201"
      ]
    ]
  },
  {
    "id": "f55f7dc8c9cdc201",
    "type": "function",
    "z": "c3cbb19136a3e4ea",
    "name": "Set light context (clearing)",
    "func": "const light = (msg.payload && typeof msg.payload === 'object') ? msg.payload : msg.light;\nif (!light || !light.entity_id) {\n    node.status({ fill: 'red', shape: 'ring', text: 'missing light context' });\n    return null;\n}\nconst targetPct = light.target_pct ?? msg.cloud.targetPct;\nconst tolerance = light.tolerance ?? msg.cloud.tolerance;\nconst target = Math.round(255 * targetPct / 100);\nconst low = Math.max(target - tolerance, 1);\nconst high = Math.min(target + tolerance, 255);\nmsg.light = light;\nmsg.light_entity = light.entity_id;\nmsg.light_name = light.name || light.entity_id;\nmsg.light_target_pct = targetPct;\nmsg.light_tolerance = tolerance;\nmsg.light_target = target;\nmsg.light_low = low;\nmsg.light_high = high;\nreturn msg;",
    "outputs": 1,
    "noerr": 0,
    "initialize": "",
    "finalize": "",
    "libs": [],
    "x": 1640,
    "y": 600,
    "wires": [
      [
        "7967f6e33d67e506"
      ]
    ]
  },
  {
    "id": "7967f6e33d67e506",
    "type": "api-current-state",
    "z": "c3cbb19136a3e4ea",
    "name": "Current light state (clearing)",
    "server": "11e9f35b.61816d",
    "version": 3,
    "outputs": 1,
    "halt_if": "",
    "halt_if_type": "str",
    "halt_if_compare": "is",
    "entity_id": "{{light_entity}}",
    "state_type": "str",
    "blockInputOverrides": false,
    "outputProperties": [
      {
        "property": "light_state",
        "propertyType": "msg",
        "value": "",
        "valueType": "entityState"
      }
    ],
    "for": "0",
    "forType": "num",
    "forUnits": "minutes",
    "override_topic": false,
    "state_location": "payload",
    "override_payload": "msg",
    "entity_location": "light_entity_state",
    "override_data": "msg",
    "x": 1840,
    "y": 600,
    "wires": [
      [
        "9b46869778c11974"
      ]
    ]
  },
  {
    "id": "9b46869778c11974",
    "type": "function",
    "z": "c3cbb19136a3e4ea",
    "name": "Needs to turn off?",
    "func": "const state = (msg.light_state || '').toLowerCase();\nmsg.needs_off = state !== 'off';\nreturn msg;",
    "outputs": 1,
    "noerr": 0,
    "initialize": "",
    "finalize": "",
    "libs": [],
    "x": 2060,
    "y": 600,
    "wires": [
      [
        "1ce0d1b374e4a5a7"
      ]
    ]
  },
  {
    "id": "1ce0d1b374e4a5a7",
    "type": "switch",
    "z": "c3cbb19136a3e4ea",
    "name": "Turn off?",
    "property": "needs_off",
    "propertyType": "msg",
    "rules": [
      {
        "t": "true"
      },
      {
        "t": "false"
      }
    ],
    "checkall": "true",
    "repair": false,
    "outputs": 2,
    "x": 2260,
    "y": 600,
    "wires": [
      [
        "baf3bd0582f61527"
      ],
      []
    ]
  },
  {
    "id": "baf3bd0582f61527",
    "type": "api-call-service",
    "z": "c3cbb19136a3e4ea",
    "name": "Turn light off",
    "server": "11e9f35b.61816d",
    "version": 7,
    "debugenabled": false,
    "action": "light.turn_off",
    "floorId": [],
    "areaId": [],
    "deviceId": [],
    "entityId": [
      "{{light_entity}}"
    ],
    "labelId": [],
    "data": "{\"transition\": 2}",
    "dataType": "json",
    "mergeContext": "",
    "mustacheAltTags": false,
    "outputProperties": [],
    "queue": "none",
    "blockInputOverrides": false,
    "domain": "light",
    "service": "turn_off",
    "x": 2460,
    "y": 580,
    "wires": [
      [
        "dcbeaf9a81440eaa"
      ]
    ]
  },
  {
    "id": "dcbeaf9a81440eaa",
    "type": "delay",
    "z": "c3cbb19136a3e4ea",
    "name": "Wait for off",
    "pauseType": "delay",
    "timeout": "2",
    "timeoutUnits": "seconds",
    "rate": "1",
    "nbRateUnits": "1",
    "rateUnits": "second",
    "randomFirst": "1",
    "randomLast": "1",
    "randomUnits": "seconds",
    "drop": false,
    "outputs": 1,
    "x": 2640,
    "y": 580,
    "wires": [
      [
        "033a7b0c209cae07"
      ]
    ]
  },
  {
    "id": "033a7b0c209cae07",
    "type": "api-current-state",
    "z": "c3cbb19136a3e4ea",
    "name": "Validate cleared light",
    "server": "11e9f35b.61816d",
    "version": 3,
    "outputs": 1,
    "halt_if": "",
    "halt_if_type": "str",
    "halt_if_compare": "is",
    "entity_id": "{{light_entity}}",
    "state_type": "str",
    "blockInputOverrides": false,
    "outputProperties": [
      {
        "property": "light_state",
        "propertyType": "msg",
        "value": "",
        "valueType": "entityState"
      }
    ],
    "for": "0",
    "forType": "num",
    "forUnits": "minutes",
    "override_topic": false,
    "state_location": "payload",
    "override_payload": "msg",
    "entity_location": "light_entity_state",
    "override_data": "msg",
    "x": 2840,
    "y": 580,
    "wires": [
      [
        "1bc5d037da2e646f"
      ]
    ]
  },
  {
    "id": "1bc5d037da2e646f",
    "type": "function",
    "z": "c3cbb19136a3e4ea",
    "name": "Clearing validation result",
    "func": "const state = (msg.light_state || '').toLowerCase();\nmsg.validation_success = state === 'off';\nreturn msg;",
    "outputs": 1,
    "noerr": 0,
    "initialize": "",
    "finalize": "",
    "libs": [],
    "x": 3040,
    "y": 580,
    "wires": [
      [
        "7c88271874fe5e25"
      ]
    ]
  },
  {
    "id": "7c88271874fe5e25",
    "type": "switch",
    "z": "c3cbb19136a3e4ea",
    "name": "Off success?",
    "property": "validation_success",
    "propertyType": "msg",
    "rules": [
      {
        "t": "true"
      },
      {
        "t": "false"
      }
    ],
    "checkall": "true",
    "repair": false,
    "outputs": 2,
    "x": 3220,
    "y": 580,
    "wires": [
      [
        "83f2ac53150f2d59"
      ],
      [
        "d397c9a4262b1f16"
      ]
    ]
  },
  {
    "id": "83f2ac53150f2d59",
    "type": "function",
    "z": "c3cbb19136a3e4ea",
    "name": "Build clearing success log",
    "func": "const name = (msg.light_name || '').toLowerCase();\nmsg.log_message = `Turned off ${name} lights as skies cleared (${msg.coverage_percent}% coverage).`;\nmsg.log_entity = \"automation.exterior_lights_cloudy_daytime\";\nreturn msg;",
    "outputs": 1,
    "noerr": 0,
    "initialize": "",
    "finalize": "",
    "libs": [],
    "x": 3440,
    "y": 540,
    "wires": [
      [
        "8ce1d20140affc95"
      ]
    ]
  },
  {
    "id": "8ce1d20140affc95",
    "type": "api-call-service",
    "z": "c3cbb19136a3e4ea",
    "name": "Logbook clearing success",
    "server": "11e9f35b.61816d",
    "version": 7,
    "debugenabled": false,
    "action": "logbook.log",
    "floorId": [],
    "areaId": [],
    "deviceId": [],
    "entityId": [],
    "labelId": [],
    "data": "{\"entity_id\":\"{{log_entity}}\",\"name\":\"Cloudy Daytime Exterior\",\"message\":\"{{log_message}}\"}",
    "dataType": "json",
    "mergeContext": "",
    "mustacheAltTags": false,
    "outputProperties": [],
    "queue": "none",
    "blockInputOverrides": false,
    "domain": "logbook",
    "service": "log",
    "x": 3660,
    "y": 540,
    "wires": [
      []
    ]
  },
  {
    "id": "d397c9a4262b1f16",
    "type": "function",
    "z": "c3cbb19136a3e4ea",
    "name": "Build clearing failure log",
    "func": "const nameLower = (msg.light_name || '').toLowerCase();\nmsg.log_message = `Failed to turn off ${nameLower} lights as skies cleared (${msg.coverage_percent}% coverage).`;\nmsg.notification_message = `${msg.light_name} lights did not turn off after skies cleared (${msg.coverage_percent}% coverage).`;\nmsg.log_entity = \"automation.exterior_lights_cloudy_daytime\";\nreturn msg;",
    "outputs": 1,
    "noerr": 0,
    "initialize": "",
    "finalize": "",
    "libs": [],
    "x": 3440,
    "y": 620,
    "wires": [
      [
        "abc4b10106b8f2c6",
        "e3a469245ec31415"
      ]
    ]
  },
  {
    "id": "abc4b10106b8f2c6",
    "type": "api-call-service",
    "z": "c3cbb19136a3e4ea",
    "name": "Logbook clearing failure",
    "server": "11e9f35b.61816d",
    "version": 7,
    "debugenabled": false,
    "action": "logbook.log",
    "floorId": [],
    "areaId": [],
    "deviceId": [],
    "entityId": [],
    "labelId": [],
    "data": "{\"entity_id\":\"{{log_entity}}\",\"name\":\"Cloudy Daytime Exterior\",\"message\":\"{{log_message}}\"}",
    "dataType": "json",
    "mergeContext": "",
    "mustacheAltTags": false,
    "outputProperties": [],
    "queue": "none",
    "blockInputOverrides": false,
    "domain": "logbook",
    "service": "log",
    "x": 3660,
    "y": 600,
    "wires": [
      []
    ]
  },
  {
    "id": "e3a469245ec31415",
    "type": "api-call-service",
    "z": "c3cbb19136a3e4ea",
    "name": "Notify clearing failure",
    "server": "11e9f35b.61816d",
    "version": 7,
    "debugenabled": false,
    "action": "persistent_notification.create",
    "floorId": [],
    "areaId": [],
    "deviceId": [],
    "entityId": [],
    "labelId": [],
    "data": "{\"title\":\"Cloudy Daytime Exterior validation failed\",\"message\":\"{{notification_message}}\",\"notification_id\":\"cloudy_daytime_exterior_validation\"}",
    "dataType": "json",
    "mergeContext": "",
    "mustacheAltTags": false,
    "outputProperties": [],
    "queue": "none",
    "blockInputOverrides": false,
    "domain": "persistent_notification",
    "service": "create",
    "x": 3680,
    "y": 660,
    "wires": [
      []
    ]
  },
  {
    "id": "9ebc977a41937ee2",
    "type": "delay",
    "z": "c3cbb19136a3e4ea",
    "name": "Delay before dismiss check (clearing)",
    "pauseType": "delay",
    "timeout": "7",
    "timeoutUnits": "seconds",
    "rate": "1",
    "nbRateUnits": "1",
    "rateUnits": "second",
    "randomFirst": "1",
    "randomLast": "1",
    "randomUnits": "seconds",
    "drop": false,
    "outputs": 1,
    "x": 1460,
    "y": 700,
    "wires": [
      [
        "ab15fa0260151689"
      ]
    ]
  },
  {
    "id": "ab15fa0260151689",
    "type": "function",
    "z": "c3cbb19136a3e4ea",
    "name": "Dismiss notification when cleared",
    "func": "const ha = global.get('homeassistant');\nif (!ha || !ha.homeAssistant || !ha.homeAssistant.states) {\n    return null;\n}\nconst states = ha.homeAssistant.states;\nconst lights = Array.isArray(msg.tracked_lights) ? msg.tracked_lights : [];\nif (!lights.length) {\n    return null;\n}\nconst allOff = lights.every(light => {\n    const entity = states[light.entity_id];\n    return entity && (entity.state || '').toLowerCase() === 'off';\n});\nif (!allOff) {\n    return null;\n}\nreturn msg;",
    "outputs": 1,
    "noerr": 0,
    "initialize": "",
    "finalize": "",
    "libs": [],
    "x": 1700,
    "y": 700,
    "wires": [
      [
        "83bcb361852e5626"
      ]
    ]
  },
  {
    "id": "11e9f35b.61816d",
    "type": "server",
    "name": "Home Assistant",
    "addon": true
  }
]
