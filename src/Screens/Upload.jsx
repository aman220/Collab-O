import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  TextInput,
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Circle, Svg } from "react-native-svg";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Font from "../const/Font";
import COLORS from "../const/colors";
import Spacing from "../const/Spacing";
import FontSize from "../const/FontSize";
import * as ImagePicker from "expo-image-picker";
import { PermissionsAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebase, firestore, storage } from "../Firebase/firebase";
import { useNavigation } from "@react-navigation/native";
import RBSheet from "react-native-raw-bottom-sheet";
import { Audio, Video } from "expo-av";
import { Camera } from "expo-camera";

const Upload = () => {
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState("");
  const [useravtar, setUseravtar] = useState("");
  const [postText, setPostText] = useState("");
  const [isPlaceholderVisible, setPlaceholderVisible] = useState(true);
  const [textLength, setTextLength] = useState(0);
  const [circleStrokeDasharray, setCircleStrokeDasharray] = useState("0, 100");
  const navigation = useNavigation();
  const textInputRef = useRef(null); // Reference to TextInput
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const rbSheetRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);
  const [videoUri, setVideoUri] = useState(null);
  const [isVideoPreviewVisible, setIsVideoPreviewVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [whoami, setUserwhoami] = useState("");
  const [isverified, setUserIsVerified] = useState(false);


  useEffect(() => {
    setTextLength(postText.length);
    const maxLength = 500; // Maximum text length
    const percent = (textLength / maxLength) * 100;
    const dashValue = (percent / 100) * 100;
    const gapValue = 100 - dashValue;
    setCircleStrokeDasharray(`${dashValue}, ${gapValue}`);
  }, [postText]);

  const handleTextChange = (text) => {
    setPostText(text);
    setPlaceholderVisible(text === "");
  };

  const fetchUserData = useCallback(async () => {
    try {
      const uid = await AsyncStorage.getItem("@userUid");
      if (uid != null) {
        // setIsLoading(true);
        const userRef = firestore.collection("users").doc(uid);
        const userSnapshot = await userRef.get();
        if (userSnapshot.exists) {
          const userData = userSnapshot.data();
          setUserData(userData);
          setUsername(userData.fullName);
          setUseravtar(userData.avatar);
          setUserwhoami(userData.whoami)
          setUserIsVerified(userData.isverified);
        } else {
          console.log("User data not found!");
        }
      } else {
        console.log("User not logged in.");
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

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
        const options = {
          title: "Select Avatar",
          storageOptions: {
            skipBackup: true,
            path: "images",
          },
        };

        try {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });

          if (!result.canceled) {
            setSelectedImage(result.uri);
          }
        } catch (error) {
          console.log("ImagePicker Error: ", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log("Camera and photo permissions denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleVideoPicker = async () => {
    try {
      const cameraPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      const audioPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );

      if (
        cameraPermission === PermissionsAndroid.RESULTS.GRANTED &&
        audioPermission === PermissionsAndroid.RESULTS.GRANTED
      ) {
        const options = {
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        };

        try {
          const result = await ImagePicker.launchImageLibraryAsync(options);

          if (!result.canceled) {
            setVideoUri(result.uri);
            setIsVideoPreviewVisible(true);
          }
        } catch (error) {
          console.log("ImagePicker Error: ", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log("Camera and audio permissions denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handlePostButtonPress = async () => {
    try {
      setIsLoading(true);
      // Upload the image to Firebase Storage if an image is selected
      let imageUrl = null;
      let VideoUrl = null;
      if (selectedImage) {
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        const uid = await AsyncStorage.getItem("@userUid");
        const userId = uid; // Update this with your user ID logic
        const imageName = `posts/${userId}_${Date.now()}.jpg`; // Change 'posts' to your desired storage path
        const ref = storage.ref().child(imageName);
        await ref.put(blob);

        // Get the image URL from Firebase Storage
        imageUrl = await ref.getDownloadURL();
      }
      if (videoUri) {
        // Upload the video to Firebase Storage
        const response = await fetch(videoUri);
        const blob = await response.blob();
        const uid = await AsyncStorage.getItem("@userUid");
        const userId = uid; // Update this with your user ID logic
        const videoName = `videos/${userId}_${Date.now()}.mp4`; // Change 'videos' to your desired storage path
        const ref = storage.ref().child(videoName);
        await ref.put(blob);

        // Get the video URL from Firebase Storage
        VideoUrl= await ref.getDownloadURL();
        setVideoUri(videoUri);
      }

      // Create a new post document in Firestore
      const usersCollectionRef = firestore.collection("posts");
      const uid = await AsyncStorage.getItem("@userUid");
      const newUserRef = usersCollectionRef.doc();
      const currentDate = new Date();
      await newUserRef.set({
        userId: uid, // Update this with your user ID logic
        text: postText,
        imageUrl: imageUrl,
        videoUrl : VideoUrl,
        userfullName: username,
        userfullavtar: useravtar,
        createdAt: currentDate.toISOString(),
        whoami : whoami,
        isverified:isverified,
      });

      // Update the user's activity collection
      const userActivityRef = firestore.collection("users");
      const newRef = userActivityRef
        .doc(uid)
        .collection("userdata")
        .doc("user_activity");

      // Retrieve the current data from the document
      const snapshot = await newRef.get();
      const userData = snapshot.data();
      const currentPosts = userData.posts || []; // If 'posts' doesn't exist, initialize as an empty array

      // Append the new ID to the array
      const updatedPosts = [...currentPosts, newUserRef.id];

      // Update the document with the modified array
      try {
        await newRef.update({
          posts: updatedPosts,
        });
        console.log("Post ID added to the array successfully!");
      } catch (error) {
        console.error("Error adding post ID to the array:", error);
      }
      navigation.navigate("Maintabs");
      setPostText("");
      setSelectedImage(null);
    } catch (error) {
      console.log("Error creating post: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openBottomSheet = () => {
    if (rbSheetRef.current) {
      rbSheetRef.current.open();
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      await cameraRef.stopRecording();
      setIsRecording(false);
    } else {
      const videoRecordPromise = cameraRef.recordAsync();
      videoRecordPromise
        .then((data) => {
          setVideoUri(data.uri);
          setIsVideoPreviewVisible(true);
        })
        .catch((err) => {
          console.error(err);
        });
      setIsRecording(true);
    }
  };

  const renderVideo = () => {
    if (videoUri) {
      return (
        <Video
          source={{ uri: videoUri }}
          rate={1.0}
          volume={1.0}
          isMuted={isMuted}
          resizeMode="cover"
          shouldPlay={true}
          isLooping={true}
          style={styles.selectedVideo}
        />
      );
    }
    return null;
  };
  const toggleMute = () => {
    setIsMuted((prevMuted) => !prevMuted); // Toggle mute state
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
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
              <Text style={styles.loaderText}>Uploading..</Text>
            </View>
          </View>
        </Modal>
      )}
      <View style={styles.header}>
        <View style={styles.accountHeader}>
          <TouchableOpacity>
            <Icon name="arrow-left" size={30} />
          </TouchableOpacity>
          <Text style={styles.accountHeaderText}>Write a Post</Text>
        </View>
      </View>
      <View style={styles.content}>
        {userData && (
          <View style={styles.profileContainer}>
            {userData.avatar && (
              <Image
                source={{ uri: userData.avatar }}
                style={styles.profileImage}
              />
            )}
          </View>
        )}
        <View style={styles.textContainer}>
          <TextInput
            ref={textInputRef}
            multiline={true}
            style={styles.textInput}
            value={postText}
            onChangeText={handleTextChange}
            autoFocus={true}
            // onSelectionChange={(event) => setSelection(event.nativeEvent.selection)}
          ></TextInput>
          {isPlaceholderVisible && (
            <Text style={styles.placeholderText}>
              Write Fearlessly... {"\n\n"}(Write more than 70 characters for
              best reach)
            </Text>
          )}
        </View>
      </View>

      {selectedImage && (
        <View style={styles.selectedImageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          <TouchableOpacity
            style={styles.discardImageIcon}
            onPress={() => setSelectedImage(null)}
          >
            <Icon name="close-circle-outline" size={30} color={COLORS.dark} />
          </TouchableOpacity>
        </View>
      )}

      {videoUri && (
        <View style={styles.selectedImageContainer}>
          {renderVideo()}
          <TouchableOpacity style={styles.speakerIcon} onPress={toggleMute}>
            <Icon
              name={isMuted ? "speaker-off" : "speaker"}
              size={30}
              // color="white"
            />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.containerBottom}>
        {/* Icon */}
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={handleImagePicker}
        >
          <Icon name="image-outline" size={30} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={handleVideoPicker}
        >
          <Icon name="video" size={30} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Icon name="file-gif-box" size={30} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={openBottomSheet}
        >
          <Icon name="dots-horizontal" size={30} color={COLORS.primary} />
        </TouchableOpacity>
        <View>
          <Svg height={40} width={40} style={styles.counterContainer}>
            <Circle
              cx={20}
              cy={20}
              r={18}
              fill="none"
              strokeDasharray={circleStrokeDasharray}
              stroke="green"
              strokeWidth={4}
            />
            <View style={styles.counterTextContainer}>
              <Text style={styles.counterText}>{textLength}</Text>
            </View>
          </Svg>
        </View>
        <TouchableOpacity style={styles.button} onPress={handlePostButtonPress}>
          <Text
            style={{
              color: COLORS.white,
              fontFamily: Font["Cantarell-regular"],
              fontSize: FontSize.medium,
            }}
          >
            Post
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom sheet code  */}
      <RBSheet
        ref={rbSheetRef}
        height={440}
        openDuration={150}
        animationType="fade"
        closeOnDragDown={true}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}
      >
        <View style={styles.mainContainer}>
          <Text
            style={{
              fontSize: FontSize.xLarge,
              color: COLORS.primary,
              fontFamily: Font["poppins-bold"],
            }}
          >
            What You want to Post..
          </Text>
          <View style={styles.sheetBody}>
            <View style={styles.sheetBodyOptions}>
              <TouchableOpacity
                style={styles.sheetBodyOption}
                onPress={() => navigation.navigate("projectpost" ,{useravtar , username , whoami})}
              >
                <Image
                  source={require("../assets/project.png")}
                  style={{
                    width: 70,
                    height: 70,
                  }}
                ></Image>
                <Text style={styles.stylebodyoptiontext}>Project</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sheetBodyOption}
                onPress={() => navigation.navigate("researchpost")}
              >
                <Image
                  source={require("../assets/research.png")}
                  style={{
                    width: 70,
                    height: 70,
                  }}
                ></Image>
                <Text style={styles.stylebodyoptiontext}>Research</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
  },
  accountHeader: {
    flexDirection: "row",
  },
  accountHeaderText: {
    fontSize: 20,
    fontFamily: Font["poppins-bold"],
    flex: 1,
    textAlign: "center",
  },
  content: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 20,
    flexWrap: "wrap",
  },
  profileContainer: {
    width: 40,
    height: 40,
    borderRadius: 40,
    overflow: "hidden",
    marginRight: 20,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    flex: 1,
    // height:150,
  },
  textInput: {
    borderColor: COLORS.gray,
    fontSize: 16,
    width: "100%",
    top: 10,
    fontFamily: Font["Cantarell-regular"],
  },
  placeholderText: {
    position: "absolute",
    top: 12,
    left: 8,
    color: COLORS.grey,
    fontSize: 16,
    fontFamily: Font["poppins-regular"],
  },
  counterContainer: {
    alignContent: "center",
    top: 0,
  },
  counterTextContainer: {
    top: 10,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  counterText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
  containerBottom: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    // justifyContent: "center",
    backgroundColor: COLORS.lightPrimary,
    borderColor: COLORS.gray,
  },
  iconContainer: {
    marginRight: 20,
  },
  button: {
    position: "absolute",
    right: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
  },

  selectedImageContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 100,
    // aspectRatio: 30 / 30,
    // marginLeft: 50,
  },
  selectedImage: {
    width: "80%",
    height: 300,
    borderRadius: 8,
    position: "absolute",
    right: 10,
  },
  discardImageIcon: {
    position: "absolute",
    top: 10,
    right: 20,
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

  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.light,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  sheetBody: {
    padding: 24,
  },
  sheetBodyOptions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: -35,
  },
  sheetBodyOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.dark,
    borderRadius: 12,
    marginHorizontal: 16,
    paddingVertical: 28,
  },
  stylebodyoptiontext: {
    fontFamily: Font["poppins-semiBold"],
    fontSize: FontSize.medium,
    marginTop: 20,
    textAlign: "center",
    color: COLORS.primary,
  },
  skeletonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedVideo: {
    width: "80%",
    height: 300,
    borderRadius: 8,
    position: "absolute",
    right: 10,
  },
  selectedVideo: {
    width: "80%",
    height: 300,
    borderRadius: 8,
    position: "absolute",
    right: 10,
  },
  speakerIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});

export default Upload;
