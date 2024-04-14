import axios from 'axios';
import {SECRET_KEY, SECRET_SALT, SERVER_BASE_URL, StreamingServers} from './contstant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from "react-native-crypto-js";

export async function fetchRecentAnime(pageNum = 1) {
  try {
    const response = await axios.get(
      `${SERVER_BASE_URL}/recent?page=${pageNum}&key=${SECRET_KEY2()}`,
    );
    // console.log(response?.data?.list)
    return response?.data;
  } catch (error) {
    // console.log(error?.message)
    return error?.message;
    // return []
  }
}
export async function fetchRandomAnime() {
  try {
    const response = await axios.get(`${SERVER_BASE_URL}/random`);
    // console.log(response?.data?.list)
    return response?.data;
  } catch (error) {
    // console.log(error?.message)
    return error?.message;
    // return []
  }
}

export async function fetchTopAiringAnime(pageNum = 1) {
  try {
    const response = await axios.get(
      `${SERVER_BASE_URL}/top-airing?page=${pageNum}&key=${SECRET_KEY2()}`,
    );
    // console.log(response?.data?.list)
    return response?.data;
  } catch (error) {
    // console.log(error?.message)
    return error?.message;
    // return []
  }
}
export function isValidData(data) {
  if (
    data === null ||
    data === undefined ||
    data === '' ||
    data === 'undefined' ||
    data === 'null'
  )
    return false;
  else return true;
}
const SECRET_KEY2 = ()=>{
  return saltedMd5(SECRET_KEY,SECRET_SALT)
}
export async function fetchPopularAnime(pageNum = 1) {
  try {
    const response = await axios.get(
      `${SERVER_BASE_URL}/popular?page=${pageNum}&key=${SECRET_KEY2()}`,
    );
    return response?.data;
  } catch (error) {
    // console.log(error?.message)
    return error?.message;
    // return []
  }
}

export async function fetchMoviesAnime(alphabet = '', pageNum = 1) {
  try {
    const response = await axios.get(
      `${SERVER_BASE_URL}/movies?alphabet=${alphabet}&page=${pageNum}&key=${SECRET_KEY2()}`,
    );
    // console.log(response?.data?.list)
    return response?.data;
  } catch (error) {
    // console.log(error?.message)
    return error?.message;
    // return []
  }
}

export async function fetchAnimeInfo(animeID, aniwatchId) {
  try {
    const response = await axios.get(
      `${SERVER_BASE_URL}/anime-details?animeID=${animeID}&aniwatchId=${aniwatchId}&key=${SECRET_KEY2()}`,
    );
    return response?.data;
  } catch (error) {
    // console.log(error?.message)
    return error?.message;
    // return []
  }
}
export async function fetchEpisodes(animeId, kId, aniwatchId) {
  try {
    let Link = `${SERVER_BASE_URL}/episodes?animeID=${animeId}&kid=${kId}&aniwatchId=${aniwatchId}&key=${SECRET_KEY2()}`;
    const response = await axios.get(Link);
    // const response = await axios.get(`${SERVER_BASE_URL}/episodes?animeID=${animeId}&kid=${kId}`)
    return response?.data;
  } catch (error) {
    // console.log(error?.message)
    return error?.message;
    // return []
  }
}
export async function fetchSource(
  episodeId,
  streamServer = StreamingServers.GogoCDN,
  aniwatchEpId,
) {
  try {
    // console.log(episodeId)
    const response = await axios.get(
      `${SERVER_BASE_URL}/source?episodeID=${encodeURIComponent(
        episodeId,
      )}&streamServer=${streamServer}&aniwatchEpId=${aniwatchEpId}&key=${SECRET_KEY2()}`,
    );
    return response?.data;
  } catch (error) {
    // console.log(error?.message)
    return error?.message;
    // return []
  }
}
export async function fetchEpisodeInfoKitsu(kId, epNum) {
  try {
    // console.log(episodeId)
    const response = await axios.get(
      `${SERVER_BASE_URL}/kid?KitsuId=${kId}&episode=${parseInt(epNum)}&key=${SECRET_KEY2()}`,
    );
    return response?.data;
  } catch (error) {
    // console.log(error?.message)
    return error?.message;
    // return []
  }
}
export async function fetchTodaySchedule(date) {
  try {
    // console.log(date)
    const timeZone = new Date()?.getTimezoneOffset();
    // console.log(timeZone)
    const response = await axios.get(
      `${SERVER_BASE_URL}/scheduleToday?date=${date}&timeZone=${timeZone}&key=${SECRET_KEY2()}`,
    );
    return response?.data;
  } catch (error) {
    // console.log(error?.message)
    // return error?.message
    return [];
  }
}
export const fetchScheduleWeekly = async () => {
  try {
    // kid?KitsuId=44172&episode=37
    const result = await axios.get(`${SERVER_BASE_URL}/schedule-weekly&key=${SECRET_KEY2()}`);
    //    console.log({result1_Data:"schedule_Data"}, result.data);
    return result.data;
  } catch (error) {
    // console.log(error);
    return error;
  }
};

export async function fetchInfoBYSeach(
  sTitle,
  sPage,
  genre,
  status,
  subtype,
  type,
  season,
  year,
) {
  try {
    // console.log(date)
    let url = `${SERVER_BASE_URL}/search?title=${encodeURIComponent(
      sTitle,
    )}&page=${sPage}&key=${SECRET_KEY2()}`;
    if (isValidData(genre)) {
      url += `&genre=${encodeURIComponent(genre)}`;
    }
    if (isValidData(status)) {
      url += `&status=${status}`;
    }
    if (isValidData(subtype)) {
      url += `&subtype=${subtype}`;
    }
    if (isValidData(type)) {
      url += `&type=${type}`;
    }
    if (isValidData(season)) {
      url += `&season=${season}`;
    }
    if (isValidData(year)) {
      url += `&year=${encodeURIComponent(year)}`;
    }
    const result = await axios.get(url);

    // const response = await axios.get(`${SERVER_BASE_URL}/search?title=${encodeURIComponent(title)}&page=${page}`)
    return result?.data;
  } catch (error) {
    // console.log(error?.message)
    return error?.message;
    // return []
  }
}
export const downloadEp = async url => {
  try {
    // console.log(episodeID)
    const response = await axios.get(
      `${SERVER_BASE_URL}/download?url=/${encodeURIComponent(url)}&key=${SECRET_KEY2()}`,
    );
    return response?.data;
  } catch (error) {
    return {message: error};
  }
};
export function VidioDuration(time) {
  if (isNaN(parseFloat(time)) || !isFinite(time)) {
    return '0:00';
  }

  time = Math.floor(time);
  var hours = Math.floor(time / 3600);
  var minutes = Math.floor((time - hours * 3600) / 60);
  var seconds = time - hours * 3600 - minutes * 60;
  if (time < 3600) {
    return minutes + ':' + ('0' + seconds).slice(-2);
  } else {
    return (
      hours + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2)
    );
  }
}
export function convertToAMPM(timeString) {
  const [hours, minutes] = timeString?.split(':');
  let convertedHours = parseInt(hours, 10) % 12;
  convertedHours = convertedHours === 0 ? 12 : convertedHours;
  const period = parseInt(hours, 10) < 12 ? 'AM' : 'PM';
  return `${convertedHours}:${minutes} ${period}`;
}

export const setAsyncData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, data);
    return {message: 'Saved SuccessFully'};
  } catch (error) {
    return {message: error?.message};
  }
};
export const getAsyncData = async key => {
  try {
    const data = await AsyncStorage.getItem(key);
    if (data !== null) {
      return data;
    }
  } catch (error) {
    return {message: error?.message};
  }
};
export const generateDynamicLink = async (
  key,
  animeId,
  episodeId,
  episodeNum,
  imageUrl,
  title,
  description,
  kitsuId,
) => {
  const share = 'share';
  let myUrl = `${SERVER_BASE_URL}/${share}?key=${key}&animeId=${animeId}&kitsuId=${kitsuId}&episodeId=${episodeId}&episodeNum=${episodeNum}`;
  if (key === 'anime') {
    myUrl = `${SERVER_BASE_URL}/${share}?key=${key}&animeId=${animeId}`;
  }
  saveGeneratedLink(
    key,
    animeId,
    episodeId,
    episodeNum,
    imageUrl,
    title,
    description,
    kitsuId,
  );
  return myUrl;
};

async function saveGeneratedLink(
  key,
  animeId,
  episodeId,
  episodeNum,
  imageUrl,
  title,
  description,
  kitsuId,
) {
  try {
    if (key === 'anime') {
      await axios.post(`${SERVER_BASE_URL}/url`, {
        key,
        animeId: encodeURIComponent(animeId),
        imageUrl: imageUrl,
        title: title,
        description: description,
      });
    } else {
      await axios.post(`${SERVER_BASE_URL}/url`, {
        key,
        animeId: encodeURIComponent(animeId),
        episodeId: encodeURIComponent(episodeId),
        kitsuId: kitsuId,
        episodeNum: episodeNum,
        imageUrl: imageUrl,
        title: title,
        description: description,
      });
    }
  } catch (error) {
    return {message: error};
  }
}
export const getQueryParams = url => {
  const queryParams = {};
  const queryString = url?.split('?')[1];

  if (queryString) {
    const pairs = queryString?.split('&');
    pairs.forEach(pair => {
      const [key, value] = pair?.split('=');
      queryParams[key] = value;
    });
  }

  return queryParams;
};

export function getAllYear() {
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
}

export function saltedMd5(
  data = '',
  salt = '',
  isAsync = false,
) {
  // Define salted data.
  const saltedData = data + salt;

  // Return hash promise if async indicator setted.
  if (isAsync) {
    return new Promise(resolve => resolve(CryptoJS.MD5(saltedData).toString()));
  }

  // Return hash in other cases.
  return CryptoJS.MD5(saltedData).toString();
  //  md5(saltedData);
}
