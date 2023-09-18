import React, { useState} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Button, // Import Button from React Native
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import COLORS from "../../const/colors";
import Font from "../../const/Font";
import FontSize from "../../const/FontSize";
import Spacing from "../../const/Spacing";
import { useNavigation, useRoute } from "@react-navigation/native";
import { firestore } from "../../Firebase/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";


const BidReqest = () => {

  const route = useRoute();
  const { postid, userid, userName, title } = route.params;
  console.log(postid, userid, userName, title);

  const [abstract, setAbstract] = useState("");
  const [name, setName] = useState("");
  const [linkedinValue, setLinkedinValue] = useState("");

  const handleAbstractChange = (text) => {
    setAbstract(text);
  };

  const handleNameChange = (text) => { // Function to handle Name input change
    setName(text);
  };

  const handleLinkedinChange = (text) => {
    setLinkedinValue(text);
  };

  const handleSendRequest = async () => {
    const notificationCollectionRef = firestore.collection("Requests");
    const uid = await AsyncStorage.getItem("@userUid"); // Assuming you have the user's UID stored
    const currentDate = new Date();

    try {
      
      await notificationCollectionRef.add({
        name: name,
        whyJoin: abstract, 
        linkedin: linkedinValue, 
        senderId: uid,
        reciverId:userid,
        postid:postid,
        createdAt: currentDate.toISOString(),
      });

      console.log("Notification sent successfully!");
      // Handle success or navigate to another screen
    } catch (error) {
      console.error("Error sending notification: ", error);
      // Handle errors
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.header}>
        <View style={styles.accountHeader}>
          <TouchableOpacity>
            <Icon name="arrow-left" size={30} />
          </TouchableOpacity>
          <Text style={styles.accountHeaderText}>Request</Text>
        </View>
        <Text
          style={{
            fontFamily: Font["poppins-semiBold"],
            fontSize: FontSize.large,
            maxWidth: "98%",
            textAlign: "center",
            marginTop: 25,
          }}
        >
          Send a Collaboration Request to Project Owner
        </Text>
      </View>

      <View style={styles.projectcard}>
        <Text
          style={{
            fontFamily: Font["Cantarell-regular"],
            fontSize: FontSize.large,
            maxWidth: "98%",
            textAlign: "left",
            marginTop: 10,
            left: 10,
          }}
        >
          {title}
      </Text>
        <Text style={{ textAlign: "right", marginRight: 5, marginTop: 20 }}>
          By {userName}
        </Text>
      </View>
      <Text
          style={{
            fontFamily: Font["poppins-semiBold"],
            fontSize: FontSize.large,
            maxWidth: "98%",
            textAlign: "center",
            marginTop: 25,
          }}
        >
          Your message ...
        </Text>
      <View style={styles.contentContainer}>
        <TextInput
          placeholder="Name" // Name input placeholder
          placeholderTextColor={COLORS.dark}
          style={styles.inputField}
          onChangeText={handleNameChange} // Handle Name input change
        />
        <TextInput
          placeholder="Why you want to join in a team        maxLine(5)"
          placeholderTextColor={COLORS.dark}
          style={styles.inputField}
          multiline
          numberOfLines={5}
          onChangeText={handleAbstractChange}
        />
         <TextInput
          placeholder="Share Linkedin (optional)"
          placeholderTextColor={COLORS.dark}
          style={styles.inputField}
          onChangeText={handleLinkedinChange}
        />
         <TouchableOpacity style={styles.submitButton} onPress={handleSendRequest}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
  },
  accountHeader: {
    flexDirection: "row",
  },
  accountHeaderText: {
    fontSize: 20,
    fontFamily: Font["poppins-bold"],
    flex: 1,
    textAlign: "center",
  },
  projectcard: {
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
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputField: {
    fontFamily: Font["poppins-semiBold"],
    fontSize: FontSize.small,
    padding: Spacing * 1,
    backgroundColor: COLORS.lightPrimary,
    borderRadius: Spacing,
    marginBottom: 20,
    // elevation: 5,
    borderColor: COLORS.primary,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: Spacing,
    alignItems: "center",
  },
  submitButtonText: {
    color: COLORS.white,
    fontFamily: Font["poppins-semiBold"],
    fontSize: FontSize.medium,
  },
});

export default BidReqest;
