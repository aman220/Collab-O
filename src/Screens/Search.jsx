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
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import FeatherIcon from "react-native-vector-icons/Feather";
import ProjectCard from "../Components/ProjectCard";
import { firestore } from "../Firebase/firebase";
import COLORS from "../const/colors";
import ProjectSkeleton from "./Skeleton/ProjectSkeleton";

const Search = ({ username, useravtar }) => {
  const [searchText, setSearchText] = useState("");
  const [focusAnim] = useState(new Animated.Value(1));
  const [projects, setProjects] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSkeletonLoading, setSkeletonIsLoading] = useState(true);

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

  const handleSearch = () => {
    console.log("Searching for:", searchText);
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
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white }}>
      <View style={style.header}>
        <Animated.View
          style={[style.searchSection, { transform: [{ scale: focusAnim }] }]}
        >
          <Icon
            style={style.searchIcon}
            name="search"
            size={20}
            color={COLORS.grey}
          />
          <TextInput
            style={style.searchInput}
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
      {/* Selection section */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={style.selectableItems}
      >
        <View style={style.selectableItemsList}>
          {["React Native", "Android", "MERN", "Java", "Python", "Django"].map(
            (item) => (
              <TouchableOpacity
                key={item}
                style={[
                  style.selectableItem,
                  selectedItems.includes(item) && style.selectedItem,
                ]}
                onPress={() => toggleItemSelection(item)}
              >
                <Text style={style.selectableItemText}>{item}</Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </ScrollView>
      {/* Project Cards */}
      <FlatList
        data={isSkeletonLoading ? [{ id: "skeleton" }] : projects}
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
        style={style.projectCardsContainer}
      />
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
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
