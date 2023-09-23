import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native";
import Font from "../../const/Font";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontSize from "../../const/FontSize";
import COLORS from "../../const/colors";
import { useNavigation } from "@react-navigation/native";

const Channels = () => {
  const [Selected, setSelected] = React.useState(0);
  const navigation = useNavigation();

  const options = [
    { label: "General", image: require("../../assets/graduate.png") },
    { label: "MERN Stack", image: require("../../assets/teacher.png") },
    { label: "Cross-Platform Mobile", image: require("../../assets/cross-platform.png") },
    { label: "Android dev", image: require("../../assets/android.png") },
    { label: "Djengo", image: require("../../assets/python.png") },
    { label: "MetaVerse", image: require("../../assets/virtual-reality.png") },
  ];

  const handleOptionPress = (index) => {
    setSelected(index);
    if (index === 0) {
      navigation.navigate("generalChatScreen"); // Navigate to generalChatScreen when General is clicked
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
          Select a Discussion Channel ..
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.sheetBodyOptions}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.sheetBodyOption,
                Selected === index && { borderColor: "#000" },
              ]}
              onPress={() => handleOptionPress(index)}
            >
              <Image
                source={option.image}
                style={{
                  width: 70,
                  height: 70,
                }}
              ></Image>
              <Text
                style={[
                  styles.stylebodyoptiontext,
                  Selected === index && { color: "#000" },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  sheetBodyOptions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: -16,
    flexWrap: "wrap",
  },
  sheetBodyOption: {
    flexBasis: "45%", // 45% width for two options in a row with some spacing
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 8,
    marginVertical: 8,
    paddingVertical: 28,
  },
  stylebodyoptiontext: {
    fontFamily: Font["poppins-semiBold"],
    fontSize: FontSize.medium,
    marginTop: 20,
    textAlign: "center",
    color: "#bcddd9",
  },
  contentContainer: {
    paddingHorizontal: 30,
    paddingTop: 20,
  },
});

export default Channels;
