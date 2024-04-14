import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useMemo } from 'react'
import Theme from '../utils/Theme'
import { useLanguage } from '../contexts/LanguageContext'
import { isValidData } from '../utils/functions'
const color = Theme.DARK
const font = Theme.FONTS
const VerticalAnimeCard = ({ anime, showPrequalText=false, currentAnimeId }) => {
    const{currentLang} = useLanguage()
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
    },[anime?.animeTitle,currentLang])

    const memoizedEpisodeNumber = useMemo(()=>{
        if(anime?.episodeNum){
            return (<Text style={styles.EpisodeNum}>Episode {anime?.episodeNum}</Text>)
        }
    },[anime?.episodeNum])

    const memoizedStatus = useMemo(()=>{
        if(anime?.status){
            return (<Text style={styles.status}>Status: {anime?.status}</Text>)
        }
        else if(anime?.AdditionalInfo?.status){
            return (<Text style={styles.status}>Status: {anime?.AdditionalInfo?.status==="current"?"ongoing":anime?.AdditionalInfo?.status}</Text>)
        }
        else if(anime?.anilist?.status){
            if(anime?.anilist?.status === "NOT_YET_RELEASED"){
                return (<Text style={styles.status}>Status: Not Released</Text>)
            }

            return (<Text style={styles.status}>Status: {anime?.anilist?.status}</Text>)
        }
    },[anime?.status, anime?.AdditionalInfo?.status,anime?.anilist?.status]) 

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

    const memoizedPrequal = useMemo(()=>{
        if(!showPrequalText) return
        if(anime?.isSequal){
            const SequalText = currentAnimeId === anime.animeID ? "currently on": "sequel"
            return (<Text style={[styles.sequel,{color:currentAnimeId === anime.animeID ?color.AccentGreen:color.Orange}]}>{SequalText}</Text>)
        }else{
            const SequalText = currentAnimeId === anime.animeID ? "currently on": "prequel"
            return (<Text style={[styles.sequel,{color:currentAnimeId === anime.animeID ?color.AccentGreen:color.Orange}]}>{SequalText}</Text>)
        }
    },[anime?.isSequal, showPrequalText, currentAnimeId])

    return (
        <View style={styles.container}>
            <Image source={{ uri:memoizedPoster}} style={styles.Poster}/>
            <View style={styles.InfoOverLay}>
                <Text 
                numberOfLines={2} 
                style={styles.AnimeTitle}>{memoizedAnimeTitle}</Text>
                <View style={{flexDirection:"row", gap:5, alignItems:"center", justifyContent:"center"}}>
                {memoizedEpisodeNumber}
                {memoizedSubORDub}
                </View>
                {memoizedStatus}
                {memoizedYear}
            </View>
            <View style={{position:"absolute", top:0, right:0, backgroundColor:"rgba(0,0,0,0.7)",borderRadius:2, padding:1}}>
                    {memoizedPrequal}
            </View>
        </View>
    )
}

export default VerticalAnimeCard

const styles = StyleSheet.create({
    container:{
        // flex:1, 
        width:145,
        height:210,
        flexDirection:"column",
        marginHorizontal:5, 
        borderRadius:5,
        overflow:"hidden",
        borderColor:color.LighterGray,
        borderWidth:1,
        position:"relative"
    },
    Poster:{
        width:"100%",
        height:"100%"
    },
    InfoOverLay:{
        width:"100%",
        height:80,
        flexDirection:"column", 
        backgroundColor:"rgba(0,0,0,0.8)",
        padding:2, 
        position:"absolute",
        bottom:0,
        gap:2,
        overflow:"hidden"
    },
    AnimeTitle:{
        overflow:"hidden", 
        fontFamily:font.OpenSansBold,
        color:color.White,
        fontSize:13,
        alignSelf:"center",

    },
    EpisodeNum:{
        fontFamily:font.OpenSansBold,
        alignSelf:"center",
        color:color.Orange,
        fontSize:13,
    },
    status:{
        fontFamily:font.OpenSansBold,
        color:color.AccentBlue,
        textTransform:"capitalize",
        fontSize:13,
        alignSelf:"center",
    },
    subDub:{
        fontFamily:font.OpenSansBold,
        color:color.Orange,
        textTransform:"capitalize",
        fontSize:13,
        alignSelf:"center",
    },
    year:{
        fontFamily:font.OpenSansBold,
        color:color.White,
        textTransform:"capitalize",
        fontSize:13,
        textAlign:"center",
    },
    sequel:{
        fontFamily:font.OpenSansBold,
        // color:color.White,
        textTransform:"capitalize",
        fontSize:13,
        textAlign:"center",
    }
})