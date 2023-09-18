import React from 'react'
import { View, StyleSheet, Text ,TouchableOpacity,} from "react-native";
import { SafeAreaView } from "react-native";
import Notification from '../../Components/Notification';

const CollegeNoti = () => {
  return (
    <SafeAreaView>
        <View>
            <Notification/>
        </View>
    </SafeAreaView>
  )
}

export default CollegeNoti
