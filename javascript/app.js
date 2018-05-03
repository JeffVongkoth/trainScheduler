 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyCVT3va6zdfTA_XMOWDdZnmRlvJODKWkPc",
    authDomain: "trainactivity-3c7a0.firebaseapp.com",
    databaseURL: "https://trainactivity-3c7a0.firebaseio.com",
    projectId: "trainactivity-3c7a0",
    storageBucket: "trainactivity-3c7a0.appspot.com",
    messagingSenderId: "851646682177"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  // Initial Values
  var train = "";
  var destination = "";
  var time = '';
  var freq = '';

  $("#submit").on("click", function (event) {
    event.preventDefault();

    // Grabbed values from text boxes
    train = $("#train-input").val().trim();
    dest = $("#dest-input").val().trim();
    time = $("#time-input").val();
    freq = $("#freq-input").val();

    // Code for handling the push
    database.ref().push({
        train: train,
        dest: dest,
        time: time,
        freq: freq,
    });
    $("#train-input").val('');
    $("#dest-input").val('');
    $("#time-input").val('');
    $("#freq-input").val('');
});

// Firebase watcher + initial loader + order/limit HINT: .on("child_added"
database.ref().on("child_added", function (snapshot) {
    var sv = snapshot.val();
    var startTime = sv.time;
    var randFormat = 'HH:mm a';
        freq = sv.freq;
    var arrivalTime = moment(startTime, randFormat).subtract(1, 'years');
    console.log(arrivalTime);
    var currentTime = moment();

    var diffTime = moment().diff(moment(arrivalTime), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
    
    var tRemainder = diffTime % freq;
    console.log(tRemainder);

    var tMinutesTillTrain = freq - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format('hh:mm a');
    console.log(nextTrain);
    
    var tBody = $("tbody");
    var tRow = $("<tr>");

    // Methods run on jQuery selectors return the selector they we run on
    // This is why we can create and save a reference to a td in the same statement we update its text
    var trainTd = $("<td>").text(sv.train);
    var destTd = $("<td>").text(sv.dest);
    var freqTd = $("<td>").text(sv.freq);
    var nextArriTd = $('<td>').text(nextTrain);
    var minAwayTd = $('<td>').text(tMinutesTillTrain);
    
    // Append the newly created table data to the table row
    tRow.append(trainTd, destTd, freqTd, nextArriTd, minAwayTd);
    // Append the table row to the table body
    tBody.prepend(tRow);



    // Console.loging the last user's data
    // console.log(sv.train);
    // console.log(sv.dest);
    // console.log(sv.time);
    // console.log(sv.freq);

    // Change the HTML to reflect
    $("#train-display").text(sv.train);
    $("#dest-display").text(sv.dest);
    $("#freq-display").text(sv.freq);

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code)
});