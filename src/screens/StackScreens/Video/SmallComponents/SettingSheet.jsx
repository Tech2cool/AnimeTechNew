import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ToastAndroid,
  ActivityIndicator,
  Share,
} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import Theme from '../../../../utils/Theme';
import {downloadEp} from '../../../../utils/functions';
import {opacity} from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SettingCard from './SettingCard';
import {MCIcon, MIcon, qualityPrefs} from '../../../../utils/contstant';
import {useVideoPlayer} from '../../../../contexts/VideoContext';
import QualitySetting from './QualitySetting';
import PlayBackRateSetting from './PlayBackRateSetting';

const color = Theme.DARK;
const font = Theme.FONTS;
const SettingSheet = ({
  episodeId,
  setShowSettingSheet,
  showSettingSheet,
  source,
}) => {
  // ref
  const bottomSheetRef = useRef(null);
  const [downLink, setDownLink] = useState([]);
  const [loading, setLoading] = useState(false);

  const {VideoPlayer, setVideoPlayer} = useVideoPlayer();

  const handleAll = () => {
    setVideoPlayer({
      ...VideoPlayer,
      showSetting: false,
      showQualitySetting: false,
      showPlayBackRateSetting: false,
    });
  };


  useEffect(() => {
    if (showSettingSheet) {
      if(!VideoPlayer.showSetting){
        setVideoPlayer({
          ...VideoPlayer,
          showSetting: true,
          showQualitySetting: false,
          showPlayBackRateSetting: false,
        });
    
      }
    }
  }, [showSettingSheet]);

  // callbacks
  const handleSheetChanges = useCallback(index => {
    // console.log('handleSheetChanges', index);
    if (index <= 0) {
      setShowSettingSheet(false);
      handleAll()
    }
  }, []);

  // renders
  return (
    <View style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={['25%', '100%']}
        onChange={handleSheetChanges}
        style={{
          overflow: 'hidden',
          borderColor: color.LighterGray,
          borderWidth: 1,
          borderRadius: 20,
          paddingVertical: 2,
        }}
        handleIndicatorStyle={{backgroundColor: color.LightGray}}
        backgroundStyle={{backgroundColor: color.DarkBackGround2}}>
        <View style={styles.contentContainer}>
          <>
          <SettingCard setShowSettingSheet={setShowSettingSheet}/>
          </>
          <QualitySetting qualities={source}/>
          <PlayBackRateSetting />

        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '98%',
    alignSelf: 'center',
    // padding: 24,
  },
  contentContainer: {
    flex: 1,
    // alignItems: 'center',
  },
  Btn: {
    flexDirection: 'row',
    gap: 10,
    // justifyContent:"center",
    alignItems: 'center',
    borderBottomColor: color.LighterGray,
    paddingVertical: 2,
  },
  btnText: {
    color: color.White,
    fontSize: 15,
  },
});

export default SettingSheet;
