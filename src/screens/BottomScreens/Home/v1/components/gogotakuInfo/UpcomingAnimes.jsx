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
import Theme from '../../../../../../utils/Theme';

import VerticalCard from '../../../../../../components/VerticalCard';
import {useNavigation} from '@react-navigation/native';
const {width, height} = Dimensions.get('window');
const color = Theme.DARK;
const font = Theme.FONTS;
const UpcomingAnimes = ({refreshing, list, isLoading, error}) => {
  const navigation = useNavigation();

  const onPressAnime = item => {
    navigation.navigate('anime-info', {
      id: item.animeId || item.animeID,
    });
  };
  const onPressSeeAll = type => {
    navigation.navigate('UpcomingList', {type: type});
  };

  const renderItem = useCallback(
    ({item, i}) => {
      return (
        <TouchableOpacity
          style={styles.slider}
          activeOpacity={0.8}
          onPress={() => onPressAnime(item)}>
          <VerticalCard item={item} />
        </TouchableOpacity>
      );
    },
    [refreshing],
  );

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
    Alert.alert('error', error);
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 2,
          paddingVertical: 5,
        }}>
        <Text style={[styles.titleText, {color: color.White}]}>
          Upcoming TV Series Anime
        </Text>
        <TouchableOpacity onPress={() => onPressSeeAll('tv-series')}>
          <Text style={[styles.titleText]}>See all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal={true}
        data={list?.tv_series}
        keyExtractor={(item, index) => `${item.animeID || item.animeId}`}
        renderItem={renderItem}
        contentContainerStyle={{gap: 10}}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 2,
          paddingVertical: 5,
        }}>
        <Text style={[styles.titleText, {color: color.White}]}>
          Upcoming Special Anime
        </Text>
        <TouchableOpacity onPress={() => onPressSeeAll('special')}>
          <Text style={[styles.titleText]}>See all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal={true}
        data={list?.special}
        keyExtractor={(item, index) => `${item.animeID || item.animeId}`}
        renderItem={renderItem}
        contentContainerStyle={{gap: 10}}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 2,
          paddingVertical: 5,
        }}>
        <Text style={[styles.titleText, {color: color.White}]}>
          Upcoming Movies
        </Text>
        <TouchableOpacity onPress={() => onPressSeeAll('movie')}>
          <Text style={[styles.titleText]}>See all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal={true}
        data={list?.movies}
        keyExtractor={(item, index) => `${item.animeID || item.animeId}`}
        renderItem={renderItem}
        contentContainerStyle={{gap: 10}}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 2,
          paddingVertical: 5,
        }}>
        <Text style={[styles.titleText, {color: color.White}]}>
          Upcoming OVA
        </Text>
        <TouchableOpacity onPress={() => onPressSeeAll('ova')}>
          <Text style={[styles.titleText]}>See all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal={true}
        data={list?.ova}
        keyExtractor={(item, index) => `${item.animeID || item.animeId}`}
        renderItem={renderItem}
        contentContainerStyle={{gap: 10}}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 2,
          paddingVertical: 5,
        }}>
        <Text style={[styles.titleText, {color: color.White}]}>
          Upcoming ONA
        </Text>
        <TouchableOpacity onPress={() => onPressSeeAll('ona')}>
          <Text style={[styles.titleText]}>See all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal={true}
        data={list?.ona}
        keyExtractor={(item, index) => `${item.animeID || item.animeId}`}
        renderItem={renderItem}
        contentContainerStyle={{gap: 10}}
      />
    </View>
  );
};

export default UpcomingAnimes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.DarkBackGround,
    paddingHorizontal: 5,
    paddingVertical: 10,
    gap: 10,
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
