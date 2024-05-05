import {View} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Theme from '../utils/Theme';

import Splash from '../screens/StackScreens/Splash/Splash';
import HomeV1 from '../screens/StackScreens/Home/v1/Home';
import Info from '../screens/StackScreens/Info/v1/Info';
import VideoScreen from '../screens/StackScreens/Video/VideoScreen';
import RecentRelease from '../screens/StackScreens/RecentRelease/v1/RecentRelease';
import TrendingRelease from '../screens/StackScreens/TrendingRelease/v1/TrendingRelease';
import PopularRelease from '../screens/StackScreens/PopularRelease/v1/PopularRelease';
import MoviesRelease from '../screens/StackScreens/MoviesRelease/v1/MoviesRelease';
import GogotakuInfo from '../screens/StackScreens/Info/v1/GogotakuInfo';
import RequestedInfo from '../screens/StackScreens/Info/v1/RequestedInfo';
import TrailerInfo from '../screens/StackScreens/Info/v1/TrailerInfo';
import SeasonRelease from '../screens/StackScreens/SeasonRelease/v1/SeasonRelease';
import RequestedList from '../screens/StackScreens/RequestedList/v1/RequestedList';
import UpcomingList from '../screens/StackScreens/UpcomingList/v1/UpcomingList';
import AutoPlay from '../screens/StackScreens/AutoPlay/AutoPlay';
import QualitySetting from '../screens/StackScreens/QualitySetting/QualitySetting';
import GeneralSetting from '../screens/StackScreens/GeneralSetting/GeneralSetting';
import InfoIndex from '../screens/StackScreens/Info/InfoIndex';
const Stack = createStackNavigator();
const color = Theme.DARK;
const StackNavigator = () => {
  return (
    <NavigationContainer>
      <View style={{flex: 1, backgroundColor: color.DarkBackGround}}>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: true,
            headerStyle: {
              backgroundColor: color.DarkBackGround,
            },
            headerTintColor: color.White,
            headerTitleStyle: {
              textTransform: 'capitalize',
            },
          }}>
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="HomeStack"
            component={HomeV1}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="anime-info"
            component={InfoIndex}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="anime-info-v2"
            component={GogotakuInfo}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="anime-info-v3"
            component={RequestedInfo}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="trailer-info"
            component={TrailerInfo}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="RecentRelease"
            component={RecentRelease}
            options={{headerShown: true, headerTitle: 'Recent Release'}}
          />
          <Stack.Screen
            name="autoPlay"
            component={AutoPlay}
            options={{headerShown: true, headerTitle: 'Autoplay Setting'}}
          />
            <Stack.Screen
            name="generalSetting"
            component={GeneralSetting}
            options={{headerShown: true, headerTitle: 'General Setting'}}
          />
          <Stack.Screen
            name="qualitySetting"
            component={QualitySetting}
            options={{headerShown: true, headerTitle: 'Quality Setting'}}
          />
          <Stack.Screen
            name="TrendingRelease"
            component={TrendingRelease}
            options={{headerShown: true, headerTitle: 'Top Airing'}}
          />
          <Stack.Screen
            name="PopularRelease"
            component={PopularRelease}
            options={{headerShown: true, headerTitle: 'Popular'}}
          />
          <Stack.Screen
            name="MoviesRelease"
            component={MoviesRelease}
            options={{headerShown: true, headerTitle: 'Movies'}}
          />
          <Stack.Screen
            name="SeasonRelease"
            component={SeasonRelease}
            options={{headerShown: true, headerTitle: 'Seasonal Releases'}}
            initialParams={{
              season:""
            }}
          />
          <Stack.Screen
            name="UpcomingList"
            component={UpcomingList}
            options={{headerShown: true, headerTitle: 'Upcoming List'}}
            initialParams={{
              type:""
            }}
          />
          <Stack.Screen
            name="RequestedList"
            component={RequestedList}
            options={{headerShown: true, headerTitle: 'Requested List'}}
            initialParams={{
              season:""
            }}
          />
          <Stack.Screen
            name="watch"
            component={VideoScreen}
            options={{headerShown: false}}
            initialParams={{
              id: undefined,
              episodeId: undefined,
              episodeNum: undefined,
              provider: undefined,
            }}
          />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
};

export default StackNavigator;
