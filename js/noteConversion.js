/*
 * An array that lists the notes of a piano and their frequencies.
 * Values are based on https://en.wikipedia.org/wiki/Piano_key_frequencies
 * Frequency values are rounded down to the nearest integer.
 * Upper cutoff: C6 Soprano (64)
 * Lower cutoff: C# (5)
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

var LOWER_FREQ_BOUNDS = 27;
var UPPER_FREQ_BOUNDS = 4186;

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

	console.log(convertedNoteData);
	return convertedNoteData;
	
}

function convertNoteA(noteArray) {
	updateStatus("Converting Notes...");

	var convertedNoteData = [];

	for (var i = 0, len = noteArray.length; i < len; i++) {
		var note = mapValues(noteArray[i]);
        var o = new Object();
        o.note = note;
        convertedNoteData.push(o);
	}

	console.log(convertedNoteData);
	return convertedNoteData;
	
}

/**
 * Takes in a frequency value. Convert to the piano key value.
 */
function mapValues(inputValue) {
	/*
	 * Values are rounded down for simplicity.
	 * Upper cutoff: high c (64)
	 * Lower cutoff: C# (5)
	 */
	// console.log(mappingArray);

	// CHANGE TO BINARY SEARCH?
	var i = 0;
	var continueLoop = true;
	var keyNumber = 0;

	while (i < (mappingArray.length - 1) && continueLoop == true) {

		if (inputValue <= LOWER_FREQ_BOUNDS) {
			// console.log("input value " + inputValue + " is less than min");
			keyNumber = 0;
			continueLoop = false;
		}
		else if (inputValue > UPPER_FREQ_BOUNDS) {
			// console.log("input value " + inputValue + " is more than max");
			keyNumber = 64;
			continueLoop = false;
		}
		else {
			if (inputValue >= mappingArray[i].freq && inputValue < mappingArray[i+1].freq) {
				// console.log("input value " + inputValue + " mapped to note " + mappingArray[i].note);
				keyNumber = mappingArray[i].note;
				continueLoop = false;
			}
			else {
				i++;
			}
		}

	}

	return keyNumber;
}