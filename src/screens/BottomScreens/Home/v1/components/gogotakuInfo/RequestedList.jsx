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
import { useNavigation } from '@react-navigation/native';
const {width, height} = Dimensions.get('window');
const color = Theme.DARK;
const font = Theme.FONTS;
const RequestedList = ({refreshing, list, isLoading, error}) => {
  const navigation = useNavigation();

  const onPressAnime = item => {
    navigation.navigate('anime-info-v3', {
      anime: item,
    });
  };
  const onPressSeeAll = () => {
    navigation.navigate('RequestedList');
  };

  const renderItem = useCallback(({item, i}) => {
    return (
      <TouchableOpacity style={styles.slider} activeOpacity={0.8} onPress={()=> onPressAnime(item)}>
        <VerticalCard item={item} />
      </TouchableOpacity>
    );
  }, [refreshing]);

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
          paddingVertical: 5,
        }}>
        <Text style={[styles.titleText, {color: color.White}]}>
          Requested Anime
        </Text>
        <TouchableOpacity onPress={onPressSeeAll}>
        <Text style={[styles.titleText]}>See all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal={true}
        data={list?.sort((a, b) => a?.index - b?.index)}
        keyExtractor={(item, index) => `${item.id}`}
        renderItem={renderItem}
        contentContainerStyle={{gap: 10}}
      />
    </View>
  );
};

export default RequestedList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.DarkBackGround,
    paddingHorizontal: 5,
    paddingVertical: 10,
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
  cardText: {
    borderColor: color.Yellow,
    borderWidth: 1,
    fontFamily: font.OpenSansMedium,
    fontSize: 12,
    flex: 0,
    borderRadius: 10,
    padding: 5,
    color: color.Yellow,
  },
});
