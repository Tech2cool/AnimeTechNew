import React, {memo, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ToastAndroid,
  ActivityIndicator,
  Share,
} from 'react-native';
import Theme from '../../../../utils/Theme';
import {TouchableOpacity} from 'react-native-gesture-handler';

const color = Theme.DARK;
const DownloadSheet = ({
  episodeId,
  setShowDownloadSheet,
  showDownloadSheet,
  source,
}) => {
  // ref
  const [downLink, setDownLink] = useState([]);
  const [loading, setLoading] = useState(false);
  // variables
//   const download = async () => {
//     try {
//       setLoading(true);
//     //   const resp = await downloadEp(source?.downloadURL);
//       console.log(resp?.length)
//     //   if (resp?.length === undefined) setDownLink([]);
//     //   else setDownLink(resp);
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//       ToastAndroid.show(error, ToastAndroid.SHORT);
//     }
//   };
  useEffect(() => {
    if (showDownloadSheet) {
    //   download();
    }
  }, [showDownloadSheet]);
  // callbacks
  const handleShare = async ()=>{
    await Share.share({message: source?.downloadURL})
  }
  // renders
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {loading ? (
          <>
            <ActivityIndicator size={30} color={color.Orange} />
          </>
        ) : (
          <View style={{gap: 10, alignItems: 'center'}}>
            {downLink.length === 0 ? (
              <>
                <Text style={{color: color.White, fontSize: 14}}>
                  In app download not working sometimes😢
                </Text>
                <Text style={{color: color.Red, fontSize: 14}}>
                  {' '}
                  External Download page Contains ads
                </Text>
                <Text style={{color: color.Yellow, fontSize: 14}}>
                  thos ads nothing do with us.
                </Text>
                <Text style={{color: color.White, fontSize: 14}}>
                  Please download Manually
                </Text>
                <TouchableOpacity
                  style={{
                    width: 150,
                    height: 50,
                    backgroundColor: color.Orange,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10,
                    marginVertical: 5,
                  }}>
                  <Text
                    style={{color: color.White, fontSize: 16}}
                    onPress={handleShare}>
                    Open with Browser
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {downLink?.map(link => (
                  <TouchableOpacity>
                    <Text style={{color: color.White}}>{link?.quality}</Text>
                    <Text style={{color: color.White}}>{link?.url}</Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    marginHorizontal: 4,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    alignItems: 'center',
  },
});

export default memo(DownloadSheet);
