/*
 *  Functions to support generating and playing the music. These are called once recording
 *  is finished.
 */

// Create a sheet of music with bars, measures, etc., given an input of notes.
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

        //setting the structure
        o = new Object();
        o.measure = measure;
        o.start = start/16;
        o.duration = notes[i].length/8;
        o.tone = note;
        console.log(o);

        //insert into the music sheet
        musicSheet.push(o);
        start += lockedTempoValue;  // vary the start based on the user-specified tempo value
        if(start > 16){start = 1; measure++;}
    }
    
    return musicSheet;
}

// Output audio in real time.
function playMusic(lead, gain){
    lead.decay = 60*(synthastico.SAMPLERATE / 1000);
    lead.sustain = 0.5;
    lead.release = 30*(synthastico.SAMPLERATE / 1000);

    var val = 0;

    lead.sound = function (note, time) {
        // Create a "period" based on the note's semitone.
        // Inspired by http://www.keithwhor.com/music/
        val = Math.sin( (2 * Math.PI) * (time / synthastico.SAMPLERATE) * 
            (synthastico.BASE_FREQUENCY * Math.pow(2, (note.tone ) / synthastico.OCTAVE_LENGTH)));

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
    
    // create a highpass filter so that frequencies below the cutoff are peaked
    var highpass = (function () {
        var effect = context.createBiquadFilter();
        effect.type = 'highpass';
        effect.frequency.value = 50;  // cutoff
        effect.Q.value = 10;  // "quality factor" parameter
        return effect;
    }());

    // Create a highshelf filter so that frequencies below the cutoff are peaked.
    // This makes higher frequencies less harsh and high-pitched. 
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
    
    // add in a phaser audio effect
    var phaser = new tuna.Phaser({
        rate: 1.2,
        depth: 0.3,
        feedback: 0.2,
        stereoPhase: 30,
        baseModulationFrequency: 700,
        bypass: 0
    });
    
    // add in some more minor effects to make the output more natural
    var chorus = new tuna.Chorus({
        rate: 3,         // 0.01 to 8+
        feedback: 0.2,   // 0 to 1+
        delay: 0.2,      // 0 to 1
        bypass: 0        // the value 1 starts the effect as bypassed, 0 or 1
    });

    // connect the sources up to the effects
    lead.connect(highpass);
    highpass.connect(highshelf);
    highshelf.connect(gain);
    gain.connect(phaser.input);
    phaser.connect(chorus.input);
    chorus.connect(context.destination);

    // initiate recorder.js object; specify path to the worker script
    recorder = new Recorder(chorus.output, {workerPath: "vendor/recorder.js/recorderWorker.js"});
    
    recorder && recorder.record();  // start recording after real-time audio playing is initiated

}