import React, { useState, useEffect } from "react";
import { SafeAreaView, FlatList, StyleSheet } from "react-native";
import { firestore } from "../../Firebase/firebase";
import ProjectSkeleton from "../Skeleton/ProjectSkeleton";
import COLORS from "../../const/colors";
import ResearchCard from "../../Components/ReserachCard";

const Research = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSkeletonLoading, setSkeletonIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore
      .collection("research_posts")
      .onSnapshot((snapshot) => {
        const projectsArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projectsArray);
        setSkeletonIsLoading(false);
      });
    return () => unsubscribe();
  }, []);

  const toggleItemSelection = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  return (
    <SafeAreaView style={{  backgroundColor: COLORS.white }}>
      <FlatList
        data={isSkeletonLoading ? [{ id: "skeleton-" + Date.now() }] : projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          isSkeletonLoading ? (
            <ProjectSkeleton />
          ) : (
            <ResearchCard
            abstract={item.abstract}
            author={item.authors}
            keywords={item.keywords}
            progress={item.progressStatus}
            title={item.projectTitle}
            userName={item.username}
            userwhomai={item.whoami}
            college = {item.usercollege}
            avtar={item.useravtar}
            />
          )
        }
        showsVerticalScrollIndicator={false}
        style={styles.projectCardsContainer} // Use styles instead of style
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  projectCardsContainer: {
    margin: 1,
  },
});

export default Research;
