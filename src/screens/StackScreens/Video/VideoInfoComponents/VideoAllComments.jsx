import React, {memo, useCallback, useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Text,
} from 'react-native';
import Theme from '../../../../utils/Theme';
import ChatCard from './ChatCard';

const color = Theme.DARK;
const VideoAllComments = ({
  threadId,
  isLoading = false,
  data,
  list,
  setCursor,
}) => {
  const renderItem = useCallback(({item}) => {
    return <ChatCard item={item} />;
  }, []);

  const onEndReached = useCallback(() => {
    if (data?.cursor?.hasNext) {
      setCursor(data?.cursor?.next);
    }
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        data={list}
        keyExtractor={(item, index) => `${item?.id} ${index}`}
        renderItem={renderItem}
        onEndReached={onEndReached}
        ListFooterComponent={() => (
          <View style={{paddingVertical: 30}}>
            {isLoading ? <ActivityIndicator size={22} color={color.Red} /> : ''}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
});

export default memo(VideoAllComments);
