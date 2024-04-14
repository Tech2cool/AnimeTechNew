import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Video, {ResizeMode, TextTrackType} from 'react-native-video';
import Theme from '../../../utils/Theme';
import {
  fetchAnimeInfo,
  fetchEpisodeInfoKitsu,
  fetchEpisodes,
  fetchSource,
  generateDynamicLink,
  getAsyncData,
  setAsyncData,
} from '../../../utils/functions';
import {useLanguage} from '../../../contexts/LanguageContext';
import EpisodeCard from '../../../components/EpisodeCard';
import {
  IIcon,
  MCIcon,
  StreamingServers,
  qualityPrefs,
} from '../../../utils/contstant';
import {useVideoPlayer} from '../../../contexts/VideoContext';
import VideoControls from './SmallComponents/VideoControls';
import Orientation from 'react-native-orientation-locker';
import SilderComp from './SmallComponents/SilderComp';
import SkeletonSlider from '../../../components/SkeletonSlider';
import DownloadSheet from './SmallComponents/DownloadSheet';
import {useQualityPref} from '../../../contexts/QualityPrefrenceContext';
import NetInfo from '@react-native-community/netinfo';
import SelectDropdown from 'react-native-select-dropdown';
import SettingCard from './SmallComponents/SettingCard';
import QualitySetting from './SmallComponents/QualitySetting';
import PlayBackRateSetting from './SmallComponents/PlayBackRateSetting';
import BottomSheet2 from '../../../components/BottomSheet2';
import ResizeModeSetting from './SmallComponents/ResizeModeSetting';
import {useQuery} from '@tanstack/react-query';
import SubTitlteSheet from './SmallComponents/SubTitlteSheet';
import VideoPlayerComp from './SmallComponents/VideoPlayerComp';

const color = Theme.DARK;
const font = Theme.FONTS;
let aniEPId;
let ProgressCount = 1;
const streamServer2 = [
  {name: 'server 1', value: StreamingServers.GogoCDN},
  {name: 'server 2', value: StreamingServers.StreamSB},
];
const dummyTextTrack = [
  {
    index: 0,
    title: 'unknown',
    type: 'text/vtt',
    uri: 'https://bitdash-a.akamaihd.net/content/sintel/subtitles/subtitles_en.vtt',
  },
];
const disabledTrack = {type: 'disabled'};
const {width, height} = Dimensions.get('window');
const VideoScreen2 = ({route, navigation}) => {
  const {
    animeId,
    kitsuId,
    episodeId,
    episodeNum,
    aniwatchId,
    aniwatchEpisodeId,
  } = route.params;
  // const [anime, setAnime] = useState({});
  // const [source, setSource] = useState([]);
  // const [episodes, setEpisodes] = useState([]);
  const [epiosdeInfo, setEpiosdeInfo] = useState({});
  // const [loadingSource, setLoadingSource] = useState(true);
  // const [loadingInfo, setLoadingInfo] = useState(true);
  // const [loadingEpisode, setLoadingEpisode] = useState(true);
  const [tapNumber, setTapNumber] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [streamServer, setStreamServer] = useState(streamServer2[0]);
  const [showDownloadSheet, setShowDownloadSheet] = useState(false);
  // const [textTracks, setTextTracks] = useState(dummyTextTrack);
  // const [selectedTextTrack, setSelectedTextTrack] = useState({
  //   type: 'disabled',
  //   value: 1,
  // });
  const videoRef = useRef(null);
  const playNextRef = useRef(null);
  const {isConnected, isWifiEnabled} = NetInfo.useNetInfo();
  const epFlatListRef = useRef(null);
  const {currentLang} = useLanguage();
  const {VideoPlayer, setVideoPlayer} = useVideoPlayer();
  const {QualityPref, setQuality} = useQualityPref();
  const [playNextSecond, setPlayNextSecond] = useState(
    parseInt(VideoPlayer.autoPlayDelay),
  );
  const watchListKey = `WatchListKey_${animeId}`;
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
  const enableCCAniwatch = () => {
    setTextTrackByTitle("English")
    // setVideoPlayer(prev => ({
    //   ...prev,
    //   selectedTextTrack: {
    //     ...prev.selectedTextTrack,
    //     type: 'index',
    //     value: prev.value,
    //   },
    // }));
  };
  const setResizeVideo = resize => {
    setVideoPlayer({...VideoPlayer, resizeMode: resize});
  };
  const fetchAnime = async () => {
    const resp = await fetchAnimeInfo(
      animeId,
      aniwatchId ? aniwatchId : anime?.aniwatchInfo?.anime?.info?.id,
    );
    return resp ? resp : {};
  };

  const fetchAllEpisode = async () => {
    const resp = await fetchEpisodes(
      animeId,
      kitsuId ? kitsuId : anime?.AdditionalInfo?.id,
      aniwatchId ? aniwatchId : anime?.aniwatchInfo?.anime?.id,
    );
    return resp?.length > 0 ? resp : [];
  };
  const setTextTrackByTitle = async (title) => {
    const selectedTrack = VideoPlayer.textTracks?.findIndex((track) => track?.title === title);
    if (selectedTrack) {
      // const index = await videoRef?.current?.textTracks?.indexOf(selectedTrack);
      // console.log(index)
      if (selectedTrack !== -1) {
        // videoRef.current.setTextTrack(index);
        setVideoPlayer(prev => ({
          ...prev,
          selectedTextTrack: {
            ...prev.selectedTextTrack,
            type: 'index',
            value: selectedTrack,
          },
        }));
      }
    }
  };
  const fetchSources = async (
    epId,
    streamServe = undefined,
    aniwatchEpId = undefined,
  ) => {
    try {
      // setLoadingSource(true);
      const resp = await fetchSource(epId, streamServe, aniwatchEpId);
      // setSource(resp)
      const track = resp?.subtitles?.map((track, i) => {
        return {
          index: i,
          title: track?.label || 'unknown',
          type: TextTrackType.VTT,
          uri: track?.file,
        };
      });
      // console.log(JSON.stringify(track,null, 2))
      // setTextTracks(track)
      setVideoPlayer({...VideoPlayer, textTracks: track});
      const findQuality = findeQualitySrc(
        resp?.sources,
        isWifiEnabled ? QualityPref.wifi : QualityPref.mobile,
      );
      // const findDefault = resp?.sources?.find((src) => src?.quality?.toLowerCase() === "default")
      setVideoPlayer(prev => ({
        ...prev,
        url: findQuality?.url,
        quality: findQuality?.quality,
        provider: findQuality?.provider,
      }));

      oldUrl = findQuality?.url;
      setRefreshing(false)
      return resp ? resp : {sources:[]};
      // setLoadingSource(false);
    } catch (error) {
      setRefreshing(false)
      // setLoadingSource(false);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    }
  };
  const findeQualitySrc = (arr, quality) => {
    const findSelectedQaulity = arr?.find(
      src => src?.quality?.toLowerCase() === quality?.toLowerCase(),
    );
    if (findSelectedQaulity) {
      return findSelectedQaulity;
    } else {
      const findDefualtQaulity = arr?.find(
        src =>
          src?.quality?.toLowerCase() === qualityPrefs._default.toLowerCase(),
      );
      return findDefualtQaulity;
    }
  };

  const fetchEpisodeInfo = async () => {
    try {
      const resp = await fetchEpisodeInfoKitsu(
        anime?.AdditionalInfo?.id,
        episodeNum,
      );
      setEpiosdeInfo(resp);
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.SHORT);
    }
  };

  const setMyList = async (currentTime, duration) => {
    const data = {
      animeId: animeId,
      episodeId: episodeId,
      episodeNum: episodeNum,
      kitsuId: kitsuId ? kitsuId : anime?.AdditionalInfo?.id,
      anime: anime,
      currentTime: currentTime,
      duration: duration,
      aniwatchId: aniwatchId ? aniwatchId : anime?.aniwatchInfo?.anime?.id,
      aniwatchEpisodeId: aniEPId,
      wannaDelete: false,
      timestamp: new Date().getTime(),
    };
    await setAsyncData(watchListKey, JSON.stringify(data));
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
        const resp = await getAsyncData(episodeId);
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
    [episodeId],
  );

  const handleOnProgress = e => {
    if (!VideoPlayer.seeking) {
      setAsyncData(episodeId, JSON.stringify(e.currentTime));
      setVideoPlayer(prev => ({
        ...prev,
        currentTime: e.currentTime,
        playableDuration: e.playableDuration,
        seekableDuration: e.seekableDuration,
      }));
      setMyList(e.currentTime, VideoPlayer.duration);
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
  const {
    data: anime,
    isLoading: loadingInfo,
    error,
  } = useQuery({
    queryKey: [
      'anime-info',
      animeId,
      aniwatchId ? aniwatchId : anime?.aniwatchInfo?.anime?.info?.id,
    ],
    queryFn: () => fetchAnime(),
    // staleTime: 1000 * 60 * 60,
  });
  const {
    data: episodes,
    isLoading: loadingEpisode,
    error: errorEp,
  } = useQuery({
    queryKey: [
      'episodes',
      animeId,
      kitsuId,
      anime?.AdditionalInfo?.id,
      aniwatchId,
      anime?.aniwatchInfo?.anime?.info?.id,
    ],
    queryFn: () => fetchAllEpisode(),
    // staleTime: 1000 * 60 * 60,
  });

  const {
    data: source,
    isLoading: loadingSource,
    error: errorSrc,
  } = useQuery({
    queryKey: [
      'source',
      episodeId,
      aniwatchEpisodeId,
      episodes?.aniInfo?.episodeId,
      streamServer,
    ],
    queryFn: () =>
      fetchSources(
        episodeId,
        StreamingServers.VidStreaming,
        aniwatchEpisodeId ? aniwatchEpisodeId : episodes?.aniInfo?.episodeId,
        refreshing,
      ),
    // staleTime: 1000 * 60 * 60,
  });
  useEffect(() => {
    if (episodeId && episodes?.length > 0) {
      if (!aniwatchEpisodeId) {
        const findEPEpid = episodes?.find(ep => ep?.id === episodeId);
        aniEPId = findEPEpid?.aniInfo?.episodeId;
      } else {
        aniEPId = aniwatchEpisodeId;
      }
      // fetchSources(episodeId, StreamingServers.VidStreaming, aniEPId);
      fetchEpisodeInfo();
      // oldEpisodeId = episodeId
      getAsyncData(episodeId)
        .then(resp2 => {
          if (resp2) {
            handleSeekTo(JSON.parse(resp2));
          } else {
            handleSeekTo(0);
          }
        })
        .catch(err => ToastAndroid.show('error' + err, ToastAndroid.SHORT));
    }
  }, [episodeId, episodes?.length]);

  useEffect(() => {
    getAsyncData(episodeId)
      .then(resp2 => {
        if (resp2) {
          handleSeekTo(JSON.parse(resp2));
        } else {
          handleSeekTo(0);
        }
      })
      .catch(err => ToastAndroid.show('error' + err, ToastAndroid.SHORT));
  }, [VideoPlayer.url]);

  useEffect(() => {
    const findIndexCrrEP = episodes?.findIndex(ep => ep?.id === episodeId);
    if (
      findIndexCrrEP !== -1 &&
      episodes?.length > 0 &&
      !loadingEpisode &&
      epFlatListRef?.current
    ) {
      epFlatListRef?.current?.scrollToIndex({
        animated: true,
        index: findIndexCrrEP <= 2 ? findIndexCrrEP : findIndexCrrEP - 2,
      });
    }
  }, [episodeId, episodes, epFlatListRef?.current, loadingEpisode]);

  const handleBuffering = e => {
    setVideoPlayer(prev => ({...prev, buffering: e.isBuffering}));
  };

  const handlePlayPause = () => {
    setVideoPlayer(prev => ({
      ...prev,
      paused: !VideoPlayer.paused,
    }));
  };

  useEffect(() => {
    if (!VideoPlayer.end) return;
    const sid = setTimeout(() => {
      setPlayNextSecond(prev =>
        prev > 1 ? prev - 1 : parseInt(VideoPlayer.autoPlayDelay),
      );
    }, 999);
    return () => clearTimeout(sid);
  }, [playNextSecond, VideoPlayer.end]);

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

  const setSettingSheetVisible = () => {
    // setShowSettingSheet(!showSettingSheet);
    setVideoPlayer(prev => ({...prev, showSetting: !VideoPlayer.showSetting}));
  };

  const memoizedVideo = useMemo(() => {
    if (source?.sources?.length === 0 || VideoPlayer.url === undefined) {
      return (
        <>
          <View
            style={{width: width, height: 200, backgroundColor: color.Black}}>
            {loadingSource ||
              (VideoPlayer.buffering && (
                <ActivityIndicator size={30} color={color.Orange} />
              ))}
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
          source={{uri: VideoPlayer.url}}
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
            <TouchableOpacity onPress={()=>setRefreshing(true)}>
              <Text>Retry</Text>
            </TouchableOpacity>
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
  }, [
    source,
    loadingSource,
    VideoPlayer,
    playNextSecond,
  ]);

  const memoizedAnimeTitle = useMemo(() => {
    if (currentLang === 'en') {
      if (anime?.animeTitle?.english) {
        return anime?.animeTitle?.english;
      } else if (anime?.animeTitle?.english_jp) {
        return anime?.animeTitle?.english_jp;
      }
    } else {
      if (anime?.animeTitle?.english_jp) {
        return anime?.animeTitle?.english_jp;
      } else if (anime?.animeTitle?.japanese) {
        return anime?.animeTitle?.japanese;
      }
    }
  }, [anime?.animeTitle, currentLang]);

  const memoizedEpisode = useMemo(() => {
    return (
      <>
        <Text style={styles.episode}>Episode {episodeNum}</Text>
      </>
    );
  }, [episodeNum]);

  const memoziedEpisodeInfo = useMemo(() => {
    if (currentLang === 'en') {
      if (epiosdeInfo?.title?.english) {
        return (
          <>
            <Text style={styles.EpInfo}>- {epiosdeInfo?.title?.english}</Text>
          </>
        );
      } else if (epiosdeInfo?.title?.english_jp) {
        return (
          <>
            <Text style={styles.EpInfo}>
              - {epiosdeInfo?.title?.english_jp}
            </Text>
          </>
        );
      }
    } else {
      if (epiosdeInfo?.title?.english_jp) {
        return (
          <>
            <Text style={styles.EpInfo}>
              - {epiosdeInfo?.title?.english_jp}
            </Text>
          </>
        );
      } else if (epiosdeInfo?.title?.japanese) {
        return (
          <>
            <Text style={styles.EpInfo}>- {epiosdeInfo?.title?.japanese}</Text>
          </>
        );
      }
    }
  }, [epiosdeInfo, currentLang, episodeId, anime]);

  const renderitem = useCallback(
    ({item, index}) => {
      if (episodes?.length === 0 || !anime) return;
      return (
        <>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('video', {
                animeId: animeId,
                episodeId: item?.id,
                episodeNum: item?.number,
                kitsuId: kitsuId,
                aniwatchId: aniwatchId,
                aniwatchEpisodeId: item?.aniInfo?.episodeId,
              })
            }>
            <EpisodeCard episode={item} anime={anime} episodeId={episodeId} />
          </TouchableOpacity>
        </>
      );
    },
    [anime, episodeId, loadingEpisode],
  );

  const getItemLayout = useCallback(
    (data, index) => ({
      length: 140,
      offset: 140 * index,
      index,
    }),
    [],
  );

  const handleNextBtn = () => {
    const findNextEpIndex = episodes?.findIndex((ep, i) => ep.id === episodeId);
    if (findNextEpIndex != -1 && findNextEpIndex + 1 < episodes?.length) {
      const episode = episodes[findNextEpIndex + 1];
      navigation.navigate('video', {
        animeId: animeId,
        episodeId: episode?.id,
        episodeNum: episode?.number,
        aniwatchId: aniwatchId ? aniwatchId : anime?.aniwatchInfo?.anime?.id,
      });
    }
  };

  const handlePrevBtn = () => {
    console.log('called prev');
    const findNextEpIndex = episodes?.findIndex(
      (ep, i) => ep?.id === episodeId,
    );
    if (findNextEpIndex != -1 && findNextEpIndex - 1 >= 0) {
      const episode = episodes[findNextEpIndex - 1];
      navigation.navigate('video', {
        animeId: animeId,
        episodeId: episode?.id,
        episodeNum: episode?.number,
        aniwatchId: aniwatchId ? aniwatchId : anime?.aniwatchInfo?.anime?.id,
      });
    }
  };

  const handleShare = async () => {
    const link = await generateDynamicLink(
      'video',
      animeId,
      episodeId,
      episodeNum,
      anime?.animeImg,
      `Episode ${episodeNum} ${memoizedAnimeTitle}`,
      '',
      anime?.AdditionalInfo?.id,
    );

    Share.share({
      message: link,
    });
  };
  const onSelectDropDown = useCallback((selectedItem, index) => {
    // Update selected state with the new selected item
    if(selectedItem?.animeID === animeId) return
    setStreamServer(selectedItem);
    navigation.navigate('anime-info', {
      animeId: selectedItem?.animeID,
    });
  }, []);
  const buttonTextAfterSelection = useCallback(
    (selectedItem, index) =>
      selectedItem.name
        ? selectedItem.name
        : selectedItem.animeTitle.english
        ? selectedItem?.animeTitle?.english
        : selectedItem?.animeTitle?.english_jp,
    [],
  );
  const rowTextForSelection = useCallback(
    (item, index) =>
      item.name
        ? item.name
        : item.animeTitle.english
        ? item?.animeTitle?.english
        : item?.animeTitle?.english_jp,
    [],
  );
  const renderDropdownIcon = useCallback(
    () => <MCIcon name={'chevron-down'} color={color.Orange} size={25} />,
    [],
  );
  const qualitySettingOp = (ops = false) => {
    setVideoPlayer(prev => ({...prev, showQualitySetting: ops}));
  };
  const playbackRateSettingOp = (ops = false) => {
    setVideoPlayer(prev => ({...prev, showPlayBackRateSetting: ops}));
  };
  const resizeModeSettingOp = (ops = false) => {
    setVideoPlayer(prev => ({...prev, showResizeSetting: ops}));
  };
  const textTrackSettingOp = (ops = false) => {
    setVideoPlayer(prev => ({...prev, showSubtitle: ops}));
  };


  const handleDownloadSheet = () => {
    setShowDownloadSheet(!showDownloadSheet);
  };
  const settingOp = (ops = false) => {
    setVideoPlayer(prev => ({...prev, showSetting: ops}));
  };

  const memoizedEPLISt = useMemo(() => {
    return (
      <>
        <FlatList
          ref={epFlatListRef}
          data={episodes}
          keyExtractor={(item, index) =>
            `${item?.id}-${index}-flatListAllEpisodes`
          }
          renderItem={renderitem}
          getItemLayout={getItemLayout}
          nestedScrollEnabled={true}
          // removeClippedSubviews={true}
          // windowSize={11}
          ListFooterComponent={() => (
            <>
              <View style={{marginVertical: 200}}></View>
            </>
          )}
        />
      </>
    );
  }, [episodes, loadingEpisode, anime, episodeId]);

  return (
    <View style={styles.container}>
      {memoizedVideo}
      {/* <VideoPlayerComp source={source} id={episodeId} url={VideoPlayer.url} episodeNum={episodeNum}/> */}
      <View style={styles.InfoContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('anime-info', {animeId: animeId})}>
          {loadingInfo ? (
            <SkeletonSlider width={'90%'} height={15} opacity={1} />
          ) : (
            <Text numberOfLines={2} style={styles.AnimeTitle}>
              {memoizedAnimeTitle}
            </Text>
          )}
        </TouchableOpacity>
        <View style={styles.EpInfoContainer}>
          {loadingInfo ? (
            <SkeletonSlider width={'90%'} height={15} opacity={1} />
          ) : (
            <>
              {memoizedEpisode}
              {memoziedEpisodeInfo}
            </>
          )}
        </View>

        <View style={styles.btnsContainer}>
          <TouchableOpacity
            disabled={episodeNum === 1}
            style={[styles.NextPrevBtn, {opacity: episodeNum === 1 ? 0 : 1}]}
            onPress={handlePrevBtn}>
            <Text style={styles.NextPrevBtnText}>Prev</Text>
          </TouchableOpacity>
          <View style={styles.ExtraBtnContainer}>
            <TouchableOpacity
              style={styles.ExtraBtn}
              onPress={handleDownloadSheet}>
              <MCIcon name="cloud-download" size={30} color={color.Orange} />
              <Text style={styles.ExtraBtnText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare}>
              <MCIcon name="share" size={30} color={color.Orange} />
              <Text style={styles.ExtraBtnText}>Share</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            disabled={episodeNum >= episodes?.length}
            style={[
              styles.NextPrevBtn,
              {opacity: episodeNum >= episodes?.length ? 0 : 1},
            ]}
            onPress={handleNextBtn}>
            <Text style={styles.NextPrevBtnText}>Next</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.toEpANDSeasonContainer}>
          <Text style={styles.totalEP}>
            Total Episodes: {anime?.totalEpisodes}
          </Text>
          <SelectDropdown
            data={
              anime?.aniwatchInfo?.seasons?.length > 0
              ? anime?.aniwatchInfo?.seasons
              : anime?.relatedAddtional?.sequalOrPrequal
            }
            renderDropdownIcon={renderDropdownIcon}
            buttonStyle={styles.buttonStyle}
            buttonTextStyle={styles.buttonTextStyle}
            dropdownStyle={styles.dropdownStyle}
            rowTextStyle={styles.rowTextStyle}
            rowStyle={styles.rowStyle}
            selectedRowTextStyle={styles.selectedRowTextStyle}
            selectedRowStyle={styles.selectedRowStyle}
            defaultValue={
              anime?.aniwatchInfo?.seasons?.length > 0
                ? anime?.aniwatchInfo?.seasons?.find(
                  anim => anim?.animeID === anime?.animeID)
                : anime?.relatedAddtional?.sequalOrPrequal.find((anim)=>anim?.animeID === anime?.animeID)
            }
            // defaultValueByIndex={0}
            // defaultValue={StreamServer}
            onSelect={onSelectDropDown}
            
            buttonTextAfterSelection={buttonTextAfterSelection}
            rowTextForSelection={rowTextForSelection}
          />
        </View>
      </View>
      <View style={styles.AllEpisodeContainer}>
        {loadingEpisode ? (
          <FlatList
            data={[1, 2, 3, 4, 5, 6, 7]}
            keyExtractor={(item, index) => `${item}-VideoEpisodesSkeleton`}
            renderItem={({item}) => {
              return (
                <View style={{marginVertical: 5}}>
                  <SkeletonSlider
                    width={width * 0.95}
                    height={120}
                    opacity={1}
                    borderRadius={10}
                  />
                </View>
              );
            }}
          />
        ) : (
          memoizedEPLISt
        )}
      </View>
      <>
        {/* DownloadSheet */}
        <BottomSheet2
          enabled={showDownloadSheet}
          setEnabled={setShowDownloadSheet}
          max_Trans_Y={0.3} //-height * 1.5
          borderRadius={20}
          endPoint={0.92}
          snapPoint={0.6}
          onEnd={() => setShowDownloadSheet(false)}
          children={
            <DownloadSheet
              episodeId={episodeId}
              setShowDownloadSheet={setShowDownloadSheet}
              showDownloadSheet={showDownloadSheet}
              source={source}
            />
          }
        />
        {/* SettingSheet */}
        <BottomSheet2
          enabled={VideoPlayer.showSetting}
          setEnabled={settingOp}
          max_Trans_Y={0.3} //-height * 1.5
          borderRadius={20}
          endPoint={0.92}
          snapPoint={0.6}
          onEnd={() => setVideoPlayer(prev => ({...prev, showSetting: false}))}
          children={<SettingCard setShowSettingSheet={settingOp} />}
        />

        {/* Quality Setting Sheet */}
        <BottomSheet2
          enabled={VideoPlayer.showQualitySetting}
          setEnabled={qualitySettingOp}
          max_Trans_Y={0.3} //-height * 1.5
          borderRadius={20}
          endPoint={0.92}
          snapPoint={0.6}
          onEnd={() =>
            setVideoPlayer(prev => ({...prev, showQualitySetting: false}))
          }
          children={
            <QualitySetting
              qualities={source?.sources}
              enableCCAniwatch={enableCCAniwatch}
            />
          }
        />
        {/* Playback Rate setting Sheet */}
        <BottomSheet2
          enabled={VideoPlayer.showPlayBackRateSetting}
          setEnabled={playbackRateSettingOp}
          max_Trans_Y={0.3} //-height * 1.5
          borderRadius={20}
          endPoint={0.92}
          snapPoint={0.6}
          onEnd={() =>
            setVideoPlayer(prev => ({...prev, showPlayBackRateSetting: false}))
          }
          children={<PlayBackRateSetting />}
        />
        <BottomSheet2
          enabled={VideoPlayer.showResizeSetting}
          setEnabled={resizeModeSettingOp}
          max_Trans_Y={0.3} //-height * 1.5
          borderRadius={20}
          endPoint={0.92}
          snapPoint={0.6}
          onEnd={() =>
            setVideoPlayer(prev => ({...prev, showResizeSetting: false}))
          }
          children={<ResizeModeSetting setResizeVideo={setResizeVideo} />}
        />

        <BottomSheet2
          enabled={VideoPlayer.showSubtitle}
          setEnabled={textTrackSettingOp}
          max_Trans_Y={0.3} //-height * 1.5
          borderRadius={20}
          endPoint={0.92}
          snapPoint={0.6}
          onEnd={() =>
            setVideoPlayer(prev => ({...prev, showSubtitle: false}))
          }
          children={<SubTitlteSheet setTextTrackByTitle={setTextTrackByTitle} />}
        />
      </>
    </View>
  );
};

export default VideoScreen2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.DarkBackGround,
    flexDirection: 'column',
    // justifyContent:"center",
    // alignItems:"center",
  },
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

  InfoContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 5,
    flexDirection: 'column',
  },
  AnimeTitle: {
    color: color.Orange,
    fontFamily: font.OpenSansBold,
    fontSize: 12,
  },
  EpInfoContainer: {
    // flex:1,
    flexDirection: 'row',
    gap: 5,
    // overflow:"hidden",
  },
  episode: {
    color: color.White,
    fontFamily: font.OpenSansBold,
    fontSize: 13,
  },
  EpInfo: {
    color: color.White,
    fontFamily: font.OpenSansMedium,
    fontSize: 12,
  },
  btnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomColor: color.LighterGray,
    borderBottomWidth: 0.5,
  },
  NextPrevBtn: {
    padding: 10,
    minWidth: 70,
    borderColor: color.Orange,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0,
    alignSelf: 'flex-start',
  },
  NextPrevBtnText: {
    color: color.Orange,
    fontFamily: font.OpenSansMedium,
    fontSize: 13,
  },
  ExtraBtnContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  ExtraBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ExtraBtnText: {
    fontFamily: font.OpenSansRegular,
    fontSize: 12,
    color: color.Orange,
  },
  toEpANDSeasonContainer: {
    // flex:1,
    borderBottomColor: color.LighterGray,
    borderBottomWidth: 0.5,
    paddingBottom: 5,
    margin: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalEP: {
    color: color.White,
  },
  AllEpisodeContainer: {
    marginVertical: 5,
  },
  rowTextStyle: {
    fontSize: 14,
    color: color.White,
    textTransform: 'uppercase',
  },
  selectedRowTextStyle: {
    fontSize: 16,
    color: color.White,
    textTransform: 'uppercase',
  },
  dropdownStyle: {
    borderRadius: 5,
    backgroundColor: color.DarkBackGround,
    elevation: 10,
    borderColor: color.LighterGray2,
    borderWidth: 0.2,
  },
  buttonTextStyle: {
    color: color.Orange,
    textTransform: 'uppercase',
    fontSize: 14,
    fontFamily: font.NunitoBlack,
  },
  buttonStyle: {
    // width: 150,
    flex:1,
    height: 20,
    backgroundColor: color.DarkBackGround,
  },
  rowStyle: {
    borderColor: 'transparent',
  },
  selectedRowStyle: {
    backgroundColor: color.Orange,
  },
});
