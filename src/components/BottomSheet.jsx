import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useMemo} from 'react';
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
import {Gesture, GestureDetector, ScrollView} from 'react-native-gesture-handler';
import Theme from '../utils/Theme';
import { useVideoPlayer } from '../contexts/VideoContext';

const color = Theme.DARK;
const {height: SCREEN_HIEGHT, width} = Dimensions.get('window');
// const MAX_TRANSLATE_Y = -SCREEN_HIEGHT / 1.2;

const BottomSheet = (props) => {
  const {
    children, 
    max_TransY, 
    snap_min, 
    snap_max, 
    enabled,
    setEnabled, 
    snap_bottom_position,
    onEnd,
  } = props;
  const {VideoPlayer, setVideoPlayer} = useVideoPlayer();

  const translateY = useSharedValue(0);
  const context = useSharedValue({y: 0});
  // const itemHeight = useSharedValue(ITEM_HEIGHT);
  const marginVertical = useSharedValue(5);
  const MAX_TRANSLATE_Y = VideoPlayer.fullscreen?-width /max_TransY :-SCREEN_HIEGHT / max_TransY;
  const MIN_SNAP_POINT = -SCREEN_HIEGHT / snap_min;
  const MAX_SNAP_POINT = -SCREEN_HIEGHT / snap_max;

  // console.log(MAX_TRANSLATE_Y);
  const tapGesture = Gesture.Tap().onStart(e => {
    runOnJS(setEnabled)(false)
    runOnJS(onEnd)()
    // enabled =false
  });
  const panGesture = Gesture.Pan()
    .onStart(e => {
      context.value = {y: translateY.value};
    })
    .onUpdate(e => {
      // console.log(e.translationY);
      translateY.value = e.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
    })
    .onEnd(e => {
      // console.log(e.translationY);
      if (translateY.value > MAX_SNAP_POINT) {
        translateY.value = -snap_bottom_position;
        runOnJS(setEnabled)(false)
        runOnJS(onEnd)()
      } else if (translateY.value < MIN_SNAP_POINT) {
        translateY.value = MAX_TRANSLATE_Y;
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

  return enabled &&(
      <>
        <GestureDetector gesture={tapGesture}>
          <Animated.View 
            entering={FadeIn.delay(10)}
            exiting={FadeOut.delay(10)}
              style={[styles.overlay]}></Animated.View>
        </GestureDetector>
        <View
          style={[styles.overlayContainer]}>
          <Animated.View 
          style={[VideoPlayer.fullscreen?styles.containerF:styles.container,{height:VideoPlayer.fullscreen?"100%":SCREEN_HIEGHT / max_TransY}, rStyle]}>
            <GestureDetector gesture={panGesture}>
              <Animated.View
                style={[{width:"100%", height: 25, paddingVertical: 5}]}>
                <View style={styles.line}></View> 
              </Animated.View>
            </GestureDetector>
            <ScrollView>{children}</ScrollView>
          </Animated.View>
        </View>
        </>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:"100%",
    backgroundColor: color.DarkBackGround2,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 5,
    alignSelf: 'center',
  },
  containerF: {
    flex: 1,
    backgroundColor: color.DarkBackGround2,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 5,
    alignSelf: 'center',
    justifyContent:"center",
  },
  overlay:{
    zIndex: 22,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  overlayContainer:{
    zIndex: 22,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: '98%',
    height: '100%',
    marginHorizontal: 10,
  },
  line: {
    width: 50,
    height: 5,
    backgroundColor: color.White,
    alignSelf: 'center',
    borderRadius: 10,
  },
});
