import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useVideoPlayer } from '../../../../contexts/VideoContext'
import { Slider } from '@react-native-assets/slider';
import Theme from '../../../../utils/Theme';
const color = Theme.DARK
const font = Theme.FONTS

const SilderComp = ({handleSliderValueChange, }) => {
    const { VideoPlayer } = useVideoPlayer()

    return (
        <View>
            <Slider
                style={{ marginBottom: -10}}
                minimumValue={0}
                value={VideoPlayer.currentTime}
                maximumValue={VideoPlayer.duration}
                minimumTrackTintColor={color.Orange}
                maximumTrackTintColor={color.LightGray}
                trackHeight={3}
                thumbSize={0}
                thumbTintColor={color.Orange}
                onValueChange={handleSliderValueChange}
                slideOnTap={false}
            />

        </View>
    )
}

export default SilderComp

const styles = StyleSheet.create({})