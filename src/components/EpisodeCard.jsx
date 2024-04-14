import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React, { useMemo } from 'react'
import Theme from '../utils/Theme'
import { useLanguage } from '../contexts/LanguageContext'
import FastImage from 'react-native-fast-image'

const color = Theme.DARK
const font = Theme.FONTS

const EpisodeCard = ({ episode, anime, episodeId }) => {
    const { currentLang } = useLanguage()
    // console.log(episodeId)
    // console.log(episode?.id)
    const memoizedPoster = useMemo(() => {
        if (episode?.thumbnail) {
            return episode?.thumbnail
        } else if (anime?.animeImg) {
            return anime?.animeImg
        }
        // else{
        //     return "https://cdn1.vectorstock.com/i/1000x1000/32/45/no-image-symbol-missing-available-icon-gallery-vector-45703245.jpg"
        // }
    }, [episode?.thumbnail, anime?.animeImg])

    const memoizedEpisodeTitle = useMemo(() => {
        if (currentLang === "en") {
            if (episode?.title?.english) {
                return episode?.title?.english
            }
            else if (episode?.title?.english_jp) {
                return episode?.title?.english_jp
            }
            else if (episode?.aniInfo?.title) {
                return episode?.aniInfo?.title
            }
        } else {
            if (episode?.title?.english_jp) {
                return episode?.title?.english_jp
            }
            else if (episode?.title?.japanese) {
                return episode?.title?.japanese
            }
            else if (episode?.aniInfo?.title) {
                return episode?.aniInfo?.title
            }
        }
    }, [episode?.title, currentLang, episodeId,episode?.aniInfo?.title])

    const memoizedSubDub = useMemo(() => {
        if (episode?.hasDub) {
            return "dub"
        } else {
            return "sub"
        }
    }, [episode?.hasDub, episodeId])
    return (
        <View style={[styles.container, {
            backgroundColor: episodeId === episode.id ? color.Orange : color.DarkBackGround,
        }]}>
            <FastImage
                source={{
                    uri: memoizedPoster,
                    priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
                style={styles.Poster}
            />

            {/* <Image 
                style={styles.Poster}
                source={{uri:memoizedPoster}}
            /> */}
            <View style={styles.InfoContainer}>
                <Text numberOfLines={2} style={styles.title}>{memoizedEpisodeTitle}</Text>
                <Text style={[styles.episode, { color: episodeId === episode.id ? color.White : color.Orange }]}>Episode {episode?.number}</Text>
                <Text style={styles.subDub}>{memoizedSubDub}</Text>
            </View>
        </View>
    )
}

export default EpisodeCard

const styles = StyleSheet.create({
    container: {
        borderColor: color.LighterGray,
        borderWidth: 1,
        width: Dimensions.get("window").width * 0.95,
        height: 120,
        borderRadius: 5,
        overflow: "hidden",
        flexDirection: "row",
        margin: 4,
    },
    Poster: {
        width: 120,
        height: "100%",
    },
    InfoContainer: {
        paddingHorizontal: 6,
        paddingVertical: 5,
        flex: 1,
        gap: 5,
    },
    title: {
        fontFamily: font.OpenSansSemiBold,
        fontSize: 13,
        color: color.White,
        // flex:1,
    },
    episode: {
        fontFamily: font.OpenSansSemiBold,
        fontSize: 13,
        color: color.Orange,
        textTransform: "capitalize"
    },
    subDub: {
        fontFamily: font.OpenSansBold,
        fontSize: 13,
        textTransform: "capitalize",
        color: color.AccentBlue,
    },
})