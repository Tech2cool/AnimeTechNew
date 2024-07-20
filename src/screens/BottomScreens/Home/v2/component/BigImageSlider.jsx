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
import Theme from '../../../../../utils/Theme';

import FastImage from 'react-native-fast-image';
import {stripHtmlTags} from '../../../../../utils/HelperFunctions';
import LinearGradient from 'react-native-linear-gradient';
import {MCIcon} from '../../../../../utils/contstant';
import {useNavigation} from '@react-navigation/native';
import {useSettingControl} from '../../../../../context/SettingsControlContext';
import SkeletonSlider from '../../../../../components/SkeletonSlider';
const {width, height} = Dimensions.get('window');
const color = Theme.DARK;
const font = Theme.FONTS;
const BigImageSlider = ({refreshing, data, isLoading, error}) => {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const {setting} = useSettingControl();

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
    } else if (item?.poster) {
      return item.poster;
    }
  }, []);
  const memoizedTitle = useCallback(
    item => {
      if (setting.language === 'en') {
        if (item?.animeTitle?.english) {
          return item?.animeTitle?.english;
        } else if (item?.name) {
          return item?.name;
        } else if (item?.animeTitle?.english_jp) {
          return item?.animeTitle?.english_jp;
        } else if (item?.jname) {
          return item?.jname;
        }
      } else {
        if (item?.animeTitle?.english_jp) {
          return item?.animeTitle?.english_jp;
        } else if (item?.jname) {
          return item?.jname;
        } else if (item?.animeTitle?.english) {
          return item?.animeTitle?.english;
        } else if (item?.name) {
          return item?.name;
        }
      }
    },
    [setting.language],
  );

  const memoizedDesc = useCallback(item => {
    if (item?.AdditionalInfo?.synopsis) {
      return stripHtmlTags(item?.AdditionalInfo?.synopsis);
    } else if (item?.AdditionalInfo?.description) {
      return stripHtmlTags(item?.AdditionalInfo?.description);
    } else if (item?.anilist?.description) {
      return stripHtmlTags(item?.anilist?.description);
    } else if (item?.description) {
      return stripHtmlTags(item?.description);
    }
  }, []);
  const getItemLayout = (data, index) => ({
    length: width,
    offset: width * index,
    index,
  });

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
          <FastImage
            source={{uri: memoizedPoster(item)}}
            style={{flex: 1}}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.overlay}>
            <LinearGradient
              colors={['transparent', color.DarkBackGround]}
              style={{paddingBottom: 10, gap: 2, paddingHorizontal: 5}}>
              <Text
                style={[
                  styles.titleText,
                  {fontSize: 14, color: '#FFB6C1', textTransform: 'uppercase'},
                ]}>
                #{item?.rank} Spotlight
              </Text>

              <View
                style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
                <Text numberOfLines={2} style={styles.titleText}>
                  {memoizedTitle(item)}
                </Text>
              </View>
              <Text numberOfLines={3} style={styles.descText}>
                {memoizedDesc(item)}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 5,
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}>
                {item?.genres?.map((genre, i) => (
                  <View
                    key={i}
                    style={{
                      flexDirection: 'row',
                      gap: 5,
                      alignItems: 'center',
                    }}>
                    <MCIcon
                      name="star-three-points-outline"
                      color={color.White}
                      size={12}
                    />

                    <Text numberOfLines={3} style={styles.descText}>
                      {genre}
                    </Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      );
    },
    [refreshing, setting.language],
  );

  useEffect(() => {
    // setInterval Bugs sometime in android
    if (currentIndex >= 0 && data?.spotlightAnimes?.length > 0) {
      const sid = setTimeout(() => {
        flatListRef?.current?.scrollToIndex({
          animated: true,
          index: currentIndex,
        });
        setCurrentIndex(prev =>
          prev < data?.spotlightAnimes.length - 1 ? prev + 1 : 0,
        );
      }, setting.sliderIntervalTime || 5000);
      return () => clearTimeout(sid);
    }
  }, [currentIndex, data?.spotlightAnimes?.length]);

  if (isLoading) {
    return (
      <SkeletonSlider
        shimmerColors={[
          color.LighterGray,
          color.LighterGray,
          color.LighterGray,
        ]}
        width={width}
        style={{aspectRatio: 9 / 11, marginBottom: 10}}
      />
    );
  }

  if (error) {
    Alert.alert('error', error?.message);
  }

  return (
    <View>
      <FlatList
        ref={flatListRef}
        horizontal={true}
        data={data?.spotlightAnimes}
        keyExtractor={(item, index) => `${item.id + index}`}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
      />
    </View>
  );
};

export default BigImageSlider;

const styles = StyleSheet.create({
  slider: {
    aspectRatio: 9 / 11,
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
    color: color.Orange,
    fontSize: 14,
  },
  descText: {
    fontFamily: font.OpenSansRegular,
    color: color.White,
    fontSize: 11,
  },
});
