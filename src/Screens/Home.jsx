import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  Animated,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
const { height } = Dimensions.get("window");
import COLORS from "../const/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { firestore, firebaseAuth } from "../Firebase/firebase";
import RBSheet from "react-native-raw-bottom-sheet";
import Spacing from "../const/Spacing";
import Font from "../const/Font";
import FontSize from "../const/FontSize";
import Omeg from "../Components/Omeg";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import OmegSkeleton from "./Skeleton/OmegSkeleton";
import OmegCardPrimary from "./Skeleton/OmegCardPrimary";
import showToast from "../const/Toast";

const Home = React.memo(() => {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();
  const rbSheetRef = useRef(null);
  const [Selected, setSelected] = React.useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isSkeletonLoading, setSekeletonIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserData = useCallback(async () => {
    try {
      const uid = await AsyncStorage.getItem("@userUid");
      if (uid != null) {
        setIsLoading(true);
        const userRef = firestore.collection("users").doc(uid);

        // Add a real-time listener
        userRef.onSnapshot((docSnapshot) => {
          if (docSnapshot.exists) {
            const userData = docSnapshot.data();
            setUserData(userData);
            setIsLoading(false);
          } else {
            showToast("error", "UserData Not Found!");
          }
        });
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

  useEffect(() => {
    if (rbSheetRef.current) {
      rbSheetRef.current.close(); // Open the RBSheet when the component renders
    }
  }, []);

  useEffect(() => {
    if (userData && userData.whoami !== "null") {
      rbSheetRef.current.close();
    } else {
      rbSheetRef.current.open();
    }
  }, [userData]);

  const handleOptionSelect = async (newWhoami) => {
    try {
      const uid = await AsyncStorage.getItem("@userUid");
      if (uid != null) {
        const userRef = firestore.collection("users").doc(uid);
        await userRef.update({ whoami: newWhoami });
        setUserData((prevUserData) => ({ ...prevUserData, whoami: newWhoami }));
        rbSheetRef.current.close();
      }
    } catch (error) {
      console.log("Error updating user data:", error);
    }
  };

  // Fetch posts from Firestore
  const fetchPosts = async () => {
    try {
      setSekeletonIsLoading(true);
      const postsRef = firestore.collection("posts");
      const unsubscribe = postsRef.onSnapshot((snapshot) => {
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);
        setRefreshing(false); // Finish refreshing
        setSekeletonIsLoading(false)
      });
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    const unsubscribe = fetchPosts(); // Fetch posts and subscribe to real-time updates

    // Cleanup the listener when the component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Function to handle pull-to-refresh
  const handleRefresh = () => {
    setRefreshing(true); // Start refreshing
    fetchPosts(); // Fetch posts again
  };

  const handleViewPost = (postId) => {
    // Get the currently authenticated user's UID
    const userId = firebase.auth().currentUser.uid;

    // Reference to the Firebase Realtime Database
    const database = firebase.database();

    // Reference to the "postViews" node
    const postViewsRef = database.ref("postViews");

    // Update the post's view information
    postViewsRef.child(postId).child(userId).set(true);
  };
  const sortedPosts = posts.sort((a, b) => b.createdAt - a.createdAt);
  const reversedPosts = [...sortedPosts].reverse();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={style.header}>
        <TouchableOpacity onPress={() => navigation.navigate("notification")}>
          <Icon name="bell-ring-outline" size={25} />
        </TouchableOpacity>
        <Toast />
        {isLoading ? ( // Render skeleton content when loading
          <View style={style.skeletonContainer}>
            <View style={style.skeletonText} />
            <View style={style.skeletonAvatar} />
          </View>
        ) : (
          <>
            {userData && (
              <>
                <Text
                  style={{
                    color: COLORS.primary,
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  {userData.fullName}
                </Text>
                {userData.avatar && (
                  <Image
                    source={{ uri: userData.avatar }}
                    style={{ height: 30, width: 30, borderRadius: 25 }}
                  />
                )}
              </>
            )}
          </>
        )}
      </View>
      <View style={{ marginBottom: -20 }}>
        {userData && <Text>{userData.status}</Text>}
      </View>

      <View>
        
        {isSkeletonLoading ? (
          <View style={{ marginTop: 10 ,marginVertical:10,}}>
             <OmegCardPrimary/>
            <OmegSkeleton></OmegSkeleton>
            <OmegCardPrimary/>
          </View>

        ) : (
          <FlatList
            data={reversedPosts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <Omeg
                  username={item.userfullName}
                  avtar={item.userfullavtar}
                  content={item.text}
                  image={item.imageUrl}
                  postId={item.id}
                  CommentCou={item.CommentCount}
                  userId={item.userId}
                  video={item.videoUrl}
                  timestap={item.createdAt}
                  whoami={item.whoami}
                  isverified={item.isverified}
                />
              );
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          />
        )}
      </View>

      {/* Bottom sheet code  */}
      <RBSheet
        ref={rbSheetRef}
        height={440} // Set the desired height of the bottom sheet
        openDuration={250}
        closeOnDragDown={true}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}
      >
        {/* Content for the bottom sheet */}
        <View style={style.mainContainer}>
          <Text
            style={{
              fontSize: FontSize.xLarge,
              color: COLORS.primary,
              fontFamily: Font["poppins-bold"],
            }}
          >
            Who Describe You ..
          </Text>
          <View style={style.sheetBody}>
            <View style={style.sheetBodyOptions}>
              {/* <TouchableOpacity
                style={[
                  style.sheetBodyOption,
                  Selected === 0 && { borderColor: "#000" },
                ]}
                onPress={() => {
                  setSelected(0);
                }}
              >
                <Image
                  source={require("../assets/graduate.png")}
                  style={{
                    width: 70,
                    height: 70,
                  }}
                ></Image>
                {/* color={Selected === 0 ? "#000" : "#bcddd9"} */}
              {/* <Text
                  style={[
                    style.stylebodyoptiontext,
                    Selected === 0 && { color: "#000" },
                  ]}
                >
                  Alumani
                </Text>
              </TouchableOpacity> */}

              <TouchableOpacity
                style={[
                  style.sheetBodyOption,
                  Selected === 1 && { borderColor: "#000" },
                ]}
                onPress={() => {
                  setSelected(1);
                }}
              >
                <Image
                  source={require("../assets/teacher.png")}
                  style={{
                    width: 70,
                    height: 70,
                  }}
                ></Image>
                <Text
                  style={[
                    style.stylebodyoptiontext,
                    Selected === 1 && { color: "#000" },
                  ]}
                >
                  Facuty
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  style.sheetBodyOption,
                  Selected === 2 && { borderColor: "#000" },
                ]}
                onPress={() => {
                  setSelected(2);
                }}
              >
                <Image
                  source={require("../assets/student.png")}
                  style={{
                    width: 70,
                    height: 70,
                  }}
                ></Image>
                <Text
                  style={[
                    style.stylebodyoptiontext,
                    Selected === 2 && { color: "#000" },
                  ]}
                >
                  Student
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={{
              padding: Spacing * 2,
              backgroundColor: COLORS.primary,
              borderRadius: Spacing,
              shadowColor: COLORS.primary,
              shadowOffset: {
                width: 0,
                height: Spacing,
              },
              shadowOpacity: 0.3,
              shadowRadius: Spacing,
            }}
            onPress={() =>
              handleOptionSelect(["Alumani", "Faculty", "Student"][Selected])
            }
          >
            <Text
              style={{
                fontFamily: Font["poppins-bold"],
                color: COLORS.white,
                textAlign: "center",
                fontSize: FontSize.large,
              }}
            >
              Alright
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
});

const style = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
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
    borderColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 16,
    paddingVertical: 28,
  },
  stylebodyoptiontext: {
    fontFamily: Font["poppins-semiBold"],
    fontSize: FontSize.medium,
    marginTop: 20,
    textAlign: "center",
    color: "#bcddd9",
  },
  skeletonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  skeletonAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E0E0E0",
    marginRight: 20,
  },

  skeletonText: {
    width: 90,
    height: 20,
    borderRadius: 4,
    alignItems: "center",
    marginHorizontal: 60,
    flex: 1,
    backgroundColor: "#E0E0E0",
  },
});

export default Home;
