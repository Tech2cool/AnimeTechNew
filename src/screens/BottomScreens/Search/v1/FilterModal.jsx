import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {
  IIcon,
  StatusListItem,
  TypeListItem,
  genresList,
  seasonListItem,
  sortYearItem,
  subDubItem,
} from '../../../../utils/contstant';
import Theme from '../../../../utils/Theme';

const color = Theme.DARK;
const font = Theme.FONTS;
const FilterModal = ({
  modal,
  setModal,
  setAppliedFilter,
  appliedFilter,
  applyFilter,
  setApplyFilter,
  handleSortApply,
}) => {
  const [genreLimit, setGenreLimit] = useState(true);
  const [yearLimit, setYearLimit] = useState(true);

  const getAllYear = useCallback(() => {
    const currentYear = new Date().getFullYear();

    // Start from the year 1999
    const startYear = 1999;

    // Array to store the years
    const yearsArray = [];

    // Loop from 1999 to the current year and add each year to the array
    for (let year = startYear; year <= currentYear; year++) {
      yearsArray.push(`${year}`);
      // console.log(typeof(`${year}`))
    }
    return yearsArray;
  }, []);

  const filteredGenre = genreLimit ? genresList?.slice(0, 15) : genresList;

  const filteredAllYears = yearLimit
    ? getAllYear()
        ?.sort((a, b) => b - a)
        ?.slice(0, 10)
    : getAllYear()?.sort((a, b) => b - a);
  const handleSort = sort => {
    if (appliedFilter.sort === sort) {
      setAppliedFilter(prev => ({
        ...prev,
        sort: null,
      }));
    } else {
      setAppliedFilter(prev => ({
        ...prev,
        sort: sort,
      }));
    }
  };
  const handleSubDub = suborDub => {
    if (appliedFilter.suborDub === suborDub) {
      setAppliedFilter(prev => ({
        ...prev,
        suborDub: null,
      }));
    } else {
      setAppliedFilter(prev => ({
        ...prev,
        suborDub: suborDub,
      }));
    }
  };
  const handleType = type => {
    if (appliedFilter.type === type) {
      setAppliedFilter(prev => ({
        ...prev,
        type: null,
      }));
    } else {
      setAppliedFilter(prev => ({
        ...prev,
        type: type,
      }));
    }
  };
  const handleStatus = status => {
    if (appliedFilter.status == status) {
      setAppliedFilter(prev => ({
        ...prev,
        status: null,
      }));
    } else {
      setAppliedFilter(prev => ({
        ...prev,
        status: status,
      }));
    }
  };
  const handleSeason = season => {
    if (appliedFilter.season == season) {
      setAppliedFilter(prev => ({
        ...prev,
        season: null,
      }));
    } else {
      setAppliedFilter(prev => ({
        ...prev,
        season: season,
      }));
    }
  };
  const handleSelectYearsFilter = year => {
    if (appliedFilter.year.includes(year)) {
      const filteryearRemove = appliedFilter.year.filter(yer => yer !== year);
      // console.log(filteryearRemove);
      setAppliedFilter(prev => ({
        ...prev,
        year: filteryearRemove.flat(),
      }));
    } else {
      setAppliedFilter(prev => ({
        ...prev,
        year: [...prev.year, year],
      }));
    }
  };
  const handleSelectGenreFilter = genre => {
    if (appliedFilter.genre.includes(genre)) {
      const filterGenreRemove = appliedFilter.genre.filter(
        genr => genr !== genre,
      );

      setAppliedFilter(prev => ({
        ...prev,
        genre: filterGenreRemove.flat(),
      }));
    } else {
      setAppliedFilter(prev => ({
        ...prev,
        genre: [...prev.genre, genre],
      }));
    }
  };

  const handleReset = () => {
    setAppliedFilter(prev => ({
      ...prev,
      sort: null,
      suborDub: null,
      type: null,
      year: [],
      status: null,
      season: null,
      genre: [],
    }));

    setApplyFilter(!applyFilter);
  };
  const handleApply = () => {
    setApplyFilter(!applyFilter);
    handleSortApply()
    setModal(false);
  };

  return (
    <Modal transparent visible={modal}>
      <View style={styles.container}>
        <ScrollView>
          <TouchableOpacity
            onPress={() => setModal(!modal)}
            style={{paddingHorizontal: 10, paddingVertical: 10}}>
            <IIcon name="arrow-back" size={30} color={color.White} />
          </TouchableOpacity>
          {/* Sort Filter start */}
          <View style={{gap: 10, paddingVertical: 10, paddingHorizontal: 10}}>
            <Text style={styles.FilterHeading}>Sort</Text>
            <View style={{flexDirection: 'row', gap: 10}}>
              {sortYearItem.map(filter => (
                <TouchableOpacity
                  onPress={() => handleSort(filter.value)}
                  style={
                    appliedFilter.sort === filter.value
                      ? styles.FilterBtnActive
                      : styles.FilterBtn
                  }
                  key={filter.name}>
                  <Text style={styles.filterText}>{filter.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* Sort Filter End */}
          {/* Sub DUB Filter start */}
          <View style={{gap: 10, paddingVertical: 10, paddingHorizontal: 10}}>
            <Text style={styles.FilterHeading}>Sub or Dub</Text>
            <View style={{flexDirection: 'row', gap: 10}}>
              {subDubItem.map(filter => (
                <TouchableOpacity
                  onPress={() => handleSubDub(filter.value)}
                  style={
                    appliedFilter.suborDub === filter.value
                      ? styles.FilterBtnActive
                      : styles.FilterBtn
                  }
                  key={filter.name}>
                  <Text style={styles.filterText}>{filter.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* Sub DUB Filter End */}

          {/*Anime Type Filter start */}
          <View style={{gap: 10, paddingVertical: 10, paddingHorizontal: 10}}>
            <Text style={styles.FilterHeading}>Type</Text>
            <View style={{flexDirection: 'row', gap: 10, flexWrap: 'wrap'}}>
              {TypeListItem.map(filter => (
                <TouchableOpacity
                  onPress={() => handleType(filter.value)}
                  style={
                    appliedFilter.type === filter.value
                      ? styles.FilterBtnActive
                      : styles.FilterBtn
                  }
                  key={filter.name}>
                  <Text style={styles.filterText}>{filter.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/*Anime Type Filter End */}

          {/*Anime Status Filter start */}
          <View style={{gap: 10, paddingVertical: 10, paddingHorizontal: 10}}>
            <Text style={styles.FilterHeading}>Status</Text>
            <View style={{flexDirection: 'row', gap: 10, flexWrap: 'wrap'}}>
              {StatusListItem.map(filter => (
                <TouchableOpacity
                  onPress={() => handleStatus(filter.value)}
                  style={
                    appliedFilter.status === filter.value
                      ? styles.FilterBtnActive
                      : styles.FilterBtn
                  }
                  key={filter.name}>
                  <Text style={styles.filterText}>{filter.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/*Anime Status Filter End */}

          {/*Anime Season Filter start */}
          <View style={{gap: 10, paddingVertical: 10, paddingHorizontal: 10}}>
            <Text style={styles.FilterHeading}>Season</Text>
            <View style={{flexDirection: 'row', gap: 10, flexWrap: 'wrap'}}>
              {seasonListItem.map(filter => (
                <TouchableOpacity
                  onPress={() => handleSeason(filter.value)}
                  style={
                    appliedFilter.season === filter.value
                      ? styles.FilterBtnActive
                      : styles.FilterBtn
                  }
                  key={filter.name}>
                  <Text style={styles.filterText}>{filter.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/*Anime Season Filter End */}

          {/*Anime Year Filter start */}
          <View style={{gap: 10, paddingVertical: 10, paddingHorizontal: 10}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.FilterHeading}>Year</Text>
              <TouchableOpacity onPress={() => setYearLimit(!yearLimit)}>
                <Text style={styles.seeAllText}>
                  {yearLimit ? 'Show All' : 'Show Less'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', gap: 10, flexWrap: 'wrap'}}>
              {filteredAllYears?.map(filter => (
                <TouchableOpacity
                  onPress={() => handleSelectYearsFilter(filter)}
                  style={
                    appliedFilter.year.includes(filter)
                      ? styles.FilterBtnActive
                      : styles.FilterBtn
                  }
                  key={filter}>
                  <Text style={styles.filterText}>{filter}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/*Anime Year Filter End */}

          {/*Genres Filter start */}
          <View style={{gap: 10, paddingVertical: 10, paddingHorizontal: 10}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.FilterHeading}>Genres</Text>
              <TouchableOpacity onPress={() => setGenreLimit(!genreLimit)}>
                <Text style={styles.seeAllText}>
                  {genreLimit ? 'Show All' : 'Show Less'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', gap: 10, flexWrap: 'wrap'}}>
              {filteredGenre?.map(filter => (
                <TouchableOpacity
                  onPress={() => handleSelectGenreFilter(filter)}
                  style={
                    appliedFilter?.genre?.includes(filter)
                      ? styles.FilterBtnActive
                      : styles.FilterBtn
                  }
                  key={filter}>
                  <Text style={styles.filterText}>{filter}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/*Genres Filter End */}
        </ScrollView>
        <View style={styles.filterApplyContainer}>
          <TouchableOpacity style={styles.ResetBtn} onPress={handleReset}>
            <Text style={styles.filterTextAR}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ApplyBtn} onPress={handleApply}>
            <Text style={styles.filterTextAR}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.DarkBackGround2,
  },
  filterApplyContainer: {
    borderColor: color.LighterGray,
    borderWidth: 1,
    borderBottomColor: 'transparent',
    borderBottomWidth: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: color.DarkBackGround2,
    paddingHorizontal: 10,
    height: 100,
    overflow: 'hidden',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  ResetBtn: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: color.DarkGray,
    width: '50%',
    height: 60,
  },
  ApplyBtn: {
    borderColor: color.LighterGray,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: color.Orange,
    width: '50%',
    height: 60,
  },
  filterTextAR: {
    fontFamily: font.OpenSansBold,
    color: color.White,
    fontSize: 16,
  },
  FilterHeading: {
    fontFamily: font.OpenSansBold,
    color: color.White,
    fontSize: 15,
  },
  FilterBtn: {
    padding: 10,
    borderWidth: 0.5,
    borderColor: color.LighterGray,
    flex: 0,
    alignSelf: 'flex-start',
    borderRadius: 10,
    minWidth: 60,
    alignItems: 'center',
  },
  FilterBtnActive: {
    padding: 10,
    borderWidth: 0.5,
    backgroundColor: color.Orange,
    borderColor: color.LighterGray,
    flex: 0,
    alignSelf: 'flex-start',
    borderRadius: 10,
    minWidth: 60,
    alignItems: 'center',
  },
  filterText: {
    fontFamily: font.OpenSansMedium,
    color: color.White,
    fontSize: 14,
    textTransform: 'capitalize',
  },
  filterTextAR: {
    fontFamily: font.OpenSansBold,
    color: color.White,
    fontSize: 16,
  },
  seeAllText: {
    fontFamily: font.OpenSansBold,
    color: color.Orange,
    fontSize: 14,
  },
});
