import { ActivityIndicator, FlatList, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchMoviesAnime, fetchRecentAnime, fetchTopAiringAnime } from '../../../../utils/functions'
import VerticalAnimeCard from '../../../../components/VerticalAnimeCard'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import Theme from '../../../../utils/Theme'
import SkeletonSlider from '../../../../components/SkeletonSlider'
import { useQuery } from '@tanstack/react-query'
const color = Theme.DARK
const font = Theme.FONTS
const Movies = ({refreshing}) => {
    const navigation = useNavigation()
    // const [movies, setMovies] = useState([])
    // const [isLoading, setisLoading] = useState(false)
    const {data:movies, isLoading, error} = useQuery({
        queryKey:["movies", 1, refreshing],
        queryFn: ()=>fetchAnime(1),
        staleTime: 1000 * 60 * 60
    })
    const fetchAnime = async (page)=>{
        const resp = await fetchMoviesAnime("",page)
        // console.log(resp?.list)
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
        navigation.navigate("movies")
    },[])
    
    const renderItem = useCallback(({item, index})=>{
        return(
        <TouchableOpacity onPress={()=>goToVideo(item?.animeID)}>
            <VerticalAnimeCard anime={item}/>
        </TouchableOpacity>
        )
    },[])
    
    const memoiziedFlatList = useMemo(()=>{
        if(isLoading){
            return(
                <FlatList
                    horizontal={true}
                    data={[0, 1, 2, 3, 4, 5, 6, 7]}
                    keyExtractor={(item, index) => `${item}-${index}-MoviesSkeleton`}
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
                data={movies}
                keyExtractor={(item, index) => `${item.animeID}-${index}-RecentFlatList`}
                renderItem={renderItem}
            />
            )
        }
    },[isLoading,movies])
    
    return (
        <View style={styles.container}>
        
            <View style={styles.HeadingContainer}>
                <Text style={styles.Heading}>movies</Text>
                <TouchableOpacity onPress={goToShowMoreList}>
                    <Text style={styles.ShowMore}>show more</Text>
                </TouchableOpacity>
            </View>
            {memoiziedFlatList}
        </View>
    )
}

export default Movies

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