import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { firestore } from "../../Firebase/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Swipeable } from "react-native-gesture-handler";
import Notification from "../../Components/Notification";
import COLORS from "../../const/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const CollegeNoti = () => {
  const [requests, setRequests] = useState([]);
  const [uid, setUid] = useState(null); // Declare uid using useState

  useEffect(() => {
    const getUid = async () => {
      const userUid = await AsyncStorage.getItem("@userUid");
      if (userUid != null) {
        setUid(userUid);
      }
    };

    getUid();

    const unsubscribe = firestore
      .collection("Requests")
      .where("reciverId", "==", uid)
      .onSnapshot(
        (snapshot) => {
          const requestsData = [];
          snapshot.forEach((doc) => {
            const requestData = doc.data();
            requestData.id = doc.id; // Add an 'id' property to uniquely identify each item
            requestsData.push(requestData);
          });
          setRequests(requestsData);
        },
        (error) => {
          console.error("Firestore Error:", error);
        }
      );
    return () => {
      unsubscribe();
    };
  }, [uid]);

  const handleDeleteItem = async (itemId) => {
    try {
      // Remove the item from the 'requests' state
      const updatedRequests = requests.filter((item) => item.id !== itemId);
      setRequests(updatedRequests);

      // Delete the item from Firebase
      await firestore.collection("Requests").doc(itemId).delete();
    } catch (error) {
      console.error("Error deleting item from Firebase:", error);
      // If there's an error, you may want to handle it accordingly (e.g., show an error message).
    }
  };

  const renderSwipeableItem = ({ item }) => {
    return (
      <Swipeable
        renderRightActions={() => (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteItem(item.id)}
          >
            <Icon name="delete-alert-outline" size={25} />
          </TouchableOpacity>
        )}
      >
        <View style={styles.swipeableItem}>
          <Notification
            whyjoin={item.whyJoin}
            name={item.name}
            college={item.college}
            avtar={item.avtar}
            senderId={item.senderId}
            reciverId={item.reciverId}
          />
        </View>
      </Swipeable>
    );
  };

  return (
    <SafeAreaView>
      <View>
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={renderSwipeableItem}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  swipeableItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderColor: "#ccc",
  },
  deleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
});

export default CollegeNoti;
