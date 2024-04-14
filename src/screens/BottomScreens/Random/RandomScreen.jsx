import {View, Text, Alert} from 'react-native';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import Theme from '../../../utils/Theme';
// import AnimeDetails from './SmallComp/AnimeDetails';
import {fetchRandomAnime} from '../../../utils/functions';
import AnimeDetails from './SmallComp/AnimeDetails';
import { useFocusEffect } from '@react-navigation/native';
const color = Theme.DARK;
const font = Theme.FONTS;
const RandomScreen = ({navigation, route}) => {
    const { randomize } = route.params;
    const [animeId, setAnimeId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchRandom = async () => {
    try {
      setIsLoading(true);
      const resp = await fetchRandomAnime();
    //   navigation.navigate('anime-info', {
    //     animeId: resp?.animeID,
    //   });
        setAnimeId(resp?.animeID)
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      Alert.alert('Error', 'server Error try Again');
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchRandom();
    }, [])
  );
  useEffect(() => {
    fetchRandom()
  }, [randomize]);


  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.DarkBackGround,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
      }}>
      {isLoading ? (
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
            source={require('../../../assets/images/gif2.gif')}
            style={{
              width: 150,
              height: 150,
            }}
          />
        </>
      ) : (
        <AnimeDetails animeId={animeId} />
      )}
    </View>
  );
};

export default RandomScreen;
