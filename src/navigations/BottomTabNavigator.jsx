import { Alert, BackHandler, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/BottomScreens/Home/Home';
import Settings from '../screens/BottomScreens/Settings/Settings';
import MyList from '../screens/BottomScreens/MyList/MyList';
import Search from '../screens/BottomScreens/Search/Search';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Theme from '../utils/Theme';
import { useNavigation } from '@react-navigation/native';
import { F5Icon } from '../utils/contstant';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RandomScreen from '../screens/BottomScreens/Random/RandomScreen';
const Tab = createBottomTabNavigator();
const color = Theme.DARK
const font = Theme.FONTS
const BottomTabNavigator = ({ route}) => {
const navigation = useNavigation()
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


  useEffect(()=>{
    const backHandler = navigation.addListener("beforeRemove",(e)=>{
      e.preventDefault();
      backAction()
    })

    return () => navigation.removeListener(backHandler);
  },[navigation])

  return (
    <Tab.Navigator 
    screenOptions={{
        headerShown:false,
        tabBarActiveBackgroundColor:color.DarkBackGround,
        tabBarInactiveBackgroundColor:color.DarkBackGround,
        tabBarInactiveTintColor:color.LightGray,
        tabBarActiveTintColor:color.Orange,
        tabBarStyle:{
          borderColor:color.LighterGray,
          borderTopWidth:0.5,
          backgroundColor:color.DarkBackGround,
        }
    }}
    >
      <Tab.Screen 
        name="Home" 
        component={Home} 
        options={{
          tabBarLabel:"Home",
          tabBarIcon: ({ color, size }) => (
            <MIcon name="home" color={color} size={size} />
          ),
      }}/>
      <Tab.Screen name="Search" component={Search} 
        options={{
          tabBarLabel:"Search",
          tabBarIcon: ({ color, size }) => (
            <MIcon name="search" color={color} size={size} />
          ),
        }}
      />
        <Tab.Screen name="Random" component={RandomScreen} 
        initialParams={{
          randomize:0
        }}
          options={{
            
              tabBarLabel:"Random", 
              tabBarItemStyle:{
                top:-25,
                height:70,
                width:70,
                // overflow:"hidden",
                borderRadius:999,
                // borderColor:"white",
                // borderWidth:1,

              },
              tabBarIcon: ({ color, size }) => (
                <F5Icon name="random" color={color} size={size} />
              ),
            
          }}
      />
      <Tab.Screen name="MyList" component={MyList} 
        options={{
            headerShown:false,
            headerTitle:"watchlist",
            headerTitleStyle:{
              fontFamily:font.MontserratBold,
              fontSize:18,
              color:color.White
            },
            headerStyle:{
              backgroundColor:color.DarkBackGround,
            },

            tabBarLabel:"MyList",
            tabBarIcon: ({ color, size }) => (
              <Entypo name="list" color={color} size={size} />
            ),
          }}
      />
      <Tab.Screen name="Settings" component={Settings} 
        options={{
            tabBarLabel:"Settings",
            tabBarIcon: ({ color, size }) => (
              <MIcon name="settings" color={color} size={size} />
            ),
          }}
      />

    </Tab.Navigator>
  )
}

export default BottomTabNavigator