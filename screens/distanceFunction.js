function getDistance(start, end){
      var distance = require('react-native-google-matrix');
      
      distance.get(
        {
          origins: start,
          destinations: end
        },
        function(err, data) {
          if(err) return console.log("hi");
          //console.log(data);
          results = data;
          //console.log("results length: " + results.length);
          //console.log(results);
          if(results.length != undefined){
            console.log("assigning resultsLength")
            resultsLength = results.length;
          }
          //console.log(typeof results);
          //console.log(results[0]);
        }
      );

      //console.log(results);
      //console.log(results.length);

      //for(var i = 0; i < results.length; i++){
        //console.log(results[i]);
      //}

      
      
    }