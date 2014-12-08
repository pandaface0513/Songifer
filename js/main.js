/*
 *  This is the first script that is loaded in our application. It initializes items such as
 *  the context and the GUI, and makes calls to other, more specific scripts/functions.
 */

// initialize the audio context
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

// used for storing a MediaStreamAudioSourceNode object given a media stream
var mediaStreamSource;

var isRecording = false;    // check if app is currently recording something
var allowRecording = true;  // check if user has clicked the record button

var recordTime = 10000;  // amount of time for the user to record a clip, in milliseconds
var timeRemaining = 0;   // amount of time remaining for the user to record

var raw_data = [];  // store the raw audio stream data from the mic input

var recorder;

// this value, from the slider, is the tempo modifier that is saved when "record" is clicked
var lockedTempoValue = 4;

// dat.GUI objects
var GUI;
var controls;

window.onload = function(){
    controls = new HelloWorld();
    GUI = new dat.GUI();
    GUI.add(controls, 'title');
    GUI.add(controls, 'recordingTimeGUI', 5, 30).step(5).name("record time (sec)");
    GUI.add(controls, 'tempo', 1, 7).step(1).name("tempo modifier");
    GUI.add(controls, 'record');
    GUI.add(controls, 'export').name("export to WAV file");
    
    
    navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);
    
    if(navigator.getUserMedia){
        navigator.getUserMedia(
            // constraints to enable audio (with no video)
            {
                audio: true
            },
            
            // successCallback
            function(stream){
                console.log("got stream");
                gotStream(stream);
            },
            
            // errorCallback
            function(err){
                console.log("The following error occured: " + err);
            }
        );
    }
    else{
        console.log("getUserMedia not supported");
    }
}

//connect the microphone
function gotStream(stream){
    mediaStreamSource = context.createMediaStreamSource(stream);

    //connect it to the destination.
    startVisualizer();  // after we get the mic stream, start the visualizer 
    initPitch();  // get the pitch
}

// Set up the dat.gui controls, and the triggers for when the corresponding button is clicked.
var HelloWorld = function(){
    this.title = "Songify MK2014";  // display title of our app

    this.tempo = 4;
    this.recordingTimeGUI = 10;

    // to begin recording audio from mic
    this.record = function(){
        //start our recording
        if(!isRecording && allowRecording){   //if not recording
            isRecording = true;
            allowRecording = false;
            recordTime = 0;
            recordTime = this.recordingTimeGUI * 1000;
            timeRemaining = recordTime / 1000;

            startRecording();
            setTimeout(stopRecording, recordTime+1000);  // execute stopRecording() once time runs out
            
            // use tempo slider's maximum value + 1 because we must avoid dividing by zero
            lockedTempoValue = 8 - this.tempo;
        }
    },

    // export audio to WAV file
    this.export = function() {
        recorder && recorder.stop();  // stop recording once the button is cliecked

        // Export to WAV file. Create a download link to an HTML list element on the left side
        // of the page. This function's code was borrowed from an example given by the
        // recorder.js library.
        recorder && recorder.exportWAV(function(blob) {
            var url = URL.createObjectURL(blob);
            var li = document.createElement('li');
            var au = document.createElement('audio');
            var hf = document.createElement('a');

            au.controls = false;
            au.src = url;
            hf.href = url;
            hf.download = new Date().toISOString() + '.wav';
            hf.innerHTML = "Download: " + hf.download;
            li.appendChild(au);
            li.appendChild(hf);
            recordingslist.appendChild(li);
        });
        // *** end sample code from recorder.js library ***
    }
}

//function for displaying status messages
function updateStatus(status){
    document.getElementById("status").innerHTML += status + "<br>";
}

//function for after getting the recording
function postRecording(){
    //step one - group the data
    group_data = grouping(raw_data);

    //step two - convert to notes
    note_data = convertNote(group_data);

    //step three - regrouping the notes
    group_note = groupingAgain(note_data);

    //step four - create music sheet
    notesLead = [];
    notesLead = dynamicMusic(group_note);

    //step five - play music
    var gain = context.createGain();
    gain.gain.value = 5;  // set the audio gain
    var lead = synthastico.createSynth(context, notesLead);
    updateStatus("Playing some creepy music...");  //update status
    playMusic(lead, gain);
}