import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, ScrollView } from 'react-native';
import COLORS from '../const/colors';
import Omeg from '../Components/Omeg';
import { firestore } from '../Firebase/firebase';
import AsyncStorage from "@react-native-async-storage/async-storage";

const U_Posts = () => {
  const [userPosts, setUserPosts] = useState([]);
  
  const fetchUserPosts = async () => {
    try {
      const userID = await AsyncStorage.getItem("@userUid");
      const userActivityRef = firestore.collection("users");
      const newRef = userActivityRef
        .doc(userID)
        .collection("userdata")
        .doc("user_activity");
        const userActivityDoc = await newRef.get();
        const userData = userActivityDoc.data();
        console.log(userData)

      if (userActivityDoc.exists) {
        const userData = userActivityDoc.data();
        const currentPosts = userData.posts || [];

        const postsPromises = currentPosts.map(async (postId) => {
          const postRef = firestore.collection('posts').doc(postId);
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

        setUserPosts(filteredUserPosts);
        console.log(filteredUserPosts)
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
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
          {userPosts.map((post, index) => (
            <Omeg
              key={index} // Ensure each post has a unique key
              username={post.userfullName}
              avtar={post.userfullavtar}
              content={post.text}
              image={post.imageUrl}
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
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
  },
});

export default U_Posts;
