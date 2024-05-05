import {Alert, BackHandler, Text, View, Linking,ToastAndroid} from 'react-native';
import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Theme from '../utils/Theme';
import {useNavigation} from '@react-navigation/native';
import {EntIcon, F5Icon, MIcon} from '../utils/contstant';
import HomeV1 from '../screens/BottomScreens/Home/v1/Home';
import SearchV1 from '../screens/BottomScreens/Search/v1/Search';
import RandomV1 from '../screens/BottomScreens/Random/v1/Random';
import MyListV1 from '../screens/BottomScreens/Mylist/v1/MyList';
import SettingV1 from '../screens/BottomScreens/Setting/v1/Setting';
import { getQueryParams } from '../utils/HelperFunctions';
import HomeIndex from '../screens/BottomScreens/Home/HomeIndex';
import SearchIndex from '../screens/BottomScreens/Search/SearchIndex';
const Tab = createBottomTabNavigator();
const color = Theme.DARK;
const font = Theme.FONTS;
const BottomNavigator = ({route}) => {
  const navigation = useNavigation();

  const backAction = () => {
    Alert.alert('Hold on!', 'Are you sure you want to go back?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'YES', onPress: () => BackHandler.exitApp()},
    ]);
    return true;
  };
  const handleDeepLink = ({url}) => {
    if (url) {
      const queryParams = getQueryParams(url);
      // console.log(queryParams)
      if (queryParams.type === 'episode') {
        navigation.navigate('watch', {
          id: queryParams.animeId,
          episodeId: queryParams.episodeId,
          episodeNum: queryParams.episodeNum,
          provider: queryParams.provider,
        });
      } else if (queryParams.type === 'anime') {
        navigation.navigate('anime-info', {
          id: queryParams.id,
        });
      }
    }
  };
  useEffect(() => {
    const backHandler = navigation.addListener('beforeRemove', e => {
      e.preventDefault();
      backAction();
    });
    Linking.getInitialURL()
      .then(url => {
        handleDeepLink({url: url});
      })
      .catch(err => {
        // console.log(err);
        ToastAndroid.show(`Error: ${err}`, ToastAndroid.SHORT);
      });

    let listner = Linking.addEventListener('url', handleDeepLink);

    return () =>{
      navigation.removeListener(backHandler);
      Linking.removeAllListeners(listner);
    }
  }, [navigation]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveBackgroundColor: color.DarkBackGround,
        tabBarInactiveBackgroundColor: color.DarkBackGround,
        tabBarInactiveTintColor: color.LightGray,
        tabBarActiveTintColor: color.Orange,
        tabBarStyle: {
          borderColor: color.LighterGray,
          borderTopWidth: 0.5,
          backgroundColor: color.DarkBackGround,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeIndex}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <MIcon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchIndex}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({color, size}) => (
            <MIcon name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Random"
        component={RandomV1}
        initialParams={{
          randomize: new Date().getTime(),
        }}
        options={{
          tabBarLabel: 'Random',
          tabBarItemStyle: {
            top: -25,
            height: 70,
            width: 70,
            // shadowColor:"white",
            // overflow:"hidden",
            // shadowRadius:999,
            borderRadius: 999,
            // borderLeftColor:"white",
            // borderRightColor:"white",
            // borderTopColor:"white",
            // margin:5,
            // borderWidth:1,
          },
          tabBarIcon: ({color, size}) => (
            <F5Icon name="random" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MyList"
        component={MyListV1}
        options={{
          headerShown: false,
          headerTitle: 'watchlist',
          headerTitleStyle: {
            fontFamily: font.MontserratBold,
            fontSize: 18,
            color: color.White,
          },
          headerStyle: {
            backgroundColor: color.DarkBackGround,
          },

          tabBarLabel: 'MyList',
          tabBarIcon: ({color, size}) => (
            <EntIcon name="list" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingV1}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({color, size}) => (
            <MIcon name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
