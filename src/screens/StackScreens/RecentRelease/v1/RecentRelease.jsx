import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import Theme from '../../../../utils/Theme';
import {useQuery} from '@tanstack/react-query';
import {fetchRecentRelease} from '../../../../Query/v1';
import VerticalCard from '../../../../components/VerticalCard';
const color = Theme.DARK;
const font = Theme.FONTS;
const {width} = Dimensions.get('window');
const RecentRelease = ({navigation, route}) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);
  const [page, setPage] = useState(1);
  const {data, isLoading, error} = useQuery({
    queryKey: ['RecentRelease', page, refreshing],
    queryFn: () => fetchRecentRelease({page: page}),
  });

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
    Alert.alert('error', error?.message);
  }
  if (isLoading) {
    <ActivityIndicator
      size={30}
      color={color.Red}
      style={{alignSelf: 'center'}}
    />;
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
      <FlatList
        horizontal={false}
        numColumns={2}
        data={data?.list?.sort((a, b) => a?.index - b?.index)}
        keyExtractor={(item, i) => `${item?.animeID || item?.animeId}`}
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

export default RecentRelease;

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
