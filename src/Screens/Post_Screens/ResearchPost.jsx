import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import COLORS from "../../const/colors";
import Font from "../../const/Font";
import FontSize from "../../const/FontSize";
import Spacing from "../../const/Spacing";
import { firestore } from "../../Firebase/firebase";
import { useNavigation, useRoute } from "@react-navigation/native";

const ResearchPost = () => {
  const [projectTitle, setProjectTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [authorsInput, setAuthorsInput] = useState("");
  const [authors, setAuthors] = useState([]);
  const [methodology, setMethodology] = useState("");
  const [progressStatus, setProgressStatus] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");
  const [keywords, setKeywords] = useState([]);

  const route = useRoute();
  const { useravtar, username, whoami, usercollege } = route.params;

  const maxTitleLength = 100;
  const maxAbstractLength = 500;
  const titleCharacterCount = projectTitle.length;

  const handleTitleChange = (text) => {
    setProjectTitle(text);
  };

  const handleAbstractChange = (text) => {
    setAbstract(text);
  };

  const handleAuthorsInputChange = (text) => {
    setAuthorsInput(text);
    if (text.endsWith(",")) {
      const authorName = text.slice(0, -1).trim();
      if (authorName) {
        setAuthors([...authors, authorName]);
        setAuthorsInput(""); // Clear the input box for a new name
      }
    }
  };

  const handleRemoveAuthor = (index) => {
    const updatedAuthors = [...authors];
    updatedAuthors.splice(index, 1);
    setAuthors(updatedAuthors);
  };

  const handleKeywordsInputChange = (text) => {
    setKeywordsInput(text);
    if (text.endsWith(",")) {
      const keyword = text.slice(0, -1).trim();
      if (keyword) {
        setKeywords([...keywords, keyword]);
        setKeywordsInput("");
      }
    }
  };

  const handleRemoveKeyword = (index) => {
    const updatedKeywords = [...keywords];
    updatedKeywords.splice(index, 1);
    setKeywords(updatedKeywords);
  };

  const handleKeywordsChange = (text) => {
    setKeywords(text);
  };

  const handleMethodologyChange = (text) => {
    setMethodology(text);
  };

  const handleProgressStatusChange = (text) => {
    setProgressStatus(text);
  };

  const handleSubmit = async () => {
    try {
      // Check if required fields are empty
      if (!projectTitle || !abstract || !authors.length || !progressStatus) {
        alert("Please fill in all required fields.");
        return;
      }

      // Create a new document in the 'research_posts' collection in Firestore
      await firestore.collection("research_posts").add({
        projectTitle,
        abstract,
        authors,
        keywords,
        methodology,
        progressStatus,
        useravtar,
        username,
        whoami,
        usercollege,
        //timestamp: firestore.FieldValue.serverTimestamp(), // Add a timestamp
      });

      // Clear the form fields
      setProjectTitle("");
      setAbstract("");
      setAuthorsInput("");
      setAuthors([]);
      setKeywordsInput("");
      setMethodology("");
      setProgressStatus("");
      setKeywords([]);

      alert("Research post submitted successfully!");
    } catch (error) {
      console.error("Error submitting research post:", error);
      alert("An error occurred while submitting the research post.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.header}>
        <View style={styles.accountHeader}>
          <TouchableOpacity>
            <Icon name="arrow-left" size={30} />
          </TouchableOpacity>
          <Text style={styles.accountHeaderText}>Post a Research</Text>
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
          Find the Right Person For Your Research Work Here...{"\n"}Just Post an
          Ongoing Research
        </Text>
      </View>
      <ScrollView style={styles.contentContainer}>
        <TextInput
          placeholder="Project Title"
          placeholderTextColor={COLORS.dark}
          style={[
            styles.inputField,
            projectTitle.length > maxTitleLength && {
              borderColor: "red",
              borderWidth: 2,
            },
          ]}
          onChangeText={handleTitleChange}
        />
        <Text style={styles.characterCount}>
          {titleCharacterCount}/{maxTitleLength} characters
        </Text>

        <TextInput
          placeholder="Abstract"
          placeholderTextColor={COLORS.dark}
          style={styles.inputField}
          multiline
          numberOfLines={4} // Adjust the number of lines as needed
          onChangeText={handleAbstractChange}
        />
        <Text style={styles.characterCount}>
          {abstract.length}/{maxAbstractLength} words
        </Text>

        <View style={styles.authorInputContainer}>
          <Text style={styles.label}>Authors</Text>

          <TextInput
            placeholder="Add authors separated by commas"
            placeholderTextColor={COLORS.dark}
            style={styles.authorInput}
            value={authorsInput}
            onChangeText={handleAuthorsInputChange}
          />
          <View style={styles.authorTags}>
            {authors.map((author, index) => (
              <View style={styles.authorTag} key={index}>
                <Text style={styles.authorText}>{author}</Text>
                <TouchableOpacity onPress={() => handleRemoveAuthor(index)}>
                  <Icon name="close" size={20} color={COLORS.dark} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.authorInputContainer}>
          <Text style={styles.label}>Keywords</Text>

          <TextInput
            placeholder="Add keywords separated by commas"
            placeholderTextColor={COLORS.dark}
            style={styles.authorInput} // You can keep the same style for now
            value={keywordsInput}
            onChangeText={handleKeywordsInputChange}
          />
          <View style={styles.authorTags}>
            {keywords.map((keyword, index) => (
              <View style={styles.authorTag} key={index}>
                <Text style={styles.authorText}>{keyword}</Text>
                <TouchableOpacity onPress={() => handleRemoveKeyword(index)}>
                  <Icon name="close" size={20} color={COLORS.dark} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <TextInput
          placeholder="Progress Status"
          placeholderTextColor={COLORS.dark}
          style={styles.inputField}
          onChangeText={handleProgressStatusChange}
        />

        {/* Add more input fields and components as needed for your research posting form */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
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
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputField: {
    fontFamily: Font["poppins-semiBold"],
    fontSize: FontSize.small,
    padding: Spacing * 2,
    backgroundColor: COLORS.lightPrimary,
    borderRadius: Spacing,
    marginBottom: 20,
  },
  characterCount: {
    alignSelf: "flex-end",
    marginRight: Spacing * 2,
    color: COLORS.dark,
    marginBottom: 10,
  },
  label: {
    fontFamily: Font["poppins-semiBold"],
    fontSize: FontSize.small,
    marginBottom: 5,
  },
  authorInputContainer: {
    marginBottom: 10,
  },
  authorInput: {
    fontFamily: Font["poppins-semiBold"],
    fontSize: FontSize.small,
    padding: Spacing * 2,
    backgroundColor: COLORS.lightPrimary,
    borderRadius: Spacing,
    marginBottom: 10,
  },
  authorTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  authorTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "lightgreen",
    padding: 10,
    borderRadius: Spacing,
    marginBottom: 10,
    marginRight: 10,
  },
  authorText: {
    fontFamily: Font["poppins-semiBold"],
    fontSize: FontSize.small,
    marginRight: 5,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: Spacing,
    alignItems: "center",
  },
  submitButtonText: {
    color: COLORS.white,
    fontFamily: Font["poppins-semiBold"],
    fontSize: FontSize.medium,
  },
});

export default ResearchPost;
