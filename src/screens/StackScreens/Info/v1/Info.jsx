import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Share,
  View,
} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import Theme from '../../../../utils/Theme';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {fetchEpisodes, fetchInfo} from '../../../../Query/v1';
import FastImage from 'react-native-fast-image';

import RandomColorCard from '../../../../components/RandomColorCard';
import EpisodesSheet from './SmallComponent/EpisodesSheet';
import {IIcon, SERVER_BASE_URL} from '../../../../utils/contstant';
import {useSettingControl} from '../../../../context/SettingsControlContext';
import SkeletonSlider from '../../../../components/SkeletonSlider';
import {generateArray} from '../../../../utils/HelperFunctions';

const color = Theme.DARK;
const font = Theme.FONTS;
const {width, height} = Dimensions.get('window');
const Info = ({navigation, route, id}) => {
  // const {id} = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const {setting} = useSettingControl();
  const queryClient = useQueryClient();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    queryClient.invalidateQueries({queryKey:["info"]})
    queryClient.invalidateQueries({queryKey:["Episodes"]})
    
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const {data, isLoading, error} = useQuery({
    queryKey: ['info', id, refreshing],
    queryFn: () => fetchInfo({id}),
  });

  const {
    data: episodesInfo,
    isLoading: isLoadingEpisodes,
    error: errorEpisode,
  } = useQuery({
    queryKey: ['Episodes', id, refreshing],
    queryFn: () => fetchEpisodes({id}),
  });

  const memoizedTitle = useMemo(() => {
    if (setting.language === 'en') {
      if (data?.animeTitle?.english) {
        return data?.animeTitle?.english;
      } else if (data?.animeTitle?.english_jp) {
        return data?.animeTitle?.english_jp;
      }
    } else {
      if (data?.animeTitle?.english_jp) {
        return data?.animeTitle?.english_jp;
      } else if (data?.animeTitle?.english) {
        return data?.animeTitle?.english;
      }
    }
  }, [
    data?.animeTitle?.english,
    data?.animeTitle?.english_jp,
    refreshing,
    isLoading,
  ]);

  const handleShare = async () => {
    try {
      const url =
        SERVER_BASE_URL +
        '/share' +
        `?type=anime&id=${id}&provider=${setting.provider}`;
      const title = memoizedTitle;
      const message = memoizedTitle + '\n' + '\n' + url;

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
      Alert.alert(error.message);
    }
  };
  
  if (error) {
    Alert.alert('error', error?.message);
  }
  if (errorEpisode) {
    Alert.alert('error', errorEpisode?.message);
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {isLoading ? (
        <View style={[styles.container, {gap: 8}]}>
          <SkeletonSlider
            width={width}
            height={height * (9 / 12)}
            shimmerColors={[
              color.LighterGray,
              color.LighterGray,
              color.LighterGray,
            ]}
          />
          <SkeletonSlider
            width={width * 0.95}
            height={20}
            shimmerColors={[
              color.LighterGray,
              color.LighterGray,
              color.LighterGray,
            ]}
            style={{alignSelf: 'center'}}
          />
          <SkeletonSlider
            width={width * 0.95}
            height={20}
            shimmerColors={[
              color.LighterGray,
              color.LighterGray,
              color.LighterGray,
            ]}
            style={{alignSelf: 'center'}}
          />

          <View
            style={{
              flexDirection: 'row',
              gap: 5,
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map(item => (
              <SkeletonSlider
                key={item}
                width={80}
                height={35}
                shimmerColors={[
                  color.LighterGray,
                  color.LighterGray,
                  color.LighterGray,
                ]}
                style={{alignSelf: 'center'}}
                borderRadius={10}
              />
            ))}
          </View>

          <SkeletonSlider
            width={width * 0.92}
            height={100}
            shimmerColors={[
              color.LighterGray,
              color.LighterGray,
              color.LighterGray,
            ]}
            style={{alignSelf: 'center'}}
          />

          <View
            style={{
              flexDirection: 'row',
              gap: 5,
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {generateArray(1, 25).map(item => (
              <SkeletonSlider
                key={item}
                width={60}
                height={35}
                shimmerColors={[
                  color.LighterGray,
                  color.LighterGray,
                  color.LighterGray,
                ]}
                style={{alignSelf: 'center'}}
                borderRadius={10}
              />
            ))}
          </View>
        </View>
      ) : (
        <>
          <View style={{flex: 1, paddingBottom: 10}}>
            <View style={{width: width, height: height * (9 / 12)}}>
              <FastImage
                source={{uri: data?.animeImg}}
                style={{flex: 1}}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
            <View style={{flex: 1, paddingHorizontal: 4}}>
              <Text style={styles.titleText}>{memoizedTitle}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 5,
                  paddingVertical: 5,
                }}>
                {data?.genres?.map(genre => (
                  <RandomColorCard title={genre} key={genre} />
                ))}
                <RandomColorCard title={data?.type} />
                <RandomColorCard title={data?.releasedDate} />
                <RandomColorCard title={data?.status} />
                <RandomColorCard
                  title={'Total Episodes ' + data?.totalEpisodes}
                />
              </View>
               
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 5,
                  paddingVertical: 5,
                }}>
                <RandomColorCard
                  title={
                    'OtherNames: ' +
                    data?.otherNames?.join()?.replaceAll(',', ', ')
                  }
                />
              </View>
              <View style={{paddingHorizontal: 2}}>
                <RandomColorCard title={'Description: ' + data?.synopsis} />
              </View>
            </View>
          </View>

          <EpisodesSheet
            id={id}
            anime={data}
            episodesInfo={episodesInfo}
            isLoading={isLoadingEpisodes}
          />
        </>
      )}
      <View
        style={{
          flexDirection: 'row',
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          justifyContent: 'space-between',
          paddingVertical: 5,
          paddingHorizontal: 10,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            padding: 5,
            borderRadius: 999,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}>
          <IIcon name={'arrow-back'} size={30} color={color.White} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleShare}
          style={{
            padding: 5,
            borderRadius: 999,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}>
          <IIcon name={'share-social'} size={30} color={color.White} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Info;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.DarkBackGround,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  titleText: {
    fontFamily: font.OpenSansBold,
    color: color.Orange,
    fontSize: 14,
  },
  descText: {
    fontFamily: font.OpenSansMedium,
    color: color.White,
    fontSize: 12,
  },
  epBtn: {
    padding: 10,
    marginVertical: 4,
    borderColor: color.Orange,
    borderWidth: 1,
    borderRadius: 10,
    minWidth: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  episodeText: {
    fontFamily: font.OpenSansMedium,
    color: color.White,
    fontSize: 12,
  },
  centerAlign: {
    flexDirection: 'row',
    gap: 5,
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
