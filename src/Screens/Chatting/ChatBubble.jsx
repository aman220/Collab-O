import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import COLORS from "../../const/colors";
import Font from "../../const/Font";

const ChatBubble = ({ content, type, timestamp }) => {
  const isReceiver = type === "receiver";

  return (
    <View
      style={[
        styles.bubbleWrapper,
        isReceiver ? styles.leftAlign : styles.rightAlign,
      ]}
    >
      {isReceiver && (
        <Image
          source={require("../../assets/photo.jpg")}
          style={styles.profileImage}
        />
      )}
      <View
        style={[styles.container, isReceiver ? styles.receiver : styles.sender]}
      >
        <Text style={styles.content}>{content}</Text>
        <Text style={styles.timestamp}>{timestamp}</Text> 
      </View>
      {isReceiver ? (
        <View style={styles.receiverTail} />
      ) : (
        <View style={styles.senderTail} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bubbleWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 7,
    marginHorizontal: 10,
  },
  leftAlign: {
    justifyContent: "flex-start",
  },
  rightAlign: {
    justifyContent: "flex-end",
  },
  container: {
    maxWidth: "70%",
    padding: 12,
    borderRadius: 20,
    elevation: 2,
    marginBottom: 2,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  content: {
    fontSize: 16,
    color: COLORS.dark,
    fontFamily: Font["poppins-regular"],
  },
  timestamp: {
    fontSize: 12,
    textAlign: "right",
    marginTop: 5,
    color: "#aaa", // You may want to change this color
    fontFamily: Font["poppins-regular"],
  },
  receiver: {
    backgroundColor: "#e6e6e6",
    borderBottomLeftRadius: 0,
  },
  sender: {
    backgroundColor: COLORS.lightPrimary,
    borderBottomRightRadius: 0,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  receiverTail: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderTopWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopColor: "transparent",
    borderRightColor: "#e6e6e6",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    marginLeft: -7,
  },
  senderTail: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderTopWidth: 10,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 10,
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: COLORS.lightPrimary,
    marginRight: -7,
  },
});

export default ChatBubble;
