import axios from 'axios';
import {SERVER_BASE_URL} from '../utils/contstant';

export const fetchHomeAniwatch = async () => {
  try {
    let url = `${SERVER_BASE_URL}/v3/home`;
    const resp = await axios.get(url);
    return resp.data;
  } catch (error) {
    return null;
  }
};

export const fetchInfoAniwatch = async ({id}) => {
  try {
    let url = `${SERVER_BASE_URL}/v3/info/${id}`;
    const resp = await axios.get(url);
    return resp.data;
  } catch (error) {
    console.log(error)
    return null;
  }
};

export const fetchEpisodesAniwatch = async ({id}) => {
  try {
    let url = `${SERVER_BASE_URL}/v3/episodes/${id}`;
    const resp = await axios.get(url);
    return resp.data;
  } catch (error) {
    return null;
  }
};

export const fetchSourcesAniwatch = async ({id}) => {
  try {
    let url = `${SERVER_BASE_URL}/v3/stream/${encodeURIComponent(id)}`;
    const resp = await axios.get(url);
    // console.log(JSON.stringify(resp.data,null,2))
    return resp.data;
  } catch (error) {
    console.log(error)

    return null;
  }
};
export const fetchEpisodeServersAniwatch = async ({id}) => {
  try {
    let url = `${SERVER_BASE_URL}/v3/episode-servers/${encodeURIComponent(id)}`;
    // console.log(url)
    const resp = await axios.get(url);
    // console.log(JSON.stringify(resp.data,null,2))
    return resp.data;
  } catch (error) {
    console.log(error)

    return null;
  }
};
export const searchAnimeAniwatch = async ({query, page=1}) => {
  try {
    let url = `${SERVER_BASE_URL}/v3/search?query=${query}&page=${page}`;
    const resp = await axios.get(url);
    return resp.data;
  } catch (error) {
    return null;
  }
};

export const fetchScheduleAniwatch = async ({date}) => {
  try {
    let timeZone = new Date().getTimezoneOffset();

    let url = `${SERVER_BASE_URL}/v3/schedule?tzoffset=${timeZone}&date=${date}`;
    const resp = await axios.get(url);
    return resp.data;
  } catch (error) {
    return null;
  }
};