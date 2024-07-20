/* eslint-disable react-native/no-inline-styles */
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import React, {useMemo, useRef} from 'react';
import Theme from '../../../../utils/Theme';
import {F5Icon, IIcon, MCIcon, MIcon} from '../../../../utils/contstant';
import {Slider} from '@react-native-assets/slider';
import {useNavigation} from '@react-navigation/native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {runOnJS, useSharedValue} from 'react-native-reanimated';
import Ripple from 'react-native-material-ripple';
import {VidioDuration} from '../../../../utils/HelperFunctions';
import {TapControler} from '../Controllers/TapController';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useVideoState} from '../../../../context/VideoStateContext';
import Subtitles from 'react-native-subtitles';

const color = Theme.DARK;
const font = Theme.FONTS;
const hitSlop = {left: 8, bottom: 8, right: 8, top: 8};

const {width, height} = Dimensions.get('window');
const VideoPlayerControls = params => {
  const {
    // videoState,
    // setVideoState,
    handlePlayPause = () => {},
    handleSeek = () => {},
    handleSliderValueChange = () => {},
    handleOnFullScreen = () => {},
    VideoTitle = '',
    controlTimeout = 2000,
    doubleTapInterval = 500,
  } = params;
  const {videoState, setVideoState} = useVideoState();

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const dimensions = useWindowDimensions();

  const leftDoubleTapBoundary =
    dimensions.width / 2 - insets.left - insets.right - 80;

  const rightDoubleTapBoundary =
    dimensions.width - leftDoubleTapBoundary - insets.left - insets.right;

  const memoizedCurrentTime = useMemo(() => {
    return `${VidioDuration(videoState.currentTime)}`;
  }, [videoState.currentTime]);

  const memoizedDuration = useMemo(() => {
    return `${VidioDuration(videoState.duration)}`;
  }, [videoState.duration]);

  const iconSize = videoState.fullscreen ? 35 : 30;
  const iconColor = color.White;

  const sidRef = useRef(null);
  const sliderRef = useRef(null);

  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const controlViewOpacity = useSharedValue(1);
  const doubleLeftOpacity = useSharedValue(0);
  const doubleRightOpacity = useSharedValue(0);
  const doubleTapIsAlive = useSharedValue(false);

  const rewindIcon = useMemo(() => {
    if (videoState.seekSecond === 5) {
      return 'rewind-5';
    } else if (videoState.seekSecond === 10) {
      return 'rewind-10';
    } else if (videoState.seekSecond === 15) {
      return 'rewind-15';
    } else if (videoState.seekSecond === 30) {
      return 'rewind-30';
    } else if (videoState.seekSecond === 60) {
      return 'rewind-60';
    }
  }, [videoState.seekSecond]);

  const forwardIcon = useMemo(() => {
    if (videoState.seekSecond === 5) {
      return 'fast-forward-5';
    } else if (videoState.seekSecond === 10) {
      return 'fast-forward-10';
    } else if (videoState.seekSecond === 15) {
      return 'fast-forward-15';
    } else if (videoState.seekSecond === 30) {
      return 'fast-forward-30';
    } else if (videoState.seekSecond === 60) {
      return 'fast-forward-60';
    }
  }, [videoState.seekSecond]);

  const SeekBackward = () => {
    handleSeek(videoState.currentTime - parseInt(videoState.seekSecond));
    // setTapNumber(prev=> prev+1)
    setVideoState(prev => ({
      ...prev,
      seekTime: prev.seekTime - videoState.seekSecond,
      seekBackward: true,
    }));
    clearTimeout(sidRef.current);
    sidRef.current = setTimeout(() => {
      // setTapNumber(0)
      setVideoState(prev => ({
        ...prev,
        seekTime: 0,
        seekBackward: false,
        seeking: false,
      }));
    }, 500);
  };

  const SeekForward = () => {
    handleSeek(videoState.currentTime + parseInt(videoState.seekSecond));
    // setTapNumber(prev=> prev+1)
    setVideoState(prev => ({
      ...prev,
      seekTime: prev.seekTime + videoState.seekSecond,
      seekForward: true,
    }));
    clearTimeout(sidRef.current);
    sidRef.current = setTimeout(() => {
      // setTapNumber(0)
      setVideoState(prev => ({
        ...prev,
        seekTime: 0,
        seekForward: false,
        seeking: false,
      }));
    }, 500);
  };
  const onTapEvent = () => {
    setVideoState(prev => ({
      ...prev,
      showControl: !prev.showControl,
    }));
  };
  const onDoubleTapEvent = () => {
    setVideoState(prev => ({
      ...prev,
      seeking: true,
    }));
  };
  const tap = Gesture.Tap()
    .onStart(() => {
      runOnJS(onTapEvent)();
    })
    .onEnd(e => {
      // console.log(e);
      // runOnJS(setTapNumber)(0)
    });
  const doubleTapHandle = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(doubleTapInterval)
    .onStart(({x}) => {
      doubleTapIsAlive.value =
        x < leftDoubleTapBoundary && x > rightDoubleTapBoundary;
    })
    .onEnd(({x, y, numberOfPointers}, success) => {
      if (success) {
        if (numberOfPointers !== 1) {
          return;
        }
        if (x < leftDoubleTapBoundary) {
          doubleLeftOpacity.value = 1;

          // rippleLeft.current?.onPress({x, y});
          runOnJS(onDoubleTapEvent)();
          // return;
        }
        if (x > rightDoubleTapBoundary) {
          doubleRightOpacity.value = 1;
          // rippleRight.current?.onPress({
          //   x: x - rightDoubleTapBoundary,
          //   y,
          // });
          runOnJS(onDoubleTapEvent)();

          return;
        }
      }
    });

  const pan = Gesture.Pan()
    .onStart(e => {
      translationX.value = 0;
    })
    .onUpdate(e => {
      translationX.value = e.translationX;
      translationY.value = e.translationY;
    })
    .onEnd(e => {
      if (e.translationY <= -20 && !videoState.fullscreen) {
        runOnJS(handleOnFullScreen)();
      } else if (
        (e.translationX < -3 && videoState.fullscreen) ||
        (e.translationY >= 20 && videoState.fullscreen)
      ) {
        runOnJS(handleOnFullScreen)();
      }
      translationX.value = 0;
    });
  const onPauseTapHandler = () => {
    'worklet';
    runOnJS(handlePlayPause)();
  };
  const onSeekBackTapHandler = () => {
    'worklet';
    runOnJS(SeekBackward)();
  };
  const onSeekFowardTapHandler = () => {
    'worklet';
    runOnJS(SeekForward)();
  };
  const goBack = () => {
    navigation.goBack();
  };
  const onSettingPress = () => {
    setVideoState(prev => ({
      ...prev,
      showSetting: !videoState.showSetting,
    }));
  };

  const onBackTapHandler = () => {
    'worklet';
    runOnJS(goBack)();
  };
  const onSettingTapHandler = () => {
    'worklet';
    runOnJS(onSettingPress)();
  };
  const showHideCaption = () => {
    setVideoState(prev => ({
      ...prev,
      showSubtitle: !prev.showSubtitle,
    }));
  };
  const onCaptionTapHandler = () => {
    'worklet';
    runOnJS(showHideCaption)();
  };

  const onFullscreenTapHandler = () => {
    'worklet';
    runOnJS(handleOnFullScreen)();
  };
  const onDummyTapHandler = () => {
    'worklet';
    // runOnJS(handleOnFullScreen)();
  };
  const taps = Gesture.Exclusive(doubleTapHandle, tap);
  const gesture = Gesture.Race(pan, taps);

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: videoState.showControl
            ? 'rgba(0,0,0,0.5)'
            : undefined,
        },
      ]}>
      {videoState.selectedSubtitle.file && videoState.showSubtitle && (
        <View style={{position: 'absolute', bottom: -15, left: 0, right: 0}}>
          <Subtitles
            currentTime={videoState.currentTime}
            textStyle={{
              color: color.White,
              fontFamily: font.RobotoMedium,
              fontSize: videoState.fullscreen ? 20 : 13,
              backgroundColor: 'transparent',
              textShadowColor: 'rgba(0,0,0,0.5)',
              textShadowOffset: {width: 1, height: -1},
              textShadowRadius: 10,
            }}
            containerStyle={{
              backgroundColor: 'transparent',
            }}
            selectedsubtitle={{
              file: videoState.selectedSubtitle.file
                ? videoState.selectedSubtitle.file
                : '',
            }}
          />
        </View>
      )}

      <GestureDetector gesture={gesture}>
        <Animated.View
          hitSlop={hitSlop}
          style={[styles.wrapper, {top: videoState.fullscreen ? 15 : 0}]}>
          {videoState.showControl && !videoState.seeking && (
            <View style={styles.middleLayer}>
              <View style={styles.topView}>
                <View
                  style={{
                    flex: 3,
                    // width: '82%',
                    flexDirection: 'row',
                    paddingTop: videoState.fullscreen ? 0: 5,
                    alignItems: 'center',
                    gap: 5,
                  }}>
                  <TapControler onPress={onBackTapHandler}>
                    <MCIcon
                      name={'arrow-left'}
                      size={iconSize - 8}
                      color={iconColor}
                    />
                  </TapControler>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.videoTitle,
                      {fontSize: videoState.fullscreen ? 14 : 13},
                    ]}>
                    {VideoTitle}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingRight: 10,
                    paddingLeft: 5,
                    gap: 10,
                    alignSelf: 'flex-end',
                    justifyContent: 'flex-end',
                  }}>
                  <TapControler onPress={onCaptionTapHandler}>
                    <MIcon
                      name={
                        videoState.showSubtitle
                          ? 'closed-caption'
                          : 'closed-caption-off'
                      }
                      size={iconSize - 5}
                      color={videoState.showSubtitle ? color.Orange : iconColor}
                    />
                  </TapControler>

                  <TapControler onPress={onSettingTapHandler}>
                    <IIcon
                      name={'settings-outline'}
                      size={iconSize - 5}
                      color={iconColor}
                    />
                  </TapControler>
                </View>
              </View>
              <View style={styles.middleView}>
                {/* Rewind btn */}
                <TapControler onPress={onSeekBackTapHandler}>
                  <MCIcon name={rewindIcon} size={iconSize} color={iconColor} />
                </TapControler>

                {/* Play Pause Btn */}
                <TapControler onPress={onPauseTapHandler}>
                  <F5Icon
                    name={videoState.paused ? 'play-circle' : 'pause-circle'}
                    size={iconSize + 5}
                    color={iconColor}
                  />
                </TapControler>

                {/* forward Btn */}
                <TapControler onPress={onSeekFowardTapHandler}>
                  <MCIcon
                    name={forwardIcon}
                    size={iconSize}
                    color={iconColor}
                  />
                </TapControler>
              </View>
              <View style={[styles.bottomView]}>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 5,
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    paddingHorizontal: 5,
                  }}>
                  <Text style={styles.time}>
                    {memoizedCurrentTime} / {memoizedDuration}
                  </Text>
                  {/* <Text style={styles.time}>{memoizedDuration}</Text> */}

                  <TapControler onPress={onFullscreenTapHandler}>
                    <MCIcon
                      name={
                        videoState.fullscreen ? 'fullscreen-exit' : 'fullscreen'
                      }
                      size={iconSize + 5}
                      color={iconColor}
                    />
                  </TapControler>
                </View>
              </View>
            </View>
          )}
        </Animated.View>
      </GestureDetector>
      {videoState.showControl && (
        <Animated.View
          style={[
            {
              flex: 1,
              position: 'absolute',
              bottom: videoState.fullscreen ? 10 : -5,
              left: 0,
              right: 0,
              // backgroundColor:"red",
              // marginTop: 5,
            },
          ]}>
          {/* <TapControler onPress={onDummyTapHandler}> */}
          <Slider
            ref={sliderRef}
            style={{paddingHorizontal: 5, width: '100%'}}
            minimumValue={0}
            value={videoState.currentTime}
            maximumValue={videoState.duration}
            minimumTrackTintColor={color.Orange}
            maximumTrackTintColor={color.LightGray}
            trackHeight={videoState.fullscreen ? 6 : undefined}
            thumbSize={videoState.fullscreen ? 15 : 12}
            thumbTintColor={color.Orange}
            onValueChange={handleSliderValueChange}
          />
          {/* </TapControler> */}
        </Animated.View>
      )}

      {videoState.seeking && (
        <>
          <Ripple
            width={'40%'}
            rippleOpacity={0.5}
            rippleColor={'rgba(255,255,255,.5)'}
            // rippleContainerBorderRadius={150}
            onPress={SeekBackward}
            // style={styles.rippleLeft}
            style={[controlStyle.doubleTap, controlStyle.leftDoubleTap]}>
            {videoState.seekBackward && (
              <Text style={styles.rippleText}>{videoState.seekTime}s</Text>
            )}
          </Ripple>
          <Ripple
            width={'40%'}
            rippleOpacity={0.5}
            rippleColor={'rgba(255,255,255,.5)'}
            // rippleContainerBorderRadius={150}
            onPress={SeekForward}
            // style={styles.rippleRight}
            style={[
              controlStyle.doubleTap,
              controlStyle.rightDoubleTapContainer,
            ]}>
            {videoState.seekForward && (
              <Text style={styles.rippleText}>{videoState.seekTime}s</Text>
            )}
          </Ripple>
        </>
      )}
    </View>
  );
};

export default VideoPlayerControls;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    // backgroundColor:color.Red,
  },
  middleLayer: {
    flex: 1,
    position: 'relative',
    // backgroundColor: 'rgba(0,0,0,0.5)',
  },
  rippleText: {
    fontSize: 16,
    fontFamily: font.OpenSansBold,
    color: color.White,
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 10,
    borderRadius: 99,
  },
  rippleLeft: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:"red",
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
  },
  rippleRight: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:"red",
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
  },

  topView: {
    // backgroundColor: 'green',
    flexDirection: 'row',
    // alignItems:"center",
    justifyContent: 'space-between',
    gap: 10,
    // flex: 1,
    paddingTop: 0,
    paddingLeft: 5,
  },
  middleView: {
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    flex: 2,
  },
  bottomView: {
    // backgroundColor: 'blue',
    // flexDirection: 'column',
    // alignItems:"flex-end",
    justifyContent: 'center',
    // gap: 10,
    flex: 1,
    // paddingVertical: 10,
  },
  videoTitle: {
    fontFamily: font.OpenSansMedium,
    color: color.White,
    fontSize: 14,
    paddingVertical: 4,
  },
  bottomBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    // backgroundColor: 'red',
  },
  time: {
    fontFamily: font.OpenSansMedium,
    color: color.White,
    fontSize: 14,
  },
});

const controlStyle = StyleSheet.create({
  autoPlay: {
    height: 24,
    marginRight: 32,
    width: 24,
  },
  autoPlayText: {
    marginRight: 10,
  },
  bottomControlGroup: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  bottomControls: {
    bottom: 0,
    position: 'absolute',
    width: '100%',
  },
  fullToggle: {
    height: 20,
    width: 20,
  },
  group: {
    paddingHorizontal: 20,
  },
  line: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  pause: {
    height: 48,
    width: 48,
  },
  pauseView: {
    alignSelf: 'center',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  timerText: {
    textAlign: 'right',
  },
  doubleTap: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },

  leftDoubleTap: {
    left: 0,
    borderTopRightRadius: width,
    borderBottomRightRadius: width,
  },

  rightDoubleTapContainer: {
    borderTopLeftRadius: width,
    borderBottomLeftRadius: width,
    right: 0,
  },
  backStep: {
    width: 40,
    height: 40,
  },
});
