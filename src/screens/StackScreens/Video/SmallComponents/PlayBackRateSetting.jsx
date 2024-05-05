import { StyleSheet, Text, View } from 'react-native'
import React, { memo } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { MCIcon, MIcon } from '../../../../utils/contstant'
import Theme from '../../../../utils/Theme'
import { useVideoState } from '../../../../context/VideoStateContext'
const color = Theme.DARK
const font = Theme.FONTS
const rates= [0.5,1.0,1.5,2.0,2.5,3.0,3.5,4.0,4.5,5.0,5.5,6.0,6.5,7.0,7.5,8.0]
const PlayBackRateSetting = () => {
  const { videoState, setVideoState } = useVideoState()

  const handleGOBack= ()=>{
    setVideoState({
      ...videoState, 
      showSetting:true,
      showPlayBackRateSetting:false,
      showQualitySetting:false,
    })
  }
  return videoState.showPlayBackRateSetting &&(
    <View style={[styles.container]}>
      <TouchableOpacity 
      onPress={handleGOBack}
      style={[styles.Btn,{
      // paddingHorizontal:5,
      
      }]}>
        <MIcon name='arrow-back-ios' size={20} color={color.White}/>
        <Text style={styles.btnText}>PlayBack Rate</Text>

      </TouchableOpacity>
      <View style={{flex:1}}>
      <ScrollView>
      {
        rates?.map((rate)=>(
          <TouchableOpacity 
          key={rate}
          onPress={()=>setVideoState({...videoState, playbackRate:rate})}
          style={[styles.Btn,{
            backgroundColor:videoState.playbackRate === rate?color.Orange:undefined,
          }]}>
          <MCIcon name={"motion-play"} size={25} color={color.White}/>
          <Text style={[styles.btnText]}>{rate}x</Text>
          </TouchableOpacity>
        ))
      }
      </ScrollView>

      </View>
    </View>
  )
}

export default memo(PlayBackRateSetting)

const styles = StyleSheet.create({
  container:{
    paddingHorizontal:10,
    gap:8,
    flex:1,
  },
  Btn:{
    flexDirection:"row",
    gap:10,
    paddingVertical:10,
    paddingHorizontal:10,
    // justifyContent:"center",
    alignItems:"center",
    borderBottomColor:color.LighterGray,
    // paddingVertical:10,
    borderRadius:5,
  },
  btnText:{
    color:color.White,
    fontFamily:font.OpenSansMedium,
    fontSize:15,
  }
})