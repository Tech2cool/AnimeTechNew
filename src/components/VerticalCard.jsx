import {StyleSheet, Text, View} from 'react-native';
import React, {memo, useMemo} from 'react';
import FastImage from 'react-native-fast-image';
import {stripHtmlTags} from '../utils/HelperFunctions';
import Theme from '../utils/Theme';
import {useSettingControl} from '../context/SettingsControlContext';
const color = Theme.DARK;
const font = Theme.FONTS;
const VerticalCard = ({
  item,
  width = undefined,
  height = undefined,
  moreheight = false,
  showEpisode= false,
}) => {
  const {setting} = useSettingControl();

  const memoizedPoster = useMemo(() => {
    if (item?.animeImg) {
      return item.animeImg;
    } else if (item?.AdditionalInfo?.posterImage?.large) {
      return item?.AdditionalInfo?.posterImage?.large;
    } else if (item?.AdditionalInfo?.posterImage?.medium) {
      return item?.AdditionalInfo?.posterImage?.medium;
    } else if (item?.AdditionalInfo?.posterImage?.original) {
      return item?.AdditionalInfo?.posterImage?.original;
    } else if (item?.anilist?.coverImage?.large) {
      return item?.anilist?.coverImage?.large;
    } else if (item?.poster) {
      return item?.poster;
    }
  }, [item?.animeImg, item?.poster]);

  const memoizedTitle = useMemo(() => {
    if (setting.language === 'en') {
      if (item?.animeTitle?.english) {
        return item?.animeTitle?.english;
      } else if (item?.animeTitle?.english_jp) {
        return item?.animeTitle?.english_jp;
      } else if (item?.name) {
        return item?.name;
      }
      else if (item?.jname) {
        return item?.jname;
      }

    } else {
      if (item?.animeTitle?.english_jp) {
        return item?.animeTitle?.english_jp;
      } 
      else if (item?.jname) {
        return item?.jname;
      }
      else if (item?.animeTitle?.english) {
        return item?.animeTitle?.english;
      } else if (item?.name) {
        return item?.name;
      }
    }
  }, [
    item?.animeTitle?.english,
    item?.animeTitle?.english_jp,
    setting.language,
    item?.name,
  ]);

  const memoizedDesc = useMemo(() => {
    if (item?.AdditionalInfo?.synopsis) {
      return stripHtmlTags(item?.AdditionalInfo?.synopsis);
    } else if (item?.AdditionalInfo?.description) {
      return stripHtmlTags(item?.AdditionalInfo?.description);
    } else if (item?.anilist?.description) {
      return stripHtmlTags(item?.anilist?.description);
    }
  }, []);

  const memoizedEpisodeNum = useMemo(() => {
    if(showEpisode || item?.episodeNum){
      if (item?.episodeNum) {
        return 'Episode ' + item?.episodeNum;
      } else if (item?.number) {
        return 'Episode ' + item?.number;
      } else if (item?.episodes?.sub) {
        return 'Episode ' + item?.episodes?.sub;
      } else if (item?.episodes?.dub) {
        return 'Episode ' + item?.episodes?.dub;
      }
  
    }
  }, [
    item?.episodeNum,
    item?.number,
    item?.episodes?.sub,
    item?.episodes?.dub,
    showEpisode,
  ]);

  const memoizedYear = useMemo(() => {
    if (item?.year) {
      return 'Released: ' + item?.year;
    } else if (item?.releasedDate) {
      return 'Released: ' + item?.releasedDate;
    } else if (item?.released) {
      return 'Released: ' + item?.released;
    }
  }, [item?.year, item?.releasedDate, item?.released]);

  const memoizedDub = useMemo(() => {
    if (item?.isDub === true) {
      return 'Dub';
    } else if (item?.isDub === false) {
      return 'Sub';
    }
  }, [item?.isDub]);

  const memoizedWaitingStatus = useMemo(() => {
    if (item?.req_status) {
      return (
        <Text numberOfLines={1} style={styles.cardText}>
          {item?.req_status}
        </Text>
      );
    }
  }, [item?.req_status]);

  const memoizedType = useMemo(() => {
    if (item?.type) {
      return (
        <Text
          numberOfLines={1}
          style={[
            styles.cardText,
            {
              borderColor: color.Orange,
              color: color.Orange,
            },
          ]}>
          {item?.type}
        </Text>
      );
    }
  }, [item?.type]);

  const memoizedRating = useMemo(() => {
    if (item?.rating) {
      return (
        <Text
          numberOfLines={1}
          style={[
            styles.cardText,
            {
              borderColor: color.Red,
              color: color.Red,
            },
          ]}>
          {item?.rating}
        </Text>
      );
    }
  }, [item?.rating]);

  const memoizedRank = useMemo(() => {
    if (item?.rank) {
      return (
        <Text
          numberOfLines={1}
          style={[
            styles.cardText,
            {
              borderColor: color.Red,
              color: color.Red,
            },
          ]}>
          #{item?.rank}
        </Text>
      );
    }
  }, [item?.rank]);


  return (
    <View
      style={{
        flex: 1,
        width: width ? width : 145,
        height: height ? height : 210,
        position: 'relative',
        borderRadius: 5,
        overflow: 'hidden',
        borderColor: color.LighterGray,
        borderWidth: 0.4,
      }}>
      <FastImage source={{uri: memoizedPoster}} style={{flex: 1}} />
      <View style={[styles.overlay, {height: moreheight ? '40%' : '30%'}]}>
        <Text numberOfLines={moreheight ? 4 : 2} style={styles.titleText}>
          {memoizedTitle}
        </Text>
        <Text numberOfLines={1} style={styles.episodeText}>
          {memoizedEpisodeNum}
          {memoizedYear}
        </Text>
      </View>
      <View
        style={{
          position: 'absolute',
          top: 2,
          right: 2,
          borderColor: color.Orange,
          borderWidth: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          padding: 5,
          borderRadius: 10,
          opacity: item?.isDub !== undefined ? 1 : 0,
        }}>
        <Text style={styles.episodeText}>{memoizedDub}</Text>
      </View>
      <View
        style={{
          position: 'absolute',
          top: 2,
          right: 2,
          backgroundColor: 'rgba(0,0,0,0.4)',
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          opacity:item?.type !== undefined ? 1:0
        }}>
        {memoizedType}
      </View>

      <View
        style={{
          position: 'absolute',
          top: 2,
          right: 2,
          backgroundColor: 'rgba(0,0,0,0.4)',
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          opacity:item?.req_status !== undefined ? 1:0
        }}>
        {memoizedWaitingStatus}
      </View>

      <View
        style={{
          position: 'absolute',
          top: 2,
          left: 2,
          backgroundColor: 'rgba(0,0,0,0.4)',
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          opacity:item?.rating !== undefined ? 1:0
        }}>
        {memoizedRating}
      </View>

      <View
        style={{
          position: 'absolute',
          top: 2,
          left: 2,
          backgroundColor: 'rgba(0,0,0,0.4)',
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          opacity:item?.rank !== undefined ? 1:0
        }}>
        {memoizedRank}
      </View>

    </View>
  );
};

export default memo(VerticalCard);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  titleText: {
    fontFamily: font.OpenSansMedium,
    fontSize: 13,
    color: color.White,
    textAlign: 'center',
  },
  episodeText: {
    fontFamily: font.OpenSansBold,
    fontSize: 13,
    color: color.Orange,
    textAlign: 'center',
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
    textAlign: 'center',
  },
});
