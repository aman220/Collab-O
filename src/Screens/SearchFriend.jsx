import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Font from "../const/Font";
import COLORS from "../const/colors";
import Spacing from "../const/Spacing";
import FontSize from "../const/FontSize";
import { useNavigation } from "@react-navigation/native";
import { firebase, firestore, storage } from "../Firebase/firebase";

const SearchStudent = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchRollNo, setSearchRollNo] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const styles = StyleSheet.create({
    container: {
      marginTop: 10,
      flex: 1,
      backgroundColor: COLORS.light,
    },
    inputContainer: {
      backgroundColor: COLORS.white,
      borderRadius: Spacing * 2,
      paddingHorizontal: Spacing * 2.5,
      paddingVertical: Spacing,
      marginHorizontal: Spacing * 2,
      marginBottom: Spacing * 2,
      flexDirection: "row",
      alignItems: "center",
      marginTop:5
    },
    input: {
      flex: 1,
      fontSize: FontSize.base,
      fontFamily: Font["poppins-regular"],
      color: COLORS.text,
      marginLeft: Spacing * 2,
    },
    card: {
      backgroundColor: COLORS.white,
      margin: 10,
      padding: 5,
      borderRadius: Spacing * 2,
    },
    cardHeader: {
      flexDirection: "row",
      gap: 4,
    },
    cardBody: {
      flex: 1,
    },
    cardText: {
      fontFamily: Font["poppins-regular"],
      color: COLORS.textGray,
    },
  });

  const fetchStudents = async () => {
    try {
      const userRef = firestore.collection("users");
      const userSnapshot = await userRef.get();
      const studentsList = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFilteredData(studentsList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students: ", error);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const filtered = filteredData.filter(
      (student) =>
        (searchQuery === "" ||
          student.fullName.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (searchEmail === "" ||
          student.email.toLowerCase().includes(searchEmail.toLowerCase())) &&
        (searchRollNo === "" || student.rollNumber.includes(searchRollNo)) &&
        (searchPhone === "" || student.phone.includes(searchPhone))
    );
    setFilteredData(filtered);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, searchEmail, searchRollNo, searchPhone]);

  const RenderProfileCard = ({ student }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image
          source={{ uri: student.avatar }}
          style={{ width: 90, height: 90, borderRadius: 50 }}
        />
        <View style={styles.cardBody}>
          <Text style={{ fontFamily: Font["poppins-bold"] }}>
            {student.fullName}
          </Text>
          <Text
            style={{
              fontFamily: Font["poppins-regular"],
              color: COLORS.primary,
            }}
          >
            {student.whoami}
          </Text>
          <Text style={styles.cardText}>{student.college}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginRight: 5,
            }}
          >
            <Text style={styles.cardText}>{student.desc}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <View style={{ backgroundColor: COLORS.white }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginHorizontal: Spacing * 2,
                marginBottom: Spacing * 2,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.light,
                  width: 50,
                  height: 50,
                  borderRadius: Spacing * 2,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => navigation.goBack()}
              >
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color={COLORS.textGray}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: FontSize.lg,
                  fontFamily: Font["poppins-semiBold"],
                  color: COLORS.text,
                }}
              >
                Search Student
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.light,
                  width: 50,
                  height: 50,
                  borderRadius: Spacing * 2,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="heart-outline"
                  size={30}
                  color={COLORS.textGray}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={24} color={COLORS.text} />
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor={COLORS.textGray}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>

          <FlatList
            data={filteredData}
            renderItem={({ item }) => <RenderProfileCard student={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default SearchStudent;
