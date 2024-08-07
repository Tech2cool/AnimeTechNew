import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo, useCallback} from 'react';
import {useQuery} from '@tanstack/react-query';
import Theme from '../../../../../utils/Theme';

import VerticalCard from '../../../../../components/VerticalCard';
import {fetchRecentRelease} from '../../../../../Query/v1';
import {useNavigation} from '@react-navigation/native';
const {width, height} = Dimensions.get('window');
const color = Theme.DARK;
const font = Theme.FONTS;
const RecentRelease = ({refreshing}) => {
  const {data, isLoading, error} = useQuery({
    queryKey: ['recentRelease', 1, refreshing],
    queryFn: () => fetchRecentRelease({page: 1}),
  });
  const navigation = useNavigation();

  const onPressAnime = item => {
    navigation.navigate('watch', {
      id: item.animeID || item.animeId,
      episodeId: item.episodeId,
      episodeNum: item.episodeNum,
      provider: 'anitaku',
    });
  };
  const onPressSeeAll = () => {
    navigation.navigate('RecentRelease');
  };
  const renderItem = useCallback(({item, i}) => {
    return (
      <TouchableOpacity
        style={styles.slider}
        activeOpacity={0.8}
        onPress={() => onPressAnime(item)}>
        <VerticalCard item={item} />
      </TouchableOpacity>
    );
  }, [refreshing,isLoading]);

  if (isLoading) {
    return (
      <View style={{flexDirection: 'row', gap: 10}}>
        {[1, 2, 3, 4, 5, 6].map(item => (
          <View
            key={item}
            style={{
              width: 145,
              height: 210,
              backgroundColor: color.LighterGray,
              paddingHorizontal: 10,
            }}></View>
        ))}
      </View>
    );
  }

  if (error) {
    Alert.alert('error', error?.message);
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 2,
          paddingVertical: 10,
        }}>
        <Text style={[styles.titleText, {color: color.White}]}>
          Recent Releases
        </Text>
        <TouchableOpacity onPress={onPressSeeAll}>
        <Text style={[styles.titleText]}>See all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal={true}
        data={data?.list?.sort((a, b) => a?.index - b?.index)}
        keyExtractor={(item, index) => `${item.animeID}`}
        renderItem={renderItem}
        contentContainerStyle={{gap: 10}}
      />
    </View>
  );
};

export default RecentRelease

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.DarkBackGround,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  titleText: {
    fontFamily: font.OpenSansBold,
    color: color.Orange,
    fontSize: 14,
  },
  descText: {
    fontFamily: font.OpenSansRegular,
    color: color.White,
    fontSize: 12,
  },
});
