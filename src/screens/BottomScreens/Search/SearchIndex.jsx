import {View, Text} from 'react-native';
import React from 'react';
import {useSettingControl} from '../../../context/SettingsControlContext';
import SearchV1 from './v1/Search';
import SearchV2 from './v2/Search';

const SearchIndex = ({navigation, route}) => {
  const {setting} = useSettingControl();

  if (setting.provider === 'anitaku') {
    return (
      <View style={{flex: 1}}>
        <SearchV1 navigation={navigation} route={route} />
      </View>
    );
  }
  if (setting.provider === 'aniwatch') {
    return (
      <View style={{flex: 1}}>
        <SearchV2 navigation={navigation} route={route} />
      </View>
    );
  }

};

export default SearchIndex;
