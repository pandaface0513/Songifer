var canvas = document.getElementById('canvas');
canvasContext = canvas.getContext('2d');

var req = new XMLHttpRequest();

var fft;

var SAMPLE_SIZE = 512;

var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;

var BAR_WIDTH = CANVAS_WIDTH / (SAMPLE_SIZE/3);

// This data object will get populated with harmonics.
var data = new Uint8Array(SAMPLE_SIZE);

var RGB_SCALE = 255;

var HUE_SCALE = 60;
var SATURATION_SCALE = 255;
var BRIGHTNESS_SCALE = 100;

function hsv2rgb(colour) {
  var h = (colour[0] / HUE_SCALE) % 6 ; if (h < 0) { h += 6; }
  var s = colour[1] / SATURATION_SCALE;
  var v = colour[2] / BRIGHTNESS_SCALE;

  var fl = Math.floor(h);
  var di = h - fl;
  var ax = v * (1 - s);
  var bx = v * (1 - di * s);
  var cx = v * (1 - (1 - di) * s);

  var r = v;
  var g = v;
  var b = v;

  // Below, n < m <= p is the same as n == floor(m)
  //
  // The following switch statement will automatically ignore cases when `h` is
  // mathematically "undefined".

  switch (fl) {
    case 0: r = v ; g = cx; b = ax; break;
    case 1: r = bx; g = v ; b = ax; break;
    case 2: r = ax; g = v ; b = cx; break;
    case 3: r = ax; g = bx; b = v ; break;
    case 4: r = cx; g = ax; b = v ; break;
    case 5: r = v ; g = ax; b = bx; break;
  }

  // For this assignment, we really don't need to worry about returning
  // integers, since, later on, we will be applying the bitwise shift operators
  // on the channels, and the mere act of calling the bitwise shift operator
  // converts a 16-bit floating point number into a 32-bit signed integer, in
  // JavaScript.

  return [r * RGB_SCALE, g * RGB_SCALE, b * RGB_SCALE ];
}

// This is for our visualizer
function animate() {
  requestAnimationFrame(animate);

  // Clear the screen.
  canvasContext.fillStyle = 'rgba(0, 0, 0, 0.1)';
  canvasContext.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // The harmonics data is in a logarithmic scale.
  // Varies from 0 to 255.
  fft.getByteFrequencyData(data);

  var colours = ['red', 'green', 'blue']

  // canvasContext.fillStyle = 'red';
  for (var i = 0; i < SAMPLE_SIZE/3; i++) {
    var hue = (i/(SAMPLE_SIZE/3))*360;
    var rgb = hsv2rgb([hue, 255, 100]);
    canvasContext.fillStyle =
      'rgb(' +
        Math.floor(rgb[0]) + ',' +
        Math.floor(rgb[1]) + ',' +
        Math.floor(rgb[2]) + ')'
    canvasContext.fillRect(
      i * BAR_WIDTH,
      Math.floor(CANVAS_HEIGHT - (CANVAS_HEIGHT*(data[i] / 255))),
      BAR_WIDTH,
      Math.floor(CANVAS_HEIGHT * (data[i] / 255) + 100)
    );
  }
}

// start the visualizer once we receive the data
function startVisualizer() {
  fft = context.createAnalyser();
  fft.fftSize = SAMPLE_SIZE;

  mediaStreamSource.connect(fft);

  //fft.connect(context.destination);
  animate();
}
