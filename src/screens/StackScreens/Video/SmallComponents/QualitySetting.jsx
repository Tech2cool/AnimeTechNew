import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {memo, useCallback, useMemo} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {MCIcon, MIcon, qualityPrefs} from '../../../../utils/contstant';
import Theme from '../../../../utils/Theme';
import {useVideoState} from '../../../../context/VideoStateContext';
const color = Theme.DARK;
const font = Theme.FONTS;
const QualitySetting = ({qualities, enableCCAniwatch}) => {
  const {videoState, setVideoState} = useVideoState();
  const {width, height} = Dimensions.get('window');

  const QualityIcon = useCallback(
    src => {
      if (
        src?.quality?.toLowerCase() === '360p' ||
        src?.quality?.toLowerCase() === '480p'
      ) {
        return 'quality-low';
      } else return 'quality-high';
    },
    [qualities],
  );
  const handleGOBack = () => {
    setVideoState({
      ...videoState,
      showSetting: true,
      showPlayBackRateSetting: false,
      showQualitySetting: false,
    });
  };
  const handleQualityChange = src => {
    if (src?.privder === 'aniwatch') {
      // enableCCAniwatch()
    }
    setVideoState({
      ...videoState,
      url: src?.url,
      quality: src?.quality?.toLowerCase(),
    });
  };
  return (
    videoState.showQualitySetting && (
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
          <Text style={styles.btnText}>Quality</Text>
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <ScrollView>
            {
              videoState?.videoTracks?.map((track,i)=>(
                <TouchableOpacity key={i} style={[styles.Btn,{
                  backgroundColor:
                    videoState.selectedVideoTrack.value === track.height ? color.Orange : undefined,
                },]} onPress={()=>{
                  setVideoState(prev=>({
                    ...prev,
                    selectedVideoTrack: {
                      type:"resolution",
                      value: track.height
                    },
                  }))
                  
                }}>
                  <Text style={styles.btnText}>{track?.height}</Text>
                </TouchableOpacity>
              ))
            }
            {/* {qualities?.map((src, i) => (
              <TouchableOpacity
                key={src?.quality + src?.provider + i}
                onPress={() => handleQualityChange(src)}
                style={[
                  styles.Btn,
                  {
                    backgroundColor:
                      videoState.url === src?.url ? color.Orange : undefined,
                  },
                ]}>
                <MCIcon name={QualityIcon(src)} size={28} color={color.White} />
                <Text style={[styles.btnText, {textTransform: 'uppercase'}]}>
                  {src?.quality === qualityPrefs._default
                    ? 'auto'
                    : src?.quality}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    flex: 1,
                  }}>
                  <Text style={[styles.btnText, {textTransform: 'capitalize'}]}>
                    {src?.provider}
                  </Text>
                </View>
              </TouchableOpacity>
            ))} */}
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
