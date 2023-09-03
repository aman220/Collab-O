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

const Home = React.memo(() => {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();
  const rbSheetRef = useRef(null);
  const [Selected, setSelected] = React.useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserData = useCallback(async () => {
    try {
      const uid = await AsyncStorage.getItem("@userUid");
      if (uid != null) {
        setIsLoading(true);
        const userRef = firestore.collection("users").doc(uid);
        const userSnapshot = await userRef.get();
        if (userSnapshot.exists) {
          const userData = userSnapshot.data();
          setUserData(userData);
        } else {
          console.log("User data not found!");
        }
      } else {
        console.log("User not logged in.");
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
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
      const postsRef = firestore.collection("posts");

      // Listen for real-time updates
      const unsubscribe = postsRef.onSnapshot((snapshot) => {
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);
        setRefreshing(false); // Finish refreshing
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={style.header}>
        <TouchableOpacity>
          <Icon name="sort-variant" size={28} />
        </TouchableOpacity>
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
      <View>{userData && <Text>{userData.status}</Text>}</View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <Omeg
              username={item.userfullName}
              avtar={item.userfullavtar}
              content={item.text}
              image={item.imageUrl}
            />
          );
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />

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
              <TouchableOpacity
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
                <Text
                  style={[
                    style.stylebodyoptiontext,
                    Selected === 0 && { color: "#000" },
                  ]}
                >
                  Alumani
                </Text>
              </TouchableOpacity>

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
  searchInputContainer: {
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 7,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  categoryBtn: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    borderRadius: 10,
  },
  categoryBtnName: {
    color: COLORS.dark,
    fontSize: 10,
    marginTop: 5,
    fontWeight: "bold",
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
