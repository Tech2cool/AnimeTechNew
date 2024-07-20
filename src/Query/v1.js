import axios from 'axios';
import {SERVER_BASE_URL} from '../utils/contstant';

export const fetchRecentRelease = async ({page = 1}) => {
  try {
    let url = `${SERVER_BASE_URL}/recent?page=${page}`;
    const resp = await axios.get(url);
    return resp.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchTrending = async ({page = 1}) => {
  try {
    let url = `${SERVER_BASE_URL}/top-airing?page=${page}`;
    const resp = await axios.get(url);
    return resp.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchPopular = async ({page = 1}) => {
  try {
    let url = `${SERVER_BASE_URL}/popular?page=${page}`;
    const resp = await axios.get(url);
    return resp.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchMovies = async ({page = 1, alphabet}) => {
  try {
    let url = `${SERVER_BASE_URL}/movies?page=${page}`;
    if (alphabet) {
      url += `&alphabet=${alphabet}`;
    }
    const resp = await axios.get(url);
    return resp.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const fetchInfo = async ({id}) => {
  try {
    let url = `${SERVER_BASE_URL}/anime-details/${id}`;

    const resp = await axios.get(url);
    return resp.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const fetchInfoV2 = async ({id}) => {
  try {
    let url = `${SERVER_BASE_URL}/anime-details/v2/${id}`;

    const resp = await axios.get(url);
    return resp.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const fetchTrailerInfo = async ({id}) => {
  try {
    let url = `${SERVER_BASE_URL}/trailer/${id}`;

    const resp = await axios.get(url);
    return resp.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const fetchEpisodes = async ({id}) => {
  try {
    let url = `${SERVER_BASE_URL}/episodes/${id}`;

    const resp = await axios.get(url);
    // console.log(resp.data)
    return resp.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchSource = async ({id, streamServer, subtype}) => {
  try {
    let url = `${SERVER_BASE_URL}/source/${id}?streamServer=${streamServer}&subtype=${subtype}`;

    const resp = await axios.get(url);
    return resp.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const searchAnime = async ({
  page = 1,
  query,
  genre,
  status,
  subtype,
  type,
  season,
  year,
}) => {
  try {
    let url = `${SERVER_BASE_URL}/search?query=${query}&page=${page}`;
    if (genre) {
      url += `&genre=${encodeURIComponent(genre)}`;
    }
    if (status) {
      url += `&status=${status}`;
    }
    if (subtype) {
      url += `&subtype=${subtype}`;
    }
    if (type) {
      url += `&type=${type}`;
    }
    if (season) {
      url += `&season=${season}`;
    }
    if (year) {
      url += `&year=${encodeURIComponent(year)}`;
    }

    const resp = await axios.get(url);
    return resp.data;
  } catch (error) {
    throw new Error(error);
  }
};
export async function fetchVersion() {
  try {
    const response = await axios.get(`${SERVER_BASE_URL}/version`);
    // console.log(response?.data?.list)
    return response?.data;
  } catch (error) {
    // console.log(error?.message)
    throw new Error(error);
    // return []
  }
}

export const fetchRandom = async ({id}) => {
  try {
    let url = `${SERVER_BASE_URL}/random?id=${id}`;

    const resp = await axios.get(url);
    // console.log(resp.data)
    return resp.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const fetchHome = async () => {
  try {
    let url = `${SERVER_BASE_URL}/home`;

    const resp = await axios.get(url);
    // console.log(resp.data)
    return resp.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const fetchUpcoming = async ({type = undefined, page = 1}) => {
  try {
    let url = `${SERVER_BASE_URL}/upcoming-anime`;
    if (type) {
      url = `${SERVER_BASE_URL}/upcoming-anime/${type}?page=${page}`;
    }
    const resp = await axios.get(url);
    // console.log(resp.data)
    return resp.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchSeasonalAnime = async ({season, page = 1}) => {
  try {
    let url = `${SERVER_BASE_URL}/season/${season}?page=${page}`;

    const resp = await axios.get(url);
    return resp.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchRequestedAnime = async ({page = 1}) => {
  try {
    let url = `${SERVER_BASE_URL}/requested-list?page=${page}`;

    const resp = await axios.get(url);
    // console.log(resp.data)
    return resp.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchChats = async ({id, cursor = undefined}) => {
  try {
    let url = `${SERVER_BASE_URL}/chats/${id}`;

    if (cursor) {
      url += `/${cursor}`;
    }
    const resp = await axios.get(url);
    // console.log(resp.data)
    return resp.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const fetchReaction = async ({id}) => {
  try {
    const url = `${SERVER_BASE_URL}/reaction/${id}`;

    const resp = await axios.get(url);
    // console.log(resp.data)
    return resp.data;
  } catch (error) {
    throw new Error(error);
  }
};
