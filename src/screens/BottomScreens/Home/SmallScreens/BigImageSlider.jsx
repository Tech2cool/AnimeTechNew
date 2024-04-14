import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { fetchTopAiringAnime } from '../../../../utils/functions'
import { useLanguage } from '../../../../contexts/LanguageContext'
import Theme from '../../../../utils/Theme'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import SkeletonSlider from '../../../../components/SkeletonSlider'
import LinearGradient from 'react-native-linear-gradient'
import { useQuery } from '@tanstack/react-query'

const { width, height } = Dimensions.get("window")
const color = Theme.DARK
const font = Theme.FONTS
const BigImageSlider = ({refreshing}) => {
    const navigation = useNavigation()
    const{currentLang} = useLanguage()
    // const [airing, setAiring] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    // const [isLoading, setIsLoading] = useState(false)
    const flatListRef = useRef(null)

    const {data:airing, isLoading, error} = useQuery({
        queryKey:["airing", 1, refreshing],
        queryFn: ()=>fetchAiring(1),
        staleTime: 1000 * 60 * 60
    })

    const fetchAiring = async (page)=>{
        const resp = await fetchTopAiringAnime(page)
        return resp?.list?.length >0?resp?.list:[]
    }

    // const fetchAiring = async(page)=>{
    //     try {
    //         setIsLoading(true)
    //         const resp = await fetchTopAiringAnime(page)
    //         // console.log(resp)
    //         setAiring(resp?.list)
    //         setIsLoading(false)
    //     } catch (error) {
    //         setIsLoading(false)
    //     }
    // }

    useEffect(()=>{
        fetchAiring(1)
    },[refreshing])

    useEffect(()=>{
        // setInterval Bugs sometime in android
        if(currentIndex>=0 && airing?.length >0){
            const sid = setTimeout(() => {
                flatListRef?.current?.scrollToIndex({ animated: true, index: currentIndex })
                setCurrentIndex(prev=> prev<airing.length-1?prev+1:0)
            }, 5000);
            return ()=> clearTimeout(sid)
        }
    },[currentIndex,airing])

    const renderItem = useCallback(({item, index})=>{
        return(
            <View style={styles.sliderContainer}>
                <Image source={{uri:item?.animeImg}} style={styles.SliderImg}/>
                <View style={styles.SliderInfo}>
                    <LinearGradient colors={["transparent", color.DarkBackGround]} style={{width:"100%", height:"100%",paddingHorizontal:10,}}>
                    <Text numberOfLines={2} style={styles.sliderTitle}>{memoizedAnimeTitle(item)}</Text>
                    <Text numberOfLines={3} style={styles.sliderDesc}>{memoizedDesc(item)}</Text>
                    <TouchableOpacity style={styles.watchNowBtn} onPress={()=>goToVideo(item?.animeID)}>
                        <Text style={styles.watchNowText}>watch now</Text>
                    </TouchableOpacity>
                    </LinearGradient>
                </View>
            </View>
        )
    },[currentLang,airing])

    const memoizedAnimeTitle = useCallback((anime)=>{
        if(currentLang === "en"){
            if(anime?.animeTitle?.english){
                return anime?.animeTitle?.english
            }
            else if(anime?.animeTitle?.english_jp){
                return anime?.animeTitle?.english_jp
            }
        }else{
            if(anime?.animeTitle?.english_jp){
                return anime?.animeTitle?.english_jp
            }
            else if(anime?.animeTitle?.japanese){
                return anime?.animeTitle?.japanese
            }    
        }
    },[airing, currentLang])
    
    const memoizedDesc= useCallback((anime)=>{
        if(anime?.description){
            return anime?.description
        }
        else if(anime?.AdditionalInfo?.description){
            return anime?.AdditionalInfo?.description
        }
        else if(anime?.AdditionalInfo?.synopsis){
            return anime?.AdditionalInfo?.synopsis
        }
        else if(anime?.anilist?.description){
            return anime?.anilist?.description
        }
    },[airing])

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

    const memoizedFLatList = useMemo(()=>{
        if(isLoading){
            return(
                <FlatList
                    horizontal={true}
                    data={[0, 1, 2, 3, 4, 5, 6, 7]}
                    keyExtractor={(item, index) => `${item}-${index}-BigSliderSkeleton`}
                    renderItem={({ item }) => {
                        return (
                            <View style={{ marginHorizontal: 5 }}>
                                <SkeletonSlider width={width} height={height / (16/9)} opacity={0.3} />
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
                    data={airing}
                    keyExtractor={(item, index)=> `${item.animeID}-${index}-BigImageSlider`}
                    renderItem={renderItem}
                    getItemLayout={getItemLayout}
                />
            )
        }
    },[isLoading, airing])
    return (
        <View style={styles.sliderContainer}>
            {memoizedFLatList}

        </View>
    )
}

export default BigImageSlider

const styles = StyleSheet.create({
    sliderContainer: {
        width: width,
        height: height / (16 / 9),
        // marginBottom:5,
        position:"relative",
    },
    SliderImg: {
        width: "100%",
        height: "100%",
        resizeMode:"cover",
    },
    SliderInfo:{
        backgroundColor:"rgba(0,0,0,0.5)",
        height:"30%",
        width:"100%",
        position:"absolute",
        bottom:0,
        gap:5,
    },
    sliderTitle:{
        fontFamily:font.OpenSansBold,
        fontSize:16,
        color:color.Orange,
    },
    sliderDesc:{
        fontFamily:font.OpenSansMedium,
        fontSize:12,
        color:color.White,
    },
    watchNowBtn:{
        flex:0,
        padding:10,
        backgroundColor:color.Orange,
        alignSelf:"flex-start",
        borderRadius:10,
    },
    watchNowText:{
        fontFamily:font.OpenSansBold,
        fontSize:14,
        color:color.White,
        textTransform:"uppercase"
    }
})