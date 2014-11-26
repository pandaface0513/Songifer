var ooo, vca;

function initOscillator(){
    ooo = context.createOscillator();
    ooo.type = ooo.SINE;
    ooo.frequency.value = 0;
    ooo.start(0);
    
    //gain?
    vca = context.createGain();
    vca.gain.value = 0;
    
    /*connections*/
    ooo.connect(vca);
    vca.connect(context.destination);
}

var num, len, group_data;

function playFreq(data){
    //update status
    updateStatus("playing some freaking tone");
    
    group_data = data;
    len = data.length;
    num = 0;
    
    setInterval(pushNote, 50);
}

function pushNote(){
    if(num < len){
        ooo.frequency.value = group_data[num];
        vca.gain.value = 1;
        num++;
        console.log("playing" + ooo.frequency.value);
    }else{
        num = 0;
        //ooo.stop();
    }
}