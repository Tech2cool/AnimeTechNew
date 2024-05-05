import {
  Dimensions,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Theme from '../../../utils/Theme';
const color = Theme.DARK;
const font = Theme.FONTS;
import SelectDropdown from 'react-native-select-dropdown';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring
} from 'react-native-reanimated';
import {setAsyncData} from '../../../utils/HelperFunctions';
import {useSettingControl} from '../../../context/SettingsControlContext';
import {useVideoState} from '../../../context/VideoStateContext';
const dataReminder = [
  {
    name: 'off',
    value: 0,
  },
  {
    name: '10min',
    value: 100,
  },
  {
    name: '30min',
    value: 300,
  },
  {
    name: '1hr',
    value: 600,
  },
  {
    name: '1hr 30min',
    value: 900,
  },
  {
    name: '2hr',
    value: 1200,
  },
  {
    name: '2hr 30min',
    value: 1500,
  },
  {
    name: '3hr',
    value: 1800,
  },
];
const seekSecondsData = [
  {
    name: '10 seconds',
    value: 10,
  },
  {
    name: '15 seconds',
    value: 15,
  },
  {
    name: '30 seconds',
    value: 30,
  },
  {
    name: '45 seconds',
    value: 45,
  },
  {
    name: '60 seconds',
    value: 60,
  },
];
const themeData = ['dark', 'light'];
const {width} = Dimensions.get('window');
const GeneralSetting = ({navigation}) => {
  const {setting, setSetting} = useSettingControl();
  const {videoState, setVideoState} = useVideoState();
  const [showTimer, setShowTimer] = useState(false);
  const [SeekTimer, setSeekTimer] = useState(false);
  const [themeShow, setThemeShow] = useState(false);
  const breakValue = setting.remind_to_take_break > 0 ? true : false;
  // const toggleSwitch = () => setRemindMeTime();
  const toggleX = useSharedValue(0);
  const handleBreakFunc = () => {
    setShowTimer(!showTimer);
  };
  const handleSwitch = value => {
    setSetting(prev => ({
      ...prev,
      remind_to_take_break: value ? value : 0,
    }));
    // setShowTimer(value);
  };
  const changeSeekseconds = seconds => {
    const keyy = 'seekSeconds_key';
    setVideoState(prev => ({...prev, seekSecond: seconds}));
    setAsyncData(keyy, JSON.stringify(seconds));
  };
  const handleSeeKTimer = () => {
    setSeekTimer(!SeekTimer);
  };
  const handleTheme = () => {
    setThemeShow(!themeShow);
  };

  const findTime = () => {
    const resp = dataReminder.find(
      time => time.value === setting.remind_to_take_break,
    );
    return resp;
  };
  const findSeekSecond = () => {
    const resp = seekSecondsData.find(
      time => time.value === videoState.seekSecond,
    );
    return resp;
  };
  const findTheme = () => {
    const resp = themeData.find(
      theme => theme.toLocaleLowerCase() === setting.theme.toLocaleLowerCase(),
    );
    return resp;
  };
  const hideModals = () => {
    if (showTimer) {
      handleBreakFunc();
    }
    if (SeekTimer) {
      handleSeeKTimer();
    }
    if (themeShow) {
      handleTheme();
    }
  };
  const gesture = Gesture.Tap()
    .onStart(e => {
      runOnJS(hideModals)();
    })
    .onEnd(e => {});

  const rToggleStyle = useAnimatedStyle(() => {
    return {transform: [{translateX: toggleX.value}]};
  });
  const handleToggleBtn = () => {
    toggleX.value = toggleX.value=== 35?withTiming(0):withTiming(35)
    if(toggleX.value !== 35){
      handleBreakFunc()
      setSetting(prev => ({
        ...prev,
        remind_to_take_break: toggleX.value ? dataReminder[0].value : 0,
      }));
  
    }
  };
  return (
    <>
      <GestureDetector gesture={gesture}>
        <Animated.View style={styles.container}>
          <TouchableOpacity
            style={[
              styles.Btn,
              {flexDirection: 'row', justifyContent: 'space-between'},
            ]}
            onPress={handleBreakFunc}>
            <View>
              <Text style={styles.BtnText}>Remind me to take a break</Text>
              <Text style={styles.BtnSubText}>
                {setting.remind_to_take_break > 0
                  ? `On (${findTime()?.name})`
                  : 'Off'}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                height: 25,
                backgroundColor: color.LighterGray,
                width: 60,
                borderRadius: 20,
                alignSelf: 'center',
              }}
              onPress={handleToggleBtn}>
              <Animated.View
                style={[
                  {
                    backgroundColor: color.LightGray,
                    width: 25,
                    height: '100%',
                    borderRadius: 20,
                  },
                  rToggleStyle,
                ]}></Animated.View>
            </TouchableOpacity>
            {/* <Switch value={breakValue} onValueChange={handleSwitch} /> */}
          </TouchableOpacity>
          <TouchableOpacity style={styles.Btn} onPress={handleTheme}>
            <Text style={styles.BtnText}>Appearance</Text>
            <Text style={styles.BtnSubText}>
              Choose your light or dark theme preference
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Btn} onPress={handleSeeKTimer}>
            <Text style={styles.BtnText}>Double-tap to seek</Text>
            <Text style={styles.BtnSubText}>
              {videoState.seekSecond} seconds
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Btn}>
            <Text style={styles.BtnText}>App Language</Text>
            <Text style={styles.BtnSubText}>English</Text>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
      {showTimer && (
        <View style={{position: 'absolute', top: 50, right: 10, left: 10}}>
          <SelectDropdown
            data={dataReminder}
            onSelect={(selectedItem, index) => {
              // console.log(selectedItem, index)
              handleSwitch(selectedItem.value);
              setShowTimer(false);
            }}
            buttonStyle={{
              backgroundColor: color.DarkBackGround,
              borderColor: color.LightGray,
              borderWidth: 0.5,
              borderRadius: 5,
              width: width * 0.9,
            }}
            rowStyle={{
              backgroundColor: color.DarkBackGround,
              borderColor: 'transparent',
            }}
            rowTextStyle={{color: color.White, fontSize: 14}}
            buttonTextStyle={{
              color: color.White,
              fontSize: 14,
              textTransform: 'capitalize',
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem.name;
            }}
            defaultValue={findTime()}
            // defaultValueByIndex={0}
            rowTextForSelection={(item, index) => {
              return item.name;
            }}
          />
        </View>
      )}
      {SeekTimer && (
        <View style={{position: 'absolute', top: 180, right: 10, left: 10}}>
          <SelectDropdown
            data={seekSecondsData}
            onSelect={(selectedItem, index) => {
              // console.log(selectedItem, index)
              // setRemindMeTime(selectedItem.value)
              changeSeekseconds(selectedItem.value);
              setSeekTimer(false);
            }}
            buttonStyle={{
              backgroundColor: color.DarkBackGround,
              borderColor: color.LightGray,
              borderWidth: 0.5,
              borderRadius: 5,
              width: width * 0.9,
            }}
            rowStyle={{
              backgroundColor: color.DarkBackGround,
              borderColor: 'transparent',
            }}
            rowTextStyle={{color: color.White, fontSize: 14}}
            buttonTextStyle={{
              color: color.White,
              fontSize: 14,
              textTransform: 'capitalize',
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem.name;
            }}
            defaultValue={findSeekSecond()}
            rowTextForSelection={(item, index) => {
              return item.name;
            }}
          />
        </View>
      )}
      {themeShow && (
        <View style={{position: 'absolute', top: 150, right: 10, left: 10}}>
          <SelectDropdown
            data={themeData}
            onSelect={(selectedItem, index) => {
              // console.log(selectedItem, index)
              // setRemindMeTime(selectedItem.value)
              // changeSeekseconds(selectedItem.value)
              setTheme(selectedItem);
              setThemeShow(false);
            }}
            buttonStyle={{
              backgroundColor: color.DarkBackGround,
              borderColor: color.LightGray,
              borderWidth: 0.5,
              borderRadius: 5,
              width: width * 0.9,
            }}
            rowStyle={{
              backgroundColor: color.DarkBackGround,
              borderColor: 'transparent',
            }}
            rowTextStyle={{
              color: color.White,
              fontSize: 14,
              textTransform: 'capitalize',
            }}
            buttonTextStyle={{
              color: color.White,
              fontSize: 14,
              textTransform: 'capitalize',
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            defaultValue={findTheme()}
            rowTextForSelection={(item, index) => {
              return item;
            }}
          />
        </View>
      )}
    </>
  );
};

export default GeneralSetting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.DarkBackGround,
    padding: 10,
    gap: 20,
    position: 'relative',
  },
  Btn: {
    gap: 2,
  },
  BtnText: {
    fontFamily: font.OpenSansMedium,
    color: color.White,
    fontSize: 15,
  },
  BtnSubText: {
    fontFamily: font.OpenSansMedium,
    color: color.LightGray,
    fontSize: 13,
  },
});
