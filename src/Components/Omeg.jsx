import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  RefreshControl,
  FlatList,
} from "react-native";
import Font from "../const/Font";
import LottieView from "lottie-react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import COLORS from "../const/colors";
import FontSize from "../const/FontSize";
import { useNavigation } from "@react-navigation/native";
import RBSheet from "react-native-raw-bottom-sheet";
import Comments from "./Comments";
import { firestore, firebase, firebaseAuth } from "../Firebase/firebase";
import Comment from "./Comments";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { BlurView } from "expo-blur";
import { Audio, Video } from "expo-av";

const VerifiedIcon = () => (
  <Image
    source={require("../assets/verifiedicon.png")}
    style={styles.verifiedIcon}
  />
);

const LikeButton = ({ onPress, active }) => {
  const [isLiked, setIsLiked] = useState(false);
  const animationRef = useRef(null);
  const isFirstrun = useRef(true);

  const handlePress = () => {
    if (isFirstrun.current) {
      if (isLiked) {
        animationRef.current.play(68, 68);
      } else {
        animationRef.current.play(19, 19);
      }
      isFirstrun.current = false;
    } else if (isLiked) {
      animationRef.current.play(19, 50);
    } else {
      animationRef.current.play(0, 19);
    }
    setIsLiked(!isLiked);
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <LottieView
        ref={animationRef}
        source={require("../assets/animation_llnrx4h4.json")}
        style={styles.animation}
        autoPlay={false}
        loop={false}
        progress={15 / 68}
      />
    </TouchableOpacity>
  );
};

const AvatarGroup = () => {
  //set views data
  const avatars = [
    require("../assets/photo.jpg"),
    require("../assets/photo.jpg"),
    require("../assets/photo.jpg"),
    require("../assets/photo.jpg"),
  ];

  return (
    <View style={styles.avatarGroup}>
      {avatars.map((avatar, index) => (
        <Image
          key={index}
          source={avatar}
          style={[styles.avatar, { zIndex: avatars.length - index }]}
        />
      ))}
      <View style={styles.avatarCount}>
        <Text style={styles.avatarCountText}>+{avatars.length}</Text>
      </View>
    </View>
  );
};

const Omeg = ({
  username,
  avtar,
  content,
  image,
  postId,
  userId,
  CommentCou,
  video,
  whoami,
  isverified,
  college,
}) => {
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const rbSheetRef = useRef(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // Add refreshing state
  const [commentcontent, setCommentText] = useState("");
  const [currentavatar, setAvatar] = useState(null);
  const [currentusername, setUsername] = useState(null);
  const [currentcollege, setCollege] = useState(null);
  const [currentwhoami, setwhoami] = useState(null);
  const navigation = useNavigation();
  const viewShotRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const fetchUserData = useCallback(async () => {
    const uid = await AsyncStorage.getItem("@userUid");
    if (uid) {
      const userRef = firestore.collection("users").doc(uid);
      userRef.get().then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          setAvatar(userData.avatar);
          setUsername(userData.fullName);
          setCollege(userData.College);
          setwhoami(userData.whoami);
          console.log(userData);
        } else {
          console.log("User data not found in Firestore");
        }
      });
    } else {
      // No user is signed in
      console.log("No user is signed in");
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (rbSheetRef.current && isSheetOpen) {
      rbSheetRef.current.open();
    }
  }, [isSheetOpen]);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleComment = () => {
    setCommentCount(commentCount + 1);
    setIsSheetOpen(true);
  };

  const handleShare = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      const isAvailable = await Sharing.isAvailableAsync();

      if (isAvailable) {
        await Sharing.shareAsync(uri);
      } else {
        console.log("Sharing is not available on this device");
      }
    } catch (error) {
      console.error("Error sharing image:", error);
    }
  };

  const handleSheetClose = () => {
    setIsSheetOpen(false);
  };

  const fetchComments = async (postId) => {
    try {
      const commentsRef = firestore
        .collection("posts")
        .doc(postId)
        .collection("CommentData");

      const snapshot = await commentsRef.get();
      // console.log(snapshot)
      if (snapshot.empty) {
        console.log("No comments found.");
        setComments([]);
      } else {
        const commentsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(commentsData);
        console.log(commentsData);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const addCommentToFirebase = async (postId, commentData) => {
    try {
      const commentsRef = firestore
        .collection("posts")
        .doc(postId)
        .collection("CommentData");
      const newCommentRef = await commentsRef.add(commentData);
      // Retrieve the current CommentCount from the post document
      const postRef = firestore.collection("posts").doc(postId);
      const postDoc = await postRef.get();

      if (postDoc.exists) {
        const postData = postDoc.data();

        // Increment the CommentCount and update it in the post document
        const updatedCommentCount = (postData.CommentCount || 0) + 1;
        await postRef.update({ CommentCount: updatedCommentCount });
      } else {
        console.log("Post not found in Firestore");
      }
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  const handleCommentSubmit = () => {
    const commentData = {
      avtar: currentavatar,
      username: currentusername,
      Content: commentcontent,
      College: currentcollege,
      Whoami: currentwhoami,
    };
    setCommentText("");
    addCommentToFirebase(postId, commentData);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const renderVideo = () => {
    if (video) {
      return (
        <Video
          source={{ uri: video }}
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

  const [containerHeight, setContainerHeight] = useState(0); // Initialize the container height state

  // ... other code ...

  const handleLayout = (event) => {
    // Get the height of the container when the layout changes
    // const { height } = event.nativeEvent.layout;
    // setContainerHeight(height);
  };

  return (
    // <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 1.0 }}>
    <SafeAreaView style={styles.container} onLayout={handleLayout}>
      <View>
        <Image source={{ uri: avtar }} style={styles.profileImage} />
        <View
          style={{
            borderWidth: 1,
            borderColor: COLORS.gray,
            marginTop: 5,
            alignSelf: "center",
            marginRight: 10,
            height: containerHeight,
            width: 1,
          }}
        ></View>
      </View>
      <View style={styles.tweetContent}>
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => navigation.navigate("myprofile", { userId })}
        >
          <View style={styles.usernameContainer}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.username}>{username}</Text>
              {isverified == true && <VerifiedIcon />}
            </View>

            <Text style={styles.collegestyle}>
              {college.length > 30 ? `${college.substring(0, 40)}...` : college}
            </Text>
          </View>
          <View style={styles.whoamiContainer}>
            <Text style={styles.whoamitext}>{whoami}</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.tweetText}>{content}</Text>

        {image ? (
          <View style={styles.postImageContainer}>
            <Image source={{ uri: image }} style={styles.postImage} />
          </View>
        ) : null}

        {video ? (
          <View style={styles.postImageContainer}>
            {renderVideo()}
            <TouchableOpacity style={styles.speakerIcon} onPress={toggleMute}>
              <Icon name={isMuted ? "volume-off" : "volume-high"} size={30} />
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Bottom Of a Post */}
        <View style={styles.buttonsContainer}>
          <LikeButton onPress={handleLike} />
          <TouchableOpacity style={styles.buttonCount} onPress={handleComment}>
            <Icon name="comment-text-outline" size={20} />
            <Text>{CommentCou}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonCount} onPress={handleShare}>
            <Icon name="share-outline" size={25} />
            <Text>{shareCount}</Text>
          </TouchableOpacity>
          <AvatarGroup />
        </View>

        {/* Render Image Component here  */}
        <RBSheet
          ref={rbSheetRef}
          height={740}
          openDuration={250}
          closeOnDragDown={true}
          onClose={handleSheetClose}
          onOpen={() => fetchComments(postId)}
          customStyles={{
            container: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
          }}
        >
          {/* Content for the bottom sheet */}
          <View style={styles.mainContainer}>
            <Text
              style={{
                fontSize: FontSize.large,
                color: COLORS.primary,
                textAlign: "center",
                fontFamily: Font["poppins-bold"],
              }}
            >
              Comments
            </Text>
            <View style={styles.sheetBody}>
              <FlatList
                data={comments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  return (
                    <Comment
                      username={item.username}
                      avtar={item.avtar}
                      content={item.Content}
                      college={currentcollege}
                      whoami={currentwhoami}
                    />
                  );
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                  />
                }
                ListEmptyComponent={
                  <Text style={styles.noCommentText}>No comment found</Text>
                }
              />

              <KeyboardAvoidingView
                style={{ marginBottom: 20 }}
                behavior="padding"
              >
                <View style={styles.WriteCommentContainer}>
                  <TextInput
                    placeholder="Write a comment..."
                    style={styles.commentInput}
                    value={comments}
                    onChangeText={(text) => setCommentText(text)}
                  />
                  {/* Send button */}
                  <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleCommentSubmit}
                  >
                    <Icon name="send" size={30} />
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </View>
          </View>
        </RBSheet>
      </View>
    </SafeAreaView>
    // </ViewShot>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: COLORS.white,
  },
  profileContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginRight: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  tweetContent: {
    flex: 1,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  usernameContainer: {
    flexDirection: "column", // Make sure username and VerifiedIcon are in the same row
    alignItems: "flex-start",
  },
  username: {
    fontWeight: "bold",
    marginRight: 5,
    fontFamily: Font["poppins-bold"],
    fontSize: FontSize.medium,
  },
  handle: {
    color: "#999",
  },
  tweetText: {
    fontSize: 16,
    fontFamily: Font["Cantarell-regular"],
  },
  verifiedIcon: {
    width: 25,
    height: 25,
    marginLeft: 2,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
    marginTop: 10,
  },
  animation: {
    width: 45,
    height: 45,
    marginLeft: -5,
  },
  buttonCount: {
    color: "#999",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  avatarGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: -12,
    borderWidth: 2,
    borderColor: "white",
  },
  avatarCount: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: -12,
    backgroundColor: "#999",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarCountText: {
    color: "white",
    fontSize: 12,
  },
  verticalLine: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    marginTop: 5,
    alignSelf: "center",
    marginRight: 10,
    width: 1,
  },
  whoamiContainer: {
    backgroundColor: COLORS.grey, // Customize the background color
    borderRadius: 20, // Customize the border radius
    paddingHorizontal: 10,
    paddingVertical: 2,
    justifyContent: "center",
    alignSelf: "center",
  },
  whoamitext: {
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.small,
    color: COLORS.white, // Customize the text color
  },
  postImageContainer: {
    marginTop: 10,
    aspectRatio: 30 / 30, // Adjust the aspect ratio as needed
    borderRadius: 10,
    overflow: "hidden",
    zIndex: -99999,
  },
  postVideoContainer: {
    marginTop: 10,
    aspectRatio: 30 / 30, // Adjust the aspect ratio as needed
    borderRadius: 10,
    overflow: "hidden",
    zIndex: -99999,
  },
  postImage: {
    flex: 1,
    resizeMode: "repeat",
  },
  video: {
    width: "100%",
    height: 200, // Adjust the height as needed
  },
  soundButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    padding: 5,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.light,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sheetBody: {
    width: "100%",
    height: "100%",
  },
  WriteCommentContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: COLORS.gray,
  },
  commentInput: {
    width: "100%",
    // borderWidth: 1,
    borderColor: "gray",
    borderRadius: 25,
    marginLeft: -25,
    padding: 10,
    backgroundColor: COLORS.gray,
    // marginBottom: 8,
  },
  sendButton: {
    backgroundColor: COLORS.gray, // Change to your desired button color
    borderRadius: 50,
    paddingVertical: 11,
    paddingHorizontal: 11,
    marginLeft: 5,
    alignItems: "center",
  },
  sendButtonText: {
    color: "white", // Change to your desired text color
    fontSize: 16, // Change to your desired font size
    fontFamily: Font["Poppins-Bold"], // Change to your desired font family
  },
  noCommentText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 200,
    fontFamily: Font["Cantarell-regular"],
  },
  selectedVideo: {
    width: "80%",
    height: 300,
    borderRadius: 8,
    position: "absolute",
    right: 10,
  },
  collegestyle: {
    color: COLORS.black,
    fontSize: 12,
    fontFamily: Font["poppins-regular"],
    marginTop: 1,
  },
});

export default Omeg;
