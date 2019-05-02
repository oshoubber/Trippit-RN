import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Button,
} from 'react-native';

export default class ListsScreen extends React.Component {
  static navigationOptions = { header: null, };

  render() {
    // Get all data from SearchScreen
    const places = this.props.navigation.getParam('places', null); // Contains names of places
    const addresses = this.props.navigation.getParam('addresses', null); // Contains addresses of places
    const hours = this.props.navigation.getParam('hours', null); // Contains popular hours of places
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
              onPress={() => this.props.navigation.navigate('ItinerariesScreen', {places: places, addresses: addresses, hours: hours})}
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