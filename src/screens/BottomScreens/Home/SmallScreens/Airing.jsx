import { ActivityIndicator, FlatList, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchRecentAnime, fetchTopAiringAnime } from '../../../../utils/functions'
import VerticalAnimeCard from '../../../../components/VerticalAnimeCard'
import { useNavigation } from '@react-navigation/native'
import Theme from '../../../../utils/Theme'
import SkeletonSlider from '../../../../components/SkeletonSlider'
import { useQuery } from '@tanstack/react-query'
const color = Theme.DARK
const font = Theme.FONTS
const Airing = ({refreshing}) => {
    const navigation = useNavigation()
    // const [airing, setAiring] = useState([])
    // const [isLoading, setisLoading] = useState(false)
    const {data:airing, isLoading, error} = useQuery({
        queryKey:["airing", 1, refreshing],
        queryFn: ()=>fetchAnime(1),
        staleTime: 1000 * 60 * 60
    })

    const fetchAnime = async (page)=>{
        const resp = await fetchTopAiringAnime(page)
        return resp?.list?.length >0?resp?.list:[]
    }
    // useEffect(() => {
    //     fetchAnime(1)
    // }, [refreshing])

    const goToVideo = useCallback((id)=>{
        navigation.navigate("anime-info",{
            animeId:id, 
        })
    },[])

    const goToShowMoreList =useCallback(()=>{
        navigation.navigate("airing")
    },[])
    
    const renderItem = useCallback(({item, index})=>{
        return(
        <TouchableOpacity onPress={()=>goToVideo(item?.animeID)}>
            <VerticalAnimeCard anime={item}/>
        </TouchableOpacity>
        )
    },[])
    const memoizedFLatList = useMemo(()=>{
        if(isLoading){
            return(
                <FlatList
                horizontal={true}
                data={[0, 1, 2, 3, 4, 5, 6, 7]}
                keyExtractor={(item, index) => `${item}-${index}-AiringSkeleton`}
                renderItem={({ item }) => {
                    return (
                        <View style={{ marginHorizontal: 5 }}>
                            <SkeletonSlider width={145} height={210} opacity={1} borderRadius={10}/>
                        </View>
                    )
                }}
            />
            )
        }else{
            return(
                <FlatList 
                    horizontal={true}
                    data={airing}
                    keyExtractor={(item, index) => `${item.animeID}-${index}-RecentFlatList`}
                    renderItem={renderItem}
                />
            )
        }
    },[isLoading, airing])
    return (
        <View style={styles.container}>
        
            <View style={styles.HeadingContainer}>
                <Text style={styles.Heading}>top airing</Text>
                <TouchableOpacity onPress={goToShowMoreList}>
                    <Text style={styles.ShowMore}>show more</Text>
                </TouchableOpacity>
            </View>
            {memoizedFLatList}
        </View>
    )
}

export default Airing

const styles = StyleSheet.create({
    container:{
        marginVertical:10,
    },

    HeadingContainer:{
        flexDirection:"row",
        justifyContent:"space-between",
        paddingHorizontal:5,
        paddingVertical:2,
    },
    Heading:{
        fontSize:16,
        color:color.White,
        fontFamily:font.OpenSansBold,
        textTransform:"capitalize",
        paddingLeft:2,
    },
    ShowMore:{
        fontSize:14,
        marginVertical:5,
        color:color.Orange,
        fontFamily:font.OpenSansBold,
        textTransform:"capitalize",
    }
})