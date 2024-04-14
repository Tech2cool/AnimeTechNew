import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import {MCIcon} from '../../../../utils/contstant';
import Theme from '../../../../utils/Theme';
const color = Theme.DARK;
const font = Theme.FONTS;

const DropDownSelect = ({selected, setSelected, data}) => {
  const onSelectDropDown = (selectedItem, index) => {
    // Update selected state with the new selected item
    setSelected(selectedItem);
  };
  const buttonTextAfterSelection = (selectedItem, index) => selectedItem.name;
  const rowTextForSelection = (item, index) => item.name;
  const renderDropdownIcon = useCallback(
    () => <MCIcon name={'chevron-down'} color={color.Orange} size={25} />,
    [],
  );

  return (
    <>
      <SelectDropdown
        data={data}
        renderDropdownIcon={renderDropdownIcon}
        buttonStyle={styles.buttonStyle}
        buttonTextStyle={styles.buttonTextStyle}
        dropdownStyle={styles.dropdownStyle}
        rowTextStyle={styles.rowTextStyle}
        rowStyle={styles.rowStyle}
        selectedRowTextStyle={styles.selectedRowTextStyle}
        selectedRowStyle={styles.selectedRowStyle}
        defaultValue={selected}
        // defaultValueByIndex={0}
        onSelect={onSelectDropDown}
        buttonTextAfterSelection={buttonTextAfterSelection}
        rowTextForSelection={rowTextForSelection}
      />
    </>
  );
};

export default DropDownSelect;

const styles = StyleSheet.create({
  rowTextStyle: {
    fontSize: 14,
    color: color.White,
    textTransform: 'uppercase',
  },
  selectedRowTextStyle: {
    fontSize: 16,
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
    fontFamily: font.NunitoBlack,
  },
  buttonStyle: {
    width: 120,
    backgroundColor: color.DarkBackGround,
  },
  rowStyle: {
    borderColor: 'transparent',
  },
  selectedRowStyle: {
    backgroundColor: color.Orange,
  },
});
