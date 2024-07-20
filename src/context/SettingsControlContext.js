import {createContext, useContext, useEffect, useState} from 'react';
import {getAsyncData, setAsyncData} from '../utils/HelperFunctions';
import {ToastAndroid, Alert} from 'react-native';
import {qualityPrefs} from '../utils/contstant';

const SettingsControlContext = createContext();
const providerKey = 'providerControl_';
const rmbKey = `remind_to_take_break_key`;
const themKey = `theme_key`;

export const SettingsControlProvider = ({children}) => {
  const [setting, setSetting] = useState({
    qualityPrefrence: {
      wifi: qualityPrefs._default,
      mobile: qualityPrefs._default,
    },
    sliderIntervalTime: 5000,
    language: 'en',
    provider: 'anitaku',
    remind_to_take_break: 0,
    theme: 'dark',
  });
  
  useEffect(() => {
    getAsyncData(providerKey)
      .then(res => {
        if (res) {
          setSetting(prev => ({
            ...prev,
            provider: res,
          }));
        }
      })
      .catch(err => Alert.alert('error', err));
    getAsyncData(rmbKey)
      .then(res => {
        if (res) {
          const resp = JSON.parse(res);
          setSetting({...setting, remind_to_take_break: resp ? resp : 0});
        } else {
          setAsyncData(rmbKey, JSON.stringify(0));
        }
      })
      .catch(err => {
        // console.log(err);
        Alert.alert('error', err?.message);
      });
    getAsyncData(themKey)
      .then(res => {
        if (res) {
          const resp = JSON.parse(res);
          setSetting({...setting, theme: resp ? resp?.theme : 'dark'});
        } else {
          setAsyncData(themKey, JSON.stringify({theme: 'dark'}));
        }
      })
      .catch(err => {
        // console.log(err);
        Alert.alert('error', err?.message);
      });
  }, []);
  return (
    <SettingsControlContext.Provider value={{setting, setSetting}}>
      {children}
    </SettingsControlContext.Provider>
  );
};
export const useSettingControl = () => {
  return useContext(SettingsControlContext);
};
