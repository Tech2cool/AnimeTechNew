import {
  ActivityIndicator,
  Alert,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import Theme from '../../../../utils/Theme';
import FastImage from 'react-native-fast-image';

import RandomColorCard from '../../../../components/RandomColorCard';
import {IIcon} from '../../../../utils/contstant';
import {useQuery} from '@tanstack/react-query';
import {fetchEpisodes} from '../../../../Query/v1';
import EpisodesSheet from './SmallComponent/EpisodesSheet';
import { useSettingControl } from '../../../../context/SettingsControlContext';

const color = Theme.DARK;
const font = Theme.FONTS;
const {width, height} = Dimensions.get('window');
const RequestedInfo = ({navigation, route}) => {
  const {anime} = route.params;
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);
  const {
    data: episodesInfo,
    isLoading: isLoadingEpisodes,
    error: errorEpisode,
  } = useQuery({
    queryKey: ['Episodes', anime?.id, refreshing],
    queryFn: () => fetchEpisodes({id: anime?.id}),
  });

  const {setting} = useSettingControl();

  const memoizedTitle = useMemo(() => {
    if (setting.language === 'en') {
      if (anime?.animeTitle?.english) {
        return anime?.animeTitle?.english;
      } else if (anime?.animeTitle?.english_jp) {
        return anime?.animeTitle?.english_jp;
      }
    } else {
      if (anime?.animeTitle?.english_jp) {
        return anime?.animeTitle?.english_jp;
      } else if (anime?.animeTitle?.english) {
        return anime?.animeTitle?.english;
      }
    }
  }, [anime?.animeTitle?.english, anime?.animeTitle?.english_jp, refreshing]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={{flex: 1, paddingBottom: 10}}>
        <View style={{width: width, height: height * (9 / 12)}}>
          <FastImage
            source={{uri: anime?.animeImg, priority: FastImage.priority.normal}}
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
            <RandomColorCard title={anime?.req_status} />
            <RandomColorCard title={anime?.status} />

            {anime?.genres?.length > 0 &&
              anime?.genres?.map(genre => (
                <RandomColorCard title={genre} key={genre} />
              ))}
            {anime?.genre && <RandomColorCard title={anime?.genre} />}
            <RandomColorCard title={anime?.type} />
            <RandomColorCard title={anime?.releasedDate} />
            <RandomColorCard title={anime?.released} />
            {anime?.totalEpisodes && (
              <RandomColorCard
                title={'Total Episodes ' + anime?.totalEpisodes}
              />
            )}
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 5,
              paddingVertical: 5,
            }}>
            {anime?.otherNames?.length > 0 && (
              <RandomColorCard
                title={
                  'OtherNames: ' +
                  anime?.otherNames?.join()?.replaceAll(',', ', ')
                }
              />
            )}
          </View>
          <View style={{paddingHorizontal: 2}}>
            {anime?.synopsis && (
              <RandomColorCard title={'Description: ' + anime?.synopsis} />
            )}
            {anime?.description && (
              <RandomColorCard title={'Description: ' + anime?.description} />
            )}
          </View>
        </View>
      </View>
      <EpisodesSheet
        id={anime?.id}
        anime={anime}
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
          onPress={() => Alert.alert('Not Added Yet', 'coming soon')}
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

export default RequestedInfo;

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
