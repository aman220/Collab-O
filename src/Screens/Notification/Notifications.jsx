import React from "react";
import { View, StyleSheet, Text ,TouchableOpacity,} from "react-native";
import { SafeAreaView } from "react-native";
import Font from "../../const/Font";
import COLORS from "../../const/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontSize from "../../const/FontSize";
import Notification from "../../Components/Notification";
import NotificTabs from "../../NotificTabs";



const Notifications = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.header}>
        <View style={styles.accountHeader}>
          <TouchableOpacity>
            <Icon name="arrow-left" size={30} />
          </TouchableOpacity>
          <Text style={styles.accountHeaderText}>Live Notifications</Text>
        </View>
      </View>
      <NotificTabs/>
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
});

export default Notifications;
