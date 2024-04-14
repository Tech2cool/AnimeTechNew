import { View, Text, ScrollView, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Theme from '../../../utils/Theme'
import { fetchRecentAnime } from '../../../utils/functions'
import Recent from './SmallScreens/Recent'
import HeaderHome from '../../../components/HeaderHome'
import BigImageSlider from './SmallScreens/BigImageSlider'
import Airing from './SmallScreens/Airing'
import Popular from './SmallScreens/popular'
import SmallImageSlider from './SmallScreens/SmallImageSlider'
import Movies from './SmallScreens/Movies'
import SmalScheduleSlider from './SmallScreens/SmalScheduleSlider'
const color = Theme.DARK
const Home = () => {
  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // fetchairing(1)
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);


  return (
    <View style={{ backgroundColor: color.DarkBackGround, flex: 1 }}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <BigImageSlider refreshing={refreshing}/>
        {/* <View style={{height:50,}}></View> */}
        <HeaderHome />
        <Recent refreshing={refreshing}/>
        <SmalScheduleSlider refreshing={refreshing}/>
        <Airing refreshing={refreshing}/>
        <Popular refreshing={refreshing}/>
        <SmallImageSlider refreshing={refreshing}/>
        <Movies refreshing={refreshing}/>
      </ScrollView>
    </View>
  )
}

export default Home