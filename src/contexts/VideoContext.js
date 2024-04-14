import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { getAsyncData, setAsyncData } from "../utils/functions";
import { qualityPrefs } from "../utils/contstant";
import { TextTrackType } from "react-native-video";

const VideoContext = createContext();
const myKey = "anime_Video";
const Autpkeyy = "autoPlay_key"
const keyy = "seekSeconds_key"

export const VideoPlayerProvider = ({ children }) => {
  const [VideoPlayer, setVideoPlayer] = useState({
    url: undefined,
    paused: true,
    end: false,
    autoPlayNext: false,
    autoPlayDelay: 5,
    muted: false,
    showControl: false,
    showSetting: false,
    showSubtitle: false,
    showResizeSetting: false,
    showQualitySetting: false,
    quality: qualityPrefs._default,
    provider: "gogo",
    showPlayBackRateSetting: false,
    playInBackground: false,
    poster: null,
    posterResizeMode: "contain",
    resizeMode: "contain",
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
    selectedTextTrack:{
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
      autoplay: VideoPlayer.autoPlayNext,
      delay: VideoPlayer.delay,
    }
    getAsyncData(Autpkeyy)
      .then((res) => {
        if (res !== undefined) {
          // console.log(res)
          const resp = JSON.parse(res)
          // console.log(JSON.parse(res))
          setVideoPlayer(prev => ({ ...prev, autoPlayNext: resp.autoplay, autoPlayDelay: resp.delay }));
        } else { setAsyncData(Autpkeyy, JSON.stringify(data)) }
      })
      .catch((err) => console.log(err))
    
    getAsyncData(keyy)
      .then((res) => {
        if (res !== undefined) {
          // console.log(res)
          const resp = JSON.parse(res)
          // console.log(JSON.parse(res))
          setVideoPlayer(prev => ({ ...prev, seekSecond: resp }));
        } else { setAsyncData(keyy, JSON.stringify(10)) }
      })
      .catch((err) => console.log(err))

  }, [])

  return (
    <VideoContext.Provider value={{ VideoPlayer, setVideoPlayer }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoPlayer = () => {
  return useContext(VideoContext);
};
