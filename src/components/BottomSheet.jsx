import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {memo, useEffect, useMemo} from 'react';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  FadeOutUp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  ScrollView,
} from 'react-native-gesture-handler';
import Theme from '../utils/Theme';
import {F5Icon, F6Icon} from '../utils/contstant';
import {useVideoState} from '../context/VideoStateContext';

const color = Theme.DARK;
const {height: SCREEN_HIEGHT, width} = Dimensions.get('window');
// const MAX_TRANSLATE_Y = -SCREEN_HIEGHT / 1.2;

const BottomSheet = props => {
  const {
    children,
    enabled,
    setEnabled,
    max_Trans_Y,
    borderRadius,
    endPoint,
    snapPoint,
    onEnd,
  } = props;
  const {videoState, setVideoState} = useVideoState();

  const translateY = useSharedValue(0);
  const context = useSharedValue({y: 0});
  const MAX_TRANSLATE_Y = videoState.fullscreen
    ? width * 0.03
    : SCREEN_HIEGHT * max_Trans_Y;
  const MAX_HEIGHT = videoState.fullscreen
    ? width - MAX_TRANSLATE_Y - 20
    : SCREEN_HIEGHT - MAX_TRANSLATE_Y - 10;
  const BORDER_RADIUS = borderRadius;
  const END_POINT = videoState.fullscreen
    ? width * endPoint
    : SCREEN_HIEGHT * endPoint;
  const SNAP_POINT = videoState.fullscreen
    ? width * 0.2
    : SCREEN_HIEGHT * snapPoint;
  const LEFT = videoState.fullscreen ? SCREEN_HIEGHT * 0.5 : 0;
  // const RIGHT= 0
  const RIGHT = videoState.fullscreen ? SCREEN_HIEGHT * 0.2 : 0;

  // const MAX_TRANSLATE_Y = SCREEN_HIEGHT *0.1;
  // const MAX_HEIGHT = SCREEN_HIEGHT - MAX_TRANSLATE_Y - 20;
  // const BORDER_RADIUS = 20;
  // const END_POINT = SCREEN_HIEGHT * 0.92;
  // const SNAP_POINT = SCREEN_HIEGHT * 0.6;

  // console.log(MAX_TRANSLATE_Y);
  const tapGesture = Gesture.Tap().onStart(e => {
    runOnJS(setEnabled)(false);
    runOnJS(onEnd)();
    // enabled =false
    // console.log('tap');
  });
  const panGesture = Gesture.Pan()
    .onStart(e => {
      context.value = {y: translateY.value};
    })
    .onUpdate(e => {
      // console.log('translate Y', e.translationY);
      // console.log("height",SCREEN_HIEGHT);
      translateY.value = e.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
    })
    .onEnd(e => {
      // console.log(e.translationY);
      if (translateY.value > SNAP_POINT) {
        translateY.value = END_POINT;
        // console.log("point",SNAP_POINT)
        runOnJS(setEnabled)(false);
        runOnJS(onEnd)();
      } else if (translateY.value < SNAP_POINT) {
        translateY.value = MAX_TRANSLATE_Y;
        // console.log("point",SNAP_POINT)
        // console.log("TransY",MAX_TRANSLATE_Y)
      }
    });
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    };
  });
  useEffect(() => {
    // if(enabled){
    translateY.value = MAX_TRANSLATE_Y;
    // }
  }, [enabled]);

  return (
    enabled && (
      <>
        <GestureDetector gesture={tapGesture}>
          <Animated.View
            entering={FadeIn.delay(10)}
            exiting={FadeOut.delay(10)}
            style={[styles.overlay]}></Animated.View>
        </GestureDetector>
        {videoState.fullscreen ? (
          <View style={[styles.overlayContainer, {left: LEFT, right: 0}]}>
            <View
              style={[
                styles.container,
                {
                  width: '100%',
                  height: '100%',
                  paddingTop: 20,
                  borderRadius: borderRadius,
                },
              ]}>
              <>{children}</>
            </View>
          </View>
        ) : (
          <Animated.View
            style={[
              styles.overlayContainer,
              {left: LEFT, right: RIGHT},
              rStyle,
            ]}>
            <View
              style={[
                styles.container,
                {
                  width: '100%',
                  height: MAX_HEIGHT,
                  borderRadius: BORDER_RADIUS,
                  overflow: 'hidden',
                },
              ]}>
              <GestureDetector gesture={panGesture}>
                <Animated.View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 5,
                  }}>
                  <F6Icon name="grip-lines" color={color.White} size={30} />
                </Animated.View>
              </GestureDetector>
              <>{children}</>
            </View>
          </Animated.View>
        )}
      </>
    )
  );
};

export default memo(BottomSheet);

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    paddingBottom: 10,
  },
  overlayContainer: {
    position: 'absolute',
    flex: 1,
    top: 0,
    // right:0,
    // left:0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    // paddingBottom:10,
  },

  container: {
    backgroundColor: color.DarkBackGround2,
  },
  line: {
    width: 50,
    height: 5,
    backgroundColor: color.White,
    alignSelf: 'center',
    borderRadius: 10,
  },
});
