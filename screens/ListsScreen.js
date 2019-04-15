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
} from 'react-native';

export default class ListsScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  _keyExtractor = (item, index) => item.id;
  _renderItem = ({item}) => id = item.id;
  render() {
    const places = this.props.navigation.getParam('places', null);
    console.log(places);
    return (
      <View style={styles.container}>
        <FlatList style = {styles.listContainer}
          data = { places }
          renderItem={({item}) => <Text style = {styles.listText}>{item.key}</Text>}
          extraData={this.props}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 40,
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
