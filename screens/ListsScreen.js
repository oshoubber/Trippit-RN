
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

let results;
let answer;
let resultsLength;
let final_res = Number.MAX_VALUE;

//get distance from one point to another
function getDistance(start, end){
  return new Promise(function(resolve, reject){
    //console.log("getting Distance");
    var distance = require('react-native-google-matrix');
      distance.get(
        {
          origins: start,
          destinations: end
        },
      function(err, data) {
        if(err) reject(err);
        //console.log(data);
        results = data;
        //console.log("results length: " + results.length);
        //console.log(results);
        resultsLength = results.length;
        resolve(data); 
        
      }); 
    });
}


export default class ListsScreen extends React.Component {
  static navigationOptions = { header: null, };

  render() {
    // Get all data from SearchScreen
    const places = this.props.navigation.getParam('places', null); // Contains names of places
    const addresses = this.props.navigation.getParam('addresses', null); // Contains addresses of places
    const hours = this.props.navigation.getParam('hours', null); // Contains popular hours of places
    //console.log(places);
    //console.log(addresses);
    //console.log(hours);
    if (places != null) {
      
      return ( // Return list if array is not empty
        <View style={styles.container}>
          <FlatList style = {styles.listContainer}
            data = { places }
            renderItem={({item}) => <Text style={styles.listText}>{item.key}</Text>}
            extraData={ this.props.navigation }
            />
            <Button
          title="Go to Itineraries!"
          onPress={() => this.props.navigation.navigate('ItinerariesScreen')}
          />
        </View>
      );
    } else {
      return ( // Show that list is empty
        <View style={styles.container} justifyContent= 'center'>
          <Text style={styles.emptyList}>No items in your list!</Text>
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