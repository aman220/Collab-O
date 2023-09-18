import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';

import Welcome from './src/Screens/OnBoarding/Welcome';
import Tabs from './src/MainTabs';
import LoginScreen from './src/Screens/OnBoarding/LoginScreen';
import RegisterScreen from './src/Screens/OnBoarding/RegisterScreen';
import SplashScreen from './src/Screens/SplashScreen';
import fonts from './config/fonts';
import Home from './src/Screens/Home';
import MainTabs from './src/MainTabs';
import AddProfile from './src/Screens/OnBoarding/AddProfile';
import Aboutus from './src/Screens/AccountSection/Aboutus';
import UpdateProfile from './src/Screens/AccountSection/UpdateProfile';
import Profile from './src/Screens/AccountSection/Profile';
import U_Media from './src/UserData/U_Media';
import U_Posts from './src/UserData/U_Posts';
import Upload from './src/Screens/Upload';
import Projectpost from './src/Screens/Post_Screens/Projectpost';
import ResearchPost from './src/Screens/Post_Screens/ResearchPost';
import BidReqest from './src/Screens/BidRequests/BidReqest';
import Channels from './src/Screens/Discussion/Channels';
import Notifications from './src/Screens/Notification/Notifications';

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts(fonts);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Maintabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddProfile"
          component={AddProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Aboutus"
          component={Aboutus}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UpdateProfile"
          component={UpdateProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="myprofile"
          component={Profile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="U_Media"
          component={U_Media}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="U_Post"
          component={U_Posts}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="upload"
          component={Upload}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="projectpost"
          component={Projectpost}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="researchpost"
          component={ResearchPost}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="bidrequest"
          component={BidReqest}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Channels"
          component={Channels}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="notification"
          component={Notifications}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
