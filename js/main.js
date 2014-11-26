window.AudioContext = window.AudioContext || window.webkitAudioContext;

context = new AudioContext();

var context, mediaStreamSource, musicPlayer;

var isRecording = false;
var timeRemaining = 0;
var recordTime = 10000;

var raw_data = [];

window.onload = function(){
    var text = new HelloWorld();
    var GUI = new dat.GUI();
    GUI.add(text, 'title')
    //GUI.add(text, 'NoiseCancel')
    //GUI.add(text, 'NoiseSensitivity', 1, 10);
    //GUI.add(text, 'Amplifier');
    //GUI.add(text, 'AmpifyRatio', 0.1, 3);
    //GUI.add(text, "Secret");
    GUI.add(text, 'record');
    
    //initialize audioContext
        
    navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);
    
    if(navigator.getUserMedia){
        navigator.getUserMedia(
            
            //constraints
            {
                audio: true
            },
            
            //successCallback
            function(stream){
                console.log("got stream");
                gotStream(stream);
            },
            
            //errorCAllback
            function(err){
                console.log("The following error occured: " + err);
            }
        );
    }else{
        console.log("getUserMedia not supported");
    }
}


//connect the microphone
function gotStream(stream){
    mediaStreamSource = context.createMediaStreamSource(stream);
    
    //connect it to the destination.
    //mediaStreamSource.connect(context.destination);
    startVisualizer();  // after we get the mic stream, start the visualizer 
    initPitch();
    initOscillator();
}

var HelloWorld = function(){
    this.title = "Songify MK2014";
    this.NoiseCancel = true;
    this.NoiseSensitivity = 5;
    this.Amplifier = true;
    this.AmpifyRatio = 1;
    this.Secret = true;
    this.record = function(){
        //start our recording
        if(!isRecording){   //if not recording
            isRecording = true;
            timeRemaining = recordTime / 1000;
            startRecording();
            setTimeout(stopRecording, recordTime+1000);
        }
    }
}

//function for displaying status
function updateStatus(status){
    document.getElementById("status").innerHTML += status + "<br>";
}

//function for after getting the recording
function postRecording(){
    //step one - group the data
    group_data = grouping(raw_data);
    //step two - convert to notes
    note_data = convertNoteA(raw_data);
    //step three - regrouping the notes
    group_note = groupingAgain(note_data);
    //step four - create music sheet
    notesLead = [];
    notesLead = dynamicMusic(note_data);
    console.log(notesLead);
    //step five - play music
    var gain = context.createGain();
    gain.gain.value = 10;
    var lead = synthastico.createSynth(context, notesLead);
    //update status
    updateStatus("Playing some creepy music...");
    playMusic(lead, gain);
}

/*
function getNote(frequency, reference) {
    if (!frequency) return null;
    reference = reference || 440;
    return 69 + 12 * Math.log(frequency / reference) / Math.LN2;
}

function getAngle(midiNote) {
    return midiNote ? Math.PI * (midiNote % 12) / 6 : 0;
}

function getOctave (midiNote) {
    return ~~(midiNote / 12);
}
*/

