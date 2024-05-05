import AsyncStorage from '@react-native-async-storage/async-storage';

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
export const stripHtmlTags = html => {
  return html.replace(/<[^>]*>/g, '')?.replaceAll('\n', '');
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
// Function to find the index of the episode within the paginated data
export function findIndexInPaginatedData(episodes=[], episodeId, pageSize) {
  if(episodes?.length >0){
    const episodeIndex = episodes.findIndex((ep) => ep.id === episodeId);
    const page = Math.ceil((episodeIndex + 1) / pageSize);
    const indexInPage = (episodeIndex + 1) % pageSize || pageSize;
    return { page, indexInPage };
  }
  return { page:1, indexInPage:0 };
}
export const generateArray = (start, end)=>{
  const arr =[]
  for(let i = start; i <= end; i++){
    arr.push(i)
  }
  return arr
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

