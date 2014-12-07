/*
 *  In this script, we convert our raw audio data into notes based on frequencies, similar to
 *  piano keys.
 */

/*
 *  An array that corresponds to the notes of a piano and their frequencies.
 *  Values are based on https://en.wikipedia.org/wiki/Piano_key_frequencies
 *  Frequency values are rounded down to the nearest integer for simplicity.
 *  Lower cutoff: C# (5)
 *  Upper cutoff: C6 Soprano (64)
 */
var mappingArray = [
	{note: 5,  freq: 34 }, {note: 6,  freq: 36 }, {note: 7,  freq: 38 }, {note: 8,  freq: 41 },
	{note: 9,  freq: 43 }, {note: 10, freq: 46 }, {note: 11, freq: 48 }, {note: 12, freq: 51 },
	{note: 13, freq: 55 }, {note: 14, freq: 58 }, {note: 15, freq: 61 }, {note: 16, freq: 65 },
	{note: 17, freq: 69 }, {note: 18, freq: 73 }, {note: 19, freq: 77 }, {note: 20, freq: 82 },
	{note: 21, freq: 87 }, {note: 22, freq: 92 }, {note: 23, freq: 97 }, {note: 24, freq: 103},
	{note: 25, freq: 110}, {note: 26, freq: 116}, {note: 27, freq: 123}, {note: 28, freq: 130},
	{note: 29, freq: 138}, {note: 30, freq: 146}, {note: 31, freq: 155}, {note: 32, freq: 164},
	{note: 33, freq: 174}, {note: 34, freq: 184}, {note: 35, freq: 195}, {note: 36, freq: 207},
	{note: 37, freq: 220}, {note: 38, freq: 233}, {note: 39, freq: 246}, {note: 40, freq: 261},
	{note: 41, freq: 277}, {note: 42, freq: 293}, {note: 43, freq: 311}, {note: 44, freq: 329},
	{note: 45, freq: 349}, {note: 46, freq: 369}, {note: 47, freq: 391}, {note: 48, freq: 415},
	{note: 49, freq: 440}, {note: 50, freq: 466}, {note: 51, freq: 493}, {note: 52, freq: 523},
	{note: 53, freq: 554}, {note: 54, freq: 587}, {note: 55, freq: 622}, {note: 56, freq: 659},
	{note: 57, freq: 698}, {note: 58, freq: 739}, {note: 59, freq: 783}, {note: 60, freq: 830},
	{note: 61, freq: 880}, {note: 62, freq: 932}, {note: 63, freq: 987}, {note: 64, freq: 1046}
];

// frequencies that fall below this bound will be treated as silent ("note 0")
var LOWER_FREQ_BOUNDS = 27;

// frequencies that fall above this bound will be capped at note 64
var UPPER_FREQ_BOUNDS = 4186;

/*
 *  Convert the input array of grouped frequency data objects (frequency and length) to notes.
 *  Return an array of objects containing note values and their length.
 */
function convertNote(noteArray) {
	updateStatus("Converting Notes...");

	var convertedNoteData = [];

	for (var i = 0, len = noteArray.length; i < len; i++) {
		var note = mapValues(noteArray[i].freq);
        var o = new Object();
        o.note = note;
        o.length = noteArray[i].length;
        convertedNoteData.push(o);
	}

	return convertedNoteData;	
}

/*
 *  Takes in a frequency value. Convert to the piano key value.
 */
function mapValues(inputValue) {
	var i = 0;
	var continueLoop = true;
	var noteNumber = 0;

	// frequencies that fall below this bound will be treated as silent
	if (inputValue <= LOWER_FREQ_BOUNDS) {
		// note 0 doesn't exist, but we use as a dummy value to indicate zero frequency
		noteNumber = 0;
		continueLoop = false;
	}

	// frequencies that fall above this bound will be capped as note 64
	else if (inputValue > UPPER_FREQ_BOUNDS) {
		noteNumber = 64;
		continueLoop = false;
	}

	// otherwise, cycle through the mapping array above to determine which note to map to
	while (i < (mappingArray.length - 1) && continueLoop == true) {
		// if found
		if (inputValue >= mappingArray[i].freq && inputValue < mappingArray[i+1].freq) {
			noteNumber = mappingArray[i].note;  // map to the corresponding note
			continueLoop = false;
		}
		else {  // continue looping
			i++;
		}

	}

	return noteNumber;
}