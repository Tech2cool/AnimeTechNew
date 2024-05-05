import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {memo, useCallback, useMemo} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {MCIcon, MIcon, qualityPrefs} from '../../../../utils/contstant';
import Theme from '../../../../utils/Theme';
import {useVideoState} from '../../../../context/VideoStateContext';
const color = Theme.DARK;
const font = Theme.FONTS;
const QualitySetting = () => {
  const {videoState, setVideoState} = useVideoState();
  const {width, height} = Dimensions.get('window');

  const handleGOBack = () => {
    setVideoState({
      ...videoState,
      showSetting: true,
      showPlayBackRateSetting: false,
      showQualitySetting: false,
      showSubtitleSetting: false,
    });
  };
  const handleQualityChange = track => {
    setVideoState({
      ...videoState,
      selectedSubtitle: track,
    });
  };
  return (
    videoState.showSubtitleSetting && (
      <View style={[styles.container]}>
        <TouchableOpacity
          onPress={handleGOBack}
          style={[
            styles.Btn,
            {
              // borderBottomWidth:0.5,
              paddingHorizontal: 5,
            },
          ]}>
          <MIcon name="arrow-back-ios" size={20} color={color.White} />
          <Text style={styles.btnText}>Subtitles</Text>
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <ScrollView>
            {videoState.textTracks?.map((track, i) => (
              <TouchableOpacity
                key={track?.label + i}
                onPress={() => handleQualityChange(track)}
                style={[
                  styles.Btn,
                  {
                    backgroundColor:
                      videoState.selectedSubtitle.file === track?.file ? color.Orange : undefined,
                  },
                ]}>
                <MCIcon name={"closed-caption-outline"} size={28} color={color.White} />
                <Text style={[styles.btnText, {textTransform: 'uppercase'}]}>
                  {track?.label || "none"}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    flex: 1,
                  }}>
                  <Text style={[styles.btnText, {textTransform: 'capitalize'}]}>
                    {track?.kind}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    )
  );
};

export default memo(QualitySetting);

const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 10,
    flex: 1,
    // overflow:"hidden"
  },
  Btn: {
    flexDirection: 'row',
    gap: 10,
    padding: 10,
    // justifyContent:"center",
    alignItems: 'center',
    borderBottomColor: color.LighterGray,
    // paddingVertical:10,
    borderRadius: 5,
  },
  btnText: {
    color: color.White,
    fontFamily: font.OpenSansMedium,
    fontSize: 15,
  },
});
