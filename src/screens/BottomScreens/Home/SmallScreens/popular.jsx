import {FlatList, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchPopularAnime } from '../../../../utils/functions'
import VerticalAnimeCard from '../../../../components/VerticalAnimeCard'
import { useNavigation } from '@react-navigation/native'
import Theme from '../../../../utils/Theme'
import SkeletonSlider from '../../../../components/SkeletonSlider'
import { useQuery } from '@tanstack/react-query'
const color = Theme.DARK
const font = Theme.FONTS
const Popular = ({refreshing}) => {
    const navigation = useNavigation()
    // const [popular, setPopular] = useState([])
    // const [isLoading, setisLoading] = useState(false)
    const {data:popular, isLoading, error} = useQuery({
        queryKey:["popular", 1, refreshing],
        queryFn: ()=>fetchAnime(1),
        staleTime: 1000 * 60 * 60
    })

    const fetchAnime = async (page)=>{
        const resp = await fetchPopularAnime(page)
        return resp?.list?.length >0?resp?.list:[]
    }

    const goToVideo = useCallback((id)=>{
        navigation.navigate("anime-info",{
            animeId:id, 
        })
    },[])
    const goToShowMoreList =useCallback(()=>{
        navigation.navigate("popular")
    },[])
    const renderItem = useCallback(({item, index})=>{
        return(
        <TouchableOpacity onPress={()=>goToVideo(item?.animeID)}>
            <VerticalAnimeCard anime={item}/>
        </TouchableOpacity>
        )
    },[])
    
    const memoizedFlatList = useMemo(()=>{
        if(isLoading){
            return(
                <FlatList
                horizontal={true}
                data={[0, 1, 2, 3, 4, 5, 6, 7]}
                keyExtractor={(item, index) => `${item}-${index}-PopularSkeleton`}
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
                    data={popular}
                    keyExtractor={(item, index) => `${item.animeID}-${index}-RecentFlatList`}
                    renderItem={renderItem}
                />
            )
        }
    },[isLoading, popular])
    return (
        <View style={styles.container}>
        
            <View style={styles.HeadingContainer}>
                <Text style={styles.Heading}>popular</Text>
                <TouchableOpacity onPress={goToShowMoreList}>
                    <Text style={styles.ShowMore}>show more</Text>
                </TouchableOpacity>
            </View>
            {memoizedFlatList}
            
        </View>
    )
}

export default Popular

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