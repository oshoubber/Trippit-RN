
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
      return new Promise(resolve => {
        var temp = perms1.perms[index1];
        perms1.perms[index1] = perms1.perms[index2];
        perms1.perms[index2] = temp;
        resolve(perms1);
      });
    }


    function run(matrix){
      return new Promise(resolve => {
        var p = new Path([], Number.MAX_VALUE, 0, matrix);
        var perms = new Perms(places.length);
        var promise = init_perms(perms);
        promise.then((perms) =>{
          var promise2 = permutate(perms, 1, places.length - 1, p);
          promise2.then((p) =>{
            resolve(p);
          });
        });
      });
      
    }

    function init_perms(perms){
      return new Promise(resolve =>{
        for(var i = 0; i < perms.perms.length - 1; i++){
          perms.perms[i] = i;
        }
        perms.perms[perms.length - 1] = 0;
        resolve(perms);
      });
    }

    function permutate(perms, begin, end, p, initbegin, initi, currentperm){
      return new Promise(resolve => {
        if(begin == end){
          var promise = update_if_better(perms, p);
          promise.then((p) => {
            var promiseswap = swap(perms, initbegin, initi);
            promiseswap.then((perms) => {
              resolve(p);
            });
          });
        } else{
          var promiseHelp = permutationHelper(perms, begin, end, p);
          promiseHelp.then( (result) => {
            //console.log(result);
            resolve(p);
          });
        }
      });
    }

    function permutationHelper(perms, begin, end, p, initbegin, initi){
      return new Promise(resolve => {
        for(var i = begin; i <= end; i++){
          var promise2 = swap(perms, begin, i);
          promise2.then((perms) =>{
            var promise3 = permutate(perms, begin + 1, end, p, begin, i);
          });
        }
        resolve(p);
      });
    }

    function update_if_better(perms, p){
      return new Promise(resolve => {
        var promise = get_cost(perms, p);
        promise.then((acc_cost) =>{
          console.log("current perm: ", perms);
          if(acc_cost < p.cost){
            p.path = perms.perms;
            p.cost = acc_cost;
          }
          resolve(p);
        });
      });    
    }

    function get_cost(perms, p){
      return new Promise(resolve => {
        var acc_cost = 0;
        for(var i = 0; i + 1 < perms.perms.length;++i){
          acc_cost += p.matrix[perms.perms[i]][perms.perms[i+1]];
        }
        resolve(acc_cost);
      });
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
          console.log(durationMatrix);

          var path = run(durationMatrix);
          path.then((p) =>{
            console.log("Minimum cost", p.cost);
            console.log("Path taken: ");
            console.log(p.path);
            for(var i = 0; i < p.path.length; i++){
              console.log(places[p.path[i]].key);
            }   
          });
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