import React, { useState, useRef } from "react";
import {
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  Modal,
} from "react-native";
import COLORS from "../../const/colors";
import Font from "../../const/Font";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontSize from "../../const/FontSize";
import Spacing from "../../const/Spacing";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import showToast from "../../const/Toast";
import collegesData from "../../data/colleges.json";
import LottieView from "lottie-react-native";
import * as ImagePicker from "expo-image-picker";
import { PermissionsAndroid } from "react-native";
import {
  MultipleSelectList,
  SelectList,
} from "react-native-dropdown-select-list";
import { firestore, storage } from "../../Firebase/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";

const Projectpost = () => {
  const [projectTitle, setProjectTitle] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectTechnologies, setProjectTechnologies] = useState("");
  const [titleCharacterCount, setTitleCharacterCount] = useState(0);
  const [descriptionCharacterCount, setDescriptionCharacterCount] = useState(0);
  const [titleInputFocused, setTitleInputFocused] = useState(false);
  const [descriptionInputFocused, setDescriptionInputFocused] = useState(false);
  const [selected, setSelected] = React.useState([]);
  const [selectedCollege, setSelectedCollege] = React.useState([]);
  const [isgithubModalVisible, setIsgithubModalVisible] = useState(false);
  const animationRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [isProjectStatusVisible, setIsProjectStatusVisible] = useState(false);
  const navigation = useNavigation();

  const route = useRoute();
  const { useravtar, username } = route.params;

  const opengithubModal = () => {
    setIsgithubModalVisible(true);
  };

  const closegithubModal = () => {
    setIsgithubModalVisible(false);
  };

  const openProjectModal = () => {
    setIsProjectStatusVisible(true);
  };

  const closeProjectModal = () => {
    setIsProjectStatusVisible(false);
  };

  const maxTitleLength = 100;
  const maxDescriptionLength = 300;

  const handleTitleChange = (text) => {
    if (text.length <= maxTitleLength) {
      setProjectTitle(text);
      setTitleCharacterCount(text.length);
    } else {
      // Display a toast message indicating character limit reached
      showToast("error", "Project Title limit reached");
    }
  };

  const handleDescriptionChange = (text) => {
    if (text.length <= maxDescriptionLength) {
      setProjectDescription(text);
      setDescriptionCharacterCount(text.length);
    } else {
      // Display a toast message indicating character limit reached
      showToast("error", "Project Description limit reached");
    }
  };

  const data = [
    { key: "1", value: "Python", disabled: false },
    { key: "2", value: "Java", disabled: false },
    { key: "3", value: "C++", disabled: false },
    { key: "4", value: "JavaScript", disabled: false },
    { key: "5", value: "Ruby", disabled: false },
    { key: "6", value: "Swift", disabled: false },
    { key: "7", value: "Kotlin", disabled: false },
    { key: "8", value: "Go (Golang)", disabled: false },
    { key: "9", value: "C#", disabled: false },
    { key: "10", value: "PHP", disabled: false },
    { key: "11", value: "HTML5", disabled: false },
    { key: "12", value: "CSS3", disabled: false },
    { key: "13", value: "Node.js", disabled: false },
    { key: "14", value: "React", disabled: false },
    { key: "15", value: "Angular", disabled: false },
    { key: "16", value: "Vue.js", disabled: false },
    { key: "17", value: "Django", disabled: false },
    { key: "18", value: "Ruby on Rails", disabled: false },
    { key: "19", value: "Flutter", disabled: false },
    { key: "20", value: "TensorFlow", disabled: false },
    { key: "21", value: "PyTorch", disabled: false },
    { key: "22", value: "Scikit-Learn", disabled: false },
    { key: "23", value: "Keras", disabled: false },
    { key: "24", value: "OpenCV", disabled: false },
    { key: "25", value: "Git", disabled: false },
    { key: "26", value: "GitHub", disabled: false },
    { key: "27", value: "GitLab", disabled: false },
    { key: "28", value: "Bitbucket", disabled: false },
    { key: "29", value: "AWS", disabled: false },
    { key: "30", value: "Azure", disabled: false },
    { key: "31", value: "Google Cloud Platform", disabled: false },
    { key: "32", value: "Docker", disabled: false },
    { key: "33", value: "Kubernetes", disabled: false },
    { key: "34", value: "Jenkins", disabled: false },
    { key: "35", value: "Travis CI", disabled: false },
  ];

  const collegeOptions = collegesData.map((college) => ({
    key: college._id,
    value: college.college,
  }));

  React.useEffect(() => {
    if (isgithubModalVisible) {
      animationRef.current.play();
    }
  }, [isgithubModalVisible]);

  const handleImagePicker = async () => {
    try {
      const cameraPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      const photoPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );

      if (
        cameraPermission === PermissionsAndroid.RESULTS.GRANTED &&
        photoPermission === PermissionsAndroid.RESULTS.GRANTED
      ) {
        const options = {
          title: "Select Avatar",
          storageOptions: {
            skipBackup: true,
            path: "images",
          },
        };

        try {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });

          if (!result.canceled) {
            setSelectedImage(result.uri);
            setIsImageSelected(true);
          }
        } catch (error) {
          console.log("ImagePicker Error: ", error);
        }
      } else {
        console.log("Camera and photo permissions denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  const handlePostButtonPress = async () => {
    try {
      // Create a new project post document in Firestore
      const projectsCollectionRef = firestore.collection("projects"); // Change "projects" to your Firestore collection name
      const uid = await AsyncStorage.getItem("@userUid"); // Assuming you have the user's UID stored
      const newProjectRef = projectsCollectionRef.doc();
      const currentDate = new Date();
      await newProjectRef.set({
        userId: uid,
        title: projectTitle,
        description: projectDescription,
        technologies: selected,
        college: selectedCollege,
        imageUrl: "",
        githubLink: projectLink,
        createdAt: currentDate.toISOString(),
        isApproved: false,
        username: username,
        avtar: useravtar,
      });

      // Upload the image to Firebase Storage if an image is selected
      if (selectedImage) {
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        const imageName = `projects/${newProjectRef.id}_${Date.now()}.jpg`; // Change 'projects' to your desired storage path
        const imageRef = storage.ref().child(imageName);
        await imageRef.put(blob);

        // Get the image URL from Firebase Storage
        const imageUrl = await imageRef.getDownloadURL();

        // Update the project post document with the image URL
        await newProjectRef.update({ imageUrl });
      }

      // Reset form fields and navigate to another screen
      setProjectTitle("");
      setProjectDescription("");
      setSelected("");
      setSelectedCollege("");
      setProjectLink("");
      setSelectedImage(false);
      navigation.navigate("Maintabs"); // Change "AnotherScreen" to the screen you want to navigate to after posting
    } catch (error) {
      console.error("Error creating project post: ", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.header}>
        <View style={styles.accountHeader}>
          <TouchableOpacity>
            <Icon name="arrow-left" size={30} />
          </TouchableOpacity>
          <Text style={styles.accountHeaderText}>Post a Project</Text>
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
          Innovation Meets Impact Where Creativity Transforms Possibilities!
        </Text>
      </View>
      <Toast />
      <ScrollView style={styles.contentContainer}>
        {/* Project Title */}
        <TextInput
          placeholder="Project Title"
          placeholderTextColor={COLORS.dark}
          style={[
            styles.titleinput,
            projectTitle.length > maxTitleLength && {
              borderColor: "red",
              borderWidth: 2,
            },
            titleInputFocused && {
              borderColor: COLORS.primary,
              borderWidth: 2,
            },
          ]}
          value={projectTitle}
          onChangeText={handleTitleChange}
          onFocus={() => setTitleInputFocused(true)}
          onBlur={() => setTitleInputFocused(false)}
        />
        <Text style={styles.characterCount}>
          {titleCharacterCount}/{maxTitleLength} characters
        </Text>

        {/* Project Description */}
        <TextInput
          placeholder="Project Description"
          placeholderTextColor={COLORS.dark}
          style={[
            styles.input,
            descriptionInputFocused && {
              borderColor: COLORS.primary,
              borderWidth: 2,
            },
          ]}
          multiline
          numberOfLines={4}
          value={projectDescription}
          onChangeText={handleDescriptionChange}
          onFocus={() => setDescriptionInputFocused(true)}
          onBlur={() => setDescriptionInputFocused(false)}
        />
        <Text style={styles.characterCount}>
          {descriptionCharacterCount}/{maxDescriptionLength} characters
        </Text>

        <MultipleSelectList
          setSelected={(val) => setSelected(val)}
          data={data}
          save="value"
          label="Tech Stack"
          disabledCheckBoxStyles={{ borderWidth: 0 }}
        />

        <View style={{ marginTop: 20 }}>
          <SelectList
            setSelected={(val) => setSelectedCollege(val)}
            data={collegeOptions}
            save="value"
          />
        </View>

        <View
          style={{
            fontFamily: Font["Cantarell-regular"],
            fontSize: FontSize.small,
            padding: Spacing * 2,
            backgroundColor: COLORS.lightPrimary,
            borderRadius: Spacing,
            marginBottom: 5,
            borderColor: COLORS.primary,
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            style={{ display: "flex", flexDirection: "row" }}
            onPress={handleImagePicker}
          >
            <Icon
              style={{ color: COLORS.grey, marginRight: 5 }}
              name="image-outline"
              size={20}
            />
            {selectedImage ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    alignSelf: "baseline",
                    color: COLORS.grey,
                    marginRight: 5,
                  }}
                >
                  Selected
                </Text>
                <TouchableOpacity onPress={removeSelectedImage}>
                  <Icon name="close-circle" size={20} color={COLORS.grey} />
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={{ alignSelf: "baseline", color: COLORS.grey }}>
                Add Image
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.animationContainer}>
          <TouchableOpacity onPress={opengithubModal}>
            <LottieView
              ref={animationRef}
              source={require("../../assets/animation_llwnlxs7.json")}
              style={styles.animation}
              autoPlay={true} // Set autoPlay to false
              loop={true}
            />
            <Text style={{ textAlign: "center" }}>Add Link</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={openProjectModal}>
            <Text
              style={{
                color: COLORS.white,
                fontFamily: Font["Cantarell-regular"],
                fontSize: FontSize.large,
                textAlign: "center",
              }}
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isgithubModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Paste Your Github Project Link Here
            </Text>
            <TextInput
              placeholder="Project Link"
              placeholderTextColor={COLORS.dark}
              style={[
                styles.input,
                { width: "100%" }, // Adjust the width as needed
              ]}
              onChangeText={setProjectLink}
              value={projectLink}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={closegithubModal}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* this model will be open when user click on post button */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isProjectStatusVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              🚀 Your project submission request has been forwarded to your
              designated college,{"\n"}
              <Text style={{ fontWeight: "bold" }}>{selectedCollege}</Text>.
              {"\n"}A dedicated mentor will thoroughly review and verify your
              project, ensuring that any instances of plagiarism are identified
              and addressed.
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handlePostButtonPress}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  input: {
    fontFamily: Font["Cantarell-regular"],
    fontSize: FontSize.small,
    padding: Spacing * 2,
    backgroundColor: COLORS.lightPrimary,
    borderRadius: Spacing,
    marginBottom: 5,
    borderColor: COLORS.primary,
  },
  titleinput: {
    fontFamily: Font["poppins-semiBold"],
    fontSize: FontSize.small,
    padding: Spacing * 2,
    backgroundColor: COLORS.lightPrimary,
    borderRadius: Spacing,
    marginBottom: 5,
  },
  characterCount: {
    alignSelf: "flex-end",
    marginRight: Spacing * 1,
    color: COLORS.dark,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: COLORS.primary,
  },
  modalButtonText: {
    color: COLORS.white,
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.medium,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
    elevation: 5, // Add elevation for a card-like effect
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.medium,
  },
  animationContainer: {
    alignItems: "center",
    marginTop: 20,
    flexDirection: "row",
  },
  animation: {
    width: 80,
    height: 80,
  },
  centeredView: {
    position: "absolute", // Set position to absolute
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999, // Higher zIndex
  },
  button: {
    position: "absolute",
    right: 10,
    paddingVertical: 10,
    width: "50%",
    height: "60%",
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
  },
  removeImageButton: {
    marginLeft: 10,
  },
});

export default Projectpost;
