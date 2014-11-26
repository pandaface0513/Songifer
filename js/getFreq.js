var pitch, tone, str;

var s = [];

//function to get pitch
function initPitch(){
    // initialize pitch detector
    pitch = new PitchAnalyzer();
    
    str = new Uint8Array(fft.frequencyBinCount);
    
    //mediaStreamSource.connect(analyzer);
    
    setInterval(checkPitch, 300);    
}

//function loop to keep checking pitch
function checkPitch(){
    //requestAnimationFrame(checkPitch);
    
    // try to get samples
    //fft.getByteFrequencyData(str);
    
    s = [];
    
    for(var i=0; i<data.length; i++){
        s.push(str[i]);
    }
    
    // copy samples to the internal buffer
    pitch.input(data);

    // process the current input in the internal buffer
    pitch.process();
    
    tone = pitch.findTone();
    peak = pitch.getPeak();
    //console.log(peak);
    
    if(tone === null || tone === 0){
        // console.log('no tone found!');
        document.getElementById("freq").innerHTML = "silent";
    }else{
        // console.log('found a tone, frequency:', tone.freq, 'volume:', tone.db);
        document.getElementById("freq").innerHTML = tone.freq;
    }
}