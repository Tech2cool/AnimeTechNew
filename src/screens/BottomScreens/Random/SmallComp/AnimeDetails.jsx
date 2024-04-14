import {
  Dimensions,
  FlatList,
  RefreshControl,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {fetchAnimeInfo, fetchEpisodes, generateDynamicLink} from '../../../../utils/functions';
import SkeletonSlider from '../../../../components/SkeletonSlider';
import Theme from '../../../../utils/Theme';
import {useLanguage} from '../../../../contexts/LanguageContext';
import {F5Icon, MCIcon, MIcon} from '../../../../utils/contstant';
import {useNavigation} from '@react-navigation/native';
import DropDownSelect from '../../../StackScreens/AnimeInfo/SmallComponents/DropDownSelect';
import FastImage from 'react-native-fast-image';
import RandomColorCard from '../../../../components/RandomColorCard';
import VerticalAnimeCard from '../../../../components/VerticalAnimeCard';
import EpisodeCard from '../../../../components/EpisodeCard';
const dataRelated = [
  {
    name: 'season',
    nameBig: 'seasons',
    value: 'sequalOrPrequal',
  },
  {
    name: 'movies',
    nameBig: 'movies',
    value: 'movies',
  },
  {
    name: 'ova',
    nameBig: "ova's",
    value: 'ova',
  },
  {
    name: 'ona',
    nameBig: "ona's",
    value: 'ona',
  },
];

const color = Theme.DARK;
const font = Theme.FONTS;
const {width, height} = Dimensions.get('window');
const LoadingArray = [0, 1, 2, 3, 4, 5, 6];
let oldAnimeId = null;
const AnimeDetails = params => {
  const {animeId, aniwatchId} = params;
  const {currentLang} = useLanguage();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  // console.log(animeId)
  // const [anime, setAnime] = useState({})
  // const [episodes, setEpisodes] = useState([])
  const [showMoreDesc, setShowMoreDesc] = useState(false);
  // const [isLoading, setIsLoading] = useState(false)
  // const [isLoadingEP, setIsLoadingEP] = useState(false)
  const [selected, setSelected] = useState({
    name: 'season',
    value: 'sequalOrPrequal',
    nameBig: 'seasons',
  });

  const fetchAnime = async (animeId, aniwatchId) => {
    const response = await fetchAnimeInfo(animeId, aniwatchId);
    // console.log(response?.genres)
    // setAnime(response)
    return response || {};
  };
  const {
    data: anime,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['anime-info', animeId, aniwatchId, refreshing],
    queryFn: () => fetchAnime(animeId, aniwatchId),
    // staleTime: 1000 * 60 * 60,
  });

  const {
    data: episodes,
    isLoading: isLoadingEP,
    error: errorEp,
  } = useQuery({
    queryKey: [
      'episodes',
      animeId,
      anime?.AdditionalInfo?.id,
      aniwatchId ? aniwatchId : anime?.aniwatchInfo?.anime?.info?.id,
      refreshing,
    ],
    queryFn: () =>
      fetchEpisode(
        animeId,
        anime?.AdditionalInfo?.id,
        aniwatchId ? aniwatchId : anime?.aniwatchInfo?.anime?.info?.id,
      ),
    // staleTime: 1000 * 60 * 60,
  });

  const fetchEpisode = async (animeId, kitsuId, aniwatchId) => {
    const response = await fetchEpisodes(animeId, kitsuId, aniwatchId);
    return response?.length > 0 ? response : [];
  };
  const handleShare = async () => {
    const link = await generateDynamicLink(
      'anime',
      animeId,
      null,
      null,
      anime.animeImg,
      `${memoizedAnimeTitle}`,
      '',
      anime?.AdditionalInfo?.id,
    );

    Share.share({
      message: link,
    });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // fetchairing(1)
    // fetchAnime();
    // fetchEpisode();
    fetchAnime(animeId)
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const memoizedPoster = useMemo(() => {
    if (anime?.animeImg) {
      return anime?.animeImg;
    } else if (anime?.AdditionalInfo?.posterImage?.original) {
      return anime?.AdditionalInfo?.posterImage?.original;
    } else if (anime?.AdditionalInfo?.posterImage?.large) {
      return anime?.AdditionalInfo?.posterImage?.large;
    } else if (anime?.AdditionalInfo?.posterImage?.medium) {
      return anime?.AdditionalInfo?.posterImage?.medium;
    } else if (anime?.AdditionalInfo?.posterImage?.small) {
      return anime?.AdditionalInfo?.posterImage?.small;
    } else if (anime?.AdditionalInfo?.posterImage?.tiny) {
      return anime?.AdditionalInfo?.posterImage?.tiny;
    } else {
      return 'https://cdn1.vectorstock.com/i/1000x1000/32/45/no-image-symbol-missing-available-icon-gallery-vector-45703245.jpg';
    }
  }, [anime?.animeImg, anime?.AdditionalInfo?.posterImage]);

  const memoizedAnimeTitle = useMemo(() => {
    if (currentLang === 'en') {
      if (anime?.animeTitle?.english) {
        return anime?.animeTitle?.english;
      } else if (anime?.animeTitle?.english_jp) {
        return anime?.animeTitle?.english_jp;
      }
    } else {
      if (anime?.animeTitle?.english_jp) {
        return anime?.animeTitle?.english_jp;
      } else if (anime?.animeTitle?.japanese) {
        return anime?.animeTitle?.japanese;
      }
    }
  }, [anime?.animeTitle, currentLang, isLoading]);

  const memoizedStatus = useMemo(() => {
    if (isLoading) {
      return (
        <SkeletonSlider width={120} height={35} opacity={1} borderRadius={10} />
      );
    } else {
      if (anime?.status) {
        const title = anime?.status;
        return <RandomColorCard title={`Status: ${title}`} />;
      } else if (anime?.AdditionalInfo?.status) {
        const title =
          anime?.AdditionalInfo?.status === 'current'
            ? 'ongoing'
            : anime?.AdditionalInfo?.status;
        return <RandomColorCard title={`Status: ${title}`} />;
      }
    }
  }, [anime?.status, anime?.AdditionalInfo?.status, isLoading]);

  const memoizedYear = useMemo(() => {
    if (isLoading) {
      return (
        <SkeletonSlider width={100} height={35} opacity={1} borderRadius={10} />
      );
    } else {
      if (anime?.year) {
        const title = anime?.year;
        return <RandomColorCard title={`Year: ${title}`} />;
      } else if (anime?.AdditionalInfo?.startDate) {
        const title = anime?.AdditionalInfo?.startDate?.split('-')[0];
        return <RandomColorCard title={`Year: ${title}`} />;
      }
    }
  }, [anime?.year, anime?.AdditionalInfo?.startDate, isLoading]);

  const memoizedGenre = useMemo(() => {
    return (
      <>
        {isLoading
          ? [0, 1, 2, 3, 4]?.map((item, i) => (
              <SkeletonSlider
                key={item + i}
                width={100}
                height={35}
                opacity={1}
                borderRadius={10}
              />
            ))
          : anime?.genres?.map((genre, i) => (
              <RandomColorCard title={genre} key={genre + i} />
            ))}
      </>
    );
  }, [anime?.genres, isLoading]);

  const memoizedDesc = useMemo(() => {
    if (isLoading) {
      return (
        <SkeletonSlider
          width={width * 0.95}
          height={80}
          opacity={1}
          borderRadius={3}
        />
      );
    } else {
      if (anime?.synopsis) {
        return (
          <View style={styles.showMoreDescContainer}>
            <Text numberOfLines={!showMoreDesc ? 3 : undefined}>
              {anime?.synopsis}
            </Text>
            <TouchableOpacity
              style={styles.showMoreDesc}
              onPress={() => setShowMoreDesc(!showMoreDesc)}>
              <Text
                style={{
                  color: color.AccentBlue,
                  fontFamily: font.OpenSansBold,
                }}>
                {showMoreDesc ? 'Show Less' : 'Show More'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      } 
      else if (anime?.description) {
        return (
          <View style={styles.showMoreDescContainer}>
            <Text numberOfLines={!showMoreDesc ? 3 : undefined}>
              {anime?.description}
            </Text>
            <TouchableOpacity
              style={styles.showMoreDesc}
              onPress={() => setShowMoreDesc(!showMoreDesc)}>
              <Text
                style={{
                  color: color.AccentBlue,
                  fontFamily: font.OpenSansBold,
                }}>
                {showMoreDesc ? 'Show Less' : 'Show More'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      }
      else if ((anime?.AdditionalInfo?.synopsis, isLoading)) {
        return (
          <View style={styles.showMoreDescContainer}>
            <Text numberOfLines={!showMoreDesc ? 3 : undefined}>
              {anime?.AdditionalInfo?.synopsis}
            </Text>
            <TouchableOpacity
              style={styles.showMoreDesc}
              onPress={() => setShowMoreDesc(!showMoreDesc)}>
              <Text
                style={{
                  color: color.AccentBlue,
                  fontFamily: font.OpenSansBold,
                }}>
                {showMoreDesc ? 'Show Less' : 'Show More'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      } else if (anime?.AdditionalInfo?.description) {
        return (
          <View style={styles.showMoreDescContainer}>
            <Text numberOfLines={!showMoreDesc ? 3 : undefined}>
              {anime?.AdditionalInfo?.description}
            </Text>
            <TouchableOpacity
              style={styles.showMoreDesc}
              onPress={() => setShowMoreDesc(!showMoreDesc)}>
              <Text
                style={{
                  color: color.AccentBlue,
                  fontFamily: font.OpenSansBold,
                }}>
                {showMoreDesc ? 'Show Less' : 'Show More'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      }
      else if (anime?.anilist?.description) {
        return (
          <View style={styles.showMoreDescContainer}>
            <Text numberOfLines={!showMoreDesc ? 3 : undefined}>
              {anime?.anilist?.description}
            </Text>
            <TouchableOpacity
              style={styles.showMoreDesc}
              onPress={() => setShowMoreDesc(!showMoreDesc)}>
              <Text
                style={{
                  color: color.AccentBlue,
                  fontFamily: font.OpenSansBold,
                }}>
                {showMoreDesc ? 'Show Less' : 'Show More'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      }
    
    }
  }, [
    showMoreDesc,
    isLoading,
    anime?.synopsis,
    anime?.description,
    anime?.anilist?.description,
    anime?.AdditionalInfo?.synopsis,
    anime?.AdditionalInfo?.description,
  ]);

  const memoizedAgeRating = useMemo(() => {
    if (isLoading) {
      return (
        <SkeletonSlider width={150} height={35} opacity={1} borderRadius={10} />
      );
    } else if (anime?.AdditionalInfo?.ageRatingGuide) {
      return (
        <RandomColorCard
          title={`${anime?.AdditionalInfo?.ageRating} ${anime?.AdditionalInfo?.ageRatingGuide}`}
        />
      );
    }
  }, [anime?.AdditionalInfo?.startDate, isLoading]);

  const memoizedTotalEpisode = useMemo(() => {
    if (isLoading) {
      return (
        <SkeletonSlider width={150} height={35} opacity={1} borderRadius={10} />
      );
    } else if (anime?.totalEpisodes) {
      return (
        <RandomColorCard title={`Totoal Episodes: ${anime?.totalEpisodes}`} />
      );
    }
  }, [anime?.totalEpisodes, isLoading]);

  const memoizediSDub = useMemo(() => {
    if (isLoading) {
      return (
        <SkeletonSlider width={60} height={35} opacity={1} borderRadius={10} />
      );
    } else if (anime?.totalEpisodes) {
      return <RandomColorCard title={`${anime?.isDub ? 'Dub' : 'sub'}`} />;
    }
  }, [anime?.isDub, isLoading]);

  const memoizedAnimeType = useMemo(() => {
    if (isLoading) {
      return (
        <SkeletonSlider width={120} height={35} opacity={1} borderRadius={10} />
      );
    } else if (anime?.totalEpisodes) {
      return <RandomColorCard title={`${anime?.type}`} />;
    }
  }, [anime?.type, isLoading]);

  const memoizedSeason = useMemo(() => {
    if (isLoading) {
      return (
        <SkeletonSlider width={120} height={35} opacity={1} borderRadius={10} />
      );
    } else if (anime?.totalEpisodes) {
      return <RandomColorCard title={`Season: ${anime?.season}`} />;
    }
  }, [anime?.season, isLoading]);

  const memoizedRating = useMemo(() => {
    if (isLoading) {
      return (
        <SkeletonSlider width={120} height={35} opacity={1} borderRadius={10} />
      );
    } else if (anime?.aniwatchInfo?.moreInfo?.malscore) {
      return (
        <RandomColorCard title={`${anime?.aniwatchInfo?.moreInfo?.malscore}`} />
      );
    }
  }, [anime?.aniwatchInfo?.moreInfo?.malscore, isLoading]);

  const renderItem = useCallback(
    ({item, index}) => {
      if (isLoadingEP) {
        return (
          <View style={{marginVertical: 5}}>
            <SkeletonSlider
              width={width * 0.95}
              height={120}
              opacity={1}
              borderRadius={10}
            />
          </View>
        );
      } else {
        return (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('video', {
                animeId: animeId,
                kitsuId: anime?.AdditionalInfo?.id,
                episodeId: item?.id,
                episodeNum: item?.number,
                aniwatchId: aniwatchId,
              })
            }>
            <EpisodeCard episode={item} anime={anime} />
          </TouchableOpacity>
        );
      }
    },
    [episodes, currentLang, isLoadingEP],
  );

  const headerComp = () => {
    return (
      <>
        {isLoading ? (
          <SkeletonSlider
            width={width}
            height={height / (16 / 12)}
            opacity={0.13}
          />
        ) : (
          <FastImage style={styles.poster} source={{uri: memoizedPoster}} />
        )}

        <View style={styles.InfoContainer}>
          {isLoading ? (
            <SkeletonSlider width={width * 0.92} height={20} opacity={1} />
          ) : (
            <Text numberOfLines={3} style={styles.Title}>
              {memoizedAnimeTitle}
            </Text>
          )}
          <View style={styles.CardContainer}>
            {/* <Text>{anime?.aniwatchInfo?.moreInfo?.malscore || "idk"}</Text> */}
            {memoizedRating}
            {memoizedYear}
            {memoizedStatus}
            {memoizedGenre}
            {memoizedAgeRating}
            {memoizedTotalEpisode}
            {memoizediSDub}
            {/* {memoizedSeason} */}
            {memoizedAnimeType}
            {memoizedDesc}
          </View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: color.White,
                  fontSize: 12,
                  fontFamily: font.OpenSansBold,
                  textTransform: 'uppercase',
                }}>
                {selected?.nameBig}
              </Text>
              <DropDownSelect
                selected={selected}
                setSelected={setSelected}
                data={dataRelated}
              />
            </View>
            {memoizedFLatListRelated}
          </View>
          {episodes?.length > 0 ? (
            <View
              style={{borderBottomWidth: 0.3, borderColor: color.LighterGray}}>
              <Text style={{fontFamily: font.OpenSansBold, color: color.White}}>
                Total Episodes: {episodes?.length}
              </Text>
            </View>
          ) : (
            <View
              style={{borderBottomWidth: 0.3, borderColor: color.LighterGray}}>
              <Text style={{fontFamily: font.OpenSansBold, color: color.White}}>
                No Episode Found
              </Text>
            </View>
          )}
        </View>
      </>
    );
    // }
  };

  const memoizedFLatList = useMemo(() => {
    return (
      <FlatList
        data={isLoadingEP ? LoadingArray : episodes}
        keyExtractor={
          isLoadingEP
            ? (item, index) => `${index}-animeIfo-Episodes-Skeleton`
            : (item, index) => `${item?.id}-${index}-animeIfo-Episodes-FlatList`
        }
        renderItem={renderItem}
        ListHeaderComponent={headerComp}
        ListFooterComponent={() => (
          <>
            <View style={{marginVertical: 10}}></View>
          </>
        )}
        ListEmptyComponent={() => (
          <>
            <Text>No Info Found</Text>
          </>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    );
  }, [episodes, currentLang, isLoading, isLoadingEP, showMoreDesc, selected]);

  const memoizedFLatListRelated = useMemo(() => {
    return (
      <FlatList
        data={
          isLoading
            ? LoadingArray
            : anime?.relatedAddtional &&
              anime?.relatedAddtional[selected?.value]
        }
        horizontal={true}
        keyExtractor={
          isLoading
            ? (item, index) => `${index}-animeIfo-related-Skeleton`
            : (item, index) =>
                `${item?.animeID}-${index}-animeIfo-related-FlatList`
        }
        renderItem={({item}) => {
          if (isLoading) {
            return (
              <View style={{marginHorizontal: 10}}>
                <SkeletonSlider width={145} height={210} borderRadius={10} />
              </View>
            );
          }
          return (
            <>
              <TouchableOpacity
                disabled={item?.animeID === animeId}
                onPress={() => {
                  navigation.navigate('anime-info', {animeId: item?.animeID});
                }}>
                <VerticalAnimeCard
                  anime={item}
                  showPrequalText={true}
                  currentAnimeId={animeId}
                />
              </TouchableOpacity>
            </>
          );
        }}
        ListFooterComponent={() => (
          <>
            <View style={{marginVertical: 10}}></View>
          </>
        )}
        ListEmptyComponent={() => (
          <>
            <Text style={{textTransform: 'capitalize'}}>
              No Related {selected?.nameBig}
            </Text>
          </>
        )}
      />
    );
  }, [anime, currentLang, isLoading, selected]);

  return (
    <View style={styles.container}>
      {memoizedFLatList}
      <View style={styles.Overlay}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MIcon name="arrow-back" size={30} color={color.White} />
        </TouchableOpacity>
        <View style={{flexDirection:"row", alignItems:"center", gap:10,}}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Random',{
            randomize:Math.floor(Math.random()*101)+1,
          })}
          style={{
            backgroundColor: "rgba(255,180, 45,0.9)",
            borderRadius: 10,
            padding: 8,
            flexDirection: 'row',
            gap: 10,
          }}>
          <F5Icon name="random" size={20} color={color.White} />
          <Text style={{fontFamily: font.OpenSansBold, color: color.White}}>
            Randomize
          </Text>
          {/* <MIcon name="arrow-back" size={30} color={color.White} /> */}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleShare}>
          <MCIcon name="dots-vertical" size={30} color={color.White} />
        </TouchableOpacity>

        </View>
      </View>
    </View>
  );
};

export default AnimeDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.DarkBackGround,
    position: 'relative',
  },

  Overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 10,
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'space-between',
  },
  poster: {
    width: width,
    height: height / (16 / 12),
    resizeMode: 'cover',
  },
  InfoContainer: {
    gap: 10,
    padding: 5,
    paddingHorizontal: 5,
  },
  Title: {
    fontFamily: font.OpenSansBold,
    fontSize: 16,
    color: color.Orange,
  },
  CardContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  showMoreDescContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    // padding:2,
  },
  showMoreDesc: {
    borderWidth: 2,
    borderColor: color.AccentBlue,
    backgroundColor: color.White,
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
});
