import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {TouchableOpacity} from '@gorhom/bottom-sheet';
import Theme from '../../../../utils/Theme';
import SkeletonSlider from '../../../../components/SkeletonSlider';
const color = Theme.DARK;
const font = Theme.FONTS;

const VideoDescComponent = ({title = '', episodeNum='', episodeInfo='', onPressTitle, isLoading = false}) => {
  if (isLoading) {
    return (
    <View style={styles.container}>
        <SkeletonSlider width={'95%'} height={18} opacity={1} />
        <SkeletonSlider width={'80%'} height={18} opacity={1} />

    </View>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressTitle}>
        <Text numberOfLines={2} style={styles.titleText}>{title}</Text>
      </TouchableOpacity>
      
      <View style={{flexDirection:"row", gap:5}}>
      <Text style={styles.episodeText}>Episode {episodeNum}</Text>
      <Text style={styles.episodeInfoText}>{episodeInfo}</Text>
      </View>

    </View>
  );
};

export default VideoDescComponent;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    gap:5,
  },
  titleText: {
    color: color.Orange,
    fontFamily: font.OpenSansBold,
    fontSize: 12,
  },
  episodeText:{
    color: color.White,
    fontFamily: font.OpenSansBold,
    fontSize: 13,
  },
  episodeInfoText:{
    color: color.White,
    fontFamily: font.OpenSansMedium,
    fontSize: 12,
  },

});
