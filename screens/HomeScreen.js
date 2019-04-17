import React from 'react';
import { 
  StyleSheet, 
  Text, 
  Image, 
  View, 
  TouchableOpacity 
} from 'react-native';
import { Button } from 'react-native-elements';

// Define RNE button for more customizability
const OButton = props => <Button Component={TouchableOpacity} buttonStyle={styles.buttonStyle} titleStyle={styles.buttonTitle} {...props} />;

export default class HomeScreen extends React.Component {
  static navigationOptions = { header: null, };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={require('../assets/img/icon.png')} style={{width: 250, height: 250}} />
        </View>

        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeText1}>Welcome to Trippit!</Text>
        </View>
        <Text style={styles.welcomeText2}>Get started by adding items to your 
                                          itinerary or looking for attractions in your area.</Text>

        <View style={styles.buttonsContainer}>
          <View style={styles.buttonContainer}>
            <OButton icon={{name: 'location-on', color: "white"}} 
                     title='Add items to your itinerary'></OButton>
          </View>
          <View style={styles.buttonContainer}>
            <OButton icon={{name: 'near-me', color: "white"}} 
                     title='Look for attractions nearby'></OButton>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  imageContainer : {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top:0,
    marginTop: 40,
  },

  welcomeTextContainer : {
    marginBottom: 20,
  },

  buttonsContainer: {
    position: 'absolute',
    bottom:0,
    marginBottom: 30,
  },

  buttonContainer: {
    padding: 10,
  },

  buttonTitle: {
    fontFamily: 'montserratLight',
    fontSize: 18,
  },

  // Text Style
  welcomeText1: {
    fontFamily: 'montserratLight',
    fontSize: 24,
  },

  welcomeText2: {
    fontFamily: 'montserratLight',
    fontSize: 16,
    color: 'rgba(0, 0, 0, .6)',
    textAlign: 'center',
    padding: 4,
  },

  // Object Style
  buttonStyle: {
    shadowColor: 'rgba(0, 0, 0, 0.4)', // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, //Android
    alignItems:'center',
    justifyContent:'center',
    width:350,
    height:70,
    backgroundColor:'#80cbc4',
    borderRadius:100,
  }

});
