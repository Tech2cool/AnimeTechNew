import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ToastAndroid,
  Button,
  Alert,
  ScrollView,
  Modal,
  StyleSheet,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Theme from '../../../utils/Theme';
import HorizontalAnimeCard from '../../../components/HorizontalAnimeCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyListHorizontalCard from './SmallComponent/MyListHorizontalCard';
import HeaderHome from '../../../components/HeaderHome';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import { IIcon, MCIcon } from '../../../utils/contstant';
import { setAsyncData } from '../../../utils/functions';
import { PERMISSIONS, RESULTS, checkMultiple, requestMultiple } from 'react-native-permissions';
import RNFetchBlob from 'rn-fetch-blob';

const color = Theme.DARK;
const font = Theme.FONTS;
const myWatchListKey = 'WatchListKey_';
const MyList = () => {
  const navigation = useNavigation();
  const [watchAnime, setWatchAnime] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modal, setModal] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAllWatchedEpisodes(myWatchListKey)
      .then(res => {
        // console.log(res)
        setWatchAnime(res);
      })
      .catch(err => {
        ToastAndroid.show('Error:' + err, ToastAndroid.SHORT);
      });
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const getAllWatchedEpisodes = async (myKey) => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const watchedEpisodeKeys = allKeys.filter(key => key.startsWith(myKey));
      const watchedEpisodes = await AsyncStorage.multiGet(watchedEpisodeKeys);

      const sortedWatchedEpisodes = watchedEpisodes
        .map(([key, value]) => ({ mainId: key, value: JSON.parse(value) }))
        .sort((a, b) => b.value.timestamp - a.value.timestamp);
      return sortedWatchedEpisodes;
      // return watchedEpisodes.map(([key, value]) => ({ mainId: key, value: JSON.parse(value) }));
    } catch (error) {
      // console.error('Error retrieving watched episodes:', error);
      return [];
    }
  };

  const DeleteAllWatchedEpisodes = async (myKey) => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();

      // Filter keys that match the pattern
      const watchedEpisodeKeys = allKeys.filter(key => key.startsWith(myKey));

      // Retrieve the values for the filtered keys
      AsyncStorage.multiRemove(watchedEpisodeKeys, error => {
        // console.log("deleted")
      });
      setWatchAnime([]);
      Alert.alert('List Deleted', 'List deleted successfully.');
    } catch (error) {
      ToastAndroid.show('Error:' + error, ToastAndroid.SHORT);
      // console.error('Error retrieving watched episodes:', error);
      return [];
    }
  };

  const pickFile = async () => {
    try {
      await requestStoragePermissions()

      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });

      // console.log('File URI', res.uri);
      // console.log('File Type', res.type);
      // console.log('File Name', res.name);
      // console.log('File Size', res.size);

      if (!res.uri) {
        Alert.alert('Error', 'No file URI found.');
        return;
      }
      if (res.type !== 'application/json') {
        Alert.alert('.JSON Format Only', 'Choose your animeBackup.json file');
        return;
      }
      // Read the file contents
      const fileContent = await RNFS.readFile(res.uri, 'utf8');
      // console.log('File Content', fileContent);
      const parsedFileContent = JSON.parse(fileContent)
      setSelectedFile({ name: res.name, content: fileContent });
      setWatchAnime(parsedFileContent)
      parsedFileContent.map((item)=>{setAsyncData(item.mainId, JSON.stringify(item.value))})

      Alert.alert('Sucess', 'Anime List Restored SucessFully.');
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // User cancelled the picker
        Alert.alert('canceled', 'canceled to pick the file.');

        // console.log('User cancelled file picker');
      } else {
        // Error occurred
        // console.error('Error picking file:', error);
        Alert.alert('Error', 'Failed to pick the file.');
      }
    }
  };
  const requestStoragePermissions = async () => {
    try {
      const results = await checkMultiple([
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      ]);
  
      if (
        results[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === RESULTS.GRANTED &&
        results[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === RESULTS.GRANTED
      ) {
        // Both permissions already granted, you can read and write to external storage
      } else {
        const permissionsToRequest = [];
  
        if (results[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] !== RESULTS.GRANTED) {
          permissionsToRequest.push(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        }
  
        if (results[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] !== RESULTS.GRANTED) {
          permissionsToRequest.push(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
        }
  
        const permissionResults = await requestMultiple(permissionsToRequest);
  
        if (
          permissionResults[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] !== RESULTS.GRANTED &&
          permissionResults[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] !== RESULTS.GRANTED
        ) {
            ToastAndroid.show("Storage Permission is required to for offline Videos", ToastAndroid.LONG)
            return
        }
      }
    } catch (error) {
      // console.error('Error requesting storage permissions:', error);
      ToastAndroid.show("Error requesting storage permissions:" + error, ToastAndroid.LONG)

    }
  };

  const exportToJson = async () => {
    try {
      if (watchAnime.length === 0) {
        Alert.alert('Error', 'No data to export.');
        return;
      }
      await requestStoragePermissions()

      const dirs = RNFetchBlob.fs.dirs
      const jsonData = JSON.stringify(watchAnime);
      
      const folderPath = `${dirs.DownloadDir}/AnimeTech`

      const existingFolder = await RNFetchBlob.fs.exists(folderPath)
      if (!existingFolder) await RNFetchBlob.fs.mkdir(folderPath)

      const path = `${folderPath}/animeBackup${new Date().getTime()}.json`;
      const existingFile = await RNFetchBlob.fs.exists(path);

      if (existingFile) await RNFetchBlob.fs.unlink(path);
      if(!existingFile) await RNFetchBlob.fs.createFile(path, jsonData, 'utf8')
      else await RNFetchBlob.fs.writeFile(path, jsonData, 'utf8')
  
      Alert.alert('Success', 'Data exported successfully! at ' + path);

    } catch (error) {
      // console.error('Error exporting data:', error);
      Alert.alert('Error', 'Failed to export data.' + error);
    }
  };
  
  useEffect(() => {
    getAllWatchedEpisodes(myWatchListKey)
      .then(res => {
        // console.log(res)
        setWatchAnime(res);
      })
      .catch(err => {
        ToastAndroid.show('Error:' + err, ToastAndroid.SHORT);
      });
  }, [navigation]);


  const renderItem = useCallback(({ item, index }) => (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('video', {
            animeId: item?.value?.animeId,
            episodeId: item?.value?.episodeId,
            episodeNum: item?.value?.episodeNum,
            kitsuId: item?.value?.kitsuId,
            aniwatchId:item?.value?.aniwatchId,
            aniwatchEpisodeId: item?.value?.aniwatchEpisodeId,
          })

          // navigation.navigate('video', {
          //   // animeId, kitsuId, episodeId, episodeNum
          //   // anime: item?.value?.anime,
          //   animeId: item?.value?.animeId,
          //   kitsuId: item?.value?.kitsuId,
          //   episodeId: item?.value?.episodeId,
          //   episodeNum: item?.value?.episodeNum,
          // });
        }}>
        <MyListHorizontalCard
          anime={item?.value?.anime}
          episodeId={item?.value?.episodeId}
          episodeNum={item?.value?.episodeNum}
          currentTime={item?.value?.currentTime}
          duration={item?.value?.duration}
          mainId={item?.mainId}
        // handleSingleDelete={handleSingleDelete}
        />
      </TouchableOpacity>
    ),[watchAnime, navigation, refreshing]);
    
  const headerComponent = () => {
    return (<>
      <View style={{ paddingHorizontal: 10, flexDirection: "row", justifyContent: "space-between", paddingVertical:5}}>
        <View style={{ width: "60%", justifyContent: "center", alignItems: "flex-end" }}>
          {
            watchAnime.length > 0 && (
              <TouchableOpacity onPress={() => DeleteAllWatchedEpisodes(myWatchListKey)}>
                <Text style={[styles.ixText]}>Delete All</Text>
              </TouchableOpacity>
            )
          }

        </View>
        <TouchableOpacity onPress={() => setModal(!modal)}>
          <IIcon name="options-outline" size={32} color={color.White} />
        </TouchableOpacity>
      </View>
    </>)
  };

  const memoizedFLatList = useMemo(() => {
    return (
      <FlatList
        nestedScrollEnabled={true}
        data={watchAnime}
        keyExtractor={(item, index) => `${index}_watchListScreen`}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <>
            <Text
              style={{
                color: color.LightGray,
                textAlign: 'center',
                paddingVertical: 10,
                fontFamily: font.OpenSansMedium,
              }}>
              Nothing to see here...
            </Text>
          </>
        )}
        ListHeaderComponent={headerComponent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    );
  }, [watchAnime, refreshing]);
  return (
    <View style={{ backgroundColor: color.DarkBackGround, flex: 1 }}>
      {memoizedFLatList}
      <>
        <Modal transparent visible={modal}>
          <ScrollView style={styles.modalView}>

            <View style={{ paddingHorizontal: 10, paddingVertical: 10, gap: 10, flex: 1, flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity onPress={() => setModal(false)}>
                <IIcon name="arrow-back-circle-outline" size={30} color={color.White} />
              </TouchableOpacity>
              <Text style={styles.ixHeading}>Backup or Restore your List</Text>
            </View>

            <View style={{ paddingHorizontal: 10, paddingVertical: 10, gap: 10, flex: 1, alignItems: "center" }}>
              <Text style={styles.ixText}>Import/restore from your animeBackup.json</Text>
              <TouchableOpacity style={styles.ixBtn} onPress={pickFile}>
                <Text style={styles.ixText}>Restore Backup</Text>
              </TouchableOpacity>
            </View>

            <View style={{ paddingHorizontal: 10, paddingVertical: 10, gap: 10, flex: 1, alignItems: "center" }}>
              <Text style={styles.ixText}>Create/Export your animeBackup so you can restore</Text>
              <TouchableOpacity style={[styles.ixBtn, { backgroundColor: color.AccentBlue }]} onPress={exportToJson}>
                <Text style={styles.ixText}>Create Backup</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </Modal>
      </>
    </View>
  );
};

export default MyList;

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    backgroundColor: color.DarkBackGround,
  },
  ixBtn: {
    padding: 10,
    backgroundColor: color.Orange,
    // flex:0,
    // alignSelf:"flex-start",
    // alignSelf:"center",
    borderRadius: 10,
  },
  ixHeading: {
    color: color.White,
    fontFamily: font.OpenSansBold,
  },
  ixText: {
    color: color.White,
    fontFamily: font.OpenSansMedium,
  },
})