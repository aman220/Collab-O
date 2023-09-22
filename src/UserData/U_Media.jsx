import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, StyleSheet, View, ScrollView } from "react-native";
import { firestore } from "../Firebase/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import COLORS from "../const/colors";
import ProjectCard from "../Components/ProjectCard";

const U_Media = ({ userId }) => {
  const [userProjects, setUserProjects] = useState([]);

  const fetchUserPosts = async () => {
    try {
      const userActivityRef = firestore.collection("users");
      const newRef = userActivityRef
        .doc(userId)
        .collection("userdata")
        .doc("user_projects");
      const userActivityDoc = await newRef.get();

      if (userActivityDoc.exists) {
        const userData = userActivityDoc.data();
        const currentPosts = userData.projects || [];

        const postsPromises = currentPosts.map(async (postId) => {
          const postRef = firestore.collection("projects").doc(postId);
          const postDoc = await postRef.get();
          if (postDoc.exists) {
            return postDoc.data();
          }
          return null;
        });

        // Wait for all post fetch promises to resolve
        const userPostsData = await Promise.all(postsPromises);

        // Filter out any null values (posts that couldn't be found)
        const filteredUserPosts = userPostsData.filter((post) => post !== null);
        setUserProjects(filteredUserPosts);
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          {/* Display user posts */}
          {userProjects.map((item, index) => (
            <ProjectCard
              key={index}
              title={item.title}
              description={item.description}
              userName={item.username}
              avtar={item.avtar}
              collegeName={item.college}
              timeStamp={item.createdAt}
              whoami={item.whoami}
              techStack={item.technologies}
              proimage={item.imageUrl}
              postid={item.id}
              userid={item.userId}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    // padding: 20,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default U_Media;
