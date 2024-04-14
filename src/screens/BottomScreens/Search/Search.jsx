import { View, Text, ToastAndroid, FlatList, TouchableOpacity, TextInput, StyleSheet, Modal, RefreshControl, Dimensions, ScrollView } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { fetchInfoBYSeach, getAllYear, isValidData } from '../../../utils/functions'
import HorizontalAnimeCard from '../../../components/HorizontalAnimeCard'
import Theme from '../../../utils/Theme'
import { IIcon, MIcon, StatusListItem, TypeListItem, genresList, seasonListItem, sortYearItem, subDubItem } from '../../../utils/contstant'
import SkeletonSlider from '../../../components/SkeletonSlider'
import HeaderHome from '../../../components/HeaderHome'
import useDebounce from '../../../components/useDebounce'

const color = Theme.DARK
const font = Theme.FONTS
const { width, height } = Dimensions.get("window")

const Search = ({ navigation, route }) => {
  const [input, setInput] = useState("")
  const [modal, setModal] = useState(false)
  const [anime, setAnime] = useState([])
  const [allYear, setAllYear] = useState([])
  const [genreLimit, setGenreLimit] = useState(true);
  const [yearLimit, setYearLimit] = useState(true);

  const [filterAnime, setFilterAnime] = useState([])
  const [filterCount, setfilterCount] = useState(0)
  const [appliedFilter, setAppliedFilter] = useState({
    sort: "",
    suborDub: "",
    type: "",
    year: [],
    status: "",
    season: "",
    genre: [],
  })
  const [isLoading, setisLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  let debounceSearch = useDebounce(input, 500);

  const [pages, setPages] = useState({
    currentPage: 1,
    pagesArray: [],
    totalPages: 1,
  })
  const filteredGenre = genreLimit ? genresList?.slice(0, 15) : genresList;

  const filteredAllYears = yearLimit ? allYear?.sort((a, b) => b - a)?.slice(0, 10) : allYear?.sort((a, b) => b - a);

  const setPagesArr = (currentPage, totalPages) => {
    if (currentPage < 5) {
      let arr = [];
      for (i = 1; i <= parseInt(totalPages); i++) {
        arr.push(i)
      }
      // console.log(arr)
      return arr
    } else {
      let arr = [1, 2, "..",];
      for (i = parseInt(currentPage); i <= parseInt(totalPages); i++) {
        arr.push(i)
      }
      // console.log(arr)
      return arr
    }
  }
  function convertYeartoURL() {
    if (appliedFilter.year?.length <= 0) return ""
    const resp = appliedFilter.year?.map((Year) => {
      return `&year[]=${Year}`
    })
    // console.log(resp.join(""))
    return resp.join("")
  }
  function convertGenretoURL() {
    if (appliedFilter.genre?.length <= 0) return ""
    const resp = appliedFilter.genre?.map((genre) => {
      return `&genre[]=${genre}`
    })
    // console.log(resp.join(""))
    return resp.join("")
  }

  const fetchData = async (input, page) => {
    try {
      setisLoading(true)
      // const resp = await fetchInfoBYSeach(input, page)
      const resp = await fetchInfoBYSeach(
        input, page, convertGenretoURL(),
        appliedFilter?.status,
        appliedFilter?.suborDub,
        appliedFilter?.type,
        appliedFilter?.season, convertYeartoURL());
      if (isValidData(convertGenretoURL()) || isValidData(appliedFilter?.status) ||
        isValidData(appliedFilter?.subtype) || isValidData(appliedFilter?.type) ||
        isValidData(appliedFilter?.season) || isValidData(convertYeartoURL())) {
        setFilterAnime(resp?.list)
      } else { setAnime(resp?.list); }

      // console.log(resp)
      // setAnime(resp?.list)
      let arr = setPagesArr(page, resp?.totalPages)
      setPages(prev => ({
        ...prev,
        currentPage: parseInt(page),
        totalPages: parseInt(resp?.totalPages),
        pagesArray: arr,
      }))

      setisLoading(false)
    } catch (error) {
      setisLoading(false)
      ToastAndroid.show(error, ToastAndroid.SHORT)
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData(input, 1)
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const goToInfo = (id) => {
    navigation.navigate("anime-info", {
      animeId: id,
    })
  }


  useEffect(() => {
    fetchData(input, 1)
    // console.log(input)
  }, [debounceSearch])


  useEffect(() => {
    setAllYear(getAllYear())
  }, [])

  const renderItem = useCallback(({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => goToInfo(item?.animeID)}>
        <HorizontalAnimeCard anime={item} />
      </TouchableOpacity>
    )
  }, [])

  const handlePageNum = (page) => {
    if (page === "..") {

      const findClosetPage = pages.pagesArray
        .find((page, i) => {
          if (page === page) {
            return pages.pagesArray[i - 1]
          }
        })
      if (findClosetPage !== -1) {

        // console.log(findClosetPage)
        // console.log(pages.pagesArray[findClosetPage-1])
        fetchData(input, findClosetPage)
      }
    } else {
      fetchData(input, page)
    }
  }

  const handlePressNext = () => {
    if (pages.currentPage >= pages.totalPages) return
    fetchData(input, parseInt(pages.currentPage) + 1)
  }
  const handlePressPrev = () => {
    if (pages.currentPage < 1) return
    fetchData(input, parseInt(pages.currentPage) - 1)
  }
  const listFooter = useCallback(() => {
    // if (pages.pagesArray.length === 0) return
    return (
      <View style={styles.btnsContainer}>
        {
          pages.currentPage > 1 && (
            <TouchableOpacity style={styles.btns} onPress={handlePressPrev}>
              <Text style={styles.btnText}>Prev</Text>
            </TouchableOpacity>
          )
        }

        {
          pages.pagesArray.map((page) => (
            <TouchableOpacity
              key={page}
              onPress={() => handlePageNum(page)}
              style={[
                styles.btnNumbers,
                {
                  backgroundColor: pages.currentPage === page ? color.AccentBlue : undefined,
                }]}>
              <Text style={styles.btnNumbersText}>{page}</Text>
            </TouchableOpacity>

          ))
        }
        {
          parseInt(pages.currentPage) < parseInt(pages.totalPages) && (
            <TouchableOpacity style={styles.btns} onPress={handlePressNext}>
              <Text style={styles.btnText}>Next</Text>
            </TouchableOpacity>
          )
        }

      </View>
    )
  }, [pages.currentPage, pages.totalPages])

  const handleSelectGenreFilter = (genre) => {
    if (appliedFilter.genre.includes(genre)) {
      const filterGenreRemove = appliedFilter.genre.filter((genr) => genr !== genre);
      // console.log(filterGenreRemove);
      setfilterCount(prev => prev > 1 ? prev - 1 : prev)

      setAppliedFilter((prev) => ({
        ...prev,
        genre: filterGenreRemove.flat()
      }));
    } else {
      setAppliedFilter((prev) => ({
        ...prev,
        genre: [...prev.genre, genre]
      }));
      setfilterCount(prev => prev + 1)

    }
  };

  const handleSelectYearsFilter = (year) => {
    if (appliedFilter.year.includes(year)) {
      const filteryearRemove = appliedFilter.year.filter((yer) => yer !== year);
      // console.log(filteryearRemove);
      setfilterCount(prev => prev > 1 ? prev - 1 : prev)
      setAppliedFilter((prev) => ({
        ...prev,
        year: filteryearRemove.flat()
      }));
    } else {
      setAppliedFilter((prev) => ({
        ...prev,
        year: [...prev.year, year]
      }));
      setfilterCount(prev => prev + 1)

    }
  };

  const handleType = (type) => {
    if (isValidData(appliedFilter.type)) {
      if (appliedFilter.type == type) {
        setfilterCount(prev => prev > 1 ? prev - 1 : prev)
      }
      setAppliedFilter(prev => ({
        ...prev,
        type: type,
      }))
    } else {
      setfilterCount(prev => prev + 1)
      setAppliedFilter(prev => ({
        ...prev,
        type: type,
      }))
    }
  }
  const handleSubDub = (suborDub) => {
    if (isValidData(appliedFilter.suborDub)) {
      if (appliedFilter.suborDub == suborDub) {
        setfilterCount(prev => prev > 1 ? prev - 1 : prev)
      }
      setAppliedFilter(prev => ({
        ...prev,
        suborDub: suborDub,
      }))
    } else {
      setfilterCount(prev => prev + 1)
      setAppliedFilter(prev => ({
        ...prev,
        suborDub: suborDub,
      }))
    }
  }
  const handleSort = (sort) => {
    if (isValidData(appliedFilter.sort)) {
      if (appliedFilter.sort == sort) {
        setfilterCount(prev => prev > 1 ? prev - 1 : prev)
      }
      setAppliedFilter(prev => ({
        ...prev,
        sort: sort,
      }))
    } else {
      setfilterCount(prev => prev + 1)
      setAppliedFilter(prev => ({
        ...prev,
        sort: sort,
      }))
    }
  }
  const handleStatus = (status) => {
    if (isValidData(appliedFilter.status)) {
      if (appliedFilter.status == status) {
        setfilterCount(prev => prev > 1 ? prev - 1 : prev)
      }
      setAppliedFilter(prev => ({
        ...prev,
        status: status,
      }))
    } else {
      setfilterCount(prev => prev + 1)
      setAppliedFilter(prev => ({
        ...prev,
        status: status,
      }))
    }
  }
  const handleSeason = (season) => {
    if (isValidData(appliedFilter.season)) {
      if (appliedFilter.season == season) {
        setfilterCount(prev => prev > 1 ? prev - 1 : prev)
      }
      setAppliedFilter(prev => ({
        ...prev,
        season: season,
      }))
    } else {
      setfilterCount(prev => prev + 1)
      setAppliedFilter(prev => ({
        ...prev,
        season: season,
      }))
    }
  }
  const handleSortRender = ()=>{
    if(appliedFilter.sort === "Year-asc"){
      if (isValidData(convertGenretoURL()) || isValidData(appliedFilter?.status) ||
      isValidData(appliedFilter?.subtype) || isValidData(appliedFilter?.type) ||
      isValidData(appliedFilter?.season) || isValidData(convertYeartoURL())) {
      filterAnime.sort((a,b)=>(
        a?.year - b?.year ||
        parseInt(a?.AdditionalInfo?.startDate?.split("-")[0]) - parseInt(b?.AdditionalInfo?.startDate?.split("-")[0])))
    } else { 
      const filter = anime.sort((a,b)=>(
        a?.year - b?.year ||
        parseInt(a?.AdditionalInfo?.startDate?.split("-")[0]) - parseInt(b?.AdditionalInfo?.startDate?.split("-")[0])))
        setFilterAnime(filter)
      }
    }
    else if(appliedFilter.sort === "Year-desc"){
      if (isValidData(convertGenretoURL()) || isValidData(appliedFilter?.status) ||
      isValidData(appliedFilter?.subtype) || isValidData(appliedFilter?.type) ||
      isValidData(appliedFilter?.season) || isValidData(convertYeartoURL())) {
      filterAnime.sort((a,b)=>(
        b?.year - a?.year ||
        parseInt(b?.AdditionalInfo?.startDate?.split("-")[0]) - parseInt(a?.AdditionalInfo?.startDate?.split("-")[0])))
    } else { 
      const filter = anime.sort((a,b)=>(
        b?.year - a?.year ||
        parseInt(b?.AdditionalInfo?.startDate?.split("-")[0]) - parseInt(a?.AdditionalInfo?.startDate?.split("-")[0])))
        setFilterAnime(filter)
      }
    }else if(appliedFilter.sort === ""){
      setFilterAnime([])
    }
  }
  const handleApply = () => {
    // if (filterCount === 0) return ToastAndroid.show("Select atleast one Filter", ToastAndroid.SHORT)
    if (isValidData(convertGenretoURL()) || isValidData(appliedFilter?.status) ||
    isValidData(appliedFilter?.subtype) || isValidData(appliedFilter?.type) ||
    isValidData(appliedFilter?.season) || isValidData(convertYeartoURL())){
      if (input === "") {
        fetchData(" ", 1)
      }
      else {
        fetchData(input, 1)
      }
    }
    // onSelectSort(selected?.sort)
    handleSortRender()
    setModal(false)
  }
  const handleReset = () => {
    // if (filterCount === 0) return ToastAndroid.show("Select atleast one Filter", ToastAndroid.SHORT)
    setAppliedFilter(prev=>({
      ...prev,
      sort: "",
      suborDub: "",
      type: "",
      year: [],
      status: "",
      season: "",
      genre: [],
    }))
    setFilterAnime([])
    setfilterCount(0)
    setModal(false)
  }

  return (
    <View style={styles.container}>
      <View style={{ borderBottomColor: color.LighterGray, borderWidth: 0.5, height: 50, marginBottom: 5 }}>
        <HeaderHome />
      </View>
      <View style={styles.Container2}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.search}
            value={input}
            onChangeText={(text) => setInput(text)}
            placeholder='search....'
          />
          <TouchableOpacity onPress={() => fetchData(input, 1)}>
            <MIcon name="search" color={color.Orange} size={30} />
          </TouchableOpacity>
        </View>
        <View style={{ position: "relative",overflow:"hidden" }}>
          <TouchableOpacity onPress={() => setModal(!modal)}>
            <IIcon name="options-outline" size={40} color={color.LightGray} />
          </TouchableOpacity>
          {
            filterCount >0&& (
              <View style={{ 
                position: "absolute", top: 0, right: 0,
                width:20, height:20, backgroundColor:color.Orange, 
                justifyContent:"center",alignItems:"center", borderRadius:999,
               }}>
                <Text style={{color:color.White, fontFamily:font.OpenSansBold, fontSize:14}}>{filterCount}</Text>
              </View>
            )
          }

        </View>

      </View>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        {isLoading ? (
          <FlatList
            data={[1, 2, 3, 4, 5, 6, 7]}
            keyExtractor={(item, index) => `${item}-SearchScreenSkeleton`}
            // ListHeaderComponent={listHeader}
            // ListFooterComponent={listFooter}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({ item }) => {
              return (
                <View style={{ marginVertical: 5 }}>
                  <SkeletonSlider
                    width={width * 0.95}
                    height={130}
                    opacity={1}
                    borderRadius={10}
                  />
                </View>
              )
            }}
          />

        ) : (
          <View style={{ paddingVertical: 5 }}>
            <FlatList
              data={filterAnime.length > 0 ? filterAnime : anime}
              keyExtractor={(item, index) => `${item.animeID}-SearchScreenFlatList`}
              renderItem={renderItem}
              // ListHeaderComponent={listHeader}
              ListFooterComponent={listFooter}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
          </View>
        )}
      </View>
      <Modal visible={modal} transparent>
        <View style={styles.filterContainer}>
          <ScrollView>
            <TouchableOpacity onPress={() => setModal(!modal)} style={{ paddingHorizontal: 10, paddingVertical: 10, }}>
              <IIcon name="arrow-back" size={30} color={color.White} />
            </TouchableOpacity>
            {/* Sort Filter start */}
            <View style={{ gap: 10, paddingVertical: 10, paddingHorizontal: 10, }}>
              <Text style={styles.FilterHeading}>Sort</Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                {
                  sortYearItem.map((filter) => (
                    <TouchableOpacity
                      onPress={() => handleSort(filter.value)}
                      style={appliedFilter.sort === filter.value ? styles.FilterBtnActive : styles.FilterBtn} key={filter.name}>
                      <Text style={styles.filterText}>{filter.name}</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>

            </View>
            {/* Sort Filter End */}

            {/* Sub DUB Filter start */}
            <View style={{ gap: 10, paddingVertical: 10, paddingHorizontal: 10, }}>
              <Text style={styles.FilterHeading}>Sub or Dub</Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                {
                  subDubItem.map((filter) => (
                    <TouchableOpacity
                      onPress={() => handleSubDub(filter.value)}
                      style={appliedFilter.suborDub === filter.value ? styles.FilterBtnActive : styles.FilterBtn} key={filter.name}>
                      <Text style={styles.filterText}>{filter.name}</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>

            </View>
            {/* Sub DUB Filter End */}

            {/*Anime Type Filter start */}
            <View style={{ gap: 10, paddingVertical: 10, paddingHorizontal: 10, }}>
              <Text style={styles.FilterHeading}>Type</Text>
              <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
                {
                  TypeListItem.map((filter) => (
                    <TouchableOpacity
                      onPress={() => handleType(filter.value)}
                      style={appliedFilter.type === filter.value ? styles.FilterBtnActive : styles.FilterBtn} key={filter.name}>
                      <Text style={styles.filterText}>{filter.name}</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>

            </View>
            {/*Anime Type Filter End */}

            {/*Anime Status Filter start */}
            <View style={{ gap: 10, paddingVertical: 10, paddingHorizontal: 10, }}>
              <Text style={styles.FilterHeading}>Status</Text>
              <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
                {
                  StatusListItem.map((filter) => (
                    <TouchableOpacity
                      onPress={() => handleStatus(filter.value)}
                      style={appliedFilter.status === filter.value ? styles.FilterBtnActive : styles.FilterBtn} key={filter.name}>
                      <Text style={styles.filterText}>{filter.name}</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>

            </View>
            {/*Anime Status Filter End */}

            {/*Anime Season Filter start */}
            <View style={{ gap: 10, paddingVertical: 10, paddingHorizontal: 10, }}>
              <Text style={styles.FilterHeading}>Season</Text>
              <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
                {
                  seasonListItem.map((filter) => (
                    <TouchableOpacity
                      onPress={() => handleSeason(filter.value)}
                      style={appliedFilter.season === filter.value ? styles.FilterBtnActive : styles.FilterBtn} key={filter.name}>
                      <Text style={styles.filterText}>{filter.name}</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>

            </View>
            {/*Anime Season Filter End */}

            {/*Anime Year Filter start */}
            <View style={{ gap: 10, paddingVertical: 10, paddingHorizontal: 10, }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.FilterHeading}>Year</Text>
                <TouchableOpacity onPress={() => setYearLimit(!yearLimit)}>
                  <Text style={styles.seeAllText}>{yearLimit ? "Show All" : "Show Less"}</Text>
                </TouchableOpacity>

              </View>
              <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
                {
                  filteredAllYears?.map((filter) => (
                    <TouchableOpacity
                      onPress={() => handleSelectYearsFilter(filter)}
                      style={appliedFilter.year.includes(filter) ? styles.FilterBtnActive : styles.FilterBtn} key={filter}>
                      <Text style={styles.filterText}>{filter}</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>

            </View>
            {/*Anime Year Filter End */}

            {/*Genres Filter start */}
            <View style={{ gap: 10, paddingVertical: 10, paddingHorizontal: 10, }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.FilterHeading}>Genres</Text>
                <TouchableOpacity onPress={() => setGenreLimit(!genreLimit)}>
                  <Text style={styles.seeAllText}>{genreLimit ? "Show All" : "Show Less"}</Text>
                </TouchableOpacity>

              </View>
              <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
                {
                  filteredGenre?.map((filter) => (
                    <TouchableOpacity
                      onPress={() => handleSelectGenreFilter(filter)}
                      style={appliedFilter?.genre?.includes(filter) ? styles.FilterBtnActive : styles.FilterBtn} key={filter}>
                      <Text style={styles.filterText}>{filter}</Text>
                    </TouchableOpacity>
                  ))
                }
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
    </View>
  )
}


export default Search

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.DarkBackGround,
    padding: 2,
    gap: 10,
    // alignItems:"center",
    // justifyContent:"center"
  },
  Container2: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingHorizontal: 5,
    // marginTop:50,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: color.DarkBackGround,
    borderColor: color.LighterGray,
    borderWidth: 0.5,
    padding: 5,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 5,
    overflow: "hidden",
  },
  search: {
    padding: 5,
    // backgroundColor:'red',
    width: "75%",

  },
  filterContainer: {
    flex: 1,
    backgroundColor: color.DarkBackGround2,
    // padding: 10,
  },
  btnsContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginVertical: 5,
    marginBottom: 150,
  },
  btns: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: color.AccentBlue,
    borderRadius: 10
  },
  btnNumbers: {
    width: 25,
    height: 25,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  btnNumbersText: {
    fontFamily: font.OpenSansBold,
    color: color.White,
    fontSize: 14
  },
  btnText: {
    fontFamily: font.OpenSansBold,
    color: color.White,

  },
  FilterHeading: {
    fontFamily: font.OpenSansBold,
    color: color.White,
    fontSize: 16,
  },
  FilterBtn: {
    padding: 10,
    borderWidth: 0.5,
    borderColor: color.LighterGray,
    flex: 0,
    alignSelf: "flex-start",
    borderRadius: 10,
    minWidth: 60,
    alignItems: "center"
  },
  FilterBtnActive: {
    padding: 10,
    borderWidth: 0.5,
    backgroundColor: color.Orange,
    borderColor: color.LighterGray,
    flex: 0,
    alignSelf: "flex-start",
    borderRadius: 10,
    minWidth: 60,
    alignItems: "center"
  },
  filterText: {
    fontFamily: font.OpenSansMedium,
    color: color.White,
    fontSize: 14,
    textTransform: "capitalize",
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
  filterApplyContainer: {
    borderColor: color.LighterGray, borderWidth: 1, borderBottomColor: "transparent", borderBottomWidth: 0,
    borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: color.DarkBackGround2, paddingHorizontal: 10,
    height: 100, overflow: "hidden", flexDirection: "row", gap: 10, justifyContent: "center", alignItems: "center",
    paddingVertical: 20,

  },
  ResetBtn: {
    // borderColor:color.LighterGray,
    // borderWidth:1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    backgroundColor: color.DarkGray,
    width: "50%",
    height: 60,
  },
  ApplyBtn: {
    borderColor: color.LighterGray,
    borderWidth: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    backgroundColor: color.Orange,
    width: "50%",
    height: 60,
  },
})