/*-- The Script will handle grouping of the frequency --*/

function grouping(raw){
    //update the status
    updateStatus("Organizing Raw Data...")
    //set up empty variables
    var group_data = [];    //empty array
    var freq = 0;           //0 should be silent
    var length = 1;         //storing re-occurances
    //loop the array
    for(var i=0; i<raw.length; i++){
        //check if stored freq matches with the raw
        //if it occurs again, just increases the length
        if(freq == raw[i]){
            length++;
        }else{
            //create new objects
            o = new Object();
            //insert the freq and length of it
            o.freq = freq;
            o.length = length;
            //push to the new array
            group_data.push(o)
            //reset the new freq and length
            freq = raw[i];
            length = 1;
        }
    }
    return group_data;
}

function groupingAgain(notes){
    //update the status
    updateStatus("Organizing Notes...");
    //set up empty variables
    var group_note = [];    //empty array
    var note = 0;
    var length = 1;
    //loop the array
    for(var i=0; i<notes.length; i++){
        //check if stored note matches with the notes
        if(note == notes[i].note){
            //if it occurs again, add the length to the stored length
            length += notes[i].length;
        }else{
            //create new objects
            o = new Object();
            //insert the note and length of it
            o.note = note;
            o.length = length;
            //push to the new array
            group_note.push(o);
            //reset the new note and length
            note = notes[i].note;
            length = 1;
        }
    }
    return group_note;
}