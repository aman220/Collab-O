import React from "react";
import { View, Text, Image, StyleSheet, SafeAreaView } from "react-native";
import Font from "../const/Font";
import COLORS from "../const/colors";

const Notification = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../assets/photo.jpg")} // Replace with the actual image URL
        style={styles.userImage}
      />
      <View style={styles.noticontent}>
        <View style={styles.userInfo}>
          <Text style={styles.username}>Aman Raj Singh</Text>
          <Text style={styles.userCollege}>Gla University</Text>
        </View>

        <Text style={styles.messageText}>
          Hii I want to Coloubourate With you I have a Five Year of exprience in
          this Filed
        </Text>
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
    backgroundColor: COLORS.white,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flexDirection: "column",
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userCollege: {
    fontSize: 14,
    color: "gray",
  },

  messageText: {
    fontSize: 16,
    fontFamily: Font["Cantarell-regular"],
    marginTop:10,
  },
  noticontent: {
    flex: 1,
  },
});

export default Notification;
