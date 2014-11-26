function dynamicMusic(notes){
    //update status
    updateStatus("Writing Music Sheet...");
    //create empty array to store music sheet
    var musicSheet = [];
    var measure = 0;
    var start = 1;
    var num = 0;
    //runs a loop to read from notes
    for(var i=0; i<notes.length; i++){
        //grabbing the values
        var note = notes[i].note;
        //var len = notes[i].length;
        //setting the structure
        o = new Object();
        o.measure = measure;
        o.start = start/16;
        o.duration = 1/16;
        o.tone = note;
        //insert into the music sheet
        musicSheet.push(o);
        start++;
        if(start > 16){start = 1;}
    }
    
    return musicSheet;
}

function playMusic(lead, gain){
  //var bass = synthastico.createSynth(audioContext, notesBass);

  lead.decay = 30*(synthastico.SAMPLERATE / 1000);
  lead.sustain = 0.5;
  lead.release = 30*(synthastico.SAMPLERATE / 1000);

  lead.sound = function (note, time) {
    // Create a "period" based on the note's semitone.
    var val =
      synthastico.BASE_FREQUENCY *
      Math.pow(2, (note.tone - (synthastico.OCTAVE_LENGTH*(synthastico.BASE_OCTAVE + 1))) / synthastico.OCTAVE_LENGTH) *
      (time / synthastico.SAMPLERATE);

    // console.log(val);

    // Get the ADSR amplitude.
    var amp = synthastico.ampFromADSR(
      note.totalPlayed,
      this.attack,
      this.decay,
      this.sustain,
      this.release,
      note.releaseTime
    );

    // Now apply the periodic function.
    var value =
      (val - Math.floor(val) - 0.5) * 1 * amp;

    return value;
  };
    
    var lowpass = (function () {
      var effect = context.createBiquadFilter();
      effect.type = 'lowpass';
      effect.frequency.value = 1000;
      effect.gain.value = 0;
      return effect;
    }());

  lead.connect(lowpass);
  //lead.connect(reverb);
  // bass.connect(audioContext.destination);
  // lowpass.connect(sidechain);
  // lead.connect(audioContext.destination);
  lowpass.connect(gain);
  gain.connect(context.destination);
}