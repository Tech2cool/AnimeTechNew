import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Theme from '../../../utils/Theme'
import { useQualityPref } from '../../../contexts/QualityPrefrenceContext';
import { AIcon, EntIcon, IIcon, MCIcon, MIcon, qualityPrefs } from '../../../utils/contstant';

const color = Theme.DARK;
const font = Theme.FONTS;
const Settings = ({navigation}) => {
  const {QualityPref, setQuality}= useQualityPref()
  return (
    <ScrollView style={styles.container}>
      
      <TouchableOpacity style={styles.Btn} onPress={()=> navigation.navigate("general")}>
        <AIcon name="appstore-o" size={25} color={color.White}/>
        <Text style={styles.BtnText}>General</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.Btn} onPress={()=> navigation.navigate("autoPlay")}>
        <MCIcon name="motion-play" size={25} color={color.White}/>
        <Text style={styles.BtnText}>Auto-play</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.Btn} onPress={()=> navigation.navigate("qualityPref")}>
        <MIcon name="display-settings" size={25} color={color.White}/>
        <Text style={styles.BtnText}>Video quality preferences</Text>
      </TouchableOpacity>
      <View style={{borderBottomColor:color.LighterGray, borderBottomWidth:0.5}}></View>
      <TouchableOpacity style={styles.Btn} onPress={()=> navigation.navigate("scheduleWeekly")}>
        <MIcon name="schedule" size={25} color={color.White}/>
        <Text style={styles.BtnText}>Weekly Anime Schedule</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default Settings

const styles = StyleSheet.create({
  container:{
    backgroundColor:color.DarkBackGround,
    flex:1,
    paddingVertical:10,
  },
  Btn:{
    // borderColor:color.LighterGray,
    // borderWidth:0.2,
    paddingVertical:10,
    paddingHorizontal:10,
    // borderRadius:10,
    marginVertical:4,
    flexDirection:"row",
    gap:10,
  },
  BtnText:{
    color:color.White,
    fontFamily:font.OpenSansMedium,
    textTransform:"capitalize",
    fontSize:16,
  }
})