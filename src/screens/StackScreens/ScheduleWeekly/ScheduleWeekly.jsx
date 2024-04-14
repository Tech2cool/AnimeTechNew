import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  convertToAMPM,
  fetchScheduleWeekly,
  fetchTodaySchedule,
} from '../../../utils/functions';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Theme from '../../../utils/Theme';
import FastImage from 'react-native-fast-image';
import {useLanguage} from '../../../contexts/LanguageContext';
import moment from 'moment';
import Clock from 'react-live-clock';
import SkeletonSlider from '../../../components/SkeletonSlider';
import {useQuery} from '@tanstack/react-query';
import { AIcon, MCIcon } from '../../../utils/contstant';
import DropDownSelect from '../AnimeInfo/SmallComponents/DropDownSelect';
import SelectDropdown from 'react-native-select-dropdown';

const date = new Date();
const weekday = date.toLocaleDateString(undefined, {weekday: 'long'});
const color = Theme.DARK;
const font = Theme.FONTS;
const {width} = Dimensions.get('window');
const getTimeDifference = time => {
  const currentTime = new Date();

  const [hours, minutes] = time?.split(':')?.map(Number);
  const targetTime = new Date(currentTime);
  targetTime?.setHours(hours);
  targetTime?.setMinutes(minutes);
  const differenceInMs = targetTime - currentTime;
  return differenceInMs / (1000 * 60); // Convert milliseconds to minutes
};
const months = [
  {
    month_digit:1,
    month:"January",
  },
  {
    month_digit:2,
    month:"February",
  },    
  {
    month_digit:3,
    month:"March",
  },
  {
    month_digit:4,
    month:"April",
  },
  {
    month_digit:5,
    month:"May",
  },
  {
    month_digit:6,
    month:"June",
  },
  {
    month_digit:7,
    month:"July",
  },
  {
    month_digit:8,
    month:"August",
  },
  {
    month_digit:9,
    month:"September",
  },
  {
    month_digit:10,
    month:"October",
  },
  {
    month_digit:11,
    month:"November",
  },
  {
    month_digit:12,
    month:"December",
  },
]
const currentDay = {
  day: date.getDate(),
  weekday: date.toLocaleDateString(undefined, {
    weekday: 'long',
  }),
  weekday_short: date.toLocaleDateString(undefined, {
    weekday: 'short',
  }),
  date: date.toISOString().split('T')[0],
  year: date.getFullYear(),
  month: date.toLocaleDateString(undefined, {month: 'long'}),
  month_digit: date.getMonth()+1,
};
// console.log(currentDay)
const ScheduleWeekly = ({navigation}) => {
  const {currentLang} = useLanguage();
  const [dates, setDates] = useState(
    getDaysInMonth(date.getMonth(), date.getFullYear()),
  );
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [nextMonth, setNextMonth] = useState(currentDay.month_digit+1 );
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState({
    month_digit:parseInt(currentDay.month_digit),
    month:currentDay.month
  });
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // fetchairing(1)
    fetchSchedule();

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const weekdayRef = useRef(null);

  const fetchSchedule = async date_to_Fetch => {
    try {
      const resp = await fetchTodaySchedule(date_to_Fetch);
      return resp;
    } catch (error) {}
  };
  const {
    data: schedule,
    isLoading:loading,
    error,
  } = useQuery({
    queryKey: ['schedule', selectedDay.date, dates, refreshing],
    queryFn: () => fetchSchedule(selectedDay.date),
  });

  function getDaysInMonth(month, year) {
    var date = new Date(year, month, 1);
    var days = [];
    // let endingMonth = false;
    // if (date.getDate() >= 28) endingMonth = true;
    while (date.getMonth() === month) {
      days.push({
        day: new Date(date).getDate(),
        weekday: new Date(date).toLocaleDateString(undefined, {
          weekday: 'long',
        }),
        weekday_short: new Date(date)?.toLocaleDateString(undefined, {
          weekday: 'short',
        }),
        date: new Date(date).toISOString().split('T')[0],
        year: new Date(date).getFullYear(),
        month: new Date(date).toLocaleDateString(undefined, {month: 'long'}),
        month_digit: new Date(date).getMonth()+1,
        month_short: new Date(date).toLocaleDateString(undefined, {month:"short"}),
      });
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  useEffect(() => {
    const datee = getDaysInMonth(date.getMonth(), date.getFullYear());
    setDates(datee);
  }, [navigation]);

  const memoizedPoster = useCallback(
    anime => {
      if (anime?.animeImg) {
        return anime?.animeImg;
      } else if (anime?.AdditionalInfo?.posterImage?.original) {
        return anime?.AdditionalInfo?.posterImage?.original;
      } else if (anime?.AdditionalInfo?.posterImage?.large) {
        return anime?.AdditionalInfo?.posterImage?.large;
      } else if (anime?.AdditionalInfo?.posterImage?.medium) {
        return anime?.AdditionalInfo?.posterImage?.medium;
      } else if (anime?.AdditionalInfo?.posterImage?.small) {
        return anime?.AdditionalInfo?.posterImage?.small;
      } else if (anime?.AdditionalInfo?.posterImage?.tiny) {
        return anime?.AdditionalInfo?.posterImage?.tiny;
      } else {
        return 'https://cdn1.vectorstock.com/i/1000x1000/32/45/no-image-symbol-missing-available-icon-gallery-vector-45703245.jpg';
      }
    },
    [schedule],
  );

  const memoizedAnimeTitle = useCallback(
    anime => {
      if (currentLang === 'en') {
        if (anime?.filterList?.animeTitle?.english) {
          return anime?.filterList?.animeTitle?.english;
        } else if (anime?.english) {
          return anime?.english;
        } else if (anime?.filterList?.animeTitle?.english_jp) {
          return anime?.filterList?.animeTitle?.english_jp;
        } else if (anime?.english) {
          return anime?.english_jp;
        }
      } else {
        if (anime?.filterList?.animeTitle?.english_jp) {
          return anime?.filterList?.animeTitle?.english_jp;
        } else if (anime?.filterList?.animeTitle?.japanese) {
          return anime?.filterList?.animeTitle?.japanese;
        }
      }
    },
    [schedule, currentLang],
  );

  const goToVideo = useCallback(id => {
    navigation.navigate('anime-info', {
      animeId: id,
    });
  }, []);

  const renderItem = useCallback(({item}) => {
    return (
      <TouchableOpacity
        style={[styles.tchb, {alignSelf: 'center'}]}
        onPress={() => goToVideo(item?.filterList?.animeID)}>
        <FastImage
          source={{uri: memoizedPoster(item?.filterList)}}
          style={styles.image}
        />
        <View
          style={{flex: 1, paddingHorizontal: 5, paddingVertical: 2, gap: 5}}>
          <Text numberOfLines={2} style={styles.Title}>
            {memoizedAnimeTitle(item)}
          </Text>
          <Text style={styles.Title}>{item?.episode}</Text>
          <Text style={styles.Time}>{convertToAMPM(item?.time)}</Text>
          <Text style={styles.TimeDate}>
            {moment(`${item?.date} ${item?.time}`).fromNow()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },[selectedDay])

  const findCrr = useCallback(() => {
    const ind = dates.findIndex(_d => _d?.day === selectedDay?.day);
    if (ind !== -1) {
      return ind;
    }
    return dates.length - 1;
  }, [selectedDay]);
  const getItemLayout = (data, index) => ({
    length: 55,
    offset: 55 * index,
    index,
  });

  return (
    <View style={styles.container}>
      <View style={{paddingVertical: 5}}>
        <FlatList
          data={dates}
          ref={weekdayRef}
          renderItem={({item, index}) => (
            <TouchableOpacity
              key={item?.day}
              onPress={() => {
                setSelectedDay(item);
              }}
              style={[
                styles.weekBtn,
                {
                  backgroundColor:
                    selectedDay?.day === item?.day
                      ? color.Orange
                      : color.DarkBackGround,
                },
              ]}>
              {/* <Text style={{color: selectedDay?.day === item?.day ?color.Black:color.AccentBlue, fontFamily:font.OpenSansBold}}>{item?.month_short}</Text> */}
              <Text style={{color:color.White, fontFamily:font.OpenSansMedium}}>{item?.weekday_short}</Text>
              <Text style={{color:color.White, fontFamily:font.OpenSansMedium}}>{item?.day}</Text>
            </TouchableOpacity>
          )}
          getItemLayout={getItemLayout}
          keyExtractor={(item, index) => `${index}-${item?.day}-${item?.month}`}
          horizontal={true}
          initialScrollIndex={findCrr()}
        />
        <View style={{flexDirection:"row", alignItems:"center", gap:5}}>
          <View style={{flex:1, height:1.5, backgroundColor:color.Orange}}>
          </View>
            <Text style={{color:color.Orange, fontFamily:font.OpenSansMedium}}>{currentDay.month}</Text>
            <View style={{flex:1, height:1.5, backgroundColor:color.Orange}}>
          </View>
        </View>
      </View>

      <View style={{flex: 1}}>
        {loading === true && <ActivityIndicator size={30} color={color.Red} />}
        <FlatList
          data={schedule}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${index}-${item?.aniwatch_id}`}
        />
      </View>
    </View>
  );
};

export default ScheduleWeekly;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // position: 'relative',
    backgroundColor: color.DarkBackGround,
    // alignItems: 'center',
    gap: 10,
  },
  weekBtn: {
    marginHorizontal: 5,
    paddingHorizontal:10,
    paddingVertical: 12,
    borderRadius: 30,
    maxWidth: 60,
    minWidth: 40,
    // backgroundColor: color.Orange,
    alignItems: 'center',
    borderColor: color.LighterGray,
    borderWidth: 0.5,
  },
  image: {
    width: 110,
    height: 125,
    resizeMode: 'cover',
  },
  headerContainer: {
    flexDirection: 'row',
    gap: 5,
    flexWrap: 'wrap',
    // justifyContent: 'center',
    paddingVertical: 10,
    // paddingHorizontal: 5,
    marginHorizontal: 1,
  },
  tchb: {
    borderColor: color.LighterGray,
    borderWidth: 0.5,
    width: width * 0.95,
    borderRadius: 5,
    flexDirection: 'row',
    marginVertical: 5,
  },
  Title: {
    fontFamily: font.OpenSansMedium,
    color: color.White,
  },
  // weekBtn: {
  //   padding: 10,
  //   borderColor: color.LighterGray,
  //   borderWidth: 0.5,
  //   borderRadius: 5,
  // },
  Time: {
    fontFamily: font.OpenSansBold,
    fontSize: 14,
    color: color.White,
    textTransform: 'uppercase',
  },
  TimeDate: {
    fontFamily: font.OpenSansBold,
    fontSize: 14,
    color: color.Orange,
    textTransform: 'capitalize',
  },
  rowTextStyle: {
    fontSize: 14,
    color: color.White,
    textTransform: 'uppercase',
  },
  selectedRowTextStyle: {
    fontSize: 16,
    color: color.White,
    textTransform: 'uppercase',
  },
  dropdownStyle: {
    borderRadius: 5,
    backgroundColor: color.DarkBackGround,
    elevation: 10,
    borderColor: color.LighterGray2,
    borderWidth: 0.2,
  },
  buttonTextStyle: {
    color: color.Orange,
    textTransform: 'uppercase',
    fontSize: 14,
    fontFamily: font.NunitoBlack,
  },
  buttonStyle: {
    width: 150,
    height: 20,
    backgroundColor: color.DarkBackGround,
  },
  rowStyle: {
    borderColor: 'transparent',
  },
  selectedRowStyle: {
    backgroundColor: color.Orange,
  },

});
