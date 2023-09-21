import React, { useState, useRef } from "react";
import {
  Dimensions,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import COLORS from "../../const/colors";
import Font from "../../const/Font";
import Spacing from "../../const/Spacing";
import FontSize from "../../const/FontSize";
import { Camera } from 'expo-camera';

const { height } = Dimensions.get("screen");

const Verification = () => {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [image, setImage] = useState(null);
  const cameraRef = useRef(null);

  const openCamera = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") {
       console.log("granted")
      } else {
        console.log("granted")
      }
    } catch (error) {
      console.error("Error opening camera:", error);
      // Handle the error here
    }
  };
  

  const takePicture = async () => {
    if (cameraRef.current) {
      const { uri } = await cameraRef.current.takePictureAsync();
      setImage(uri);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
      <View style={styles.header}>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: FontSize.xLarge,
              color: COLORS.primary,
              fontFamily: Font["poppins-bold"],
              marginVertical: Spacing * 3,
            }}
          >
            Verify Identity
          </Text>
        </View>
      </View>
      <View>
        <ImageBackground
          style={{ height: height / 2.5 }}
          resizeMode="contain"
          source={require("../../assets/verifyidentity.png")}
        />
        <Text
          style={{
            fontFamily: Font["poppins-semiBold"],
            fontSize: FontSize.large,
            maxWidth: "98%",
            textAlign: "center",
          }}
        >
          Verify Your Student Identity to Avail the Features of Application
        </Text>

        {/* Display image if captured */}
        {image && (
          <Image source={{ uri: image }} style={{ width: 200, height: 200, alignSelf: "center" }} />
        )}

        <View style={styles.tickLine}>
          <Text style={styles.tick}>✓</Text>
          <Text style={styles.tickText}>ID should be PNG or JPG format</Text>
        </View>
        <View style={styles.tickLine}>
          <Text style={styles.tick}>✓</Text>
          <Text style={styles.tickText}>Maximum Upload Size Would be 10mb</Text>
        </View>
        <View style={styles.tickLine}>
          <Text style={styles.tick}>✓</Text>
          <Text style={styles.tickText}>Make sure you are Logged In</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{
              padding: Spacing,
              backgroundColor: COLORS.primary,
              marginVertical: Spacing * 3,
              marginHorizontal: Spacing,
              borderRadius: Spacing,
              shadowColor: COLORS.primary,
              shadowOffset: {
                width: 0,
                height: Spacing,
              },
              shadowOpacity: 0.3,
              shadowRadius: Spacing,
            }}
            onPress={openCamera}
          >
            <Text
              style={{
                fontFamily: Font["poppins-bold"],
                color: COLORS.white,
                textAlign: "center",
                fontSize: FontSize.large,
              }}
            >
              Take Selfie
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: Spacing,
              backgroundColor: COLORS.primary,
              marginVertical: Spacing * 3,
              marginHorizontal: Spacing,
              borderRadius: Spacing,
              shadowColor: COLORS.primary,
              shadowOffset: {
                width: 0,
                height: Spacing,
              },
              shadowOpacity: 0.3,
              shadowRadius: Spacing,
            }}
            onPress={takePicture}
          >
            <Text
              style={{
                fontFamily: Font["poppins-bold"],
                color: COLORS.white,
                textAlign: "center",
                fontSize: FontSize.large,
              }}
            >
              Capture Image
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: Spacing * 2,
    marginTop: 25,
  },
  tickLine: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing,
    padding: 10,
  },
  tick: {
    fontSize: FontSize.medium,
    marginRight: Spacing,
    marginBottom: 2,
  },
  tickText: {
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.medium,
  },
});

export default Verification;
