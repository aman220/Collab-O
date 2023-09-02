import React, { useState, useCallback } from "react";
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
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { firestore, firebaseAuth } from "../../Firebase/firebase";


const showToast = (type, text) => {
  Toast.show({
    type: type,
    text1: text,
    visibilityTime: 2000,
    autoHide: true,
    position: "top",
  });
};

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleSignUp = useCallback(async () => {
    if (!email) return showToast("error", "Please fill Email");
    if (!password) return showToast("error", "Please fill password");

    if (password !== confirmPassword) {
      showToast("error", "Passwords do not match");
      return;
    }
    try {
      setIsLoading(true);
      // Use Firebase Auth to create a new user
      const userCredential = await firebaseAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      // Get the user ID
      const userId = userCredential.user.uid;
      const usersCollectionRef = firestore.collection("users");
      const newUserRef = usersCollectionRef.doc(userId);
      const currentDate = new Date();
      
      // Create the user document with initial data
      await newUserRef.set({
        email: email,
        isverified: false,
        whoami: "null",
        FollowersCount: 0,
        FollowingCount: 0,
        PostsCount: 0,
        createdAt: currentDate.toISOString(),
      });
      
      // Create the "userdata" subcollection and the "user_activity" document with an empty "posts" array
      const userdataCollectionRef = newUserRef.collection("userdata");
      const userActivityRef = userdataCollectionRef.doc("user_activity");
      await userActivityRef.set({
        posts: [],
      });
      

      showToast("success", "Registration successful");
      navigation.navigate("AddProfile" ,{userId});
    } catch (error) {
      showToast("error", error.message);
      console.error("Error registering user:", error);
    } finally {
      setIsLoading(false); 
    }
  }, [email, password, confirmPassword, navigation]);

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
            <Text style={styles.loaderText}>Signing up...</Text>
            
          </View>
        </View>
      </Modal>)}
      <Toast />
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
            Register Here
          </Text>
          <Text
            style={{
              fontFamily: Font["poppins-semiBold"],
              fontSize: FontSize.small,
              maxWidth: "98%",
              textAlign: "center",
            }}
          >
            Create an Account and Explore our endless features
          </Text>
        </View>
        <View style={{ marginVertical: Spacing * 3 }}>
          <TextInput
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={COLORS.dark}
            style={styles.input}
          />
          <TextInput
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={COLORS.dark}
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            onChangeText={setConfirmPassword}
            placeholder="Confirm Password"
            placeholderTextColor={COLORS.dark}
            secureTextEntry
            style={styles.input}
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
            Forget your Password?
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text
            style={{
              fontFamily: Font["poppins-bold"],
              color: COLORS.white,
              textAlign: "center",
              fontSize: FontSize.large,
            }}
          >
            Sign Up
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate("Login")}
        >
          <Text
            style={{
              fontFamily: Font["poppins-semiBold"],
              color: COLORS.dark,
              textAlign: "center",
              fontSize: FontSize.small,
            }}
          >
            Already have an account?
          </Text>
        </TouchableOpacity>

        <View style={{ marginVertical: Spacing * 3 }}>
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
              style={styles.socialButton}
              onPress={() => showToast("error", "Under Progress")}
            >
              <Ionicons
                name="logo-google"
                color={COLORS.dark}
                size={Spacing * 2}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <Ionicons
                name="logo-apple"
                color={COLORS.dark}
                size={Spacing * 2}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
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

export default React.memo(RegisterScreen);

const styles = StyleSheet.create({
  header: {
    padding: Spacing * 2,
    marginTop: 25,
  },
  input: {
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.small,
    padding: Spacing * 2,
    backgroundColor: COLORS.lightPrimary,
    borderRadius: Spacing,
    marginVertical: Spacing,
  },
  button: {
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
  },
  link: {
    padding: Spacing,
  },
  socialButton: {
    padding: Spacing,
    backgroundColor: COLORS.gray,
    borderRadius: Spacing / 2,
    marginHorizontal: Spacing,
  },
  loaderContainer: {
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
