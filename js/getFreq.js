var pitch, tone, str;

var recordThread, countThread;

var s = [];

//function to get pitch
function initPitch(){
    // initialize pitch detector
    pitch = new PitchAnalyzer();   
    str = new Uint8Array(fft.frequencyBinCount);
}

//function to start recording
function startRecording(){
    //update status
    updateStatus("Recording...");
    //empty the raw-data
    raw_data = [];
    //start the record and countdown threads
    recordThread = setInterval(recordFreq, 300);
    countThread = setInterval(countDown, 1000);
}

//function to update time for user
function countDown(){
    timeRemaining--;
    document.getElementById("time").innerHTML = 
        timeRemaining + " seconds left.";
}

//function to stop recording
function stopRecording(){
    //switch record back on
    isRecording = false;
    //update status
    updateStatus("Done Recording!");
    //stop the countdown loop
    clearInterval(countThread);
    timeRemaining = 0;
    //stop the record loop
    clearInterval(recordThread);
    //post recording
    postRecording();
}

//function loop to keep detecting and recording frequency
function recordFreq(){
    s = [];
    
    for(var i=0; i<data.length; i++){
        s.push(str[i]);
    }
    
    // copy samples to the internal buffer
    pitch.input(data);

    // process the current input in the internal buffer
    pitch.process();
    
    tone = pitch.findTone();
    
    if(tone === null || tone === 0){
        raw_data.push(0);
        document.getElementById("freq").innerHTML = "silent";
    }else{
        freak = Math.floor(tone.freq);
        raw_data.push(freak);
        document.getElementById("freq").innerHTML = freak;
    }
}