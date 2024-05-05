import {View, Text} from 'react-native';
import React from 'react';
import { useSettingControl} from '../../../context/SettingsControlContext';
import InfoV1 from './v1/Info';
import InfoV2 from './v2/Info';

const InfoIndex = ({navigation, route}) => {
  const {id} = route.params;

  const {setting} = useSettingControl();
  if(setting.provider === "anitaku"){
    return(
        <View style={{flex: 1}}>
            <InfoV1 id={id} navigation={navigation} route={route} />
        </View>
    )
  }

  if(setting.provider === "aniwatch"){
    return(
        <View style={{flex: 1}}>
            <InfoV2 id={id} navigation={navigation} route={route} />
        </View>
    )
  }
};

export default InfoIndex;
