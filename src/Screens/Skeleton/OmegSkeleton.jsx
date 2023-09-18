import React from "react";
import { View, StyleSheet , SafeAreaView } from "react-native";
import COLORS from "../../const/colors";

const OmegSkeleton = () => {
  return (
    
    <View style={styles.cardContainer}>
      <View style={styles.avatarSkeleton} />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.userInfoContainer}>
            <View style={styles.userInfoPartSkeleton} />
            <View style={styles.userInfoPartSkeleton} />
            <View style={styles.userInfoPartSkeleton} />
          </View>
          <View style={styles.whoamiSkeleton} />
        </View>
        <View style={styles.titleSkeleton} />
        <View style={styles.descriptionSkeleton} />
        <View style={styles.projectImageSkeleton} />
        <View style={styles.footerSkeleton}>
          <View style={styles.iconContainer}>
            <View style={styles.iconSkeleton} />
            <View style={styles.iconSkeleton} />
            <View style={styles.iconSkeleton} />
          </View>
          <View style={styles.overlappingCircles}>
            <View style={[styles.circle, styles.circle1]} />
            <View style={[styles.circle, styles.circle2]} />
          </View>
        </View>
      </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    margin: 10,
    padding:10,
  },
  container: {
    flex: 1,
    marginLeft: 10,
  },
  avatarSkeleton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.gray,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  userInfoContainer: {
    flexDirection: "column",
    flex: 1,
  },
  userInfoPartSkeleton: {
    backgroundColor: COLORS.gray,
    height: 10,
    marginBottom: 2,
    marginLeft: 2,
  },
  whoamiSkeleton: {
    height: 20,
    width: "25%",
    backgroundColor: COLORS.gray,
    marginBottom: 5,
    borderRadius: 20,
    marginLeft: 5,
  },
  techStackSkeleton: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
    marginBottom: 6,
  },
  techSkeleton: {
    marginRight: 5,
    paddingVertical: 0,
    paddingHorizontal: 16,
    borderRadius: 9,
    backgroundColor: COLORS.gray,
    height: 12,
  },
  titleSkeleton: {
    height: 20,
    backgroundColor: COLORS.gray,
    borderRadius:20,
  },
  descriptionSkeleton: {
    height: 40,
    backgroundColor: COLORS.gray,
    marginTop: 10,
    borderRadius:2,
    
  },
  projectImageSkeleton: {
    height: 200,
    backgroundColor: COLORS.gray, // Placeholder color
    marginTop: 10,
    borderRadius: 7,
  },
  footerSkeleton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  iconContainer: {
    flexDirection: "row",
  },
  iconSkeleton: {
    width: 25,
    height: 25,
    borderRadius: 15,
    backgroundColor: COLORS.gray,
    marginRight: 5,
  },
  overlappingCircles: {
    flexDirection: "row",
  },
  circle: {
    width: 25,
    height: 25,
    borderRadius: 10,
  },
  circle1: {
    backgroundColor: COLORS.gray,
    marginLeft: -10,
  },
  circle2: {
    backgroundColor: COLORS.gray,
    marginLeft: -15,
  },
});

export default OmegSkeleton;