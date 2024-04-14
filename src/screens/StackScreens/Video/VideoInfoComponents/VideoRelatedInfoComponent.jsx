import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import Theme from '../../../../utils/Theme';
import {useNavigation} from '@react-navigation/native';
import {MCIcon} from '../../../../utils/contstant';
import SelectDropdown from 'react-native-select-dropdown';
import SkeletonSlider from '../../../../components/SkeletonSlider';
const color = Theme.DARK;
const font = Theme.FONTS;

const VideoRelatedInfoComponent = ({
  data = [
    {
      name: 's',
      value: 's',
    },
  ],
  animeId,
  anime,
  isLoading = false,
}) => {
  const [selected, setSelected] = useState();
  const navigation = useNavigation();
  const onSelectDropDown = useCallback((selectedItem, index) => {
    // Update selected state with the new selected item
    if (selectedItem?.animeID === animeId) return;
    setSelected(selectedItem);
    navigation.navigate('anime-info', {
      animeId: selectedItem?.animeID,
    });
  }, []);
  const buttonTextAfterSelection = useCallback(
    (selectedItem, index) =>
      selectedItem.name
        ? selectedItem.name
        : selectedItem.animeTitle.english
        ? selectedItem?.animeTitle?.english
        : selectedItem?.animeTitle?.english_jp,
    [],
  );
  const rowTextForSelection = useCallback(
    (item, index) =>
      item?.name
        ? item.name
        : item.animeTitle.english
        ? item?.animeTitle?.english
        : item?.animeTitle?.english_jp,
    [],
  );
  const renderDropdownIcon = useCallback(
    () => <MCIcon name={'chevron-down'} color={color.Orange} size={25} />,
    [],
  );
  return (
    <View style={{gap: 2}}>
      <View style={styles.line}></View>
      {isLoading ? (
        <View style={{flexDirection:"row", justifyContent:"space-between"}}>
          <SkeletonSlider width={'35%'} height={18} opacity={1} />
          <SkeletonSlider width={'50%'} height={18} opacity={1} />
        </View >
      ) : (
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.totalEP}>
            Total Episodes: {anime?.totalEpisodes}
          </Text>
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
            defaultValue={
              anime?.aniwatchInfo?.seasons?.length > 0
                ? anime?.aniwatchInfo?.seasons?.find(
                    anim => anim?.animeID === anime?.animeID,
                  )
                : anime?.relatedAddtional?.sequalOrPrequal.find(
                    anim => anim?.animeID === anime?.animeID,
                  )
            }
            onSelect={onSelectDropDown}
            buttonTextAfterSelection={buttonTextAfterSelection}
            rowTextForSelection={rowTextForSelection}
          />
        </View>
      )}

      <View style={styles.line}></View>
    </View>
  );
};

export default VideoRelatedInfoComponent;

const styles = StyleSheet.create({
  line: {
    width: '100%',
    height: 0.5,
    backgroundColor: color.LightGray,
    // marginVertical:5,
  },
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
    fontFamily: font.NunitoBlack,
    textAlign:"right",
  },
  buttonStyle: {
    // width: 150,
    flex: 1,
    height: 20,
    backgroundColor: color.DarkBackGround,
  },
  rowStyle: {
    borderColor: 'transparent',
  },
  selectedRowStyle: {
    backgroundColor: color.Orange,
  },
  totalEP: {
    color: color.White,
  },
});
