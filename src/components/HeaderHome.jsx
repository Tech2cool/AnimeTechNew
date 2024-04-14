import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Theme from '../utils/Theme';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useLanguage } from '../contexts/LanguageContext';
const color = Theme.DARK
const font = Theme.FONTS
const HeaderHome = () => {
    const{currentLang, toggleLanguage} = useLanguage()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AnT</Text>
      <TouchableOpacity style={styles.LangBtn} onPress={()=> toggleLanguage()}>
        <View style={currentLang ==="en"?styles.btnContainerActive:styles.btnContainer}>
            <Text 

            style={currentLang ==="en"?styles.LangTextActive:styles.LangText}>EN</Text>
        </View>
        <View style={currentLang ==="jp"?styles.btnContainerActive:styles.btnContainer}>
            <Text 
            style={currentLang ==="jp"?styles.LangTextActive:styles.LangText}>JP</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default HeaderHome

const styles = StyleSheet.create({
    container:{
        width:Dimensions.get("window").width,
        backgroundColor:"rgba(0,0,0,0.15)",
        position:"absolute",
        top:0,
        left:0,
        flexDirection:"row",
        justifyContent:"space-between",
        paddingHorizontal:10,
        zIndex:10
    },
    title:{
        color:color.Orange,
        fontFamily:font.MontserratBold,
        fontSize:20,
        backgroundColor:"rgba(0,0,0,0.1)",
    },
    LangBtn:{
        backgroundColor:"rgba(255,255,255,0.2)",
        flexDirection:"row",
        width:100,
        height:45,
        justifyContent:"space-between",
        alignItems:"center",
        // padding:10,
        borderRadius:99,
        padding:4,
        overflow:"hidden",
    },
    btnContainer:{
        height:"100%",
        width:"50%",
        // backgroundColor:"rgba(255,255,255,0.1)",
        justifyContent:"center",
        alignItems:"center",
        // borderRadius:99,
    },
    btnContainerActive:{
        height:"100%",
        width:"50%",
        backgroundColor:color.Orange,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:99,
    },
    LangText:{
        fontFamily:font.RobotoBold,
        color:color.White,
        fontSize:20,
        lineHeight:22,
        textTransform:"uppercase",
    },
    LangTextActive:{
        fontFamily:font.RobotoBold,
        color:color.White,
        fontSize:20,
        lineHeight:22,
        textTransform:"uppercase",
    }

})