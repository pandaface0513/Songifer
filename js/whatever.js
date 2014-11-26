var notesLead = [
    /*
  {measure: 1, start: 0/16, duration: 1/16, tone: 64},
  {measure: 1, start: 0/16, duration: 1/16, tone: 64},
  {measure: 1, start: 0/16, duration: 1/16, tone: 64},
  {measure: 1, start: 0/16, duration: 1/16, tone: 64},

  {measure: 1, start: 2/16, duration: 1/16, tone: 64},
  {measure: 1, start: 2/16, duration: 1/16, tone: 64},
  {measure: 1, start: 2/16, duration: 1/16, tone: 64},
  {measure: 1, start: 2/16, duration: 1/16, tone: 64},

  {measure: 1, start: 4/16, duration: 1/16, tone: 64},
  {measure: 1, start: 4/16, duration: 1/16, tone: 60},
  {measure: 1, start: 4/16, duration: 1/16, tone: 12},
  {measure: 1, start: 4/16, duration: 1/16, tone: 30},

  {measure: 1, start: 7/16, duration: 1/16, tone: 64},
  {measure: 1, start: 7/16, duration: 1/16, tone: 60},
  {measure: 1, start: 7/16, duration: 1/16, tone: 12},
  {measure: 0, start: 7/16, duration: 1/16, tone: 30}*/
];

var gain = context.createGain();
gain.gain.value = 10;

var lead = synthastico.createSynth(context, notesLead);

setTimeout(function () {
  //var bass = synthastico.createSynth(audioContext, notesBass);

  lead.decay = 5*(synthastico.SAMPLERATE / 1000);
  lead.sustain = 0.5;
  lead.release = 5*(synthastico.SAMPLERATE / 1000);

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
}, 1000);