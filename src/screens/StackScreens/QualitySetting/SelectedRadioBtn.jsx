import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Theme from '../../../utils/Theme';
const color = Theme.DARK;
const font = Theme.FONTS;

const SelectedRadioBtn = ({title, subTitle,selected=false,onPress}) => {
    return (
        <>
            <TouchableOpacity 
            onPress={onPress}
            style={{ overflow: "hidden",flexDirection:"row", justifyContent:"space-between",alignItems:"center"}}>
            
                <View style={{width:"90%"}}>
                <Text style={styles.Text}>{title}</Text>
                <Text style={styles.subText}>{subTitle}</Text>
                </View>
                <View style={{
                    width: 20,
                    height: 20,
                    borderRadius: 999,
                    borderColor: selected?color.AccentBlue:color.LightGray,
                    borderWidth: 2,
                    padding: 9,
                    overflow: "hidden",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <View
                        style={{
                            borderRadius: 999,
                            backgroundColor: selected?color.AccentBlue:undefined,
                            padding: 6,
                            overflow: "hidden"
                        }}></View>
                </View>
            </TouchableOpacity>
        </>
    )
}

export default SelectedRadioBtn

const styles = StyleSheet.create({
    Text:{
        fontFamily:font.OpenSansMedium,
        fontSize:14,
        color:color.White,
    },
    subText:{
        fontFamily:font.OpenSansRegular,
        fontSize:13,
        color:color.LightGray,
    }
})