# React-Native upgrade 2024-01-29

### Time Machine-backup före Sonoma-uppgradering
2024-01-29 ca 10:57

## Icons
### Missing or renamed sicons
md-add
ios-menu
md-image
ios-eye
ios-book

## Current dependencies
- [x] "@plantrail/const": "^1.0.120",
- [x] "@plantrail/shapes": "^2.0.9",
- [x] "@react-native-async-storage/async-storage": "^1.17.12",
  [react-native-async-storage/async-storage: An asynchronous, persistent, key-value storage system for React Native.](https://github.com/react-native-async-storage/async-storage)
- [x] "@react-native-community/netinfo": "^7.0.0",
  [@react-native-community/netinfo](https://www.npmjs.com/package/@react-native-community/netinfo)
- [x] "@react-native-community/push-notification-ios": "^1.10.1",
  [@react-native-community/push-notification-ios](https://www.npmjs.com/package/@react-native-community/push-notification-ios)
- [x] "@react-native-community/segmented-control": "^2.2.2",
- [x] "@react-navigation/elements": "^1.2.1", **används ej?**
- [x] "@react-navigation/native": "^6.0.8",
- [x] "@react-navigation/stack": "^6.2.0",
- [x] "@react-spring/native": "^9.3.1",
- [x] "@redux-devtools/extension": "^3.2.5",
- [x] "@sentry/react-native": "^3.2.13",
- [x] "@shopify/flash-list": "^1.1.0",
- [x] "axios": "^0.24.0",
- [x] "buffer": "^5.7.1",
- [x] "color": "^3.1.3",
- [x] "date-fns": "^2.19.0",
- [ ] "fbjs": "^0.8.18",
- [x] "final-form": "^4.20.4",
- [x] "final-form-arrays": "^3.0.2",
- [x] "i18next": "^19.9.2",
- [x] "immer": "^9.0.6",
- [x] "immutable": "^4.0.0",
- [x] "lodash": "^4.17.21",
- [x] "moment": "^2.29.1",
- [x] "moment-timezone": "^0.5.33",
- [ ] "patch-package": "^6.4.7",
- [x] "paths-js": "^0.4.11",
- [x] "polygon": "^1.0.2",
- [x] "polylabel": "^1.1.0",
- [x] "prop-types": "^15.7.2",
- [x] "react-final-form": "^6.5.3",
- [x] "react-final-form-arrays": "^3.1.3",
- [x] "react-hook-form": "^7.27.0",
- [x] "react-i18next": "^11.8.12",
- [x] "react-immutable-proptypes": "^2.2.0",
- [x] "react-native-animatable": "^1.3.3",
- [x] "react-native-avoid-softinput": "^3.1.5",
- [x] "react-native-blob-util": "^0.13.17",
- [x] "react-native-button": "^3.0.1",
- [x] "react-native-calendars": "^1.1269.0",
- [x] "react-native-camera": "^4.2.1", **behöver bytas ut**
- [x] "react-native-device-info": "^8.4.8",
- [x] "react-native-form-generator": "github:msageryd/react-native-form-generator",
- [x] "react-native-fs": "^2.18.0",
- [x] "react-native-gesture-handler": "^2.14.0",
- [x] "react-native-get-random-values": "^1.7.1", 
- [x] "react-native-haptic-feedback": "^1.13.0",
- [x] "react-native-image-gallery": "^2.1.5",
- [x] "react-native-image-resizer": "^1.4.5",
- [x] "react-native-localize": "^2.1.5", **endast gör att få tag på locales, getLocales()**
- [x] "react-native-modal": "^13.0.0",
- [x] "react-native-orientation-locker": "github:wonday/react-native-orientation-locker",
- [x] "react-native-paper": "^4.10.1",
- [x] "react-native-pdf": "^6.4.0",
- [x] "react-native-permissions": "^3.1.0",
- [x] "react-native-reanimated": "^3.6.1",
- [x] "react-native-render-html": "^6.1.0",
- [x] "react-native-restart": "0.0.22",
- [x] "react-native-safe-area-context": "^4.5.0",
- [x] "react-native-screens": "^3.13.1",
- [x] "react-native-segmented-control-tab": "^3.4.1",
- [x] "react-native-svg": "^12.3.0",
- [x] "react-native-vector-icons": "9.2",
- [x] "react-native-webview": "^11.22.6", **används ej**
- [x] "react-redux": "^7.2.5",
- [x] "reconnecting-websocket": "^4.4.0",
- [x] "redux": "^4.1.2",
- [x] "redux-actions": "^2.6.5", **används ej**
- [x] "redux-persist": "^6.0.0",
- [x] "redux-persist-transform-immutable": "github:awakanto/redux-persist-transform-immutable",
- [x] "redux-saga": "^1.1.3",
- [x] "reselect": "^4.0.0",
- [x] "semver": "^7.3.5",
- [x] "stopword": "^1.0.7",
- [x] "svg.js": "^2.7.1",
- [x] "svgpath": "^2.3.1",
- [x] "transformation-matrix": "^2.7.0", **används ej**
- [x] "transformation-matrix-js": "^2.7.6",
- [x] "traverse": "^0.6.6", **Borde tas bort**
- [x] "use-debounce": "^7.0.1", **används ej**
- [x] "uuid": "^8.3.2",
- [x] "validator": "^13.5.2",
- [x] "xmldom": "^0.6.0" **används ej**


## devDependencies
- [ ] "@babel/core": "^7.16.0",
- [ ] "@babel/preset-env": "^7.16.4",
- [ ] "@babel/runtime": "^7.16.3",
- [ ] "@react-native-community/eslint-config": "^2.0.0",
- [ ] "@rnx-kit/align-deps": "^2.1.4",
- [ ] "@welldone-software/why-did-you-render": "^7.0.1",
- [ ] "babel-jest": "^26.6.3",
- [ ] "babel-plugin-transform-inline-environment-variables": "^0.4.3",
- [ ] "eslint": "^7.31.0",
- [ ] "jest": "^26.6.3",
- [ ] "metro-react-native-babel-preset": "^0.67.0",
- [ ] "react-devtools-core": "^4.22.1",
- [ ] "react-test-renderer": "17.0.2"

