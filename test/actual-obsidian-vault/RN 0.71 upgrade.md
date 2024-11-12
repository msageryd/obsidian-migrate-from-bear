# RN 0.71 upgrade

#PlanTrail

## ToDo
- [ ] uuid -> upgrade



## Current dependencies
- [x] “@plantrail/const”: “^1.0.113”,
- [x] “@plantrail/shapes”: “^1.0.42”,
- [x] “@react-native-async-storage/async-storage”: “^1.17.11”, **1.17.11**
- [x] “@react-native-community/netinfo”: “^7.1.2”, **9.3.7**
- [x] “@react-native-community/push-notification-ios”: “^1.10.1”, **1.10.1**
- [x] “@react-native-community/segmented-control”: “^2.2.2”, **2.2.2**

 *-@react-navigation/elements”: “^1.2.1”,-* **not used**
- [x] “@react-navigation/native”: “^6.0.6”, **6.1.3**
- [x] “@react-navigation/stack”: “^6.0.11”, **6.3.14**
- [x] “@react-spring/native”: “^9.3.1”, **9.6.1**
- [x] “@redux-devtools/extension”: “^3.2.2”, **3.2.5**
- [x] “@sentry/react-native”: “^3.2.13”, **4.15**
- [x] “@shopify/flash-list”: “^1.1.0”, **1.4.1**
- [x] “axios”: “^0.24.0”, **1.3.3**
- [x] “buffer”: “^5.7.1”, **6.0.3**. (Needed ??)
- [x] “color”: “^3.1.3”, **4.2.3**
- [x] “date-fns”: “^2.19.0”, **2.29.3**

*-“fbjs”: “^0.8.18”,* **unused**
- [x] “final-form”: “^4.20.4”, **4.20.9**
- [x] “final-form-arrays”: “^3.0.2”, **3.1.0**
- [x] “i18next”: “^19.9.2”, **22.4.10**
- [x] “immer”: “^9.0.6”, **9.0.19**
- [x] “immutable”: “^4.0.0”, 4.2.4
- [x] “lodash”: “^4.17.21”, **4.17.21**
- [x] “moment”: “^2.29.1”,  **2.29.4**
- [x] “moment-timezone”: “^0.5.33”, **0.5.40**
  - [x] “patch-package”: “^6.4.7”, **6.5.1**
  - [x] “paths-js”: “^0.4.11”, **0.4.11**
- [x] “pod-install”: “^0.1.38”, **0.1.38**
- [x] “polygon”: “^1.0.2”, **1.0.2**
- [x] “polylabel”: “^1.1.0”, **1.1.0**
- [x] “prop-types”: “^15.7.2”, **15.8.1**
- [x] “react-final-form”: “^6.5.3”, 6.5.9
- [x] “react-final-form-arrays”: “^3.1.3”, 3.1.4

  *“react-hook-form”: “^7.27.0”,* **unused**
- [x] “react-i18next”: “^11.8.12”, **12.1.5**
- [x] “react-immutable-proptypes”: “^2.2.0”, **2.2.0**
- [x] “react”: “18.2.0”,
- [x] “react-native”: “^0.71.3”,
- [x] “react-native-animatable”: “^1.3.3”, **1.3.3**
- [x] “react-native-blob-util”: “^0.13.17”,  **0.17.1**
- [x] “react-native-button”: “^3.0.1”, **3.0.1**
- [x] “react-native-calendars”: “^1.1269.0”, **1.1293.0**

  **“react-native-camera”: “^4.2.1”, deprecated !!!**
- [x] npm I react-native-vision-camera **2.15.4**
- [x] “react-native-device-info”: “^8.4.8”, **10.4.0**
- [ ] “react-native-flipper”: “^0.181.0”,
- [x] “react-native-form-generator”: “github:msageryd/react-native-form-generator”,
- [x] “react-native-fs”: “^2.18.0”, **2.20.0**
- [x] “react-native-gesture-handler”: “^1.10.3”, **2.9.0**

 **“react-native-get-random-values”: “^1.7.1”,** **Needed ??**
- [x] “react-native-haptic-feedback”: “^1.13.0”, **1.14.0**
- [x] “react-native-image-gallery”: “^2.1.5”, **2.1.5**
- [x] “react-native-image-resizer”: “^1.4.5”, **1.4.5**
- [x] “react-native-keyboard-aware-scroll-view”: “^0.9.5”, **0.9.5**
- [x] “react-native-localize”: “^2.1.5”, **2.2.4**
- [x] “react-native-modal”: “^13.0.0”, **13.0.1**

  **“react-native-orientation-locker”: “^1.3.1”,** **1.5 not react 18 compat?**
- [x] “react-native-paper”: “^4.10.1”, **5.2.0**
- [x] “react-native-pdf”: “^6.4.0”, **6.6.2**
- [x] “react-native-permissions”: “^3.6.0”, **3.6.1**
- [x] “react-native-qrcode-svg”: “^6.1.1”, **6.2.0**
- [x] “react-native-reanimated”: “^2.2.4”, **2.4.14**
- [x] “react-native-render-html”: “^5.1.0”, **6.3.4**
- [x] “react-native-restart”: “0.0.22”, **0.0.27**
- [x] “react-native-safe-area-context”: “^3.3.2”, **4.5.0**

  “react-native-screens”: “^3.9.0”, **needed?**
- [x] “react-native-segmented-control-tab”: “^3.4.1”, **4.0.0**
- [x] “react-native-svg”: “^13.8.0”, **13.8.0**
- [x] “react-native-vector-icons”: “9.2”, **9.2**

  *“react-native-webview”: “^11.14.3”,* **not used atm**
- [x] “react-redux”: “^7.2.5”, **8.0.5**
- [x] “reconnecting-websocket”: “^4.4.0”, **4.4.0**
- [x] “redux”: “^4.1.2”, **4.2.1**
- [x] “redux-actions”: “^2.6.5”, **3.0.0**

  “redux-flipper”: “^2.0.1”, **needed?**
- [x] “redux-persist”: “^6.0.0”, **6.0.0**
- [x] “redux-persist-transform-immutable”: “github:awakanto/redux-persist-transform-immutable”,
- [ ] “redux-saga”: “^1.1.3”, **1.2.2**
- [x] “reselect”: “^4.0.0”, **4.1.7**
- [x] “semver”: “^7.3.5”, **7.3.8**
- [x] “stopword”: “^1.0.7”, **2.0.7**
- [x] “svg.js”: “^2.7.1”, **2.7.1**
- [x] “svgpath”: “^2.3.1”, **2.6.0**
- [x] “transformation-matrix”: “^2.7.0”, **2.14.0**
- [x] “transformation-matrix-js”: “^2.7.6”, **2.7.6**
- [x] “traverse”: “^0.6.6”, 0.6.7

  *“use-debounce”: “^7.0.1”, **not used***
- [x] “uuid”: “^8.3.2”, **9.0.0**
- [x] “validator”: “^13.5.2”, **13.9.0 (should be used via @plantrail/util)**-    “xmldom”: “^0.6.0” **not used**
