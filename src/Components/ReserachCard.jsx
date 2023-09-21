import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import COLORS from "../const/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Font from "../const/Font";

const ResearchCard = (props) => {
  const {
    title,
    abstract,
    authors,
    publicationDate,
    journalName,
    keywords,
    link,
    userName,
    collegeName,
    timeStamp,
    whoami,
  } = props;

  const [showFullAbstract, setShowFullAbstract] = useState(false);

  const toggleAbstract = () => {
    setShowFullAbstract(!showFullAbstract);
  };

  const formatDateTime = (dateString) => {
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <View style={styles.avatarShadow}>
          <Image
            source={require("../assets/photo.jpg")}
            style={styles.avatar}
          />
        </View>
        <View style={styles.userInfoContainer}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.collegeName}>{collegeName}</Text>
          <Text style={styles.timeStamp}>{formatDateTime(timeStamp)}</Text>
          <View style={styles.whoamiContainer}>
            <Text style={styles.whoamitext}>{whoami}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.journalName}>{journalName}</Text>

      <View>
        <Text
          numberOfLines={showFullAbstract ? undefined : 3}
          style={styles.abstract}
        >
          {abstract}
        </Text>
        {abstract && abstract.length > 150 && (
          <TouchableOpacity onPress={toggleAbstract}>
            <Text style={styles.seeMore}>
              {showFullAbstract ? "See Less" : "See More"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.iconInfoContainer}>
        <Icon name="account-group-outline" size={18} style={styles.iconStyle} />
        <View style={styles.authorsContainer}>
          {authors &&
            authors.slice(0, 3).map((author, index) => (
              <Text key={index} style={styles.author}>
                {author}
                {index !== authors.length - 1 ? "," : ""}
              </Text>
            ))}
          {authors && authors.length > 3 && (
            <Text style={styles.author}>+ {authors.length - 3} more</Text>
          )}
        </View>
      </View>

      <View style={styles.iconInfoContainer}>
        <Icon name="calendar" size={18} style={styles.iconStyle} />
        <Text style={styles.publicationDate}>
          Published on: {formatDateTime(publicationDate)}
        </Text>
      </View>

      <View style={styles.iconInfoContainer}>
        <Icon name="tag-outline" size={18} style={styles.iconStyle} />
        <View style={styles.keywordsContainer}>
          {keywords &&
            keywords.map((keyword, index) => (
              <Text key={index} style={styles.keyword}>
                {keyword}
              </Text>
            ))}
        </View>
      </View>

      <TouchableOpacity style={styles.fullPaperLink}>
        <Text style={styles.fullPaperText}>Read Full Paper</Text>
        <Icon name="file-document-outline" size={24} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 20,
    marginBottom: 90,
    marginTop: 10,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  avatarShadow: {
    elevation: 7, 
    shadowColor: "#000", 
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  userInfoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontFamily: Font.bold,
    fontSize: 18,
    color: COLORS.black,
    marginBottom: 3,
  },
  collegeName: {
    fontFamily: Font.medium,
    fontSize: 15,
    color: COLORS.grey,
    marginBottom: 3,
  },
  timeStamp: {
    fontFamily: Font.light,
    fontSize: 13,
    color: COLORS.lightGrey,
  },
  whoamiContainer: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 5,
    backgroundColor: COLORS.light,
    marginTop: 10,
  },
  whoamitext: {
    fontFamily: Font.medium,
    fontSize: 14,
    color: COLORS.primary,
  },
  title: {
    fontFamily: Font.bold,
    fontSize: 19,
    color: COLORS.black,
    marginBottom: 7,
  },
  journalName: {
    fontFamily: Font.medium,
    fontSize: 15,
    color: COLORS.grey,
    marginBottom: 15,
  },
  abstract: {
    fontFamily: Font.regular,
    fontSize: 15,
    color: COLORS.black,
    lineHeight: 22, 
    marginBottom: 7,
  },
  seeMore: {
    fontFamily: Font.medium,
    fontSize: 15,
    color: COLORS.primary,
    textDecorationLine: "underline", 
  },
  authorsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  author: {
    fontFamily: Font.regular,
    fontSize: 15,
    color: COLORS.black,
    marginRight: 10,
    marginBottom: 5,
  },
  publicationDate: {
    fontFamily: Font.light,
    fontSize: 13,
    color: COLORS.lightGrey,
    marginBottom: 15,
  },
  keywordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  keyword: {
    fontFamily: Font.regular,
    fontSize: 14,
    color: COLORS.black,
    backgroundColor: COLORS.light,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 5,
    marginRight: 8,
    marginBottom: 5,
  },
  fullPaperLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 7,
  },
  fullPaperText: {
    color: COLORS.white,
    marginRight: 10,
  },
  iconInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  iconStyle: {
    marginRight: 10,
    color: COLORS.primary,
  },
});



export default ResearchCard;