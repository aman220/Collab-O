import React from 'react'
import COLORS from '../const/colors';
import { TextInput, TouchableOpacity, Image, Text  , Dimensions , SafeAreaView , StyleSheet , View, ScrollView} from "react-native";
const Search = () => {
  return (
    <SafeAreaView style={{flex:1 , backgroundColor:COLORS.white}}> 
    <View style={style.header}>
      <Text>Search</Text>
    </View>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop:25
  }
})

export default Search