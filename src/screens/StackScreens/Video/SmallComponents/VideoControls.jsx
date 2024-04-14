import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
// import { Slider } from 'react-native-awesome-slider';
import { IIcon, MCIcon, MIcon } from '../../../../utils/contstant';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { VidioDuration } from '../../../../utils/functions';
import Theme from '../../../../utils/Theme';
import { useNavigation } from '@react-navigation/native';
import SettingCard from './SettingCard'; 
import { Slider } from '@react-native-assets/slider'
import QualitySetting from './QualitySetting';
import PlayBackRateSetting from './PlayBackRateSetting';
import Ripple from "react-native-material-ripple"
import { Orientation } from 'react-native-video';

const color = Theme.DARK
const font = Theme.FONTS
const { width, height } = Dimensions.get("window")
const VideoControls = (params) => {
    const {
        handleSeekTo,
        handleOnFullScreen,
        setTapNumber,
        tapNumber,
        handleSliderValueChange,
        source,
        VideoPlayer,
        setVideoPlayer,
        handlePlayPause,
        episodeNum,
        memoizedAnimeTitle,
        setSettingSheetVisible,
        setCCVisibiltiy,
        handleNextEPBtn,
        handlePrevEpBtn,
        episodeLen,
    } = params;
    const navigation = useNavigation()
    // const { VideoPlayer, setVideoPlayer } = useVideoPlayer()
    const { currentTime, duration, fullscreen } = VideoPlayer
    const translationX = useSharedValue(0)
    const translationY = useSharedValue(0)
    const sidRef = useRef(null)
    const tapRef = useRef(null)
    // console.log("renderedd control")

    const memoizedtime = useMemo(() => {
        return `${VidioDuration(currentTime)}/${VidioDuration(duration)}`
    }, [currentTime, duration])

    useEffect(()=>{
        if(VideoPlayer.seeking){
            clearTimeout(tapRef.current)
            tapRef.current = setTimeout(() => {
                setVideoPlayer(prev=>({...prev, seeking:false}))
                setTapNumber(0)
            }, 1000);
        }
        // console.log(tapNumber) 
    },[tapNumber])
    // const tap = Gesture.Tap();
    const updateTap = () => {
        setTapNumber((value) => value + 1);
        setVideoPlayer(prev => ({
            ...prev,
            showControl: !prev.showControl,
            showSetting: false,
            showQualitySetting: false,
            showPlayBackRateSetting: false,
            seeking: tapNumber >= 2? true:false,
        }))
    }
    
    const tap = Gesture.Tap()
        .onStart(() => {
            runOnJS(updateTap)();
        })
        .onEnd((e) => {
            // console.log(e);
            // runOnJS(setTapNumber)(0)
        })


    const SeekBackward = () => {
        handleSeekTo(VideoPlayer.currentTime - parseInt(VideoPlayer.seekSecond))
        setTapNumber(prev=> prev+1)
        setVideoPlayer(prev => ({
            ...prev,
            seekTime: prev.seekTime - VideoPlayer.seekSecond,
            seekBackward: true,
        }))
        clearTimeout(sidRef.current)
        sidRef.current = setTimeout(() => {
            setTapNumber(0)
            setVideoPlayer(prev => ({
                ...prev,
                seekTime: 0,
                seekBackward: false,
                seeking: false,
            }))
        }, 300);

    }
    const SeekForward = () => {
        handleSeekTo(VideoPlayer.currentTime + parseInt(VideoPlayer.seekSecond))
        setTapNumber(prev=> prev+1)
        setVideoPlayer(prev => ({
            ...prev,
            seekTime: prev.seekTime + VideoPlayer.seekSecond,
            seekForward: true,
        }))
        clearTimeout(sidRef.current)
        sidRef.current = setTimeout(() => {
            setTapNumber(0)
            setVideoPlayer(prev => ({
                ...prev,
                seekTime: 0,
                seekForward: false,
                seeking: false,
            }))
        }, 300);
    }

    const pan = Gesture.Pan()
        .onStart((e) => {
            translationX.value = 0
        })
        .onUpdate((e) => {
            translationX.value = e.translationX
            translationY.value = e.translationY
        })
        .onEnd((e) => {
            if (e.translationY <= -20 && !VideoPlayer.fullscreen) {
                runOnJS(handleOnFullScreen)()
            }
            else if ((e.translationX < -3 && VideoPlayer.fullscreen) ||
                (e.translationY >= 20 && VideoPlayer.fullscreen)) {
                runOnJS(handleOnFullScreen)()
            }
            translationX.value = 0
        })

        const goBackFunc =async()=>{
            setVideoPlayer(prev => ({...prev, fullscreen: false}));
            navigation.goBack()
        }
    return (
        <>
            <View style={[styles.container]}>

                <GestureDetector gesture={Gesture.Exclusive(pan, tap)}>

                    <Animated.View style={[{
                        // flex:1, 
                        position: "absolute",
                        // backgroundColor:"red",
                        top: fullscreen ? 30 : 10,
                        left: 0,
                        right: 0,
                        bottom: fullscreen ? 40 : 30,
                    }]}>
                    </Animated.View>
                </GestureDetector>
                    {
                    VideoPlayer.seeking && (
                <>
                    <Ripple
                    width={"40%"}
                    rippleOpacity={0.5}
                    rippleColor={"rgba(255,255,255,.5)"}
                    // rippleContainerBorderRadius={150}
                    onPress={SeekBackward}
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        // backgroundColor:"red",
                        position:"absolute",
                        top:0,
                        left:0,
                        bottom:0,
                    }}
                    >
                    {VideoPlayer.seekBackward && (
                        <Text style={{ fontSize: 16, fontFamily: font.OpenSansBold, color: color.White }}>{VideoPlayer.seekTime}s</Text>
                    )}
                    </Ripple>
                    <Ripple
                    width={"40%"}
                    rippleOpacity={0.5}
                    rippleColor={"rgba(255,255,255,.5)"}
                    // rippleContainerBorderRadius={150}
                    onPress={SeekForward}
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        // backgroundColor:"red",
                        position:"absolute",
                        top:0,
                        right:0,
                        bottom:0,
                    }}
                    >
                    {VideoPlayer.seekForward && (
                        <Text style={{ fontSize: 16, fontFamily: font.OpenSansBold, color: color.White }}>{VideoPlayer.seekTime}s</Text>
                    )}
                    </Ripple>
                </>
                        )
                    }
                {
                    VideoPlayer.showControl && (
                        <View style={{ flex: 1, justifyContent: "space-between" }}>
                            <View style={styles.topContainer}>
                                <View style={{flexDirection:"row", gap:10,alignItems:"center"}}>
                                <TouchableOpacity onPress={goBackFunc}>
                                    <IIcon name={"arrow-back"} color={"white"} size={25} />
                                </TouchableOpacity>
                                <View style={{maxWidth:"75%"}}>
                                    <Text 
                                    numberOfLines={1} 
                                    style={{fontFamily:font.OpenSansMedium, color:color.White, fontSize:VideoPlayer.fullscreen?15:13}}>
                                        {`Episode ${episodeNum}-`} {memoizedAnimeTitle}</Text>
                                </View>
                                </View>
                                <View style={{flexDirection:"row", gap:5}}>
                                <TouchableOpacity onPress={() => {setCCVisibiltiy()}}>
                                    <MIcon name={VideoPlayer.selectedTextTrack?.type === "disabled"?"closed-caption-off":"closed-caption"} color={VideoPlayer.selectedTextTrack?.type === "disabled"?color.White:color.Orange} size={30} />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                onPress={() => {
                                setVideoPlayer(prev => ({ ...prev, showSetting: !VideoPlayer.showSetting }))
                                setSettingSheetVisible()}}
                                >
                                    <MCIcon name={"dots-vertical"} color={"white"} size={30} />
                                </TouchableOpacity>

                                </View>
                            </View>
                            <View style={styles.middleContainer}> 

                                <TouchableOpacity onPress={() => handleSeekTo(currentTime - parseInt(VideoPlayer.seekSecond))}>
                                    <MIcon name="replay-10" color={"white"} size={45} />
                                </TouchableOpacity>
                                {
                                    VideoPlayer.fullscreen &&(
                                    <TouchableOpacity onPress={handlePrevEpBtn}>
                                        <MIcon name="skip-previous" color={episodeNum  <= 1?color.LightGray: color.White} size={45} />
                                    </TouchableOpacity>    
                                    )
                                }
                                <TouchableOpacity onPress={handlePlayPause}>
                                    <IIcon name={VideoPlayer.paused ? "play-circle-outline" : "pause-circle-outline"} color={"white"} size={45} />
                                </TouchableOpacity>
                                {
                                    VideoPlayer.fullscreen &&(
                                    <TouchableOpacity onPress={handleNextEPBtn} disabled={episodeNum >= episodeLen}>
                                        <MIcon name="skip-next" color={episodeNum >= episodeLen?color.LightGray: color.White} size={45} />
                                    </TouchableOpacity>    
                                    )
                                }
                                <TouchableOpacity onPress={() => handleSeekTo(currentTime + parseInt(VideoPlayer.seekSecond))}>
                                    <MIcon name="forward-10" color={"white"} size={45} />
                                </TouchableOpacity>
          
                            </View>
                            <View style={[styles.bottomContainer, { marginBottom: fullscreen ? 20 : 0 }]}>
                                <View style={styles.timeAndFullscreen}>
                                    <Text style={styles.time}>{memoizedtime}</Text>
                                    <TouchableOpacity onPress={handleOnFullScreen}>
                                        <MIcon name={fullscreen ? "fullscreen-exit" : "fullscreen"} color={"white"} size={40} />
                                    </TouchableOpacity>
                                </View>
                                
                                <Slider
                                    style={{ paddingHorizontal: 5 }}
                                    minimumValue={0}
                                    value={VideoPlayer.currentTime}
                                    maximumValue={VideoPlayer.duration}
                                    minimumTrackTintColor={color.Orange}
                                    maximumTrackTintColor={color.LightGray}
                                    trackHeight={VideoPlayer.fullscreen ? 6 : undefined}
                                    thumbSize={VideoPlayer.fullscreen ? 15 : 12}
                                    thumbTintColor={color.Orange}
                                    onValueChange={handleSliderValueChange}
                                />
                            </View>
                        </View>
                    )
                }
                <View style={[styles.OverlaySetting]}>
                    {/* <SettingCard /> */}
                    {/* <QualitySetting qualities={source} /> */}
                    {/* <PlayBackRateSetting /> */}
                </View>
            </View>

        </>
    )
}

export default VideoControls

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        // backgroundColor: "gray",
        backgroundColor: "rgba(0,0,0,0.3)",
        flexDirection: "column",
        justifyContent: "space-between",
        maxHeight: "100%",
        maxWidth: "100%",
    },

    OverlaySetting: {
        position: "absolute",
        top: 5,
        right: 30,
        backgroundColor: color.DarkBackGround,
        // padding:10,
        flex: 1,
        borderColor: color.LighterGray,
        borderWidth: 0.5,
        borderRadius: 10,
        maxWidth: Dimensions.get("window").width / 2,
        overflow:"hidden"

    },
    topContainer: {
        // backgroundColor:color.Red,
        paddingHorizontal: 5,
        paddingVertical: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        // height:"20%",
        // flex:1,
    },
    middleContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        // backgroundColor:color.AccentBlue,
        // height:"60%",   
        flex: 0,
        alignSelf: "center"

    },
    bottomContainer: {
        // height:"20%",
        // justifyContent:"flex-end"
        // backgroundColor:"red",
        // padding:0,
    },
    timeAndFullscreen: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'flex-end',
        paddingHorizontal: 5,
        // backgroundColor:color.AccentGreen,
        // flex:1,

    },
    time: {
        color: color.White,
        fontFamily: font.OpenSansMedium,
        fontSize: 16,
        // paddingBottom:5,
    },
    sliderContainer: {
        paddingHorizontal: 4,
    },
    rippleContainerLeft: {
        // width:"100%",
        position: "absolute",
        // backgroundColor: "red",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        borderRadius: 99,
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",

    },
    rippleContainerRight: {
        width: "50%",
        position: "absolute",
        top: 0,
        right: -50,
        bottom: 0,
        // backgroundColor:"red",
        borderRadius: 999,
        overflow: "hidden",
    }
})