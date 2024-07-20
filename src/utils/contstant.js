export const SERVER_BASE_URL = "https://ani-short.vercel.app";
export const SERVER_BASE_URL_V2 = "https://ani-v2.vercel.app";
import MIcon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AIcon from 'react-native-vector-icons/AntDesign';
import EntIcon from 'react-native-vector-icons/Entypo';
import EVIcon from 'react-native-vector-icons/EvilIcons';
import FeaIcon from 'react-native-vector-icons/Feather';
import F5Icon from 'react-native-vector-icons/FontAwesome5';
import F6Icon from 'react-native-vector-icons/FontAwesome6';
import FonIcon from 'react-native-vector-icons/Fontisto';
import FoundIcon from 'react-native-vector-icons/Foundation';
import IIcon from 'react-native-vector-icons/Ionicons';

export const qualityPrefs ={
    _default: "default",
    _backup: "backup",
    _360p: "360p",
    _480p: "480p",
    _720p: "720p",
    _1080p: "1080p",
}
export const sortYearItem = [
    {
        name: "All",
        value: null,
    },
    {
        name: "Year-asc",
        value: "Year-asc",
    },
    {
        name: "Year-desc",
        value: "Year-desc",
    },
]
export const subDubItem = [
    {
        name: "All",
        value: null,
    },
    {
        name: "sub",
        value: "sub",
    },
    {
        name: "dub",
        value: "dub",
    },
]
export const StatusListItem = [
    {
        name: "All",
        value: null,
    },
    {
        name: "Upcoming",
        value: "Upcoming",
    },
    {
        name: "Ongoing",
        value: "Ongoing",
    },
    {
        name: "Completed",
        value: "Completed",
    },
]
export const TypeListItem = [
    {
        name: "All",
        value: null,
    },
    {
        name: "Movie",
        value: "3",

    },
    {
        name: "TV",
        value: "1",

    },
    {
        name: "OVA",
        value: "26",

    },
    {
        name: "ONA",
        value: "30",

    },
    {
        name: "Special",
        value: "2",
    },
    {
        name: "Music",
        value: "32",
    }
]
export const seasonListItem = [
{
    name: "All",
    value: null,
},
{
    name: "fall",
    value: "fall",
},
{
    name: "summer",
    value: "summer",
},
{
    name: "spring",
    value: "spring",
},
{
    name: "winter",
    value: "winter",
}
]
export const genresList = [
    'action',
    'adventure',
    'cars',
    'comedy',
    'crime',
    'dementia',
    'demons',
    'drama',
    'dub',
    'family',
    'fantasy',
    'game',
    'gourmet',
    'harem',
    'hentai',
    'historical',
    'horror',
    'josei',
    'kids',
    'magic',
    'martial-arts',
    'mecha',
    'military',
    'music',
    'mystery',
    'parody',
    'police',
    'psychological',
    'romance',
    'samurai',
    'school',
    'sci-fi',
    'seinen',
    'shoujo',
    'shoujo-ai',
    'shounen',
    'shounen-ai',
    'slice-of-Life',
    'space',
    'sports',
    'super-power',
    'supernatural',
    'suspense',
    'thriller',
    'vampire',
    'yaoi',
    'yuri',
    'isekai',
    "Ecchi",
    "adult-cast",
    "anthropomorphic",
    "avant-garde",
    "boys-love",
    "cgdct",
    "childcare",
    "comic",
    "crossdressing",
    "delinquents",
    "detective",
    "erotica",
    "gag-humor",
    "gender-bender",
    "magical-sex-shift",
    "gore",
    "high-stakes-game",
    "iyashikei",
    "mahou-shoujo",
    "medical",
    "mythology",
    "organized-crime",
    "performing-arts",
    "pets",
    "racing",
    "reincarnation",
    "romantic-subtext",
    "showbiz",
    "strategy-game",
    "survival",
    "team-sports",
    "time-travel",
    "video-game",
    "visual-arts",
    "work-life",
    "workplace",
]
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
export const providers =[
    "anitaku",
    "aniwatch",
]

export {
    MIcon,
    MCIcon,
    AIcon,
    EntIcon,
    EVIcon,
    FeaIcon,
    F5Icon,
    F6Icon,
    FonIcon,
    FoundIcon,
    IIcon,
}
export const MoviesListItem = [
    { name:"all",value: null },
    { name:"zero",value: "0" },
    { name: "a", value: "a" },
    { name:"b", value: "b" },
    { name:"c", value: "c" },
    { name:"d", value: "d" },
    { name:"e", value: "e" },
    { name:"f", value: "f" },
    { name:"g", value: "g" },
    { name:"h", value: "h" },
    { name:"i", value: "i" },
    { name:"j", value: "j" },
    { name:"k", value: "k" },
    { name:"l", value: "l" },
    { name:"m", value: "m" },
    { name:"n", value: "n" },
    { name:"o", value: "o" },
    { name:"p", value: "p" },
    { name:"q", value: "q" },
    { name:"r", value: "r" },
    { name:"s", value: "s" },
    { name:"t", value: "t" },
    { name:"u", value: "u" },
    { name:"v", value: "v" },
    { name:"w", value: "w" },
    { name:"x", value: "x" },
    { name:"y", value: "y" },
    { name:"z", value: "z" }
]

export const SECRET_KEY = "Tech@Anime1205"
export const SECRET_SALT = "thisIsAnimeTestKey@789"
