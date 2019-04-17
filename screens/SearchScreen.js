/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');
const homePlace = {description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
let addresses = [];
let names = [];
let fsID = '';
let params = [];
let foursquare;

export default class SearchScreen extends React.Component{
  static navigationOptions = { header: null, };
  render() {
    return (
      <View style={styles.container}>
        <GooglePlacesAutocomplete
          placeholder='Search'
          minLength={2} // minimum length of text to search
          autoFocus={false}
          fetchDetails={true}
          onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
          // console.log(data);
          // console.log(details);
          // Store addresses and names
          addresses.push(details.formatted_address);
          names.push({ key: details.name });
          this.setAPISettings();
          this.getID()
            .then((id) => { 
              console.log(id);
            });
          // Send names array to Lists screen
          this.props.navigation.navigate('ListsScreen', {places: names});
        }}
        getDefaultValue={() => {
          return ''; // text input default value
        }}
        query={{
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: 'AIzaSyBSeAjau2wzgX8w26_EZ7lznh-mwKKThVc',
          language: 'en', // language of the results
          types: ['establishment', 'cities'], // default: 'geocode'
        }}
        styles={{
          description: {
            fontWeight: 'bold',
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
        }}
        
        currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
        currentLocationLabel="Current location"
        nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
        GoogleReverseGeocodingQuery={{
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
        }}
        GooglePlacesSearchQuery={{
          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
          rankby: 'distance',
          types: 'food',
        }}
        GooglePlacesDetailsQuery={{
          // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
          fields: 'formatted_address',
        }}
        
        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
        predefinedPlaces={[homePlace]}
        predefinedPlacesAlwaysVisible={true}
        />
      </View>
    );
  }

  setAPISettings() {
    foursquare = require('react-native-foursquare-api')({
      clientID: 'QNVY5NQTV2NNMBGU2OOKFIT5HNA1UL3TSI3TODNEI2KS5KJA',
      clientSecret: 'AGXX0YGUGXNJXPL32GS3DNWA0DZAM1BVTLUF2UYR2RKC1EI2',
      style: 'foursquare', // default: 'foursquare'
      version: '20180323' //  default: '20180323'
    });
    
    params = {
      'limit': 1,
      near: addresses[addresses.length-1],
    };
  }

// https://api.foursquare.com/v2/venues/4abd4923f964a520718920e3/hours?client_id=QNVY5NQTV2NNMBGU2OOKFIT5HNA1UL3TSI3TODNEI2KS5KJA&client_secret=AGXX0YGUGXNJXPL32GS3DNWA0DZAM1BVTLUF2UYR2RKC1EI2&v=20180323&limit=1
 async getHours(id) {
    let hours = await fetch(`https://api.foursquare.com/v2/venues/${id}/hours?client_id=QNVY5NQTV2NNMBGU2OOKFIT5HNA1UL3TSI3TODNEI2KS5KJA&client_secret=AGXX0YGUGXNJXPL32GS3DNWA0DZAM1BVTLUF2UYR2RKC1EI2&v=20180323&limit=1`);
    return hours;
  }
  
  async getID() {
    await foursquare.venues.getVenues(params)
      .then ((venues)  => {
    		return venues.response.venues[0].id;
    	})
      .catch(function(err){
        console.log(err);
      });
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 40,
  },
});