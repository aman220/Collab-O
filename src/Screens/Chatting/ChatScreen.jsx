import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
  FlatList,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Font from "../../const/Font";
import COLORS from "../../const/colors";
import ChatBubble from "./ChatBubble";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firestore } from "../../Firebase/firebase";

const ChatScreen = ({ navigation }) => {
  const [chatData, setChatData] = useState(null);
  const [userUid, setUserUid] = useState(null);
  const [chatPartnerData, setChatPartnerData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [senderid, setSenderId] = useState("");
  const [reciverid, setReciverId] = useState("");

  const fetchUserData = useCallback(async () => {
    try {
      const uid = await AsyncStorage.getItem("@userUid");
      if (uid != null) {
        setUserUid(uid);
        const chatRef = firestore.collection("Chat_Rooms").doc("JhonDoreroom");
        chatRef.onSnapshot(async (docSnapshot) => {
          if (docSnapshot.exists) {
            const chatData = docSnapshot.data();
            setChatData(chatData);
            setReciverId(chatData.reciverid);
            setSenderId(chatData.senderId);

            // Determine whether the current user is the sender or receiver
            const isCurrentUserSender = uid === chatData.senderId;

            const partnerId = isCurrentUserSender
              ? chatData.reciverid
              : chatData.senderId;
            console.log(partnerId);

            // Fetch chat partner's data from Firestore
            firestore
              .collection("users")
              .doc(partnerId)
              .get()
              .then((doc) => {
                if (doc.exists) {
                  const userData = doc.data();
                  setChatPartnerData(userData);
                } else {
                  console.log("User data not found");
                }
              })
              .catch((error) => {
                console.error("Error fetching user data:", error);
              });
          } else {
            showToast("error", "chatData Not Found!");
          }

          const messagesSnapshot = await chatRef
            .collection("messages");
            const unsubscribe = messagesSnapshot.orderBy("timestamp").onSnapshot(
              (querySnapshot) => {
                const messageList = querySnapshot.docs.map((doc) => {
                  const messageData = doc.data();
                  return {
                    id: doc.id,
                    content: messageData.message,
                    type: userUid === messageData.senderID ? "receiver" : "sender",
                    timestamp: messageData.timestamp.toDate().toLocaleTimeString(),
                  };
                });
      
                setMessages(messageList);
              },
              (error) => {
                console.error("Error listening to messages:", error);
              }
            );
      
            // Clean up the listener when the component unmounts
            return () => {
              unsubscribe();
            };
        });
      } else {
        console.log("User not logged in.");
      }
    } catch (error) {
      console.log("Error fetching chat data:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const dummyMessages = [
    {
      id: "1",
      content: "Hello! How are you?",
      type: "receiver",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      content: "I am fine! Thanks for asking. How about you?",
      type: "sender",
      timestamp: "10:32 AM",
    },
    {
      id: "3",
      content: "I am good too! Let’s catch up soon!",
      type: "receiver",
      timestamp: "10:33 AM",
    },
  ];
  const [message, setMessage] = useState("");
  const iconTransition = new Animated.Value(0);

  const handleTextChange = (text) => {
    setMessage(text);
    Animated.timing(iconTransition, {
      toValue: text ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const microphoneOpacity = iconTransition.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const sendOpacity = iconTransition.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const sendMessage = async () => {
    if (message.trim() === "") return;

    const chatRef = firestore
      .collection("Chat_Rooms")
      .doc("JhonDoreroom")
      .collection("messages");

    const newMessage = {
      senderID: userUid,
      receiverID: reciverid, // Replace with the actual field name for the receiver's ID
      message: message,
      timestamp: new Date(),
    };

    try {
      await chatRef.add(newMessage);
      setMessage(""); // Clear the input field after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: chatPartnerData
                ? chatPartnerData.avatar
                : "default_avatar_url",
            }}
            style={styles.avatar}
          />
          <View style={styles.nameTimeContainer}>
            <Text style={styles.chatPartnerName}>
              {chatPartnerData ? chatPartnerData.fullName : "Loading..."}
            </Text>
            <Text style={styles.chatPartnerTime}>
              {chatPartnerData
                ? chatPartnerData.college.slice(0, 30) +
                  (chatPartnerData.college.length > 30 ? "..." : "")
                : "N/A"}
            </Text>
          </View>
        </View>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatBubble
            content={item.content}
            type={item.type}
            timestamp={item.timestamp}
            userUid={userUid} // Pass the userUid to determine sender/receiver
          />
        )}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
      />

      <View style={styles.footerWrap}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.footerContainer}
        >
          <View style={styles.footer}>
            <TextInput
              value={message}
              onChangeText={handleTextChange}
              placeholder="Type a message..."
              placeholderTextColor="#aaa"
              style={styles.textInput}
            />
            {message ? (
              <Animated.View
                style={[styles.iconContainer, { opacity: sendOpacity }]}
              >
                <TouchableOpacity onPress={sendMessage}>
                  <Icon name="send" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <Animated.View
                style={[styles.iconContainer, { opacity: microphoneOpacity }]}
              >
                <TouchableOpacity>
                  <Icon name="microphone" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 15,
    height: 90,
    paddingTop: 30,
    backgroundColor: COLORS.primary,
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: 45,
  },
  headerTitle: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: "600",
  },
  chatContainer: {
    flex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },
  chatContent: {
    paddingBottom: 20,
    padding: 10,
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderColor: COLORS.grey,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  footer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.light,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 8,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    borderColor: COLORS.grey,
    borderWidth: 0.5,
    marginRight: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.light,
    marginRight: 5,
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 30,
  },
  nameTimeContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 5,
  },
  chatPartnerName: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: Font["poppins-bold"],
  },
  chatPartnerTime: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: Font["poppins-regular"],
  },
  footerWrap: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    paddingBottom: 5,
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderColor: COLORS.grey,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
});

export default ChatScreen;
