import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {MCIcon, MIcon, qualityPrefs} from '../../../../utils/contstant';
import Theme from '../../../../utils/Theme';
import {useVideoPlayer} from '../../../../contexts/VideoContext';
const color = Theme.DARK;
const font = Theme.FONTS;
const SettingCard = ({setShowSettingSheet}) => {
  const {VideoPlayer, setVideoPlayer} = useVideoPlayer();

  const handleQualityBtn = () => {
    setVideoPlayer({
      ...VideoPlayer,
      showSetting: false,
      showQualitySetting: true,
      showPlayBackRateSetting: false,
    });
  };

  const handlePlayBackRateBtn = () => {
    setVideoPlayer({
      ...VideoPlayer,
      showSetting: false,
      showPlayBackRateSetting: true,
      showQualitySetting: false,
    });
  };
  
  const handleResizeModeBtn = () => {
    setVideoPlayer({
      ...VideoPlayer,
      showSetting: false,
      showPlayBackRateSetting: false,
      showQualitySetting: false,
      showResizeSetting:true,
    });
  };
  const handleSubTitleBtn = () => {
    setVideoPlayer({
      ...VideoPlayer,
      showSetting: false,
      showPlayBackRateSetting: false,
      showQualitySetting: false,
      showResizeSetting:false,
      showSubtitle:true,
    });
  };


  return VideoPlayer.showSetting &&(
      <View>
        <TouchableOpacity style={[styles.Btn, {paddingHorizontal: 20, gap: 0}]} 
        onPress={()=> {
          setShowSettingSheet(false)
          setVideoPlayer({
            ...VideoPlayer,
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
                  {VideoPlayer.quality === qualityPrefs._default
                    ? 'Auto'
                    : VideoPlayer.quality}
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
                {VideoPlayer.playbackRate}x
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
                {VideoPlayer.resizeMode}
              </Text>
              <MIcon name="arrow-forward-ios" size={15} color={color.Orange} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.Btn,
              {flexDirection: 'row', justifyContent: 'space-between'},
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
                {VideoPlayer.resizeMode}
              </Text>
              <MIcon name="arrow-forward-ios" size={15} color={color.Orange} />
            </View>
          </TouchableOpacity>

        </View>
      </View>
  );
};

export default SettingCard;

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
