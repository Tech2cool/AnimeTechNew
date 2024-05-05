import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)
import Theme from '../utils/Theme';
const color = Theme.DARK

const SkeletonSlider = ({width, height,opacity, borderRadius= undefined, shimmerColors,style}) => {
  return (
    <ShimmerPlaceholder 
        shimmerColors={shimmerColors?shimmerColors:[color.DarkGray,color.LighterGray, color.DarkGray]}
        shimmerStyle={{
            width:width, 
            height:height,
            opacity:opacity,
            borderRadius:borderRadius,
            overflow:"hidden",
            ...style
        }}
        >
    </ShimmerPlaceholder>
  )
}

export default SkeletonSlider

const styles = StyleSheet.create({})