// Initialize Firebase
var config = {
  apiKey: "AIzaSyBXDANTPd7lbf0TCU_mvjdUnpVz6xdoXwA",
  authDomain: "train-schedule-57c7e.firebaseapp.com",
  databaseURL: "https://train-schedule-57c7e.firebaseio.com",
  projectId: "train-schedule-57c7e",
  storageBucket: "train-schedule-57c7e.appspot.com",
  messagingSenderId: "207442742524"
};
firebase.initializeApp(config);

  var database = firebase.database();

  var trainNameInput;
  var destinationInput;
  var trainTimeInput;
  var frequencyInput;
  var nextTrainTime = '';
  var minTillTrain = '';

  $('#submit-btn').on('click', function(){
    event.preventDefault();


    //Grab user input
    trainNameInput = $('#train-name-input').val().trim();
    destinationInput = $('#destination-input').val().trim();
    trainTimeInput = $('#train-time-input').val().trim();
    frequencyInput = $('#frequency-input').val().trim();

    //push object to firebase
    database.ref().push({
      trainName: trainNameInput,
      destination: destinationInput,
      trainTime: trainTimeInput,
      frequency: frequencyInput
    })

    // alert(trainNameInput);
  })

  database.ref().on('child_added', function(snapshot) {
    var sv = snapshot.val();

    console.log(sv.trainName);
    console.log(sv.destination);
    console.log(sv.trainTime);
    console.log(sv.frequency);

    calcMinAway();

    var row = $("<tr class='table-row'>");
    var bottomBorder = $("<div class='border'>")

    $(row).append('<td class="table-data"> ' + sv.trainName + ' </td>');
    $(row).append('<td class="table-data"> ' + sv.destination + ' </td>');
    $(row).append('<td class="table-data"> ' + sv.frequency + ' </td>');
    $(row).append('<td class="table-data"> ' + nextTrainTime + ' </td>');
    $(row).append('<td class="last-cell"> ' + minTillTrain + ' </td>');

    function calcMinAway(){
      var tFrequency = sv.frequency;

      var firstTrainTime = moment(sv.trainTime, 'HH:mm').subtract(1, "years");
      console.log(firstTrainTime);

      var diffTime = moment().diff(moment(firstTrainTime), "minutes");
      console.log("DIFFERENCE IN TIME: " + diffTime);

      var tRemainder = diffTime % tFrequency;

      var tMinutesTillTrain = tFrequency - tRemainder;
      minTillTrain = tMinutesTillTrain;
      console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      nextTrainTime = moment(nextTrain).format("hh:mm");
      console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

      console.log('---------------------------')

    }
    
    

    $('#train-list').append(row);
    $('#train-list').append(bottomBorder);
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

  

  