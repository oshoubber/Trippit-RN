
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
  static navigationOptions = { title: 'Itineraries', };

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
    const names = this.props.navigation.getParam('nList', null);
    const userinput = this.props.navigation.getParam('textinput', null);
    // const addresses = this.props.navigation.getParam('addresses', null); // Contains addresses of places
    // const hours = this.props.navigation.getParam('hours', null); // Contains popular hours of places

    // Gets optimized list data in list and key: list form
    let data = this.getOptimizedResult(names, results[0].path);
    let time = results[1];

    var input = userinput;
    var a = input.split(':');
    var startingTime = (+a[0]) * 60 * 60 + (+a[1]) * 60;

    //add starting time to the time list
    for(var i = 0; i < time.length; i++){
      time[i][0] += startingTime;
      time[i][1] += startingTime;
    }

    //convert from seconds to hh:mm
    for(var i = 0; i < time.length; i++){
      var start = time[i][0];
      var end = Number(time[i][1]);

      var hs = Math.floor(start / 3600); //hours
      var ms = Math.floor(start % 3600 / 60); //minutes
      var hsms;

      if(hs.toString(10).length == 1 || ms.toString(10).length == 1){
        if(hs.toString(10).length == 1 && ms.toString(10).length == 1){
          hsms = "0" + hs.toString(10) + ':' + '0' + ms.toString(10);
        }
        else if(hs.toString(10).length == 1 && ms.toString(10).length != 1){
          hsms =  '0' + hs.toString(10) + ':' + ms.toString(10); //concat hh:mm
        }
        else if(hs.toString(10).length != 1 && ms.toString(10).length == 1){
          hsms =  hs.toString(10) + ':' + "0" + ms.toString(10); //concat hh:mm
        }
      }
      else hsms =  hs.toString(10) + ':' + ms.toString(10); //concat hh:mm


      var he = Math.floor(end / 3600);
      var me = Math.floor(end % 3600 / 60);
      var heme;
      if(he.toString(10).length == 1 || me.toString(10).length == 1){
        if(he.toString(10).length == 1 && me.toString(10).length == 1){
          heme = "0" + he.toString(10) + ':' + '0' + me.toString(10);
        }
        else if(he.toString(10).length == 1 && me.toString(10).length != 1){
          heme =  '0' + he.toString(10) + ':' + me.toString(10); //concat hh:mm
        }
        else if(he.toString(10).length != 1 && me.toString(10).length == 1){
          heme =  he.toString(10) + ':' + "0" + me.toString(10); //concat hh:mm
        }
      }
      else heme =  he.toString(10) + ':' + me.toString(10); //concat hh:mm

      time[i][0] = hsms;
      time[i][1] = heme;
    }

    formattedTime = [];
    //format time as string
    for(var i = 0; i < time.length; i++){
      var temp = time[i][0] + ' - ' + time[i][1];
      formattedTime.push(temp);
    }
    //console.log(formattedTime);
    //finalTime: formattedTime;

    oNames = data[0];
    oList = data[1];
    formattedList = [];

    //format list
    for(var i = 0; i < oList.length - 1; i++){
      var temp = oList[i].key + ' - ' + oList[i + 1].key;
      formattedList.push(temp);
      if(i == oList.length - 2) break;
      formattedList.push(oList[i + 1].key);
    }
    //console.log(formattedList);
   // finalList: formattedList;
   // console.log("objecT?,: ", finalList);

    //console.log(oNames);
    //console.log(oList);
    //console.log("time params: ", time);
    //console.log("user inputed time: ", userinput);
    
    function timeobject(time){
      this.key = time;
    } 

    function placeobject(place){
      this.key = place;
    }

    //convert everything to an object to display
    timeObjectList = [];
    for(var i = 0; i < formattedTime.length; i++){
      var temp = new timeobject(formattedTime[i]);
      timeObjectList.push(temp);
    }
    console.log(timeObjectList);

    placeObjectList = [];
    for(var i = 0; i < formattedList.length; i++){
      var temp = new placeobject(formattedList[i]);
      placeObjectList.push(temp);
    }
    console.log(placeObjectList);

    if (results != null) {
      return ( // Return list if array is not empty
        <View style={styles.container}>
          <FlatList style = {styles.listContainer}
            data = { placeObjectList }
            renderItem={({item}) => <Text numberOfLines = {1} style={styles.listTextleft}>{item.key}</Text>}
            extraData={ this.props.navigation }
            />
            <FlatList style = {styles.listContainer}
            data = { timeObjectList }
            renderItem={({item}) => <Text numberOfLines = {1} style={styles.listTextright}>{item.key}</Text>}
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
    flexDirection: 'row',
  },
  
  emptyList: {
    fontFamily: 'montserratLight',
    fontSize: 30,
    textAlign: 'center',
  },

  listContainer: {
    padding: 8,
  },
  
  listTextleft: {
    fontFamily: 'montserratLight',
    fontSize: 12,
    paddingBottom: 12,   
    justifyContent: 'flex-start',
    flex: 1,
    width: 250,
  },

  listTextright: {
    fontFamily: 'montserratLight',
    fontSize: 12,
    paddingBottom: 12,  
    justifyContent: 'flex-end',
    flex: 1,
    textAlign: 'right',
  }
});