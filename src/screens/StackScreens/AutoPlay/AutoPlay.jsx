import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import Theme from '../../../utils/Theme';
import { Switch, TouchableOpacity } from 'react-native-gesture-handler';
import { useVideoPlayer } from '../../../contexts/VideoContext';
import SelectDropdown from 'react-native-select-dropdown'
import { getAsyncData, setAsyncData } from '../../../utils/functions';
import { IIcon } from '../../../utils/contstant';

const color = Theme.DARK;
const font = Theme.FONTS;
const countries = [
    {
        name:"5 seconds",
        value:5,
    },
    {
        name:"10 seconds",
        value:10,
    },
    {
        name:"15 seconds",
        value:15,
    },
    {
        name:"20 seconds",
        value:20,
    },
    {
        name:"25 seconds",
        value:25,
    },
    {
        name:"30 seconds",
        value:30,
    },
]
const keyy = "autoPlay_key"
const AutoPlay = () => {
    const { VideoPlayer, setVideoPlayer } = useVideoPlayer()
    const toggleSwitch = () => {
        setVideoPlayer(prev => ({ ...prev, autoPlayNext: !VideoPlayer.autoPlayNext }));
        const data = {
            autoplay: !VideoPlayer.autoPlayNext,
            delay: VideoPlayer.autoPlayDelay,
        }
        setAsyncData(keyy, JSON.stringify(data))
    }
    const changeDelay = (delay) => {
        setVideoPlayer(prev => ({ ...prev, autoPlayDelay: delay }));
        const data = {
            autoplay: VideoPlayer.autoPlayNext,
            delay: delay,
        }
        setAsyncData(keyy, JSON.stringify(data))
    }

    const findCurrentDelay = ()=>{
        const resp = countries.find((item)=>parseInt(item.value) === parseInt(VideoPlayer.autoPlayDelay))
        // console.log(resp)
        // console.log(VideoPlayer.autoPlayDelay)
        return resp
    }
    // findCurrentDelay()
    // console.log()
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.Btn}>
                <Text style={styles.BtnText}>Auto-play next video</Text>
                <Text style={styles.SubBtnText}>When you finish watching a video, another plays automatically in {VideoPlayer.autoPlayDelay}s.</Text>
            </TouchableOpacity>
            <View style={[styles.Btn, { flexDirection: "row", justifyContent: "space-between" }]}>
                <Text style={[styles.BtnText, { fontFamily: font.OpenSansRegular }]}>Mobile/tablet</Text>
                <Switch value={VideoPlayer.autoPlayNext} onValueChange={toggleSwitch} />
            </View>
            <View style={{flexDirection:"row", gap:10, paddingHorizontal:10, justifyContent:"space-between"}}>
                <Text style={styles.BtnText}>Delay:</Text>
                <SelectDropdown
                    data={countries}
                    onSelect={(selectedItem, index) => {
                        // console.log(selectedItem, index)
                        changeDelay(selectedItem.value)
                    }}
                    renderDropdownIcon={()=><IIcon name="chevron-down" color={color.Orange} size={16} />}
                    buttonStyle={{
                        backgroundColor:color.DarkBackGround,
                        // borderColor:color.White,
                        borderRadius:5,
                        // borderWidth:0.5,
                        width:120,
                        height:30,
                        // alignItems:"flex-start",
                        // justifyContent:"flex-start"
                    }}
                    rowStyle={{backgroundColor:color.DarkBackGround, borderColor:"transparent"}}
                    rowTextStyle={{color:color.White, fontSize:14, textTransform:"lowercase"}}
                    buttonTextStyle={{color:color.Orange, textAlign:"right", fontSize:14, textTransform:"lowercase"}}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem.name
                    }}
                    defaultValue={findCurrentDelay()}
                    rowTextForSelection={(item, index) => {
                        return item.name
                    }}
                />

            </View>
        </View>
    )
}

export default AutoPlay

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.DarkBackGround,
    },
    Btn: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        gap: 2,
    },
    BtnText: {
        fontFamily: font.OpenSansMedium,
        color: color.White,
        fontSize: 16,
    },
    SubBtnText: {
        fontFamily: font.OpenSansMedium,
        color: color.LightGray,
        fontSize: 12,
    }
})