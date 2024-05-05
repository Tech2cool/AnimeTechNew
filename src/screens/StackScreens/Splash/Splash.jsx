import {View, ActivityIndicator, Dimensions} from 'react-native';
import React, {useEffect} from 'react';
import Theme from '../../../utils/Theme';
import Animated, {
  FadeIn,
  FadeInRight,
  FadeOutLeft,
} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
const color = Theme.DARK;
const font = Theme.FONTS;

const {width, height} = Dimensions.get('window');
const Splash = ({navigation, routes}, params) => {
  // const {isLoading} = params;
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('HomeStack');
      // Alert.alert("working", "working")
    }, 2000);
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.DarkBackGround,
        flexDirection: 'column',
        justifyContent: 'center',
        // gap: 15,
        alignItems: 'center',
      }}>
      <View style={{position: 'absolute', bottom: 0, top: 0}}>
        <FastImage
          source={require('../../../assets/images/rocket_up_2.gif')}
          style={{width: width, height: height}}
          resizeMode={FastImage.resizeMode.cover}
          pointerEvents="none"
        />
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
          borderRadius: 5,
          padding: 10,
          width: width,
        }}>
        <Animated.Text
          entering={FadeInRight.delay(100)}
          exiting={FadeOutLeft.delay(100)}
          style={{
            color: color.Orange,
            fontFamily: font.OpenSansBold,
            fontSize: 25,
          }}>
          AnimeTech
        </Animated.Text>
        <Animated.Text
          entering={FadeInRight.delay(300)}
          exiting={FadeOutLeft.delay(300)}
          style={{
            color: color.White,
            fontFamily: font.OpenSansBold,
            fontSize: 18,
          }}>
          Anime Streaming App
        </Animated.Text>

        <Animated.Text
          entering={FadeInRight.delay(500)}
          exiting={FadeOutLeft}
          style={{
            color: color.Orange,
            fontFamily: font.RobotoBold,
            fontSize: 20,
          }}>
          Powered By
        </Animated.Text>

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 10,
          }}>
          <Animated.Text
            entering={FadeInRight.delay(800)}
            exiting={FadeOutLeft}
            style={{
              color: color.AccentBlue,
              fontFamily: font.RobotoMedium,
              fontSize: 16,
              borderColor: color.AccentBlue,
              borderWidth: 2,
              padding: 5,
              textAlign: 'center',
              borderRadius: 99,
              backgroundColor: 'rgba(0,0,0,0.1)',
            }}>
            Anitaku
          </Animated.Text>
          <Animated.Text
            entering={FadeInRight.delay(1200)}
            exiting={FadeOutLeft}
            style={{
              color: color.Orange,
              fontFamily: font.RobotoMedium,
              fontSize: 16,
              borderColor: color.Orange,
              borderWidth: 2,
              padding: 5,
              textAlign: 'center',
              borderRadius: 99,
              backgroundColor: 'rgba(0,0,0,0.1)',
            }}>
            Aniwatch
          </Animated.Text>
          <Animated.Text
            entering={FadeInRight.delay(1600)}
            exiting={FadeOutLeft}
            style={{
              color: color.AccentGreen,
              fontFamily: font.RobotoMedium,
              fontSize: 16,
              borderColor: color.AccentGreen,
              borderWidth: 2,
              padding: 5,
              textAlign: 'center',
              borderRadius: 99,
              backgroundColor: 'rgba(0,0,0,0.1)',
            }}>
            Anilist
          </Animated.Text>
        </View>
      </View>
      <View style={{position: 'absolute', bottom: '15%', left: 0, right: 0}}>
        <Animated.View entering={FadeIn.delay(1200)}>
          <ActivityIndicator
            size={40}
            color={color.Red}
            style={{alignSelf: 'center', paddingTop: 20}}
          />
        </Animated.View>
      </View>
    </View>
  );
};

export default Splash;
