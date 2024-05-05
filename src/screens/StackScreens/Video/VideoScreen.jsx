import React from 'react';
import V1 from './V1';
import Theme from '../../../utils/Theme';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import { useSettingControl } from '../../../context/SettingsControlContext';
import V2 from './v2/V2';

const color =Theme.DARK
const VideoScreen = ({route, navigation}) => {
  // const {setting}= useSettingControl()
  const {id, episodeId, episodeNum, provider} = route.params;

  if(provider === "anitaku"){
    return(
    <View style={styles.container}>
      <V1 id={id} episodeId={episodeId} episodeNum={episodeNum} provider={provider}/>
    </View>
    )
  }
  if(provider === "aniwatch"){
    return(
    <View style={styles.container}>
      <V2 id={id} episodeId={episodeId} episodeNum={episodeNum} provider={provider}/>
    </View>
    )
  }
};

export default VideoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.DarkBackGround,
  },
});
