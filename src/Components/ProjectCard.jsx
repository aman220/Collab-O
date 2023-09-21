import React ,{useState, useRef ,useEffect }from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity ,  KeyboardAvoidingView,TextInput, } from "react-native";
import COLORS from "../const/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Font from "../const/Font";
import FontSize from "../const/FontSize";
import LottieView from "lottie-react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { useNavigation } from "@react-navigation/native";

const LikeButton = ({ onPress, active }) => {
    const [isLiked, setIsLiked] = useState(false);
    const animationRef = useRef(null);
    const isFirstrun = useRef(true);
    const navigation = useNavigation();
  
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

const ProjectCard = (props) => {
  const {
    title,
    description,
    userName,
    collegeName,
    timeStamp,
    whoami,
    techStack,
    avtar,
    proimage,
    postid,
    userid,
  } = props;

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const rbSheetRef = useRef(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const navigation = useNavigation();

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const VerifiedIcon = () => (
    <Image
      source={require("../assets/verifiedicon.png")}
      style={styles.verifiedIcon}
    />
  );

  useEffect(() => {
    if (rbSheetRef.current && isSheetOpen) {
      rbSheetRef.current.open();
    }
  }, [isSheetOpen]);

  const formatDateTime = (dateString) => {
    const options = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleSheetClose = () => {
    setIsSheetOpen(false);
  };

  const handleComment = () => {
    setCommentCount(commentCount + 1);
    setIsSheetOpen(true);
  };
  return (
    <View style={styles.cardContainer}>
      <Image source={{ uri: avtar }} style={styles.avatar} />
      <View style={styles.container} >
        <View style={styles.header}>
          <View style={styles.userInfoContainer}>
            <View style={styles.userInfo}>
              {userName && <Text style={styles.userName}>{userName}</Text>}
              {collegeName && (
                <Text style={styles.collegeName}>{collegeName}</Text>
              )}
              {timeStamp && (
                <Text style={styles.timeStamp}>
                  {formatDateTime(timeStamp)}
                </Text>
              )}
            </View>

            <View style={styles.whoamiContainer}>
              {whoami && <Text style={styles.whoamitext} >{whoami}</Text>}
            </View>
          </View>
        </View>

        <View style={styles.techStack}>
          {techStack &&
            techStack.map((tech, index) => (
              <View key={index} style={styles.tech}>
                <Text style={styles.techText}>{tech}</Text>
              </View>
            ))}
        </View>

        {title && <Text style={styles.title}onPress={() => navigation.navigate("projectexpand" ,{postid , navigation,userid,title,userName})}>{title}</Text>}

        {description && (
          <View>
            <Text
              numberOfLines={showFullDescription ? undefined : 2}
              style={styles.description}
            >
              {description}
            </Text>
            {description.length > 100 && (
              <TouchableOpacity onPress={toggleDescription}>
                <Text style={styles.seeMore}>
                  {showFullDescription ? "See Less" : "See More"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        {proimage && ( // Check if image is not empty
          <Image source={{ uri: proimage }} style={styles.projectImage} />
        )}
        <View style={styles.footerContainer}>
          <View style={styles.footerIconsContainer}>
            <TouchableOpacity style={styles.footerIcon}>
               <LikeButton onPress={handleLike} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonCount}
                 onPress={handleComment}>
              <Icon name="comment-text-outline" size={20} />
              <Text>2</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.footerIcon} >
            <Image
              source={require("../assets/collaboration.png")}
              style={{width:25,height:25}}
            />
          </TouchableOpacity>
        </View>
      </View>



      {/* Render Image Component here  */}
      <RBSheet
            ref={rbSheetRef}
            height={740}
            openDuration={250}
            closeOnDragDown={true}
            onClose={handleSheetClose}
            // onOpen={() => fetchComments(postId)}
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
                {/* <FlatList
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
                /> */}

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
                    //   onPress={handleCommentSubmit}
                    >
                      <Icon name="send" size={30} />
                    </TouchableOpacity>
                  </View>
                </KeyboardAvoidingView>
              </View>
            </View>
          </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: COLORS.white,
  },
  container: {
    margin: 10,
    backgroundColor: COLORS.white,
    flex: 1,
  },
  verticalLine: {
    marginLeft: 10,
    width: 1,
    backgroundColor: COLORS.black,
    height: 400,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  userInfoContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 10,
  },
  userName: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: Font["poppins-bold"],
  },
  collegeName: {
    color: COLORS.black,
    fontSize: 12,
    fontFamily: Font["poppins-regular"],
    marginTop: 1,
  },
  timeStamp: {
    color: "#888",
    fontSize: 12,
    fontFamily: Font["poppins-regular"],
    fontStyle: "italic",
  },
  title: {
    fontSize: 18,
    color: COLORS.dark,
    marginTop: 7,
    fontFamily: Font["poppins-bold"],
  },
  whoamiContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
    justifyContent: "center",
    alignSelf: "center",
  },
  whoamitext: {
    fontFamily: Font["poppins-regular"],
    fontSize: 12,
    color: COLORS.white,
  },
  projectImage: {
    marginTop: 10,
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 7,
  },
  description: {
    marginTop: 1,
    fontSize: 15,
    color: "#555",
    fontFamily: Font["Cantarell-regular"],
  },
  techStack: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tech: {
    marginRight: 5,
    marginBottom: 5,
    marginTop: 6,
    paddingVertical: 1,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0.5, height: 0.5 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  techText: {
    fontSize: 15, // Reduced font size
    color: COLORS.white,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  footerIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerIcon: {
    marginRight: 10,
  },
  seeMore: {
    color: COLORS.primary,
    marginTop: 1,
    // textDecorationLine: "underline",
  },
  gitLinkImage: {
    width: 25,
    height: 25,
    marginRight: 5,
  },
  buttonCount: {
    color: "#999",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  animation: {
    width: 45,
    height: 45,
    marginLeft: -5,
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
});

export default ProjectCard;
