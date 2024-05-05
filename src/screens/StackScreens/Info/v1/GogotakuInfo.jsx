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
  View,
} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import Theme from '../../../../utils/Theme';
import {useQuery} from '@tanstack/react-query';
import {fetchEpisodes, fetchInfo, fetchInfoV2} from '../../../../Query/v1';
import FastImage from 'react-native-fast-image';

import RandomColorCard from '../../../../components/RandomColorCard';
import EpisodesSheet from './SmallComponent/EpisodesSheet';
import {IIcon} from '../../../../utils/contstant';
import { useSettingControl } from '../../../../context/SettingsControlContext';

const color = Theme.DARK;
const font = Theme.FONTS;
const {width, height} = Dimensions.get('window');
const GogotakuInfo = ({navigation, route}) => {
  const {id} = route.params;
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);
  const {data, isLoading, error} = useQuery({
    queryKey: ['info', id, refreshing],
    queryFn: () => fetchInfoV2({id}),
  });

  const {
    data: episodesInfo,
    isLoading: isLoadingEpisodes,
    error: errorEpisode,
  } = useQuery({
    queryKey: ['Episodes', id, refreshing],
    queryFn: () => fetchEpisodes({id}),
  });
  const {setting} = useSettingControl();

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
  }, [data?.animeTitle?.english, data?.animeTitle?.english_jp, refreshing,isLoading]);


  if (isLoading) {
    return (
      <View style={[styles.container, {gap: 8}]}>
        <View
          style={{
            width: width,
            height: height * (9 / 12),
            backgroundColor: color.LighterGray,
          }}></View>
        <View
          style={{
            width: width * 0.95,
            height: 20,
            backgroundColor: color.LighterGray,
            alignSelf: 'center',
          }}></View>

        <View
          style={{
            width: width * 0.95,
            height: 20,
            backgroundColor: color.LighterGray,
            alignSelf: 'center',
          }}></View>
          
        <View
          style={{
            flexDirection: 'row',
            gap: 5,
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map(item => (
            <View
              key={item}
              style={{
                width: 80,
                height: 35,
                backgroundColor: color.LighterGray,
                borderRadius: 10,
              }}></View>
          ))}
        </View>
        <View
          style={{
            width: width * 0.95,
            height: 100,
            backgroundColor: color.LighterGray,
            alignSelf: 'center',
          }}></View>
        <View
          style={{
            flexDirection: 'row',
            gap: 5,
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(item => (
            <View
              key={item}
              style={{
                width: 60,
                height: 35,
                backgroundColor: color.LighterGray,
                borderRadius: 10,
              }}></View>
          ))}
        </View>
      </View>
    );
  }
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
            <RandomColorCard title={'Total Episodes ' + data?.totalEpisodes} />
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
                'OtherNames: ' + data?.otherNames?.join()?.replaceAll(',', ', ')
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
          onPress={()=> Alert.alert("Not Added Yet", "coming soon")}
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

export default GogotakuInfo;

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
});
