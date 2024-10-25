import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { firestore, storage } from "../../Firebase/firebase";
import { useNavigation } from "@react-navigation/native";
import Spacing from "../../const/Spacing";
import FontSize from "../../const/FontSize";
import COLORS from "../../const/colors";
import Font from "../../const/Font";
import { Ionicons } from "@expo/vector-icons";
import showToast from "../../const/Toast";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { PermissionsAndroid } from "react-native";

const UpdateProfile = ({ route }) => {
  const navigation = useNavigation();
  const [avatar, setAvatar] = useState(null);
  const [fullNameValue, setFullNameValue] = useState("");
  const [profileDescription, setProfileDescription] = useState(""); // New state for profile description
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = route.params;

  // Fetch existing profile data when the component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userDoc = await firestore.collection("users").doc(userId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setFullNameValue(userData.fullName || "");
          setProfileDescription(userData.desc || "");
          setAvatar(userData.avatar || null);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [userId]);

  const handleImagePicker = async () => {
    try {
      const cameraPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      const photoPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );

      if (
        cameraPermission === PermissionsAndroid.RESULTS.GRANTED &&
        photoPermission === PermissionsAndroid.RESULTS.GRANTED
      ) {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });

        if (!result.canceled) {
          setIsLoading(true);
          const response = await fetch(result.uri);
          const blob = await response.blob();
          const imageName = `avatars/${userId}_${Date.now()}.jpg`;
          const ref = storage.ref().child(imageName);
          await ref.put(blob);
          const imageUrl = await ref.getDownloadURL();
          setAvatar(imageUrl);
        }
      } else {
        console.log("Camera and photo permissions denied");
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceed = async () => {
    if (!fullNameValue || !profileDescription) {
      showToast("error", "Please enter your full name and profile description");
      return;22
    }
    try {
      const usersCollectionRef = firestore.collection("users");
      await usersCollectionRef.doc(userId).update({
        fullName: fullNameValue,
        desc: profileDescription, 
        avatar: avatar, 
      });
      showToast("success", "Profile updated successfully");
      navigation.navigate("Account");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
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
              <Text style={styles.loaderText}>Updating...</Text>
            </View>
          </View>
        </Modal>
      )}
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
            Update Profile
          </Text>
          <Text
            style={{
              fontFamily: Font["poppins-semiBold"],
              fontSize: FontSize.large,
              maxWidth: "98%",
              textAlign: "center",
            }}
          >
            Update Your Name, Profile Picture & Description
          </Text>
        </View>
        <View
          style={{
            marginVertical: Spacing * 2,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={handleImagePicker}
            style={{ alignItems: "center" }}
          >
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="camera" size={30} color={COLORS.white} />
              </View>
            )}
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: Spacing * 2 }}>
            <TextInput
              placeholder="Full Name"
              placeholderTextColor={COLORS.dark}
              style={{
                fontFamily: Font["poppins-regular"],
                fontSize: FontSize.small,
                padding: Spacing * 2,
                backgroundColor: COLORS.lightPrimary,
                borderRadius: Spacing,
              }}
              value={fullNameValue}
              onChangeText={setFullNameValue}
            />
            <TextInput
              placeholder="Profile Description"
              placeholderTextColor={COLORS.dark}
              style={{
                fontFamily: Font["poppins-regular"],
                fontSize: FontSize.small,
                padding: Spacing * 2,
                backgroundColor: COLORS.lightPrimary,
                borderRadius: Spacing,
                marginTop: Spacing * 2,
              }}
              value={profileDescription}
              onChangeText={setProfileDescription}
            />
          </View>
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
          onPress={handleProceed}
        >
          <Text
            style={{
              fontFamily: Font["poppins-bold"],
              color: COLORS.white,
              textAlign: "center",
              fontSize: FontSize.large,
            }}
          >
            Update
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: Spacing * 2,
    marginTop: 25,
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
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: Spacing * 2,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.lightPrimary,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: Spacing * 2,
  },
});

export default UpdateProfile;
