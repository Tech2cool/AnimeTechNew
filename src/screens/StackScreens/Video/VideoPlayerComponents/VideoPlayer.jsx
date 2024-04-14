import {Alert, Dimensions, StyleSheet, Text, ToastAndroid, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useVideoPlayer} from '../../../../contexts/VideoContext';
import Theme from '../../../../utils/Theme';
import Video from 'react-native-video';
import VideoPlayerControls from './VideoPlayerControls';
import Orientation from 'react-native-orientation-locker';
import SilderComp from '../SmallComponents/SilderComp';
import { getAsyncData, setAsyncData } from '../../../../utils/functions';

const color = Theme.DARK;
const font = Theme.FONTS;
let ProgressCount = 1;
const {width, height} = Dimensions.get('window');
const VideoPlayyer = ({id, url,subtitleStyle,videoTitle,headers, isLoading=false}) => {
  const [tapNumber, setTapNumber] = useState(0);

  const videoRef = useRef(null);
  const {VideoPlayer, setVideoPlayer} = useVideoPlayer();
  //   console.log("render VideoPlayer")
  const handlePlayPause = () => {
    if (VideoPlayer.paused) {
        videoRef.current.resume();
      setVideoPlayer({...VideoPlayer, paused: false});
    } else {
        videoRef.current.pause();
      setVideoPlayer({...VideoPlayer, paused: true});
    }
  };
  const handleOnLoad = async e => {
    setVideoPlayer({
      ...VideoPlayer,
      duration: e.duration,
      currentTime: e.currentTime,
      audioTracks: e.audioTracks,
      canPlayReverse: e.canPlayReverse,
      canPlaySlowForward: e.canPlaySlowForward,
      canPlaySlowReverse: e.canPlaySlowReverse,
      canStepBackward: e.canStepBackward,
      canStepForward: e.canStepForward,
      naturalSize: e.naturalSize,
      // textTracks: e.textTracks,
      trackId: e.trackId,
      videoTracks: e.videoTracks,
      end: false,
    });
    await checkVideoCache()
  };
  const handleOnEnd = ()=>{
    videoRef.current.pause();
    setVideoPlayer({...VideoPlayer, paused: true});

  }
  const handleSeek = (value)=>{
    videoRef.current.seek(value);
    setVideoPlayer({...VideoPlayer, currentTime: value});
    // setVideoPlayer(prev => ({...prev, currentTime: value}));

  }
  const handleSliderValueChange = value => {
    // setVideoPlayer(prev=>({ ...prev, currentTime: value }))
    handleSeek(value);
  };

  const handleProgress = e => {
    // setVideoPlayer({
    //   ...VideoPlayer,
    //   currentTime: e.currentTime,
    //   playableDuration: e.playableDuration,
    //   seekableDuration: e.seekableDuration,
    // });

    if (!VideoPlayer.seeking) {
      setAsyncData(id, JSON.stringify(e.currentTime));
      setVideoPlayer(prev => ({
        ...prev,
        currentTime: e.currentTime,
        playableDuration: e.playableDuration,
        seekableDuration: e.seekableDuration,
      }));
      // setMyList(e.currentTime, VideoPlayer.duration);
      if (!VideoPlayer.paused && VideoPlayer.showControl) {
        if (ProgressCount < 10) {
          ProgressCount++;
        } else if (ProgressCount >= 10) {
          ProgressCount = 1;
          setVideoPlayer(prev => ({...prev, showControl: false}));
        }
      } else {
        ProgressCount = 1;
      }
    }

  };
  const handleOnFullScreen = () => {
    if (VideoPlayer.fullscreen) {
      setVideoPlayer(prev => ({...prev, fullscreen: false}));
      Orientation.lockToPortrait();
      // SystemNavigationBar.stickyImmersive(false);
      videoRef.current.dismissFullscreenPlayer();
    } else {
      setVideoPlayer(prev => ({...prev, fullscreen: true}));
      Orientation.lockToLandscape();
      // SystemNavigationBar.stickyImmersive();
      videoRef.current.presentFullscreenPlayer();
    }
  };

  const handleBuffering = e => {
    setVideoPlayer(prev => ({...prev, buffering: e.isBuffering}));
  };
  const onFullscreenPlayerWillDismiss = () => {
    // Orientation.lockToPortrait();
    console.log('exist fullscreen');
  };

  const onFullscreenPlayerWillPresent = () => {
    // Orientation.lockToLandscape()
    console.log('enter fullscreen');
  };
  const checkVideoCache =async()=>{
    try {
      const resp = await getAsyncData(id)
      if(resp){
        handleSeek(JSON.parse(resp));
      }else{
        handleSeek(0);
      }
    } catch (error) {
      ToastAndroid.show("err", error)
    }
  }
  useEffect(()=>{
    checkVideoCache()
  },[id])

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{
          uri: url,
          headers:headers
        }}
        style={VideoPlayer.fullscreen?styles.videoFullScreen:styles.video}
        controls={false}
        fullscreen={VideoPlayer.fullscreen}
        paused={VideoPlayer.paused}
        rate={VideoPlayer.playbackRate}
        selectedTextTrack={VideoPlayer.selectedTextTrack}
        textTracks={VideoPlayer.textTracks}
        resizeMode={VideoPlayer.resizeMode}
        onError={e => Alert.alert('error', e.error.errorString)}

        onProgress={handleProgress}
        onBuffer={handleBuffering}
        onLoad={handleOnLoad}
        onEnd={handleOnEnd}
        subtitleStyle={subtitleStyle?subtitleStyle:{
          fontSize: VideoPlayer.fullscreen ? 20 : 13,
          opacity: 0.1,
          paddingBottom: VideoPlayer.fullscreen ? 25 : 10,
        }}

        onFullscreenPlayerWillPresent={onFullscreenPlayerWillPresent}
        onFullscreenPlayerWillDismiss={onFullscreenPlayerWillDismiss}
      />
      
      <VideoPlayerControls
        VideoPlayer={VideoPlayer}
        setVideoPlayer={setVideoPlayer}
        handlePlayPause={handlePlayPause}
        handleSeek={handleSeek}
        handleSliderValueChange={handleSliderValueChange}
        handleOnFullScreen={handleOnFullScreen}
        setTapNumber={setTapNumber}
        tapNumber={tapNumber}
        VideoTitle={videoTitle}
      />
      {!VideoPlayer.showControl && !VideoPlayer.fullscreen && (
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
    backgroundColor: color.DarkBackGround,
    
  },
  videoFullScreen: {
    height: width,
    width: height,
    position: 'relative',
    backgroundColor: color.Black,
  },
  container: {
    flex: 0,
    alignItems:"center", 
    position: 'relative', 
  },

});
