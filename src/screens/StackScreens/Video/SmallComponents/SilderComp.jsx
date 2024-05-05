import {StyleSheet, Text, View} from 'react-native';
import React, { memo } from 'react';
import {Slider} from '@react-native-assets/slider';
import Theme from '../../../../utils/Theme';
import {useVideoState} from '../../../../context/VideoStateContext';
const color = Theme.DARK;
const font = Theme.FONTS;

const SilderComp = ({handleSliderValueChange, slideOnTap=false, props}) => {
  const {videoState} = useVideoState();

  return (
    <View>
      <Slider
        style={{marginBottom: -10}}
        minimumValue={0}
        value={videoState.currentTime}
        maximumValue={videoState.duration}
        minimumTrackTintColor={color.Orange}
        maximumTrackTintColor={color.LightGray}
        trackHeight={3}
        thumbSize={0}
        
        thumbTintColor={color.Orange}
        onValueChange={handleSliderValueChange}
        slideOnTap={slideOnTap}
        {...props}
      />
    </View>
  );
};

export default memo(SilderComp);

const styles = StyleSheet.create({});
