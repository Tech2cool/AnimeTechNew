import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import Theme from '../../../../utils/Theme';
import {useQuery} from '@tanstack/react-query';
import {fetchRandom} from '../../../../Query/v1';
import {useFocusEffect} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import VerticalCard from '../../../../components/VerticalCard';
import {F5Icon} from '../../../../utils/contstant';

const color = Theme.DARK;
const font = Theme.FONTS;
const {width} = Dimensions.get('window');
const Random = ({route, navigation}) => {
  const {randomize} = route.params;
  const {data, isLoading, error} = useQuery({
    queryKey: ['random', randomize],
    queryFn: () => fetchRandomAndGo(),
  });
  const fetchRandomAndGo = async () => {
    try {
      const resp = await fetchRandom({id: randomize});
      // if (resp) {
      //   navigation.navigate('anime-info', {id: resp?.animeId || resp?.animeID});
      // }
      return resp;
    } catch (error) {
      return error;
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchRandomAndGo();
    }, []),
  );

  if (error) {
    Alert.alert('error', error);
  }
  const renderItem = useCallback(({item}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('anime-info', {
            id: item?.animeId || item?.animeID,
          })
        }>
        <VerticalCard item={item} width={width * 0.42} height={220} />
      </TouchableOpacity>
    );
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.DarkBackGround,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
      }}>
      {isLoading && (
        <>
          <Text
            style={{
              fontSize: 20,
              color: color.White,
              fontFamily: font.OpenSansMedium,
            }}>
            Generating Random Anime...
          </Text>
          <FastImage
            source={require('../../../../assets/images/gif2.gif')}
            style={{
              width: 150,
              height: 150,
            }}
          />
        </>
      )}
      {!isLoading && (
        <FlatList
          horizontal={false}
          numColumns={2}
          data={data?.list}
          keyExtractor={(item, i) => `${item.animeId || item?.animeID}`}
          renderItem={renderItem}
          columnWrapperStyle={{gap: 10, padding: 5}}
        />
      )}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Random', {
            randomize: new Date().getTime(),
          })
        }
        style={{
          paddingVertical: 12,
          borderColor: color.Orange,
          backgroundColor: 'rgba(0,0,0,0.3)',
          borderWidth: 2,
          paddingHorizontal: 12,
          borderRadius: 999,
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
          bottom: 20,
          right: 10,
        }}>
        <F5Icon name="random" color={color.Orange} size={28} />
      </TouchableOpacity>
    </View>
  );
};

export default Random;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.DarkBackGround,
    position: 'relative',
  },
});
