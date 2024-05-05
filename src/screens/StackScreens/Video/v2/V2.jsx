import {Alert, ScrollView, Share, StyleSheet, View, Text} from 'react-native';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import Theme from '../../../../utils/Theme';
import VideoPlayyer from '../VideoPlayerComponents/VideoPlayer';
import {useQuery} from '@tanstack/react-query';
import {useVideoState} from '../../../../context/VideoStateContext';
import {SERVER_BASE_URL, qualityPrefs} from '../../../../utils/contstant';
import VideoDescComponent from '../VideoInfoComponents/VideoDescComponent';
import VideoInfoBtnsComponent from '../VideoInfoComponents/VideoInfoBtnsComponent';
import BottomSheet from '../../../../components/BottomSheet';
import SettingCard from '../SmallComponents/SettingCard';
import QualitySetting from '../SmallComponents/QualitySetting';
import PlayBackRateSetting from '../SmallComponents/PlayBackRateSetting';
import ResizeModeSetting from '../SmallComponents/ResizeModeSetting';
import DownloadSheet from '../SmallComponents/DownloadSheet';
import VideoSourcesServerComponent from './components/VideoSourcesServerComponent';
import {scrapeStreamSB} from '../../../../Query/Extractor';
import EpisodesSheet from './components/EpisodesSheet';
import {useNavigation} from '@react-navigation/native';
import {
  createTable,
  getDBConnection,
  saveVideoRecord,
} from '../../../../config/db';
import {useSettingControl} from '../../../../context/SettingsControlContext';
import NetInfo from '@react-native-community/netinfo';
import { fetchEpisodeServersAniwatch, fetchEpisodesAniwatch, fetchInfoAniwatch, fetchSourcesAniwatch } from '../../../../Query/v2';
import SubtilteSetting from '../SmallComponents/SubtilteSetting';

const color = Theme.DARK;
const font = Theme.FONTS;

const V2 = ({id, episodeId, episodeNum, provider}) => {
  const {videoState, setVideoState} = useVideoState();
  const navigation = useNavigation();
  const {isConnected, isWifiEnabled} = NetInfo.useNetInfo();

  // const [episode, setEpisode] = useState({});
  const [showDownloadSheet, setShowDownloadSheet] = useState(false);
  const [streamServer, setStreamServer] = useState('vidstreaming');
  const [refreshing, setRefreshing] = useState(false);
  const {setting} = useSettingControl();

  const {
    data: animeInfo,
    isLoading: isLoadingAnime,
    error: errorAnime,
  } = useQuery({
    queryKey: ['info_aniwatch', id],
    queryFn: () => fetchInfoAniwatch({id: id}),
  });
  const {
    data: sourceInfo,
    isLoading: isLoadingSource,
    error: errorSource,
  } = useQuery({
    queryKey: ['source_aniwatch', episodeId, streamServer],
    queryFn: () => fetchSourcesDefault(),
  });

  const {
    data: episodesInfo,
    isLoading: isLoadingEpisodes,
    error: errorEpisodes,
  } = useQuery({
    queryKey: ['Episodes_aniwatch', id, refreshing],
    queryFn: () => fetchEpisodeDefault(),
  });

  const {
    data: episodeServerInfo,
    isLoading: isLoadingEpisodeServer,
    error: errorEpisodeServer,
  } = useQuery({
    queryKey: ['ep_server_aniwatch', episodeId],
    queryFn: () => fetchEpisodeServersAniwatch({id:episodeId}),
  });
  const fetchEpisodeDefault = async () => {
    try {
      const response = await fetchEpisodesAniwatch({id: id});
      return response;
    } catch (error) {
      // console.log(error);
      Alert.alert('error', error);
      return null;
    }
  };
  const fetchSourcesDefault = async () => {
    try {
      
      const response = await fetchSourcesAniwatch({id: episodeId});

      if (response?.sources.length >0) {
        const findDefault = response.sources.find(
          src => src.quality === isWifiEnabled? setting.qualityPrefrence.wifi:setting.qualityPrefrence.mobile,
        );

        setVideoState(prev => ({
          ...prev,
          url: findDefault?.url,
          quality: findDefault?.quality,
          provider: findDefault?.provider,
        }));
      }
      if (response?.tracks.length >0) {
        const findDefaultTrack = response?.tracks.find((track)=> track?.default === true || track?.label === "English")
        console.log(findDefaultTrack)
        setVideoState(prev=>({
          ...prev,
          textTracks:response?.tracks,
          selectedSubtitle:{
            ...prev.selectedSubtitle,
            file:findDefaultTrack.file,
            kind:findDefaultTrack.kind,
            label:findDefaultTrack.label,
          }
        }))
      }

      return response;
    } catch (error) {
      return {};
    }
  };

  const memoizedAnimeTitle = useMemo(() => {
    if (setting.language === 'en') {
      if (animeInfo?.anime?.info?.name) {
        return animeInfo?.anime?.info?.name;
      } else if (animeInfo?.anime?.info?.jname) {
        return animeInfo?.anime?.info?.jname;
      }
    } else {
      if (animeInfo?.anime?.info?.jname) {
        return animeInfo?.anime?.info?.jname;
      } else if (animeInfo?.anime?.info?.name) {
        return animeInfo?.anime?.info?.name;
      }
    }
  }, [animeInfo?.anime?.info?.name,animeInfo?.anime?.info?.jname, setting.language]);

  const onPressTitle = () => {
    navigation.navigate('anime-info', {id: id});
  };
  const handleNextBtn = () => {
    const findNextEpIndex = episodesInfo?.episodes?.findIndex(
      (ep, i) => ep.id === episodeId,
    );
    if (
      findNextEpIndex != -1 &&
      findNextEpIndex + 1 < episodesInfo?.episodes?.length
    ) {
      setVideoState({...videoState, url: undefined});
      const episode = episodesInfo?.episodes[findNextEpIndex + 1];
      navigation.navigate('watch', {
        id: id,
        episodeId: episode?.id,
        episodeNum: episode?.episodeNum || episode?.number,
        provider: 'aniwatch',
      });
    }
  };

  const handlePrevBtn = () => {
    // console.log('called prev');
    const findNextEpIndex = episodesInfo?.episodes?.findIndex(
      (ep, i) => ep?.id === episodeId,
    );
    if (findNextEpIndex != -1 && findNextEpIndex - 1 >= 0) {
      setVideoState({...videoState, url: undefined});

      const episode = episodesInfo?.episodes[findNextEpIndex - 1];

      navigation.navigate('watch', {
        id: id,
        episodeId: episode?.id,
        episodeNum: episode?.episodeNum || episode?.number,
        provider: 'aniwatch',
      });
    }
  };

  const handleShare = async () => {
    try {
      const url = SERVER_BASE_URL + "/share" +`?type=episode&id=${id}&episodeId=${episodeId}&episodeNum=${episodeNum}&provider=${setting.provider}`;
      const imageUrl = animeInfo.animeImg;
      const title= memoizedAnimeTitle
      const message= memoizedAnimeTitle + "\n" + "Episode "+ episodeNum +  '\n' + url 

      await Share.share({
        title: title,
        url: url,
        message: message,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const qualitySettingOp = (ops = false) => {
    setVideoState(prev => ({...prev, showQualitySetting: ops}));
  };
  const playbackRateSettingOp = (ops = false) => {
    setVideoState(prev => ({...prev, showPlayBackRateSetting: ops}));
  };
  const resizeModeSettingOp = (ops = false) => {
    setVideoState(prev => ({...prev, showResizeSetting: ops}));
  };
  const handleDownloadSheet = () => {
    setShowDownloadSheet(!showDownloadSheet);
  };
  const settingOp = (ops = false) => {
    setVideoState(prev => ({...prev, showSetting: ops}));
  };
  const setResizeVideo = resize => {
    setVideoState({...videoState, resizeMode: resize});
  };
  const setSubtilteOption = opt => {
    setVideoState({...videoState, showSubtitleSetting: opt});
  };
  const setStreamSV = sv => {
    setStreamServer(sv);
  };
  
  useEffect(() => {
    const backHandler = navigation.addListener('beforeRemove', e => {
      setVideoState({...videoState, url: undefined});
    });

    return () => navigation.removeListener(backHandler);
  }, [navigation]);

  const progressTrackFunc = async () => {
    // try {
    //   const db = await getDBConnection();
    //   // const newTable = await createTable(db)
    //   const record = {
    //     id: id,
    //     episodeIdGogo: episodeId,
    //     animeImg: animeInfo?.animeImg,
    //     episodeNum: episodeNum,
    //     english: animeInfo?.animeTitle?.english,
    //     english_jp: animeInfo?.animeTitle?.english_jp,
    //     japanese: animeInfo?.animeTitle?.japanese,
    //     currentTime: videoState.currentTime,
    //     duration: videoState.duration,
    //     gogoId: id,
    //     timestamp: new Date().getTime(),
    //     wannaDelete: false,
    //     provider: provider,
    //   };
    //   const updateRecord = await saveVideoRecord(db, record);
    //   // console.log("update")
    // } catch (error) {
    //   console.log(error);
    // }
  };
  const memoizedTitle = useMemo(
    () => `Episode ${episodeNum} - ${memoizedAnimeTitle}`,
    [memoizedAnimeTitle, episodeNum],
  );

  if (errorAnime) {
    Alert.alert('error', errorAnime);
  }
  if (errorEpisodes) {
    Alert.alert('error', errorEpisodes);
  }
  if (errorSource) {
    Alert.alert('error', errorSource);
  }

  return (
    <View style={styles.container}>
      <VideoPlayyer
        id={episodeId}
        url={videoState.url}
        // url={videoState.url}
        videoTitle={memoizedTitle}
        isLoading={isLoadingSource}
        progressTrackFunc={progressTrackFunc}
      />
      {!videoState.fullscreen && (
        <ScrollView>
          <VideoDescComponent
            title={memoizedAnimeTitle}
            episodeNum={episodeNum}
            episodeInfo={null}
            isLoading={isLoadingAnime}
            onPressTitle={onPressTitle}
          />
          <VideoInfoBtnsComponent
            onPressPrev={handlePrevBtn}
            onPressNext={handleNextBtn}
            onPressShare={handleShare}
            onPressDownload={handleDownloadSheet}
            disablePrevBtn={episodeNum === 1}
            disableNextBtn={episodeNum >= episodesInfo?.episodes?.length}
          />
          <VideoSourcesServerComponent
            episodeId={episodeId}
            servers={episodeServerInfo}

            // setServer={setStreamSV}
          />
          <EpisodesSheet
            episodesInfo={episodesInfo}
            id={id}
            isLoading={isLoadingEpisodes}
            episodeId={episodeId}
            episodeNum={episodeNum}
            anime={animeInfo}
          />

          {/* </View> */}
        </ScrollView>
      )}

      {/* SettingSheet */}
      <BottomSheet
        enabled={videoState.showSetting}
        setEnabled={settingOp}
        max_Trans_Y={0.3} //-height * 1.5
        borderRadius={20}
        endPoint={0.92}
        snapPoint={0.6}
        onEnd={() => setVideoState(prev => ({...prev, showSetting: false}))}
        children={<SettingCard setShowSettingSheet={settingOp} />}
      />
      {/* Quality Setting Sheet */}
      <BottomSheet
        enabled={videoState.showQualitySetting}
        setEnabled={qualitySettingOp}
        max_Trans_Y={0.3} //-height * 1.5
        borderRadius={20}
        endPoint={0.92}
        snapPoint={0.6}
        onEnd={() =>
          setVideoState(prev => ({...prev, showQualitySetting: false}))
        }
        children={
          <QualitySetting
            qualities={sourceInfo?.sources}
            // enableCCAniwatch={enableCCAniwatch}
          />
        }
      />
      {/* Playback Rate setting Sheet */}
      <BottomSheet
        enabled={videoState.showPlayBackRateSetting}
        setEnabled={playbackRateSettingOp}
        max_Trans_Y={0.3} //-height * 1.5
        borderRadius={20}
        endPoint={0.92}
        snapPoint={0.6}
        onEnd={() =>
          setVideoState(prev => ({...prev, showPlayBackRateSetting: false}))
        }
        children={<PlayBackRateSetting />}
      />
      {/* ResizeMode Sheet */}
      <BottomSheet
        enabled={videoState.showResizeSetting}
        setEnabled={resizeModeSettingOp}
        max_Trans_Y={0.3} //-height * 1.5
        borderRadius={20}
        endPoint={0.92}
        snapPoint={0.6}
        onEnd={() =>
          setVideoState(prev => ({...prev, showResizeSetting: false}))
        }
        children={<ResizeModeSetting setResizeVideo={setResizeVideo} />}
      />
      {/* Download Sheet */}
      <BottomSheet
        enabled={showDownloadSheet}
        setEnabled={handleDownloadSheet}
        max_Trans_Y={0.3} //-height * 1.5
        borderRadius={20}
        endPoint={0.92}
        snapPoint={0.6}
        onEnd={() => setShowDownloadSheet(false)}
        children={
          <DownloadSheet
            setShowDownloadSheet={setShowDownloadSheet}
            showDownloadSheet={showDownloadSheet}
            episodeId={episodeId}
            source={sourceInfo}
          />
        }
      />

      {/* Download Sheet */}
      <BottomSheet
        enabled={videoState.showSubtitleSetting}
        setEnabled={setSubtilteOption}
        max_Trans_Y={0.3} //-height * 1.5
        borderRadius={20}
        endPoint={0.92}
        snapPoint={0.6}
        onEnd={() => setVideoState(prev => ({...prev, showSubtitleSetting: false}))}
        children={
          <SubtilteSetting />
        }
      />

    </View>
  );
};

export default V2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.DarkBackGround,
  },
});
