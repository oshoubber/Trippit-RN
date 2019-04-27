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
        
      }) ;
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
    var visited = Array(places.length + 1).fill(false);
    let finalPath = Array(places.length + 1).fill(0);

    function copyToFinal(curr_path){
      for(var i = 0; i < places.length; i++){
        finalPath[i] = curr_path[i];
      }
      finalPath[places.length] = curr_path[0];
    }

    //O(n) returns minimum edge cost, ending at vertex i
    function firstMin(distanceMatrix, i){
      var min = Number.MAX_VALUE;
      for(var k = 0; k < places.length; k++){
        if(distanceMatrix[i][k] < min && i != k){
          min = distanceMatrix[i][k];
        }
      }
      return min;
    }

    //O(n) returns second minimum edge cost, ending at vertex i
    function secondMin(distanceMatrix, i){
      var first = Number.MAX_VALUE;
      var second = Number.MAX_VALUE;
      for(var j = 0; j < places.length; j++){
        if(i == j) continue;
        if(distanceMatrix[i][j] <= first){
          second = first;
          first = distanceMatrix[i][j];
        }
        else if(distanceMatrix[i][j] <= second && distanceMatrix[i][j] != first){
          second = distanceMatrix[i][j];
        }
      }
      return second;
    }

    function TSPRec(adj, curr_bound, curr_weight, level, curr_path){
      if(level == places.length){
        if(adj[curr_path[level-1]][curr_path[0]] != 0){
          var curr_res = curr_weight + adj[curr_path[level-1]][curr_path[0]];
          if (curr_res < final_res) { 
				    copyToFinal(curr_path); 
				    final_res = curr_res; 
			    } 
		    } 
		  return; 
      }

      for (var i=0; i < places.length; i++) { 
        // Consider next vertex if it is not same (diagonal 
        // entry in adjacency matrix and not visited 
        // already) 
        console.log("level: ", level);
        console.log("i: ", i);
        console.log(visited[i]);
        if (adj[curr_path[level-1]][i] != 0 && visited[i] == false) { 
          var temp = curr_bound; 
          curr_weight += adj[curr_path[level-1]][i]; 
    
          // different computation of curr_bound for 
          // level 2 from the other levels 
          if (level==1) 
            curr_bound -= ((firstMin(adj, curr_path[level-1]) + firstMin(adj, i))/2); 
          else
            curr_bound -= ((secondMin(adj, curr_path[level-1]) + firstMin(adj, i))/2); 
          
          console.log("curr_bougnd: ", curr_bound);
          // curr_bound + curr_weight is the actual lower bound 
          // for the node that we have arrived on 
          // If current lower bound < final_res, we need to explore 
          // the node further 
          if (curr_bound + curr_weight < final_res) { 
            curr_path[level] = i; 
            visited[i] = true; 
    
            // call TSPRec for the next level 
            TSPRec(adj, curr_bound, curr_weight, level+1, curr_path); 
          } 
    
          // Else we have to prune the node by resetting 
          // all changes to curr_weight and curr_bound 
          curr_weight -= adj[curr_path[level-1]][i]; 
          curr_bound = temp; 
    
          // Also reset the visited array 
          visited = Array(places.length + 1).fill(false);
          for (var j=0; j<=level-1; j++) 
            visited[curr_path[j]] = true; 
        } 
      }
      }

      function TSP(adj){
        console.log(adj);
        var curr_path = Array(places.length + 1).fill(-1);
        visited = Array(places.length + 1).fill(false);
        var curr_bound = 0;

        console.log(places.length);
        for(var i = 0; i < places.length; i++){
          curr_bound += (firstMin(adj, i) + secondMin(adj, i));
        }

        curr_bound = (curr_bound & 1) ? curr_bound/2 + 1 : curr_bound/2;
        visited[0] = true;
        curr_path[0] = 0;
        TSPRec(adj, curr_bound, 0, 1, curr_path);

      }
    
    if (places != null) {
      var promise = getDistance(addresses,addresses);
      promise.then(function(result){
        //console.log(result);
        if(places.length > 1){
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

          TSP(durationMatrix);
          console.log("Minimum cost", final_res);
          console.log("Path taken: ");
          console.log(finalPath);
          for(var i = 0; i < finalPath.length; i++){
            console.log(places[finalPath[i]]);
          }
        }
      }, function(err) {
        console.log(err);
      });   

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
