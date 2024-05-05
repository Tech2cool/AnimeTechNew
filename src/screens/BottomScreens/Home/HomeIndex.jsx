import { View, Text } from 'react-native'
import React from 'react'
import { useSettingControl } from '../../../context/SettingsControlContext'
import HomeV1 from './v1/Home'
import HomeV2 from './v2/Home'

const HomeIndex = ({navigation, route}) => {
  const {setting} = useSettingControl()

  if(setting.provider === "anitaku"){
    return(
      <View style={{flex:1}}>
        <HomeV1 navigation={navigation} route={route}/>
      </View>
    )
  }
  if(setting.provider === "aniwatch"){
    return(
      <View style={{flex:1}}>
        <HomeV2 navigation={navigation} route={route}/>
      </View>
    )
  }
}

export default HomeIndex