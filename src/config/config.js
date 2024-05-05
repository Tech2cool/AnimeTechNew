
export const BASE_URL = "https://anitaku.to";
export const BASE_AJAX_URL = "https://ajax.gogocdn.net";
export const PATH_ANCLYTIC = "/anclytic-ajax.html";
export const PATH_SEARCH = "/search.html";
export const PATH_SEARCH_AJAX = "/site/loadAjaxSearch";
export const PATH_POPULAR = "/popular.html";
export const PATH_FILTER = "/filter.html";
export const PATH_MOVIES = "/anime-movies.html";
export const PATH__NEW_SEASON = "/new-season.html";
export const PATH_RECENT_RELEASE_URL = `/ajax/page-recent-release.html`;
export const PATH_LIST_EPISODES_URL = `/ajax/load-list-episode`;
export const PATH_POPULAR_ONGOING_URL = `/ajax/page-recent-release-ongoing.html`;

const DOMAIN = process.env.DOMAIN || "hianime.to";

export const SRC_BASE_URL = `https://${DOMAIN}`;
export const SRC_AJAX_URL = `${SRC_BASE_URL}/ajax`;
export const SRC_HOME_URL = `${SRC_BASE_URL}/home`;
export const SRC_SEARCH_URL = `${SRC_BASE_URL}/search`;
export const ACCEPT_ENCODING_HEADER = "gzip, deflate, br";

export const USER_AGENT_HEADER =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4692.71 Safari/537.36";

export const ACCEPT_HEADER =
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9";


export const API_RECENT_RELEASE = BASE_AJAX_URL +PATH_RECENT_RELEASE_URL;
export const API_LIST_EPISODES_URL = BASE_AJAX_URL + PATH_LIST_EPISODES_URL;
export const API_POPULAR_ONGOING_URL = BASE_AJAX_URL + PATH_POPULAR_ONGOING_URL;
export const API_SEARCH_URL = BASE_URL + PATH_SEARCH;
export const API_SEARCH_AJAX_URL = BASE_AJAX_URL + PATH_SEARCH_AJAX;
export const API_POPULAR_URL = BASE_URL + PATH_POPULAR;
export const API_FILTER_URL = BASE_URL + PATH_FILTER;
export const API_NEW_SEASON_URL = BASE_URL + PATH__NEW_SEASON;
export const API_MOVIES_URL = BASE_URL + PATH_MOVIES;
export const API_ANCLYTIC_URL = BASE_AJAX_URL + PATH_ANCLYTIC;
export const StreamingServers = {
  AsianLoad: "asianload",
  GogoCDN: "gogocdn",
  StreamSB: "streamsb",
  MixDrop: "mixdrop",
  UpCloud: "upcloud",
  VidCloud: "vidcloud",
  StreamTape: "streamtape",
  VizCloud: "vidplay",
  MyCloud: "mycloud",
  Filemoon: "filemoon",
  VidStreaming: "vidstreaming",
  AllAnime: "allanime",
  FPlayer: "fplayer",
  Kwik: "kwik",
  DuckStream: "duckstream",
  DuckStreamV2: "duckstreamv2",
  BirdStream: "birdstream",
  AnimeFlix: "animeflix",
}
export default config ={
  API_RECENT_RELEASE,
  API_LIST_EPISODES_URL,
  API_POPULAR_ONGOING_URL,
  API_SEARCH_URL,
  API_SEARCH_AJAX_URL,
  API_POPULAR_URL,
  API_FILTER_URL,
  API_NEW_SEASON_URL,
  API_MOVIES_URL,
  API_ANCLYTIC_URL,

}