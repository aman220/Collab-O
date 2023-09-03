import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import Font from "../const/Font";
import LottieView from "lottie-react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import COLORS from "../const/colors";
import FontSize from "../const/FontSize";
import RBSheet from "react-native-raw-bottom-sheet";
import Comments from "./Comments";

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

const Omeg = ({ username, avtar, content, image }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const animationRef = useRef(null);
  const rbSheetRef = useRef(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [comment, setComment] = useState("");

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
    setIsSheetOpen(true); // Open the sheet when clicking the comment button
  };

  const handleShare = () => {
    setShareCount(shareCount + 1);
  };

  const handleSheetClose = () => {
    setIsSheetOpen(false); // Reset the state variable when sheet is closed
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: avtar }} style={styles.profileImage} />
        <View style={styles.verticalLine} />
      </View>

      {/* <Image source={{ uri: image }} style={styles.profileImage} /> */}
      <View style={styles.tweetContent}>
        <View style={styles.userInfo}>
          <View style={styles.usernameContainer}>
            <Text style={styles.username}>{username}</Text>
            <VerifiedIcon />
          </View>
          <View style={styles.whiamiContainer}>
            <Text style={styles.whoamitext}>Student</Text>
          </View>
        </View>
        <Text style={styles.tweetText}>{content}</Text>
        <View style={styles.postImageContainer}>
          <Image source={{ uri: image }} style={styles.postImage} />
        </View>
        <View style={styles.buttonsContainer}>
          <LikeButton onPress={handleLike} />
          <TouchableOpacity style={styles.buttonCount} onPress={handleComment}>
            <Icon name="comment-text-outline" size={20} />
            <Text>{commentCount}</Text>
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
          height={740} // Set the desired height of the bottom sheet
          openDuration={250}
          closeOnDragDown={true}
          onClose={handleSheetClose}
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
              <Comments />
              <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <View style={styles.WriteCommentContainer}>
                  <TextInput
                    placeholder="Write a comment..."
                    style={styles.commentInput}
                    value={comment}
                    onChangeText={(text) => setComment(text)}
                  />
                  {/* Send button */}
                  <TouchableOpacity style={styles.sendButton}>
                    <Icon name="send" size={30} />
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </View>
          </View>
        </RBSheet>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  profileContainer: {
    flexDirection: "column", // Align profile image and line horizontally
    alignItems: "center", // Align profile image and line vertically
    marginRight: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    // marginRight: 10,
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
    flexDirection: "row", // Make sure username and VerifiedIcon are in the same row
    alignItems: "center",
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
    height: 400,
    marginTop: 5, // Vertical line extends to the full height of profile container
  },
  whiamiContainer: {
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
});

export default Omeg;
