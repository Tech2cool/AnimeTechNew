import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useMemo, useState} from 'react';
import FastImage from 'react-native-fast-image';
import Theme from '../../../../utils/Theme';
import {stripHtmlTags} from '../../../../utils/HelperFunctions';
import {FeaIcon} from '../../../../utils/contstant';
import moment from 'moment';
const color = Theme.DARK;
const font = Theme.FONTS;

const ChatCard = ({item}) => {
  const [showFullComment, setShowFullComment] = useState(false);

  const memoziedImg = useMemo(() => {
    if (item?.author?.avatar?.xlarge?.permalink) {
      return item?.author?.avatar?.xlarge?.permalink;
    } else if (item?.author?.avatar?.large?.permalink) {
      return item?.author?.avatar?.large?.permalink;
    } else if (item?.author?.avatar?.small?.permalink) {
      return item?.author?.avatar?.small?.permalink;
    }

    return item?.author?.avatar?.permalink;
  }, [item?.author?.avatar]);

  const memoziedMsg = useMemo(() => {
    if (item?.message) {
      return stripHtmlTags(item?.message);
    }
  }, [item?.message]);

  const handleClick = () => {
    setShowFullComment(!showFullComment);
  };
  return (
    <View style={styles.commentOne}>
      <View style={styles.imageContainer}>
        <FastImage
          style={{flex: 1}}
          resizeMode={FastImage.resizeMode.cover}
          source={{
            uri: memoziedImg,
          }}
        />
      </View>
      <View style={{flex: 1, gap: 5}}>
        <View style={{flex: 1, flexDirection: 'row', gap: 5}}>
          <Text
            numberOfLines={1}
            style={[
              styles.textInfo,
              {fontSize: 12, fontFamily: font.RobotoBold},
            ]}>
            @{item?.author?.name}
          </Text>
          <Text>{`\u2022`}</Text>
          <Text
            style={[
              styles.textInfo,
              {fontSize: 12, fontFamily: font.RobotoBold},
            ]}>
            {moment(item?.createdAt).fromNow()}
          </Text>
        </View>
        <TouchableOpacity onPress={handleClick}>
          <Text
            numberOfLines={showFullComment ? undefined : 3}
            style={[styles.textInfo, {flex: 1, fontSize: 12}]}>
            {memoziedMsg}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            padding: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}>
            <FeaIcon name={'thumbs-up'} size={18} color={color.LightGray} />
            <Text>{item?.likes}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}>
            <FeaIcon name={'thumbs-down'} size={18} color={color.LightGray} />
            <Text>{item?.dislikes}</Text>
          </View>
        </View>
      </View>
      {/* {list?.map((item, index) => (
          <Text key={index}>{item?.message}</Text>
        ))} */}
    </View>
  );
};

export default ChatCard;

const styles = StyleSheet.create({
  textInfo: {
    fontSize: 14,
    opacity: 0.8,
    color: color.LightGray,
    fontFamily: font.RobotoRegular,
  },
  commentOne: {
    flexDirection: 'row',
    // alignItems: 'center',
    gap: 10,
    marginVertical: 5,
  },
  imageContainer: {
    width: 35,
    height: 35,
    borderRadius: 999,
    overflow: 'hidden',
  },
});
