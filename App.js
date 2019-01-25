import React from 'react';
import { StyleSheet, Text, Image, View, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import { Font } from 'expo';

export default class App extends React.Component {
  state = {
    fontLoaded: false,
  };
  
  async componentDidMount() {
    await Font.loadAsync({
      'zillaSlabRegular': require('./assets/fonts/ZillaSlab-Regular.ttf'),
    });

    this.setState({ fontLoaded: true });
  }
  render() {
    return (
      this.state.fontLoaded ? (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={require('./assets/img/icon.png')} style={{width: 250, height: 250}} />
        </View>
        <View style={styles.welconeTextContainer}>
          <Text style={styles.welcomeText1}>Welcome to Trippit!</Text>
        </View>
        <Text style={styles.welcomeText2}>Get started by adding items to your itinerary or looking for attractions in your area.</Text>

        <View style={styles.buttonsContainer}>
          <View style={styles.buttonContainer}>
            <Button title='Add items to your itinerary' buttonStyle={styles.buttonStyle} fontFamily='zillaSlabRegular' fontSize={20} Component={TouchableOpacity}></Button>
          </View>
          <View style={styles.buttonContainer}>
            <Button title='Look for attractions nearby' buttonStyle={styles.buttonStyle} fontFamily='zillaSlabRegular' fontSize={20} Component={TouchableOpacity} ></Button>
          </View>
        </View>
      </View>
      ) : null
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

  welconeTextContainer : {
    marginBottom: 10,
  },

  buttonsContainer: {
    position: 'absolute',
    bottom:0,
    marginBottom: 30,
  },

  buttonContainer: {
    padding: 10,
  },

  // Text Style
  welcomeText1: {
    fontFamily: 'zillaSlabRegular',
    fontSize: 26,
  },

  welcomeText2: {
    fontFamily: 'zillaSlabRegular',
    fontSize: 18,
    color: 'rgba(0, 0, 0, .6)',
    textAlign: 'center',
  },

  // Object Style
  buttonStyle: {
    alignItems:'center',
    justifyContent:'center',
    width:350,
    height:70,
    backgroundColor:'#a3d7e3',
    borderRadius:100,
  }
});
