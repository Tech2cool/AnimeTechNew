import { ActivityIndicator, FlatList, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchRecentAnime } from '../../../../utils/functions'
import VerticalAnimeCard from '../../../../components/VerticalAnimeCard'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import Theme from '../../../../utils/Theme'
import SkeletonSlider from '../../../../components/SkeletonSlider'
import { useQuery } from '@tanstack/react-query'
const color = Theme.DARK
const font = Theme.FONTS
const Recent = ({refreshing}) => {
    const navigation = useNavigation()
    // const [recent, setRecent] = useState([])
    // const [isLoading, setisLoading] = useState(false)
    const {data:recent, isLoading, error} = useQuery({
        queryKey:["recent", 1, refreshing],
        queryFn: ()=>fetchAnime(1),
        staleTime: 1000 * 15 * 60
    })
    const fetchAnime = async (page=1) => {
        const resp = await fetchRecentAnime(page)
        return resp?.list.length >0 ?resp?.list:[]
    }
    // useEffect(() => {
    //     fetchAnime(1)
    // }, [refreshing])

    // useEffect(() => {
    //     // console.log(recent?.length)
    // }, [recent])
    const goToVideo = (id, epId, epNum,kid,aniwatchId,aniwatchEpisodeId) => {
        // console.log(aniwatchId)

        navigation.navigate("video", {
            animeId: id,
            kitsuId: kid,
            episodeId: epId,
            episodeNum: epNum,
            aniwatchId:aniwatchId,
            aniwatchEpisodeId:aniwatchEpisodeId,
        })
    }
    const goToShowMoreList = useCallback(() => {
        navigation.navigate("recent")
    }, [])
    const renderItem = useCallback(({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => goToVideo(
                item?.animeID, 
                item?.episodeId, 
                item?.episodeNum, 
                item?.AdditionalInfo?.id,
                item?.aniwatchId,
                item?.aniwatchEpisodeId,
                )}>
                <VerticalAnimeCard anime={item}/>
            </TouchableOpacity>
        )
    }, [])

    const memmoizedFlatList = useMemo(()=>{
        if(isLoading){
            return(
                <FlatList
                    horizontal={true}
                    data={[0, 1, 2, 3, 4, 5, 6, 7]}
                    keyExtractor={(item, index) => `${item}-${index}-RecentSkeleton`}
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
                    data={recent}
                    keyExtractor={(item, index) => `${item.animeID}-${index}-RecentFlatList`}
                    renderItem={renderItem}
                />
            )
        }
    },[isLoading, recent])
    return (
        <View style={styles.container}>

            <View style={styles.HeadingContainer}>
                <Text style={styles.Heading}>new episode releases</Text>
                <TouchableOpacity onPress={goToShowMoreList}>
                    <Text style={styles.ShowMore}>show more</Text>
                </TouchableOpacity>
            </View>
        {memmoizedFlatList}
        </View>
    )
}

export default Recent

const styles = StyleSheet.create({
    container: {
        marginBottom:10,
        marginTop:5,
    },
    HeadingContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 5,
        paddingVertical: 2,
    },
    Heading: {
        fontSize: 16,
        color: color.White,
        fontFamily: font.OpenSansBold,
        textTransform: "capitalize",
        paddingLeft: 2,
    },
    ShowMore: {
        fontSize: 14,
        marginVertical: 5,
        color: color.Orange,
        fontFamily: font.OpenSansBold,
        textTransform: "capitalize",
    }
})