import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useMemo } from 'react'
// import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
// import { MCIcon, MIcon } from '../../../../utils/contstant'
import Theme from '../../../../utils/Theme'
// import { useVideoPlayer } from '../../../../contexts/VideoContext'
const color = Theme.DARK
const font = Theme.FONTS
const TextTrackSheet = () => {
  // const { VideoPlayer, setVideoPlayer } = useVideoPlayer()

  // const handleGOBack= ()=>{
  //   setVideoPlayer({
  //     ...VideoPlayer, 
  //     showSetting:true,
  //     showPlayBackRateSetting:false,
  //     showQualitySetting:false,
  //     showSubtitle:false,
  //   })
  // }
  // console.log(VideoPlayer?.textTracks?.length)
  return (
    <View>
      <Text>Substitles</Text>
      {/* <TouchableOpacity 
      onPress={handleGOBack}
      style={[styles.Btn,{
      // paddingHorizontal:5,
      
      }]}>
        <MIcon name='arrow-back-ios' size={20} color={color.White}/>
        <Text style={styles.btnText}>Subtiltes</Text>

      </TouchableOpacity> */}
      {/* <View style={{flex:1}}>
      <ScrollView>
      {
        VideoPlayer?.textTracks?.length <=0?(<><Text>No Subtitles</Text></>):(
          VideoPlayer?.textTracks?.map((track)=>(
            <TouchableOpacity 
            key={track?.index}
            // onPress={()=>setVideoPlayer({...VideoPlayer, showSubtitle:track})}
            // style={[styles.Btn,{
            //   backgroundColor:VideoPlayer.playbackRate === track?color.Orange:undefined,
            // }]}
            >
            <MCIcon name={"motion-play"} size={25} color={color.White}/>
            <Text style={[styles.btnText]}>{track?.index}</Text>
            <Text style={[styles.btnText]}>{track?.title}</Text>
            <Text style={[styles.btnText]}>{track?.type}</Text>
            </TouchableOpacity>
          ))
        )
      }
      <Text>testing</Text>
      </ScrollView>

      </View> */}
    </View>
  )
}

export default TextTrackSheet

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