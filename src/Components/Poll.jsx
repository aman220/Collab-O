import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import COLORS from "../const/colors";
import Font from "../const/Font";
import FontSize from "../const/FontSize";
import Spacing from "../const/Spacing";

const VerifiedIcon = () => (
  <Image
    source={require("../assets/verifiedicon.png")}
    style={styles.verifiedIcon}
  />
);

const Poll = () => {
  const initialOptions = [
    { id: 1, text: "React Native", count: 0 },
    { id: 2, text: "Web Development", count: 0 },
    { id: 3, text: "Vue js", count: 0 },
  ];

  const [options, setOptions] = useState(initialOptions);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);

    const updatedOptions = options.map((option) => {
      if (option.id === optionId) {
        return { ...option, count: option.count + 1 };
      } else {
        return option;
      }
    });

    setOptions(updatedOptions);
  };

  const totalVotes = options.reduce((total, option) => total + option.count, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/photo.jpg")}
          style={styles.profileImage}
        />
        <View style={styles.tweetContent}>
          <TouchableOpacity style={styles.userInfo}>
            <View style={styles.usernameContainer}>
              <Text style={styles.username}>Aman Raj Singh</Text>
              <VerifiedIcon />
            </View>
            <View style={styles.whoamiContainer}>
              <Text style={styles.whoamitext}>Student</Text>
            </View>
          </TouchableOpacity>
          <Text style={{fontFamily:Font["Cantarell-regular"]}}>GLA University</Text>
        </View>
      </View>
      <Text
          style={{
            fontFamily: Font["poppins-semiBold"],
            fontSize: FontSize.large,
            maxWidth: "98%",
            textAlign: "center",
          }}
        >
          Which technology is most popular in the market nowadays?
        </Text>
      <View style={styles.pollContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => handleOptionSelect(option.id)}
          >
            <View style={styles.pollInput}>
              <Text style={styles.textstyle}>{option.text}</Text>
              <View
                style={[
                  styles.colorFilling,
                  {
                    width: `${(option.count / totalVotes) * 100}%`,
                  },
                ]}
              ></View>
              {selectedOption && (
                <Text style={styles.textstylepercent}>
                  {totalVotes > 0
                    ? `${((option.count / totalVotes) * 100).toFixed(1)}%`
                    : "0%"}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection:"row"
  },
  headerText: {
    color: COLORS.white,
    fontSize: 24,
  },
  pollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  pollInput: {
    fontFamily: Font["poppins-semiBold"],
    fontSize: FontSize.small,
    flexDirection: "row",
    padding: Spacing * 2,
    borderRadius: Spacing,
    marginBottom: 20,
    alignItems: "center",
    position: "relative",
  },
  textstyle: {
    fontFamily: Font["poppins-semiBold"],
    fontSize: FontSize.medium,
    textAlign: "left",
  },
  colorFilling: {
    backgroundColor: "rgba(144, 238, 144, 1)",
    height: "240%",
    position: "absolute",
    top: 0,
    left: 0,
    borderTopLeftRadius: Spacing,
    borderBottomLeftRadius: Spacing,
    zIndex: -9990,
    borderRadius:10,
  },
  textstylepercent: {
    fontFamily: Font["poppins-semiBold"],
    fontSize: FontSize.medium,
    textAlign: "right",
    position: "absolute",
    right: 0,
  },
  container: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: COLORS.white,
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
  handle: {
    color: "#999",
  },
  verifiedIcon: {
    width: 25,
    height: 25,
    marginLeft: 2,
  },
  whoamiContainer: {
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
});

export default Poll;
