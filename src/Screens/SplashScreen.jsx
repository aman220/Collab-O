import React, { useEffect } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import FontSize from '../const/FontSize';
import COLORS from '../const/colors';
import Font from '../const/Font';
import firebase from 'firebase/app';
import { firebaseAuth } from '../Firebase/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';



const { height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Simulate a delay for the splash screen
    setTimeout(async () => {
      // Check if the user is signed in using AsyncStorage
      try {
        const isLoggedIn = await AsyncStorage.getItem('@isLoggedIn');
        if (isLoggedIn === 'true') {
          // User is logged in, navigate to the main tabs screen
          navigation.navigate('Maintabs'); // Change 'MainTabs' to the name of your main tabs screen
        } else {
          // User is not logged in, navigate to the welcome screen
          navigation.navigate('Welcome'); // Change 'Welcome' to the name of your welcome screen
        }
      } catch (error) {
        // Error handling, you can handle errors here if needed
        console.error("Error checking login status: ", error);
        navigation.navigate('Welcome'); // Fallback to welcome screen in case of any error
      }
    }, 1000);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image source={require('../assets/logo.png')} style={{ height: 100, width: 100 }} />
      <Text
        style={{
          fontSize: FontSize.xLarge,
          color: COLORS.primary,
          fontFamily: Font['poppins-bold'],
          textAlign: 'center',
        }}
      >
        Omega Co
      </Text>
    </View>
  );
};

export default SplashScreen;
