import React, { useState, useEffect, useCallback, Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import COLORS from "../../const/colors";
import UserTabs from "../../UserTabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firestore, firebaseAuth } from "../../Firebase/firebase";

const HEADER_MAX_HEIGHT = 120;
const HEADER_MIN_HEIGHT = 100;
const PROFILE_IMAGE_MAX_HEIGHT = 80;
const PROFILE_IMAGE_MIN_HEIGHT = 40;
const USER_TABS_HEIGHT = 50;

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollY: new Animated.Value(0),
      activeButton: "Post", // Initial active button
    };
  }

  handleButtonPress = (buttonName) => {
    this.setState({ activeButton: buttonName });
  };

  componentDidMount() {
    const { route } = this.props;
    const { userId } = route.params;

    // Fetch user data based on userId
    firestore
      .collection("users")
      .doc(userId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          this.setState({ userData });
        } else {
          console.log("User data not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }

  render() {
    const { route } = this.props;

    // Now you can extract userId from route.params
    const { userId } = route.params;
    // const [userData, setUserData] = useState(null);
   
    const { userData } = this.state;
    console.log(userData);

    const VerifiedIcon = () => (
      <Image
        source={require("../../assets/verifiedicon.png")}
        style={styles.verifiedIcon}
      />
    );

    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: "clamp",
    });

    const profileImageHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [PROFILE_IMAGE_MAX_HEIGHT, PROFILE_IMAGE_MIN_HEIGHT],
      extrapolate: "clamp",
    });

    const profileImageMarginTop = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [
        HEADER_MAX_HEIGHT - PROFILE_IMAGE_MAX_HEIGHT / 2,
        HEADER_MAX_HEIGHT + 5,
      ],
      extrapolate: "clamp",
    });

    const headerZindex = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT, 120],
      outputRange: [0, 0, 1000],
      extrapolate: "clamp",
    });

    const headerTitleBottom = this.state.scrollY.interpolate({
      inputRange: [
        0,
        HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
        HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT + 5 + PROFILE_IMAGE_MIN_HEIGHT,
        HEADER_MAX_HEIGHT -
          HEADER_MIN_HEIGHT +
          5 +
          PROFILE_IMAGE_MIN_HEIGHT +
          26,
      ],
      outputRange: [-25, -20, -20, 15],
      extrapolate: "clamp",
    });

    handleButtonPress = (buttonName) => {
      this.setState({ activeButton: buttonName });

      if (buttonName === "Media") {
        this.props.navigation.navigate("MediaScreen");
      }
    };

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: COLORS.primary,
            height: headerHeight,
            zIndex: headerZindex,
            // elevation: headerZindex, // required for android
            alignItems: "center",
          }}
        >
          <Animated.View
            style={{ position: "absolute", bottom: headerTitleBottom }}
          >
            {userData && (
              <Text
                style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
              >
                {userData.fullName}
              </Text>
            )}
          </Animated.View>
        </Animated.View>

        <ScrollView
          style={{ flex: 1 }}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
            { useNativeDriver: false } // Add this options object
          )}
        >
          {userData && (
            <Animated.View
              style={{
                height: profileImageHeight,
                width: profileImageHeight,
                borderRadius: PROFILE_IMAGE_MAX_HEIGHT / 2,
                borderColor: "white",
                borderWidth: 3,
                overflow: "hidden",
                marginTop: profileImageMarginTop,
                marginLeft: 10,
              }}
            >
              <Image
                source={{ uri: userData.avatar }}
                style={{ flex: 1, width: null, height: null }}
                resizeMode="cover"
              />
            </Animated.View>
          )}

          {userData && (
            <View>
              <Text
                style={{ fontWeight: "bold", fontSize: 26, paddingLeft: 10 }}
              >
                {userData.fullName}
                {userData.isverified == true && <VerifiedIcon />}
              </Text>
            </View>
          )}

          {userData && (
            <View style={styles.statsContainer}>
              <View style={styles.statsItem}>
                <Text style={styles.statsValue}>{userData.PostsCount}</Text>
                <Text style={styles.statsLabel}>Posts</Text>
              </View>
              <View style={styles.statsItem}>
                <Text style={styles.statsValue}>{userData.FollowersCount}</Text>
                <Text style={styles.statsLabel}>Followers</Text>
              </View>
              <View style={styles.statsItem}>
                <Text style={styles.statsValue}>{userData.FollowingCount}</Text>
                <Text style={styles.statsLabel}>Following</Text>
              </View>
            </View>
          )}

          {/* <Animated.View
            style={{
              transform: [{ translateY: userTabsTranslateY }],
              height: USER_TABS_HEIGHT,
            }}
          > */}
          <UserTabs userId={userId}/>
          {/* </Animated.View> */}

          <View style={{ height: 1000 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  verifiedIcon: {
    width: 25,
    height: 25,
    marginLeft: 5,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    paddingHorizontal: 20,
  },
  statsItem: {
    alignItems: "center",
  },
  statsValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statsLabel: {
    fontSize: 14,
    color: COLORS.primary,
  },
});
