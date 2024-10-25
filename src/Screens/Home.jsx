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
  Modal,
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
import {
  SelectList,
} from "react-native-dropdown-select-list";

const Home = React.memo(() => {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();
  const rbSheetRef = useRef(null);
  const [Selected, setSelected] = React.useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isSkeletonLoading, setSekeletonIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isCollegeModalVisible, setIsCollegeModalVisible] = useState(false);
  const [collegeData, setSelectedCollege] = React.useState([]);
  const [collegeOptions, setCollegeOptions] = React.useState([]);
  // const [college , setcollege] = useState(null);
  

  const openCollegeModal = () => {
    setIsCollegeModalVisible(true);
  };

  const closeCollegeModal = () => {
    setIsCollegeModalVisible(false);
  };

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
            AsyncStorage.setItem("college" , userData.college);
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
    if (userData && userData.whoami !== "") {
      rbSheetRef.current.close();
    } else {
      rbSheetRef.current.open();
    }
  }, [userData]);

  const handleOptionSelect = async (selected) => {
    console.log(selected)
    try {
      const uid = await AsyncStorage.getItem("@userUid");
      if (uid != null) {
        const userRef = firestore.collection("users").doc(uid);
        await userRef.update({ whoami: selected });
        setUserData((prevUserData) => ({ ...prevUserData, whoami: selected }));
        rbSheetRef.current.close();
      }
    } catch (error) {
      console.log("Error updating user data:", error);
    }
  };

  const handleCollegeSelect = async () => {
    try {
      const uid = await AsyncStorage.getItem("@userUid");
      if (uid != null) {
        const userRef = firestore.collection("users").doc(uid);
        await userRef.update({ college: collegeData }); // Update with the serialized college data
        setUserData((prevUserData) => ({ ...prevUserData, college: collegeData }));
        closeCollegeModal();
      }
    } catch (error) {
      console.log("Error updating user data:", error);
    }
  };

  useEffect(() => {
    if (userData) {
      if (userData.whoami !== "" && userData.college === "") {
        // If whoami is not null and college is "null", open the modal
        openCollegeModal();
      }
    }
  }, [userData]);

  // Fetch posts from Firestore
  const fetchPosts = async () => {
    try {
      setSekeletonIsLoading(true);
      
      // Reference to the posts collection
      const postsRef = firestore.collection("posts");
  
      // Get the college from AsyncStorage
      const college = await AsyncStorage.getItem("college");
  
      // Check if college is null or undefined
      if (!college) {
        setTimeout(() => {
          
        }, 3000);
        setSekeletonIsLoading(false);
        return;
      }
  
      // Query to filter posts with collegeName
      const query = postsRef.where("college", "==", college);
      
      // Listen for real-time updates on the filtered query
      const unsubscribe = query.onSnapshot((snapshot) => {
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setPosts(postsData);
        setRefreshing(false); // Finish refreshing
        setSekeletonIsLoading(false);
      }, (error) => {
        console.error("Error listening for posts:", error);
        setSekeletonIsLoading(false);
      });
  
      // Cleanup function
      return () => unsubscribe();
  
    } catch (error) {
      console.error("Error fetching posts:", error);
      setSekeletonIsLoading(false);
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


 
  useEffect(() => {
    const fetchCollegeOptions = async () => {
      try {
        const adminRef = firestore.collection('admins');
        const unsubscribe = adminRef.onSnapshot((snapshot) => {
          const collegeData = snapshot.docs.map((doc) => ({
            key: doc.id,
            value: doc.data().name,  // Assuming `name` is the field you want to display
          }));
          setCollegeOptions(collegeData);
        });
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching college data:", error);
      }
    };

    fetchCollegeOptions();
  }, []);

  

  


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
          <View style={{ marginTop: 10, marginVertical: 10 }}>
            <OmegCardPrimary />
            <OmegSkeleton></OmegSkeleton>
            <OmegCardPrimary />
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
                  college={item.college}
                  desc = {item.desc}
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
                  Alumni 
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
              handleOptionSelect(["Alumni","Alumni", "Student"][Selected])
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={isCollegeModalVisible}
      >
        <View style={style.centeredView}>
          <View style={style.modalView}>
            <Text style={style.modalText}>Select Your College</Text>
            <View style={{ marginTop: 20 }}>
              <SelectList
                setSelected={(val) => setSelectedCollege(val)}
                data={collegeOptions} 
                save="value"
              />
            </View>
            <TouchableOpacity
              style={style.modalButton}
              onPress={handleCollegeSelect}
            >
              <Text style={style.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: COLORS.primary,
  },
  modalButtonText: {
    color: COLORS.white,
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.medium,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
    elevation: 5, // Add elevation for a card-like effect
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.medium,
  },
});

export default Home;
