import {StyleSheet, Text, View} from 'react-native';
import React, { memo } from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {MCIcon, MIcon, qualityPrefs} from '../../../../utils/contstant';
import Theme from '../../../../utils/Theme';
import { useVideoState } from '../../../../context/VideoStateContext';
const color = Theme.DARK;
const font = Theme.FONTS;
const SettingCard = ({setShowSettingSheet}) => {
  const {videoState, setVideoState} = useVideoState();

  const handleQualityBtn = () => {
    setVideoState({
      ...videoState,
      showSetting: false,
      showQualitySetting: true,
      showPlayBackRateSetting: false,
      showSubtitleSetting:false,
    });
  };

  const handlePlayBackRateBtn = () => {
    setVideoState({
      ...videoState,
      showSetting: false,
      showPlayBackRateSetting: true,
      showQualitySetting: false,
      showSubtitleSetting:false,

    });
  };
  
  const handleResizeModeBtn = () => {
    setVideoState({
      ...videoState,
      showSetting: false,
      showPlayBackRateSetting: false,
      showQualitySetting: false,
      showResizeSetting:true,
      showSubtitleSetting:false,

    });
  };
  const handleSubTitleBtn = () => {
    setVideoState({
      ...videoState,
      showSetting: false,
      showPlayBackRateSetting: false,
      showQualitySetting: false,
      showResizeSetting:false,
      showSubtitleSetting:true,
    });
  };


  return videoState.showSetting &&(
      <View>
        <TouchableOpacity style={[styles.Btn, {paddingHorizontal: 20, gap: 0}]} 
        onPress={()=> {
          setShowSettingSheet(false)
          setVideoState({
            ...videoState,
            showSetting: false,
            showPlayBackRateSetting: false,
            showQualitySetting: false,
          });
      
        }}>
          <MIcon name="arrow-back-ios" size={20} color={color.White} />
          <Text style={styles.btnText}>Setting</Text>
        </TouchableOpacity>
        <View
          style={{
            gap: 10,
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}>
          <TouchableOpacity style={styles.Btn} onPress={handleQualityBtn}>
            <MCIcon name="quality-high" size={25} color={color.White} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
                gap: 10,
              }}>
              <Text style={styles.btnText}>Quality</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                }}>
                <Text
                  style={[
                    styles.btnText,
                    {color: color.Orange, fontFamily: font.OpenSansBold},
                  ]}>
                  {videoState.quality === qualityPrefs._default
                    ? 'Auto'
                    : videoState.quality}
                </Text>
                <MIcon
                  name="arrow-forward-ios"
                  size={15}
                  color={color.Orange}
                />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.Btn,
              {flexDirection: 'row', justifyContent: 'space-between'},
            ]}
            onPress={handlePlayBackRateBtn}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
              <MCIcon name="play-speed" size={25} color={color.White} />
              <Text style={styles.btnText}>PlayBack Rate</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
              <Text
                style={[
                  styles.btnText,
                  {color: color.Orange, fontFamily: font.OpenSansBold},
                ]}>
                {videoState.playbackRate}x
              </Text>
              <MIcon name="arrow-forward-ios" size={15} color={color.Orange} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.Btn,
              {flexDirection: 'row', justifyContent: 'space-between'},
            ]}
            onPress={handleResizeModeBtn}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
              <MCIcon name="resize" size={25} color={color.White} />
              <Text style={styles.btnText}>Resize Mode</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
              <Text
                style={[
                  styles.btnText,
                  {color: color.Orange, fontFamily: font.OpenSansBold},
                ]}>
                {videoState.resizeMode}
              </Text>
              <MIcon name="arrow-forward-ios" size={15} color={color.Orange} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            // disabled={true}
            style={[
              styles.Btn,
              {flexDirection: 'row', justifyContent: 'space-between',},
            ]}
            onPress={handleSubTitleBtn}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
              <MCIcon name="subtitles" size={25} color={color.White} />
              <Text style={styles.btnText}>SubTitle</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
              <Text
                style={[
                  styles.btnText,
                  {color: color.Orange, fontFamily: font.OpenSansBold},
                ]}>
                {videoState?.selectedSubtitle.label || "none"}
              </Text>
              <MIcon name="arrow-forward-ios" size={15} color={color.Orange} />
            </View>
          </TouchableOpacity>

        </View>
      </View>
  );
};

export default memo(SettingCard);

const styles = StyleSheet.create({

  Btn: {
    flexDirection: 'row',
    gap: 10,
    // justifyContent:"center",
    alignItems: 'center',
    borderBottomColor: color.LighterGray,
    paddingVertical: 2,
  },
  btnText: {
    color: color.White,
    fontSize: 15,
  },
});
