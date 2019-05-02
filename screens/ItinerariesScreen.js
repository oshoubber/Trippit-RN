
import React from 'react';
import {
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
// import helpers from './TspFunctions'


export default class ItinerariesScreen extends React.Component {
  static navigationOptions = { header: null, };

  // Formats Optimized Itinerary Arrays
  getOptimizedResult(n, r) {
    console.log(r);
    let res = [], kres = [], s = new Set();
    // Add each location in optimized order to new array
    // Use a set to detect duplicates O(1)
    r.forEach(x => {
      let loc = n[x];
      res.push(loc);
      if (s.has(loc))
        loc += " "; // Add space to duplicates to FlatList can render
      s.add(loc);
      kres.push({key: loc});
    });
    // Return the names Array
    return [res, kres];
  }

  render() {
    // Get all data from SearchScreen
    const results = this.props.navigation.getParam('result', null);
    const names = this.props.navigation.getParam('nList', null)
    // const addresses = this.props.navigation.getParam('addresses', null); // Contains addresses of places
    // const hours = this.props.navigation.getParam('hours', null); // Contains popular hours of places

    // Gets optimized list data in list and key: list form
    let data = this.getOptimizedResult(names, results[0].path);
    oNames = data[0];
    oList = data[1];
    console.log(oNames);
    console.log(oList);

    if (results != null) {
      return ( // Return list if array is not empty
        <View style={styles.container}>
          <FlatList style = {styles.listContainer}
            data = { oList }
            renderItem={({item}) => <Text style={styles.listText}>{item.key}</Text>}
            extraData={ this.props.navigation }
            />
        </View>
      );
      
    } else {
      return ( // Show that list is empty
        <View style={styles.container} justifyContent= 'center'>
          <Text style={styles.emptyList}>Add more than one item to your list!</Text>
        </View>
      );
    }
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 40,
  },
  
  emptyList: {
    fontFamily: 'montserratLight',
    fontSize: 30,
    textAlign: 'center',
  },

  listContainer: {
    padding: 8,
  },
  
  listText: {
    fontFamily: 'montserratLight',
    fontSize: 20,
    paddingBottom: 12,   
  }
});