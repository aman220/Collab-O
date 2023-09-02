import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import Spacing from "../../const/Spacing";
import FontSize from "../../const/FontSize";
import COLORS from "../../const/colors";
import Font from "../../const/Font";
import { useNavigation } from "@react-navigation/native";

const { height } = Dimensions.get("screen");
const phrases = [
  "Projects here",
  "Collaborate here",
  "Friends here",
  "Research here",
];

const Welcome = () => {
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();

  

  useEffect(() => {
    let currentText = "";
    let currentLength = 0;
    const phrase = phrases[currentIndex];
    

    const typingInterval = setInterval(() => {
      currentText = phrase.slice(0, currentLength);
      setCurrentPhrase(currentText);
      currentLength++;

      if (currentLength > phrase.length) {
        clearInterval(typingInterval);
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        }, 1500);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, [currentIndex]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ImageBackground
          style={{ height: height / 2.5, marginTop: 80 }}
          resizeMode="contain"
          source={require("../../assets/welcome.png")}
        />
        <View
          style={{
            paddingHorizontal: Spacing * 4,
            paddingTop: Spacing * 4,
            flex: 1,
          }}
        >
          <Text
            style={{
              fontSize: FontSize.xxLarge,
              color: COLORS.primary,
              fontFamily: Font["poppins-bold"],
              textAlign: "center",
            }}
          >
            Discover Your
          </Text>
          <Text
            style={{
              fontSize: FontSize.xxLarge,
              color: COLORS.primary,
              fontFamily: Font["poppins-bold"],
              textAlign: "center",
              marginBottom: Spacing * 2,
            }}
          >
            {currentPhrase}
          </Text>
        </View>
        <View>
          <Text
            style={{
              fontSize: FontSize.small,
              color: COLORS.Text,
              fontFamily: Font["poppins-regular"],
              textAlign: "center",
              marginTop: Spacing * 1,
            }}
          >
            Explore the existing Project for your learning and Collaboration
            with Others
          </Text>
        </View>

        <View
          style={{
            paddingHorizontal: Spacing * 2,
            paddingTop: Spacing * 5,
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 50,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              paddingVertical: Spacing * 1.5,
              paddingHorizontal: Spacing * 2,
              width: "48%",
              borderRadius: Spacing,
              shadowColor: COLORS.primary,
              shadowOffset: {
                width: 0,
                height: Spacing,
              },
              shadowOpacity: 0.3,
              shadowRadius: Spacing,
            }}
            onPress={() => navigation.navigate("Login")}
          >
            <Text
              style={{
                fontFamily: Font["poppins-bold"],
                color: COLORS.white,
                fontSize: FontSize.large,
                textAlign: "center",
              }}
            >
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              paddingVertical: Spacing * 1.5,
              paddingHorizontal: Spacing * 2,
              width: "40%",
              borderRadius: Spacing,
            }}
            onPress={() => navigation.navigate("Register")}
          >
            <Text
              style={{
                fontFamily: Font["poppins-bold"],
                color: COLORS.dark,
                fontSize: FontSize.large,
                textAlign: "center",
              }}
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
