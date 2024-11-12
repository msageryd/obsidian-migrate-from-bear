# Redux upgrade
It will probably be really hard to upgrade the store live. I.e. users must logout before upgrading.

### Upgrade solution
The new store structure will be stored under a new AsyncStorage key. The old key  will not be removed. If, by chance, a user had un-synced data in the old store, a simple downgrade to the old app version would solve this, since the old app will read the old store.

We cannot know when it's safe to remove the old store, so we will keep it for now. The only way for the user to reclaim the storage space is to completely remove PlanTrail and reinstall int. The store is probably just a couple of MB in size, so it won't hurt much to keep it.

## ToDo
- [ ] Rename root for asyncStorage to "plantrail"
- [ ] Remove green screen-flash while loading store
- [ ] Integrate **new** components from `component-lib` into `mobile-app`

## Dependencies
- [x] Upgrade to redux-persist  v6
- [x] Upgrade to redux-persist-immutable to v5
- [x] Get rid of redux-immutable (immutable root object)

## Bootstrap
The old bootstrap concept will be replaced by nothing, i.e. no bootstrap function. Instead  `<PersistGate>` will handle the load timing, i.e.  wait until store is loaded from disk and the render the app.

We need to migrate some stuff from the old bootStrap function:
- [x] `ensureFilePaths` (for now, handled in a useEffect)
- [x] `buildSTyles` ? probably not needed. Handled elsewhere?

### Bootstrap, second thought
We still need to pause rendering of the app until some chores are done. I't not enough to wait for store rehydration. 

The `PersistGate.onBeforePersistGateLift` -event will be used for startin our own bootStrap.
 

## Middleware
The new store config and dependency upgrades  needs to be tended to in our store creation.

Reconnect the following in a modern fashion, i.e. as per latest docs:
- [x] Saga
- [x] Sentry
- [x] redux-devtools


## Coerced keys
The new redux-persist-immutable cannot handle integer keys for maps. This might be solvable if we write a custom persister, but the drawbacks are many:
* time consuming to write
* not debuggable in react-native-debugger (this is the reson why int keys are not supported in redux-persist-immutable)
* we want to migrate from Immutable anyway. When we migrate there will be coerced keys everywhere due to Javascripts handling of int keys.

### Migrating to string keys
I choose to migrate everything to string keys. Every reducer and every selector must handle this. It will probably take a day to fix this..

- [x] CompanyState
- [x] CompanySelectors
- [x] ControlpointState
- [x] ControlpointSelectors
- [x] ControlpointTypeState
- [x] ControlpointTypeSelectors
- [x] DeviationTypeState
- [x] DeviationTypeSelectors
- [x] DrawingState
- [x] DrawingSelectors
- [x] FileState
- [x] FileSelectors
- [x] HelpState
- [x] HelpSelectors
- [x] FormState
- [x] FormSelectors
- [x] InboxState
- [x] InboxSelectors
- [x] InspectionState
- [x] InspectionSelectors
- [x] InspectionTypeState
- [x] InspectionTypeSelectors
- [x] JournalState
- [x] JournalSelectors
- [x] JournalItemTypeState
- [x] JournalItemTypeSelectors
- [x] LogSelectors
- [x] LogState
- [x] MessageState
- [x] MessageSelectors
- [x] MetadataSelectors
- [x] MetadataState
- [x] ProductState
- [x] ProductSelectors
- [x] ProjectState
- [x] ProjectSelectors
- [x] ReportState
- [x] ReportSelectors
- [x] ReportTypeState
- [x] RepostTypeSelectors
- [x] SegmenedHierarchyState
- [x] SegmentedHierarchySelectors
- [x] SensorState
- [x] SensorSelectors
- [x] SettingState
- [x] SettingsSelectors
- [x] SnippetState
- [x] SnippetSelectors
- [x] StatisticsState
- [x] SymbolState
- [x] SymbolSelectors
- [x] SyncState
- [x] SyncSelectors
- [x] SystemState
- [x] SystemSelectors
- [x] UserState
- [x] UserSelectors

#### Other files (than state and selectors)
- [x] shapeController
- [x] ShapeCollection
- [x] ControlpointNavListView
- [x] JournalListView
- [x] JournalListItem
- [x] JournalItemView

## Build Targets
Manually update target for pods:

- [ ] RCT_FOLLY 9->10
- [ ] react-native-camera 9->10
- [ ] react-native-image-resizer 8->10
- [ ] RNAsyncStorage 9->10
- [ ] react-native-blob-util 8->10
- [ ] react-native-image-resizer 8-10
- [ ] react-native-webview 9->11
- [ ] RNFS 8>10
- [ ] RNCMaskedView 9->10
- [ ] RNDeviceInfo 9->10
- [ ] RNGestureHandler 9->10
- [ ] RNLocalize 9->10
- [ ] RNSentry 8->10
- [ ] RNSvg 9->10
- [ ] RNVectorIcons 9->10
- [ ] Sentry 9->10
- [ ] react-native-get-random-values-9->10
- [ ] react-native-netinfo 9->10
- [ ] react-native-orientation-locker 8->10
- [ ] react-native-pdf 8->10
- [ ] react-native-restart 9->10
- [ ] react-native-safe-area-context 9->10
- [ ] react-native-segmented-control 9->10
- [ ] RNReactNativeHapticFeedback 9->10
- [ ] RNReanimated 9->10
- [ ] RNScreens 9->10
- [ ] 
