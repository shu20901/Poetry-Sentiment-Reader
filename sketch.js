let kMax;
let step;
let n; // number of blobs
let radius; // diameter of the circle
let inter; // difference between the sizes of two blobs
let maxNoise;
let noiseP = (x) => (x*x);
let data = [];
let wid = [];
//sentimentsec
let sentiment;
let statusEl;
let submitBtn;
let inputBox;
let sentimentResult;
let averageResult;
var score_array = [];
var avg;
let array_rounded;
var textarray;
function preload() {
  cusfont = loadFont('Manrope-VariableFont_wght.ttf');
}
function setup() {
  // initialize sentiment
  sentiment = ml5.sentiment('movieReviews', modelReady);
  // setup the html environment
  statusEl = createP('Loading Model...');
  inputBox = createElement('textarea');
  inputBox.attribute('cols',80);
  inputBox.attribute('rows',10);
  submitBtn = createButton('submit');
  dlBtn = createButton('Download');
  sentimentResult = createP('sentiment score:');
  averageResult = createP('average score:');
  // predicting the sentiment on mousePressed()
  submitBtn.mousePressed(getSentiment);
  //download img
  dlBtn.mousePressed(downloadimg);
  //draw
  createCanvas(800,1400);
  //colorMode(HSB, 1);
  angleMode(DEGREES);
  noFill();
  noLoop();
  kMax = random(0.5, 1);
  step = 0.05;
}

function getSentiment() {
  // get the values from the input
  const input = inputBox.value();
  var textarray=input.split("\n")
  console.log("text body: "+input.split("\n"))
  for (const strings of textarray) {
  console.log('sentence: '+strings);
    // make the prediction
  const prediction = sentiment.predict(strings);
  score_array.push(prediction.score);
  sentimentResult.html('Sentiment score: ' + score_array);
  console.log('Sentiment score: ' + prediction.score);
  }
  console.log('score array:' + score_array);
  //get average from the array
  var avg=eval(score_array.join('+'))/score_array.length
  console.log('paragraph avg:' +avg);
  averageResult.html('average score: ' + avg);
  //draw
  var n = score_array.length;
  var inter = avg;
  var radius = map(avg, 1, 0, 17, 28)
  var maxNoise = map(avg,1,0,300,380)
  background(255);
  line(300-2,500,302,500);
  line(300,500+2,300,500-2);
  for (let i = 0; i < n; i++) {
		let shift = 1 - noiseP(i / n)/2;
		//stroke(0.5, shift);
        stroke(0);
		let size = radius + i * inter;
		let k = kMax * sqrt(i/n);
		let noisiness = maxNoise * noiseP(i / n);
    blob(size, 300, 500, k, i * step, noisiness);
  }
    //bar
      push()
          strokeWeight(10);
          for(let i = 0; i < 100; i++) { 
              data[i]=map(score_array[i],0,1,10,500);
              wid[i]=map(score_array[i],0,1,0,2);
          }
        for (let i=0; i < data.length; i++) {
              strokeWeight(wid[i]);
              line(data[i], 0, data[i], 80);
        }
      pop()
    //text
      push();
        var s = 'avg: '+nf(avg, 0, 5)
        textSize(16); 
        textFont(cusfont);
        fill(0);
        text(s, 80, 800);
      pop();
      push();
        var s2 = nf(score_array, 0, 5);
        textSize(16); 
        textFont(cusfont);
        fill(0);
        for (let i = 0; i < n; i++) {  
          text(s2[i], 600, 340+(18*i));
        }
      pop();
      push();
        noStroke();
        textSize(14); 
        textFont(cusfont);
        for (let i = 0; i < n; i++) {  

          let theFill = map(score_array[i],0,1,0,225);
          if(theFill > 110){
          fill(theFill, 10, 10);} else {fill(10, 10, theFill);
          }
          //console.log("theFill: " + theFill);
          //console.log("to be mapped: " + score_array[i]);
          text(textarray[i], 140, 860+(16*i),800,1300);
        }
      pop();
}



function downloadimg(){
  saveCanvas('myCanvas', 'png');
}


function modelReady() {
  // model is ready
  statusEl.html('model loaded');
  console.log('Model Loaded');
}
function blob(size, xCenter, yCenter, k, t, noisiness) {
  beginShape();
	let angleStep = 360 / 500;
    for (let theta = 0; theta < 360; theta += angleStep) {
    let r1, r2;
		r1 = cos(theta)+1;
		r2 = sin(theta)+1;
    let r = size + noise(k * r1,  k * r2, t) * noisiness;
    let x = xCenter + r * cos(theta);
    let y = yCenter + r * sin(theta);
    curveVertex(x, y);
  }
  endShape(CLOSE);
}