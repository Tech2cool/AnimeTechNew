import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import Theme from '../utils/Theme';
const color = Theme.DARK;
const font = Theme.FONTS;
const EpisodeCard = ({item, anime, episodeId}) => {
  return (
    <View style={[styles.container,{backgroundColor:item?.id === episodeId? color.Orange:color.DarkBackGround}]}>
      <View style={{width: 130, height: 120}}>
        <FastImage
          source={{uri: anime?.animeImg}}
          style={{flex: 1}}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
      <View style={{flex: 1}}>
        <Text style={styles.infoText}>{!item?.title?.includes('EP')}</Text>
        <Text style={styles.infoText}>
          Episode {item?.number || item?.episodeNum}
        </Text>
        <Text style={[styles.infoText,{color:item?.id === episodeId?color.White:color.Orange}]}>{item?.isDub?"Dub":"Sub"}</Text>
      </View>
    </View>
  );
};

export default EpisodeCard;

const styles = StyleSheet.create({
  container: {
    height: 120,
    flexDirection: 'row',
    flex: 1,
    gap: 5,
    overflow: 'hidden',
    borderRadius: 5,
    borderColor: color.LighterGray,
    borderWidth: 0.5,
  },
  infoText: {
    fontFamily: font.OpenSansMedium,
    color: color.White,
  },
});
