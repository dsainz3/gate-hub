[
    {
        "id": "df0c3d394881af2d",
        "type": "tab",
        "label": "Cloudy Daytime Exterior",
        "disabled": false,
        "info": ""
    },
    {
        "id": "7be417f0d3f1e35e",
        "type": "tab",
        "label": "Lighting Utility Automations",
        "disabled": false,
        "info": "Fail-safe alignment for exterior lighting scenes plus LED monthly effect orchestration."
    },
    {
        "id": "b0ce83b4c7194f6d",
        "type": "tab",
        "label": "Safety & Maintenance",
        "disabled": false,
        "info": "Humidor cooling guard, nightly burner shutoff, and Reolink warmup sequencing."
    },
    {
        "id": "5bf285a455077f62",
        "type": "tab",
        "label": "PLighting Seasonal Shows",
        "disabled": false,
        "info": "Production: independent 2s transitions, 15–20s random waits, four-color palette. Uses stop_flag set by stop button event."
    },
    {
        "id": "234945acd17cd327",
        "type": "tab",
        "label": "Lighting Sun Automations",
        "disabled": false,
        "info": ""
    },
    {
        "id": "7e180ead4ba54b28",
        "type": "tab",
        "label": "TLighting Seasonal Shows",
        "disabled": false,
        "info": ""
    },
    {
        "id": "b6a2a23f1dc4SIM",
        "type": "tab",
        "label": "Test · Sun Sim Controls",
        "disabled": false,
        "info": ""
    },
    {
        "id": "ac09184e85596daf",
        "type": "tab",
        "label": "TLighting · Scarlet & Cream",
        "disabled": false,
        "info": "Responds to input_button.test_husker_game_mode; stops with input_button.test_lighting_stop."
    },
    {
        "id": "a79b55aedfbeef10",
        "type": "subflow",
        "name": "Independent Light Loop",
        "info": "",
        "in": [
            {
                "x": 60,
                "y": 60,
                "wires": [
                    {
                        "id": "77f16f020d55899c"
                    }
                ]
            }
        ],
        "out": [],
        "env": [
            {
                "name": "ENTITY_ID",
                "type": "str",
                "value": ""
            }
        ]
    },
    {
        "id": "9f067771cc960756",
        "type": "subflow",
        "name": "TLighting Sun Brightness (Test) (1)",
        "info": "",
        "in": [],
        "out": [],
        "env": [
            {
                "name": "PRESHOW_MIN_BEFORE_SUNSET",
                "type": "num",
                "value": "5"
            },
            {
                "name": "PRESHOW_BRIGHTNESS_PCT",
                "type": "num",
                "value": "10"
            },
            {
                "name": "SUNSET_BRIGHTNESS_PCT",
                "type": "num",
                "value": "30"
            },
            {
                "name": "APPLY_TRANSITION_SEC",
                "type": "num",
                "value": "2"
            }
        ],
        "meta": {},
        "color": "#DDAA99"
    },
    {
        "id": "sub_tlighting_sun_brightness_test",
        "type": "subflow",
        "name": "TLighting Sun Brightness (Test)",
        "info": "",
        "in": [],
        "out": [],
        "env": [
            {
                "name": "PRESHOW_MIN_BEFORE_SUNSET",
                "type": "num",
                "value": "5"
            },
            {
                "name": "PRESHOW_BRIGHTNESS_PCT",
                "type": "num",
                "value": "10"
            },
            {
                "name": "SUNSET_BRIGHTNESS_PCT",
                "type": "num",
                "value": "30"
            },
            {
                "name": "APPLY_TRANSITION_SEC",
                "type": "num",
                "value": "2"
            }
        ],
        "meta": {},
        "color": "#DDAA99"
    },
    {
        "id": "11e9f35b.61816d",
        "type": "server",
        "name": "Home Assistant",
        "addon": true
    },
    {
        "id": "77f16f020d55899c",
        "type": "function",
        "z": "a79b55aedfbeef10",
        "name": "Pick color",
        "func": "const entity = env.get('ENTITY_ID');\nconst pal = flow.get('halloweenPalette') || [[255,140,0],[0,100,0],[75,0,130],[139,0,0]];\nconst t = flow.get('transition_secs') || 2;\nconst b = flow.get('brightness_pct') || 35;\nlet active = flow.get('activeColors') || {};\nconst last = active[entity];\nconst others = Object.entries(active).filter(([k])=>k!==entity).map(([,v])=>JSON.stringify(v));\nlet choices = pal.filter(c=>JSON.stringify(c)!==JSON.stringify(last) && !others.includes(JSON.stringify(c)));\nif (choices.length < 2) choices = pal.filter(c=>JSON.stringify(c)!==JSON.stringify(last));\nif (!choices.length) choices = pal;\nconst pick = choices[Math.floor(Math.random()*choices.length)];\nactive[entity] = pick;\nflow.set('activeColors', active);\nmsg.payload = { entity_id: entity, rgb_color: pick, brightness_pct: b, transition: t };\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 220,
        "y": 60,
        "wires": [
            [
                "a694cb6e392b274f"
            ]
        ]
    },
    {
        "id": "a694cb6e392b274f",
        "type": "api-call-service",
        "z": "a79b55aedfbeef10",
        "name": "Apply",
        "server": "11e9f35b.61816d",
        "version": 7,
        "action": "light.turn_on",
        "entityId": [],
        "data": "payload",
        "dataType": "jsonata",
        "x": 410,
        "y": 60,
        "wires": [
            [
                "592df8431e925292"
            ]
        ]
    },
    {
        "id": "592df8431e925292",
        "type": "delay",
        "z": "a79b55aedfbeef10",
        "name": "Wait 15–20s",
        "pauseType": "delay",
        "timeout": "20",
        "timeoutUnits": "seconds",
        "rate": "0",
        "nbRateUnits": "1",
        "rateUnits": "second",
        "randomFirst": "15",
        "randomLast": "20",
        "randomUnits": "seconds",
        "drop": false,
        "allowrate": false,
        "outputs": 1,
        "x": 590,
        "y": 60,
        "wires": [
            [
                "5ad47ff187209781"
            ]
        ]
    },
    {
        "id": "5ad47ff187209781",
        "type": "api-current-state",
        "z": "a79b55aedfbeef10",
        "name": "Stop?",
        "server": "11e9f35b.61816d",
        "version": 3,
        "outputs": 2,
        "halt_if": "on",
        "halt_if_type": "str",
        "halt_if_compare": "is",
        "entity_id": "input_button.lighting_halloween_stop",
        "state_type": "str",
        "x": 770,
        "y": 60,
        "wires": [
            [],
            [
                "77f16f020d55899c"
            ]
        ]
    },
    {
        "id": "140e407725f5ccb4",
        "type": "inject",
        "z": "9f067771cc960756",
        "name": "tick 30s (auto)",
        "props": [],
        "repeat": "30",
        "crontab": "",
        "once": true,
        "onceDelay": "2",
        "topic": "",
        "x": 150,
        "y": 80,
        "wires": [
            [
                "b1a0aba086da3552"
            ]
        ]
    },
    {
        "id": "8a48acb67170652d",
        "type": "inject",
        "z": "9f067771cc960756",
        "name": "Manual test tick (click to run now)",
        "props": [],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0,
        "topic": "",
        "x": 200,
        "y": 120,
        "wires": [
            [
                "b1a0aba086da3552"
            ]
        ]
    },
    {
        "id": "b1a0aba086da3552",
        "type": "api-current-state",
        "z": "9f067771cc960756",
        "name": "sun.sun → attrs",
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
                "property": "sun",
                "propertyType": "msg",
                "value": "",
                "valueType": "entity"
            }
        ],
        "for": "0",
        "forType": "num",
        "forUnits": "minutes",
        "override_topic": false,
        "state_location": "payload",
        "override_payload": "msg",
        "entity_location": "data",
        "override_data": "msg",
        "x": 420,
        "y": 100,
        "wires": [
            [
                "4efdbc6cec266c7c"
            ]
        ]
    },
    {
        "id": "4efdbc6cec266c7c",
        "type": "function",
        "z": "9f067771cc960756",
        "name": "decide target brightness (uses global override if set)",
        "func": "const env = flow.get(\"env\") || {};\nconst minutesBefore = Number(env.PRESHOW_MIN_BEFORE_SUNSET ?? 5);\nconst prePct = Number(env.PRESHOW_BRIGHTNESS_PCT ?? 10);\nconst sunsetPct = Number(env.SUNSET_BRIGHTNESS_PCT ?? 30);\nconst attrs = (msg.sun && msg.sun.attributes) || {};\nconst overrideISO = global.get('tlighting_test.sun_next_setting_override');\nconst now = new Date();\nlet nextSettingStr = attrs.next_setting;\nif (typeof overrideISO === 'string' && overrideISO.trim()) {\n  nextSettingStr = overrideISO;\n}\nif (!nextSettingStr) return null;\nconst nextSetting = new Date(nextSettingStr);\nconst diffMin = (nextSetting - now) / 60000;\nlet targetPct = null;\nif (diffMin <= 0) {\n  targetPct = sunsetPct;       // at/after sunset\n} else if (diffMin <= minutesBefore) {\n  targetPct = prePct;          // within pre-sunset window\n} else {\n  return null;                 // outside control window → do nothing\n}\nmsg.targetPct = Math.max(1, Math.min(100, Math.round(targetPct)));\nreturn msg; ",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 740,
        "y": 100,
        "wires": [
            [
                "41ec53640aed794c"
            ]
        ]
    },
    {
        "id": "41ec53640aed794c",
        "type": "function",
        "z": "9f067771cc960756",
        "name": "update flow.brightness_pct if changed",
        "func": "const current = flow.get(\"brightness_pct\");\nconst next = msg.targetPct;\nif (typeof next !== 'number') return null;\nif (current === next) return null;\nflow.set(\"brightness_pct\", next);\nmsg.changed = true;\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 1040,
        "y": 100,
        "wires": [
            [
                "b537454f96cc0bab"
            ]
        ]
    },
    {
        "id": "b537454f96cc0bab",
        "type": "function",
        "z": "9f067771cc960756",
        "name": "build call-service msgs (one per light)",
        "func": "const transition = Number(flow.get(\"env\")?.APPLY_TRANSITION_SEC ?? 2);\nconst ids = [\n  'light.light_theater_left',\n  'light.light_theater_right',\n  'light.sunroom_light_2',\n  'light.light_office'\n];\nreturn [ ids.map(id => ({ payload: { entity_id: id, brightness_pct: msg.targetPct, transition } })) ];",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 1360,
        "y": 100,
        "wires": [
            [
                "edd4147a3a58ad9c"
            ]
        ]
    },
    {
        "id": "edd4147a3a58ad9c",
        "type": "api-call-service",
        "z": "9f067771cc960756",
        "name": "light.turn_on brightness only",
        "server": "11e9f35b.61816d",
        "version": 7,
        "debugenabled": false,
        "action": "light.turn_on",
        "entityId": [],
        "data": "payload",
        "dataType": "jsonata",
        "mergeContext": "",
        "mustacheAltTags": false,
        "outputProperties": [],
        "queue": "none",
        "domain": "light",
        "service": "turn_on",
        "x": 1620,
        "y": 100,
        "wires": [
            []
        ]
    },
    {
        "id": "sub_inj_tick",
        "type": "inject",
        "z": "sub_tlighting_sun_brightness_test",
        "name": "tick 30s (auto)",
        "props": [],
        "repeat": "30",
        "crontab": "",
        "once": true,
        "onceDelay": "2",
        "topic": "",
        "x": 150,
        "y": 80,
        "wires": [
            [
                "sub_get_sun_state"
            ]
        ]
    },
    {
        "id": "sub_inj_manual",
        "type": "inject",
        "z": "sub_tlighting_sun_brightness_test",
        "name": "Manual test tick (click to run now)",
        "props": [],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0,
        "topic": "",
        "x": 200,
        "y": 120,
        "wires": [
            [
                "sub_get_sun_state"
            ]
        ]
    },
    {
        "id": "sub_get_sun_state",
        "type": "api-current-state",
        "z": "sub_tlighting_sun_brightness_test",
        "name": "sun.sun → attrs",
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
                "property": "sun",
                "propertyType": "msg",
                "value": "",
                "valueType": "entity"
            }
        ],
        "for": "0",
        "forType": "num",
        "forUnits": "minutes",
        "override_topic": false,
        "state_location": "payload",
        "override_payload": "msg",
        "entity_location": "data",
        "override_data": "msg",
        "x": 420,
        "y": 100,
        "wires": [
            [
                "sub_fn_pick_pct"
            ]
        ]
    },
    {
        "id": "sub_fn_pick_pct",
        "type": "function",
        "z": "sub_tlighting_sun_brightness_test",
        "name": "decide target brightness (uses global override if set)",
        "func": "const env = flow.get(\"env\") || {};\nconst minutesBefore = Number(env.PRESHOW_MIN_BEFORE_SUNSET ?? 5);\nconst prePct = Number(env.PRESHOW_BRIGHTNESS_PCT ?? 10);\nconst sunsetPct = Number(env.SUNSET_BRIGHTNESS_PCT ?? 30);\nconst attrs = (msg.sun && msg.sun.attributes) || {};\nconst overrideISO = global.get('tlighting_test.sun_next_setting_override');\nconst now = new Date();\nlet nextSettingStr = attrs.next_setting;\nif (typeof overrideISO === 'string' && overrideISO.trim()) {\n  nextSettingStr = overrideISO;\n}\nif (!nextSettingStr) return null;\nconst nextSetting = new Date(nextSettingStr);\nconst diffMin = (nextSetting - now) / 60000;\nlet targetPct = null;\nif (diffMin <= 0) {\n  targetPct = sunsetPct;       // at/after sunset\n} else if (diffMin <= minutesBefore) {\n  targetPct = prePct;          // within pre-sunset window\n} else {\n  return null;                 // outside control window → do nothing\n}\nmsg.targetPct = Math.max(1, Math.min(100, Math.round(targetPct)));\nreturn msg; ",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 740,
        "y": 100,
        "wires": [
            [
                "sub_fn_update_if_changed"
            ]
        ]
    },
    {
        "id": "sub_fn_update_if_changed",
        "type": "function",
        "z": "sub_tlighting_sun_brightness_test",
        "name": "update flow.brightness_pct if changed",
        "func": "const current = flow.get(\"brightness_pct\");\nconst next = msg.targetPct;\nif (typeof next !== 'number') return null;\nif (current === next) return null;\nflow.set(\"brightness_pct\", next);\nmsg.changed = true;\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 1040,
        "y": 100,
        "wires": [
            [
                "sub_fn_build_msgs"
            ]
        ]
    },
    {
        "id": "sub_fn_build_msgs",
        "type": "function",
        "z": "sub_tlighting_sun_brightness_test",
        "name": "build call-service msgs (one per light)",
        "func": "const transition = Number(flow.get(\"env\")?.APPLY_TRANSITION_SEC ?? 2);\nconst ids = [\n  'light.light_theater_left',\n  'light.light_theater_right',\n  'light.sunroom_light_2',\n  'light.light_office'\n];\nreturn [ ids.map(id => ({ payload: { entity_id: id, brightness_pct: msg.targetPct, transition } })) ];",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 1360,
        "y": 100,
        "wires": [
            [
                "sub_call_apply"
            ]
        ]
    },
    {
        "id": "sub_call_apply",
        "type": "api-call-service",
        "z": "sub_tlighting_sun_brightness_test",
        "name": "light.turn_on brightness only",
        "server": "11e9f35b.61816d",
        "version": 7,
        "debugenabled": false,
        "action": "light.turn_on",
        "entityId": [],
        "data": "payload",
        "dataType": "jsonata",
        "mergeContext": "",
        "mustacheAltTags": false,
        "outputProperties": [],
        "queue": "none",
        "domain": "light",
        "service": "turn_on",
        "x": 1620,
        "y": 100,
        "wires": [
            []
        ]
    },
    {
        "id": "11a823e296424e8e",
        "type": "function",
        "z": "df0c3d394881af2d",
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
                "047a9fb8683d92fa",
                "91ea685b010e77d9"
            ]
        ]
    },
    {
        "id": "5f09aedcf5d8eb44",
        "type": "delay",
        "z": "df0c3d394881af2d",
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
                "ccfdd996464906d8"
            ]
        ]
    },
    {
        "id": "b45ba272a40d81e4",
        "type": "function",
        "z": "df0c3d394881af2d",
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
                "8f5c0734c32f31ca"
            ]
        ]
    },
    {
        "id": "91ea685b010e77d9",
        "type": "api-call-service",
        "z": "df0c3d394881af2d",
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
        "id": "cd26dbbbcbced890",
        "type": "function",
        "z": "df0c3d394881af2d",
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
                "25151af0b5baa61a"
            ]
        ]
    },
    {
        "id": "d84bc62b57f564c5",
        "type": "api-call-service",
        "z": "df0c3d394881af2d",
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
        "id": "cf9987f1000820ae",
        "type": "switch",
        "z": "df0c3d394881af2d",
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
                "a51f5a6c236d4537"
            ],
            []
        ]
    },
    {
        "id": "5aac48f59336d924",
        "type": "api-current-state",
        "z": "df0c3d394881af2d",
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
                "4763a61c2dd35328"
            ]
        ]
    },
    {
        "id": "cf260a9227d1a947",
        "type": "function",
        "z": "df0c3d394881af2d",
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
                "f414c29bf1edfa87"
            ]
        ]
    },
    {
        "id": "bfa940d9a05080eb",
        "type": "delay",
        "z": "df0c3d394881af2d",
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
                "88b00345bfbdcccf"
            ]
        ]
    },
    {
        "id": "0b8dcf83280311fa",
        "type": "api-current-state",
        "z": "df0c3d394881af2d",
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
                "f59d0c705aa67dc3"
            ]
        ]
    },
    {
        "id": "4055f67ad27f29dc",
        "type": "delay",
        "z": "df0c3d394881af2d",
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
                "80e9fafc2834968b"
            ]
        ]
    },
    {
        "id": "f71924e5db70dcb7",
        "type": "delay",
        "z": "df0c3d394881af2d",
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
                "70d97049ecbc2160"
            ]
        ]
    },
    {
        "id": "8f5c0734c32f31ca",
        "type": "switch",
        "z": "df0c3d394881af2d",
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
                "cd26dbbbcbced890"
            ],
            [
                "11a823e296424e8e"
            ]
        ]
    },
    {
        "id": "b7b0b289285511cd",
        "type": "api-current-state",
        "z": "df0c3d394881af2d",
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
                "6fca05f9596bbab0"
            ]
        ]
    },
    {
        "id": "6f20b1ad572b2086",
        "type": "api-call-service",
        "z": "df0c3d394881af2d",
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
                "4055f67ad27f29dc"
            ]
        ]
    },
    {
        "id": "3eadaa86b1977b18",
        "type": "function",
        "z": "df0c3d394881af2d",
        "name": "Set light context",
        "func": "const candidate = (msg.payload && typeof msg.payload === 'object') ? msg.payload : msg.tracked_lights;\nconst light = (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) ? candidate : msg.light;\nif (!light || !light.entity_id) {\n    node.status({ fill: 'red', shape: 'ring', text: 'missing light context' });\n    return null;\n}\nconst targetPct = light.target_pct ?? msg.cloud.targetPct;\nconst tolerance = light.tolerance ?? msg.cloud.tolerance;\nconst target = Math.round(255 * targetPct / 100);\nconst low = Math.max(target - tolerance, 1);\nconst high = Math.min(target + tolerance, 255);\nmsg.light = light;\nmsg.light_entity = light.entity_id;\nmsg.light_name = light.name || light.entity_id;\nmsg.light_target_pct = targetPct;\nmsg.light_tolerance = tolerance;\nmsg.light_target = target;\nmsg.light_low = low;\nmsg.light_high = high;\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 1640,
        "y": 440,
        "wires": [
            [
                "0b8dcf83280311fa"
            ]
        ]
    },
    {
        "id": "cf95e679c43a28f3",
        "type": "split",
        "z": "df0c3d394881af2d",
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
                "3eadaa86b1977b18"
            ]
        ]
    },
    {
        "id": "70d97049ecbc2160",
        "type": "function",
        "z": "df0c3d394881af2d",
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
                "9a4c1229f61cdbb6"
            ]
        ]
    },
    {
        "id": "17389496f227a610",
        "type": "api-call-service",
        "z": "df0c3d394881af2d",
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
        "id": "25151af0b5baa61a",
        "type": "api-call-service",
        "z": "df0c3d394881af2d",
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
        "id": "6fca05f9596bbab0",
        "type": "function",
        "z": "df0c3d394881af2d",
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
                "6bc1c48be64c1448"
            ]
        ]
    },
    {
        "id": "5637e0f4b9ff0d57",
        "type": "function",
        "z": "df0c3d394881af2d",
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
                "cf9987f1000820ae"
            ]
        ]
    },
    {
        "id": "9a4c1229f61cdbb6",
        "type": "api-call-service",
        "z": "df0c3d394881af2d",
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
        "id": "4763a61c2dd35328",
        "type": "api-current-state",
        "z": "df0c3d394881af2d",
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
                "b7b0b289285511cd"
            ]
        ]
    },
    {
        "id": "8c316ab2da39b6f5",
        "type": "server-state-changed",
        "z": "df0c3d394881af2d",
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
                "5aac48f59336d924"
            ]
        ]
    },
    {
        "id": "94336d1c019a1cdf",
        "type": "switch",
        "z": "df0c3d394881af2d",
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
                "cf260a9227d1a947"
            ],
            [
                "a4b1adc86424be19"
            ]
        ]
    },
    {
        "id": "52d159c6469ea721",
        "type": "inject",
        "z": "df0c3d394881af2d",
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
                "5aac48f59336d924"
            ]
        ]
    },
    {
        "id": "80e9fafc2834968b",
        "type": "api-current-state",
        "z": "df0c3d394881af2d",
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
                "8d9c2a8c8683354b"
            ]
        ]
    },
    {
        "id": "ccfdd996464906d8",
        "type": "function",
        "z": "df0c3d394881af2d",
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
                "9a4c1229f61cdbb6"
            ]
        ]
    },
    {
        "id": "f414c29bf1edfa87",
        "type": "api-call-service",
        "z": "df0c3d394881af2d",
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
        "id": "8d9c2a8c8683354b",
        "type": "function",
        "z": "df0c3d394881af2d",
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
                "94336d1c019a1cdf"
            ]
        ]
    },
    {
        "id": "a5eb619b209dfee7",
        "type": "switch",
        "z": "df0c3d394881af2d",
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
                "6f20b1ad572b2086"
            ],
            []
        ]
    },
    {
        "id": "a51f5a6c236d4537",
        "type": "api-call-service",
        "z": "df0c3d394881af2d",
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
                "bfa940d9a05080eb"
            ]
        ]
    },
    {
        "id": "fad211476a7c48ac",
        "type": "function",
        "z": "df0c3d394881af2d",
        "name": "Set light context (clearing)",
        "func": "const candidate = (msg.payload && typeof msg.payload === 'object') ? msg.payload : msg.tracked_lights;\nconst light = (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) ? candidate : msg.light;\nif (!light || !light.entity_id) {\n    node.status({ fill: 'red', shape: 'ring', text: 'missing light context' });\n    return null;\n}\nconst targetPct = light.target_pct ?? msg.cloud.targetPct;\nconst tolerance = light.tolerance ?? msg.cloud.tolerance;\nconst target = Math.round(255 * targetPct / 100);\nconst low = Math.max(target - tolerance, 1);\nconst high = Math.min(target + tolerance, 255);\nmsg.light = light;\nmsg.light_entity = light.entity_id;\nmsg.light_name = light.name || light.entity_id;\nmsg.light_target_pct = targetPct;\nmsg.light_tolerance = tolerance;\nmsg.light_target = target;\nmsg.light_low = low;\nmsg.light_high = high;\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 1640,
        "y": 600,
        "wires": [
            [
                "54e51d9eb783823f"
            ]
        ]
    },
    {
        "id": "54e51d9eb783823f",
        "type": "api-current-state",
        "z": "df0c3d394881af2d",
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
                "5637e0f4b9ff0d57"
            ]
        ]
    },
    {
        "id": "770622dddb501bae",
        "type": "split",
        "z": "df0c3d394881af2d",
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
                "fad211476a7c48ac"
            ]
        ]
    },
    {
        "id": "88b00345bfbdcccf",
        "type": "api-current-state",
        "z": "df0c3d394881af2d",
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
                "b45ba272a40d81e4"
            ]
        ]
    },
    {
        "id": "047a9fb8683d92fa",
        "type": "api-call-service",
        "z": "df0c3d394881af2d",
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
        "id": "f59d0c705aa67dc3",
        "type": "function",
        "z": "df0c3d394881af2d",
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
                "a5eb619b209dfee7"
            ]
        ]
    },
    {
        "id": "6bc1c48be64c1448",
        "type": "switch",
        "z": "df0c3d394881af2d",
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
                "cf95e679c43a28f3",
                "5f09aedcf5d8eb44"
            ],
            [
                "770622dddb501bae",
                "f71924e5db70dcb7"
            ]
        ]
    },
    {
        "id": "a4b1adc86424be19",
        "type": "function",
        "z": "df0c3d394881af2d",
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
                "d84bc62b57f564c5",
                "17389496f227a610"
            ]
        ]
    },
    {
        "id": "d50bd03499a760da",
        "type": "inject",
        "z": "7be417f0d3f1e35e",
        "name": "Fail-safe heartbeat",
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
        "x": 180,
        "y": 120,
        "wires": [
            [
                "af20c8dcf08b2083"
            ]
        ]
    },
    {
        "id": "bada16134b057e32",
        "type": "inject",
        "z": "7be417f0d3f1e35e",
        "name": "Fail-safe startup",
        "props": [
            {
                "p": "payload"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": true,
        "onceDelay": 2,
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "x": 190,
        "y": 180,
        "wires": [
            [
                "af20c8dcf08b2083"
            ]
        ]
    },
    {
        "id": "5b1375ff07a16753",
        "type": "server-events",
        "z": "7be417f0d3f1e35e",
        "name": "homeassistant_start",
        "server": "11e9f35b.61816d",
        "version": 3,
        "exposeAsEntityConfig": "",
        "eventType": "homeassistant_start",
        "waitForRunning": false,
        "x": 190,
        "y": 240,
        "wires": [
            [
                "af20c8dcf08b2083"
            ]
        ]
    },
    {
        "id": "d4c52365fc016656",
        "type": "server-events",
        "z": "7be417f0d3f1e35e",
        "name": "automation_reloaded",
        "server": "11e9f35b.61816d",
        "version": 3,
        "exposeAsEntityConfig": "",
        "eventType": "automation_reloaded",
        "waitForRunning": false,
        "x": 190,
        "y": 300,
        "wires": [
            [
                "af20c8dcf08b2083"
            ]
        ]
    },
    {
        "id": "af20c8dcf08b2083",
        "type": "api-current-state",
        "z": "7be417f0d3f1e35e",
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
        "entity_location": "holiday_entity",
        "override_data": "msg",
        "x": 500,
        "y": 180,
        "wires": [
            [
                "57126be8eab7caa2"
            ]
        ]
    },
    {
        "id": "57126be8eab7caa2",
        "type": "api-current-state",
        "z": "7be417f0d3f1e35e",
        "name": "Lighting hold inactive?",
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
        "entity_location": "hold_entity",
        "override_data": "msg",
        "x": 780,
        "y": 180,
        "wires": [
            [
                "8dac14baf36d01ef"
            ]
        ]
    },
    {
        "id": "8dac14baf36d01ef",
        "type": "function",
        "z": "7be417f0d3f1e35e",
        "name": "Compute fail-safe actions",
        "func": "\nconst ha = global.get('homeassistant');\nif (!ha || !ha.homeAssistant || !ha.homeAssistant.states) {\n    node.status({ fill: 'red', shape: 'ring', text: 'HA context unavailable' });\n    return null;\n}\nconst states = ha.homeAssistant.states;\nconst getState = (id) => (states[id]?.state || '').toLowerCase();\nconst getTs = (id) => {\n    const raw = states[id]?.attributes?.last_triggered;\n    return raw ? Date.parse(raw) / 1000 : 0;\n};\nconst now = Date.now() / 1000;\nconst sun = states['sun.sun'];\nconst nextRising = sun?.attributes?.next_rising ? Date.parse(sun.attributes.next_rising) / 1000 : 0;\nconst nextSetting = sun?.attributes?.next_setting ? Date.parse(sun.attributes.next_setting) / 1000 : 0;\nconst sunriseLast = nextRising ? nextRising - 86400 : 0;\nconst sunsetLast = nextSetting ? nextSetting - 86400 : 0;\nconst sunriseExpected = sunriseLast ? sunriseLast + 300 : 0;\nconst sunsetExpected = sunsetLast ? sunsetLast + 300 : 0;\nconst midnight = new Date();\nmidnight.setHours(0,0,0,0);\nconst midnightExpected = midnight.getTime() / 1000;\nconst early = new Date();\nearly.setHours(3,30,0,0);\nconst earlyExpected = early.getTime() / 1000;\nconst huskerShowActive = getState('binary_sensor.huskers_light_show_active') === 'on';\nconst automations = [\n    { name: 'Evening Sunset Exterior', entity_id: 'automation.lighting_exterior_front_garage_on_sunset', expected_ts: sunsetExpected, skip: sunsetExpected === 0 },\n    { name: 'Night Mode', entity_id: 'automation.lighting_night_mode_at_midnight', expected_ts: midnightExpected, skip: false },\n    { name: 'Early Morning Gentle Wake', entity_id: 'automation.early_morning_lights_03_30', expected_ts: earlyExpected, skip: false },\n    { name: 'Morning Exterior Off', entity_id: 'automation.lighting_morning_lights_off_sunrise', expected_ts: sunriseExpected, skip: sunriseExpected === 0 || huskerShowActive }\n];\nconst missed = [];\nautomations.forEach(auto => {\n    const expected = Number(auto.expected_ts) || 0;\n    if (auto.skip || expected === 0 || now < expected) {\n        return;\n    }\n    if (getState(auto.entity_id) !== 'on') {\n        return;\n    }\n    const last = getTs(auto.entity_id);\n    if (last < expected) {\n        missed.push({\n            entity_id: auto.entity_id,\n            name: auto.name,\n            log_message: `Re-triggered ${auto.name} automation (${auto.entity_id}) to catch up on missed run.`\n        });\n    }\n});\nconst lastMap = {\n    evening: getTs('automation.lighting_exterior_front_garage_on_sunset'),\n    night: getTs('automation.lighting_night_mode_at_midnight'),\n    early_morning: getTs('automation.early_morning_lights_03_30'),\n    morning_off: getTs('automation.lighting_morning_lights_off_sunrise')\n};\nlet activeProfile = 'unknown';\nconst sorted = Object.entries(lastMap).sort((a,b) => a[1]-b[1]);\nif (sorted.length) {\n    const [profile, ts] = sorted[sorted.length - 1];\n    if (ts && (now - ts) < 90000) {\n        activeProfile = profile;\n    }\n}\nif (activeProfile === 'unknown') {\n    const schedule = [\n        { profile: 'evening', ts: sunsetExpected, skip: sunsetExpected === 0 },\n        { profile: 'night', ts: midnightExpected, skip: false },\n        { profile: 'early_morning', ts: earlyExpected, skip: false },\n        { profile: 'morning_off', ts: sunriseExpected, skip: sunriseExpected === 0 || huskerShowActive }\n    ];\n    let candidate = { profile: 'unknown', ts: 0 };\n    schedule.forEach(item => {\n        if (!item.skip && item.ts && item.ts <= now && item.ts >= candidate.ts) {\n            candidate = { profile: item.profile, ts: item.ts };\n        }\n    });\n    activeProfile = candidate.profile;\n}\nconst front = {\n    entity: 'light.front_porch_lights',\n    expectedState: null,\n    min: 0,\n    max: 0\n};\nconst garage = {\n    entity: 'light.garage_lights',\n    expectedState: null,\n    min: 0,\n    max: 0\n};\nconst led = {\n    entity: 'light.permanent_outdoor_lights',\n    expectedState: null,\n    min: 0,\n    max: 0\n};\nlet correctiveAutomation = '';\nswitch (activeProfile) {\n    case 'evening':\n    case 'early_morning':\n        front.expectedState = 'on';\n        front.min = 1;\n        front.max = 90;\n        garage.expectedState = 'on';\n        garage.min = 1;\n        garage.max = 90;\n        led.expectedState = 'on';\n        led.min = 90;\n        led.max = 200;\n        correctiveAutomation = activeProfile === 'evening' ? 'automation.lighting_exterior_front_garage_on_sunset' : 'automation.early_morning_lights_03_30';\n        break;\n    case 'night':\n        front.expectedState = 'off';\n        garage.expectedState = 'off';\n        led.expectedState = 'on';\n        led.min = 1;\n        led.max = 110;\n        correctiveAutomation = 'automation.lighting_night_mode_at_midnight';\n        break;\n    case 'morning_off':\n        if (huskerShowActive) {\n            correctiveAutomation = '';\n        } else {\n            front.expectedState = 'off';\n            garage.expectedState = 'off';\n            led.expectedState = 'off';\n            correctiveAutomation = 'automation.lighting_morning_lights_off_sunrise';\n        }\n        break;\n    default:\n        correctiveAutomation = '';\n}\nconst getBrightness = (entityId) => Number(states[entityId]?.attributes?.brightness ?? 0);\nconst evaluateNeeds = (target) => {\n    if (!target.expectedState) {\n        return false;\n    }\n    const state = getState(target.entity);\n    if (target.expectedState === 'on') {\n        if (state !== 'on') {\n            return true;\n        }\n        const brightness = getBrightness(target.entity);\n        return brightness < target.min || brightness > target.max;\n    }\n    if (target.expectedState === 'off') {\n        return state !== 'off';\n    }\n    return false;\n};\nconst needsFront = evaluateNeeds(front);\nconst needsGarage = evaluateNeeds(garage);\nconst needsLed = evaluateNeeds(led);\nconst correctionNeeded = Boolean(correctiveAutomation) && (needsFront || needsGarage || needsLed);\nmsg.missed = missed;\nmsg.active_profile = activeProfile;\nmsg.correction_needed = correctionNeeded;\nmsg.correction_automation = correctiveAutomation;\nmsg.correction_message = correctionNeeded ? `Realigned exterior lights for profile ${activeProfile} by re-triggering ${correctiveAutomation}.` : '';\nif (missed.length) {\n    node.status({ fill: 'yellow', shape: 'dot', text: `${activeProfile} retrigger x${missed.length}` });\n} else if (correctionNeeded) {\n    node.status({ fill: 'blue', shape: 'dot', text: `${activeProfile} correction` });\n} else {\n    node.status({ fill: 'green', shape: 'dot', text: activeProfile || 'idle' });\n}\nreturn msg;\n",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 1080,
        "y": 180,
        "wires": [
            [
                "5ba425bc38399874",
                "40ad6f3ebef13967"
            ]
        ]
    },
    {
        "id": "5ba425bc38399874",
        "type": "split",
        "z": "7be417f0d3f1e35e",
        "name": "Each missed automation",
        "splt": "\\n",
        "spltType": "str",
        "arraySplt": "1",
        "arraySpltType": "len",
        "stream": false,
        "addname": "",
        "property": "missed",
        "x": 1340,
        "y": 140,
        "wires": [
            [
                "60abc7248edf3df1"
            ]
        ]
    },
    {
        "id": "60abc7248edf3df1",
        "type": "api-call-service",
        "z": "7be417f0d3f1e35e",
        "name": "Trigger automation",
        "server": "11e9f35b.61816d",
        "version": 7,
        "debugenabled": false,
        "action": "automation.trigger",
        "floorId": [],
        "areaId": [],
        "deviceId": [],
        "entityId": [
            "{{payload.entity_id}}"
        ],
        "labelId": [],
        "data": "{}",
        "dataType": "json",
        "mergeContext": "",
        "mustacheAltTags": false,
        "outputProperties": [],
        "queue": "none",
        "blockInputOverrides": false,
        "domain": "automation",
        "service": "trigger",
        "x": 1570,
        "y": 120,
        "wires": [
            [
                "4ec9676bf7ded5e6"
            ]
        ]
    },
    {
        "id": "4ec9676bf7ded5e6",
        "type": "api-call-service",
        "z": "7be417f0d3f1e35e",
        "name": "Log fail-safe retrigger",
        "server": "11e9f35b.61816d",
        "version": 7,
        "debugenabled": false,
        "action": "logbook.log",
        "data": "{\"entity_id\":\"automation.exterior_lights_fail_safe_validator\",\"name\":\"Exterior Lighting Fail-safe\",\"message\":\"{{payload.log_message}}\"}",
        "dataType": "json",
        "mergeContext": "",
        "mustacheAltTags": false,
        "outputProperties": [],
        "queue": "none",
        "blockInputOverrides": false,
        "domain": "logbook",
        "service": "log",
        "x": 1840,
        "y": 120,
        "wires": [
            []
        ]
    },
    {
        "id": "40ad6f3ebef13967",
        "type": "switch",
        "z": "7be417f0d3f1e35e",
        "name": "Needs correction?",
        "property": "correction_needed",
        "propertyType": "msg",
        "rules": [
            {
                "t": "true"
            }
        ],
        "checkall": "true",
        "repair": false,
        "outputs": 1,
        "x": 1340,
        "y": 220,
        "wires": [
            [
                "bb562dbc062af12c"
            ]
        ]
    },
    {
        "id": "bb562dbc062af12c",
        "type": "api-call-service",
        "z": "7be417f0d3f1e35e",
        "name": "Trigger corrective automation",
        "server": "11e9f35b.61816d",
        "version": 7,
        "debugenabled": false,
        "action": "automation.trigger",
        "floorId": [],
        "areaId": [],
        "deviceId": [],
        "entityId": [
            "{{correction_automation}}"
        ],
        "labelId": [],
        "data": "{}",
        "dataType": "json",
        "mergeContext": "",
        "mustacheAltTags": false,
        "outputProperties": [],
        "queue": "none",
        "blockInputOverrides": false,
        "domain": "automation",
        "service": "trigger",
        "x": 1580,
        "y": 220,
        "wires": [
            [
                "cea2bda39821bb81"
            ]
        ]
    },
    {
        "id": "cea2bda39821bb81",
        "type": "api-call-service",
        "z": "7be417f0d3f1e35e",
        "name": "Log correction",
        "server": "11e9f35b.61816d",
        "version": 7,
        "debugenabled": false,
        "action": "logbook.log",
        "data": "{\"entity_id\":\"automation.exterior_lights_fail_safe_validator\",\"name\":\"Exterior Lighting Fail-safe\",\"message\":\"{{correction_message}}\"}",
        "dataType": "json",
        "mergeContext": "",
        "mustacheAltTags": false,
        "outputProperties": [],
        "queue": "none",
        "blockInputOverrides": false,
        "domain": "logbook",
        "service": "log",
        "x": 1840,
        "y": 220,
        "wires": [
            []
        ]
    },
    {
        "id": "3c7410649b96e3f9",
        "type": "server-events",
        "z": "7be417f0d3f1e35e",
        "name": "homeassistant_start",
        "server": "11e9f35b.61816d",
        "version": 3,
        "exposeAsEntityConfig": "",
        "eventType": "homeassistant_start",
        "waitForRunning": false,
        "x": 180,
        "y": 420,
        "wires": [
            [
                "1f42054fc0556624"
            ]
        ]
    },
    {
        "id": "de75e02cdb645c31",
        "type": "inject",
        "z": "7be417f0d3f1e35e",
        "name": "Daily effect check",
        "props": [
            {
                "p": "payload"
            }
        ],
        "repeat": "",
        "crontab": "1 0 * * *",
        "once": false,
        "onceDelay": 0,
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "x": 170,
        "y": 360,
        "wires": [
            [
                "1f42054fc0556624"
            ]
        ]
    },
    {
        "id": "d9b60981b1026301",
        "type": "server-state-changed",
        "z": "7be417f0d3f1e35e",
        "name": "LEDs became available?",
        "server": "11e9f35b.61816d",
        "version": 6,
        "outputs": 1,
        "exposeAsEntityConfig": "",
        "entities": {
            "entity": [
                "light.permanent_outdoor_lights"
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
        "ignoreCurrentStateUnknown": false,
        "ignoreCurrentStateUnavailable": false,
        "outputProperties": [],
        "x": 200,
        "y": 480,
        "wires": [
            [
                "f321c9f09264e4cd"
            ]
        ]
    },
    {
        "id": "f321c9f09264e4cd",
        "type": "function",
        "z": "7be417f0d3f1e35e",
        "name": "Gate on availability",
        "func": "const data = msg.data || {};\nconst unavailable = ['unknown','unavailable',null,''];\nconst oldState = (data.old_state?.state || '').toLowerCase();\nconst newState = (data.new_state?.state || '').toLowerCase();\nif (!unavailable.includes(oldState) || unavailable.includes(newState)) {\n    return null;\n}\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 460,
        "y": 480,
        "wires": [
            [
                "1f42054fc0556624"
            ]
        ]
    },
    {
        "id": "1f42054fc0556624",
        "type": "api-current-state",
        "z": "7be417f0d3f1e35e",
        "name": "Holiday mode off? (LED)",
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
        "entity_location": "holiday_entity",
        "override_data": "msg",
        "x": 760,
        "y": 420,
        "wires": [
            [
                "8b943b66e319644e"
            ]
        ]
    },
    {
        "id": "8b943b66e319644e",
        "type": "function",
        "z": "7be417f0d3f1e35e",
        "name": "Build LED job",
        "func": "const now = new Date();\nconst month = now.getMonth() + 1;\nconst configs = {\n    1: { scene: 'scene.lighting_exterior_led_effect_january', effect: 'LED-January' },\n    2: { scene: 'scene.lighting_exterior_led_effect_february', effect: 'LED-February' },\n    3: { scene: 'scene.lighting_exterior_led_effect_march', effect: 'LED-March' },\n    4: { scene: 'scene.lighting_exterior_led_effect_april', effect: 'LED-April' },\n    5: { scene: 'scene.lighting_exterior_led_effect_patriotic', effect: 'BSMT-Patriotic' },\n    6: { scene: 'scene.lighting_exterior_led_effect_patriotic', effect: 'BSMT-Patriotic' },\n    7: { scene: 'scene.lighting_exterior_led_effect_patriotic', effect: 'BSMT-Patriotic' },\n    8: { scene: 'scene.lighting_exterior_led_effect_august', effect: 'LED-August' },\n    9: { scene: 'scene.lighting_exterior_led_effect_august', effect: 'LED-August' },\n    10:{ scene: 'scene.lighting_exterior_led_effect_halloween', effect: 'Halloween' },\n    11:{ scene: 'scene.lighting_exterior_led_effect_thanksgiving', effect: 'LED-Thanksgiving' },\n    12:{ scene: 'scene.lighting_exterior_led_effect_christmas', effect: 'Christmas' }\n};\nconst config = configs[month] || {};\nif (!config.effect) {\n    node.status({ fill: 'grey', shape: 'ring', text: 'no monthly effect' });\n    return null;\n}\nmsg.light_entity = 'light.permanent_outdoor_lights';\nmsg.target_scene = config.scene || '';\nmsg.target_effect = config.effect;\nmsg.current_month = month;\nmsg.max_attempts = 6;\nmsg.attempt = 0;\nmsg.retry_reason = '';\nnode.status({ fill: 'blue', shape: 'ring', text: `target ${config.effect}` });\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 1050,
        "y": 420,
        "wires": [
            [
                "7e4d53bb454cd827"
            ]
        ]
    },
    {
        "id": "7e4d53bb454cd827",
        "type": "function",
        "z": "7be417f0d3f1e35e",
        "name": "LED readiness",
        "func": "const ha = global.get('homeassistant');\nif (!ha || !ha.homeAssistant || !ha.homeAssistant.states) {\n    node.status({ fill: 'red', shape: 'ring', text: 'HA context unavailable' });\n    return null;\n}\nconst states = ha.homeAssistant.states;\nconst unavailable = ['unknown','unavailable','none',''];\nconst light = states[msg.light_entity];\nconst state = (light?.state || '').toLowerCase();\nconst effectList = Array.isArray(light?.attributes?.effect_list) ? light.attributes.effect_list : [];\nmsg.current_effect = light?.attributes?.effect || '';\nconst available = !!light && !unavailable.includes(state);\nconst hasEffect = available && effectList.includes(msg.target_effect);\nconst attempt = msg.attempt || 0;\nif (!available || !hasEffect) {\n    if (attempt >= (msg.max_attempts || 6)) {\n        msg.fail_message = `Skipped ${msg.target_effect} for month ${msg.current_month} -- ${available ? 'effect missing' : 'light unavailable'}.`;\n        node.status({ fill: 'red', shape: 'ring', text: 'LED unavailable' });\n        return [null, null, msg];\n    }\n    msg.attempt = attempt + 1;\n    msg.retry_reason = available ? 'effect missing' : 'light offline';\n    msg.needs_update = available;\n    node.status({ fill: 'yellow', shape: 'ring', text: msg.retry_reason });\n    return [null, msg, null];\n}\nmsg.needs_update = false;\nreturn [msg, null, null];",
        "outputs": 3,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 1310,
        "y": 420,
        "wires": [
            [
                "d13a96a112c636d1"
            ],
            [
                "751c40f1462ec196"
            ],
            [
                "1659c7f36930922d"
            ]
        ]
    },
    {
        "id": "d13a96a112c636d1",
        "type": "function",
        "z": "7be417f0d3f1e35e",
        "name": "Need to apply?",
        "func": "const current = (msg.current_effect || '').toString();\nif (current === msg.target_effect) {\n    msg.apply_needed = false;\n    msg.log_message = `Applied ${msg.target_effect} for month ${msg.current_month} (scene ${msg.target_scene || 'not used'})`;\n    node.status({ fill: 'green', shape: 'dot', text: 'effect confirmed' });\n} else {\n    msg.apply_needed = true;\n}\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 1550,
        "y": 360,
        "wires": [
            [
                "a7be6f997e173741"
            ]
        ]
    },
    {
        "id": "a7be6f997e173741",
        "type": "switch",
        "z": "7be417f0d3f1e35e",
        "name": "Apply effect?",
        "property": "apply_needed",
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
        "x": 1770,
        "y": 360,
        "wires": [
            [
                "90f6dfd4de62b1ae"
            ],
            [
                "8a082661d7873ce4"
            ]
        ]
    },
    {
        "id": "90f6dfd4de62b1ae",
        "type": "switch",
        "z": "7be417f0d3f1e35e",
        "name": "Scene required?",
        "property": "target_scene",
        "propertyType": "msg",
        "rules": [
            {
                "t": "neq",
                "v": "",
                "vt": "str"
            }
        ],
        "checkall": "true",
        "repair": false,
        "outputs": 1,
        "x": 1990,
        "y": 320,
        "wires": [
            [
                "a9076575d7c495fd"
            ]
        ]
    },
    {
        "id": "a9076575d7c495fd",
        "type": "api-call-service",
        "z": "7be417f0d3f1e35e",
        "name": "Apply LED scene",
        "server": "11e9f35b.61816d",
        "version": 7,
        "debugenabled": false,
        "action": "scene.turn_on",
        "floorId": [],
        "areaId": [],
        "deviceId": [],
        "entityId": [
            "{{target_scene}}"
        ],
        "labelId": [],
        "data": "{}",
        "dataType": "json",
        "mergeContext": "",
        "mustacheAltTags": false,
        "outputProperties": [],
        "queue": "none",
        "blockInputOverrides": false,
        "domain": "scene",
        "service": "turn_on",
        "x": 2200,
        "y": 320,
        "wires": [
            [
                "3a777b14cc20af7b"
            ]
        ]
    },
    {
        "id": "3a777b14cc20af7b",
        "type": "api-call-service",
        "z": "7be417f0d3f1e35e",
        "name": "Apply LED effect",
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
        "data": "{\"effect\":\"{{target_effect}}\",\"transition\":2}",
        "dataType": "json",
        "mergeContext": "",
        "mustacheAltTags": false,
        "outputProperties": [],
        "queue": "none",
        "blockInputOverrides": false,
        "domain": "light",
        "service": "turn_on",
        "x": 2440,
        "y": 360,
        "wires": [
            [
                "174c2239c6d01232"
            ]
        ]
    },
    {
        "id": "174c2239c6d01232",
        "type": "delay",
        "z": "7be417f0d3f1e35e",
        "name": "Verify after 5s",
        "pauseType": "delay",
        "timeout": "5",
        "timeoutUnits": "seconds",
        "rate": "1",
        "nbRateUnits": "1",
        "rateUnits": "second",
        "randomFirst": "0",
        "randomLast": "0",
        "randomUnits": "seconds",
        "drop": false,
        "allowrate": false,
        "outputs": 1,
        "x": 2690,
        "y": 360,
        "wires": [
            [
                "81ea520c097478fe"
            ]
        ]
    },
    {
        "id": "81ea520c097478fe",
        "type": "api-current-state",
        "z": "7be417f0d3f1e35e",
        "name": "Read LED effect",
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
                "property": "light_effect",
                "propertyType": "msg",
                "value": "data.attributes.effect",
                "valueType": "jsonata"
            }
        ],
        "for": "0",
        "forType": "num",
        "forUnits": "minutes",
        "override_topic": false,
        "state_location": "payload",
        "override_payload": "msg",
        "entity_location": "led_entity_state",
        "override_data": "msg",
        "x": 2940,
        "y": 360,
        "wires": [
            [
                "31ccadd4f0ced727"
            ]
        ]
    },
    {
        "id": "31ccadd4f0ced727",
        "type": "function",
        "z": "7be417f0d3f1e35e",
        "name": "Validate LED result",
        "func": "const effect = (msg.light_effect || '').toString();\nif (effect === msg.target_effect) {\n    msg.log_message = `Applied ${msg.target_effect} for month ${msg.current_month} (scene ${msg.target_scene || 'not used'})`;\n    node.status({ fill: 'green', shape: 'dot', text: 'effect confirmed' });\n    return [msg, null, null];\n}\nmsg.retry_reason = 'not confirmed';\nmsg.needs_update = true;\nmsg.fail_message = `Skipped ${msg.target_effect} for month ${msg.current_month} -- effect never confirmed after retries`;\nconst attempt = msg.attempt || 0;\nif (attempt >= (msg.max_attempts || 6)) {\n    node.status({ fill: 'red', shape: 'ring', text: 'effect failed' });\n    return [null, null, msg];\n}\nmsg.attempt = attempt + 1;\nnode.status({ fill: 'yellow', shape: 'ring', text: 'retrying' });\nreturn [null, msg, null];",
        "outputs": 3,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 3200,
        "y": 360,
        "wires": [
            [
                "8a082661d7873ce4"
            ],
            [
                "751c40f1462ec196"
            ],
            [
                "1659c7f36930922d"
            ]
        ]
    },
    {
        "id": "751c40f1462ec196",
        "type": "switch",
        "z": "7be417f0d3f1e35e",
        "name": "Need refresh?",
        "property": "needs_update",
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
        "x": 1700,
        "y": 520,
        "wires": [
            [
                "51561a4a4ac867e7"
            ],
            [
                "cab62d7979ddd75c"
            ]
        ]
    },
    {
        "id": "51561a4a4ac867e7",
        "type": "api-call-service",
        "z": "7be417f0d3f1e35e",
        "name": "Refresh LED state",
        "server": "11e9f35b.61816d",
        "version": 7,
        "debugenabled": false,
        "action": "homeassistant.update_entity",
        "floorId": [],
        "areaId": [],
        "deviceId": [],
        "entityId": [
            "{{light_entity}}"
        ],
        "labelId": [],
        "data": "{}",
        "dataType": "json",
        "mergeContext": "",
        "mustacheAltTags": false,
        "outputProperties": [],
        "queue": "none",
        "blockInputOverrides": false,
        "domain": "homeassistant",
        "service": "update_entity",
        "x": 1940,
        "y": 500,
        "wires": [
            [
                "cab62d7979ddd75c"
            ]
        ]
    },
    {
        "id": "cab62d7979ddd75c",
        "type": "delay",
        "z": "7be417f0d3f1e35e",
        "name": "Retry in 10s",
        "pauseType": "delay",
        "timeout": "10",
        "timeoutUnits": "seconds",
        "rate": "1",
        "nbRateUnits": "1",
        "rateUnits": "second",
        "randomFirst": "0",
        "randomLast": "0",
        "randomUnits": "seconds",
        "drop": false,
        "allowrate": false,
        "outputs": 1,
        "x": 2170,
        "y": 540,
        "wires": [
            [
                "7e4d53bb454cd827"
            ]
        ]
    },
    {
        "id": "8a082661d7873ce4",
        "type": "api-call-service",
        "z": "7be417f0d3f1e35e",
        "name": "Log LED success",
        "server": "11e9f35b.61816d",
        "version": 7,
        "debugenabled": false,
        "action": "logbook.log",
        "data": "{\"entity_id\":\"automation.exterior_led_monthly_effect\",\"name\":\"LED Monthly Effect\",\"message\":\"{{log_message}}\"}",
        "dataType": "json",
        "mergeContext": "",
        "mustacheAltTags": false,
        "outputProperties": [],
        "queue": "none",
        "blockInputOverrides": false,
        "domain": "logbook",
        "service": "log",
        "x": 2050,
        "y": 260,
        "wires": [
            []
        ]
    },
    {
        "id": "1659c7f36930922d",
        "type": "api-call-service",
        "z": "7be417f0d3f1e35e",
        "name": "Log LED failure",
        "server": "11e9f35b.61816d",
        "version": 7,
        "debugenabled": false,
        "action": "logbook.log",
        "data": "{\"entity_id\":\"automation.exterior_led_monthly_effect\",\"name\":\"LED Monthly Effect\",\"message\":\"{{fail_message}}\"}",
        "dataType": "json",
        "mergeContext": "",
        "mustacheAltTags": false,
        "outputProperties": [],
        "queue": "none",
        "blockInputOverrides": false,
        "domain": "logbook",
        "service": "log",
        "x": 3470,
        "y": 460,
        "wires": [
            []
        ]
    },
    {
        "id": "9af8d2728e09c71f",
        "type": "server-state-changed",
        "z": "b0ce83b4c7194f6d",
        "name": "Humidor temp change",
        "server": "11e9f35b.61816d",
        "version": 6,
        "outputs": 1,
        "exposeAsEntityConfig": "",
        "entities": {
            "entity": [
                "sensor.hygrometer_humidor_temperature"
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
        "x": 220,
        "y": 140,
        "wires": [
            [
                "08dd4f7a91aeb61f"
            ]
        ]
    },
    {
        "id": "08dd4f7a91aeb61f",
        "type": "function",
        "z": "b0ce83b4c7194f6d",
        "name": "Humidor evaluation",
        "func": "const ha = global.get('homeassistant');\nif (!ha || !ha.homeAssistant || !ha.homeAssistant.states) {\n    return null;\n}\nconst states = ha.homeAssistant.states;\nconst holiday = (states['binary_sensor.holiday_mode_active']?.state || '').toLowerCase() === 'on';\nif (holiday) {\n    context.set('highSince', 0);\n    context.set('lowSince', 0);\n    return null;\n}\nconst temp = Number(msg.payload);\nif (Number.isNaN(temp)) {\n    return null;\n}\nconst plugOn = (states['switch.plug_humidor']?.state || '').toLowerCase() === 'on';\nconst now = Date.now();\nlet highSince = context.get('highSince') || 0;\nlet lowSince = context.get('lowSince') || 0;\nif (temp > 74 && !plugOn) {\n    if (!highSince) highSince = now;\n} else {\n    highSince = 0;\n}\nif (temp < 70 && plugOn) {\n    if (!lowSince) lowSince = now;\n} else {\n    lowSince = 0;\n}\ncontext.set('highSince', highSince);\ncontext.set('lowSince', lowSince);\nlet action = null;\nif (highSince && temp > 74 && !plugOn && (now - highSince) >= 120000) {\n    action = 'cool_on';\n    context.set('highSince', now);\n}\nif (lowSince && temp < 70 && plugOn && (now - lowSince) >= 60000) {\n    action = 'cool_off';\n    context.set('lowSince', now);\n}\nif (!action) {\n    return null;\n}\nconst humidity = states['sensor.hygrometer_humidor_humidity']?.state || '?';\nmsg.action = action;\nmsg.scene_entity = action === 'cool_on' ? 'scene.climate_humidor_cooling_on' : 'scene.climate_humidor_cooling_off';\nmsg.log_message = `${action === 'cool_on' ? 'Cooling ON' : 'Cooling OFF'} - Temperature: ${temp.toFixed(1)}°F - Humidity: ${humidity}%`;\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 500,
        "y": 140,
        "wires": [
            [
                "cdd7364d4067dd4c"
            ]
        ]
    },
    {
        "id": "cdd7364d4067dd4c",
        "type": "switch",
        "z": "b0ce83b4c7194f6d",
        "name": "Cooling action?",
        "property": "action",
        "propertyType": "msg",
        "rules": [
            {
                "t": "eq",
                "v": "cool_on",
                "vt": "str"
            },
            {
                "t": "eq",
                "v": "cool_off",
                "vt": "str"
            }
        ],
        "checkall": "true",
        "repair": false,
        "outputs": 2,
        "x": 760,
        "y": 140,
        "wires": [
            [
                "841c5c17ee1a3218"
            ],
            [
                "841c5c17ee1a3218"
            ]
        ]
    },
    {
        "id": "841c5c17ee1a3218",
        "type": "api-call-service",
        "z": "b0ce83b4c7194f6d",
        "name": "Apply humidor scene",
        "server": "11e9f35b.61816d",
        "version": 7,
        "debugenabled": false,
        "action": "scene.turn_on",
        "floorId": [],
        "areaId": [],
        "deviceId": [],
        "entityId": [
            "{{scene_entity}}"
        ],
        "labelId": [],
        "data": "{}",
        "dataType": "json",
        "mergeContext": "",
        "mustacheAltTags": false,
        "outputProperties": [],
        "queue": "none",
        "blockInputOverrides": false,
        "domain": "scene",
        "service": "turn_on",
        "x": 1000,
        "y": 120,
        "wires": [
            [
                "9337a1b9f6f7dd4f"
            ]
        ]
    },
    {
        "id": "9337a1b9f6f7dd4f",
        "type": "api-call-service",
        "z": "b0ce83b4c7194f6d",
        "name": "Log humidor action",
        "server": "11e9f35b.61816d",
        "version": 7,
        "debugenabled": false,
        "action": "logbook.log",
        "data": "{\"entity_id\":\"automation.humidor_plug_temp_control\",\"name\":\"Humidor Control\",\"message\":\"{{log_message}}\"}",
        "dataType": "json",
        "mergeContext": "",
        "mustacheAltTags": false,
        "outputProperties": [],
        "queue": "none",
        "blockInputOverrides": false,
        "domain": "logbook",
        "service": "log",
        "x": 1220,
        "y": 120,
        "wires": [
            []
        ]
    },
    {
        "id": "f7882aff5c51e24a",
        "type": "inject",
        "z": "b0ce83b4c7194f6d",
        "name": "Nightly burner shutoff",
        "props": [
            {
                "p": "payload"
            }
        ],
        "repeat": "",
        "crontab": "0 23 * * *",
        "once": false,
        "onceDelay": 0,
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "x": 220,
        "y": 320,
        "wires": [
            [
                "055e23be6c350b32"
            ]
        ]
    },
    {
        "id": "055e23be6c350b32",
        "type": "api-current-state",
        "z": "b0ce83b4c7194f6d",
        "name": "Holiday mode off? (burner)",
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
        "entity_location": "holiday_entity",
        "override_data": "msg",
        "x": 520,
        "y": 320,
        "wires": [
            [
                "53b5648669e6caab"
            ]
        ]
    },
    {
        "id": "53b5648669e6caab",
        "type": "api-call-service",
        "z": "b0ce83b4c7194f6d",
        "name": "Turn burners off",
        "server": "11e9f35b.61816d",
        "version": 7,
        "debugenabled": false,
        "action": "scene.turn_on",
        "floorId": [],
        "areaId": [],
        "deviceId": [],
        "entityId": [
            "scene.safety_burner_plugs_off"
        ],
        "labelId": [],
        "data": "{}",
        "dataType": "json",
        "mergeContext": "",
        "mustacheAltTags": false,
        "outputProperties": [],
        "queue": "none",
        "blockInputOverrides": false,
        "domain": "scene",
        "service": "turn_on",
        "x": 780,
        "y": 320,
        "wires": [
            [
                "49ecb4966da9542a"
            ]
        ]
    },
    {
        "id": "49ecb4966da9542a",
        "type": "api-call-service",
        "z": "b0ce83b4c7194f6d",
        "name": "Notify burner shutoff",
        "server": "11e9f35b.61816d",
        "version": 7,
        "debugenabled": false,
        "action": "persistent_notification.create",
        "data": "{\"title\":\"Safety: Burner Plugs\",\"message\":\"All burner plugs turned off at 11 PM.\",\"notification_id\":\"nightly_burner_shutoff\"}",
        "dataType": "json",
        "mergeContext": "",
        "mustacheAltTags": false,
        "outputProperties": [],
        "queue": "none",
        "blockInputOverrides": false,
        "domain": "persistent_notification",
        "service": "create",
        "x": 1040,
        "y": 320,
        "wires": [
            [
                "36dfb59682ef5f2b"
            ]
        ]
    },
    {
        "id": "36dfb59682ef5f2b",
        "type": "api-call-service",
        "z": "b0ce83b4c7194f6d",
        "name": "Log burner shutoff",
        "server": "11e9f35b.61816d",
        "version": 7,
        "debugenabled": false,
        "action": "logbook.log",
        "data": "{\"entity_id\":\"automation.burner_plugs_off_2300\",\"name\":\"Safety Automation\",\"message\":\"Nightly burner plug shutoff completed\"}",
        "dataType": "json",
        "mergeContext": "",
        "mustacheAltTags": false,
        "outputProperties": [],
        "queue": "none",
        "blockInputOverrides": false,
        "domain": "logbook",
        "service": "log",
        "x": 1300,
        "y": 320,
        "wires": [
            []
        ]
    },
    {
        "id": "2f5ebc7537fd1211",
        "type": "server-events",
        "z": "b0ce83b4c7194f6d",
        "name": "homeassistant_start",
        "server": "11e9f35b.61816d",
        "version": 3,
        "exposeAsEntityConfig": "",
        "eventType": "homeassistant_start",
        "waitForRunning": false,
        "x": 220,
        "y": 500,
        "wires": [
            [
                "df11b3a598ab5892"
            ]
        ]
    },
    {
        "id": "848cd18610cf1799",
        "type": "inject",
        "z": "b0ce83b4c7194f6d",
        "name": "Manual warmup",
        "props": [
            {
                "p": "payload"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0,
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "x": 220,
        "y": 560,
        "wires": [
            [
                "df11b3a598ab5892"
            ]
        ]
    },
    {
        "id": "df11b3a598ab5892",
        "type": "function",
        "z": "b0ce83b4c7194f6d",
        "name": "Build warmup queue",
        "func": "msg.cameras = [\n    'camera.backyard_camera_fluent',\n    'camera.argus_pt_ultra_fluent',\n    'camera.garage_cam_fluent'\n];\nmsg.warmup_delay_sec = 5;\nmsg.sensors = [\n    'binary_sensor.backyard_camera_motion',\n    'binary_sensor.argus_pt_ultra_motion',\n    'binary_sensor.garage_cam_motion'\n];\nnode.status({ fill: 'blue', shape: 'ring', text: `warming ${msg.cameras.length} cams` });\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 500,
        "y": 520,
        "wires": [
            [
                "ef908728ad76aed7",
                "535e4e968f9d08b8"
            ]
        ]
    },
    {
        "id": "ef908728ad76aed7",
        "type": "split",
        "z": "b0ce83b4c7194f6d",
        "name": "Each camera",
        "splt": "\\n",
        "spltType": "str",
        "arraySplt": "1",
        "arraySpltType": "len",
        "stream": false,
        "addname": "",
        "property": "cameras",
        "x": 720,
        "y": 480,
        "wires": [
            [
                "34dbdac7dcdc6dda"
            ]
        ]
    },
    {
        "id": "34dbdac7dcdc6dda",
        "type": "function",
        "z": "b0ce83b4c7194f6d",
        "name": "Camera context",
        "func": "const entity = msg.payload;\nmsg.camera_entity = entity;\nmsg.camera_slug = entity.split('.').pop();\nmsg.payload = null;\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 920,
        "y": 480,
        "wires": [
            [
                "8ae974652288aa9e"
            ]
        ]
    },
    {
        "id": "8ae974652288aa9e",
        "type": "delay",
        "z": "b0ce83b4c7194f6d",
        "name": "Space snapshots",
        "pauseType": "rate",
        "timeout": "5",
        "timeoutUnits": "seconds",
        "rate": "1",
        "nbRateUnits": "5",
        "rateUnits": "second",
        "randomFirst": "0",
        "randomLast": "0",
        "randomUnits": "seconds",
        "drop": false,
        "allowrate": true,
        "outputs": 1,
        "x": 1140,
        "y": 480,
        "wires": [
            [
                "6749919cacf2c7f8"
            ]
        ]
    },
    {
        "id": "6749919cacf2c7f8",
        "type": "api-call-service",
        "z": "b0ce83b4c7194f6d",
        "name": "Prime snapshot",
        "server": "11e9f35b.61816d",
        "version": 7,
        "debugenabled": false,
        "action": "camera.snapshot",
        "floorId": [],
        "areaId": [],
        "deviceId": [],
        "entityId": [
            "{{camera_entity}}"
        ],
        "labelId": [],
        "data": "{\"filename\":\"/config/www/reolink_warmup/{{camera_slug}}.jpg\"}",
        "dataType": "json",
        "mergeContext": "",
        "mustacheAltTags": false,
        "outputProperties": [],
        "queue": "none",
        "blockInputOverrides": false,
        "domain": "camera",
        "service": "snapshot",
        "x": 1360,
        "y": 480,
        "wires": [
            []
        ]
    },
    {
        "id": "535e4e968f9d08b8",
        "type": "delay",
        "z": "b0ce83b4c7194f6d",
        "name": "Settle 25s",
        "pauseType": "delay",
        "timeout": "25",
        "timeoutUnits": "seconds",
        "rate": "1",
        "nbRateUnits": "1",
        "rateUnits": "second",
        "randomFirst": "0",
        "randomLast": "0",
        "randomUnits": "seconds",
        "drop": false,
        "allowrate": false,
        "outputs": 1,
        "x": 720,
        "y": 600,
        "wires": [
            [
                "ea757bdd858d9b18"
            ]
        ]
    },
    {
        "id": "ea757bdd858d9b18",
        "type": "api-call-service",
        "z": "b0ce83b4c7194f6d",
        "name": "Refresh motion sensors",
        "server": "11e9f35b.61816d",
        "version": 7,
        "debugenabled": false,
        "action": "homeassistant.update_entity",
        "floorId": [],
        "areaId": [],
        "deviceId": [],
        "entityId": [
            "binary_sensor.backyard_camera_motion",
            "binary_sensor.argus_pt_ultra_motion",
            "binary_sensor.garage_cam_motion"
        ],
        "labelId": [],
        "data": "{}",
        "dataType": "json",
        "mergeContext": "",
        "mustacheAltTags": false,
        "outputProperties": [],
        "queue": "none",
        "blockInputOverrides": false,
        "domain": "homeassistant",
        "service": "update_entity",
        "x": 980,
        "y": 600,
        "wires": [
            []
        ]
    },
    {
        "id": "9314e019d9b4b746",
        "type": "server-state-changed",
        "z": "5bf285a455077f62",
        "name": "Start button pressed",
        "server": "11e9f35b.61816d",
        "version": 6,
        "outputs": 1,
        "exposeAsEntityConfig": "",
        "entities": {
            "entity": [
                "input_button.lighting_halloween_cycle"
            ],
            "substring": [],
            "regex": []
        },
        "outputInitially": false,
        "stateType": "str",
        "ifState": "",
        "ifStateType": "str",
        "outputOnlyOnStateChange": false,
        "for": "0",
        "forType": "num",
        "forUnits": "minutes",
        "ignorePrevStateNull": true,
        "ignorePrevStateUnknown": true,
        "ignorePrevStateUnavailable": true,
        "ignoreCurrentStateUnknown": true,
        "ignoreCurrentStateUnavailable": true,
        "outputProperties": [],
        "x": 200,
        "y": 80,
        "wires": [
            [
                "cd72f6d25de18601"
            ]
        ]
    },
    {
        "id": "cd72f6d25de18601",
        "type": "function",
        "z": "5bf285a455077f62",
        "name": "Init: palette, settings",
        "func": "const colors = [[255,140,0],[0,100,0],[75,0,130],[139,0,0]];\nflow.set('halloweenPalette', colors);\nflow.set('transition_secs', 2);\nflow.set('brightness_pct', 35);\nflow.set('stop_flag', false);\nreturn msg;",
        "outputs": 1,
        "timeout": "",
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 730,
        "y": 80,
        "wires": [
            [
                "d3adbf3443b33bf1",
                "a9e724e2d7142acc",
                "d532c1a95c43f1e7",
                "b21de141a245530c",
                "dd46a01a1cede0e2"
            ]
        ]
    },
    {
        "id": "d3adbf3443b33bf1",
        "type": "function",
        "z": "5bf285a455077f62",
        "name": "Front Left: next random color",
        "func": "const colors = flow.get('halloweenPalette'); const pick = colors[Math.floor(Math.random()*colors.length)]; const transition = flow.get('transition_secs') || 2; const brightness_pct = flow.get('brightness_pct') || 35; msg.payload = { rgb_color: pick, brightness_pct, transition }; return msg;",
        "outputs": 1,
        "x": 240,
        "y": 160,
        "wires": [
            [
                "3e70056b035153d1"
            ]
        ]
    },
    {
        "id": "3e70056b035153d1",
        "type": "api-call-service",
        "z": "5bf285a455077f62",
        "name": "Front Left → apply",
        "server": "11e9f35b.61816d",
        "version": 7,
        "action": "light.turn_on",
        "entityId": [
            "light.light_front_left"
        ],
        "data": "payload",
        "dataType": "jsonata",
        "x": 520,
        "y": 160,
        "wires": [
            [
                "64f895060458263f"
            ]
        ]
    },
    {
        "id": "64f895060458263f",
        "type": "delay",
        "z": "5bf285a455077f62",
        "name": "Front Left: random wait (15–20s)",
        "pauseType": "delay",
        "timeout": "20",
        "timeoutUnits": "seconds",
        "rate": "0",
        "nbRateUnits": "1",
        "rateUnits": "second",
        "randomFirst": "15",
        "randomLast": "20",
        "randomUnits": "seconds",
        "drop": false,
        "allowrate": false,
        "outputs": 1,
        "x": 830,
        "y": 160,
        "wires": [
            [
                "c95d6453e66b72f1"
            ]
        ]
    },
    {
        "id": "c95d6453e66b72f1",
        "type": "function",
        "z": "5bf285a455077f62",
        "name": "Stop requested?",
        "func": "if (flow.get('stop_flag')) { return [msg, null]; }\nreturn [null, msg];",
        "outputs": 2,
        "timeout": "",
        "noerr": 0,
        "x": 1090,
        "y": 160,
        "wires": [
            [
                "9b7927a6968f356a"
            ],
            [
                "d3adbf3443b33bf1"
            ]
        ]
    },
    {
        "id": "a9e724e2d7142acc",
        "type": "function",
        "z": "5bf285a455077f62",
        "name": "Front Right: next random color",
        "func": "const colors = flow.get('halloweenPalette'); const pick = colors[Math.floor(Math.random()*colors.length)]; const transition = flow.get('transition_secs') || 2; const brightness_pct = flow.get('brightness_pct') || 35; msg.payload = { rgb_color: pick, brightness_pct, transition }; return msg;",
        "outputs": 1,
        "x": 250,
        "y": 220,
        "wires": [
            [
                "7d857a17c7993990"
            ]
        ]
    },
    {
        "id": "7d857a17c7993990",
        "type": "api-call-service",
        "z": "5bf285a455077f62",
        "name": "Front Right → apply",
        "server": "11e9f35b.61816d",
        "version": 7,
        "action": "light.turn_on",
        "entityId": [
            "light.light_front_right"
        ],
        "data": "payload",
        "dataType": "jsonata",
        "x": 520,
        "y": 220,
        "wires": [
            [
                "6b0c33c6c3329140"
            ]
        ]
    },
    {
        "id": "6b0c33c6c3329140",
        "type": "delay",
        "z": "5bf285a455077f62",
        "name": "Front Right: random wait (15–20s)",
        "pauseType": "delay",
        "timeout": "20",
        "timeoutUnits": "seconds",
        "rate": "0",
        "nbRateUnits": "1",
        "rateUnits": "second",
        "randomFirst": "15",
        "randomLast": "20",
        "randomUnits": "seconds",
        "drop": false,
        "allowrate": false,
        "outputs": 1,
        "x": 840,
        "y": 220,
        "wires": [
            [
                "0c25aaa6cea7688c"
            ]
        ]
    },
    {
        "id": "0c25aaa6cea7688c",
        "type": "function",
        "z": "5bf285a455077f62",
        "name": "Stop requested?",
        "func": "if (flow.get('stop_flag')) { return [msg, null]; }\nreturn [null, msg];",
        "outputs": 2,
        "timeout": "",
        "noerr": 0,
        "x": 1090,
        "y": 220,
        "wires": [
            [
                "9b7927a6968f356a"
            ],
            [
                "a9e724e2d7142acc"
            ]
        ]
    },
    {
        "id": "d532c1a95c43f1e7",
        "type": "function",
        "z": "5bf285a455077f62",
        "name": "Garage Left: next random color",
        "func": "const colors = flow.get('halloweenPalette'); const pick = colors[Math.floor(Math.random()*colors.length)]; const transition = flow.get('transition_secs') || 2; const brightness_pct = flow.get('brightness_pct') || 35; msg.payload = { rgb_color: pick, brightness_pct, transition }; return msg;",
        "outputs": 1,
        "x": 250,
        "y": 280,
        "wires": [
            [
                "7280f9b2cd474cc5"
            ]
        ]
    },
    {
        "id": "7280f9b2cd474cc5",
        "type": "api-call-service",
        "z": "5bf285a455077f62",
        "name": "Garage Left → apply",
        "server": "11e9f35b.61816d",
        "version": 7,
        "action": "light.turn_on",
        "entityId": [
            "light.light_garage_left"
        ],
        "data": "payload",
        "dataType": "jsonata",
        "x": 520,
        "y": 280,
        "wires": [
            [
                "90c8a8300f095468"
            ]
        ]
    },
    {
        "id": "90c8a8300f095468",
        "type": "delay",
        "z": "5bf285a455077f62",
        "name": "Garage Left: random wait (15–20s)",
        "pauseType": "delay",
        "timeout": "20",
        "timeoutUnits": "seconds",
        "rate": "0",
        "nbRateUnits": "1",
        "rateUnits": "second",
        "randomFirst": "15",
        "randomLast": "20",
        "randomUnits": "seconds",
        "drop": false,
        "allowrate": false,
        "outputs": 1,
        "x": 850,
        "y": 280,
        "wires": [
            [
                "0e99e01c087ff4a0"
            ]
        ]
    },
    {
        "id": "0e99e01c087ff4a0",
        "type": "function",
        "z": "5bf285a455077f62",
        "name": "Stop requested?",
        "func": "if (flow.get('stop_flag')) { return [msg, null]; }\nreturn [null, msg];",
        "outputs": 2,
        "timeout": "",
        "noerr": 0,
        "x": 1090,
        "y": 280,
        "wires": [
            [
                "9b7927a6968f356a"
            ],
            [
                "d532c1a95c43f1e7"
            ]
        ]
    },
    {
        "id": "b21de141a245530c",
        "type": "function",
        "z": "5bf285a455077f62",
        "name": "Garage Center: next random color",
        "func": "const colors = flow.get('halloweenPalette'); const pick = colors[Math.floor(Math.random()*colors.length)]; const transition = flow.get('transition_secs') || 2; const brightness_pct = flow.get('brightness_pct') || 35; msg.payload = { rgb_color: pick, brightness_pct, transition }; return msg;",
        "outputs": 1,
        "x": 260,
        "y": 340,
        "wires": [
            [
                "3cb72ca676ac3c1a"
            ]
        ]
    },
    {
        "id": "3cb72ca676ac3c1a",
        "type": "api-call-service",
        "z": "5bf285a455077f62",
        "name": "Garage Center → apply",
        "server": "11e9f35b.61816d",
        "version": 7,
        "action": "light.turn_on",
        "entityId": [
            "light.light_garage_center"
        ],
        "data": "payload",
        "dataType": "jsonata",
        "x": 530,
        "y": 340,
        "wires": [
            [
                "74ce28ac60f3122a"
            ]
        ]
    },
    {
        "id": "74ce28ac60f3122a",
        "type": "delay",
        "z": "5bf285a455077f62",
        "name": "Garage Center: random wait (15–20s)",
        "pauseType": "delay",
        "timeout": "20",
        "timeoutUnits": "seconds",
        "rate": "0",
        "nbRateUnits": "1",
        "rateUnits": "second",
        "randomFirst": "15",
        "randomLast": "20",
        "randomUnits": "seconds",
        "drop": false,
        "allowrate": false,
        "outputs": 1,
        "x": 860,
        "y": 340,
        "wires": [
            [
                "1fdad710eff3543e"
            ]
        ]
    },
    {
        "id": "1fdad710eff3543e",
        "type": "function",
        "z": "5bf285a455077f62",
        "name": "Stop requested?",
        "func": "if (flow.get('stop_flag')) { return [msg, null]; }\nreturn [null, msg];",
        "outputs": 2,
        "timeout": "",
        "noerr": 0,
        "x": 1090,
        "y": 340,
        "wires": [
            [
                "9b7927a6968f356a"
            ],
            [
                "b21de141a245530c"
            ]
        ]
    },
    {
        "id": "dd46a01a1cede0e2",
        "type": "function",
        "z": "5bf285a455077f62",
        "name": "Garage Right: next random color",
        "func": "const colors = flow.get('halloweenPalette'); const pick = colors[Math.floor(Math.random()*colors.length)]; const transition = flow.get('transition_secs') || 2; const brightness_pct = flow.get('brightness_pct') || 35; msg.payload = { rgb_color: pick, brightness_pct, transition }; return msg;",
        "outputs": 1,
        "x": 250,
        "y": 400,
        "wires": [
            [
                "4b07ea298f046eb5"
            ]
        ]
    },
    {
        "id": "4b07ea298f046eb5",
        "type": "api-call-service",
        "z": "5bf285a455077f62",
        "name": "Garage Right → apply",
        "server": "11e9f35b.61816d",
        "version": 7,
        "action": "light.turn_on",
        "entityId": [
            "light.light_garage_right"
        ],
        "data": "payload",
        "dataType": "jsonata",
        "x": 520,
        "y": 400,
        "wires": [
            [
                "f9d8b8e363fe5361"
            ]
        ]
    },
    {
        "id": "f9d8b8e363fe5361",
        "type": "delay",
        "z": "5bf285a455077f62",
        "name": "Garage Right: random wait (15–20s)",
        "pauseType": "delay",
        "timeout": "20",
        "timeoutUnits": "seconds",
        "rate": "0",
        "nbRateUnits": "1",
        "rateUnits": "second",
        "randomFirst": "15",
        "randomLast": "20",
        "randomUnits": "seconds",
        "drop": false,
        "allowrate": false,
        "outputs": 1,
        "x": 850,
        "y": 400,
        "wires": [
            [
                "60afb3d6e9a04072"
            ]
        ]
    },
    {
        "id": "60afb3d6e9a04072",
        "type": "function",
        "z": "5bf285a455077f62",
        "name": "Stop requested?",
        "func": "if (flow.get('stop_flag')) { return [msg, null]; }\nreturn [null, msg];",
        "outputs": 2,
        "timeout": "",
        "noerr": 0,
        "x": 1090,
        "y": 400,
        "wires": [
            [
                "9b7927a6968f356a"
            ],
            [
                "dd46a01a1cede0e2"
            ]
        ]
    },
    {
        "id": "9b7927a6968f356a",
        "type": "api-call-service",
        "z": "5bf285a455077f62",
        "name": "Log: show stopped",
        "server": "11e9f35b.61816d",
        "version": 7,
        "action": "logbook.log",
        "data": "{\"name\":\"Lighting Seasonal Show\",\"message\":\"Production independent 2s fades with 15–20s windows stopped\",\"entity_id\":\"input_button.lighting_halloween_cycle\"}",
        "dataType": "json",
        "x": 1400,
        "y": 240,
        "wires": [
            []
        ]
    },
    {
        "id": "96effe2688ad101b",
        "type": "server-state-changed",
        "z": "5bf285a455077f62",
        "name": "Stop button pressed (event)",
        "server": "11e9f35b.61816d",
        "version": 6,
        "outputs": 1,
        "entities": {
            "entity": [
                "input_button.lighting_halloween_stop"
            ],
            "substring": [],
            "regex": []
        },
        "outputInitially": false,
        "stateType": "str",
        "for": "0",
        "forType": "num",
        "forUnits": "minutes",
        "ignorePrevStateNull": true,
        "ignorePrevStateUnknown": true,
        "ignorePrevStateUnavailable": true,
        "ignoreCurrentStateUnknown": true,
        "ignoreCurrentStateUnavailable": true,
        "x": 260,
        "y": 480,
        "wires": [
            [
                "2c47e9d8dbc85805"
            ]
        ]
    },
    {
        "id": "2c47e9d8dbc85805",
        "type": "function",
        "z": "5bf285a455077f62",
        "name": "set flow.stop_flag = true",
        "func": "flow.set('stop_flag', true);\nreturn null;",
        "outputs": 0,
        "timeout": "",
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 580,
        "y": 480,
        "wires": []
    },
    {
        "id": "e79a03b3ff4cac86",
        "type": "inject",
        "z": "234945acd17cd327",
        "name": "Set plightingTargets (on deploy)",
        "props": [],
        "repeat": "",
        "crontab": "",
        "once": true,
        "onceDelay": 2,
        "topic": "",
        "x": 200,
        "y": 40,
        "wires": [
            [
                "c48d276245448579"
            ]
        ]
    },
    {
        "id": "c48d276245448579",
        "type": "function",
        "z": "234945acd17cd327",
        "name": "flow.set('plightingTargets', [...])",
        "func": "flow.set('plightingTargets', [\n  'light.light_front_left',\n  'light.light_front_right',\n  'light.light_garage_left',\n  'light.light_garage_center',\n  'light.light_garage_right'\n]);\nnode.status({fill:'green',shape:'dot',text:'plightingTargets set (5)'});\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 520,
        "y": 40,
        "wires": [
            []
        ]
    },
    {
        "id": "85bc9b319939cd69",
        "type": "server-state-changed",
        "z": "234945acd17cd327",
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
        "x": 170,
        "y": 100,
        "wires": [
            [
                "85491c6bbfa25320"
            ],
            []
        ]
    },
    {
        "id": "85491c6bbfa25320",
        "type": "delay",
        "z": "234945acd17cd327",
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
                "8993a742d70c367d"
            ]
        ]
    },
    {
        "id": "8993a742d70c367d",
        "type": "api-current-state",
        "z": "234945acd17cd327",
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
                "4a80c8498cf07a87"
            ],
            []
        ]
    },
    {
        "id": "4a80c8498cf07a87",
        "type": "api-current-state",
        "z": "234945acd17cd327",
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
                "0168615a9227cf65"
            ]
        ]
    },
    {
        "id": "0168615a9227cf65",
        "type": "api-call-service",
        "z": "234945acd17cd327",
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
                "e2061390c5fbbcd3"
            ]
        ]
    },
    {
        "id": "e2061390c5fbbcd3",
        "type": "api-call-service",
        "z": "234945acd17cd327",
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
        "id": "604819ec5e24be4f",
        "type": "api-current-state",
        "z": "234945acd17cd327",
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
                "b6a73bdaac62f719"
            ]
        ]
    },
    {
        "id": "b6a73bdaac62f719",
        "type": "api-current-state",
        "z": "234945acd17cd327",
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
                "87623694850ea959"
            ]
        ]
    },
    {
        "id": "87623694850ea959",
        "type": "api-call-service",
        "z": "234945acd17cd327",
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
                "f81850a8d39d74ed",
                "146206bacf3c5ab4"
            ]
        ]
    },
    {
        "id": "f81850a8d39d74ed",
        "type": "api-call-service",
        "z": "234945acd17cd327",
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
        "id": "146206bacf3c5ab4",
        "type": "delay",
        "z": "234945acd17cd327",
        "name": "Wait 1s → start show",
        "pauseType": "delay",
        "timeout": "1",
        "timeoutUnits": "seconds",
        "rate": "1",
        "nbRateUnits": "1",
        "rateUnits": "second",
        "randomFirst": "1",
        "randomLast": "1",
        "randomUnits": "seconds",
        "drop": false,
        "outputs": 1,
        "x": 1440,
        "y": 220,
        "wires": [
            [
                "441c190eadc0127a"
            ]
        ]
    },
    {
        "id": "441c190eadc0127a",
        "type": "function",
        "z": "234945acd17cd327",
        "name": "Attach targets (profile: evening)",
        "func": "const targets = flow.get('plightingTargets');\nconst payload = {};\nif (Array.isArray(targets) && targets.length) {\n  payload.lights = targets;\n  payload.profile = 'evening';\n} else {\n  payload.target = 'exterior';\n  payload.profile = 'evening';\n}\nmsg.payload = payload;\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 1680,
        "y": 220,
        "wires": [
            [
                "f643ab77d502a7c8"
            ]
        ]
    },
    {
        "id": "f643ab77d502a7c8",
        "type": "api-call-service",
        "z": "234945acd17cd327",
        "name": "Press PLighting START button (evening)",
        "server": "11e9f35b.61816d",
        "version": 7,
        "entityId": [
            "input_button.lighting_halloween_cycle"
        ],
        "data": "{}",
        "dataType": "json",
        "mergeContext": "",
        "mustacheAltTags": false,
        "outputProperties": [],
        "queue": "none",
        "domain": "input_button",
        "service": "press",
        "x": 1950,
        "y": 220,
        "wires": [
            []
        ]
    },
    {
        "id": "da45931d33736790",
        "type": "server-state-changed",
        "z": "234945acd17cd327",
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
        "x": 170,
        "y": 320,
        "wires": [
            [
                "4b43a66929296bd5"
            ]
        ]
    },
    {
        "id": "4b43a66929296bd5",
        "type": "delay",
        "z": "234945acd17cd327",
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
                "ec70bfd0cc577c77"
            ]
        ]
    },
    {
        "id": "ec70bfd0cc577c77",
        "type": "api-current-state",
        "z": "234945acd17cd327",
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
                "163571b033a280fa"
            ]
        ]
    },
    {
        "id": "163571b033a280fa",
        "type": "api-current-state",
        "z": "234945acd17cd327",
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
        "override_topic": false,
        "state_location": "payload",
        "override_payload": "msg",
        "entity_location": "data",
        "override_data": "msg",
        "x": 890,
        "y": 300,
        "wires": [
            [
                "a1bf6ddf0bc0ca36"
            ]
        ]
    },
    {
        "id": "a1bf6ddf0bc0ca36",
        "type": "api-current-state",
        "z": "234945acd17cd327",
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
        "override_topic": false,
        "state_location": "payload",
        "override_payload": "msg",
        "entity_location": "data",
        "override_data": "msg",
        "x": 1170,
        "y": 300,
        "wires": [
            [
                "62553e0b2d33cf34",
                "481096ce91068a31"
            ]
        ]
    },
    {
        "id": "62553e0b2d33cf34",
        "type": "api-call-service",
        "z": "234945acd17cd327",
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
                "27cbc3a1f4c10ac4"
            ]
        ]
    },
    {
        "id": "27cbc3a1f4c10ac4",
        "type": "api-call-service",
        "z": "234945acd17cd327",
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
        "id": "481096ce91068a31",
        "type": "api-call-service",
        "z": "234945acd17cd327",
        "name": "Press PLighting STOP button (sunrise branch)",
        "server": "11e9f35b.61816d",
        "version": 7,
        "entityId": [
            "input_button.lighting_halloween_stop"
        ],
        "data": "{}",
        "dataType": "json",
        "domain": "input_button",
        "service": "press",
        "x": 1510,
        "y": 340,
        "wires": [
            []
        ]
    },
    {
        "id": "828ad9bd86d58bda",
        "type": "api-current-state",
        "z": "234945acd17cd327",
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
                "db9d2f5a7b1a54a6"
            ]
        ]
    },
    {
        "id": "db9d2f5a7b1a54a6",
        "type": "api-call-service",
        "z": "234945acd17cd327",
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
                "c8dc8695f9e43515",
                "57e4a38f46c0b286"
            ]
        ]
    },
    {
        "id": "c8dc8695f9e43515",
        "type": "api-call-service",
        "z": "234945acd17cd327",
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
        "id": "57e4a38f46c0b286",
        "type": "api-call-service",
        "z": "234945acd17cd327",
        "name": "Press PLighting STOP button (after exterior off)",
        "server": "11e9f35b.61816d",
        "version": 7,
        "entityId": [
            "input_button.lighting_halloween_stop"
        ],
        "data": "{}",
        "dataType": "json",
        "domain": "input_button",
        "service": "press",
        "x": 1770,
        "y": 440,
        "wires": [
            []
        ]
    },
    {
        "id": "059bd92e9ba61f9f",
        "type": "server-state-changed",
        "z": "234945acd17cd327",
        "name": "Any plighting light → ON",
        "server": "11e9f35b.61816d",
        "version": 6,
        "outputs": 1,
        "entities": {
            "entity": [
                "light.light_front_left",
                "light.light_front_right",
                "light.light_garage_left",
                "light.light_garage_center",
                "light.light_garage_right"
            ]
        },
        "outputInitially": false,
        "stateType": "str",
        "ifState": "on",
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
        "x": 210,
        "y": 520,
        "wires": [
            [
                "4857c81d0287f151",
                "14cda1d7321f9c7d",
                "173fd4ef2cf19adc"
            ]
        ]
    },
    {
        "id": "4857c81d0287f151",
        "type": "api-current-state",
        "z": "234945acd17cd327",
        "name": "Holiday mode OFF?",
        "server": "11e9f35b.61816d",
        "version": 3,
        "outputs": 1,
        "halt_if": "on",
        "halt_if_type": "str",
        "halt_if_compare": "is",
        "entity_id": "binary_sensor.holiday_mode_active",
        "x": 520,
        "y": 480,
        "wires": [
            [
                "27f7dd1b454d6072"
            ]
        ]
    },
    {
        "id": "14cda1d7321f9c7d",
        "type": "api-current-state",
        "z": "234945acd17cd327",
        "name": "Huskers show OFF?",
        "server": "11e9f35b.61816d",
        "version": 3,
        "outputs": 1,
        "halt_if": "off",
        "halt_if_type": "str",
        "halt_if_compare": "is_not",
        "entity_id": "binary_sensor.huskers_light_show_active",
        "x": 530,
        "y": 520,
        "wires": [
            [
                "27f7dd1b454d6072"
            ]
        ]
    },
    {
        "id": "173fd4ef2cf19adc",
        "type": "api-current-state",
        "z": "234945acd17cd327",
        "name": "Lighting hold NOT active?",
        "server": "11e9f35b.61816d",
        "version": 3,
        "outputs": 1,
        "halt_if": "on",
        "halt_if_type": "str",
        "halt_if_compare": "is",
        "entity_id": "binary_sensor.huskers_lighting_hold",
        "x": 560,
        "y": 560,
        "wires": [
            [
                "27f7dd1b454d6072"
            ]
        ]
    },
    {
        "id": "27f7dd1b454d6072",
        "type": "function",
        "z": "234945acd17cd327",
        "name": "Attach targets (profile: auto)",
        "func": "const targets = flow.get('plightingTargets');\nconst payload = {};\nif (Array.isArray(targets) && targets.length) {\n  payload.lights = targets;\n  payload.profile = 'auto';\n} else {\n  payload.target = 'exterior';\n  payload.profile = 'auto';\n}\nmsg.payload = payload;\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 820,
        "y": 520,
        "wires": [
            [
                "04ac4f6fc4245a5a"
            ]
        ]
    },
    {
        "id": "04ac4f6fc4245a5a",
        "type": "api-call-service",
        "z": "234945acd17cd327",
        "name": "Press PLighting START button (auto)",
        "server": "11e9f35b.61816d",
        "version": 7,
        "entityId": [
            "input_button.lighting_halloween_cycle"
        ],
        "data": "{}",
        "dataType": "json",
        "mergeContext": "",
        "mustacheAltTags": false,
        "outputProperties": [],
        "queue": "none",
        "domain": "input_button",
        "service": "press",
        "x": 1080,
        "y": 520,
        "wires": [
            []
        ]
    },
    {
        "id": "2ceee78862c9d4de",
        "type": "server-state-changed",
        "z": "234945acd17cd327",
        "name": "Any plighting light → OFF",
        "server": "11e9f35b.61816d",
        "version": 6,
        "outputs": 1,
        "entities": {
            "entity": [
                "light.light_front_left",
                "light.light_front_right",
                "light.light_garage_left",
                "light.light_garage_center",
                "light.light_garage_right"
            ]
        },
        "outputInitially": false,
        "stateType": "str",
        "ifState": "off",
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
        "x": 210,
        "y": 600,
        "wires": [
            [
                "393312dc96a42262"
            ]
        ]
    },
    {
        "id": "393312dc96a42262",
        "type": "function",
        "z": "234945acd17cd327",
        "name": "Are ALL plighting lights OFF?",
        "func": "const ha = global.get('homeassistant');\nif (!ha || !ha.homeAssistant || !ha.homeAssistant.states) {\n  return null;\n}\nconst states = ha.homeAssistant.states;\nconst ids = [\n  'light.light_front_left',\n  'light.light_front_right',\n  'light.light_garage_left',\n  'light.light_garage_center',\n  'light.light_garage_right'\n];\nconst allOff = ids.every(id => (states[id] && (states[id].state||'').toLowerCase() === 'off'));\nreturn allOff ? msg : null;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 520,
        "y": 600,
        "wires": [
            [
                "ca6b84781cc7cc92"
            ]
        ]
    },
    {
        "id": "ca6b84781cc7cc92",
        "type": "api-call-service",
        "z": "234945acd17cd327",
        "name": "Press PLighting STOP button (all off)",
        "server": "11e9f35b.61816d",
        "version": 7,
        "entityId": [
            "input_button.lighting_halloween_stop"
        ],
        "data": "{}",
        "dataType": "json",
        "domain": "input_button",
        "service": "press",
        "x": 800,
        "y": 600,
        "wires": [
            []
        ]
    },
    {
        "id": "0491b79b75878069",
        "type": "server-state-changed",
        "z": "234945acd17cd327",
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
        "x": 170,
        "y": 200,
        "wires": [
            [
                "22cf39864f11a1ce"
            ]
        ]
    },
    {
        "id": "22cf39864f11a1ce",
        "type": "delay",
        "z": "234945acd17cd327",
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
                "604819ec5e24be4f"
            ]
        ]
    },
    {
        "id": "6ac64c1a41e055db",
        "type": "server-state-changed",
        "z": "234945acd17cd327",
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
        "x": 170,
        "y": 420,
        "wires": [
            [
                "f3114b4c2d0131ca"
            ]
        ]
    },
    {
        "id": "f3114b4c2d0131ca",
        "type": "delay",
        "z": "234945acd17cd327",
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
                "9044225c25d1f792"
            ]
        ]
    },
    {
        "id": "9044225c25d1f792",
        "type": "api-current-state",
        "z": "234945acd17cd327",
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
                "5670b543b0f5b6b7"
            ]
        ]
    },
    {
        "id": "5670b543b0f5b6b7",
        "type": "api-current-state",
        "z": "234945acd17cd327",
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
        "override_topic": false,
        "state_location": "payload",
        "override_payload": "msg",
        "entity_location": "data",
        "override_data": "msg",
        "x": 880,
        "y": 400,
        "wires": [
            [
                "828ad9bd86d58bda"
            ]
        ]
    },
    {
        "id": "ec5b0c1a2f16ce04",
        "type": "function",
        "z": "7e180ead4ba54b28",
        "name": "Init: monthly palette, settings",
        "func": "const month = new Date().getMonth();\nconst palettes = {\n  0:  [[180,220,255],[120,180,255],[90,140,200],[255,255,255]],\n  1:  [[220,20,60],[255,105,180],[255,182,193],[255,240,245]],\n  2:  [[34,139,34],[50,205,50],[218,165,32],[173,255,47]],\n  3:  [[255,182,193],[221,160,221],[176,224,230],[152,251,152]],\n  4:  [[60,179,113],[255,192,203],[255,215,0],[135,206,235]],\n  5:  [[255,0,0],[255,140,0],[255,215,0],[0,0,255]],\n  6:  [[178,34,34],[255,255,255],[30,144,255],[240,230,140]],\n  7:  [[255,140,0],[255,69,0],[255,215,0],[0,128,128]],\n  8:  [[218,165,32],[205,133,63],[244,164,96],[255,228,181]],\n  9:  [[255,110,10],[128,0,128],[34,139,34],[255,165,0]],\n  10: [[210,105,30],[205,92,92],[255,140,0],[222,184,135]],\n  11: [[220,20,60],[0,128,0],[255,255,240],[176,224,230]]\n};\nflow.set('palette', palettes[month] || [[255,140,0],[0,100,0],[75,0,130],[139,0,0]]);\nflow.set('transition_secs', 30);\nflow.set('brightness_pct', 35);\nflow.set('min_wait', 5);\nflow.set('max_wait', 25);\nflow.set('stop_flag', false);\nreturn msg;",
        "outputs": 1,
        "timeout": "",
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 820,
        "y": 80,
        "wires": [
            [
                "3740ae27cd3b56a6",
                "13629db795af7724",
                "9580d2a2a3b711fc",
                "8b7a34814267f778"
            ]
        ]
    },
    {
        "id": "3740ae27cd3b56a6",
        "type": "function",
        "z": "7e180ead4ba54b28",
        "name": "Left: next random color",
        "func": "const colors = flow.get('palette') || [[255,140,0],[0,100,0],[75,0,130],[139,0,0]];\nconst pick = colors[Math.floor(Math.random()*colors.length)];\nconst transition = (msg && msg.immediate) ? 1 : (flow.get('transition_secs') || 30);\nconst brightness_pct = flow.get('brightness_pct') || 35;\nmsg.payload = { rgb_color: pick, brightness_pct, transition };\nreturn msg;",
        "outputs": 1,
        "x": 220,
        "y": 160,
        "wires": [
            [
                "a380b6fec5c4f7cc"
            ]
        ]
    },
    {
        "id": "a380b6fec5c4f7cc",
        "type": "api-call-service",
        "z": "7e180ead4ba54b28",
        "name": "Left light → apply",
        "server": "11e9f35b.61816d",
        "version": 7,
        "action": "light.turn_on",
        "entityId": [
            "light.light_theater_left"
        ],
        "data": "payload",
        "dataType": "jsonata",
        "x": 480,
        "y": 160,
        "wires": [
            [
                "0fc9b5575ab9254f"
            ]
        ]
    },
    {
        "id": "0fc9b5575ab9254f",
        "type": "delay",
        "z": "7e180ead4ba54b28",
        "name": "Left: random wait (5–25s)",
        "pauseType": "random",
        "timeout": "1",
        "timeoutUnits": "seconds",
        "rate": "0",
        "nbRateUnits": "1",
        "rateUnits": "second",
        "randomFirst": "20",
        "randomLast": "25",
        "randomUnits": "seconds",
        "drop": false,
        "allowrate": false,
        "outputs": 1,
        "x": 750,
        "y": 160,
        "wires": [
            [
                "20b78999c296aab6"
            ]
        ]
    },
    {
        "id": "20b78999c296aab6",
        "type": "function",
        "z": "7e180ead4ba54b28",
        "name": "Stop requested?",
        "func": "if (flow.get('stop_flag')) { return [msg, null]; }\nreturn [null, msg];",
        "outputs": 2,
        "x": 1010,
        "y": 160,
        "wires": [
            [
                "298dbb1eb80e103c",
                "115e92f1a9ea218a"
            ],
            [
                "3740ae27cd3b56a6"
            ]
        ]
    },
    {
        "id": "13629db795af7724",
        "type": "function",
        "z": "7e180ead4ba54b28",
        "name": "Sunroom: next random color",
        "func": "const colors = flow.get('palette') || [[255,140,0],[0,100,0],[75,0,130],[139,0,0]];\nconst pick = colors[Math.floor(Math.random()*colors.length)];\nconst transition = (msg && msg.immediate) ? 1 : (flow.get('transition_secs') || 30);\nconst brightness_pct = flow.get('brightness_pct') || 35;\nmsg.payload = { rgb_color: pick, brightness_pct, transition };\nreturn msg;",
        "outputs": 1,
        "x": 250,
        "y": 220,
        "wires": [
            [
                "5f7c0df8594931b0"
            ]
        ]
    },
    {
        "id": "5f7c0df8594931b0",
        "type": "api-call-service",
        "z": "7e180ead4ba54b28",
        "name": "Sunroom → apply",
        "server": "11e9f35b.61816d",
        "version": 7,
        "action": "light.turn_on",
        "entityId": [
            "light.sunroom_light_2"
        ],
        "data": "payload",
        "dataType": "jsonata",
        "x": 500,
        "y": 220,
        "wires": [
            [
                "f84bdfcf91e71411"
            ]
        ]
    },
    {
        "id": "f84bdfcf91e71411",
        "type": "delay",
        "z": "7e180ead4ba54b28",
        "name": "Sunroom: random wait (5–25s)",
        "pauseType": "random",
        "timeout": "1",
        "timeoutUnits": "seconds",
        "rate": "0",
        "nbRateUnits": "1",
        "rateUnits": "second",
        "randomFirst": "20",
        "randomLast": "25",
        "randomUnits": "seconds",
        "drop": false,
        "allowrate": false,
        "outputs": 1,
        "x": 790,
        "y": 220,
        "wires": [
            [
                "cb6d9758dd9fd417"
            ]
        ]
    },
    {
        "id": "cb6d9758dd9fd417",
        "type": "function",
        "z": "7e180ead4ba54b28",
        "name": "Stop requested?",
        "func": "if (flow.get('stop_flag')) { return [msg, null]; }\nreturn [null, msg];",
        "outputs": 2,
        "x": 1050,
        "y": 220,
        "wires": [
            [
                "298dbb1eb80e103c",
                "115e92f1a9ea218a"
            ],
            [
                "13629db795af7724"
            ]
        ]
    },
    {
        "id": "9580d2a2a3b711fc",
        "type": "function",
        "z": "7e180ead4ba54b28",
        "name": "Right: next random color",
        "func": "const colors = flow.get('palette') || [[255,140,0],[0,100,0],[75,0,130],[139,0,0]];\nconst pick = colors[Math.floor(Math.random()*colors.length)];\nconst transition = (msg && msg.immediate) ? 1 : (flow.get('transition_secs') || 30);\nconst brightness_pct = flow.get('brightness_pct') || 35;\nmsg.payload = { rgb_color: pick, brightness_pct, transition };\nreturn msg;",
        "outputs": 1,
        "x": 240,
        "y": 280,
        "wires": [
            [
                "ce1534dbd8f3b19f"
            ]
        ]
    },
    {
        "id": "ce1534dbd8f3b19f",
        "type": "api-call-service",
        "z": "7e180ead4ba54b28",
        "name": "Right light → apply",
        "server": "11e9f35b.61816d",
        "version": 7,
        "action": "light.turn_on",
        "entityId": [
            "light.light_theater_right"
        ],
        "data": "payload",
        "dataType": "jsonata",
        "x": 500,
        "y": 280,
        "wires": [
            [
                "1b7cb174bfbd04b5"
            ]
        ]
    },
    {
        "id": "1b7cb174bfbd04b5",
        "type": "delay",
        "z": "7e180ead4ba54b28",
        "name": "Right: random wait (5–25s)",
        "pauseType": "random",
        "timeout": "1",
        "timeoutUnits": "seconds",
        "rate": "0",
        "nbRateUnits": "1",
        "rateUnits": "second",
        "randomFirst": "20",
        "randomLast": "25",
        "randomUnits": "seconds",
        "drop": false,
        "allowrate": false,
        "outputs": 1,
        "x": 780,
        "y": 280,
        "wires": [
            [
                "ab3b538285c2b549"
            ]
        ]
    },
    {
        "id": "ab3b538285c2b549",
        "type": "function",
        "z": "7e180ead4ba54b28",
        "name": "Stop requested?",
        "func": "if (flow.get('stop_flag')) { return [msg, null]; }\nreturn [null, msg];",
        "outputs": 2,
        "x": 1040,
        "y": 280,
        "wires": [
            [
                "298dbb1eb80e103c",
                "115e92f1a9ea218a"
            ],
            [
                "9580d2a2a3b711fc"
            ]
        ]
    },
    {
        "id": "8b7a34814267f778",
        "type": "function",
        "z": "7e180ead4ba54b28",
        "name": "Office: next random color",
        "func": "const colors = flow.get('palette') || [[255,140,0],[0,100,0],[75,0,130],[139,0,0]];\nconst pick = colors[Math.floor(Math.random()*colors.length)];\nconst transition = (msg && msg.immediate) ? 1 : (flow.get('transition_secs') || 30);\nconst brightness_pct = flow.get('brightness_pct') || 35;\nmsg.payload = { rgb_color: pick, brightness_pct, transition };\nreturn msg;",
        "outputs": 1,
        "x": 250,
        "y": 340,
        "wires": [
            [
                "5a7aab23b7b3b431"
            ]
        ]
    },
    {
        "id": "5a7aab23b7b3b431",
        "type": "api-call-service",
        "z": "7e180ead4ba54b28",
        "name": "Office light → apply",
        "server": "11e9f35b.61816d",
        "version": 7,
        "action": "light.turn_on",
        "entityId": [
            "light.light_office"
        ],
        "data": "payload",
        "dataType": "jsonata",
        "x": 510,
        "y": 340,
        "wires": [
            [
                "0a6bb2c7d0f1ed0c"
            ]
        ]
    },
    {
        "id": "0a6bb2c7d0f1ed0c",
        "type": "delay",
        "z": "7e180ead4ba54b28",
        "name": "Office: random wait (5–25s)",
        "pauseType": "random",
        "timeout": "20",
        "timeoutUnits": "seconds",
        "rate": "0",
        "nbRateUnits": "1",
        "rateUnits": "second",
        "randomFirst": "20",
        "randomLast": "25",
        "randomUnits": "seconds",
        "drop": false,
        "allowrate": false,
        "outputs": 1,
        "x": 780,
        "y": 340,
        "wires": [
            [
                "70d532dcc964fb90"
            ]
        ]
    },
    {
        "id": "70d532dcc964fb90",
        "type": "function",
        "z": "7e180ead4ba54b28",
        "name": "Stop requested?",
        "func": "if (flow.get('stop_flag')) { return [msg, null]; }\nreturn [null, msg];",
        "outputs": 2,
        "x": 1060,
        "y": 340,
        "wires": [
            [
                "298dbb1eb80e103c",
                "115e92f1a9ea218a"
            ],
            [
                "8b7a34814267f778"
            ]
        ]
    },
    {
        "id": "298dbb1eb80e103c",
        "type": "function",
        "z": "7e180ead4ba54b28",
        "name": "Build green payload",
        "func": "msg.payload = { rgb_color: [0,255,0], brightness_pct: 100, transition: 1 };\nreturn msg;",
        "outputs": 1,
        "x": 1270,
        "y": 160,
        "wires": [
            [
                "58e9c74191f0bf20"
            ]
        ]
    },
    {
        "id": "58e9c74191f0bf20",
        "type": "api-call-service",
        "z": "7e180ead4ba54b28",
        "name": "All lights → green 100%",
        "server": "11e9f35b.61816d",
        "version": 7,
        "debugenabled": false,
        "action": "light.turn_on",
        "floorId": [],
        "areaId": [],
        "deviceId": [],
        "entityId": [
            "light.light_theater_left",
            "light.sunroom_light_2",
            "light.light_theater_right",
            "light.light_office"
        ],
        "labelId": [],
        "data": "payload",
        "dataType": "jsonata",
        "mergeContext": "",
        "mustacheAltTags": false,
        "outputProperties": [],
        "blockInputOverrides": false,
        "domain": "light",
        "service": "turn_on",
        "x": 1520,
        "y": 160,
        "wires": [
            []
        ]
    },
    {
        "id": "115e92f1a9ea218a",
        "type": "api-call-service",
        "z": "7e180ead4ba54b28",
        "name": "Log: show stopped",
        "server": "11e9f35b.61816d",
        "version": 7,
        "action": "logbook.log",
        "data": "{\"name\":\"Test Lighting Seasonal Show\",\"message\":\"Random independent fade loop stopped\",\"entity_id\":\"input_button.test_lighting_stop\"}",
        "dataType": "json",
        "domain": "logbook",
        "service": "log",
        "x": 1290,
        "y": 220,
        "wires": [
            []
        ]
    },
    {
        "id": "95109352e9faa76a",
        "type": "inject",
        "z": "7e180ead4ba54b28",
        "name": "00:01 daily → refresh palette",
        "props": [],
        "repeat": "",
        "crontab": "01 00 * * *",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "x": 280,
        "y": 20,
        "wires": [
            [
                "ec5b0c1a2f16ce04"
            ]
        ]
    },
    {
        "id": "1d3713ec868dad4c",
        "type": "function",
        "z": "7e180ead4ba54b28",
        "name": "Palette: set by monthIdx (test) + kick",
        "func": "const idx = (typeof msg.monthIdx === 'number' && msg.monthIdx >= 0 && msg.monthIdx <= 11) ? msg.monthIdx : new Date().getMonth();\nconst palettes = {0:[[180,220,255],[120,180,255],[90,140,200],[255,255,255]],1:[[220,20,60],[255,105,180],[255,182,193],[255,240,245]],2:[[34,139,34],[50,205,50],[218,165,32],[173,255,47]],3:[[255,182,193],[221,160,221],[176,224,230],[152,251,152]],4:[[60,179,113],[255,192,203],[255,215,0],[135,206,235]],5:[[255,0,0],[255,140,0],[255,215,0],[0,0,255]],6:[[178,34,34],[255,255,255],[30,144,255],[240,230,140]],7:[[255,140,0],[255,69,0],[255,215,0],[0,128,128]],8:[[218,165,32],[205,133,63],[244,164,96],[255,228,181]],9:[[255,110,10],[128,0,128],[34,139,34],[255,165,0]],10:[[210,105,30],[205,92,92],[255,140,0],[222,184,135]],11:[[220,20,60],[0,128,0],[255,255,240],[176,224,230]]};\nflow.set('palette', palettes[idx]);\nflow.set('stop_flag', false);\nmsg.immediate = true;\nreturn msg;",
        "outputs": 1,
        "x": 910,
        "y": 540,
        "wires": [
            [
                "8b7a34814267f778",
                "9580d2a2a3b711fc",
                "13629db795af7724",
                "3740ae27cd3b56a6"
            ]
        ]
    },
    {
        "id": "53e56db242aae655",
        "type": "server-state-changed",
        "z": "7e180ead4ba54b28",
        "name": "Start · January (test)",
        "server": "11e9f35b.61816d",
        "version": 6,
        "outputs": 1,
        "entities": {
            "entity": [
                "input_button.test_lighting_start_january"
            ],
            "substring": [],
            "regex": []
        },
        "outputInitially": false,
        "stateType": "str",
        "for": "0",
        "forType": "num",
        "forUnits": "minutes",
        "ignorePrevStateNull": true,
        "ignorePrevStateUnknown": true,
        "ignorePrevStateUnavailable": true,
        "ignoreCurrentStateUnknown": true,
        "ignoreCurrentStateUnavailable": true,
        "x": 250,
        "y": 520,
        "wires": [
            [
                "8fd2c35fb8c2f421"
            ]
        ]
    },
    {
        "id": "8fd2c35fb8c2f421",
        "type": "change",
        "z": "7e180ead4ba54b28",
        "name": "monthIdx=0",
        "rules": [
            {
                "t": "set",
                "p": "monthIdx",
                "pt": "msg",
                "to": "0",
                "tot": "num"
            }
        ],
        "x": 620,
        "y": 540,
        "wires": [
            [
                "1d3713ec868dad4c"
            ]
        ]
    },
    {
        "id": "1c2e3df10946cb6e",
        "type": "server-state-changed",
        "z": "7e180ead4ba54b28",
        "name": "Start · February (test)",
        "server": "11e9f35b.61816d",
        "version": 6,
        "outputs": 1,
        "entities": {
            "entity": [
                "input_button.test_lighting_start_february"
            ],
            "substring": [],
            "regex": []
        },
        "outputInitially": false,
        "stateType": "str",
        "for": "0",
        "forType": "num",
        "forUnits": "minutes",
        "ignorePrevStateNull": true,
        "ignorePrevStateUnknown": true,
        "ignorePrevStateUnavailable": true,
        "ignoreCurrentStateUnknown": true,
        "ignoreCurrentStateUnavailable": true,
        "x": 260,
        "y": 580,
        "wires": [
            [
                "f21285cacb7fa499"
            ]
        ]
    },
    {
        "id": "f21285cacb7fa499",
        "type": "change",
        "z": "7e180ead4ba54b28",
        "name": "monthIdx=1",
        "rules": [
            {
                "t": "set",
                "p": "monthIdx",
                "pt": "msg",
                "to": "1",
                "tot": "num"
            }
        ],
        "x": 620,
        "y": 580,
        "wires": [
            [
                "1d3713ec868dad4c"
            ]
        ]
    },
    {
        "id": "a1b195277fe5c83e",
        "type": "server-state-changed",
        "z": "7e180ead4ba54b28",
        "name": "Start · March (test)",
        "server": "11e9f35b.61816d",
        "version": 6,
        "outputs": 1,
        "entities": {
            "entity": [
                "input_button.test_lighting_start_march"
            ],
            "substring": [],
            "regex": []
        },
        "outputInitially": false,
        "stateType": "str",
        "for": "0",
        "forType": "num",
        "forUnits": "minutes",
        "ignorePrevStateNull": true,
        "ignorePrevStateUnknown": true,
        "ignorePrevStateUnavailable": true,
        "ignoreCurrentStateUnknown": true,
        "ignoreCurrentStateUnavailable": true,
        "x": 250,
        "y": 640,
        "wires": [
            [
                "710c26bccc1bf773"
            ]
        ]
    },
    {
        "id": "710c26bccc1bf773",
        "type": "change",
        "z": "7e180ead4ba54b28",
        "name": "monthIdx=2",
        "rules": [
            {
                "t": "set",
                "p": "monthIdx",
                "pt": "msg",
                "to": "2",
                "tot": "num"
            }
        ],
        "x": 620,
        "y": 620,
        "wires": [
            [
                "1d3713ec868dad4c"
            ]
        ]
    },
    {
        "id": "154b2c961fa943f3",
        "type": "server-state-changed",
        "z": "7e180ead4ba54b28",
        "name": "Start · April (test)",
        "server": "11e9f35b.61816d",
        "version": 6,
        "outputs": 1,
        "entities": {
            "entity": [
                "input_button.test_lighting_start_april"
            ],
            "substring": [],
            "regex": []
        },
        "outputInitially": false,
        "stateType": "str",
        "for": "0",
        "forType": "num",
        "forUnits": "minutes",
        "ignorePrevStateNull": true,
        "ignorePrevStateUnknown": true,
        "ignorePrevStateUnavailable": true,
        "ignoreCurrentStateUnknown": true,
        "ignoreCurrentStateUnavailable": true,
        "x": 240,
        "y": 700,
        "wires": [
            [
                "ae06b9aa73014a39"
            ]
        ]
    },
    {
        "id": "ae06b9aa73014a39",
        "type": "change",
        "z": "7e180ead4ba54b28",
        "name": "monthIdx=3",
        "rules": [
            {
                "t": "set",
                "p": "monthIdx",
                "pt": "msg",
                "to": "3",
                "tot": "num"
            }
        ],
        "x": 620,
        "y": 660,
        "wires": [
            [
                "1d3713ec868dad4c"
            ]
        ]
    },
    {
        "id": "84a73b6843626633",
        "type": "server-state-changed",
        "z": "7e180ead4ba54b28",
        "name": "Start · May (test)",
        "server": "11e9f35b.61816d",
        "version": 6,
        "outputs": 1,
        "entities": {
            "entity": [
                "input_button.test_lighting_start_may"
            ],
            "substring": [],
            "regex": []
        },
        "outputInitially": false,
        "stateType": "str",
        "for": "0",
        "forType": "num",
        "forUnits": "minutes",
        "ignorePrevStateNull": true,
        "ignorePrevStateUnknown": true,
        "ignorePrevStateUnavailable": true,
        "ignoreCurrentStateUnknown": true,
        "ignoreCurrentStateUnavailable": true,
        "x": 240,
        "y": 760,
        "wires": [
            [
                "b48a24f1a6a74794"
            ]
        ]
    },
    {
        "id": "b48a24f1a6a74794",
        "type": "change",
        "z": "7e180ead4ba54b28",
        "name": "monthIdx=4",
        "rules": [
            {
                "t": "set",
                "p": "monthIdx",
                "pt": "msg",
                "to": "4",
                "tot": "num"
            }
        ],
        "x": 620,
        "y": 700,
        "wires": [
            [
                "1d3713ec868dad4c"
            ]
        ]
    },
    {
        "id": "8b964f970a341e09",
        "type": "server-state-changed",
        "z": "7e180ead4ba54b28",
        "name": "Start · June (test)",
        "server": "11e9f35b.61816d",
        "version": 6,
        "outputs": 1,
        "entities": {
            "entity": [
                "input_button.test_lighting_start_june"
            ],
            "substring": [],
            "regex": []
        },
        "outputInitially": false,
        "stateType": "str",
        "for": "0",
        "forType": "num",
        "forUnits": "minutes",
        "ignorePrevStateNull": true,
        "ignorePrevStateUnknown": true,
        "ignorePrevStateUnavailable": true,
        "ignoreCurrentStateUnknown": true,
        "ignoreCurrentStateUnavailable": true,
        "x": 240,
        "y": 820,
        "wires": [
            [
                "1611a0113e9ae595"
            ]
        ]
    },
    {
        "id": "1611a0113e9ae595",
        "type": "change",
        "z": "7e180ead4ba54b28",
        "name": "monthIdx=5",
        "rules": [
            {
                "t": "set",
                "p": "monthIdx",
                "pt": "msg",
                "to": "5",
                "tot": "num"
            }
        ],
        "x": 620,
        "y": 740,
        "wires": [
            [
                "1d3713ec868dad4c"
            ]
        ]
    },
    {
        "id": "4dae4e6086c2a098",
        "type": "server-state-changed",
        "z": "7e180ead4ba54b28",
        "name": "Start · July (test)",
        "server": "11e9f35b.61816d",
        "version": 6,
        "outputs": 1,
        "entities": {
            "entity": [
                "input_button.test_lighting_start_july"
            ],
            "substring": [],
            "regex": []
        },
        "outputInitially": false,
        "stateType": "str",
        "for": "0",
        "forType": "num",
        "forUnits": "minutes",
        "ignorePrevStateNull": true,
        "ignorePrevStateUnknown": true,
        "ignorePrevStateUnavailable": true,
        "ignoreCurrentStateUnknown": true,
        "ignoreCurrentStateUnavailable": true,
        "x": 240,
        "y": 880,
        "wires": [
            [
                "d7c17a6af7aac2f0"
            ]
        ]
    },
    {
        "id": "d7c17a6af7aac2f0",
        "type": "change",
        "z": "7e180ead4ba54b28",
        "name": "monthIdx=6",
        "rules": [
            {
                "t": "set",
                "p": "monthIdx",
                "pt": "msg",
                "to": "6",
                "tot": "num"
            }
        ],
        "x": 620,
        "y": 780,
        "wires": [
            [
                "1d3713ec868dad4c"
            ]
        ]
    },
    {
        "id": "7f829fbd75f765ae",
        "type": "server-state-changed",
        "z": "7e180ead4ba54b28",
        "name": "Start · August (test)",
        "server": "11e9f35b.61816d",
        "version": 6,
        "outputs": 1,
        "entities": {
            "entity": [
                "input_button.test_lighting_start_august"
            ],
            "substring": [],
            "regex": []
        },
        "outputInitially": false,
        "stateType": "str",
        "for": "0",
        "forType": "num",
        "forUnits": "minutes",
        "ignorePrevStateNull": true,
        "ignorePrevStateUnknown": true,
        "ignorePrevStateUnavailable": true,
        "ignoreCurrentStateUnknown": true,
        "ignoreCurrentStateUnavailable": true,
        "x": 250,
        "y": 940,
        "wires": [
            [
                "481391856378998a"
            ]
        ]
    },
    {
        "id": "481391856378998a",
        "type": "change",
        "z": "7e180ead4ba54b28",
        "name": "monthIdx=7",
        "rules": [
            {
                "t": "set",
                "p": "monthIdx",
                "pt": "msg",
                "to": "7",
                "tot": "num"
            }
        ],
        "x": 620,
        "y": 820,
        "wires": [
            [
                "1d3713ec868dad4c"
            ]
        ]
    },
    {
        "id": "3b3f4454dffdcf13",
        "type": "server-state-changed",
        "z": "7e180ead4ba54b28",
        "name": "Start · September (test)",
        "server": "11e9f35b.61816d",
        "version": 6,
        "outputs": 1,
        "entities": {
            "entity": [
                "input_button.test_lighting_start_september"
            ],
            "substring": [],
            "regex": []
        },
        "outputInitially": false,
        "stateType": "str",
        "for": "0",
        "forType": "num",
        "forUnits": "minutes",
        "ignorePrevStateNull": true,
        "ignorePrevStateUnknown": true,
        "ignorePrevStateUnavailable": true,
        "ignoreCurrentStateUnknown": true,
        "ignoreCurrentStateUnavailable": true,
        "x": 260,
        "y": 1000,
        "wires": [
            [
                "e2efe0363fbb25f6"
            ]
        ]
    },
    {
        "id": "e2efe0363fbb25f6",
        "type": "change",
        "z": "7e180ead4ba54b28",
        "name": "monthIdx=8",
        "rules": [
            {
                "t": "set",
                "p": "monthIdx",
                "pt": "msg",
                "to": "8",
                "tot": "num"
            }
        ],
        "x": 620,
        "y": 860,
        "wires": [
            [
                "1d3713ec868dad4c"
            ]
        ]
    },
    {
        "id": "682091221a2db6be",
        "type": "server-state-changed",
        "z": "7e180ead4ba54b28",
        "name": "Start · October (test)",
        "server": "11e9f35b.61816d",
        "version": 6,
        "outputs": 1,
        "entities": {
            "entity": [
                "input_button.test_lighting_start_october"
            ],
            "substring": [],
            "regex": []
        },
        "outputInitially": false,
        "stateType": "str",
        "for": "0",
        "forType": "num",
        "forUnits": "minutes",
        "ignorePrevStateNull": true,
        "ignorePrevStateUnknown": true,
        "ignorePrevStateUnavailable": true,
        "ignoreCurrentStateUnknown": true,
        "ignoreCurrentStateUnavailable": true,
        "x": 250,
        "y": 1060,
        "wires": [
            [
                "1272312d8f7c69ca"
            ]
        ]
    },
    {
        "id": "1272312d8f7c69ca",
        "type": "change",
        "z": "7e180ead4ba54b28",
        "name": "monthIdx=9",
        "rules": [
            {
                "t": "set",
                "p": "monthIdx",
                "pt": "msg",
                "to": "9",
                "tot": "num"
            }
        ],
        "x": 620,
        "y": 900,
        "wires": [
            [
                "1d3713ec868dad4c"
            ]
        ]
    },
    {
        "id": "71bbbafeba5904af",
        "type": "server-state-changed",
        "z": "7e180ead4ba54b28",
        "name": "Start · November (test)",
        "server": "11e9f35b.61816d",
        "version": 6,
        "outputs": 1,
        "entities": {
            "entity": [
                "input_button.test_lighting_start_november"
            ],
            "substring": [],
            "regex": []
        },
        "outputInitially": false,
        "stateType": "str",
        "for": "0",
        "forType": "num",
        "forUnits": "minutes",
        "ignorePrevStateNull": true,
        "ignorePrevStateUnknown": true,
        "ignorePrevStateUnavailable": true,
        "ignoreCurrentStateUnknown": true,
        "ignoreCurrentStateUnavailable": true,
        "x": 240,
        "y": 1120,
        "wires": [
            [
                "fd39af5e76ed8fce"
            ]
        ]
    },
    {
        "id": "fd39af5e76ed8fce",
        "type": "change",
        "z": "7e180ead4ba54b28",
        "name": "monthIdx=10",
        "rules": [
            {
                "t": "set",
                "p": "monthIdx",
                "pt": "msg",
                "to": "10",
                "tot": "num"
            }
        ],
        "x": 620,
        "y": 940,
        "wires": [
            [
                "1d3713ec868dad4c"
            ]
        ]
    },
    {
        "id": "48108825ef30ebd5",
        "type": "server-state-changed",
        "z": "7e180ead4ba54b28",
        "name": "Start · December (test)",
        "server": "11e9f35b.61816d",
        "version": 6,
        "outputs": 1,
        "entities": {
            "entity": [
                "input_button.test_lighting_start_december"
            ],
            "substring": [],
            "regex": []
        },
        "outputInitially": false,
        "stateType": "str",
        "for": "0",
        "forType": "num",
        "forUnits": "minutes",
        "ignorePrevStateNull": true,
        "ignorePrevStateUnknown": true,
        "ignorePrevStateUnavailable": true,
        "ignoreCurrentStateUnknown": true,
        "ignoreCurrentStateUnavailable": true,
        "x": 260,
        "y": 1160,
        "wires": [
            [
                "d1ea7a97b59263c8"
            ]
        ]
    },
    {
        "id": "d1ea7a97b59263c8",
        "type": "change",
        "z": "7e180ead4ba54b28",
        "name": "monthIdx=11",
        "rules": [
            {
                "t": "set",
                "p": "monthIdx",
                "pt": "msg",
                "to": "11",
                "tot": "num"
            }
        ],
        "x": 620,
        "y": 980,
        "wires": [
            [
                "1d3713ec868dad4c"
            ]
        ]
    },
    {
        "id": "16a139c3b028a514",
        "type": "server-state-changed",
        "z": "7e180ead4ba54b28",
        "name": "Stop (single button)",
        "server": "11e9f35b.61816d",
        "version": 6,
        "outputs": 1,
        "entities": {
            "entity": [
                "input_button.test_lighting_stop"
            ],
            "substring": [],
            "regex": []
        },
        "outputInitially": false,
        "stateType": "str",
        "for": "0",
        "forType": "num",
        "forUnits": "minutes",
        "ignorePrevStateNull": true,
        "ignorePrevStateUnknown": true,
        "ignorePrevStateUnavailable": true,
        "ignoreCurrentStateUnknown": true,
        "ignoreCurrentStateUnavailable": true,
        "x": 1180,
        "y": 520,
        "wires": [
            [
                "9a5d0dd1996e1def"
            ]
        ]
    },
    {
        "id": "9a5d0dd1996e1def",
        "type": "function",
        "z": "7e180ead4ba54b28",
        "name": "flow.stop_flag = true",
        "func": "flow.set('stop_flag', true);\nreturn msg;",
        "outputs": 1,
        "x": 1420,
        "y": 520,
        "wires": [
            [
                "298dbb1eb80e103c"
            ]
        ]
    },
    {
        "id": "sim_set_plus10",
        "type": "inject",
        "z": "b6a2a23f1dc4SIM",
        "name": "Simulate: sunset in +10 min (outside window → no change)",
        "props": [],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0,
        "topic": "",
        "x": 370,
        "y": 180,
        "wires": [
            [
                "sim_fn_set_override_plus10"
            ]
        ]
    },
    {
        "id": "sim_fn_set_override_plus10",
        "type": "function",
        "z": "b6a2a23f1dc4SIM",
        "name": "global override = now + 10m",
        "func": "const iso = new Date(Date.now() + 10*60000).toISOString();\nglobal.set('tlighting_test.sun_next_setting_override', iso);\nnode.status({fill:'blue',shape:'dot',text:'override → +10m'});\nreturn null;",
        "outputs": 0,
        "x": 720,
        "y": 180,
        "wires": []
    },
    {
        "id": "sim_set_plus4",
        "type": "inject",
        "z": "b6a2a23f1dc4SIM",
        "name": "Simulate: sunset in +4 min (pre-window → prePct)",
        "props": [],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0,
        "topic": "",
        "x": 340,
        "y": 220,
        "wires": [
            [
                "sim_fn_set_override_plus4"
            ]
        ]
    },
    {
        "id": "sim_fn_set_override_plus4",
        "type": "function",
        "z": "b6a2a23f1dc4SIM",
        "name": "global override = now + 4m",
        "func": "const iso = new Date(Date.now() + 4*60000).toISOString();\nglobal.set('tlighting_test.sun_next_setting_override', iso);\nnode.status({fill:'green',shape:'dot',text:'override → +4m (pre)'});\nreturn null;",
        "outputs": 0,
        "x": 700,
        "y": 220,
        "wires": []
    },
    {
        "id": "sim_set_now",
        "type": "inject",
        "z": "b6a2a23f1dc4SIM",
        "name": "Simulate: at sunset (→ sunsetPct)",
        "props": [],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0,
        "topic": "",
        "x": 300,
        "y": 260,
        "wires": [
            [
                "sim_fn_set_override_now"
            ]
        ]
    },
    {
        "id": "sim_fn_set_override_now",
        "type": "function",
        "z": "b6a2a23f1dc4SIM",
        "name": "global override = now",
        "func": "const iso = new Date().toISOString();\nglobal.set('tlighting_test.sun_next_setting_override', iso);\nnode.status({fill:'yellow',shape:'dot',text:'override → now (sunset)'});\nreturn null;",
        "outputs": 0,
        "x": 650,
        "y": 260,
        "wires": []
    },
    {
        "id": "sim_set_minus5",
        "type": "inject",
        "z": "b6a2a23f1dc4SIM",
        "name": "Simulate: 5 min after sunset (→ sunsetPct)",
        "props": [],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0,
        "topic": "",
        "x": 330,
        "y": 300,
        "wires": [
            [
                "sim_fn_set_override_minus5"
            ]
        ]
    },
    {
        "id": "sim_fn_set_override_minus5",
        "type": "function",
        "z": "b6a2a23f1dc4SIM",
        "name": "global override = now - 5m",
        "func": "const iso = new Date(Date.now() - 5*60000).toISOString();\nglobal.set('tlighting_test.sun_next_setting_override', iso);\nnode.status({fill:'red',shape:'dot',text:'override → -5m (after)'});\nreturn null;",
        "outputs": 0,
        "x": 700,
        "y": 300,
        "wires": []
    },
    {
        "id": "sim_clear_override",
        "type": "inject",
        "z": "b6a2a23f1dc4SIM",
        "name": "Clear override (use real sun.sun)",
        "props": [],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0,
        "topic": "",
        "x": 300,
        "y": 360,
        "wires": [
            [
                "sim_fn_clear_override"
            ]
        ]
    },
    {
        "id": "sim_fn_clear_override",
        "type": "function",
        "z": "b6a2a23f1dc4SIM",
        "name": "unset global override",
        "func": "global.set('tlighting_test.sun_next_setting_override', null);\nnode.status({fill:'grey',shape:'ring',text:'override cleared'});\nreturn null;",
        "outputs": 0,
        "x": 620,
        "y": 360,
        "wires": []
    },
    {
        "id": "af1f8b4e3f0aSIM1",
        "type": "subflow:sub_tlighting_sun_brightness_test",
        "z": "b6a2a23f1dc4SIM",
        "name": "TLighting Sun Brightness (Test)",
        "env": [
            {
                "name": "PRESHOW_MIN_BEFORE_SUNSET",
                "value": "5"
            },
            {
                "name": "PRESHOW_BRIGHTNESS_PCT",
                "value": "10"
            },
            {
                "name": "SUNSET_BRIGHTNESS_PCT",
                "value": "30"
            },
            {
                "name": "APPLY_TRANSITION_SEC",
                "value": "2"
            }
        ],
        "x": 270,
        "y": 80,
        "wires": []
    },
    {
        "id": "004568a23edf1c24",
        "type": "server-state-changed",
        "z": "ac09184e85596daf",
        "name": "Start Scarlet & Cream (test_husker_game_mode)",
        "server": "11e9f35b.61816d",
        "version": 6,
        "outputs": 1,
        "exposeAsEntityConfig": "",
        "entities": {
            "entity": [
                "input_button.test_husker_game_mode"
            ],
            "substring": [],
            "regex": []
        },
        "outputInitially": false,
        "stateType": "str",
        "ifState": "",
        "ifStateType": "str",
        "outputOnlyOnStateChange": false,
        "for": "0",
        "forType": "num",
        "forUnits": "minutes",
        "ignorePrevStateNull": true,
        "ignorePrevStateUnknown": true,
        "ignorePrevStateUnavailable": true,
        "ignoreCurrentStateUnknown": true,
        "ignoreCurrentStateUnavailable": true,
        "outputProperties": [],
        "x": 220,
        "y": 100,
        "wires": [
            [
                "ae15ee3cd3e29fcf"
            ]
        ]
    },
    {
        "id": "ae15ee3cd3e29fcf",
        "type": "function",
        "z": "ac09184e85596daf",
        "name": "Init Scarlet & Cream Palette",
        "func": "// Scarlet & Cream in HS mode (avoid white channel), one-time brightness init\n// Single source of truth for the light list:\nflow.set('lights', [\n  'light.light_theater_left',\n  'light.light_theater_right',\n  'light.sunroom_light',\n  'light.light_office'\n]);\n\n// HS colors (hue 0–360, sat 0–100). Use a warm cream (not bright white) for smoother transitions.\nflow.set('palette_hs', {\n  scarlet: [0, 100],   // deep red\n  cream:   [48, 28]    // warm beige/cream\n});\n\nflow.set('transition_secs', 30);\nflow.set('brightness_pct', 35);\n\nflow.set('min_wait', 5);\nflow.set('max_wait', 25);\n\nflow.set('stop_flag', false);\nflow.set('brightness_initialized', false); // reserved for future use (send brightness only once)\n\nreturn { payload: 'palette ready' };\n",
        "outputs": 1,
        "timeout": "",
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 560,
        "y": 100,
        "wires": [
            [
                "070f6a513e9cdd41"
            ]
        ]
    },
    {
        "id": "070f6a513e9cdd41",
        "type": "function",
        "z": "ac09184e85596daf",
        "name": "Pick next light for Cream rotation",
        "func": "const lights = flow.get('lights') || [\n    'light.light_theater_left',\n    'light.light_theater_right',\n    'light.sunroom_light_2',\n    'light.light_office'\n];\n\nconst creamIndex = Math.floor(Math.random() * lights.length);\nconst creamLight = lights[creamIndex];\n\nflow.set('cream_light', creamLight);\nreturn { cream_light: creamLight };\n",
        "outputs": 1,
        "timeout": "",
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 840,
        "y": 100,
        "wires": [
            [
                "ee010cec6f7ebfee"
            ]
        ]
    },
    {
        "id": "ee010cec6f7ebfee",
        "type": "function",
        "z": "ac09184e85596daf",
        "name": "Apply Scarlet & Cream Colors",
        "func": "const palette = flow.get('palette_hs');\nconst brightness_pct = flow.get('brightness_pct');\nconst transition = flow.get('transition_secs');\nconst creamLight = flow.get('cream_light');\n\nconst lights = flow.get('lights') || [\n  'light.light_theater_left',\n  'light.light_theater_right',\n  'light.sunroom_light_2',\n  'light.light_office'\n];\n\nif (!palette || !creamLight || !Array.isArray(lights)) {\n  node.warn('Missing palette or cream_light or lights array');\n  return null;\n}\n\n// Build per-light commands using HS color (correct for the palette we set)\nconst cmds = lights.map(id => ({\n  payload: {\n    entity_id: id,\n    hs_color: id === creamLight ? palette.cream : palette.scarlet,\n    brightness_pct,\n    transition\n  }\n}));\n\n// NOTE: Your single api-call-service node will receive an array. Most HA nodes\n// will iterate that array and call the service per element. If yours doesn't,\n// insert a Split node between here and the call-service node to split the array.\nreturn [cmds];\n",
        "outputs": 1,
        "timeout": "",
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 1130,
        "y": 100,
        "wires": [
            [
                "ead18f5d34e18a14"
            ]
        ]
    },
    {
        "id": "ead18f5d34e18a14",
        "type": "api-call-service",
        "z": "ac09184e85596daf",
        "name": "light.turn_on (Scarlet & Cream)",
        "server": "11e9f35b.61816d",
        "version": 7,
        "action": "light.turn_on",
        "entityId": [],
        "data": "payload",
        "dataType": "jsonata",
        "mergeContext": "",
        "mustacheAltTags": false,
        "outputProperties": [],
        "queue": "none",
        "domain": "light",
        "service": "turn_on",
        "x": 1430,
        "y": 100,
        "wires": [
            [
                "e59361f3aad005d8"
            ]
        ]
    },
    {
        "id": "e59361f3aad005d8",
        "type": "delay",
        "z": "ac09184e85596daf",
        "name": "Random wait (5–25s)",
        "pauseType": "random",
        "timeout": "1",
        "timeoutUnits": "seconds",
        "rate": "0",
        "nbRateUnits": "1",
        "rateUnits": "second",
        "randomFirst": "5",
        "randomLast": "25",
        "randomUnits": "seconds",
        "drop": false,
        "allowrate": false,
        "outputs": 1,
        "x": 1730,
        "y": 100,
        "wires": [
            [
                "e5d0e4d4a011d5e9"
            ]
        ]
    },
    {
        "id": "e5d0e4d4a011d5e9",
        "type": "function",
        "z": "ac09184e85596daf",
        "name": "Stop requested?",
        "func": "if (flow.get('stop_flag')) { return [msg, null]; }\nreturn [null, msg];",
        "outputs": 2,
        "x": 1980,
        "y": 100,
        "wires": [
            [
                "4aafdbb4e34b7322"
            ],
            [
                "070f6a513e9cdd41"
            ]
        ]
    },
    {
        "id": "e65522cc3e3ade7b",
        "type": "server-state-changed",
        "z": "ac09184e85596daf",
        "name": "Stop (test_lighting_stop)",
        "server": "11e9f35b.61816d",
        "version": 6,
        "outputs": 1,
        "exposeAsEntityConfig": "",
        "entities": {
            "entity": [
                "input_button.test_stop_husker_mode"
            ],
            "substring": [],
            "regex": []
        },
        "outputInitially": false,
        "stateType": "str",
        "ifState": "",
        "ifStateType": "str",
        "outputOnlyOnStateChange": false,
        "for": "0",
        "forType": "num",
        "forUnits": "minutes",
        "ignorePrevStateNull": true,
        "ignorePrevStateUnknown": true,
        "ignorePrevStateUnavailable": true,
        "ignoreCurrentStateUnknown": true,
        "ignoreCurrentStateUnavailable": true,
        "outputProperties": [],
        "x": 280,
        "y": 260,
        "wires": [
            [
                "8bc72a04e8dab539"
            ]
        ]
    },
    {
        "id": "8bc72a04e8dab539",
        "type": "function",
        "z": "ac09184e85596daf",
        "name": "flow.stop_flag = true",
        "func": "flow.set('stop_flag', true);\nreturn msg;",
        "outputs": 1,
        "x": 560,
        "y": 260,
        "wires": [
            [
                "4aafdbb4e34b7322"
            ]
        ]
    },
    {
        "id": "4aafdbb4e34b7322",
        "type": "function",
        "z": "ac09184e85596daf",
        "name": "All lights → green 100%",
        "func": "msg.payload = {\n  entity_id: [\n    'light.light_theater_left',\n    'light.light_theater_right',\n    'light.sunroom_light_2',\n    'light.light_office'\n  ],\n  rgb_color: [0,255,0],\n  brightness_pct: 100,\n  transition: 1\n};\nreturn msg;",
        "outputs": 1,
        "x": 860,
        "y": 260,
        "wires": [
            [
                "9ef53a2ffc595da9"
            ]
        ]
    },
    {
        "id": "9ef53a2ffc595da9",
        "type": "api-call-service",
        "z": "ac09184e85596daf",
        "name": "light.turn_on → Green",
        "server": "11e9f35b.61816d",
        "version": 7,
        "action": "light.turn_on",
        "entityId": [],
        "data": "payload",
        "dataType": "jsonata",
        "mergeContext": "",
        "mustacheAltTags": false,
        "outputProperties": [],
        "queue": "none",
        "domain": "light",
        "service": "turn_on",
        "x": 1150,
        "y": 260,
        "wires": [
            []
        ]
    }
]
