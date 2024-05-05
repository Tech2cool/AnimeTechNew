import { StyleSheet, Text, View,RefreshControl,ScrollView, TouchableOpacity} from 'react-native'
import React, { useCallback, useState } from 'react'
import Theme from '../../../../utils/Theme'
import HeaderHome from '../../../../components/HeaderHome'
import VersionChecker from '../../../../components/VersionChecker'
import { useQuery } from '@tanstack/react-query'
import { fetchHomeAniwatch } from '../../../../Query/v2'
import RecentRelease from './component/RecentRelease'
import TopAiring from './component/TopAiring'
import BigImageSlider from './component/BigImageSlider'
import TrendingAnime from './component/TrendingAnime'
import Top10Animes from './component/Top10Animes' 
import TopUpcomingRelease from './component/TopUpcomingRelease'
import SmallScheduleSlider from './component/SmallScheduleSlider'
import MostPopular from './component/MostPopular'
import MostFavorite from './component/MostFavorite'
import RecentlyAdded from './component/RecentlyAdded'
import LatestCompletedSeries from './component/LatestCompletedSeries'

const color = Theme.DARK
const font = Theme.FONTS

const Home = ({navigation, route}) => {
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
      }, 1500);
    }, []);
  
    const {
        data,
        isLoading,
        error,
      } = useQuery({
        queryKey: ['aniwatch_home', refreshing],
        queryFn: () => fetchHomeAniwatch(),
      });
    
  return (
    <ScrollView
        style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>

    
    <BigImageSlider refreshing={refreshing} data={data} isLoading={isLoading} error={error}/>
    <RecentRelease refreshing={refreshing} data={data} isLoading={isLoading} error={error}/>
    <SmallScheduleSlider refreshing={refreshing}/>
    <TopAiring refreshing={refreshing} data={data} isLoading={isLoading} error={error}/>
    <Top10Animes refreshing={refreshing} data={data} isLoading={isLoading} error={error}/>
    <TrendingAnime refreshing={refreshing} data={data} isLoading={isLoading} error={error}/>
    <MostPopular refreshing={refreshing} data={data} isLoading={isLoading} error={error}/>
    <MostFavorite refreshing={refreshing} data={data} isLoading={isLoading} error={error}/>
    <RecentlyAdded refreshing={refreshing} data={data} isLoading={isLoading} error={error}/>
    <LatestCompletedSeries refreshing={refreshing} data={data} isLoading={isLoading} error={error}/>
    
    <TopUpcomingRelease refreshing={refreshing} data={data} isLoading={isLoading} error={error}/>
    <Text style={{color:color.White, fontFamily:font.OpenSansBold}}>Genres</Text>

    <View style={{flexDirection:"row", gap:10, flexWrap:"wrap", marginVertical:10, paddingBottom:30}}>
    {
        data?.genres?.map((genre,i)=>(
            <TouchableOpacity key={genre} style={{padding:5, borderColor:color.Orange, borderWidth:1, borderRadius:10}}>
                <Text style={{color:color.Orange, fontFamily:font.OpenSansMedium, fontSize:12}}>{genre}</Text>
            </TouchableOpacity>
        ))
    }

    </View>
    <HeaderHome />
    <VersionChecker />

    </ScrollView>
  )
}

export default Home

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:color.DarkBackGround,
        gap:10,
    }
})