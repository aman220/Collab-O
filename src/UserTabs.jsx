import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import COLORS from "./const/colors";
import U_Posts from "./UserData/U_Posts";
import U_Media from "./UserData/U_Media";
import U_activity from "./UserData/U_activity";

const TabButton = ({ label, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.button, isActive && styles.activeButton]}
    onPress={onPress}
  >
    <Text style={[styles.buttonText, isActive && styles.activeButtonText]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const Tab = createBottomTabNavigator();

const UserTabs = () => {
  const [activeTab, setActiveTab] = useState("Post");

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <View>
      <View style={styles.buttonsContainer}>
        <View style={styles.innerbuttonContainer}>
          <TabButton
            label="Post"
            isActive={activeTab === "Post"}
            onPress={() => handleTabPress("Post")}
          />
          <TabButton
            label="Media"
            isActive={activeTab === "Media"}
            onPress={() => handleTabPress("Media")}
          />
          <TabButton
            label="Activity"
            isActive={activeTab === "Activity"}
            onPress={() => handleTabPress("Activity")}
          />
        </View>
      </View>
      <View style={styles.tabContentContainer}>
        {activeTab === "Post" && <U_Posts />}
        {activeTab === "Media" && <U_Media />}
        {activeTab === "Activity" && <U_activity />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.lightPrimary,
  },
  innerbuttonContainer: {
    flexDirection: "row",
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 6,
    width: "90%",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: "30%",
    backgroundColor: COLORS.white,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.dark,
    textAlign: "center",
  },
  activeButton: {
    backgroundColor: COLORS.primary,
  },
  activeButtonText: {
    color: COLORS.white,
  },
  tabContentContainer: {
    display: "flex",
    flexDirection: "column",
  },
});

export default UserTabs;
