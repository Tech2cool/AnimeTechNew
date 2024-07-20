import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback} from 'react';
import Theme from '../../../../../utils/Theme';

import VerticalCard from '../../../../../components/VerticalCard';
import {useNavigation} from '@react-navigation/native';
import SkeletonSlider from '../../../../../components/SkeletonSlider';
const {width, height} = Dimensions.get('window');
const color = Theme.DARK;
const font = Theme.FONTS;
const LatestCompletedSeries = ({refreshing, data, isLoading, error}) => {
  const navigation = useNavigation();

  const onPressAnime = item => {
    navigation.navigate('anime-info', {
      id: item.id,
      provider: 'aniwatch',
    });
  };
  const onPressSeeAll = () => {
    // navigation.navigate('RecentRelease');
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
    [refreshing, isLoading],
  );

  if (isLoading) {
    return (
      <View style={{flexDirection: 'row', gap: 10}}>
        {[1, 2, 3, 4, 5, 6].map(item => (
          <SkeletonSlider key={item} width={145} height={210} />
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
          Latest Completed Series
        </Text>
        <TouchableOpacity onPress={onPressSeeAll}>
          <Text style={[styles.titleText]}>All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal={true}
        data={data?.latestCompletedAnimes}
        keyExtractor={(item, index) => `${item.id + index}`}
        renderItem={renderItem}
        contentContainerStyle={{gap: 10}}
      />
    </View>
  );
};

export default LatestCompletedSeries;

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
