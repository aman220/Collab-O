import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import Spacing from "../../const/Spacing";
import FontSize from "../../const/FontSize";
import COLORS from "../../const/colors";
import Font from "../../const/Font";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import showToast from "../../const/Toast";
import { firebaseAuth } from "../../Firebase/firebase"; // Update the path to your Firebase configuration file
import { Toast } from "react-native-toast-message/lib/src/Toast";
import AsyncStorage from '@react-native-async-storage/async-storage';


// Initialize Firebase Auth
const LoginScreen = () => {
  const navigation = useNavigation();

  // State variables for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle login
  const handleLogin = async () => {
    if (!email) return showToast("error", "Please fill Email");
    if (!password) return showToast("error", "Please fill password");
    try {
      setIsLoading(true);
      // Sign in with Firebase Auth using email and password
      const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
      const uid = userCredential.user.uid;
      showToast("success", "Logged in successfully!");
      await AsyncStorage.setItem('@isLoggedIn', 'true');
      await AsyncStorage.setItem('@userUid', uid);
      const auid = await AsyncStorage.getItem('@userUid');
      console.log("here is id ",auid)
      navigation.navigate("Maintabs");
    } catch (error) {
      showToast("error", error.message);
      console.error("Error logging in: ", error);
    }finally {
      setIsLoading(false); 
    }
  };


  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white }}>
       {isLoading && (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isLoading}
        onRequestClose={() => {}}
      >
        <View style={styles.loaderContainer}>
          <View style={styles.loaderContent}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loaderText}>Signing In...</Text>
            
          </View>
        </View>
      </Modal>)}
      <Toast/>
      <View style={styles.header}>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: FontSize.xLarge,
              color: COLORS.primary,
              fontFamily: Font["poppins-bold"],
              marginVertical: Spacing * 3,
            }}
          >
            Login Here
          </Text>
          <Text
            style={{
              fontFamily: Font["poppins-semiBold"],
              fontSize: FontSize.large,
              maxWidth: "68%",
              textAlign: "center",
            }}
          >
            Welcome back you've been missed
          </Text>
        </View>
        <View style={{ marginVertical: Spacing * 3 }}>
          <TextInput
           onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={COLORS.dark}
            style={{
              fontFamily: Font["poppins-regular"],
              fontSize: FontSize.small,
              padding: Spacing * 2,
              backgroundColor: COLORS.lightPrimary,
              borderRadius: Spacing,
              marginVertical: Spacing,
            }}
            value={email}
          />

          <TextInput
          onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={COLORS.dark}
            secureTextEntry
            style={{
              fontFamily: Font["poppins-regular"],
              fontSize: FontSize.small,
              padding: Spacing * 2,
              backgroundColor: COLORS.lightPrimary,
              borderRadius: Spacing,
              marginVertical: Spacing,
            }}
            value={password}
          />
        </View>
        <View>
          <Text
            style={{
              fontFamily: Font["poppins-semiBold"],
              fontSize: FontSize.small,
              color: COLORS.primary,
              alignSelf: "flex-end",
            }}
          >
            Forget your Password ?
          </Text>
        </View>
        <TouchableOpacity
          style={{
            padding: Spacing * 2,
            backgroundColor: COLORS.primary,
            marginVertical: Spacing * 3,
            borderRadius: Spacing,
            shadowColor: COLORS.primary,
            shadowOffset: {
              width: 0,
              height: Spacing,
            },
            shadowOpacity: 0.3,
            shadowRadius: Spacing,
          }}
          onPress={handleLogin}
        >
          <Text
            style={{
              fontFamily: Font["poppins-bold"],
              color: COLORS.white,
              textAlign: "center",
              fontSize: FontSize.large,
            }}
          >
            Sign in
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            padding: Spacing,
          }}
          onPress={() => navigation.navigate("Register")}
        >
          <Text
            style={{
              fontFamily: Font["poppins-semiBold"],
              color: COLORS.dark,
              textAlign: "center",
              fontSize: FontSize.small,
            }}
          >
            Create new account
          </Text>
        </TouchableOpacity>

        <View
          style={{
            marginVertical: Spacing * 3,
          }}
        >
          <Text
            style={{
              fontFamily: Font["poppins-semiBold"],
              color: COLORS.primary,
              textAlign: "center",
              fontSize: FontSize.small,
            }}
          >
            Or continue with
          </Text>

          <View
            style={{
              marginTop: Spacing,
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                padding: Spacing,
                backgroundColor: COLORS.gray,
                borderRadius: Spacing / 2,
                marginHorizontal: Spacing,
              }}
              onPress={() => showToast("error", "Under Progress")}
            >
              <Ionicons
                name="logo-google"
                color={COLORS.dark}
                size={Spacing * 2}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: Spacing,
                backgroundColor: COLORS.gray,
                borderRadius: Spacing / 2,
                marginHorizontal: Spacing,
              }}
            >
              <Ionicons
                name="logo-apple"
                color={COLORS.dark}
                size={Spacing * 2}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: Spacing,
                backgroundColor: COLORS.gray,
                borderRadius: Spacing / 2,
                marginHorizontal: Spacing,
              }}
            >
              <Ionicons
                name="logo-facebook"
                color={COLORS.dark}
                size={Spacing * 2}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: Spacing * 2,
    marginTop: 25,
  },loaderContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
     
  },
  loaderContent: {
    backgroundColor: COLORS.white,
    padding: Spacing * 2,
    borderRadius: Spacing,
    alignItems: "center",
  },
  loaderText: {
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.small,
    marginTop: Spacing,
    alignItems: "center",
    color: COLORS.primary,
    fontFamily: Font["poppins-bold"],
  },
});

export default LoginScreen;
