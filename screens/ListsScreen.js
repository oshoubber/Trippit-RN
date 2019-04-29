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
let final_path;
function getDistance(start, end){
  return new Promise(function(resolve, reject){
    console.log("promise getDistance");
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

function run(matrix, places){
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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//replace later for efficiency
function searchForIndex(address, addresses){
  for(var i = 0; i < addresses.length; i++){
    if(addresses[i] == address) return i;
  }
  return 0;
}

function uniformDistribute(start, end, places) {
  var data = []
  var a;
  for (var i = 0; i < places.length; i++){
    a = getRandomInt(start, end);
    data.push(a);
  }
  return data;
}

//O(n)
function union(path, vertex){
  var P = path;
  for(var i = 0; i < path.path.length; i++){
    if(path.path[i] == vertex)
      return path;
  }
  P.path.push(vertex);
  return P;
}

export default class ListsScreen extends React.Component {
  static navigationOptions = { header: null, };


//get distance from one point to another


greedyTSP(places, addresses){
  return new Promise(function(resolve, reject){
    var utilityArray = uniformDistribute(1800, 3660, places);
    console.log("promise greedyTSP");
    function utility(P){
      var u = 0;
      for(var i = 0; i < P.path.length; i++){
        u += utilityArray[searchForIndex(P.path[i], addresses)];
      }
      return u;
    }
    var empty = [[],[]];
    var P_ = new Path(addresses, 0, 0, empty);


    while(P_.nullFlag != true){
        var P = P_;
        var best_margin = 0;
        P_.nullFlag = true;
        for(var i = 0; i < places.length; i++){
          var currentpath = union(P, addresses[i]);
          var promise = getDistance(currentpath.path, currentpath.path);
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
              //console.log("Duration Matrix length: ", durationMatrix.length);
              //console.log("Duration Matrix: ");
             // console.log(durationMatrix);
              
              var path = run(durationMatrix, places);
              //console.log("pathcost ", path.cost);
              //console.log("P cost ", P.cost);
              //console.log("utility path, ", utility(path));
              //console.log("utility P, ", utility(P));
              //console.log(path.matrix);
              var margin = (utility(path) - utility(P)) / (path.cost - P.cost);
              //console.log("margin", margin);
              //implement budget later
              if(margin > best_margin){
                best_margin = margin;
                P_ = path;
                final_path = P;
                console.log("still in loop", P_);
                P_.nullFlag = false;
              } 
              /*
              console.log("Minimum cost", path.cost);
              console.log("Path taken: ");
              console.log(path.path);
              for(var i = 0; i < path.path.length; i++){
                console.log(places[path.path[i]].key);
              } */
            
          }, function(err) {
            console.log(err);
          });
        }
      }
      resolve(P_);
        
  });
}

 getTimes(P_){
   return new Promise(function(resolve, reject){
    console.log("promise get Times");
    let durationMatrix = P_.matrix;
    var time_start = 0;
    var time_to_vertex = 0;
    var time_list = [];
    for(var i = 0; i < P_.path - 1; i++){
      time_to_vertex = time_start + utilityArray[P_.path[i]] + durationMatrix[P_.path[i]][P_.path[i + 1]];
      //time_to_vertex /= 60;
      var time = [time_start, time_to_vertex];
      time_list.push(time);
      time_start = time_to_vertex;
    }
    resolve(P_);
   });
  
}

  render() {
    // Get all data from SearchScreen
    const places = this.props.navigation.getParam('places', null); // Contains names of places
    const addresses = this.props.navigation.getParam('addresses', null); // Contains addresses of places
    const hours = this.props.navigation.getParam('hours', null); // Contains popular hours of places
    //console.log(places);
    //console.log(addresses);
    //console.log(hours);

    
    

    
    if (places != null) {

      //GreedyTSPCost
      if(places.length > 1){
        this.greedyTSP(places, addresses).then(
          (P_) => {
            console.log("Final: ", P_);
  
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
  }//render
}//export

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
