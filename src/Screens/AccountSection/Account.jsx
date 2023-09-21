import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import COLORS from "../../const/colors";
import Font from "../../const/Font";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontSize from "../../const/FontSize";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firestore, firebaseAuth } from "../../Firebase/firebase";

const Account = () => {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [userId, setUserId] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  console.log("here is my id " , userId)

  console.log(userId);
  const openLogoutModal = () => {
    setIsLogoutModalVisible(true);
  };

  const closeLogoutModal = () => {
    setIsLogoutModalVisible(false);
  };

  const fetchUserData = useCallback(async () => {
    try {
      const uid = await AsyncStorage.getItem("@userUid");
      if (uid != null) {
        setIsLoading(true);
        const userRef = firestore.collection("users").doc(uid);
        const userSnapshot = await userRef.get();
        setUserId(uid);
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

  const handleLogoutConfirmation = async () => {
    try {
      await AsyncStorage.setItem("@isLoggedIn", "false");
      await AsyncStorage.clear();
      await firebaseAuth.signOut();
      navigation.navigate("Login");
    } catch (error) {
      console.log("Error during logout:", error);
    }
  };

  const VerifiedIcon = () => (
    <Image
      source={require("../../assets/verifiedicon.png")}
      style={styles.verifiedIcon}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.header}>
        {/* account view */}
        <View style={styles.accountHeader}>
          <TouchableOpacity>
            <Icon name="arrow-left" size={30} />
          </TouchableOpacity>
          <Text style={styles.accountHeaderText}>Account</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 50,
            // backgroundColor: "red",
          }}
        >
          <Image
            source={require("../../assets/logo.png")}
            style={{
              width: 30,
              height: 30,
              borderRadius: 40,
              marginRight: 10,
            }}
          ></Image>
          <Text style={{ fontFamily: Font["poppins-bold"] }}>Omega</Text>
        </View>
        {isLoading ? ( // Render skeleton content when loading
          <View style={styles.skeletonContainer}>
            <View style={styles.skeletonProfile}></View>
            <View style={styles.skeletonInfoContainer}>
              <View style={styles.skeletonName}></View>
              <View style={styles.skeletonEmail}></View>
            </View>
          </View>
        ) : (
          // Render actual content when data is available
          <>
            {userData && (
              <>
                <View style={styles.profileContainer}>
                  <Image
                    source={{ uri: userData.avatar }}
                    style={styles.profilePicture}
                  />
                  <View style={styles.infoContainer}>
                    <Text style={styles.name}>
                      {userData.fullName}{" "}
                      {userData.isverified == true && <VerifiedIcon />}
                    </Text>
                    <Text style={styles.email}>{userData.email}</Text>
                  </View>
                </View>
                <View style={styles.whiamiContainer}>
                  <Text style={styles.whoamitext}>{userData.whoami}</Text>
                </View>
              </>
            )}
          </>
        )}
      </View>
      <View style={styles.card}>
        {/* my profile button  */}
        <TouchableOpacity  onPress={() => navigation.navigate("myprofile", { userId })} >

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.cardText}>My Profile</Text>
            <Image
              source={require("../../assets/account.png")}
              style={styles.verifiedIcon}
            />
          </View>
        </TouchableOpacity>

        {/* edit profile button */}
        <View
          style={{ backgroundColor: COLORS.light, height: 2, marginBottom: 10 }}
        ></View>
        <TouchableOpacity
          onPress={() => navigation.navigate("UpdateProfile", { userId })}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.cardText}>Edit Profile</Text>
            <Image
              source={require("../../assets/setting.png")}
              style={styles.verifiedIcon}
            />
          </View>
        </TouchableOpacity>

        {/* feature button/ */}
        <View
          style={{ backgroundColor: COLORS.light, height: 2, marginBottom: 10 }}
        ></View>

        <TouchableOpacity onPress={() => navigation.navigate("Channels")}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.cardText}>Discussion Forums</Text>
            <Image
              source={require("../../assets/afeatures.png")}
              style={styles.verifiedIcon}
            />
          </View>
        </TouchableOpacity>
        <View
          style={{ backgroundColor: COLORS.light, height: 2, marginBottom: 10 }}
        ></View>

        {/* omega verified */}
        <TouchableOpacity  onPress={() => navigation.navigate("verifyidentity")}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
           
          >
            <Text style={styles.cardText}>Omega Verified</Text>
            <Image
              source={require("../../assets/averified.png")}
              style={styles.verifiedIcon}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* About us button  */}
      <TouchableOpacity onPress={() => navigation.navigate("Aboutus")}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: COLORS.gray,
            margin: 10,
            padding: 10,
            borderRadius: 10,
          }}
        >
          <Text style={styles.logoutText}>About Us</Text>
          <Icon name="arrow-right-circle" size={30} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={openLogoutModal}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: COLORS.gray,
            margin: 10,
            padding: 10,
            borderRadius: 10,
          }}
        >
          <Text style={styles.logoutText}>Logout</Text>
          <Icon name="logout" size={30} />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isLogoutModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleLogoutConfirmation}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={closeLogoutModal}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 25,
  },
  accountHeader: {
    flexDirection: "row",
    // alignItems: "center",
    // backgroundColor: "red",
  },
  accountHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    // backgroundColor: "red",
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  infoContainer: {
    flexDirection: "column",
    // backgroundColor: "red",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: COLORS.dark,
    fontFamily: Font["poppins-bold"],
  },
  card: {
    backgroundColor: COLORS.gray,
    margin: 10,
    padding: 15,
    borderRadius: 10,
  },
  cardText: {
    fontFamily: Font["poppins-semiBold"],
    fontSize: FontSize.medium,
    marginBottom: 10,
  },
  logoutText: {
    fontFamily: Font["poppins-semiBold"],
    fontSize: FontSize.medium,
    // color: COLORS.red, // Change this to the desired color for logout text
  },
  verifiedIcon: {
    width: 25,
    height: 25,
    marginLeft: 5,
  },
  whiamiContainer: {
    backgroundColor: COLORS.primary, // Customize the background color
    borderRadius: 20, // Customize the border radius
    paddingHorizontal: 15,
    paddingVertical: 5,
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  whoamitext: {
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.small,
    color: COLORS.white, // Customize the text color
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.gray,
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  logoutButtonText: {
    fontFamily: Font["poppins-semiBold"],
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
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  modalButtonText: {
    color: COLORS.white,
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.medium,
  },
  skeletonContainer: {
    flexDirection: "row", // Match the flexDirection with profileContainer
    alignItems: "center", // Match the alignItems with profileContainer
    marginVertical: 15,
  },
  skeletonProfile: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.lightPrimary, // Customize the skeleton color
    marginRight: 20,
  },
  skeletonInfoContainer: {
    flex: 1, // Expand to fill remaining space
    flexDirection: "column",
    justifyContent: "center", // Vertically align the skeleton content
  },
  skeletonName: {
    width: "70%",
    height: 20,
    backgroundColor: COLORS.lightPrimary, // Customize the skeleton color
    marginBottom: 5,
  },
  skeletonEmail: {
    width: "90%",
    height: 18,
    backgroundColor: COLORS.lightPrimary, // Customize the skeleton color
  },
});

export default Account;
