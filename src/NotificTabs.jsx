import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import COLORS from "./const/colors";
import CollegeNoti from "./Screens/Notification/CollegeNoti";
import GlobalNoti from "./Screens/Notification/GlobalNoti";
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

const NotificTabs = () => {
  
  const [activeTab, setActiveTab] = useState("campus");
  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <View>
      <View style={styles.buttonsContainer}>
        <View style={styles.innerbuttonContainer}>
          <TabButton
            label="Campus"
            isActive={activeTab === "campus"}
            onPress={() => handleTabPress("campus")}
          />
          <TabButton
            label="Global"
            isActive={activeTab === "global"}
            onPress={() => handleTabPress("global")}
          />
        </View>
      </View>
      <View style={styles.tabContentContainer}>
        {activeTab === "campus" && <CollegeNoti/>}
        {activeTab === "Media" && <GlobalNoti/>}
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

export default NotificTabs;
