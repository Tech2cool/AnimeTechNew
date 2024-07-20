import {StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import FastImage from 'react-native-fast-image';
import Theme from '../utils/Theme';
import {useSettingControl} from '../context/SettingsControlContext';

const color = Theme.DARK;
const font = Theme.FONTS;
const HorizontalCard = ({item}) => {
  const {setting} = useSettingControl();

  const memoizedPoster = useMemo(() => {
    if (item?.animeImg) {
      return item.animeImg;
    }
  }, [item?.animeImg]);

  const memoizedTitle = useMemo(() => {
    if (setting.language === 'en') {
      if (item?.english) {
        return item?.english;
      } else if (item?.english_jp) {
        return item?.english_jp;
      }
    } else {
      if (item?.english_jp) {
        return item?.english_jp;
      } else if (item?.english) {
        return item?.english;
      }
    }
  }, [item?.english, item?.english_jp, setting.language]);

  const memoizedEpisodeNum = useMemo(() => {
    if (item?.episodeNum) {
      return 'Episode ' + item?.episodeNum;
    } else if (item?.number) {
      return 'Episode ' + item?.number;
    }
  }, [item?.episodeNum, item?.number]);

  const memoizedGogoId = useMemo(() => {
    if (item?.episodeIdGogo) {
      return (
        <Text numberOfLines={1} style={styles.cardText}>
          Anitaku
        </Text>
      );
    }
  }, [item?.episodeIdGogo]);

  const memoizedAniwatchId = useMemo(() => {
    if (item?.episodeIdAniwatch) {
      return (
        <Text numberOfLines={1} style={styles.cardText}>
          Aniwatch
        </Text>
      );
    }
  }, [item?.episodeIdAniwatch]);

  const memoizedAnilistId = useMemo(() => {
    if (item?.episodeIdAnilist) {
      return (
        <Text numberOfLines={1} style={styles.cardText}>
          AniList
        </Text>
      );
    }
  }, [item?.memoizedAnilistId]);

  const memoizedWatchTime = useMemo(() => {
    const time = Math.floor(
      (parseInt(item?.currentTime) / parseInt(item?.duration)) * 100,
    );
    if (isNaN(item?.currentTime) || isNaN(item?.duration) || isNaN(time)) {
      return 'Watched(0%)';
    }
    return `Watched(${time})%`;
  }, [item?.currentTime, item?.duration]);
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 5,
        marginVertical: 5,
        borderColor: color.LighterGray,
        borderWidth: 0.5,
        borderRadius: 5,
      }}>
      <View style={{width: 120, height: 110}}>
        <FastImage
          source={{uri: memoizedPoster}}
          style={{flex: 1}}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row', gap: 10, paddingVertical: 5}}>
          {memoizedGogoId}
          {memoizedAniwatchId}
          {memoizedAnilistId}
        </View>
        <Text numberOfLines={2} style={styles.titleText}>
          {memoizedTitle}
        </Text>
        <View style={{flexDirection: 'row', gap: 10}}>
          <Text numberOfLines={1} style={styles.episodeText}>
            {memoizedEpisodeNum}
          </Text>
          <Text
            numberOfLines={1}
            style={[styles.episodeText, {color: color.AccentGreen}]}>
            {memoizedWatchTime}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default HorizontalCard;

const styles = StyleSheet.create({
  titleText: {
    fontFamily: font.OpenSansMedium,
    color: color.White,
    fontSize: 13,
  },
  episodeText: {
    fontFamily: font.OpenSansMedium,
    color: color.Orange,
    fontSize: 13,
  },
  cardText: {
    borderColor: color.Orange,
    borderWidth: 1,
    fontFamily: font.OpenSansMedium,
    fontSize: 12,
    flex: 0,
    borderRadius: 10,
    padding: 5,
    color: color.Orange,
  },
});
