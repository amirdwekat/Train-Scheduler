$(document).ready(function(){
     const config   = {
        apiKey: "AIzaSyAzYFt_fdhVgJnC2TIHY9hZ3xCoTiV0-yE",
        authDomain: "project-4416065917943304889.firebaseapp.com",
        databaseURL: "https://project-4416065917943304889.firebaseio.com",
        projectId: "project-4416065917943304889",
        storageBucket: "project-4416065917943304889.appspot.com",
        messagingSenderId: "948056419308",
        appId: "1:948056419308:web:12a715d1c1095dfd232ec9",
        measurementId: "G-X620C6BXGK"
      };

      firebase.initializeApp(config);

      // A variable to reference the database.
      var database = firebase.database();
  
      // Variables for the onClick event
      var name;
      var destination;
      var firstTrain;
      var frequency = 0;
  
      $("#add-train").on("click", function() {
          event.preventDefault();
          // Storing and retreiving new train data
          name = $("#train-name").val().trim();
          destination = $("#destination").val().trim();
          firstTrain = $("#first-train").val().trim();
          frequency = $("#frequency").val().trim();
  
          // Pushing to database
          database.ref().push({
              name: name,
              destination: destination,
              firstTrain: firstTrain,
              frequency: frequency,
              dateAdded: firebase.database.ServerValue.TIMESTAMP
          });
          $("form")[0].reset();
      });
  
      database.ref().on("child_added", function(childSnapshot) {
          var nextArr;
          var minAway;
          // Chang year so first train comes before now
          var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
          // Difference between the current and firstTrain
          var diffTime = moment().diff(moment(firstTrainNew), "minutes");
          var remainder = diffTime % childSnapshot.val().frequency;
          // Minutes until next train
          var minAway = childSnapshot.val().frequency - remainder;
          // Next train time
          var nextTrain = moment().add(minAway, "minutes");
          nextTrain = moment(nextTrain).format("hh:mm");
  
          $("#add-row").append("<tr><td>" + childSnapshot.val().name +
                  "</td><td>" + childSnapshot.val().destination +
                  "</td><td>" + childSnapshot.val().frequency +
                  "</td><td>" + nextTrain + 
                  "</td><td>" + minAway + "</td></tr>");
  
              // Handle the errors
          }, function(errorObject) {
              console.log("Errors handled: " + errorObject.code);
      });
  
      database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
          // Change the HTML to reflect
          $("#name-display").html(snapshot.val().name);
          $("#email-display").html(snapshot.val().email);
          $("#age-display").html(snapshot.val().age);
          $("#comment-display").html(snapshot.val().comment);
      });
  });   



