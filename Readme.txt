                               ,|     
                             //|                              ,|
                           //,/                             -~ |
                         // / |                         _-~   /  ,
                       /'/ / /                       _-~   _/_-~ |
                      ( ( / /'                   _ -~     _-~ ,/'
                       \~\/'/|             __--~~__--\ _-~  _/,
               ,,)))))));, \/~-_     __--~~  --~~  __/~  _-~ /
            __))))))))))))));,>/\   /        __--~~  \-~~ _-~
           -\(((((''''(((((((( >~\/     --~~   __--~' _-~ ~|
  --==//////((''  .     `)))))), /     ___---~~  ~~\~~__--~ 
          ))| @    ;-.     (((((/           __--~~~'~~/
          ( `|    /  )      )))/      ~~~~~__\__---~~__--~~--_
             |   |   |       (/      ---~~~/__-----~~  ,;::'  \         ,
             o_);   ;        /      ----~~/           \,-~~~\  |       /|
                   ;        (      ---~~/         `:::|      |;|      < >
                  |   _      `----~~~~'      /      `:|       \;\_____// 
            ______/\/~    |                 /        /         ~------~
          /~;;.____/;;'  /          ___----(   `;;;/               
         / //  _;______;'------~~~~~    |;;/\    /          
        //  | |                        /  |  \;;,\              
       (<_  | ;                      /',/-----'  _>
        \_| ||_                     //~;~~~~~~~~~ 
            `\_|                   (,~~ 
                                    \~\ 
                                     ~~ 

### TITLE: Songifer! ###


## Requirement from Matt
# Conversation into Music (Salehen Edition)
Our application is a slightly modified version of the Conversation into Music project stream. Instead of taking in recordings from the user’s microphone as-is and layering several of them, we instead allow the user to record a single clip, and our app will generate a unique synthetic melody composition.

We implemented user-specified tempo adjustment by creating a "tempo modifier", which corresponds to the interval between notes. The value makes notes closer together or further away. The bigger the number, the higher the speed that the audio is played back.

In addition, we have several audio effects to make our audio sound better. For example, we have highpass and highshelf filters to treat frequencies that are below and above our cutoff, respectively. In addition, we added in smaller feedback and delay effects to make the output sound more natural.

We didn’t implement user-manageable clips because it doesn’t fit as well with our modified approach to the project idea (the synthetic melody instead of raw microphone input), and because it took us more effort and time to get the main functionality of our app working.




## Instructions for Using Our Application
   1. Adjust the record time (second) and the tempo modifier beforehand.
   2. Click the “record” button to start recording
   3. Speak freely into the microphone, vary the length for better results
   4. When the predetermined time is passed, the resulted tone will be play
   5. Let the tone play for the amount of time you wish to export, then click the “export” button.
   6. A download link will appear for you to download the resulted tone as a .wav file.





## Technical Details
# Step 1: Getting the Data
* We have one type of input, which is from the user's microphone
    * navigator.getUserMedia({audio:true});
                                                                                                                 
* When the "record" button is pressed, record from mic for a set interval
   * One thread pushes the music's frequency data values to an array cumulatively
   * Another thread does time management
   
# Step 2: Manipulating the Data
Once recording is complete, do post-processing.
   * Group the data: when multiple consecutive frequency values are encountered, group them together and add a length: 
   * {note: 5, freq: 34 }, {note: 6, freq: 36 }, ... {note: 63, freq: 987}, {note: 64, freq: 1046}

# Step 3: Manipulating the Data (continued)
   * Regroup the notes again in case we have any new consecutive notes
   * Create a music sheet
   * Based on Workshop 7 code, with modifications made so that it will accept the note data format we created
   
# Step 4: Output Synthesized Audio
   * Play back the synthesized audio composition
   * Also based on the Workshop 7 code
   * Our ideal outputs would be both a graphic visualizer and a melody created from the input. However, based on our time constraints, we likely won't be able to achieve both.
   
   
   
   
## Technical Analysis
# Novel code
   * Generating a melody in JavaScript based on microphone input is a new idea
   * Grouping of notes
   * Mapping algorithm
# Performance & Optimization
   * No performance issues so far
   * Threads are managed properly
   * Too much linear searching
# Technical Issues & Challenges
   * We are able to generate a tone out of the user inputs, however the range of the tones aren’t very huge. We seems to be getting similar inputting frequencies...which results in similar outputs
   * Unable to analyze the exact audio data being outputted




## Each 3rd party library, what they do, why we’re including them
   * Tuna.js
   * Helps smooth out the static feedbacks from our resulted tone
   * Dat.GUI.js
   * Provide our GUI for the sliders and buttons
   * Pitch.js
   * Provide a frequency detection method from the fft data we acquired from the microphone input.
   * FFT.js
   * Required for Pitch.js library to function
   * Recorder.js
   * Provide a mean to record the Web Audio and export it to .wav file




## Each 1st party code! what they do, the pipeline!
   * Doing the recording
   
   * When “record” is clicked, record from microphone for user-specified time
   
   * Pipeline (for post recording)
   1.  group the data
   2. convert to notes
   3. regrouping the notes
   4. create music sheet
   5.  play music
   
   
   * Main.js: This is the first script that is loaded in our application. It initializes items such as the context and the GUI, and makes
     calls to other, more specific scripts/functions.
   * audioTools.js: Functions to support generating and playing the music. These are called once recording is finished.
   * getFreq.js: Contains functions that handle recording audio, as well as getting frequency and pitch data.
   * grouping.js: The script handles grouping of the frequencies / notes.
   * noteConversion.js: Convert raw audio data into notes based on frequencies, similar to piano keys.
   * salehen.js: Exactly the same as audio.js from Workshop 7. It outputs music tones according to the input json (referred as music sheet in our code)
   * visualizer.js: Code to display the graphical visualizer and the FFT analyzer. This is a somewhat modified version of the Workshop 6's main-rainbow.js code.