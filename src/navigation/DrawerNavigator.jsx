import {View, Text} from 'react-native';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Home from '../screens/DrawerScreens/Home/Home';
import Theme from '../utils/Theme';

const Drawer = createDrawerNavigator();
const color = Theme.DARK;
const font = Theme.FONTS;
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: color.DarkBackGround,
        },
        drawerActiveTintColor: color.Orange,
        drawerInactiveTintColor: color.LightGray,
        drawerInactiveBackgroundColor: color.DarkBackGround,
      }}>
      <Drawer.Screen name="home" component={Home} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
