import React, { useState ,useEffect} from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity ,LayoutAnimation, UIManager} from "react-native";
import Font from "../const/Font";
import COLORS from "../const/colors"; // Import should be in lowercase "colors".
import FontSize from "../const/FontSize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Comment = ({username,avtar,whoami,content,college}) => {
  const [showReplies, setShowReplies] = useState(false);

  if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const VerifiedIcon = () => (
    <Image
      source={require("../assets/verifiedicon.png")}
      style={styles.verifiedIcon}
    />
  );

  const ReplyContainer = () => (
    <View style={styles.replyContainer}>
      <View style={styles.profileContainer}>
        <Image
          source={require("../assets/photo.jpg")}
          style={styles.profileImage}
        />
        <View style={styles.verticalLine} />
      </View>
      <View style={styles.CommentContent}>
        <View style={styles.userInfo}>
          <View style={styles.usernameContainer}>
            <Text style={styles.username}>
              Aman Raj Singh <VerifiedIcon />
            </Text>
            <Text style={styles.college}>GLA University</Text>
          </View>
          <View style={styles.whiamiContainer}>
            <Text style={styles.whoamitext}>Student</Text>
          </View>
        </View>
        <Text style={styles.commentText}>
          Nice but you have to do some improvement in this project sir but by
          the way it's nice{" "}
        </Text>
      </View>
    </View>
  );

  useEffect(() => {
    LayoutAnimation.easeInEaseOut();
  }, [showReplies]);

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: avtar }}
          style={styles.profileImage}
        />
      </View>
      <View style={styles.CommentContent}>
        <View style={styles.userInfo}>
          <View style={styles.usernameContainer}>
            <Text style={styles.username}>
            {username} <VerifiedIcon />
            </Text>
            <Text style={styles.college}>{college}</Text>
          </View>
          <View style={styles.whiamiContainer}>
            <Text style={styles.whoamitext}>{whoami}</Text>
          </View>
        </View>
        <Text style={styles.commentText}>
        {content}{" "}
        </Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={{ flexDirection: "row" }}>
            <Icon name="message-reply-text" size={20} />
            <Text
              style={{
                marginLeft: 5,
                fontFamily: Font["poppins-regular"],
                color: COLORS.grey,
              }}
            >
              Reply
            </Text>
          </TouchableOpacity>
        </View>

        {showReplies && <ReplyContainer />}

        <TouchableOpacity onPress={() => setShowReplies(!showReplies)}>
          <Text
            style={{
              marginTop: 15,
              fontFamily: Font["Cantarell-regular"],
              color: COLORS.primary,
            }}
          >
            {showReplies ? "Hide Replies" : "Show 14 more replies"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    // backgroundColor: COLORS.lightPrimary,
    borderRadius: 10,
    // elevation: ,
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
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  college: {
    fontSize: 14,
    color: "gray",
  },
  commentText: {
    fontSize: 16,
    fontFamily: Font["Cantarell-regular"],
  },
  whiamiContainer: {
    backgroundColor: COLORS.grey, 
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
  CommentContent: {
    flex: 1,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  usernameContainer: {
    flexDirection: "column", 
  
    marginBottom: 5,
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
  CommentText: {
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
  replyContainer: {
    flexDirection: "row",
    padding: 0,
    borderBottomColor: "#ccc",
    marginTop: 20,
  },
  verticalLine: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    height: 100,
    marginTop: 5,
  },
});

export default Comment;
