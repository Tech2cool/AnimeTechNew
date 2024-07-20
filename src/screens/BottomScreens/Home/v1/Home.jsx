import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import Theme from '../../../../utils/Theme';
import BigImageSlider from './components/BigImageSlider';
import RecentRelease from './components/RecentRelease';
import TrendingRelease from './components/TrendingRelease';
import PopularRelease from './components/PopularRelease';
import MoviesRelease from './components/MoviesRelease';
import VersionChecker from '../../../../components/VersionChecker';
import SmallImageSlider from './components/SmallImageSlider';
import {useQuery} from '@tanstack/react-query';
import {fetchHome, fetchUpcoming} from '../../../../Query/v1';
import UpcomingAnimes from './components/gogotakuInfo/UpcomingAnimes';
import SliderGogotaku from './components/gogotakuInfo/SliderGogotaku';
import Trailers from './components/gogotakuInfo/Trailers';
import RequestedList from './components/gogotakuInfo/RequestedList';
import SeasonalList from './components/gogotakuInfo/SeasonalList';
import HeaderHome from '../../../../components/HeaderHome';
const color = Theme.DARK;
const font = Theme.FONTS;

const Home = ({navigation, route}) => {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const {
    data: gogotaku,
    isLoading: isLoadingGogotaku,
    error: errorGogotaku,
  } = useQuery({
    queryKey: ['gogotaku_home', refreshing],
    queryFn: () => fetchHome(),
  });

  const {
    data: upcoming,
    isLoading: isLoadingUpcoming,
    error: errorUpcoming,
  } = useQuery({
    queryKey: ['upcoming', refreshing],
    queryFn: () => fetchUpcoming({type: undefined, page: undefined}),
  });

  if (errorGogotaku) {
    Alert.alert('error', errorGogotaku?.message);
  }
  if (errorUpcoming) {
    Alert.alert('error', errorUpcoming?.message);
  }
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.container}>
        <BigImageSlider refreshing={refreshing} />
        <RecentRelease refreshing={refreshing} />
        <TrendingRelease refreshing={refreshing} />
        <PopularRelease refreshing={refreshing} />
        <SmallImageSlider refreshing={refreshing} />
        <MoviesRelease refreshing={refreshing} />
        <SliderGogotaku
          list={gogotaku?.banners}
          isLoading={isLoadingGogotaku}
          error={errorGogotaku}
          refreshing={refreshing}
        />

        <Trailers
          list={gogotaku?.trailers}
          isLoading={isLoadingGogotaku}
          error={errorGogotaku}
          refreshing={refreshing}
        />
        <SeasonalList
          data={gogotaku?.season_releases}
          isLoading={isLoadingGogotaku}
          error={errorGogotaku}
          refreshing={refreshing}
        />
        <UpcomingAnimes
          list={upcoming}
          isLoading={isLoadingUpcoming}
          error={errorUpcoming}
          refreshing={refreshing}
        />
        <RequestedList
          list={gogotaku?.requested_list}
          isLoading={isLoadingGogotaku}
          error={errorGogotaku}
          refreshing={refreshing}
        />
        <HeaderHome />
        <VersionChecker />
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.DarkBackGround,
    gap: 10,
    paddingBottom: 30,
  },
});
