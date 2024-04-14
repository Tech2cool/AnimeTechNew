import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useMemo } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { MCIcon, MIcon } from '../../../../utils/contstant'
import Theme from '../../../../utils/Theme'
import { useVideoPlayer } from '../../../../contexts/VideoContext'
const color = Theme.DARK
const font = Theme.FONTS
const resizeList =[
  "none",
  "cover",
  "contain",
  "stretch",
]
const ResizeModeSetting = ({setResizeVideo}) => {
  const { VideoPlayer, setVideoPlayer } = useVideoPlayer()

  const handleGOBack= ()=>{
    setVideoPlayer({
      ...VideoPlayer, 
      showSetting:true,
      showPlayBackRateSetting:false,
      showQualitySetting:false,
      showResizeSetting:false,
    })
  }

  return VideoPlayer.showResizeSetting &&(
    <View style={[styles.container]}>
      <TouchableOpacity 
      onPress={handleGOBack}
      style={[styles.Btn,{
      // paddingHorizontal:5,
      
      }]}>
        <MIcon name='arrow-back-ios' size={20} color={color.White}/>
        <Text style={styles.btnText}>Resize Mode</Text>

      </TouchableOpacity>
      <View style={{flex:1}}>
      <ScrollView>
      {
        resizeList?.map((resize)=>(
          <TouchableOpacity
          key={resize}
          onPress={()=>setResizeVideo(resize)}
          style={[styles.Btn,{
            backgroundColor:VideoPlayer.resizeMode === resize?color.Orange:undefined,
          }]}>
          <MCIcon name={"motion-play"} size={25} color={color.White}/>
          <Text style={[styles.btnText]}>{resize}</Text>
          </TouchableOpacity>
        ))
      }
      </ScrollView>

      </View>
    </View>
  )
}

export default ResizeModeSetting

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