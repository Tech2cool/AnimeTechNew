import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {useVideoPlayer} from '../../../../contexts/VideoContext';
import Theme from '../../../../utils/Theme';
import {useNetInfo} from '@react-native-community/netinfo';
const color = Theme.DARK;
const font = Theme.FONTS;
let aniEPId;
let ProgressCount = 1;
const {width, height} = Dimensions.get('window');

const VideoPlayerComp = ({id, url, source, episodeNum}) => {
  const videoRef = useRef(null);
  const {VideoPlayer, setVideoPlayer} = useVideoPlayer();
  const [tapNumber, setTapNumber] = useState(0);
  const playNextRef = useRef(null);
  const {isConnected, isWifiEnabled} = useNetInfo();

  const setCCVisibiltiy = () => {
    // const findqualityProvider = source?.sources?.find(
    //   (ql, i) => ql?.url === VideoPlayer?.url,
    // );
    setVideoPlayer(prev => ({
      ...prev,
      selectedTextTrack: {
        ...prev.selectedTextTrack,
        type: prev.selectedTextTrack.type === 'disabled' ? 'index' : 'disabled',
        // value: VideoPlayer?.provider === 'gogo' ? 1 : 0,
      },
    }));
    // setSelectedTextTrack(prev => ({
    //   ...prev,
    //   type: prev.type === 'disabled' ? 'index' : 'disabled',
    //   value: findqualityProvider?.provider === 'gogo' ? 1 : 0,
    // }));
  };
  // const setMyList = async (currentTime, duration) => {
  //   const data = {
  //     animeId: animeId,
  //     episodeId: episodeId,
  //     episodeNum: episodeNum,
  //     kitsuId: kitsuId ? kitsuId : anime?.AdditionalInfo?.id,
  //     anime: anime,
  //     currentTime: currentTime,
  //     duration: duration,
  //     aniwatchId: aniwatchId ? aniwatchId : anime?.aniwatchInfo?.anime?.id,
  //     aniwatchEpisodeId: aniEPId,
  //     wannaDelete: false,
  //     timestamp: new Date().getTime(),
  //   };
  //   await setAsyncData(watchListKey, JSON.stringify(data));
  // };
  const handleOnEnd = () => {
    if (VideoPlayer.autoPlayNext) {
      if (episodeNum === episodes?.length) {
        handlePlayPause();
      } else {
        setVideoPlayer(prev => ({...prev, end: true}));
        handlePlayPause();
        playNextRef.current = setTimeout(() => {
          handleNextBtn();
          setVideoPlayer(prev => ({...prev, end: false}));
        }, parseInt(VideoPlayer.autoPlayDelay) * 1000);
      }
    } else {
      handlePlayPause();
    }
  };
  const handleOnLoadStart = e => {};
  const handleOnLoad = useCallback(
    async e => {
      try {
        if (VideoPlayer.autoPlayNext) {
          setVideoPlayer(prev => ({
            ...prev,
            paused: false,
          }));
        }
        const resp = await getAsyncData(id);
        if (resp) {
          handleSeekTo(JSON.parse(resp));
          setVideoPlayer(prev => ({
            ...prev,
            duration: e.duration,
            currentTime: JSON.parse(resp),
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
          }));
        } else {
          setVideoPlayer(prev => ({
            ...prev,
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
          }));
        }
        // setMyList(e.currentTime, e.duration)
      } catch (error) {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      }
    },
    [id],
  );

  const handleOnProgress = e => {
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

  const handleSeekTo = value => {
    videoRef?.current?.seek(value);
    setVideoPlayer(prev => ({...prev, currentTime: value}));
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

  const onFullscreenPlayerWillDismiss = () => {
    // Orientation.lockToPortrait();
    console.log('exist fullscreen');
  };

  const onFullscreenPlayerWillPresent = () => {
    // Orientation.lockToLandscape()
    console.log('enter fullscreen');
  };

  const handleSliderValueChange = value => {
    // setVideoPlayer(prev=>({ ...prev, currentTime: value }))
    handleSeekTo(value);
  };
  const handleBuffering = e => {
    setVideoPlayer(prev => ({...prev, buffering: e.isBuffering}));
  };

  const handlePlayPause = () => {
    setVideoPlayer(prev => ({
      ...prev,
      paused: !VideoPlayer.paused,
    }));
  };
  const setSettingSheetVisible = () => {
    // setShowSettingSheet(!showSettingSheet);
    setVideoPlayer(prev => ({...prev, showSetting: !VideoPlayer.showSetting}));
  };

  if (source?.sources?.length === 0 || VideoPlayer.url === undefined) {
    return (
      <>
        <View style={{width: width, height: 200, backgroundColor: color.Black}}>
          {VideoPlayer.buffering && (
            <ActivityIndicator size={30} color={color.Orange} />
          )}
        </View>
      </>
    );
  }
  return (
    <View
      style={[
        VideoPlayer.fullscreen
          ? styles.videoContainerFullscreen
          : styles.videoContainer,
      ]}>
      <Video
        source={{uri: url}}
        ref={videoRef}
        controls={false}
        paused={VideoPlayer.paused}
        style={
          VideoPlayer.fullscreen
            ? styles.videoPlayerFullscreen
            : styles.videoPlayer
        }
        selectedTextTrack={VideoPlayer.selectedTextTrack}
        textTracks={VideoPlayer.textTracks}
        resizeMode={VideoPlayer.resizeMode}
        subtitleStyle={{
          fontSize: VideoPlayer.fullscreen ? 20 : 13,
          opacity: 0.1,
          paddingBottom: VideoPlayer.fullscreen ? 25 : 10,
          // backgroundColor:"rgba(0,0,0,0.3)",
        }}
        onProgress={handleOnProgress}
        onLoad={handleOnLoad}
        onLoadStart={handleOnLoadStart}
        onEnd={handleOnEnd}
        rate={VideoPlayer.playbackRate}
        fullscreen={VideoPlayer.fullscreen}
        onBuffer={handleBuffering}
        onError={e => Alert.alert('error', e.error.errorString)}
        onFullscreenPlayerWillPresent={onFullscreenPlayerWillPresent}
        onFullscreenPlayerWillDismiss={onFullscreenPlayerWillDismiss}
      />
      {loadingSource && (
        <View style={{position: 'absolute', left: '45%', top: '20%'}}>
          <ActivityIndicator size={30} color={color.Orange} />
        </View>
      )}
      {source?.sources?.length === 0 && !loadingSource && (
        <View style={{position: 'absolute', left: '45%', top: '20%'}}>
          <ActivityIndicator size={30} color={color.Orange} />
          {/* <TouchableOpacity onPress={()=>setRefreshing(true)}>
          <Text>Retry</Text>
        </TouchableOpacity> */}
        </View>
      )}

      <VideoControls
        setVideoPlayer={setVideoPlayer}
        VideoPlayer={VideoPlayer}
        handlePlayPause={handlePlayPause}
        handleSeekTo={handleSeekTo}
        handleOnFullScreen={handleOnFullScreen}
        setTapNumber={setTapNumber}
        tapNumber={tapNumber}
        handleSliderValueChange={handleSliderValueChange}
        source={source?.sources}
        setSettingSheetVisible={setSettingSheetVisible}
        episodeNum={episodeNum}
        setCCVisibiltiy={setCCVisibiltiy}
        handlePrevEpBtn={() => handlePrevBtn()}
        handleNextEPBtn={() => handleNextBtn()}
        episodeLen={episodes?.length}
        memoizedAnimeTitle={
          anime?.animeTitle?.english
            ? anime?.animeTitle?.english
            : anime?.animeTitle?.english_jp
        }
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
      {
        <>
          {VideoPlayer.end && (
            <View
              style={{
                position: 'absolute',
                top: 35,
                right: 5,
                gap: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{fontFamily: font.OpenSansMedium, color: color.White}}>
                Next Episode in
              </Text>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 999,
                  borderColor: color.White,
                  borderWidth: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: font.OpenSansBold,
                    fontSize: 20,
                    color: color.White,
                  }}>
                  {playNextSecond}
                </Text>
              </View>
              <Text
                style={{fontFamily: font.OpenSansMedium, color: color.White}}
                onPress={() => {
                  clearTimeout(playNextRef.current);
                  setVideoPlayer(prev => ({...prev, end: false}));
                }}>
                Cancel
              </Text>
            </View>
          )}
        </>
      }
    </View>
  );
};

export default VideoPlayerComp;

const styles = StyleSheet.create({
  videoContainerFullscreen: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.Black,
    position: 'relative',
  },
  videoContainer: {
    backgroundColor: color.Black,
    flex: 0,
    position: 'relative',
  },
  videoPlayerFullscreen: {
    height: width,
    width: height,
    position: 'relative',
    backgroundColor: color.Black,
  },
  videoPlayer: {
    height: width * (9 / 16),
    width: width,
    position: 'relative',
    backgroundColor: color.Black,
  },
});
