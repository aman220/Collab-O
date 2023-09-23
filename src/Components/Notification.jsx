import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Font from "../const/Font";
import COLORS from "../const/colors";
import { useNavigation } from "@react-navigation/native";

const Notification = ({ whyjoin, name, college, avtar ,senderId,reciverId}) => {
  
  const navigation = useNavigation();


  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={{ uri: avtar }} // Replace with the actual image URL
        style={styles.userImage}
      />

      <TouchableOpacity style={styles.noticontent} onPress={() => navigation.navigate("Notificationexpand",{navigation,senderId,reciverId,name,college,avtar})}>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{name}</Text>
          <Text style={styles.userCollege}>{college}</Text>
        </View>

        <Text style={styles.messageText}>{whyjoin}</Text>
      </TouchableOpacity>
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
    elevation: 5,
    borderRadius: 5,
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
    marginTop: 10,
  },
  noticontent: {
    flex: 1,
  },
});

export default Notification;
