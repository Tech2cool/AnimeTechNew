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
import {fetchEpisodesAniwatch, fetchInfoAniwatch} from '../../../../Query/v2';

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
    queryClient.invalidateQueries({queryKey: ['info_aniwatch']});
    queryClient.invalidateQueries({queryKey: ['Episodes_aniwatch']});

    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const {data, isLoading, error} = useQuery({
    queryKey: ['info_aniwatch', id, refreshing],
    queryFn: () => fetchInfoAniwatch({id}),
  });

  const {
    data: episodesInfo,
    isLoading: isLoadingEpisodes,
    error: errorEpisode,
  } = useQuery({
    queryKey: ['Episodes_aniwatch', id, refreshing],
    queryFn: () => fetchEpisodesAniwatch({id}),
  });

  const memoizedTitle = useMemo(() => {
    if (setting.language === 'en') {
      if (data?.anime?.info?.name) {
        return data?.anime?.info?.name;
      } else if (data?.anime?.info?.jname) {
        return data?.anime?.info?.jname;
      } else if (data?.anime?.moreInfo?.japanese) {
        return data?.anime?.moreInfo?.japanese;
      }
    } else {
      if (data?.anime?.info?.jname) {
        return data?.anime?.info?.jname;
      } else if (data?.anime?.moreInfo?.japanese) {
        return data?.anime?.moreInfo?.japanese;
      } else if (data?.anime?.info?.name) {
        return data?.anime?.info?.name;
      }
    }
  }, [
    data?.anime?.info?.name,
    data?.anime?.moreInfo?.japanese,
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
    Alert.alert('error', error);
  }
  if (errorEpisode) {
    Alert.alert('error', errorEpisode);
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
                source={{uri: data?.anime?.info?.poster}}
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
                {data?.anime?.moreInfo?.genres?.map(genre => (
                  <RandomColorCard title={genre} key={genre} />
                ))}
                <RandomColorCard title={data?.anime?.info?.stats?.type} />
                <RandomColorCard title={data?.anime?.info?.stats?.rating} />
                <RandomColorCard title={data?.anime?.info?.stats?.quality} />
                <RandomColorCard
                  title={'Sub : ' + data?.anime?.info?.stats?.episodes.sub}
                />
                <RandomColorCard
                  title={'Dub : ' + data?.anime?.info?.stats?.episodes.dub}
                />
                <RandomColorCard title={data?.anime?.moreInfo?.status} />
                <RandomColorCard
                  title={'Mal Score : ' + data?.anime?.moreInfo?.malscore}
                />
                <RandomColorCard title={data?.anime?.moreInfo?.aired} />
                <RandomColorCard title={data?.anime?.moreInfo?.studios} />
                <RandomColorCard title={data?.anime?.moreInfo?.premiered} />
                <RandomColorCard
                  title={data?.anime?.info?.stats?.releasedDate}
                />
                <RandomColorCard title={data?.anime?.info?.stats?.status} />
              </View>

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 5,
                  paddingVertical: 5,
                }}></View>
              <View style={{paddingHorizontal: 2}}>
                <RandomColorCard
                  title={'Description: ' + data?.anime?.info?.description}
                />
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
