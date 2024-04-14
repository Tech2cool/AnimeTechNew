import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Theme from '../../../utils/Theme';
import {fetchPopularAnime} from '../../../utils/functions';
import HorizontalAnimeCard from '../../../components/HorizontalAnimeCard';
import SkeletonSlider from '../../../components/SkeletonSlider';
import { useQuery, useQueryClient } from '@tanstack/react-query';
const color = Theme.DARK;
const font = Theme.FONTS;
const {width, height} = Dimensions.get('window');
const sortLists = [
  {
    name: 'all',
    value: '',
  },
  {
    name: 'finished',
    value: 'finished',
  },
  {
    name: 'ongoing',
    value: 'ongoing',
  },
  {
    name: 'sub',
    value: 'sub',
  },
  {
    name: 'dub',
    value: 'dub',
  },
];
const Popular = ({navigation, routes}) => {
  // const [popular, setPopular] = useState([])
  const [filterpopular, setFilterPopular] = useState([]);
  const [filter, setFilter] = useState({
    name: 'all',
    value: '',
  });
  const queryClient = useQueryClient()


  // const [isLoading, setisLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false);

  const [pages, setPages] = useState({
    currentPage: 1,
    pagesArray: [],
    totalPages: 1,
  });

  const setPagesArr = (currentPage, totalPages) => {
    if (currentPage < 5) {
      let arr = [];
      for (i = 1; i <= parseInt(totalPages); i++) {
        arr.push(i);
      }
      // console.log(arr)
      return arr;
    } else {
      let arr = [1, 2, '..'];
      for (i = parseInt(currentPage); i <= parseInt(totalPages); i++) {
        arr.push(i);
      }
      // console.log(arr)
      return arr;
    }
  };

  const {
    data: popular,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['popular', pages.currentPage, refreshing],
    queryFn: () => fetchpopular(pages.currentPage),
    staleTime: 1000 * 60 * 60,
  });

  const fetchpopular = async page => {
    const resp = await fetchPopularAnime(page);
    // console.log(resp?.list[0])
    let arr = setPagesArr(page, resp?.totalPages);
    
    setPages(prev => ({
      ...prev,
      // currentPage: parseInt(page),
      totalPages: parseInt(resp?.totalPages),
      pagesArray: arr,
    }));
    return resp?.list?.length > 0 ? resp?.list : [];
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // fetchpopular(1)
    if(pages.pagesArray.length === 0){
        queryClient.invalidateQueries({ queryKey: ['popular'] })
    }

    setPages(prev => ({
      ...prev,
      currentPage: parseInt(1),
    }));
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const goToInfo = id => {
    navigation.navigate('anime-info', {
      animeId: id,
    });
  };

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <TouchableOpacity onPress={() => goToInfo(item?.animeID)}>
          <HorizontalAnimeCard anime={item} />
        </TouchableOpacity>
      );
    },
    [popular, filterpopular, filter, isLoading, refreshing],
  );

  const handlePageNum = page => {
    if (page === '..') {
      const findClosetPage = pages.pagesArray.find((page, i) => {
        if (page === page) {
          return pages.pagesArray[i - 1];
        }
      });
      if (findClosetPage !== -1) {
        // fetchRecent(findClosetPage)
        setPages(prev => ({
          ...prev,
          currentPage: parseInt(findClosetPage),
        }));
      }
    } else {
      // fetchRecent(page)
      setPages(prev => ({
        ...prev,
        currentPage: parseInt(page),
      }));
    }
  };

  const handleSortPress = item => {
    // console.log(item)
    switch (item.value) {
      case sortLists[1].value: {
        const filterpopular = popular.filter(
          anim =>
            anim?.status?.toLowerCase() === sortLists[1].value?.toLowerCase() ||
            anim?.AdditionalInfo?.status?.toLowerCase() ===
              sortLists[1].value?.toLowerCase(),
        );
        // console.log(filterpopular.length)
        setFilterPopular(filterpopular);
        setFilter(item);
        // console.log("Finishing Sort")
        break;
      }
      case sortLists[2].value: {
        const filterpopular = popular.filter(
          anim =>
            anim?.AdditionalInfo?.status?.toLowerCase() === 'current' ||
            anim?.AdditionalInfo?.status?.toLowerCase() === 'ongoing' ||
            anim?.status?.toLowerCase() === 'current' ||
            anim?.status?.toLowerCase() === 'ongoing',
        );
        setFilterPopular(filterpopular);
        setFilter(item);
        // console.log("ongoing Sort")
        break;
      }
      case sortLists[3].value: {
        const filterpopular = popular.filter(
          anim =>
            anim?.subOrDub?.toLowerCase() === sortLists[3].value?.toLowerCase(),
        );
        setFilterPopular(filterpopular);
        setFilter(item);
        // console.log("Sub Sort")
        break;
      }
      case sortLists[4].value: {
        const filterpopular = popular.filter(
          anim =>
            anim?.subOrDub?.toLowerCase() === sortLists[4].value?.toLowerCase(),
        );
        setFilterPopular(filterpopular);
        setFilter(item);
        // console.log("Dub Sort")
        break;
      }
      default: {
        setFilterPopular([]);
        setFilter(sortLists[0]);
        // console.log("Default Sort")
        break;
      }
    }
  };

  const listHeader = useCallback(() => {
    return (
      <>
        <ScrollView horizontal={true}>
          {sortLists.map((item, i) => (
            <TouchableOpacity
              key={item.name}
              onPress={() => handleSortPress(item)}
              style={[
                styles.sortBtns,
                {
                  backgroundColor:
                    filter?.name === item?.name ? color.Orange : undefined,
                },
              ]}>
              <Text style={styles.filterText}>{item?.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </>
    );
  }, [filter]);

  const handlePressNext = () => {
    if (pages.currentPage >= pages.totalPages) return;
    // fetchRecent(parseInt(pages.currentPage) + 1)
    setPages(prev => ({
      ...prev,
      currentPage: parseInt(prev.currentPage) + 1,
    }));
  };

  const handlePressPrev = () => {
    if (pages.currentPage > 1) return;
    // fetchRecent(parseInt(pages.currentPage) - 1)
    setPages(prev => ({
      ...prev,
      currentPage: parseInt(prev.currentPage) - 1,
    }));
  };

  const listFooter = useCallback(() => {
    return (
      <View style={styles.btnsContainer}>
        <Pressable style={styles.btns} onPress={handlePressPrev}>
          <Text style={styles.btnText}>Prev</Text>
        </Pressable>
        {pages.pagesArray.map(page => (
          <Pressable
            key={page}
            onPress={() => handlePageNum(page)}
            style={[
              styles.btnNumbers,
              {
                backgroundColor:
                  pages.currentPage === page ? color.AccentBlue : undefined,
              },
            ]}>
            <Text style={styles.btnNumbersText}>{page}</Text>
          </Pressable>
        ))}
        <Pressable style={styles.btns} onPress={handlePressNext}>
          <Text style={styles.btnText}>Next</Text>
        </Pressable>
      </View>
    );
  }, [pages.currentPage, pages.totalPages]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <FlatList
          data={[1, 2, 3, 4, 5, 6, 7]}
          keyExtractor={(item, index) => `${item}-${index}-PopularStackSkeleton`}
          ListHeaderComponent={listHeader}
          ListFooterComponent={listFooter}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({item}) => {
            return (
              <View style={{marginVertical: 5}}>
                <SkeletonSlider
                  width={width * 0.95}
                  height={130}
                  opacity={1}
                  borderRadius={10}
                />
              </View>
            );
          }}
        />
      ) : (
        <FlatList
          data={filterpopular.length > 0 ? filterpopular : popular}
          keyExtractor={(item, index) => `${item.animeID}-${index}-popularStackFlatList`}
          renderItem={renderItem}
          ListHeaderComponent={listHeader}
          ListFooterComponent={listFooter}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

export default Popular;

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.DarkBackGround,
    flex: 1,
  },
  btnsContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  btns: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: color.AccentBlue,
    borderRadius: 10,
  },
  btnNumbers: {
    width: 25,
    height: 25,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnNumbersText: {
    fontFamily: font.OpenSansBold,
    color: color.White,
    fontSize: 14,
  },
  btnText: {
    fontFamily: font.OpenSansBold,
    color: color.White,
  },
  sortBtns: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderColor: color.LighterGray,
    borderWidth: 1,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  filterText: {
    fontFamily: font.OpenSansMedium,
    textTransform: 'capitalize',
  },
});
