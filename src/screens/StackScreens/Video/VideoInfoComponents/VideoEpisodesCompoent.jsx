import {Dimensions, FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {memo, useCallback, useEffect, useRef} from 'react';
import EpisodeCard from '../../../../components/EpisodeCard';
import {useNavigation} from '@react-navigation/native';
import SkeletonSlider from '../../../../components/SkeletonSlider';

const VideoEpisodesCompoent = ({
  animeId,
  kitsuId,
  episodeId,
  anime,
  aniwatchId,
  episodes = [],
  isLoading = false,
}) => {
  const epFlatListRef = useRef(null);
  const navigation = useNavigation();

  const navigateVideo = (item)=>{
    navigation.navigate('video', {
        animeId: animeId,
        episodeId: item?.id,
        episodeNum: item?.number,
        kitsuId: kitsuId,
        aniwatchId: aniwatchId,
        aniwatchEpisodeId: item?.aniInfo?.episodeId,
      })
  }
  const renderitem = useCallback(({item, index}) => {
    // console.log("render ep list")
      return (
          <TouchableOpacity
            onPress={() =>navigateVideo(item)}
            disabled={episodeId === item?.id}>
            <EpisodeCard episode={item} anime={anime} episodeId={episodeId} />
          </TouchableOpacity>
      );
    },[episodeId, isLoading]);

  const getItemLayout = useCallback(
    (data, index) => ({
      length: 140,
      offset: 140 * index,
      index,
    }),
    [],
  );
  useEffect(() => {
    if(!episodes) return
    const findIndexCrrEP = episodes?.findIndex(ep => ep?.id === episodeId);
    if (
      findIndexCrrEP !== -1 &&
      episodes?.length > 0 &&
      !isLoading &&
      epFlatListRef?.current
    ) {
      epFlatListRef?.current?.scrollToIndex({
        animated: true,
        index: findIndexCrrEP <= 2 ? findIndexCrrEP : findIndexCrrEP - 2,
      });
    }
  }, [episodeId, episodes, epFlatListRef?.current, isLoading]);

  if(isLoading){
    return<View style={{gap:10,}}>
    <SkeletonSlider width={Dimensions.get("window").width * 0.95} height={120} opacity={1} borderRadius={10}/>
    <SkeletonSlider width={Dimensions.get("window").width * 0.95} height={120} opacity={1} borderRadius={10}/>
    <SkeletonSlider width={Dimensions.get("window").width * 0.95} height={120} opacity={1} borderRadius={10}/>
    
    </View>
  }
  return (
    <View style={styles.container}>
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
    </View>
  );
};

export default memo(VideoEpisodesCompoent);

const styles = StyleSheet.create({
    container:{
        alignItems:"center",
    }
});
