import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import { Button } from 'react-native-elements';
import TimePicker from "react-native-24h-timepicker";


let results;
let resultsLength;
let utilityArray;
const OButton = props => <Button Component={TouchableOpacity} buttonStyle={styles.oButtonStyle} titleStyle={styles.oButtonTitle} {...props} />;
const TButton = props => <Button Component={TouchableOpacity} buttonStyle={styles.tButtonStyle} titleStyle={styles.tButtonTitle} {...props} />;

export default class ListsScreen extends React.Component {
  static navigationOptions = { title: 'Lists', };

  constructor(props) {
    super(props);
    this.state = {
      time: '00:00',
      btnTitle: 'Set Departure Time: 00:00',
      animating: false,
    };
  }

  // Time Picker
  onCancel() {
    this.TimePicker.close();
  }

  onConfirm(hour, minute) {
    this.setState({ time: `${hour}:${minute}` });
    this.changeDepTime(`${hour}:${minute}`)
    this.TimePicker.close();
  }

  render() {
    // Get all data from SearchScreen
    const places = this.props.navigation.getParam('places', null); // Contains names of places
    const addresses = this.props.navigation.getParam('addresses', null); // Contains addresses of places
    const hours = this.props.navigation.getParam('hours', null); // Contains popular hours of places
    const nList = this.props.navigation.getParam('nList', null);

    function utility(P, places, addresses){
      var u = 0;
      for(var i = 0; i < P.path.length; i++){
        u += utilityArray[searchForIndex(P.path[i], addresses)];
      }
      return u;
    }

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    function searchForIndex(address, addresses){
      for(var i = 0; i < addresses.length; i++){
        if(addresses[i] == address) return i;
      }
      return 0;
    }

    function linearsearch(P, element){
      return new Promise((resolve) => {
        for(var i = 0; i < P.path.length; i++){
          if(P.path[i] == element) resolve(true);
        }
        resolve(false);
      });
    }
    
    function uniformDistribute(start, end, places) {
      return new Promise(function(resolve, reject) {
        var data = []
        var a;
        for (var i = 0; i < places.length; i++){
          a = getRandomInt(start, end);
          data.push(a);
        }
        resolve(data);
      });
    }
    
    //O(n)
    function union(path, vertex){
      return new Promise(function(resolve, reject){
        var P = path;
        P.path.push(vertex);
        resolve(P);
      });
    } 

    function createMatrix(data, currentpath){
      return new Promise(function(resolve, reject){
        let durationMatrix = [];
        let currentRow = [];
        for(var j = 0; j < data.length; j += currentpath.path.length){
          currentRow = data.slice(j, j + currentpath.path.length);
          durationMatrix.push(currentRow);
        }
        for(var i = 0; i < durationMatrix.length; i++){
          for(var j = 0; j < durationMatrix[0].length; j++){
            durationMatrix[i][j] = parseInt(durationMatrix[i][j].durationValue);
          }
        }
        resolve(durationMatrix);
      });
    }

    function greedyTSP(places, addresses){
      return new Promise(function(resolve){
      var empty = [[],[]];
      var initial = addresses[0];
      var startingarray = [];
      startingarray.push(initial);
      var P_ = new Path(startingarray, 0, 0, empty);

      var copyofaddress = addresses;
      var promise = greedyTSPHelper(P_, places, copyofaddress);
      promise.then((result) =>{
          var time_start = 0;
          var time_to_vertex = 0;
          var time_list = [];
          for(var i = 0; i < result.path.length - 1; i++){
            time_to_vertex = time_start + result.matrix[result.path[i]][result.path[i + 1]];
            //console.log("computing");
            var time = [];
            time.push(time_start);
            time.push(time_to_vertex);
            time_list.push(time);
            var time_spent = time_to_vertex + utilityArray[result.path[i]];
            var time2 = [];
            time2.push(time_to_vertex);
            time2.push(time_spent);
            if(i == result.path.length - 2) break;
            time_list.push(time2);
            time_start = time_spent;
          }
          //console.log("time intervals:", time_list);
          resolve([result, time_list])
      });
      });
      
    }

    function greedyTSPHelper(P_, places, addresses){
      return new Promise(function(resolve, reject){
        //console.log("TSP helper");
        var P = P_;
        var best_margin = 0;
        P_.nullFlag = true;
        var promise = forLoop(P, best_margin, P_, places, addresses);
        promise.then((result) =>{
          resolve(result);
        });
      });
    }

    function forLoop(P, best_margin, P_, places, addresses){
        return new Promise((resolve) =>{
          var requests = 0;
          for(let value of addresses){  
            ++requests;
            var b = linearsearch(P, value);
            b.then((found) =>{
              if(found){return};
              //console.log("iterating");
              var p = union(P, value);
              p.then((joined) =>{
                var currentpath = joined;
                var promise = getDistance(currentpath.path, currentpath.path);
                promise.then(
                (result)=>{
                  var promise2 = createMatrix(result, currentpath);
                  promise2.then((durationMatrix) => {
                    //console.log(durationMatrix);
                    var path = run(durationMatrix, currentpath);//run TSP
                    path.then((p) =>{
                      var margin = (utility(p, places, addresses) - utility(P, places, addresses)) / (p.cost - P.cost);
                      if(margin > best_margin){
                        best_margin = margin;
                        P_ = p;
                        P_.utility = utility(p, places, addresses);
                        P_.matrix = durationMatrix;
                        //console.log("still in loop", P_);
                        P_.nullFlag = false;
                      }
                      if(requests == addresses.length) resolve(P_);
                    });
                  });
                  });//promise
              });
            });    
          }
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
      this.perms = Array(length - 1).fill(0);
    }

    function run(matrix, currentpath){
      return new Promise(resolve => {
        //console.log("run");
        var p = new Path([], Number.MAX_VALUE, 0, matrix);
        var perms = new Perms(currentpath.path.length);
        var promise = init_perms(perms);
        promise.then((result) =>{
          var promise2 = permutate(perms);
          promise2.then((list) =>{
            for(var i = 0; i < list.length; i++){
              list[i].push(0);
              list[i].unshift(0);
              var promise3 = update_if_better(list[i], p);
            }
            resolve(p);
          });
        });
      });
      
    }

    function init_perms(perms){
      return new Promise(resolve =>{
        for(var i = 0; i < perms.perms.length; i++){
          perms.perms[i] = i + 1;
        }
        resolve(perms);
      });
    }

    function permutate(perms){
      //console.log("permutating");
      return new Promise(resolve => {
        var nums = perms.perms;
        let result = {};
        result[0] = [[nums[0]]];
        for (let i = 1; i < nums.length; i++) {
          let prev = result[i - 1];
          for (let prevItem of prev) {
              for (let j = 0; j <= prevItem.length; j++) {
                  let cur = prevItem.slice();
                  cur.splice(j, 0, nums[i]);
                  if (!result[i]) {
                      result[i] = [];
                  }
                  result[i].push(cur);
              }
          }
        }
        resolve(result[nums.length - 1]);
      });
    }

    function update_if_better(perms, p){
      return new Promise(resolve => {
        var promise = get_cost(perms, p);
        promise.then((acc_cost) =>{
          if(acc_cost < p.cost){
            p.path = perms;
            p.cost = acc_cost;
          }
          resolve(p);
        });
      });    
    }

    function get_cost(perms, p){
      return new Promise(resolve => {
        var acc_cost = 0;
        for(var i = 0; i + 1 < perms.length;++i){
          acc_cost += p.matrix[perms[i]][perms[i+1]];
        }
        resolve(acc_cost);
      });
    }

    function finalResult(places, addresses){
      return new Promise((resolve) => {
        if(places.length > 1){
          var finalTSP = greedyTSP(places, addresses);
          finalTSP.then((result) => {
            resolve(result);
          });
        }
      });
    } 

    function main(places, addresses){
      return new Promise(function(resolve, reject){ 
        finalResult(places, addresses).then((result) =>{
          resolve(result);
        });
      });
    }

    function getVal() {
      return new Promise((resolve) => {
        uniformDistribute(1800, 3660, places).then(
          (res) => {
            resolve(res);
            utilityArray = res;
        });
      });
    }

    if (places != null) {
      let place = nList[nList.length-1];
      console.log(place);

      return ( // Return list if array is not empty
        <View style={styles.container}>
          <View style={styles.timeContainer}>
            <TButton title={this.state.btnTitle} onPress={() => {
              this.TimePicker.open();
            }
              } />
          </View>
          <FlatList style = {styles.listContainer}
            data = { places }
            renderItem={({item}) => <Text style={styles.listText}>{item.key}</Text>}
            extraData={ this.props.navigation }
          />
          <View style={styles.buttonContainer}>
          <ActivityIndicator
            animating = {this.state.animating}
              color = '#1e88e5'
              size = "large"
              style = {styles.activityIndicator}/>
            <OButton title="Optimize itinerary" iconRight icon={{name: 'arrow-forward', color: "white"}} onPress={() => {
                this.setState({animating: true});
                getVal().then(
                  (result) => {
                    main(places, addresses).then(
                      (result) => {
                        console.log("user inputed text in listsscreen:", this.state.text);
                        this.props.navigation.navigate('ItinerariesScreen', {result: result, places: places, nList: nList, textinput: this.state.time});
                        this.setState({animating: false});
                      });
                    });
                  }
                }
              />
          </View>
            <TimePicker
              ref={ref => { this.TimePicker = ref; }}
              onCancel={() => this.onCancel()}
              onConfirm={(hour, minute) => this.onConfirm(hour, minute)}
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
  changeDepTime(time) {
    this.setState({btnTitle: 'Set Departure Time: ' + time}); 
  }
}
// Get distance from one point to another
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
        results = data;
        resultsLength = results.length;
        resolve(data); 
      }); 
    });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  timeContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  emptyList: {
    fontFamily: 'montserratLight',
    fontSize: 30,
    textAlign: 'center',
    padding: 8,
  },

  listContainer: {
    padding: 8,
  },
  
  listText: {
    fontFamily: 'montserratLight',
    fontSize: 20,
    paddingBottom: 12,   
  },

  buttonContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // position: 'absolute',
    bottom:0,
  },

  oButtonTitle: {
    fontFamily: 'montserratMedium',
    fontSize: 18,
  },

  tButtonTitle: {
    fontFamily: 'montserratMedium',
    fontSize: 20,
    color: '#1e88e5',
  },

    // Object Style
  oButtonStyle: {
    shadowColor: 'rgba(0, 0, 0, 0.4)', // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, //Android
    alignItems:'center',
    justifyContent:'center',
    width:250,
    height:40,
    backgroundColor:'#1e88e5',
    borderRadius:100,
  },

  tButtonStyle: {
    shadowOffset: { height: 1, width: 1 }, // IOS
    alignItems:'center',
    justifyContent:'center',
    width:300,
    height:40,
    backgroundColor:'#fff',
    borderRadius:100,
    
  },
  activityIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 80
 },
});