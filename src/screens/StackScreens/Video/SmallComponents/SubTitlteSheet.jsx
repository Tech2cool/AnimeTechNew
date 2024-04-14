import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useVideoPlayer} from '../../../../contexts/VideoContext';
import {MCIcon, MIcon} from '../../../../utils/contstant';
import Theme from '../../../../utils/Theme';
const color = Theme.DARK;
const font = Theme.FONTS;

const SubTitlteSheet = ({setTextTrackByTitle}) => {
  const {VideoPlayer, setVideoPlayer} = useVideoPlayer();
  const setCustomCC = (type = 'index', value) => {
    // const findqualityProvider= source?.sources?.find((ql,i)=>ql?.url === VideoPlayer?.url)
    setVideoPlayer(prev => ({
      ...prev,
      selectedTextTrack: {
        ...prev.selectedTextTrack,
        type: type,
        value: value,
      },
    }));
    // setSelectedTextTrack(prev => ({
    //   ...prev,
    //   type: type,
    //   value: value,
    // }));
  };
  const findGogoOrAniwatch=(index)=>{
    if(VideoPlayer.provider === "gogo"){
        return index+1
    }else{
        return index
    }
  }


  return (
    <View style={styles.container}>
      <TouchableOpacity
        // onPress={handleGOBack}
        style={[
          styles.Btn,
          {
            // borderBottomWidth:0.5,
            paddingHorizontal: 10,
          },
        ]}>
        <MIcon name="arrow-back-ios" size={20} color={color.White} />
        <Text style={styles.btnText}>Sub Titles</Text>
      </TouchableOpacity>

      <ScrollView>
        {VideoPlayer.textTracks?.length <= 0 ? (
          <>
            <Text style={styles.btnText}>No Subtitle Available</Text>
          </>
        ) : (
          VideoPlayer.textTracks?.map((track, i) => (
              <TouchableOpacity
                key={`${track?.index}-${track?.title}-${i}`}
                onPress={() => setTextTrackByTitle(track?.title)}
                style={[
                  styles.Btn,
                  {
                    backgroundColor:
                      VideoPlayer?.selectedTextTrack?.value === track?.index
                        ? color.Orange
                        : color.LighterGray,
                  },
                ]}>
                <MCIcon name={'subtitles'} size={28} color={color.White} />
                {/* <Text style={[styles.btnText,{textTransform:"uppercase"}]}>{track?.index}</Text> */}
                <Text
                  style={[
                    styles.btnText,
                    {textTransform: 'uppercase', maxWidth: '75%'},
                  ]}>
                  {track?.title}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    flex: 1,
                  }}>
                  <Text style={[styles.btnText, {textTransform: 'capitalize'}]}>
                    {track?.type}
                  </Text>
                </View>
              </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default SubTitlteSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal:10,
    // gap:10,
    // rowGap:10,
    // columnGap:10,
    // paddingBottom:10,
  },
  Btn: {
    flexDirection: 'row',
    gap: 10,
    padding: 10,
    marginVertical: 5,
    // justifyContent:"center",
    alignItems: 'center',
    borderBottomColor: color.LighterGray,
    // paddingVertical:10,
    borderRadius: 5,
  },
  btnText: {
    color: color.White,
    fontFamily: font.OpenSansMedium,
    fontSize: 15,
  },
});
