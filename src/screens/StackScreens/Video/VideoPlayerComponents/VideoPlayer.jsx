import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Theme from '../../../../utils/Theme';
import Video from 'react-native-video';
import VideoPlayerControls from './VideoPlayerControls';
import Orientation from 'react-native-orientation-locker';
import SilderComp from '../SmallComponents/SilderComp';
import {getAsyncData, setAsyncData} from '../../../../utils/HelperFunctions';
import {useVideoState} from '../../../../context/VideoStateContext';

const color = Theme.DARK;
const font = Theme.FONTS;
let ProgressCount = 1;
const {width, height} = Dimensions.get('window');
const VideoPlayyer = ({
  id,
  url,
  subtitleStyle,
  videoTitle,
  headers,
  isLoading = false,
  progressTrackFunc = () => {},
}) => {

  const videoRef = useRef(null);
  const {videoState, setVideoState} = useVideoState();
  //   console.log("render VideoPlayer")
  const handlePlayPause = () => {
    if (videoState.paused) {
      videoRef.current.resume();
      setVideoState({...videoState, paused: false});
    } else {
      videoRef.current.pause();
      setVideoState({...videoState, paused: true});
    }
  };

  const handleOnLoad = async e => {
    await checkVideoCache(e?.duration);
    // console?.log(JSON.stringify(e,null,2))
    setVideoState({
      ...videoState,
      duration: e?.duration,
      // currentTime: e?.currentTime,
      audioTracks: e?.audioTracks,
      canPlayReverse: e?.canPlayReverse,
      canPlaySlowForward: e?.canPlaySlowForward,
      canPlaySlowReverse: e?.canPlaySlowReverse,
      canStepBackward: e?.canStepBackward,
      canStepForward: e?.canStepForward,
      naturalSize: e?.naturalSize,
      // textTracks: e?.textTracks,
      trackId: e?.trackId,
      // videoTracks: e?.videoTracks,
      end: false,
    });
  };
  const handleOnEnd = () => {
    videoRef.current.pause();
    setVideoState({...videoState, paused: true});
  };
  const handleSeek = value => {
    // if(!videoState.seeking) return
    videoRef.current.seek(value);
    setVideoState({...videoState, currentTime: value});
    // setVideoState(prev => ({...prev, currentTime: value}));
  };
  const handleSliderValueChange = value => {
    // setVideoState(prev=>({ ...prev, currentTime: value }))
    handleSeek(value);
  };

  const handleProgress = e => {
    if (!videoState.seeking) {
      setAsyncData(id, JSON.stringify(e?.currentTime) || '0');
      setVideoState(prev => ({
        ...prev,
        currentTime: e?.currentTime,
        playableDuration: e?.playableDuration,
        seekableDuration: e?.seekableDuration,
      }));
      // setMyList(e.currentTime, videoState.duration);
      if (!videoState.paused && videoState.showControl) {
        if (ProgressCount < 10) {
          ProgressCount++;
        } else if (ProgressCount >= 10) {
          ProgressCount = 1;
          setVideoState(prev => ({...prev, showControl: false}));
        }
      } else {
        ProgressCount = 1;
      }
      progressTrackFunc();
    }
  };
  const handleOnFullScreen = () => {
    if (videoState.fullscreen) {
      setVideoState(prev => ({...prev, fullscreen: false}));
      Orientation.lockToPortrait();
      // SystemNavigationBar.stickyImmersive(false);
      videoRef.current.dismissFullscreenPlayer();
    } else {
      setVideoState(prev => ({...prev, fullscreen: true}));
      Orientation.lockToLandscape();
      // SystemNavigationBar.stickyImmersive();
      videoRef.current.presentFullscreenPlayer();
    }
  };

  const handleBuffering = e => {
    setVideoState(prev => ({...prev, buffering: e?.isBuffering}));
  };
  const onFullscreenPlayerWillDismiss = () => {
    // Orientation.lockToPortrait();
    // console.log('exist fullscreen');
  };

  const onFullscreenPlayerWillPresent = () => {
    // Orientation.lockToLandscape()
    // console.log('enter fullscreen');
  };
  const checkVideoCache = async duration => {
    try {
      const resp = await getAsyncData(id);
      if (resp) {
        handleSeek(JSON.parse(resp));
      } else {
        handleSeek(0);
      }
    } catch (error) {
      ToastAndroid.show('err', error?.message);
    }
    if (duration) {
      setVideoState(prev => ({
        ...prev,
        duration: duration,
      }));
    }
  };
  const handleonVideoTracks = e => {
    // console.log(e)
    // console.log(videoState.selectedVideoTrack)
    const tracks = [];
    tracks.push({
      selected: true,
      height: 'auto',
      width: 'auto',
      url: videoState.url,
      trackId: -1,
    });
    e?.videoTracks?.map(trck => {
      tracks.push(trck);
    });
    // console.log(JSON.stringify(tracks, null, 2))
    setVideoState(prev => ({
      ...prev,
      videoTracks: tracks,
    }));
  };
  useEffect(() => {
    checkVideoCache();
  }, [id]);

  return (
    <View
      style={[
        videoState.fullscreen ? styles.containerFullscreen : styles.container,
      ]}>
      <Video
        ref={videoRef}
        source={{
          uri: url,
          headers: headers,
        }}
        style={videoState.fullscreen ? styles.videoFullScreen : styles.video}
        controls={false}
        fullscreen={videoState.fullscreen}
        paused={videoState.paused}
        rate={videoState.playbackRate}
        selectedVideoTrack={videoState.selectedVideoTrack}
        onVideoTracks={handleonVideoTracks}
        // selectedTextTrack={videoState.selectedTextTrack}
        // textTracks={videoState.textTracks}
        resizeMode={videoState.resizeMode}
        onError={e => Alert.alert('error', e?.error?.errorString)}
        onProgress={handleProgress}
        onBuffer={handleBuffering}
        onLoad={handleOnLoad}
        onEnd={handleOnEnd}
        subtitleStyle={
          subtitleStyle
            ? subtitleStyle
            : {
                fontSize: videoState.fullscreen ? 20 : 13,
                opacity: 0.1,
                paddingBottom: videoState.fullscreen ? 25 : 10,
              }
        }
        onFullscreenPlayerWillPresent={onFullscreenPlayerWillPresent}
        onFullscreenPlayerWillDismiss={onFullscreenPlayerWillDismiss}
      />
      <VideoPlayerControls
        // videoState={videoState}
        // setVideoState={setVideoState}
        handlePlayPause={handlePlayPause}
        handleSeek={handleSeek}
        handleSliderValueChange={handleSeek}
        handleOnFullScreen={handleOnFullScreen}
        VideoTitle={videoTitle}
      />

      {isLoading && (
        <View
          style={{
            position: 'absolute',
            top: '50%',
            bottom: '50%',
            left: '50%',
            right: '50%',
          }}>
          <ActivityIndicator
            size={30}
            color={color.Red}
            style={{alignSelf: 'center'}}
          />
        </View>
      )}
      {!videoState.showControl && !videoState.fullscreen && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: width,
          }}>
          <SilderComp handleSliderValueChange={handleSliderValueChange} />
        </View>
      )}
    </View>
  );
};

export default VideoPlayyer;

const styles = StyleSheet.create({
  video: {
    height: width * (9 / 16),
    width: width,
    position: 'relative',
    backgroundColor: color.Black,
  },
  videoFullScreen: {
    height: width,
    width: height,
    position: 'relative',
    backgroundColor: color.Black,
  },
  container: {
    flex: 0,
    alignItems: 'center',
    position: 'relative',
    backgroundColor: color.Black,
  },
  containerFullscreen: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    backgroundColor: color.Black,
  },
});
