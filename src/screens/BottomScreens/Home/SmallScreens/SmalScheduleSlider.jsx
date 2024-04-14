import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { convertToAMPM, fetchTodaySchedule, fetchTopscheduleAnime } from '../../../../utils/functions'
import { useLanguage } from '../../../../contexts/LanguageContext'
import Theme from '../../../../utils/Theme'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import SkeletonSlider from '../../../../components/SkeletonSlider'
import FastImage from 'react-native-fast-image'
import moment from 'moment'
import { useQuery } from '@tanstack/react-query'

const { width, height } = Dimensions.get("window")
const color = Theme.DARK
const font = Theme.FONTS
const date = new Date()
const todayDate = date?.toISOString()?.split('T')[0]
// console.log(todayDate)
const SmalScheduleSlider = ({refreshing}) => {
    const{currentLang} = useLanguage()
    const navigation = useNavigation()
    // const [schedule, setSchedule] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    // const [isLoading, setIsLoading] = useState(false)
    const flatListRef = useRef(null)

    const {
        data: schedule,
        isLoading: isLoading,
        error,
      } = useQuery ({
        queryKey: [
          'schedule',
          todayDate,
          refreshing,
        ],
        queryFn: () => fetchSchedule(),
        // staleTime: 1000 * 60 * 60,
      });
    const fetchSchedule = async()=>{
        const resp = await fetchTodaySchedule(todayDate)
        return resp?resp:[]
    }

    useEffect(()=>{
        // setInterval Bugs sometime in android
        if(currentIndex>=0 && schedule?.length >0){
            const sid = setTimeout(() => {
                flatListRef?.current?.scrollToIndex({ animated: true, index: currentIndex })
                setCurrentIndex(prev=> prev<schedule?.length-1?prev+1:0)
            }, 5000);
            return ()=> clearTimeout(sid)
        }
    },[currentIndex,schedule])

    const memoizedSmallImg = useCallback((anime)=>{
        if(anime?.filterList?.AdditionalInfo?.coverImage?.original){
            return anime?.filterList?.AdditionalInfo?.coverImage?.original
        }
        else if(anime?.filterList?.AdditionalInfo?.coverImage?.large){
            return anime?.filterList?.AdditionalInfo?.coverImage?.large
        }
        else if(anime?.filterList?.AdditionalInfo?.coverImage?.small){
            return anime?.filterList?.AdditionalInfo?.coverImage?.small
        }
        else if(anime?.filterList?.AdditionalInfo?.coverImage?.tiny){
            return anime?.filterList?.AdditionalInfo?.coverImage?.tiny
        }else{
            return anime?.filterList?.animeImg
        }
    })
    const renderItem = useCallback(({item, index})=>{
        return(
            <TouchableOpacity style={styles.sliderContainer} onPress={()=>goToVideo(item?.filterList?.animeID)}>
                <FastImage source={{uri:memoizedSmallImg(item)}} style={styles.SliderImg}/>
                <View style={styles.SliderInfo}>
                    <Text numberOfLines={1} style={styles.sliderTitle}>{memoizedAnimeTitle(item)}</Text>
                <View style={{flexDirection:"row", gap:10,}}>
                    <Text style={styles.Time}>{convertToAMPM(item?.time)}</Text>
                    <Text style={styles.TimeDate}>{moment(`${item?.date} ${item?.time}`).fromNow()}</Text>
                </View>
                </View>
            </TouchableOpacity>
        )
    },[currentLang,schedule])

    const memoizedAnimeTitle = useCallback((anime)=>{
        if(currentLang === "en"){
            if(anime?.filterList?.animeTitle?.english){
                return anime?.filterList?.animeTitle?.english
            }
            else if(anime?.english){
                return anime?.english
            }
            else if(anime?.filterList?.animeTitle?.english_jp){
                return anime?.filterList?.animeTitle?.english_jp
            }
            else if(anime?.english){
                return anime?.english_jp
            }
        }else{
            if(anime?.filterList?.animeTitle?.english_jp){
                return anime?.filterList?.animeTitle?.english_jp
            }
            else if(anime?.filterList?.animeTitle?.japanese){
                return anime?.filterList?.animeTitle?.japanese
            }    
        }
    },[schedule, currentLang])

    const getItemLayout = (data, index) => ({
        length: width,
        offset: width * index,
        index,
    })
    const goToVideo = useCallback((id)=>{
        navigation.navigate("anime-info",{
            animeId:id, 
        })
    },[])

    const memoizedFlatList = useMemo(()=>{
        if(isLoading){
            return(
                <FlatList
                horizontal={true}
                data={[0, 1, 2, 3, 4, 5, 6, 7]}
                keyExtractor={(item, index) => `${item}-${index}-SmallScheduleSkeleton`}
                renderItem={({ item }) => {
                    return (
                        <View style={{ marginHorizontal: 5 }}>
                            <SkeletonSlider width={width} height={height / (20 / 3)} opacity={1} />
                        </View>
                    )
                }}
            />
            )
        }else{
            return(
                <FlatList 
                    ref={flatListRef}
                    horizontal={true}
                    data={schedule}
                    keyExtractor={(item, index)=> `${item?.animeID}-${index}-SmallScheduleSlider`}
                    renderItem={renderItem}
                    getItemLayout={getItemLayout}
                    ListEmptyComponent={()=><><Text style={{fontFamily:font.OpenSansBold, color:color.White}}>No Schedule Today</Text></>}
                />
            )
        }
    },[isLoading, schedule])
    return (
        <View style={styles.sliderContainer}>
            {memoizedFlatList}
            
        </View>
    )
}

export default SmalScheduleSlider

const styles = StyleSheet.create({
    sliderContainer: {
        width: width,
        height: height / (20 / 3),
        position:"relative",
        marginVertical:10,
    },
    SliderImg: {
        width: "100%",
        height: "100%",
        resizeMode:"cover",
    },
    SliderInfo:{
        backgroundColor:"rgba(0,0,0,0.5)",
        height:"60%",
        width:"100%",
        position:"absolute",
        bottom:0,
        paddingHorizontal:10,
        gap:5,
    },
    sliderTitle:{
        fontFamily:font.OpenSansBold,
        fontSize:16,
        color:color.Orange,
        textTransform:"capitalize",
    },
    Time:{
        fontFamily:font.OpenSansBold,
        fontSize:18,
        color:color.White,
        textTransform:"uppercase",
        alignSelf:"flex-end",
    },
    TimeDate:{
        fontFamily:font.OpenSansBold,
        fontSize:16,
        color:color.Orange,
        textTransform:"capitalize",
        alignSelf:"flex-end",
    },
})