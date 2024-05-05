import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo} from 'react';
import Theme from '../../../../../utils/Theme';
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
const VideoSourcesServerComponent = ({episodeId, servers = []}) => {
  return (
    <View>
      {servers?.sub?.length > 0 && (
        <View
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
            Sub:{' '}
          </Text>

          {servers?.sub?.map(item => (
            <TouchableOpacity
              // onPress={() => setServer(item)}
              key={item?.serverId || item?.serverName}
              style={{
                // backgroundColor: server === item.server ? color.Orange : undefined,
                borderColor: color.Orange,
                borderWidth: 1,
                padding: 5,
                borderRadius: 10,
                flex: 0,
                alignSelf: 'flex-start',
              }}>
              <Text style={{color: color.White, textTransform: 'uppercase'}}>
                {item?.serverName}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {servers?.dub?.length > 0 && (
        <View
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
            Dub:{' '}
          </Text>

          {servers?.dub?.map(item => (
            <TouchableOpacity
              // onPress={() => setServer(item)}
              key={item?.serverId || item?.serverName}
              style={{
                // backgroundColor: server === item.server ? color.Orange : undefined,
                borderColor: color.Orange,
                borderWidth: 1,
                padding: 5,
                borderRadius: 10,
                flex: 0,
                alignSelf: 'flex-start',
              }}>
              <Text style={{color: color.White, textTransform: 'uppercase'}}>
                {item?.serverName}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default memo(VideoSourcesServerComponent);

const styles = StyleSheet.create({});
