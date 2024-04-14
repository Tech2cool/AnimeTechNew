import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {memo, useMemo, useRef} from 'react';
import Theme from '../../../../utils/Theme';
import {F5Icon, MCIcon, MIcon} from '../../../../utils/contstant';
import {TouchableOpacity} from '@gorhom/bottom-sheet';
import {Slider} from '@react-native-assets/slider';
import {useNavigation} from '@react-navigation/native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Ripple from 'react-native-material-ripple';
import { VidioDuration } from '../../../../utils/functions';

const color = Theme.DARK;
const font = Theme.FONTS;
let count = 0;
const VideoPlayerControls = params => {
  const {
    VideoPlayer,
    setVideoPlayer,
    handlePlayPause,
    handleSeek,
    handleSliderValueChange,
    handleOnFullScreen,
    setTapNumber,
    tapNumber,
    VideoTitle="",
  } = params;
  const navigation = useNavigation();
  const memoizedCurrentTime = useMemo(() => {
    return `${VidioDuration(VideoPlayer.currentTime)}`
    }, [VideoPlayer.currentTime])

    const memoizedDuration = useMemo(() => {
        return `${VidioDuration(VideoPlayer.duration)}`
    }, [VideoPlayer.duration])

  const iconSize = VideoPlayer.fullscreen?40:35;
  const iconColor = color.White;
  // console.log('render Video Controls ' + count);
  // count++;
  const sidRef = useRef(null);
  const tapRef = useRef(null);
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);

  const rewindIcon = useMemo(() => {
    if (VideoPlayer.seekSecond === 5) {
      return 'rewind-5';
    } else if (VideoPlayer.seekSecond === 10) {
      return 'rewind-10';
    } else if (VideoPlayer.seekSecond === 15) {
      return 'rewind-15';
    } else if (VideoPlayer.seekSecond === 30) {
      return 'rewind-30';
    } else if (VideoPlayer.seekSecond === 60) {
      return 'rewind-60';
    }
  }, [VideoPlayer.seekSecond]);

  const forwardIcon = useMemo(() => {
    if (VideoPlayer.seekSecond === 5) {
      return 'fast-forward-5';
    } else if (VideoPlayer.seekSecond === 10) {
      return 'fast-forward-10';
    } else if (VideoPlayer.seekSecond === 15) {
      return 'fast-forward-15';
    } else if (VideoPlayer.seekSecond === 30) {
      return 'fast-forward-30';
    } else if (VideoPlayer.seekSecond === 60) {
      return 'fast-forward-60';
    }
  }, [VideoPlayer.seekSecond]);

  const updateTap = () => {
    setTapNumber(value => value + 1);
    setVideoPlayer(prev => ({
      ...prev,
      showControl: !prev.showControl,
      showSetting: false,
      showQualitySetting: false,
      showPlayBackRateSetting: false,
      seeking: tapNumber >= 2 && true,
    }));

  clearTimeout(tapRef.current)
   tapRef.current = setTimeout(() => {
      setVideoPlayer(prev => ({
        ...prev,
        seeking: false,
      }));
      setTapNumber(0)
    }, 300);
  };

  const SeekBackward = () => {
    handleSeek(VideoPlayer.currentTime - parseInt(VideoPlayer.seekSecond));
    // setTapNumber(prev=> prev+1)
    setVideoPlayer(prev => ({
      ...prev,
      seekTime: prev.seekTime - VideoPlayer.seekSecond,
      seekBackward: true,
    }));
    clearTimeout(sidRef.current);
    sidRef.current = setTimeout(() => {
      // setTapNumber(0)
      setVideoPlayer(prev => ({
        ...prev,
        seekTime: 0,
        seekBackward: false,
        seeking: false,
      }));
    }, 300);
  };

  const SeekForward = () => {
    handleSeek(VideoPlayer.currentTime + parseInt(VideoPlayer.seekSecond));
    // setTapNumber(prev=> prev+1)
    setVideoPlayer(prev => ({
      ...prev,
      seekTime: prev.seekTime + VideoPlayer.seekSecond,
      seekForward: true,
    }));
    clearTimeout(sidRef.current);
    sidRef.current = setTimeout(() => {
      // setTapNumber(0)
      setVideoPlayer(prev => ({
        ...prev,
        seekTime: 0,
        seekForward: false,
        seeking: false,
      }));
    }, 300);
  };
  const tap = Gesture.Tap()
    .onStart(() => {
      runOnJS(updateTap)();
    })
    .onEnd(e => {
      // console.log(e);
      // runOnJS(setTapNumber)(0)
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
      if (e.translationY <= -20 && !VideoPlayer.fullscreen) {
        runOnJS(handleOnFullScreen)();
      } else if (
        (e.translationX < -3 && VideoPlayer.fullscreen) ||
        (e.translationY >= 20 && VideoPlayer.fullscreen)
      ) {
        runOnJS(handleOnFullScreen)();
      }
      translationX.value = 0;
    });

  return (
    <View style={styles.wrapper}>

    <GestureDetector gesture={Gesture.Exclusive(pan, tap)}>
        <Animated.View
          style={[
            {
              // flex:1,
              position: 'absolute',
              // backgroundColor:"red",
              top: VideoPlayer.fullscreen ? 30 : 10,
              left: 0,
              right: 0,
              bottom: VideoPlayer.fullscreen ? 40 : 30,
            },
          ]}></Animated.View>
    </GestureDetector>

    {
      VideoPlayer.showControl && !VideoPlayer.seeking &&(
        <View style={styles.middleLayer}>
          <View style={styles.topView}>
            <View
              style={{
                width: '82%',
                flexDirection: 'row',
                // alignItems: 'center',
                gap: 5,
              }}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <MCIcon name={'arrow-left'} size={iconSize-8} color={iconColor} />
              </TouchableOpacity>
              <Text numberOfLines={1} style={styles.videoTitle}>{VideoTitle}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => Alert.alert('not implemented', 'not added')}>
                <MCIcon
                  name={'dots-vertical'}
                  size={iconSize}
                  color={iconColor}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.middleView}>
            {/* Rewind btn */}
            <TouchableOpacity onPress={SeekBackward}>
              <MCIcon name={rewindIcon} size={iconSize} color={iconColor} />
            </TouchableOpacity>

            {/* Play Pause Btn */}
            <TouchableOpacity onPress={handlePlayPause}>
              <F5Icon
                name={VideoPlayer.paused ? 'play-circle' : 'pause-circle'}
                size={iconSize}
                color={iconColor}
              />
            </TouchableOpacity>
            {/* forward Btn */}
            <TouchableOpacity onPress={SeekForward}>
              <MCIcon name={forwardIcon} size={iconSize} color={iconColor} />
            </TouchableOpacity>
          </View>
          <View style={styles.bottomView}>
            <View style={{flexDirection:"row", gap:5, justifyContent:"space-between", paddingHorizontal:5}}>
              <Text style={styles.time}>{memoizedCurrentTime}</Text>
              <Text style={styles.time}>{memoizedDuration}</Text>
              </View>

            <Slider
              style={{paddingHorizontal: 5, width: '100%'}}
              minimumValue={0}
              value={VideoPlayer.currentTime}
              maximumValue={VideoPlayer.duration}
              minimumTrackTintColor={color.Orange}
              maximumTrackTintColor={color.LightGray}
              trackHeight={VideoPlayer.fullscreen ? 6 : undefined}
              thumbSize={VideoPlayer.fullscreen ? 15 : 12}
              thumbTintColor={color.Orange}
              onValueChange={handleSliderValueChange}
            />


            <View style={styles.bottomBtnsContainer}>
              <View style={{flexDirection: 'row', gap: 10}}>
                <TouchableOpacity
                  onPress={() => Alert.alert('not implemented', 'not added')}>
                  <MCIcon
                    name={'skip-previous'}
                    size={iconSize}
                    color={iconColor}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => Alert.alert('not implemented', 'not added')}>
                  <MCIcon
                    name={'skip-next'}
                    size={iconSize}
                    color={iconColor}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={VideoPlayer.textTracks?.length === 0}
                  onPress={() => Alert.alert('not implemented', 'not added')}>
                  {VideoPlayer.textTracks?.length === 0 ? (
                    <MIcon
                      name={'subtitles-off'}
                      size={iconSize - 5}
                      color={color.LightGray}
                    />
                  ) : (
                    <MCIcon
                      name={'subtitles'}
                      size={iconSize - 5}
                      color={VideoPlayer.showCC ? color.Orange : iconColor}
                    />
                  )}
                </TouchableOpacity>

              </View>

              <View>
                <TouchableOpacity onPress={handleOnFullScreen}>
                  <MCIcon
                    name={
                      VideoPlayer.fullscreen ? 'fullscreen-exit' : 'fullscreen'
                    }
                    size={iconSize + 5}
                    color={iconColor}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
    )}
    {VideoPlayer.seeking && (
        <>
          <Ripple
            width={'40%'}
            rippleOpacity={0.5}
            rippleColor={'rgba(255,255,255,.5)'}
            // rippleContainerBorderRadius={150}
            onPress={SeekBackward}
            style={styles.rippleLeft}>
            {VideoPlayer.seekBackward && (
              <Text style={styles.rippleText}>{VideoPlayer.seekTime}s</Text>
            )}
          </Ripple>
          <Ripple
            width={'40%'}
            rippleOpacity={0.5}
            rippleColor={'rgba(255,255,255,.5)'}
            // rippleContainerBorderRadius={150}
            onPress={SeekForward}
            style={styles.rippleRight}>
            {VideoPlayer.seekForward && (
              <Text style={styles.rippleText}>{VideoPlayer.seekTime}s</Text>
            )}
          </Ripple>
        </>
    )}

    </View>
  );
};

export default memo(VideoPlayerControls);

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    // backgroundColor:color.Red,
  },
  middleLayer: {
    flex: 1,
  },
  rippleText: {
    fontSize: 16,
    fontFamily: font.OpenSansBold,
    color: color.White,
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
    flex: 1,
    paddingTop:10,
    paddingLeft:5,
  },
  middleView: {
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  bottomView: {
    // backgroundColor: 'blue',
    flexDirection: 'column',
    // alignItems:"flex-end",
    justifyContent:"flex-end",
    // gap: 10,
    flex: 1,
    paddingBottom: 5,
  },
  videoTitle: {
    fontFamily: font.OpenSansMedium,
    color: color.White,
    fontSize: 14,
  },
  bottomBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    // backgroundColor: 'red',
  },
  time:{
    fontFamily:font.OpenSansMedium,
    color:color.White,
    fontSize:14,
  }
});
