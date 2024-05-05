import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback} from 'react';
import {useSettingControl} from '../context/SettingsControlContext';
import Theme from '../utils/Theme';
import SelectDropdown from 'react-native-select-dropdown';
import {MCIcon, providers} from '../utils/contstant';
import { setAsyncData } from '../utils/HelperFunctions';
const color = Theme.DARK;
const font = Theme.FONTS;

const languages = [
    'en',
    'jp',
]
const providerKey = 'providerControl_';

const HeaderHome = () => {
  const {setting, setSetting} = useSettingControl();
  const onSelectDropDown = useCallback((selectedItem, index) => {
    setAsyncData(providerKey, selectedItem)
    setSetting(prev => ({
      ...prev,
      provider: selectedItem,
    }));
  }, []);
  const onSelectDropDownLanguage = useCallback((selectedItem, index) => {
    setSetting(prev => ({
      ...prev,
      language: selectedItem,
    }));
  }, []);

  const buttonTextAfterSelection = useCallback(
    (selectedItem, index) => selectedItem,
    [],
  );
  const rowTextForSelection = useCallback((item, index) => item, []);
  const renderDropdownIcon = useCallback(
    () => <MCIcon name={'chevron-down'} color={color.Orange} size={25} />,
    [],
  );

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 1,
        right: 5,
        flexDirection:"row",
        justifyContent:"space-between",
      }}>
      <SelectDropdown
        data={providers}
        renderDropdownIcon={renderDropdownIcon}
        buttonStyle={styles.buttonStyle}
        defaultButtonText="..."
        buttonTextStyle={styles.buttonTextStyle}
        dropdownStyle={styles.dropdownStyle}
        rowTextStyle={styles.rowTextStyle}
        rowStyle={styles.rowStyle}
        selectedRowTextStyle={styles.selectedRowTextStyle}
        selectedRowStyle={styles.selectedRowStyle}
        defaultValue={providers?.find(item => item === setting.provider)}
        //   defaultValueByIndex={0}
        onSelect={onSelectDropDown}
        buttonTextAfterSelection={buttonTextAfterSelection}
        rowTextForSelection={rowTextForSelection}
      />
        <SelectDropdown
        data={languages}
        renderDropdownIcon={renderDropdownIcon}
        buttonStyle={[styles.buttonStyle, {width:80, backgroundColor:"rgba(0,0,0,0.3)"}]}
        defaultButtonText="..."
        buttonTextStyle={styles.buttonTextStyle}
        dropdownStyle={styles.dropdownStyle}
        rowTextStyle={styles.rowTextStyle}
        rowStyle={styles.rowStyle}
        selectedRowTextStyle={styles.selectedRowTextStyle}
        selectedRowStyle={styles.selectedRowStyle}
        defaultValue={languages?.find(item => item === setting.language)}
        onSelect={onSelectDropDownLanguage}
        buttonTextAfterSelection={buttonTextAfterSelection}
        rowTextForSelection={rowTextForSelection}
      />

    </View>
  );
};

export default HeaderHome;

const styles = StyleSheet.create({
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
    width: 140,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius:99,
  },
  rowStyle: {
    borderColor: 'rgba(255,255,255,0.5)',
  },
  selectedRowStyle: {
    backgroundColor: color.Orange,
  },
});
