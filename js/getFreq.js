var pitch, tone, str;

var data = [];

//function to get pitch
function initPitch(){
    // initialize pitch detector
    pitch = new PitchAnalyzer(SAMPLE_SIZE);
    
    str = new Uint8Array(fft.frequencyBinCount);
    
    //mediaStreamSource.connect(analyzer);
    
    checkPitch();    
}

//function loop to keep checking pitch
function checkPitch(){
    requestAnimationFrame(checkPitch);
    
    // try to get samples
    fft.getByteFrequencyData(str);
    
    data = [];
    
    for(var i=0; i<str.length; i++){
        data.push(str[i]);
    }
    
    // copy samples to the internal buffer
    pitch.input(data);

    // process the current input in the internal buffer
    pitch.process();
    
    tone = pitch.findTone();
    peak = pitch.getPeak();
    console.log(peak);
    
    if(tone === null || tone === 0){
        console.log('no tone found!');
        document.getElementById("freq").innerHTML = "silent";
    }else{
        console.log('found a tone, frequency:', tone.freq, 'volume:', tone.db);
        document.getElementById("freq").innerHTML = tone.freq;
    }
}