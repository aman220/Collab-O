import React from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import COLORS from "../../const/colors";
import Font from "../../const/Font";
import fonts from "../../../config/fonts";

const Aboutus = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={style.header}>
        {/* account view */}

        <View style={style.accountHeader}>
          <TouchableOpacity>
            <Icon name="arrow-left" size={30} />
          </TouchableOpacity>
          <Text style={style.accountHeaderText}>About Us</Text>
        </View>
      </View>

      
      

      {/* card */}
      <View style={style.cardContainer}>
        <View style={style.card}>
          <View style={style.profileContainer}>
            <Text style={style.name}>( Developer )</Text>
            <Image
              source={require("../../assets/photo.jpg")} // Replace with your image source
              style={style.profilePicture}
            />
            <View style={style.infoContainer}>
              <Text style={style.name}>Aman Raj Singh</Text>
              <Text style={style.email}>aman.singh_cs22@gla.ac.in</Text>
              <Text style={style.tagline}>
                🚀 Innovation paints the sky with the hues of imagination,
                creating a masterpiece of human ingenuity.
              </Text>
            </View>
          </View>
          {/* Social buttons */}
          <View style={style.socialButtons}>
            <TouchableOpacity
              style={[style.socialButton, { backgroundColor: "#FF5733" }]}
            >
              <Icon name="github" size={25} color="#f2f2f2" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[style.socialButton, { backgroundColor: "#0077B5" }]}
            >
              <Icon name="linkedin" size={25} color="#f2f2f2" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[style.socialButton, { backgroundColor: "#1877F2" }]}
            >
              <Icon name="twitter" size={25} color="#f2f2f2" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[style.socialButton, { backgroundColor: "#C13584" }]}
            >
              <Icon name="instagram" size={25} color="#f2f2f2" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
  },
  accountHeader: {
    flexDirection: "row",
  },
  accountHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center", // Place content at the bottom
    alignItems: "center",
    // marginBottom: 50, // Add some margin at the bottom
  },
  card: {
    width: 300,
    height: 500,
    borderRadius: 50,
    backgroundColor: "#e0e0e0",
    elevation: 20,
    shadowColor: "#bebebe",
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 0,
    alignItems: "center",

    shadowRadius: 60,
  },
  socialButtons: {
    bottom: 0,
    position: "absolute",
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "#f2f2f2",
    shadowColor: "#00000027",
    padding: 15,
    borderRadius: 30,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
    shadowColor: "#00000027",
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginVertical: 20,
    // backgroundColor: "red",
  },
  profilePicture: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginTop: 10,
    // marginRight: 20/,
  },
  infoContainer: {
    flexDirection: "column",
    alignItems: "center",
    // backgroundColor: "red",
    margin: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: COLORS.dark,
    marginTop: 10,
    fontFamily: Font["poppins-bold"],
  },
  tagline: {
    fontFamily: Font["poppins-regular"],
    color: COLORS.primary,
    margin: 5,
    fontSize: 15,
  },
  colorview: {
    height: 100,
    width: 100,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    borderRadius: 50,
  },
});

export default Aboutus;
