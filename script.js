// collect input from form and store each in a variable
// calculate next to arrive using Moment.js and store in variable
// push all train details to an object in Firebase
// retrieve desired train details from Firebase and print to table in HTML

$(document).ready(function () {

    // Some global variables
    var trainName;
    var destination;
    var trainStart;
    var trainStartConvert;
    var frequency;
    var currentTime;
    var timeDiff;
    var timeRemainder;
    var minAway;
    var nextTrain;
    var nextTrainConvert;

    // Initialize Firebase + Get Database Ref
    var config = {
        apiKey: "AIzaSyAS0s-nsMaCV9kXtZMhO7TkEiOC2wMjGiI",
        authDomain: "train-times-b8792.firebaseapp.com",
        databaseURL: "https://train-times-b8792.firebaseio.com",
        projectId: "train-times-b8792",
        storageBucket: "",
        messagingSenderId: "1038755661999"
    };

    firebase.initializeApp(config);
    var dataRef = firebase.database();

    $("#addTrainBtn").on("click", function () {
        event.preventDefault();

        // Collect train information from user input
        trainName = $("#trainNameInput").val().trim();
        destination = $("#destinationInput").val().trim();
        trainStart = $("#trainStartInput").val().trim();
        frequency = $("#frequencyInput").val().trim();
        console.log(trainName + ", " + destination + ", " + trainStart + ", " + frequency);
        console.log("train start time: " + trainStart);

        // TRAIN TIME CONVERSIONS
        // First train time minus 1 year to make sure it's before current time
        trainStartConvert = moment(trainStart, "HH:mm").subtract(1, "years");
        console.log("Converted train time: " + moment(trainStartConvert).format("hh:mm"));

        // Current time
        currentTime = moment();
        console.log("Current time: " + moment(currentTime).format("hh:mm"));

        // Difference in time
        timeDiff = moment().diff(moment(trainStartConvert), "minutes");
        console.log("Difference in time: " + timeDiff);

        // Time appart
        timeRemainder = timeDiff % frequency;
        console.log("Remainder: " + timeRemainder);

        // Minutes until train arrives
        minAway = frequency - timeRemainder;
        console.log("Min until train: " + minAway);

        // Next to arrive
        nextTrain = moment().add(minAway, "minutes");
        nextTrainConvert = moment(nextTrain).format("mm:hh");
        console.log(nextTrain);

        // PUSH TRAIN DATA TO DATABASE
        dataRef.ref().push({

            trainName: trainName,
            destination: destination,
            frequency: frequency,
            nextTrain: nextTrainConvert,
            minAway: minAway

        })

    })

    // USING DATABASE REF, GRAB CHILD SNAPSHOT ON CHILD_ADDED TO GET EACH NEW TRAIN 
dataRef.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val().trainName);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().frequency);
    console.log(moment(childSnapshot.val().nextTrainConvert).format("hh:mm A"));
    console.log(childSnapshot.val().minAway);

    // APPEND EACH CHILD SNAPSHOT PROPERTY TO THE TABLE IN THE RIGHT COLUMN
    var row = $("<tr>");

    row.append("<td>" + childSnapshot.val().trainName + "</td>" + "<td>" + childSnapshot.val().destination + "</td>" + "<td>" + childSnapshot.val().frequency + "</td>" + "<td>" + moment(childSnapshot.val().nextTrainConvert).format("hh:mm A") + "</td>" + "<td>" + childSnapshot.val().minAway + "</td>")

    $("tbody").append(row);
})

});


