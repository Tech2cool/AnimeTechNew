import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { fetchTopAiringAnime } from '../../../../utils/functions'
import { useLanguage } from '../../../../contexts/LanguageContext'
import Theme from '../../../../utils/Theme'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import SkeletonSlider from '../../../../components/SkeletonSlider'

const { width, height } = Dimensions.get("window")
const color = Theme.DARK
const font = Theme.FONTS
const SmallImageSlider = ({refreshing}) => {
    const{currentLang} = useLanguage()
    const navigation = useNavigation()
    const [airing, setAiring] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const flatListRef = useRef(null)
    const fetchAiring = async(page)=>{
        try {
            setIsLoading(true)
            const resp = await fetchTopAiringAnime(page)
            // console.log(resp)
            setAiring(resp?.list)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
        }
    }

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
    const memoizedSmallImg = useCallback((anime)=>{
        if(anime?.AdditionalInfo?.coverImage?.original){
            return anime?.AdditionalInfo?.coverImage?.original
        }
        else if(anime?.AdditionalInfo?.coverImage?.large){
            return anime?.AdditionalInfo?.coverImage?.large
        }
        else if(anime?.AdditionalInfo?.coverImage?.small){
            return anime?.AdditionalInfo?.coverImage?.small
        }
        else if(anime?.AdditionalInfo?.coverImage?.tiny){
            return anime?.AdditionalInfo?.coverImage?.tiny
        }else{
            return anime?.animeImg
        }
    })
    const renderItem = useCallback(({item, index})=>{
        return(
            <TouchableOpacity style={styles.sliderContainer} onPress={()=>goToVideo(item?.animeID)}>
                <Image source={{uri:memoizedSmallImg(item)}} style={styles.SliderImg}/>
                <View style={styles.SliderInfo}>
                    <Text numberOfLines={1} style={styles.sliderTitle}>{memoizedAnimeTitle(item)}</Text>
                    <Text style={styles.watchNowText}>watch now</Text>
                </View>
            </TouchableOpacity>
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
                keyExtractor={(item, index) => `${item}-${index}-SmallSliderSkeleton`}
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
                    data={airing}
                    keyExtractor={(item, index)=> `${item.animeID}-${index}-SmallImageSlider`}
                    renderItem={renderItem}
                    getItemLayout={getItemLayout}
                />
            )
        }
    },[isLoading, airing])
    return (
        <View style={styles.sliderContainer}>
            {memoizedFlatList}
            
        </View>
    )
}

export default SmallImageSlider

const styles = StyleSheet.create({
    sliderContainer: {
        width: width,
        height: height / (20 / 3),
        marginBottom:10,
        position:"relative",
    },
    SliderImg: {
        width: "100%",
        height: "100%",
        resizeMode:"cover",
    },
    SliderInfo:{
        backgroundColor:"rgba(0,0,0,0.5)",
        height:"50%",
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
    },
    sliderDesc:{
        fontFamily:font.OpenSansMedium,
        fontSize:12,
        color:color.White,
    },
    watchNowBtn:{
        flex:0,
        // padding:10,
        // backgroundColor:color.Orange,
        alignSelf:"flex-start",
        // borderRadius:10,
    },
    watchNowText:{
        fontFamily:font.OpenSansBold,
        fontSize:14,
        color:color.White,
        textTransform:"uppercase"
    }
})