import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {useQuery} from '@tanstack/react-query';

import FastImage from 'react-native-fast-image';
import {stripHtmlTags} from '../../../../../../utils/HelperFunctions';
import LinearGradient from 'react-native-linear-gradient';
import {fetchTrending} from '../../../../../../Query/v1';
import {MCIcon} from '../../../../../../utils/contstant';
import {useNavigation} from '@react-navigation/native';
import { useSettingControl } from '../../../../../../context/SettingsControlContext';
import Theme from '../../../../../../utils/Theme';
const {width, height} = Dimensions.get('window');
const color = Theme.DARK;
const font = Theme.FONTS;
const SliderGogotaku = ({refreshing,list, isLoading,error}) => {
  const navigation = useNavigation();
  const {setting}= useSettingControl()
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const memoizedPoster = useCallback(item => {
    if (item?.AdditionalInfo?.posterImage?.large) {
      return item?.AdditionalInfo?.posterImage?.large;
    } else if (item?.AdditionalInfo?.posterImage?.medium) {
      return item?.AdditionalInfo?.posterImage?.medium;
    } else if (item?.AdditionalInfo?.posterImage?.original) {
      return item?.AdditionalInfo?.posterImage?.original;
    } else if (item?.anilist?.coverImage?.large) {
      return item?.anilist?.coverImage?.large;
    } else if (item?.animeImg) {
      return item.animeImg;
    }
  }, []);
  const memoizedTitle = useCallback(item => {
    if (setting.language === 'en') {
      if (item?.animeTitle?.english) {
        return item?.animeTitle?.english;
      } else if (item?.animeTitle?.english_jp) {
        return item?.animeTitle?.english_jp;
      }
    } else {
      if (item?.animeTitle?.english_jp) {
        return item?.animeTitle?.english_jp;
      } else if (item?.animeTitle?.english) {
        return item?.animeTitle?.english;
      }
    }
  }, []);

  const memoizedDesc = useCallback(item => {
    if (item?.AdditionalInfo?.synopsis) {
      return stripHtmlTags(item?.AdditionalInfo?.synopsis);
    } else if (item?.AdditionalInfo?.description) {
      return stripHtmlTags(item?.AdditionalInfo?.description);
    } else if (item?.anilist?.description) {
      return stripHtmlTags(item?.anilist?.description);
    }
  }, []);
  const getItemLayout =(data, index) => ({
      length: width,
      offset: width * index,
      index,
    })

  const onPressAnime = item => {
    navigation.navigate('anime-info', {
      id: item.animeId || item.animeID,
    });
  };
  const renderItem = useCallback(({item, i}) => {
    return (
      <TouchableOpacity
        style={styles.slider}
        activeOpacity={0.8}
        onPress={() => onPressAnime(item)}>
        <FastImage
          source={{uri: memoizedPoster(item)}}
          style={{flex: 1}}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={styles.overlay}>
          <LinearGradient
            colors={['transparent', color.DarkBackGround]}
            style={{paddingBottom: 10, gap: 5, paddingHorizontal:5}}>
            <Text numberOfLines={2} style={styles.rankText}>
              # {item?.rank}
            </Text>

            <Text numberOfLines={2} style={styles.titleText}>
              {memoizedTitle(item)}
            </Text>
            {/* <Text numberOfLines={3} style={styles.descText}>
              {memoizedDesc(item)}
            </Text> */}

          </LinearGradient>
        </View>
      </TouchableOpacity>
    );
  }, [refreshing]);
  
  useEffect(() => {
    // setInterval Bugs sometime in android
    if (currentIndex >= 0 && list?.length > 0) {
      const sid = setTimeout(() => {
        flatListRef?.current?.scrollToIndex({
          animated: true,
          index: currentIndex,
        });
        setCurrentIndex(prev => (prev < list.length - 1 ? prev + 1 : 0));
      }, setting.sliderIntervalTime || 5000);
      return () => clearTimeout(sid);
    }
  }, [currentIndex, list?.length]);

  if (isLoading) {
    return (
      <View
        style={{
          aspectRatio: 10/5,
          width: width,
          backgroundColor: color.LighterGray,
          marginBottom: 10,
        }}></View>
    );
  }

  if (error) {
    Alert.alert('error', error);
  }

  return (
    <View>
      <Text style={{fontFamily:font.OpenSansBold, color:color.White, paddingVertical:5, paddingHorizontal:5}}>Top 10</Text>
      <FlatList
        ref={flatListRef}
        horizontal={true}
        data={list}
        keyExtractor={(item, index) => `${item.animeID || item.animeId}`}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
      />
    </View>
  );
};

export default SliderGogotaku

const styles = StyleSheet.create({
  slider: {
    aspectRatio:10/5,
    width: width,
    position: 'relative',
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  titleText: {
    fontFamily: font.OpenSansBold,
    color: color.White,
    fontSize: 13,
  },
  rankText:{
    fontFamily: font.OpenSansBold,
    color: color.Orange,
    fontSize: 16,
  },
  descText: {
    fontFamily: font.OpenSansRegular,
    color: color.White,
    fontSize: 12,
  },
});
