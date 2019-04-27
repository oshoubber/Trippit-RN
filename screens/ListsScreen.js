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

let results;
let resultsLength;
let final_res = Number.MAX_VALUE;

//get distance from one point to another
function getDistance(start, end){
  return new Promise(function(resolve, reject){
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
        resolve(resultsLength);
        
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

    function createGraph(){
      this.name = places;
      for(var i = 0; i < places.length; i++){
        this.name[i] = places[i].key;
      }
      this.addresses = addresses;
      this.hours = hours;

      console.log(this.name);
      console.log(this.addresses);
      console.log(this.hours);
    }

    function Path(path, cost, utility, matrix){
      this.path = path;
      this.cost = cost;
      this.utility = utility; 
      this.matrix = matrix;
      this.nullFlag = false;
    }

    function Perms(length){
      this.perms = Array(length + 1).fill(0);
    }

    function swap(perms1, index1, index2){
      var temp = perms1.perms[index1];
      perms1.perms[index1] = perms1.perms[index2];
      perms1.perms[index2] = temp;
    }


    function run(matrix){
      var p = new Path([], Number.MAX_VALUE, 0, matrix);
      var perms = new Perms(places.length);
      init_perms(perms);
      permutate(perms, 1, places.length - 1, p);
      return p;
    }

    function init_perms(perms){
      for(var i = 0; i < perms.perms.length - 1; i++){
        perms.perms[i] = i;
      }
      perms.perms[perms.length - 1] = 0;
    }

    function permutate(perms, begin, end, p){
      if(begin == end){
        update_if_better(perms, p);
      } else{
        for(var i = begin; i <= end; i++){
          swap(perms, begin, i);
          permutate(perms, begin + 1, end, p);
          swap(perms, begin, i);
        }
      }
    }

    function update_if_better(perms, p){
      var updated_cost = get_cost(perms, p);
      if(updated_cost < p.cost){
        p.path = perms.perms;
        p.cost = updated_cost;
      }
    }

    function get_cost(perms, p){
      var acc_cost = 0;
      for(var i = 0; i + 1 < perms.perms.length;++i){
        acc_cost += p.matrix[perms.perms[i]][perms.perms[i+1]];
      }
      return acc_cost;
    }

    
    if (places != null) {

      //GreedyTSPCost
      if(places.length > 1){
        var promise = getDistance(addresses,addresses);
        promise.then(function(result){
        //console.log(result);
          let durationMatrix = [];
          let currentRow = [];
          for(var j = 0; j < results.length; j += places.length){
            //console.log(results[j]);
            currentRow = results.slice(j, j + places.length);
            durationMatrix.push(currentRow);
          }
          for(var i = 0; i < durationMatrix.length; i++){
            for(var j = 0; j < durationMatrix.length; j++){
              durationMatrix[i][j] = parseInt(durationMatrix[i][j].durationValue);
            }
          }
          console.log("Duration Matrix length: ", durationMatrix.length);
          console.log("Duration Matrix: ");
         // console.log(durationMatrix);

          var path = run(durationMatrix);
          console.log("Minimum cost", path.cost);
          console.log("Path taken: ");
          console.log(path.path);
          for(var i = 0; i < path.path.length; i++){
            console.log(places[path.path[i]].key);
          }




        
      }, function(err) {
        console.log(err);
      }); 
      }  

      return ( // Return list if array is not empty
        <View style={styles.container}>
          <FlatList style = {styles.listContainer}
            data = { places }
            renderItem={({item}) => <Text style={styles.listText}>{item.key}</Text>}
            extraData={ this.props.navigation }
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
