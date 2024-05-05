import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import SkeletonSlider from '../../../../components/SkeletonSlider';
import Theme from '../../../../utils/Theme';
import EpisodeCard from '../../../../components/EpisodeCard';
import {MCIcon} from '../../../../utils/contstant';
import { useVideoState } from '../../../../context/VideoStateContext';
const color = Theme.DARK;
const font = Theme.FONTS;
const VideoEpisodesCompoent = ({
  id,
  episodeId,
  episodeNum,
  anime,
  episodes = [],
  isLoading = false,
  showEpisodes, 
  setShowEpisodes,
}) => {
  const navigation = useNavigation();
  const {videoState, setVideoState}= useVideoState()
  
  const episodesList = episodes.find(ep => ep.id === episodeId);
  const navigateVideo = item => {
    setVideoState({...videoState, url:undefined})

    navigation.navigate('watch', {
      id: id,
      episodeId: item?.id,
      episodeNum: item?.episodeNum || item?.number,
      provider: 'anitaku',
    });
  };

  if (isLoading) {
    return (
      <View style={{gap: 10, alignItems:"center"}}>
        <SkeletonSlider
          width={Dimensions.get('window').width * 0.95}
          height={130}
          opacity={1}
          // borderRadius={10}
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setShowEpisodes(!showEpisodes)}
        style={{
          paddingVertical:5,
          paddingHorizontal:8,
          borderColor: color.LighterGray,
          borderWidth: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems:"center",
          margin: 4,
        }}>
        <Text style={{fontFamily: font.OpenSansBold, color: color.White}}>
          Episodes
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontFamily: font.OpenSansMedium, color: color.Orange}}>
            {showEpisodes ? "hide":"Show all"}
          </Text>

          <MCIcon name="chevron-down" size={30} color={color.Orange} />
          <Text style={{fontFamily: font.OpenSansBold, color: color.White}}>
            {episodeNum + '/' + (episodes?.length || anime?.totalEpisodes)}
          </Text>
        </View>
      </TouchableOpacity>

      <ScrollView
        style={{
          padding: 8,
          borderColor: color.LighterGray,
          borderWidth: 0.5,
          margin: 4,
        }}>
        <TouchableOpacity
          onPress={() => navigateVideo(episodesList)}
          style={{flex: 1}}>
          <EpisodeCard
            item={episodesList}
            anime={anime}
            episodeId={episodeId}
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default memo(VideoEpisodesCompoent);

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
});
