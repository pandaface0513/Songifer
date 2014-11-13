window.AudioContext = window.AudioContext || window.webkitAudioContext;

var context,
    sourceNode,
    analyser,
    theBuffer,
    mediaStreamSource,
    ugm;

var bufferLength = 1024;

var MIN_SAMPLES = 0;

var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

var errorCallback = function(e) {
    console.log('Reeeejected!', e);
};

//when the window is loaded
window.onload = function(){
    context = new AudioContext();
    theBuffer = new Float32Array(bufferLength);
    
    console.log("window ready");
    
    navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

    if (navigator.getUserMedia) {
       navigator.getUserMedia (

          // constraints
          {
             audio: true
          },

          // successCallback
          function(stream) {
              console.log("got stream");
              gotStream(stream);
          },

          // errorCallback
          function(err) {
             console.log("The following error occured: " + err);
          }
       );
    } else {
       console.log("getUserMedia not supported");
    }
}

//connect the microphone with filter and with speakers
function gotStream(stream){
    mediaStreamSource = context.createMediaStreamSource(stream);
        
    //connect it to the destination.
    analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    mediaStreamSource.connect(analyser);
    printPitch();
    console.log("hi");
}

function printPitch(){
        
    window.requestAnimationFrame( printPitch );
    
    var cycles = new Array;
    
    analyser.getFloatTimeDomainData(theBuffer);
    
    var signal = autoCorrelate(theBuffer, context.sampleRate);
    
    //if signal not enough
    if(signal == -1){
        console.log("not enough signal");
    }else{
        var note, detune;
        note = 12 * (Math.log(signal / 440) /Math.log(2));
        note = Math.round(note) + 69;
        
        detune = Math.floor(1200 * Math.log(signal / (440 * Math.pow(2, (note-69)/12))) / Math.log(2));
        
        if(detune == 0){
            detune = " ";
        }else{
            if(detune < 0){
                detune = "flat";
            }else{
                detune = "sharp";
            }
        }
        console.log(noteStrings[note%12] + detune);
    }
    
}

//the magic function to figure out a pitch lol
function autoCorrelate(buffer, sampleRate){
    var SIZE = buffer.length;
    var MAX_SAMPLES = Math.floor(SIZE/2);
    var best_offset = -1;
    var best_correlation = 0;
    var rms = 0;
    var foundGoodCorrelation = false;
    var correlations = new Array(MAX_SAMPLES);
    
    //add all squared values together?
    for(var i=0; i<SIZE; i++){
        var val = buffer[i];
        rms += val*val;
    }
    
    //then square root the average!?
    rms = Math.sqrt(rms/SIZE);
    
    if(rms < 0.01){ //not enough signal
        return -1;
    }
    
    //more magic in the following
    var lastCorrelation = 1;
    	for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
		var correlation = 0;

		for (var i=0; i<MAX_SAMPLES; i++) {
			correlation += Math.abs((buffer[i])-(buffer[i+offset]));
		}
		correlation = 1 - (correlation/MAX_SAMPLES);
		correlations[offset] = correlation; // store it, for the tweaking we need to do below.
		if ((correlation>0.9) && (correlation > lastCorrelation)) {
			foundGoodCorrelation = true;
			if (correlation > best_correlation) {
				best_correlation = correlation;
				best_offset = offset;
			}
		} else if (foundGoodCorrelation) {
			// short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
			// Now we need to tweak the offset - by interpolating between the values to the left and right of the
			// best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
			// we need to do a curve fit on correlations[] around best_offset in order to better determine precise
			// (anti-aliased) offset.

			// we know best_offset >=1, 
			// since foundGoodCorrelation cannot go to true until the second pass (offset=1), and 
			// we can't drop into this clause until the following pass (else if).
			var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset];  
			return sampleRate/(best_offset+(8*shift));
		}
		lastCorrelation = correlation;
	}
	if (best_correlation > 0.01) {
		// console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
		return sampleRate/best_offset;
	}
	return -1;   
}