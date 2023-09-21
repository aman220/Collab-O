import React, { Component } from "react";
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
import Font from "../../const/Font";
import FontSize from "../../const/FontSize";
import Spacing from "../../const/Spacing";

const HEADER_MAX_HEIGHT = 120;
const HEADER_MIN_HEIGHT = 100;
const PROFILE_IMAGE_MAX_HEIGHT = 80;
const PROFILE_IMAGE_MIN_HEIGHT = 40;
const USER_TABS_HEIGHT = 50;

class NotificationExpand extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollY: new Animated.Value(0),
    };
  }

  handleButtonPress = (buttonName) => {
    this.setState({ activeButton: buttonName });
  };

  render() {
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
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
              Aman Raj Singh
            </Text>
          </Animated.View>
        </Animated.View>

        <ScrollView
          style={{ flex: 1, padding: 10 }}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
            { useNativeDriver: false } // Add this options object
          )}
        >
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
              source={require("../../assets/photo.jpg")}
              style={{ flex: 1, width: null, height: null }}
              resizeMode="cover"
            />
          </Animated.View>

          <View>
            <Text style={{ fontWeight: "bold", fontSize: 26, paddingLeft: 10 }}>
              Aman Raj Singh
              <VerifiedIcon />
            </Text>
            <Text
              style={{
                fontFamily: Font["poppins-regular"],
                fontSize: 15,
                paddingLeft: 10,
              }}
            >
              GLA University Mathura
            </Text>
          </View>
          <Text
            style={{
              fontFamily: Font["poppins-semiBold"],
              fontSize: FontSize.large,
              maxWidth: "98%",
              marginTop: 20,
              textAlign: "center",
            }}
          >
            I want to join this project and lets make it a big project It also
            has the potential to convert a start up
          </Text>
          <View style={styles.Tags}>
            <View style={styles.teamTag}>
              <Text style={styles.teamText}>Linkedin Profile</Text>
            </View>
          </View>

          <View style={{flexDirection:"row" , justifyContent:"space-between"}}>
          <TouchableOpacity
            style={{
              padding: Spacing,
              backgroundColor: "#FFC0CB",
              marginVertical: Spacing * 3,
              width:"40%",
              marginHorizontal: Spacing,
              borderRadius: Spacing,
              shadowColor: COLORS.primary,
              shadowOffset: {
                width: 0,
                height: Spacing,
              },
              shadowOpacity: 0.3,
              shadowRadius: Spacing,
            }}
          >
            <Text
              style={{
                fontFamily: Font["poppins-bold"],
                color: COLORS.white,
                textAlign: "center",
                fontSize: FontSize.large,
              }}
            >
              Reject
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: Spacing,
              backgroundColor: COLORS.primary,
              marginVertical: Spacing * 3,
              marginHorizontal: Spacing,
              width:"40%",
              borderRadius: Spacing,
              shadowColor: COLORS.primary,
              shadowOffset: {
                width: 0,
                height: Spacing,
              },
              shadowOpacity: 0.3,
              shadowRadius: Spacing,
            }}
          >
            <Text
              style={{
                fontFamily: Font["poppins-bold"],
                color: COLORS.white,
                textAlign: "center",
                fontSize: FontSize.large,
              }}
            >
              Accept
            </Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default NotificationExpand;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  verifiedIcon: {
    width: 25,
    height: 25,
    marginLeft: 10,
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
  techStack: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
  tech: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0.5, height: 0.5 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  techText: {
    fontSize: 15, // Reduced font size
    color: COLORS.white,
  },
  Tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },
  teamTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "lightgreen",
    padding: 10,
    borderRadius: Spacing,
    marginBottom: 10,
    marginRight: 10,
  },
  teamText: {
    fontFamily: Font["poppins-semiBold"],
    fontSize: FontSize.small,
    marginRight: 5,
  },
  Requestcard: {
    width: "89%",
    height: 120, // Fixed height for the project card
    backgroundColor: COLORS.lightPrimary,
    alignSelf: "center",
    borderRadius: 10,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: Spacing,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  submitButtonText: {
    color: COLORS.white,
    fontFamily: Font["poppins-semiBold"],
    fontSize: FontSize.medium,
  },
  teamTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "lightgreen",
    padding: 10,
    borderRadius: Spacing,
    marginBottom: 10,
    marginRight: 10,
  },
  teamText: {
    fontFamily: Font["poppins-semiBold"],
    fontSize: FontSize.small,
    marginRight: 5,
  },
  Tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },
});
