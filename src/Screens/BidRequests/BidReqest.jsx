import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Button,
  Modal,
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
  const [abstract, setAbstract] = useState("");
  const [name, setName] = useState("");
  const [linkedinValue, setLinkedinValue] = useState("");
  const [userData, setUserData] = useState({});
  const [isProjectStatusVisible, setIsProjectStatusVisible] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [uaid, setUaid] = useState("");

  const validateFields = () => {
    // Check if any of the required fields are empty
    const fieldsAreEmpty = abstract.trim() === "" || name.trim() === "";
    setIsSubmitDisabled(fieldsAreEmpty);
  };

  const handleAbstractChange = (text) => {
    setAbstract(text);
    validateFields();
  };

  const handleNameChange = (text) => {
    // Function to handle Name input change
    setName(text);
    validateFields();
  };

  const handleLinkedinChange = (text) => {
    setLinkedinValue(text);
  };

  const openProjectModal = () => {
    setIsProjectStatusVisible(true);
  };

  const closeProjectModal = () => {
    setIsProjectStatusVisible(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const uid = await AsyncStorage.getItem("@userUid");
      setUaid(uid);
      try {
        const userDoc = await firestore.collection("users").doc(uid).get();
        if (userDoc.exists) {
          setUserData(userDoc.data());
        } else {
          console.log("User not found in Firestore");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData(); // Call the function to fetch user data
  }, [userid]); // Trigger the effect when the userid changes

  const avtarValue = userData.avatar || null;
  const college = userData.college || null;

  const handleSendRequest = async () => {
    const uaid = await AsyncStorage.getItem("@userUid");
    if (uaid === userid) {
      openProjectModal();
      return;
    }
    if (abstract.trim() === "" || name.trim() === "") {
      console.log("Please fill in all required fields.");
      return;
    }
    const notificationCollectionRef = firestore.collection("Requests");
    const uid = await AsyncStorage.getItem("@userUid");
    const currentDate = new Date();
    try {
      await notificationCollectionRef.add({
        name: name,
        whyJoin: abstract,
        linkedin: linkedinValue,
        senderId: uid,
        reciverId: userid,
        postid: postid,
        createdAt: currentDate.toISOString(),
        avtar: avtarValue,
        college: college,
      });

      console.log("Notification sent successfully!");
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
        <TouchableOpacity
          style={[styles.submitButton, { opacity: isSubmitDisabled ? 0.5 : 1 }]}
          onPress={handleSendRequest}
          disabled={isSubmitDisabled}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      {/* this modal will be open when user click on post button */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isProjectStatusVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {uaid === userid ? (
              <>
                <Text style={styles.modalText}>
                  You cannot send Collaboration request on your own project.
                </Text>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={closeProjectModal}
                  >
                    <Text style={styles.modalButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.modalText}>
                  🚀 Your project Collaboration request has been forwarded to
                  your Selected Project Owner,{"\n"}
                  <Text style={{ fontWeight: "bold" }}>{userName}</Text>.{"\n"}
                  Will Update Shortly...
                </Text>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={handleSendRequest}
                  >
                    <Text style={styles.modalButtonText}>Yes</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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

export default BidReqest;
