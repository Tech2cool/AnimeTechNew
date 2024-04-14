import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React, { useMemo } from 'react'
import { useLanguage } from '../../../../contexts/LanguageContext'
import Theme from '../../../../utils/Theme'
import { VidioDuration } from '../../../../utils/functions'
import FastImage from 'react-native-fast-image'
const color = Theme.DARK
const font = Theme.FONTS
const MyListHorizontalCard = (param) => {
    const {
        anime,
        episodeId,
        episodeNum, 
        currentTime,
        duration,
        mainId,
    } = param
    const{currentLang} = useLanguage()
    const memoizedWatchTime = useMemo(()=>{
        const percent = currentTime/ duration * 100
        return (<>
        <View style={{flexDirection:"row"}}>
        <Text style={[{fontFamily:font.OpenSansSemiBold, color:color.Orange}]}> </Text>
        <Text style={[{fontFamily:font.OpenSansSemiBold, color:color.Orange}]}>(Watched: </Text>
        <Text style={[{fontFamily:font.OpenSansSemiBold, color:color.Orange}]}>{Math.round(percent)}%)</Text>
        </View>
        </>)
    },[currentTime, duration])

    const memoizedPoster = useMemo(()=>{
        if(anime?.animeImg){
            return anime?.animeImg
        }
        else if(anime?.AdditionalInfo?.posterImage?.original){
            return anime?.AdditionalInfo?.posterImage?.original
        }
        else if(anime?.AdditionalInfo?.posterImage?.large){
            return anime?.AdditionalInfo?.posterImage?.large
        }
        else if(anime?.AdditionalInfo?.posterImage?.medium){
            return anime?.AdditionalInfo?.posterImage?.medium
        }
        else if(anime?.AdditionalInfo?.posterImage?.small){
            return anime?.AdditionalInfo?.posterImage?.small
        }
        else if(anime?.AdditionalInfo?.posterImage?.tiny){
            return anime?.AdditionalInfo?.posterImage?.tiny
        }else {
            return "https://cdn1.vectorstock.com/i/1000x1000/32/45/no-image-symbol-missing-available-icon-gallery-vector-45703245.jpg"
        }
    },[anime?.animeImg, anime?.AdditionalInfo?.posterImage])
    
    const memoizedAnimeTitle = useMemo(()=>{
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
    },[anime?.animeTitle, currentLang])

    const memoizedEpisodeNumber = useMemo(()=>{
        if(episodeNum){
            return (<Text style={styles.EpisodeNum}>Episode {episodeNum}</Text>)
        }
    },[episodeNum])

    const memoizedStatus = useMemo(()=>{
        if(anime?.status){
            return (<Text style={styles.status}>Status: {anime?.status}</Text>)
        }
        else if(anime?.AdditionalInfo?.status){
            return (<Text style={styles.status}>Status: {anime?.AdditionalInfo?.status==="current"?"ongoing":anime?.AdditionalInfo?.status}</Text>)
        }
    },[anime?.status, anime?.AdditionalInfo?.status])

    const memoizedSubORDub = useMemo(()=>{
        if(anime?.subOrDub){
            return (<Text style={styles.subDub}>({anime?.subOrDub})</Text>)
        }
    },[anime?.subOrDub])

    const memoizedYear = useMemo(()=>{
        if(anime?.year){
            return (<Text style={styles.year}>year: {anime?.year}</Text>)
        }else if(anime?.AdditionalInfo?.startDate){
            return (<Text style={styles.year}>year: {anime?.AdditionalInfo?.startDate?.split("-")[0]}</Text>)
        }
    },[anime?.year, anime?.AdditionalInfo?.startDate])
    
    return (
        <View style={styles.container}>

            {/* <FastImage source={require("../../../../assets/images/No_image_available.svg.png")} style={styles.Poster}/> */}
            <FastImage source={{ uri:memoizedPoster}} style={styles.Poster}/>

            <View style={styles.InfoOverLay}>
                <Text 
                numberOfLines={2} 
                style={styles.AnimeTitle}>{memoizedAnimeTitle}</Text>
                <View style={{flexDirection:"row", gap:5}}>
                {memoizedEpisodeNumber}
                {memoizedSubORDub}
                {memoizedWatchTime}
                </View>
                {memoizedStatus}
                {memoizedYear}
            </View>
        </View>
    )
}

export default MyListHorizontalCard

const styles = StyleSheet.create({
    container:{
        // flex:1, 
        width:Dimensions.get("window").width * 0.95,
        height:130,
        flexDirection:"row",
        marginVertical:5, 
        borderRadius:10,
        overflow:"hidden",
        borderColor:color.LighterGray,
        borderWidth:1,
        position:"relative",
        alignSelf:"center",
    },
    Poster:{
        width:110,
        height:"100%",
        resizeMode:"cover"
    },
    InfoOverLay:{
        flex:1,
        flexDirection:"column", 
        paddingHorizontal:5,
        paddingVertical:2,
        gap:3,
        overflow:"hidden"
    },
    AnimeTitle:{
        fontFamily:font.OpenSansBold,
        color:color.White,
        fontSize:13,
    },
    EpisodeNum:{
        fontFamily:font.OpenSansBold,
        color:color.Orange,
        fontSize:13,
    },
    status:{
        fontFamily:font.OpenSansBold,
        color:color.AccentBlue,
        textTransform:"capitalize",
        fontSize:13,
    },
    subDub:{
        fontFamily:font.OpenSansBold,
        color:color.Orange,
        textTransform:"capitalize",
        fontSize:13,
    },
    year:{
        fontFamily:font.OpenSansBold,
        color:color.White,
        textTransform:"capitalize",
        fontSize:13,
    }
})