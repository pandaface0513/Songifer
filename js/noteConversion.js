var mappingArray = [
	{note: 5,  freq: 34}, {note: 6,  freq: 36}, {note: 7,  freq: 38}, {note: 8,  freq: 41},
	{note: 9,  freq: 43}, {note: 10, freq: 46}, {note: 11, freq: 48}, {note: 12, freq: 51},
	

	{note: 20, freq: 82},
	{note: 30, freq: 146},
	{note: 40, freq: 261},
	{note: 50, freq: 466},
	{note: 60, freq: 830},
	{note: 64, freq: 1046}];

var LOWER_FREQ_BOUNDS = 27;
var UPPER_FREQ_BOUNDS = 4186;

function convertNote(noteArray) {
	for (var i = 0, len = noteArray.length; i < len; i++) {
		mapValues(noteArray[i]);
	}
	
}

/**
 * Takes in a frequency value. Convert to the key number.
 * Values are based on https://en.wikipedia.org/wiki/Piano_key_frequencies
 */
function mapValues(inputValue) {
	/*
	 * Values are rounded down for simplicity.
	 * Upper cutoff: high c (64)
	 * Lower cutoff: C# (5)
	 */
	// console.log(mappingArray);

	// CHANGE TO BINARY SEARCH?
	for (var i = 0, len = mappingArray.length; i < len - 1; i++) {
		// console.log(mappingArray.length);
		if (inputValue <= LOWER_FREQ_BOUNDS) {
			console.log("input value " + inputValue + " is less than min");
		}
		else if (inputValue > UPPER_FREQ_BOUNDS) {
			console.log("input value " + inputValue + " is more than max");
		}
		else {
			if (inputValue >= mappingArray[i].freq && inputValue < mappingArray[i+1].freq) {
				console.log("input value " + inputValue + " mapped to freq " + mappingArray[i].note);
			}
			// else {
			// 	console.log("value " + inputValue + " cannot be mapped");
			// }
		}

	}
}