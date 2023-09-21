import React, { useState, useEffect } from "react";
import { SafeAreaView, FlatList, StyleSheet } from "react-native";
import { firestore } from "../../Firebase/firebase";
import ProjectCard from "../../Components/ProjectCard";
import ProjectSkeleton from "../Skeleton/ProjectSkeleton";
import COLORS from "../../const/colors";

const Project = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSkeletonLoading, setSkeletonIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore
      .collection("projects")
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
    <SafeAreaView style={{ backgroundColor: COLORS.white }}>
      <FlatList
        data={isSkeletonLoading ? [{ id: "skeleton-" + Date.now() }] : projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          isSkeletonLoading ? (
            <ProjectSkeleton />
          ) : (
            <ProjectCard
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

export default Project;
