import {createContext, useContext, useEffect, useState} from 'react';
import {qualityPrefs} from '../utils/contstant';
import {getAsyncData, setAsyncData} from '../utils/HelperFunctions';

const VideoStateContext = createContext();
const myKey = 'anime_Video';
const Autpkeyy = 'autoPlay_key';
const keyy = 'seekSeconds_key';

export const VideoStateProvider = ({children}) => {
  const [videoState, setVideoState] = useState({
    url: undefined,
    paused: false,
    end: false,
    autoPlayNext: false,
    autoPlayDelay: 5,
    muted: false,
    showControl: false,
    showSetting: false,
    showSubtitle: false,
    showSubtitleSetting: false,
    selectedSubtitle: {
      file:null,
      caption:null,
      label:null,
    },
    showResizeSetting: false,
    showQualitySetting: false,
    quality: qualityPrefs._default,
    provider: 'gogo',
    showPlayBackRateSetting: false,
    playInBackground: false,
    poster: null,
    posterResizeMode: 'contain',
    resizeMode: 'contain',
    preventsDisplaySleepDuringVideoPlayback: true,
    progressUpdateInterval: 250.0, //milsecond
    currentTime: 0,
    duration: 0,
    canPlaySlowForward: true,
    canPlayReverse: false,
    canPlaySlowReverse: false,
    canPlayFastForward: false,
    canStepForward: false,
    canStepBackward: false,
    naturalSize: {
      height: null,
      orientation: null,
      width: null,
    },
    audioTracks: [],
    selectedVideoTrack:{
      type: 'index',
      value: 0,
    },
    selectedTextTrack: {
      type: 'disabled',
      value: 1,
    },
    textTracks: [],
    showCC: false,
    videoTracks: [],
    trackId: 0,
    buffering: true,
    playbackRate: 1,
    playableDuration: 0,
    seekableDuration: 0,
    seekTime: 0,
    seekSecond: 10,
    seekBackward: false,
    seeking: false,
    seekForward: false,
    metadata: [],
    volume: 1,
    fullscreen: false,
    maxBitRate: 2000000, // 2 megabits
    minLoadRetryCount: 5, // retry 5 times
    //  rate:1,
    repeat: false,
    reportBandwidth: false,
  });
  useEffect(() => {
    const data = {
      autoplay: videoState.autoPlayNext,
      delay: videoState.delay,
    };
    getAsyncData(Autpkeyy)
      .then(res => {
        if (res) {
          const resp = JSON.parse(res);
          // console.log(resp)
          setVideoState(prev => ({
            ...prev,
            autoPlayNext: resp.autoplay,
            autoPlayDelay: resp.delay,
          }));
        } else {
          setAsyncData(Autpkeyy, JSON.stringify(data));
        }
      })
      .catch(err => console.log(err));

    getAsyncData(keyy)
      .then(res => {
        if (res !== undefined) {
          const resp = JSON.parse(res);
          setVideoState(prev => ({...prev, seekSecond: resp}));
        } else {
          setAsyncData(keyy, JSON.stringify(10));
        }
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <VideoStateContext.Provider value={{videoState, setVideoState}}>
      {children}
    </VideoStateContext.Provider>
  );
};

export const useVideoState = () => {
  return useContext(VideoStateContext);
};
