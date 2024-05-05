import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { memo } from 'react';
import Theme from '../../../../utils/Theme';
const color = Theme.DARK;
const font = Theme.FONTS;
const defaultSv = [
  {
    id: 1,
    name: 'VidStreaming',
    server: 'vidstreaming',
  },
  {
    id: 2,
    name: 'StreamSb',
    server: 'streamsb',
  },
];
const VideoSourcesServerComponent = ({
  episodeId,
  server = 'vidstreaming',
  setServer,
  serverList = [],
}) => {
  const list = serverList.length ? serverList : defaultSv;
  return (
    <View
      horizontal={true}
      style={{
        flexDirection: 'row',
        gap: 5,
        borderColor: color.LighterGray,
        borderWidth: 1,
        padding: 5,
        margin: 4,
        alignItems: 'center',
      }}>
      <Text style={{fontFamily: font.OpenSansBold, color: color.White}}>
        Server:{' '}
      </Text>

      {list.map(item => (
        <TouchableOpacity
          onPress={() => setServer(item.server)}
          key={item.id || item.server}
          style={{
            backgroundColor:
              server === item.server ? color.Orange : undefined,
            borderColor: color.Orange,
            borderWidth: 1,
            padding: 5,
            borderRadius: 10,
            flex: 0,
            alignSelf: 'flex-start',
          }}>
          <Text style={{color: color.White}}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default memo(VideoSourcesServerComponent);

const styles = StyleSheet.create({});
