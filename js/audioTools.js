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
        o.duration = notes[i].length/8;
        o.tone = note;
        console.log(o);
        //insert into the music sheet
        musicSheet.push(o);
        start += 4;
        if(start > 16){start = 1; measure++;}
    }
    
    return musicSheet;
}

function playMusic(lead, gain){

  //var bass = synthastico.createSynth(audioContext, notesBass);


  lead.decay = 60*(synthastico.SAMPLERATE / 1000);
  lead.sustain = 0.5;
  lead.release = 30*(synthastico.SAMPLERATE / 1000);

  var val = 0;

  lead.sound = function (note, time) {
    // Create a "period" based on the note's semitone.

    // *** original method ***
    // var val =
    //   synthastico.BASE_FREQUENCY *
    //   Math.pow(2, (note.tone - (synthastico.OCTAVE_LENGTH*(synthastico.BASE_OCTAVE + 1))) / synthastico.OCTAVE_LENGTH) *
    //   (time / synthastico.SAMPLERATE);

    // *** test method 1 ***
    // var val = Math.sin(synthastico.BASE_FREQUENCY * note.tone * Math.pow(2, (note.tone - (synthastico.OCTAVE_LENGTH*(synthastico.BASE_OCTAVE + 1))) / synthastico.OCTAVE_LENGTH) * 2 * Math.PI * (1 - (time / synthastico.SAMPLERATE)));
    
    // *** test method 2 ***
    // inspired by http://www.keithwhor.com/music/
    val = Math.sin( (2 * Math.PI) * (time / synthastico.SAMPLERATE) * 
        (synthastico.BASE_FREQUENCY * Math.pow(2, (note.tone ) / synthastico.OCTAVE_LENGTH)));

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
    var value = (val - Math.floor(val) - 0.5) * 1 * amp;

    return value;
  };
    
    // var lowpass = (function () {
    //   var effect = context.createBiquadFilter();
    //   effect.type = 'lowpass';
    //   effect.frequency.value = 1000;
    //   effect.gain.value = 0;
    //   return effect;
    // }());

    var highpass = (function () {
      var effect = context.createBiquadFilter();
      effect.type = 'highpass';
      effect.frequency.value = 50;
      effect.Q.value = 10;
      return effect;
    }());

    var highshelf = (function () {
      var effect = context.createBiquadFilter();
      effect.type = 'highshelf';
      effect.frequency.value = 2500;
      effect.gain.value = -50;
      return effect;
    }());
    
    // Initiate an object from the Tuna audio effects library.
    // https://github.com/Dinahmoe/tuna
    var tuna = new Tuna(context);
    
    var phaser = new tuna.Phaser({
        rate: 1.2,
        depth: 0.3,
        feedback: 0.2,
        stereoPhase: 30,
        baseModulationFrequency: 700,
        bypass: 0
    });
    
    var chorus = new tuna.Chorus({
                 rate: 1.5,        //0.01 to 8+
                 feedback: 0.2,  //0 to 1+
                 delay: 0.0045,     //0 to 1
                 bypass: 0       //the value 1 starts the effect as bypassed, 0 or 1
    });

  

  // *** begin original code ***
  // lead.connect(lowpass);

  //lead.connect(reverb);
  // bass.connect(audioContext.destination);
  // lowpass.connect(sidechain);
  // lead.connect(audioContext.destination);
  

  // lowpass.connect(gain);
  // gain.connect(context.destination);
  // *** end original code ***

  lead.connect(highpass);
  highpass.connect(highshelf);
  highshelf.connect(gain);
  gain.connect(phaser.input);
  phaser.connect(chorus.input);
  chorus.connect(context.destination);
  
  recorder = new Recorder(chorus.output, {workerPath: "vendor/recorder.js/recorderWorker.js"});
  recorder && recorder.record();

  // *** NOT WORKING ***
  // mediaStreamSource = context.createMediaStreamSource(context);
  // mediaStreamSource.connect(context.destination);


}