import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import Theme from '../../../../utils/Theme';
import {F6Icon, IIcon, MCIcon, MIcon, genresList} from '../../../../utils/contstant';
import {useQuery} from '@tanstack/react-query';
import {searchAnime} from '../../../../Query/v1';
import useDebounce from '../../../../components/useDebounce';
import VerticalCard from '../../../../components/VerticalCard';
import FilterModal from './FilterModal';
import { searchAnimeAniwatch } from '../../../../Query/v2';
const color = Theme.DARK;
const font = Theme.FONTS;
const {width} = Dimensions.get('window');
const Search = ({navigation, route}) => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [filteredList, setFilteredList] = useState([]);
  const [modal, setModal] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);
  const [appliedFilter, setAppliedFilter] = useState({
    sort: null,
    suborDub: null,
    type: null,
    year: [],
    status: null,
    season: null,
    genre: [],
  });

  let debounceQuery = useDebounce(query, 500);
  const {data, isLoading, error} = useQuery({
    queryKey: ['search', debounceQuery, page, applyFilter],
    queryFn: () => fetchData(),
  });
  function yearsToParams() {
    if (appliedFilter.year?.length <= 0) return null;
    const resp = appliedFilter.year?.map(Year => {
      return `&year[]=${Year}`;
    });
    // console.log(resp.join(""))
    return resp.join('');
  }

  function genresToParams() {
    if (appliedFilter.genre?.length <= 0) return null;
    const resp = appliedFilter.genre?.map(genre => {
      return `&genre[]=${genre}`;
    });
    // console.log(resp.join(""))
    return resp.join('');
  }
  const handleSortApply = (data_list) => {
    if (appliedFilter.sort == "Year-asc") {
        setFilteredList(data_list ? data_list:data?.animes.sort((a,b)=> parseInt(a?.year) - parseInt(b?.year)))
    } if (appliedFilter.sort == "Year-desc") {
        setFilteredList(data_list ? data_list:data?.animes.sort((a,b)=> parseInt(b?.year) - parseInt(a?.year)))
    }else{
        setFilteredList([])
    }
  };

  const fetchData = async () => {
    try {
      const resp = await searchAnimeAniwatch({
        query: query === '' ? ' ' : query,
        page,
      });
      // handleSortApply(resp?.list)

      return resp;
    } catch (error) {
      return null;
    }
  };

  const renderItem = useCallback(
    ({item, i}) => {
      return (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('anime-info', {
              id: item?.animeID || item?.animeId || item?.id,
              provider: "aniwatch"
            })
          }>
          <VerticalCard
            item={item}
            width={160}
            height={220}
            moreheight={true}
          />
        </TouchableOpacity>
      );
    },
    [isLoading],
  );

  const footerComponent = useCallback(() => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          gap: 10,
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {data?.pageInfo?.pages?.map((pg, i) => (
          <TouchableOpacity
            onPress={() => setPage(pg?.page)}
            key={pg.index}
            style={{
              //   flex: 1,
              paddingVertical: 10,
              paddingHorizontal: 15,
              borderRadius: 999,
              borderColor: color.Orange,
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: pg?.isCurrent ? color.Orange : undefined,
            }}>
            <Text style={{fontFamily: font.OpenSansBold, color: color.White}}>
              {pg?.title || pg?.page}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }, [data?.pageInfo?.pages]);

  if (error) {
    Alert.alert('error', error?.message);
  }

  return (
    <View style={styles.container}>
      <View style={styles.Container2}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.search}
            value={query}
            onChangeText={text => setQuery(text)}
            placeholder="search...."
          />
          <TouchableOpacity>
            <MIcon name="search" color={color.Orange} size={30} />
          </TouchableOpacity>
        </View>
        <View style={{position: 'relative', overflow: 'hidden'}}>
          <TouchableOpacity onPress={() => setModal(!modal)}>
            <IIcon name="options-outline" size={30} color={color.White} />
          </TouchableOpacity>
        </View>
      </View>
      {isLoading && (
        <ActivityIndicator
          size={30}
          color={color.Red}
          style={{alignSelf: 'center'}}
        />
      )}
      <FlatList
        horizontal={false}
        numColumns={2}
        data={data?.animes}
        keyExtractor={(item, i) => `${item?.animeID || item?.animeId || item?.id}`}
        renderItem={renderItem}
        ListFooterComponent={footerComponent}
        ListFooterComponentStyle={{
          paddingBottom: 30,
          paddingTop: 10,
          paddingHorizontal: 10,
          flex: 1,
        }}
        columnWrapperStyle={{
          flex: 1,
          gap: 10,
          justifyContent: 'center',
          padding: 5,
        }}
      />
      <FilterModal
        applyFilter={applyFilter}
        setApplyFilter={setApplyFilter}
        appliedFilter={appliedFilter}
        setAppliedFilter={setAppliedFilter}
        setModal={setModal}
        modal={modal}
        handleSortApply={handleSortApply}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.DarkBackGround,
  },
  Container2: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 5,
    paddingBottom: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: color.DarkBackGround,
    borderColor: color.LighterGray,
    borderWidth: 0.5,
    padding: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
  },
  search: {
    padding: 5,
    width: '75%',
  },
});
