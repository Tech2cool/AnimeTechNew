/* eslint-disable prettier/prettier */
import {
  Alert,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import Theme from '../../../utils/Theme';
import VideoPlayyer from './VideoPlayerComponents/VideoPlayer';
import {useQuery} from '@tanstack/react-query';
import {useVideoState} from '../../../context/VideoStateContext';
import {
  fetchChats,
  fetchEpisodes,
  fetchInfo,
  fetchReaction,
  fetchSource,
} from '../../../Query/v1';
import {SERVER_BASE_URL, qualityPrefs} from '../../../utils/contstant';
import VideoDescComponent from './VideoInfoComponents/VideoDescComponent';
import VideoInfoBtnsComponent from './VideoInfoComponents/VideoInfoBtnsComponent';
import BottomSheet from '../../../components/BottomSheet';
import SettingCard from './SmallComponents/SettingCard';
import QualitySetting from './SmallComponents/QualitySetting';
import PlayBackRateSetting from './SmallComponents/PlayBackRateSetting';
import ResizeModeSetting from './SmallComponents/ResizeModeSetting';
import DownloadSheet from './SmallComponents/DownloadSheet';
import VideoSourcesServerComponent from './VideoInfoComponents/VideoSourcesServerComponent';
import {scrapeStreamSB} from '../../../Query/Extractor';
import EpisodesSheet from './SmallComponents/EpisodesSheet';
import {useNavigation} from '@react-navigation/native';
import {getDBConnection, saveVideoRecord} from '../../../config/db';
import {useSettingControl} from '../../../context/SettingsControlContext';
import NetInfo from '@react-native-community/netinfo';
import {BASE_URL} from '../../../config/config';
import VideoChatsComponent from './VideoInfoComponents/VideoChatsComponent';
import VideoAllComments from './VideoInfoComponents/VideoAllComments';
import VideoBtnsCards from './VideoInfoComponents/VideoBtnsCards';

const color = Theme.DARK;
const font = Theme.FONTS;

const V1 = ({id, episodeId, episodeNum, provider}) => {
  const {videoState, setVideoState} = useVideoState();
  const navigation = useNavigation();
  const [netState, setNetState] = useState({
    type: null,
    isConnected: null,
    isWifiEnabled: false,
    isInternetReachable: null,
    details: null,
  });
  const {isConnected, isWifiEnabled} = NetInfo.useNetInfo();

  // const [episode, setEpisode] = useState({});
  const [showDownloadSheet, setShowDownloadSheet] = useState(false);
  const [showCommentsSheet, setShowCommentsSheet] = useState(false);
  const [streamServer, setStreamServer] = useState('vidstreaming');
  const [cursor, setCursor] = useState(undefined);
  const [commentsList, setCommentsList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const {setting} = useSettingControl();

  const {
    data: animeInfo,
    isLoading: isLoadingAnime,
    error: errorAnime,
  } = useQuery({
    queryKey: ['info', id],
    queryFn: () => fetchInfo({id: id}),
  });
  const {
    data: sourceInfo,
    isLoading: isLoadingSource,
    error: errorSource,
  } = useQuery({
    queryKey: ['source', episodeId, streamServer],
    queryFn: () => fetchSourcesDefault(),
  });

  const {
    data: episodesInfo,
    isLoading: isLoadingEpisodes,
    error: errorEpisodes,
  } = useQuery({
    queryKey: ['Episodes', id, refreshing],
    queryFn: () => fetchEpisodeDefault(),
  });
  const {
    data: dataChats,
    isLoading: isLoadingChats,
    error: errorChats,
  } = useQuery({
    queryKey: ['Chats', sourceInfo?.thread?.id, cursor, refreshing],
    queryFn: () => fetchChatsDef(),
  });

  const {
    data: dataReaction,
    isLoading: isLoadingReaction,
    error: errorReaction,
  } = useQuery({
    queryKey: ['Reactions', sourceInfo?.thread?.id, refreshing],
    queryFn: () => fetchReaction({id: sourceInfo?.thread?.id}),
  });

  const fetchChatsDef = async () => {
    try {
      const response = await fetchChats({
        id: sourceInfo?.thread?.id,
        cursor: cursor,
      });
      if (commentsList?.length > 0) {
        setCommentsList([...commentsList, ...response?.response]);
      } else {
        setCommentsList(response?.response);
      }
      return response;
    } catch (error) {
      throw new Error(error);

      // console.log(error);
      // Alert.alert('error', error?.message);
    }
  };

  const fetchEpisodeDefault = async () => {
    try {
      const response = await fetchEpisodes({id: id});
      return response;
    } catch (error) {
      // console.log(error);
      // Alert.alert('error', error?.message);
      throw new Error(error);
    }
  };
  const fetchSourcesDefault = async () => {
    try {
      let response;
      if (streamServer === 'streamwish' || streamServer === 'streamsb') {
        response = await scrapeStreamSB(episodeId);
      } else {
        response = await fetchSource({
          id: episodeId,
          streamServer: streamServer,
        });
      }
      if (response?.sources?.length) {
        const findDefault = isWifiEnabled
          ? response?.sources?.find(
              src =>
                src?.quality === setting.qualityPrefrence.wifi ||
                qualityPrefs._default,
            )
          : response?.sources?.find(
              src =>
                src?.quality === setting.qualityPrefrence.mobile ||
                qualityPrefs._default,
            );

        setVideoState(prev => ({
          ...prev,
          url: findDefault?.url,
          quality: findDefault?.quality,
          provider: findDefault?.provider,
        }));
      }

      return response;
    } catch (error) {
      throw new Error(error);
    }
  };

  const memoizedAnimeTitle = useMemo(() => {
    if (setting.language === 'en') {
      if (animeInfo?.animeTitle?.english) {
        return animeInfo?.animeTitle?.english;
      } else if (animeInfo?.animeTitle?.english_jp) {
        return animeInfo?.animeTitle?.english_jp;
      }
    } else {
      if (animeInfo?.animeTitle?.english_jp) {
        return animeInfo?.animeTitle?.english_jp;
      } else if (animeInfo?.animeTitle?.english) {
        return animeInfo?.animeTitle?.english;
      }
    }
  }, [animeInfo?.animeTitle, setting.language]);

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
        provider: 'anitaku',
      });
    }
  };

  const handlePrevBtn = () => {
    // console.log('called prev');
    const findNextEpIndex = episodesInfo?.episodes?.findIndex(
      (ep, i) => ep?.id === episodeId,
    );
    if (findNextEpIndex !== -1 && findNextEpIndex - 1 >= 0) {
      setVideoState({...videoState, url: undefined});

      const episode = episodesInfo?.episodes[findNextEpIndex - 1];

      navigation.navigate('watch', {
        id: id,
        episodeId: episode?.id,
        episodeNum: episode?.episodeNum || episode?.number,
        provider: 'anitaku',
      });
    }
  };

  const handleShare = async () => {
    try {
      const url =
        SERVER_BASE_URL +
        '/share' +
        `?type=episode&id=${id}&episodeId=${episodeId}&episodeNum=${episodeNum}&provider=${setting.provider}`;
      const imageUrl = animeInfo.animeImg;
      const title = memoizedAnimeTitle;
      const message =
        memoizedAnimeTitle + '\n' + 'Episode ' + episodeNum + '\n' + url;

      const result = await Share.share({
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
      Alert.alert('error', error?.message);
    }
  };

  const shareToWhatsApp = () => {
    const url =
      SERVER_BASE_URL +
      '/share' +
      `?type=episode&id=${id}&episodeId=${episodeId}&episodeNum=${episodeNum}&provider=${setting.provider}`;
    const imageUrl = animeInfo?.animeImg;

    const message =
      memoizedAnimeTitle +
      '\n' +
      'Episode ' +
      episodeNum +
      '\n' +
      url +
      '\n' +
      imageUrl;

    Linking.openURL(`whatsapp://send?text=${message}`);
  };

  const shareToTwitter = () => {
    const url =
      SERVER_BASE_URL +
      '/share' +
      `?type=episode&id=${id}&episodeId=${episodeId}&episodeNum=${episodeNum}&provider=${setting.provider}`;
    const imageUrl = animeInfo?.animeImg;

    const message =
      memoizedAnimeTitle +
      '\n' +
      'Episode ' +
      episodeNum +
      '\n' +
      url +
      '\n' +
      imageUrl;
    // const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      message,
    )}`;

    Linking.openURL(twitterUrl).catch(err =>
      console.error('An error occurred', err),
    );
  };

  const shareToFacebook = () => {
    const url =
      SERVER_BASE_URL +
      '/share' +
      `?type=episode&id=${id}&episodeId=${episodeId}&episodeNum=${episodeNum}&provider=${setting.provider}`;
    const imageUrl = animeInfo?.animeImg;

    const message =
      memoizedAnimeTitle +
      '\n' +
      'Episode ' +
      episodeNum +
      '\n' +
      url +
      '\n' +
      imageUrl;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url,
    )}&description=${message}&quote=${encodeURIComponent(message)}`;

    Linking.openURL(facebookUrl).catch(err =>
      console.error('An error occurred', err),
    );
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
  const handleCommentSheet = () => {
    setShowCommentsSheet(!showCommentsSheet);
  };
  const settingOp = (ops = false) => {
    setVideoState(prev => ({...prev, showSetting: ops}));
  };
  const setResizeVideo = resize => {
    setVideoState({...videoState, resizeMode: resize});
  };
  const setStreamSV = sv => {
    setStreamServer(sv);
  };

  useEffect(() => {
    const backHandler = navigation.addListener('beforeRemove', e => {
      setVideoState({...videoState, url: undefined});
    });
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetState(prev => ({
        ...prev,
        type: state.type,
        isConnected: state.isConnected,
        isWifiEnabled: state.isWifiEnabled,
        isInternetReachable: state.isInternetReachable,
        details: state.details,
      }));
    });
    return () => {
      unsubscribe();
      navigation.removeListener(backHandler);
    };
  }, [navigation]);

  const progressTrackFunc = async () => {
    try {
      const db = await getDBConnection();
      // const newTable = await createTable(db)
      const record = {
        id: id,
        episodeIdGogo: episodeId,
        animeImg: animeInfo?.animeImg,
        episodeNum: episodeNum,
        english: animeInfo?.animeTitle?.english,
        english_jp: animeInfo?.animeTitle?.english_jp,
        japanese: animeInfo?.animeTitle?.japanese,
        currentTime: videoState.currentTime,
        duration: videoState.duration,
        gogoId: id,
        timestamp: new Date().getTime(),
        wannaDelete: false,
        provider: provider,
      };
      const updateRecord = await saveVideoRecord(db, record);
      // console.log("update")
    } catch (error) {
      console.log(error);
    }
  };

  const memoizedTitle = useMemo(
    () => `Episode ${episodeNum} - ${memoizedAnimeTitle}`,
    [memoizedAnimeTitle, episodeNum],
  );

  if (errorAnime) {
    Alert.alert('error', errorAnime?.message);
  }
  if (errorEpisodes) {
    Alert.alert('error', errorEpisodes?.message);
  }
  if (errorSource) {
    Alert.alert('error', errorSource?.message);
  }
  if (errorChats) {
    Alert.alert('error', errorChats?.message);
  }
  if (errorReaction) {
    Alert.alert('error', errorReaction?.message);
  }

  return (
    <View style={styles.container}>
      <VideoPlayyer
        id={episodeId}
        url={videoState.url}
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
            disablePrevBtn={episodeNum <= 1}
            disableNextBtn={episodeNum >= episodesInfo?.episodes?.length}
          />
          <VideoBtnsCards
            list={dataReaction?.reactions?.sort((a, b) => a?.order - b?.order)}
            isLoading={isLoadingReaction}
            shareToTwitter={() => shareToTwitter()}
            shareToFacebook={() => shareToFacebook()}
            shareToWhatsApp={() => shareToWhatsApp()}
            onPressShare={() => handleShare()}
            onPressDownload={() => handleDownloadSheet()}
          />
          {/* <VideoSourcesServerComponent
            episodeId={episodeId}
            server={streamServer}
            setServer={setStreamSV}
            serverList={sourceInfo?.multiLinks}
          /> */}
          <VideoChatsComponent
            list={dataChats?.response || []}
            source={sourceInfo}
            isLoading={isLoadingChats}
            onClick={() => handleCommentSheet()}
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
        max_Trans_Y={0.29} //-height * 1.5
        borderRadius={20}
        endPoint={0.92}
        snapPoint={0.6}
        onEnd={() => setVideoState(prev => ({...prev, showSetting: false}))}>
        <SettingCard setShowSettingSheet={settingOp} />
      </BottomSheet>

      {/* Quality Setting Sheet */}
      <BottomSheet
        enabled={videoState.showQualitySetting}
        setEnabled={qualitySettingOp}
        max_Trans_Y={0.29} //-height * 1.5
        borderRadius={20}
        endPoint={0.92}
        snapPoint={0.6}
        onEnd={() =>
          setVideoState(prev => ({...prev, showQualitySetting: false}))
        }>
        <QualitySetting
          qualities={sourceInfo?.sources}
          // enableCCAniwatch={enableCCAniwatch}
        />
      </BottomSheet>

      {/* Playback Rate setting Sheet */}
      <BottomSheet
        enabled={videoState.showPlayBackRateSetting}
        setEnabled={playbackRateSettingOp}
        max_Trans_Y={0.29} //-height * 1.5
        borderRadius={20}
        endPoint={0.92}
        snapPoint={0.6}
        onEnd={() =>
          setVideoState(prev => ({...prev, showPlayBackRateSetting: false}))
        }>
        <PlayBackRateSetting />
      </BottomSheet>

      {/* ResizeMode Sheet */}
      <BottomSheet
        enabled={videoState.showResizeSetting}
        setEnabled={resizeModeSettingOp}
        max_Trans_Y={0.29} //-height * 1.5
        borderRadius={20}
        endPoint={0.92}
        snapPoint={0.6}
        onEnd={() =>
          setVideoState(prev => ({...prev, showResizeSetting: false}))
        }>
        <ResizeModeSetting setResizeVideo={setResizeVideo} />
      </BottomSheet>

      {/* Download Sheet */}
      <BottomSheet
        enabled={showDownloadSheet}
        setEnabled={handleDownloadSheet}
        max_Trans_Y={0.29} //-height * 1.5
        borderRadius={20}
        endPoint={0.92}
        snapPoint={0.6}
        onEnd={() => setShowDownloadSheet(false)}>
        <DownloadSheet
          setShowDownloadSheet={setShowDownloadSheet}
          showDownloadSheet={showDownloadSheet}
          episodeId={episodeId}
          source={sourceInfo}
        />
      </BottomSheet>

      {/* Commets Sheet */}
      <BottomSheet
        enabled={showCommentsSheet}
        setEnabled={handleCommentSheet}
        max_Trans_Y={0.29} //-height * 1.5
        borderRadius={20}
        endPoint={0.92}
        snapPoint={0.6}
        containerStyle={{
          backgroundColor: color.DarkBackGround,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          borderWidth: 0.5,
          borderColor: color.LighterGray,
        }}
        onEnd={() => setShowCommentsSheet(false)}>
        <VideoAllComments
          threadId={sourceInfo?.thread?.id}
          data={dataChats}
          isLoading={isLoadingChats}
          list={commentsList}
          setCursor={setCursor}
        />
      </BottomSheet>
    </View>
  );
};

export default V1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.DarkBackGround,
  },
});
