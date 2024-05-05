import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  ToastAndroid,
  View,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {
  PERMISSIONS,
  RESULTS,
  checkMultiple,
  requestMultiple,
} from 'react-native-permissions';
import {IIcon} from '../../../../utils/contstant';
import Theme from '../../../../utils/Theme';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {getDBConnection, saveVideoRecord} from '../../../../config/db';
import FastImage from 'react-native-fast-image';
import { getManyItems } from '../../../../config/db';

const color = Theme.DARK;
const font = Theme.FONTS;
const ImportExportModule = ({
  modal,
  setModal,
  list,
  setList,
  onRefresh = () => {},
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const requestStoragePermissions = async () => {
    try {
      const results = await checkMultiple([
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ]);

      if (
        results[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] ===
          RESULTS.GRANTED &&
        results[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === RESULTS.GRANTED
      ) {
        ToastAndroid.show('Permission Granted', ToastAndroid.SHORT);
      } else {
        const permissionsToRequest = [];

        if (
          results[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] !== RESULTS.GRANTED
        ) {
          permissionsToRequest.push(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        }

        if (
          results[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] !==
          RESULTS.GRANTED
        ) {
          permissionsToRequest.push(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
        }

        const permissionResults = await requestMultiple(permissionsToRequest);
        if (
          permissionResults[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] !==
            RESULTS.GRANTED &&
          permissionResults[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] !==
            RESULTS.GRANTED
        ) {
          ToastAndroid.show(
            'Storage Permission is required',
            ToastAndroid.SHORT,
          );
          return;
        }
      }
    } catch (error) {
      ToastAndroid.show(
        'Error requesting storage permissions:' + error,
        ToastAndroid.SHORT,
      );
    }
  };
  const pickFile = async () => {
    try {
      await requestStoragePermissions();
      setLoading(true);
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
      const parsedFileContent = JSON.parse(fileContent);
      setSelectedFile({name: res.name, content: fileContent});
      setList(parsedFileContent);
      //   console.log(fileContent)
      const db = await getDBConnection();
      const promised = parsedFileContent.map(async item => {
        const record = {
          id: item?.value?.animeId || item?.animeId || item?.id,
          episodeIdGogo: item?.value?.episodeId || item?.episodeId || item?.episodeIdGogo,
          animeImg: item?.value?.anime?.animeImg || item?.animeImg,
          episodeNum: item?.value?.episodeNum || item?.episodeNum,
          english: item?.value?.anime?.animeTitle?.english || item?.english,
          english_jp:
            item?.value?.anime?.animeTitle?.english_jp || item?.english_jp,
          japanese: item?.value?.anime?.animeTitle?.japanese || item?.japanese,
          currentTime: item?.value?.currentTime || item?.currentTime,
          duration: item?.value?.duration || item?.duration,
          gogoId: item?.value?.animeId || item?.animeId || item?.id,
          timestamp: item?.value?.timestamp || item?.timestamp,
          wannaDelete: item?.value?.wannaDelete || item?.wannaDelete,
          provider: item?.provider || 'gogoanime',
          episodeIdAniwatch:
            item?.value?.episodeIdAniwatch || item?.episodeIdAniwatch,
          episodeIdAnilist:
            item?.value?.episodeIdAnilist || item?.episodeIdAnilist,
          aniwatchId: item?.value?.aniwatchId || item?.aniwatchId,
          anilistId:
            item?.value?.anime?.anilistId ||
            item?.value?.anilistId ||
            item?.anilistId,
          malId: item?.value?.anime?.malId || item?.malId,
          kitsuId: item?.value?.kitsuId || item?.kitsuId,
        };
        await saveVideoRecord(db, record);
      });
      await Promise.all(promised);
      setLoading(false);
      onRefresh();
      Alert.alert('Sucess', 'Anime List Restored SucessFully.');
    } catch (error) {
      setLoading(false);
      if (DocumentPicker.isCancel(error)) {
        // User cancelled the picker
        Alert.alert('canceled', 'canceled to pick the file.');

        // console.log('User cancelled file picker');
      } else {
        // Error occurred
        // console.error('Error picking file:', error);
        Alert.alert('Error', `Error picking file: ${error}`);
      }
    }
  };

  const exportToJson = async () => {
    try {
      const db= await getDBConnection()
      const items = await getManyItems(db)
      if (items.length === 0) {
        Alert.alert('Error', 'No data to export.');
        return;
      }

      await requestStoragePermissions()

      const dirs = RNFS.DownloadDirectoryPath

      const jsonData = JSON.stringify(items);
      
      const folderPath = `${dirs}/AnimeTech`

      const existingFolder = await RNFS.exists(folderPath)
      if (!existingFolder) await RNFS.mkdir(folderPath)

      const path = `${folderPath}/animeBackup${new Date().getTime()}.json`;
      const existingFile = await RNFS.exists(path);

      if (existingFile) await RNFS.unlink(path);
      await RNFS.writeFile(path, jsonData, 'utf8')
  
      Alert.alert('Success', 'Data exported successfully! at ' + path);

    } catch (error) {
      // console.error('Error exporting data:', error);
      Alert.alert('Error', 'Failed to export data.' + error);
    }
  };
  
  return (
    <Modal transparent visible={modal}>
      <View style={styles.container}>
        <ScrollView>
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              gap: 10,
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={() => setModal(false)}>
              <IIcon
                name="arrow-back-circle-outline"
                size={30}
                color={color.White}
              />
            </TouchableOpacity>
            <Text style={styles.ixHeading}>Backup or Restore your List</Text>
          </View>
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              gap: 10,
              flex: 1,
              alignItems: 'center',
            }}>
            <Text style={styles.ixText}>
              Import/restore from your animeBackup.json
            </Text>
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
          {
            loading && <ActivityIndicator size={30} color={color.Red} style={{alignSelf:"center"}}/>
          }
        </ScrollView>
      </View>
    </Modal>
  );
};

export default ImportExportModule;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.DarkBackGround2,
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
});
