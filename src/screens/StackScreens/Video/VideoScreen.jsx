import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useMemo, useState } from 'react'
import Theme from '../../../utils/Theme'
import VideoPlayyer from './VideoPlayerComponents/VideoPlayer'
import VideoDescComponent from './VideoInfoComponents/VideoDescComponent'
import VideoInfoBtnsComponent from './VideoInfoComponents/VideoInfoBtnsComponent'
import VideoRelatedInfoComponent from './VideoInfoComponents/VideoRelatedInfoComponent'
import {useQuery} from '@tanstack/react-query';
import { fetchAnimeInfo, fetchEpisodes, fetchSource, generateDynamicLink } from '../../../utils/functions'
import { useLanguage } from '../../../contexts/LanguageContext'
import VideoEpisodesCompoent from './VideoInfoComponents/VideoEpisodesCompoent'
import { useVideoPlayer } from '../../../contexts/VideoContext'
import { StreamingServers, qualityPrefs } from '../../../utils/contstant'
import { useQualityPref } from '../../../contexts/QualityPrefrenceContext'
import { TextTracksType } from 'react-native-video'
import { useNetInfo } from '@react-native-community/netinfo'

const color= Theme.DARK
const font= Theme.FONTS
const VideoScreen = ({route, navigation}) => {
  const {
    animeId,
    kitsuId,
    episodeId,
    episodeNum,
    aniwatchId,
    aniwatchEpisodeId,
  } = route.params;

  const {currentLang} = useLanguage();
  const {VideoPlayer, setVideoPlayer} = useVideoPlayer();
  const {QualityPref, setQuality} = useQualityPref();

  const [showDownloadSheet, setShowDownloadSheet] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [vidUrl, setVidUrl] = useState(null);

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
  const {isConnected, isWifiEnabled} = useNetInfo();

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
          type: TextTracksType.VTT,
          uri: track?.file,
        };
      });
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
      // setVidUrl(findQuality?.url)
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

  const onPressTitle = ()=>{
    navigation.navigate('anime-info', {animeId: animeId})
  }
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
    // console.log('called prev');
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

  const handleDownloadSheet = () => {
    setShowDownloadSheet(!showDownloadSheet);
  };

  return (
    <View style={styles.container}>
      <VideoPlayyer 
        id={episodeId}
        url={VideoPlayer.url}
        videoTitle={`Episode ${episodeNum} - ${memoizedAnimeTitle}`}
        isLoading={loadingEpisode}
      />
      <VideoDescComponent 
        title={memoizedAnimeTitle}
        episodeNum={episodeNum}
        episodeInfo={null}
        isLoading={loadingInfo}
        onPressTitle={onPressTitle}
      />
      <VideoInfoBtnsComponent 
        onPressPrev={handlePrevBtn}
        onPressNext={handleNextBtn}
        onPressShare={handleShare}
        onPressDownload={handleDownloadSheet}
      />
      <VideoRelatedInfoComponent 
        data={anime?.aniwatchInfo?.seasons?.length > 0
          ? anime?.aniwatchInfo?.seasons
          : anime?.relatedAddtional?.sequalOrPrequal}
        anime={anime}
        animeId={animeId}
        isLoading={loadingInfo}
      />
      <VideoEpisodesCompoent 
        episodes={episodes}
        animeId={animeId}
        aniwatchId={aniwatchId}
        kitsuId={kitsuId}
        isLoading={loadingEpisode}
        episodeId={episodeId}
        anime={anime}
      />
    </View>
  )
}

export default VideoScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:color.DarkBackGround
    },
})