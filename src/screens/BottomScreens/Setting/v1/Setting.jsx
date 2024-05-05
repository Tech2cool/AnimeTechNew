import {StyleSheet, Text, ScrollView, View, TouchableOpacity} from 'react-native';
import React from 'react';
import Theme from '../../../../utils/Theme';
import { AIcon, MCIcon, MIcon } from '../../../../utils/contstant';
const color = Theme.DARK;
const font = Theme.FONTS;

const Setting = ({navigation, route}) => {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.Btn}
        onPress={() => navigation.navigate('generalSetting')}>
        <AIcon name="appstore-o" size={25} color={color.White} />
        <Text style={styles.BtnText}>General</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.Btn}
        onPress={() => navigation.navigate('autoPlay')}>
        <MCIcon name="motion-play" size={25} color={color.White} />
        <Text style={styles.BtnText}>Auto-play</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.Btn}
        onPress={() => navigation.navigate('qualitySetting')}>
        <MIcon name="display-settings" size={25} color={color.White} />
        <Text style={styles.BtnText}>Video quality preferences</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

export default Setting;

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

});
