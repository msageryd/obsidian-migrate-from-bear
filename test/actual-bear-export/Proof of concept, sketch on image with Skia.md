# Proof of concept, sketch on image with Skia
#plantrail/blueprints

## Description
Use a JPG image as background for a Skia sketch in React Native. The image will be bigger that the screen (example 4000x3000 px), so the Skia canvas needs to be able to pan and zoom.

The sketch will work as an overlay for the image and might consist of 5000 rectangles and lines. Usually the rectangle count is less than 100.

### Panning
* If finger is lifted while panning, the velocity should result in an inertia “fling”
* If panning reaches the end of the canvas there should be a small bounce

### Zooming
* Zooming should be performed  by pinching two fingers
* Rotation via pinching is not needed.
* Double-tap should result an animated zoom to a preconfigured zoom level with the tap position as the new screen center

### Performance
We have an implementation of this today, using react-native-svg. The zooming, panning and animation is performed entirely with JavaScript. Our solution is not performant when the rectangle-count reaches 1000, so we want to explore the possibilities to migrate to Skia.

## Tools to use
* react-native-skia
* react-native-reanimated 3


## Concepts to use
### Transforms
Transforms can be done with matrix if the code is clear on how it’s done.
It’s also ok to transform X,Y,scale separately

### GestureDetector
React-native-gesture-handler can be used via a hook provided by rn-skia.

We need to act on gestures outside of Skia as well, so I’d prefer if gestures are detected using GestureDetector directly from react-native-gesture-handler.