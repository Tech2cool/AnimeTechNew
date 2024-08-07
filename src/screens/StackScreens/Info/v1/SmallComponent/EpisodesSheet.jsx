import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {useNavigation} from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown';
import Theme from '../../../../../utils/Theme';
import {MCIcon} from '../../../../../utils/contstant';
import SkeletonSlider from '../../../../../components/SkeletonSlider';
import { generateArray } from '../../../../../utils/HelperFunctions';
const color = Theme.DARK;
const font = Theme.FONTS;
const EpisodesSheet = ({
  id,
  episodeId,
  episodeNum,
  anime,
  episodesInfo = {},
  isLoading = false,
}) => {
  const epFlatListRef = useRef(null);
  const navigation = useNavigation();

  const [currentPage, setCurrentPage] = useState({
    index: 0,
    page: 1,
    title: '1-100',
  });

  const navigateVideo = item => {
    navigation.navigate('watch', {
      id: id,
      episodeId: item?.id,
      episodeNum: item?.episodeNum || item?.number,
      provider: 'anitaku',
    });
  };

  const renderitem = useCallback(
    ({item, index}) => {
      // console.log("render ep list")r
      return (
        <TouchableOpacity
          onPress={() => navigateVideo(item)}
          key={item?.id}
          style={{
            padding: 8,
            borderColor: color.Orange,
            borderWidth: 1,
            borderRadius: 5,
            minWidth: 60,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:
              (episodeId === item?.id)
                ? color.Orange
                : undefined,
          }}>
          <Text style={{fontFamily: font.OpenSansMedium, color: color.White}}>
            {item?.title}
          </Text>
        </TouchableOpacity>
      );
    },
    [episodeId, isLoading, episodeNum],
  );

  const onSelectDropDown = useCallback(
    (selectedItem, index) => {
      setCurrentPage(selectedItem);
    },
    [currentPage.page],
  );
  const buttonTextAfterSelection = useCallback(
    (selectedItem, index) => selectedItem?.title,
    [currentPage.page],
  );
  const rowTextForSelection = useCallback(
    (item, index) => item?.title,
    [currentPage.page],
  );
  const renderDropdownIcon = useCallback(
    () => (<MCIcon name={'chevron-down'} color={color.Orange} size={25} />),
    [],
  );

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          gap: 7,
          flexWrap: 'wrap',
          justifyContent: 'center',
          borderColor: color.LighterGray,
          borderWidth: 0.5,
          paddingVertical: 5,
        }}>
        {generateArray(1,30).map(
          (item, i) => (
            <SkeletonSlider
              key={item}
              width={60}
              height={40}
              opacity={1}
              borderRadius={10}
            />
          )
        )}
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <View
        style={{
          paddingHorizontal: 5,
          borderColor: color.LighterGray,
          borderWidth: 1,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{fontFamily: font.OpenSansBold, color: color.White}}>
            Total Episodes:
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontFamily: font.OpenSansBold, color: color.White}}>
              {(episodesInfo?.episodes?.length || anime?.totalEpisodes) || 0}
            </Text>
          </View>
        </View>

        <SelectDropdown
          data={episodesInfo?.pages}
          renderDropdownIcon={renderDropdownIcon}
          buttonStyle={styles.buttonStyle}
          defaultButtonText='...'
          buttonTextStyle={styles.buttonTextStyle}
          dropdownStyle={styles.dropdownStyle}
          rowTextStyle={styles.rowTextStyle}
          rowStyle={styles.rowStyle}
          selectedRowTextStyle={styles.selectedRowTextStyle}
          selectedRowStyle={styles.selectedRowStyle}
          defaultValue={episodesInfo?.pages?.find(
            pg => pg?.page === currentPage?.page,
          )}
          //   defaultValueByIndex={0}
          onSelect={onSelectDropDown}
          buttonTextAfterSelection={buttonTextAfterSelection}
          rowTextForSelection={rowTextForSelection}
        />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          gap: 7,
          flexWrap: 'wrap',
          justifyContent: 'center',
          borderColor: color.LighterGray,
          borderWidth: 0.5,
          paddingVertical: 5,
        }}>
        {episodesInfo?.list?.length >0 && episodesInfo?.list[currentPage?.index || 0]?.map((item, i) =>
          renderitem({item, index: i})
        )}
        {
          episodesInfo?.list?.length <= 0 && (
            <Text style={{fontFamily:font.OpenSansBold, fontSize:14, color:color.Red, textAlign:"center"}}>No Episodes Found</Text>
          )
        }
      </View>
    </View>
  );
};

export default memo(EpisodesSheet);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 5,
    paddingHorizontal: 5,
    // backgroundColor:"red"
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
    fontFamily: font.OpenSansBold,
    textAlign: 'right',
  },
  buttonStyle: {
    // width: 150,
    // height: 20,
    padding: 10,
    backgroundColor: color.DarkBackGround,
  },
  rowStyle: {
    borderColor: 'transparent',
  },
  selectedRowStyle: {
    backgroundColor: color.Orange,
  },
});
