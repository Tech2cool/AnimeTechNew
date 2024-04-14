import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../screens/StackScreens/Home/Home';
import Splash from '../screens/StackScreens/Splash/Splash';
import Theme from '../utils/Theme';
import Recent from '../screens/StackScreens/Recent/Recent';
import Airing from '../screens/StackScreens/Airing/Airing';
import Popular from '../screens/StackScreens/Popular/Popular';
import AnimeInfo from '../screens/StackScreens/AnimeInfo/AnimeInfo';
import Video from '../screens/StackScreens/Video/VideoScreen';
import Movies from '../screens/StackScreens/Movies/Movies';
import GeneralSettings from '../screens/StackScreens/GeneralSettings/GeneralSettings';
import AutoPlay from '../screens/StackScreens/AutoPlay/AutoPlay';
import QualityPreference from '../screens/StackScreens/QualityPreference/QualityPreference';
import ScheduleWeekly from '../screens/StackScreens/ScheduleWeekly/ScheduleWeekly';
const Stack = createStackNavigator();
const color = Theme.DARK
const StackNavigator = () => {
  return (
    <NavigationContainer>
      <View style={{ flex: 1, backgroundColor: color.DarkBackGround }}>
        <Stack.Navigator 
          initialRouteName='Splash'
          screenOptions={{
            headerShown: true,
            headerStyle: {
              backgroundColor: color.DarkBackGround,
              
            },
            headerTintColor: color.White,
            headerTitleStyle: {
              textTransform: "capitalize",
            },
          }}
        >
          <Stack.Screen name="Splash" component={Splash} options={{headerShown:false}} />
          <Stack.Screen name="HomeStack" component={Home} options={{headerShown:false}}/>
          <Stack.Screen name="recent" component={Recent}/>
          <Stack.Screen name="airing" component={Airing}/>
          <Stack.Screen name="popular" component={Popular}/>
          <Stack.Screen name="movies" component={Movies}/>
          <Stack.Screen name="anime-info" component={AnimeInfo} options={{headerShown:false}}/>
          <Stack.Screen name="video" component={Video} options={{headerShown:false}}/>
          <Stack.Screen name="general" component={GeneralSettings}/>
          <Stack.Screen name="autoPlay" component={AutoPlay}/>
          <Stack.Screen name="qualityPref" component={QualityPreference} options={{title:"Video quality preferences"}}/>
          <Stack.Screen name="scheduleWeekly" component={ScheduleWeekly} options={{title:"Weekly Schedule"}}/>
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  )
}

export default StackNavigator