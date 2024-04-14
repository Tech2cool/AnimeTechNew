import { View, Text, Linking, ToastAndroid, BackHandler, Alert } from 'react-native'
import React, { useEffect } from 'react'
import BottomTabNavigator from '../../../navigations/BottomTabNavigator'
import { getQueryParams } from '../../../utils/functions';

const Home = ({ navigation, route }) => {
  const handleDeepLink = ({ url }) => {
    if (url) {
      const queryParams = getQueryParams(url);
      // console.log(url)
      // console.log(queryParams)
      if (queryParams.key === "video") {
        navigation.navigate("video", {
          animeId: queryParams.animeId,
          kitsuId: queryParams.kitsuId,
          episodeId: queryParams.episodeId,
          episodeNum: queryParams.episodeNum,
        });
      }else if(queryParams.key === "anime"){
        navigation.navigate("anime-info", {
          animeId: queryParams.animeId,
      })
    }
    }
  };

  useEffect(() => {
    Linking.getInitialURL()
      .then((url) => { handleDeepLink({ url: url }) })
      .catch((err) => {
        // console.log(err);
        ToastAndroid.show(`Error: ${err}`, ToastAndroid.SHORT);
      });

    let listner = Linking.addEventListener("url", handleDeepLink)
    return () => {
      Linking.removeAllListeners(listner)
    }
  }, [])

  return (
    <BottomTabNavigator />
  )
}

export default Home