import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import Theme from '../../../../utils/Theme';
import {useQuery} from '@tanstack/react-query';
import VerticalCard from '../../../../components/VerticalCard';
import {fetchSeasonalAnime, fetchUpcoming} from '../../../../Query/v1';
import {MCIcon} from '../../../../utils/contstant';
import SelectDropdown from 'react-native-select-dropdown';
const color = Theme.DARK;
const font = Theme.FONTS;
const tags = [
  {
    id: 'tv-series',
    title: 'TV Series',
  },
  {
    id: 'special',
    title: 'Special',
  },
  {
    id: 'movie',
    title: 'Movie',
  },
  {
    id: 'ova',
    title: 'OVA',
  },
  {
    id: 'ona',
    title: 'ONA',
  },
];
const {width} = Dimensions.get('window');
const UpcomingList = ({navigation, route}) => {
  const {type} = route.params;
  const [refreshing, setRefreshing] = useState(false);
  navigation.setOptions({
    headerTitle: type ? type : 'Upcoming Anime',
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);
  const [page, setPage] = useState(1);
  const {data, isLoading, error} = useQuery({
    queryKey: ['upcoming', page, type, refreshing],
    queryFn: () => fetchUpcoming({type: type, page: page}),
  });
  const memoizedList = useMemo(()=>{
    if(type === tags[0].id){
      return data?.tv_series
    }
    else if(type === tags[1].id){
      return data?.special
    }
    else if(type === tags[2].id){
      return data?.movies
    }
    else if(type === tags[3].id){
      return data?.ova
    }
    else if(type === tags[4].id){
      return data?.ona
    }
  },[type, data,isLoading])

  const renderItem = useCallback(
    ({item, i}) => {
      return (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('anime-info', {
              id: item?.animeID || item?.animeId,
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
    [isLoading,type, memoizedList],
  );
  const onSelectDropDown = useCallback((selectedItem, index) => {
    // console.log(selectedItem);
    navigation.navigate('UpcomingList', {
        type: selectedItem.id,
    })

  }, []);

  const buttonTextAfterSelection = useCallback(
    (selectedItem, index) => selectedItem.title,
    [],
  );
  const rowTextForSelection = useCallback((item, index) => item.title, []);
  const renderDropdownIcon = useCallback(
    () => <MCIcon name={'chevron-down'} color={color.Orange} size={25} />,
    [],
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
        {data?.pages?.map((pg, i) => (
          <TouchableOpacity
            onPress={() => setPage(pg?.page)}
            key={i}
            style={{
              //   flex: 1,
              paddingVertical: 10,
              paddingHorizontal: 15,
              borderRadius: 999,
              borderColor: color.Orange,
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: pg?.page === page ? color.Orange : undefined,
            }}>
            <Text style={{fontFamily: font.OpenSansBold, color: color.White}}>
              {pg?.name || pg?.page}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }, [data?.pages]);
  if (error) {
    Alert.alert('error', error);
  }

  return (
    <View style={styles.container}>
      {isLoading && (
        <ActivityIndicator
          size={30}
          color={color.Red}
          style={{alignSelf: 'center'}}
        />
      )}

      <SelectDropdown
        data={tags}
        renderDropdownIcon={renderDropdownIcon}
        buttonStyle={styles.buttonStyle}
        defaultButtonText="..."
        buttonTextStyle={styles.buttonTextStyle}
        dropdownStyle={styles.dropdownStyle}
        rowTextStyle={styles.rowTextStyle}
        rowStyle={styles.rowStyle}
        selectedRowTextStyle={styles.selectedRowTextStyle}
        selectedRowStyle={styles.selectedRowStyle}
        defaultValue={tags?.find(item => item?.id === type)}
        onSelect={onSelectDropDown}
        buttonTextAfterSelection={buttonTextAfterSelection}
        rowTextForSelection={rowTextForSelection}
      />

      <FlatList
        horizontal={false}
        numColumns={2}
        data={memoizedList}
        keyExtractor={(item, i) => `${item?.animeID || item?.animeId || i}`}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
    </View>
  );
};

export default UpcomingList;

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
  rowTextStyle: {
    fontSize: 14,
    color: color.White,
    textTransform: 'uppercase',
  },
  selectedRowTextStyle: {
    fontSize: 14,
    color: color.White,
    textTransform: 'uppercase',
  },
  dropdownStyle: {
    borderRadius: 5,
    backgroundColor: color.DarkBackGround,
    elevation: 10,
    borderColor: color.LighterGray2,
    borderWidth: 0.2,
  },
  buttonTextStyle: {
    color: color.Orange,
    textTransform: 'uppercase',
    fontSize: 14,
    fontFamily: font.OpenSansBold,
    textAlign: 'right',
  },
  buttonStyle: {
    width: '60%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 99,
  },
  rowStyle: {
    borderColor: 'rgba(255,255,255,0.5)',
  },
  selectedRowStyle: {
    backgroundColor: color.Orange,
  },
});
