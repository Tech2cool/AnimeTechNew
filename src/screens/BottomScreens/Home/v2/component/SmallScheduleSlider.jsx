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
import {
  convertToAMPM,
  stripHtmlTags,
} from '../../../../../utils/HelperFunctions';
import LinearGradient from 'react-native-linear-gradient';
import {MCIcon} from '../../../../../utils/contstant';
import {useNavigation} from '@react-navigation/native';
import {useSettingControl} from '../../../../../context/SettingsControlContext';
import {fetchScheduleAniwatch} from '../../../../../Query/v2';
import moment from 'moment';
const {width, height} = Dimensions.get('window');
const color = Theme.DARK;
const font = Theme.FONTS;
const date = new Date();
const todayDate = date?.toISOString()?.split('T')[0];

const SmallScheduleSlider = ({refreshing}) => {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const {setting} = useSettingControl();
  const {data, isLoading, error} = useQuery({
    queryKey: ['aniwatch_schedule', todayDate, , refreshing],
    queryFn: () => fetchScheduleAniwatch({date: todayDate}),
  });
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
              style={{paddingBottom: 10, gap: 5, paddingHorizontal: 5}}>
              <Text numberOfLines={2} style={styles.titleText}>
                {memoizedTitle(item)}
              </Text>
              <View style={{flexDirection: 'row', gap: 10}}>
                <Text style={styles.Time}>{convertToAMPM(item?.time)}</Text>
                <Text style={styles.TimeDate}>
                  {moment(`${item?.date} ${item?.time}`).fromNow()}
                  {/* {`${item?.date} ${item?.time}`} */}
                </Text>
              </View>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      );
    },
    [refreshing, setting.language,isLoading],
  );

  useEffect(() => {
    // setInterval Bugs sometime in android
    if (currentIndex >= 0 && data?.list?.length > 0) {
      const sid = setTimeout(() => {
        flatListRef?.current?.scrollToIndex({
          animated: true,
          index: currentIndex,
        });
        setCurrentIndex(prev => (prev < data?.list.length - 1 ? prev + 1 : 0));
      }, setting.sliderIntervalTime || 5000);
      return () => clearTimeout(sid);
    }
  }, [currentIndex, data?.list?.length]);

  if (isLoading) {
    return (
      <View
        style={{
          aspectRatio: 9 / 11,
          width: width,
          backgroundColor: color.LighterGray,
          marginBottom: 10,
        }}></View>
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
        data={data?.list}
        keyExtractor={(item, index) => `${item.id}`}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
      />
    </View>
  );
};

export default SmallScheduleSlider;

const styles = StyleSheet.create({
  slider: {
    aspectRatio: 16 / 5,
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
  Time: {
    fontFamily: font.OpenSansBold,
    fontSize: 18,
    color: color.White,
    textTransform: 'uppercase',
    alignSelf: 'flex-end',
  },
  TimeDate: {
    fontFamily: font.OpenSansBold,
    fontSize: 16,
    color: color.Orange,
    textTransform: 'capitalize',
    alignSelf: 'flex-end',
  },
});
