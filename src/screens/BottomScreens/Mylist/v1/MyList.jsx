import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {
  deleteTable,
  getDBConnection,
  getManyItems,
} from '../../../../config/db';
import {useQuery} from '@tanstack/react-query';
import HorizontalCard from '../../../../components/HorizontalCard';
import Theme from '../../../../utils/Theme';
import {IIcon} from '../../../../utils/contstant';
import ImportExportModule from '../component/ImportExportModule';
const color = Theme.DARK;
const font = Theme.FONTS;
const MyList = ({navigation, route}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [modal, setModal] = useState(false);
  const [list, setList] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const {data, error, isLoading} = useQuery({
    queryKey: ['sqlLite_animeList', refreshing],
    queryFn: () => SQLLiteQuery(),
  });

  const SQLLiteQuery = async () => {
    try {
      const db = await getDBConnection();
      const items = await getManyItems(db);
      // console.log(items)
      return items;
    } catch (error) {
      Alert.alert('error', error);
    }
  };
  const SQLLiteQueryDelte = async () => {
    try {
      const db = await getDBConnection();
      const items = await deleteTable(db);
      return items;
    } catch (error) {
      Alert.alert('error', error);
    }
  };

  const gotoVideo = item => {
    navigation.navigate('watch', {
      id: item.id,
      episodeId: item.episodeIdGogo,
      episodeNum: item.episodeNum,
      provider: item.provider,
    });
  };
  if (error) {
    Alert.alert('error', error);
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 10,
        }}>
        <TouchableOpacity onPress={SQLLiteQueryDelte}>
          <Text style={styles.textDelete}>Delete List</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>setModal(!modal)}>
          <IIcon name="options-outline" size={32} color={color.White} />
        </TouchableOpacity>
      </View>
      {
       isLoading && <ActivityIndicator color={'red'} size={30} style={{alignSelf: 'center'}} /> 
      }
      <View style={{flex: 1, paddingBottom: 30}}>
        {data
          ?.sort((a, b) => b?.timestamp - a?.timestamp)
          ?.map((item, index) => (
            <TouchableOpacity key={item.id} onPress={() => gotoVideo(item)} activeOpacity={0.8}>
              <HorizontalCard item={item} />
            </TouchableOpacity>
          ))}
      </View>
      <ImportExportModule modal={modal} setModal={setModal} list={list} setList={setList} onRefresh={onRefresh}/>
    </ScrollView>
  );
};

export default MyList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.Black,
    gap: 10,
    padding: 10,
  },
  textDelete: {
    fontFamily: font.OpenSansBold,
    color: color.Red,
    textAlign: 'center',
    paddingVertical: 10,
  },
});
