import { View, Text, ActivityIndicator, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import Theme from '../../../utils/Theme'
import Animated, { FadeIn, FadeInRight, FadeOutLeft } from 'react-native-reanimated'
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient'
const color = Theme.DARK
const font = Theme.FONTS

const Splash = ({navigation, routes},params) => {
  const {isLoading} = params
  useEffect(()=>{
    setTimeout(() => {
      navigation.navigate("HomeStack")
    }, 2000);
  },[navigation])

  return (
    <View style={{
      flex:1, 
      backgroundColor:color.DarkBackGround, 
      flexDirection:"column",
      justifyContent:"center",
      gap:10, 
      alignItems:"center"
      }}>
      <Animated.Text 
      entering={FadeInRight.delay(1000)}
      exiting={FadeOutLeft.delay(1000)}
      style={{
        color:color.Orange, 
        fontFamily:font.OpenSansBold,
        fontSize:25
        }}>AnimeTech</Animated.Text>
      <Animated.Text 
      entering={FadeInRight.delay(1500)}
      exiting={FadeOutLeft.delay(1500)}

      style={{
        color:color.White, 
        fontFamily:font.OpenSansBold,
        fontSize:18
        }}>Anime Streaming App</Animated.Text>
        { isLoading && (
          <Animated.View entering={FadeIn.delay(1500)}>
            <ActivityIndicator size={40} color={color.Orange}/>
          </Animated.View>)
        }
    </View>
  )
}

export default Splash