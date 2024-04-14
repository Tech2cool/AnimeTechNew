import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from '@gorhom/bottom-sheet'
import Theme from '../../../../utils/Theme';
import { MCIcon } from '../../../../utils/contstant';
import SkeletonSlider from '../../../../components/SkeletonSlider';
const color = Theme.DARK;
const font = Theme.FONTS;

const VideoInfoBtnsComponent = ({
    prevBtnTitle="Prev", nextBtnTitle="Next", disableNextBtn=false, 
    disablePrevBtn=false, onPressNext, onPressPrev,
    onPressDownload, onPressShare, isLoading= false,
}) => {
  if(isLoading){
    return(
    <View style={[styles.container, {gap:5,}]}>
      <SkeletonSlider width={'25%'} height={40} borderRadius={10} opacity={1} />
      <SkeletonSlider width={'15%'} height={40} borderRadius={10} opacity={1} />
      <SkeletonSlider width={'15%'} height={40} borderRadius={10} opacity={1} />
      <SkeletonSlider width={'25%'} height={40} borderRadius={10} opacity={1} />
    </View>
    )
  }
  return (
    <View style={styles.container}>
        <TouchableOpacity style={[styles.nextPrevBtn,{borderColor:disablePrevBtn ? color.LightGray:color.Orange}]} onPress={onPressPrev} disabled={disablePrevBtn}>
            <Text style={[styles.nextPrevBtnText,{color:disablePrevBtn ? color.LightGray:color.Orange}]}>{prevBtnTitle}</Text>
        </TouchableOpacity>
        <View style={{flexDirection:"row", gap:10,}}>
            <TouchableOpacity
              style={styles.ExtraBtn}
              onPress={onPressDownload}>
              <MCIcon name="cloud-download" size={30} color={color.Orange} />
              <Text style={styles.ExtraBtnText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressShare}>
              <MCIcon name="share" size={30} color={color.Orange} />
              <Text style={styles.ExtraBtnText}>Share</Text>
            </TouchableOpacity>

        </View>
        <TouchableOpacity style={[styles.nextPrevBtn,{borderColor:disableNextBtn ? color.LightGray:color.Orange}]} onPress={onPressNext} disabled={disableNextBtn}>
            <Text style={[styles.nextPrevBtnText,{color:disableNextBtn ? color.LightGray:color.Orange}]}>{nextBtnTitle}</Text>
        </TouchableOpacity>

    </View>
  )
}

export default VideoInfoBtnsComponent

const styles = StyleSheet.create({
    container:{
        flexDirection:"row",
        justifyContent:'space-between',
        paddingHorizontal:5,
        paddingVertical:5,
    },
    nextPrevBtn: {
        padding: 10,
        minWidth: 70,
        borderColor: color.Orange,
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
      },
      nextPrevBtnText: {
        color: color.Orange,
        fontFamily: font.OpenSansMedium,
        fontSize: 13,
      },
      ExtraBtn: {
        justifyContent: 'center',
        alignItems: 'center',
      },    
      ExtraBtnText: {
        fontFamily: font.OpenSansRegular,
        fontSize: 12,
        color: color.Orange,
      },
    
})