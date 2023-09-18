import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView, View, Image, Text, StyleSheet, TouchableOpacity} from "react-native";
import Font from "../const/Font";
import LottieView from "lottie-react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import COLORS from "../const/colors";
import FontSize from "../const/FontSize";



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

const Student = ({ username, avtar, content, image, whoami }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const animationRef = useRef(null);


  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };


  const handleShare = () => {
    setShareCount(shareCount + 1);
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tweetContent}>
        <View style={styles.userInfo}>
          <View style={styles.usernameContainer}>
            <Image source={{ uri: avtar }} style={styles.profileImage} />
            <Text style={styles.username}>{username}</Text>
            <VerifiedIcon />
          </View>
          <View style={styles.whoamiContainer}>
            <Text style={styles.whoamitext}>{whoami}</Text>
          </View>
        </View>
        <Text style={styles.tweetText}>{content}</Text>

        {/* Image of the post */}
        <View style={styles.postImageContainer}>
          <Image source={{ uri: image }} style={styles.postImage} />
        </View>

        {/* Bottom of the post */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.buttonCount} onPress={handleLike}>
            <Icon name="heart-outline" size={25} />
          </TouchableOpacity>
          <View style={styles.buttonSeparator} />
          <TouchableOpacity style={styles.buttonCount} onPress={{}}>
            <Icon name="comment-text-outline" size={25} />
          </TouchableOpacity>
          <View style={styles.buttonSeparator} />
          <TouchableOpacity style={styles.buttonCount} onPress={handleShare}>
            <Icon name="share-variant-outline" size={25} />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          {/* This creates an empty space to push the 3-dot icon to the right */}
          <TouchableOpacity style={styles.buttonCount}>
            <Icon name="dots-vertical" size={25} />
          </TouchableOpacity>
        </View>
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
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontWeight: "bold",
    marginRight: 5,
    fontFamily: Font["poppins-bold"],
    fontSize: FontSize.medium,
  },
  verifiedIcon: {
    width: 25,
    height: 25,
    marginLeft: 2,
  },
  whoamiContainer: {
    backgroundColor: COLORS.blue,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
    justifyContent: "center",
    alignSelf: "center",
  },
  whoamitext: {
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.small,
    color: COLORS.white,
  },
  tweetText: {
    fontSize: 16,
    fontFamily: Font["Cantarell-regular"],
  },
  postImageContainer: {
    marginTop: 10,
    aspectRatio: 30 / 30,
    borderRadius: 10,
    overflow: "hidden",
  },
  postImage: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 10, // Add padding to buttons for better touch interaction
  },
  buttonCount: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonSeparator: {
    width: 10, // Adjust the spacing width as needed
  },
});

export default Student;
