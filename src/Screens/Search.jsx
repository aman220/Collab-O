import React, { useState, useEffect } from "react";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Text,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import FeatherIcon from "react-native-vector-icons/Feather";
import ProjectCard from "../Components/ProjectCard";
import { firestore } from "../Firebase/firebase";
import COLORS from "../const/colors";
import ProjectSkeleton from "./Skeleton/ProjectSkeleton";
import ProjectTabs from "../ProjectTabs";

const Search = ({ username, useravtar }) => {
  const [searchText, setSearchText] = useState("");
  const [focusAnim] = useState(new Animated.Value(1));
  const [projects, setProjects] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isSkeletonLoading, setSkeletonIsLoading] = useState(true);
  const [showProjectTabs, setShowProjectTabs] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [technologyCounts, setTechnologyCounts] = useState({});

  const handleSearch = () => {
    // Filter the projects based on the search query
    const filtered = projects.filter((project) =>
      project.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  const handleFocus = () => {
    Animated.timing(focusAnim, {
      toValue: 1.05,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const toggleItemSelection = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem !== item)
      );
      setSelectedFilter(null); // Clear the selected filter when a filter is deselected
    } else {
      setSelectedItems([item]);
      setSelectedFilter(item);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectCollection = firestore.collection("projects");
        const snapshot = await projectCollection.get();
  
        const projectData = [];
        snapshot.forEach((doc) => {
          const project = {
            title: doc.data().title,
            technology: doc.data().technologies || [], // Default to an empty array
          };
          projectData.push(project);
        });
        setProjects(projectData);
        setSkeletonIsLoading(false);
  
        // Calculate the counts for each technology
        const counts = projectData.reduce((acc, project) => {
          const technologies = project.technology || ['Unknown']; // Use 'Unknown' if no technology is specified
          technologies.forEach((technology) => {
            acc[technology] = (acc[technology] || 0) + 1;
          });
          return acc;
        }, {});
  
        setTechnologyCounts(counts);
      } catch (error) {
        console.error("Error fetching projects: ", error);
        // Handle the error appropriately in your UI (e.g., show an error message)
      }
    };
  
    fetchData(); // Call the fetchData function to fetch and process the data
  }, []);
  

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white }}>
      <View style={styles.header}>
        <Animated.View
          style={[styles.searchSection, { transform: [{ scale: focusAnim }] }]}
        >
          <Icon
            style={styles.searchIcon}
            name="search"
            size={20}
            color={COLORS.grey}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor={COLORS.grey}
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSubmitEditing={handleSearch}
          />
          {searchText !== "" && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Icon name="close-circle" size={20} color={COLORS.grey} />
            </TouchableOpacity>
          )}
          <TouchableOpacity>
            <FeatherIcon name="filter" size={20} color={COLORS.grey} />
          </TouchableOpacity>
        </Animated.View>
      </View>
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.selectableItems}
        >
          <View style={styles.selectableItemsList}>
            {[
              "React Native",
              "Android",
              "MERN",
              "Java",
              "Python",
              "Django",
            ].map((technology) => (
              <TouchableOpacity
                key={technology}
                style={[
                  styles.selectableItem,
                  selectedItems.includes(technology) && styles.selectedItem,
                ]}
                onPress={() => toggleItemSelection(technology)}
              >
                <Text style={styles.selectableItemText}>
                  {technology}: {technologyCounts[technology] || 0}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        {/* Selection section */}
      </View>
      <ProjectTabs
        selectedFilter={selectedFilter}
        projects={filteredProjects}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
  },
  searchSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1,
    backgroundColor: COLORS.lightPrimary,
  },
  searchIcon: {
    padding: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.grey,
  },
  selectableItems: {
    padding: 2,
    height: 50,
    marginBottom: 10,
  },
  selectableItemsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: 10,
  },
  selectableItem: {
    padding: 10,
    paddingHorizontal: 20,
    margin: 4,
    borderRadius: 20,
    backgroundColor: COLORS.lightPrimary,
  },
  selectedItem: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
  },
  selectableItemText: {
    color: COLORS.grey,
  },
  projectCardsContainer: {
    margin: 1,
  },
});

export default Search;
