import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Theme from '../utils/Theme';
const color = Theme.DARK;
const font = Theme.FONTS;
const colors = [
  color.Orange,
  color.AccentBlue,
  color.AccentGreen,
  color.LimeGreen,
  color.Red,
  color.Cyan,
];

const RandomColorCard = ({title}) => {
  const randomColor = colors[Math.floor(Math.random() * 5)];
  return title &&(
    <View
      style={[
        styles.container,
        {
          borderColor: randomColor,
        },
      ]}>
      <Text style={[styles.Text, {color: randomColor}]}>{title}</Text>
    </View>
  );
};

export default RandomColorCard;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    flex: 0,
    alignSelf: 'flex-start',
    justifyContent:"center",
    alignItems:"center",
    borderWidth: 1,
    borderRadius: 10,
  },
  Text: {
    fontFamily: font.RobotoMedium,
    fontSize: 12,
    // textTransform: 'capitalize',
  },
});
