//global variables
let song = [];
let playingSong;
let afterSong;
let lastSong;
let durationPlayed;
let fft; //p5 object allows for sound analysis
let colors = [
  " #ed3441",
  " #ffd630",
  " #329fe3",
  " #c4071d",
  " #ff9f1c",
  " #0056A2",
  " #06402B",
  " #32CD32",
  " #8359a3",
  " #CC338B",
];
let startPos = [];
let walkers = [];
///////////////////////////////////////

function preload() {
  song.push(loadSound("limerence.mp3"));
  song.push(loadSound("ghandi.mp3"));
  song.push(loadSound("blackradio.mp3"));
  song.push(loadSound("bluu.mp3"));
  song.push(loadSound("dream.mp3"));
  song.push(loadSound("fin.mp3"));
  song.push(loadSound("frailure.mp3"));
  song.push(loadSound("infatuated.mp3"));
  song.push(loadSound("kare.mp3"));
  song.push(loadSound("meshtop.mp3"));
  song.push(loadSound("melanated.mp3"));
  song.push(loadSound("melanoid.mp3"));
  song.push(loadSound("microchip.mp3"));
  song.push(loadSound("milk.mp3"));
  song.push(loadSound("noanswer.mp3"));
  song.push(loadSound("rebirth.mp3"));
  song.push(loadSound("shackback.mp3"));
  song.push(loadSound("spurn.mp3"));
  song.push(loadSound("whathh.mp3"));
}

function doubleClicked() {
  // clear();
  // createCanvas(windowWidth, windowHeight);
  // background(0);
  playingSong = random(song);
  playingSong.play();
  playingSong.duration();
  console.log(playingSong.duration());
}

function keyPressed() {
  playingSong.pause();
}

////////////////////////////////////////

function setup() {
  //pixelDensity(0.5);
  createCanvas(windowWidth, windowHeight);
  background(0);

  startPos = [
    [random(width), random(height)], // anywhere
    [width, 0], // top right
    [0, 0], // top left
    [width, height], // bottom right
    [0, height], // bottom left (i do not like this one add constraints)
    [width / 2, height / 2], // middle
    [0, random(height)], // anywhere on the left side
    [width, random(height)], // anywhere on the right side
    [random(width), 0], // anywhere on the top
    [random(width), height], // anywhere on the bottom
    [width / 2, height], // bottom middle
    [0, width / 2], // left side middle
    [width, height / 2], // right side middle
    [width / 2, 0], // top middle
  ];

  let chosenStartPos = random(startPos); // Randomly pick a start position from array above
  console.log(windowWidth, windowHeight);
  console.log(chosenStartPos);

  // Create a random number of walkers initially, push them into the array, then draw after
  let numWalkers = floor(random(5, 50));
  for (let i = 0; i < numWalkers; i++) {
    let frequencyIndex = floor(random(256)); // There are 32 frequency bins in fft
    walkers.push(
      new Walker(chosenStartPos[0], chosenStartPos[1], frequencyIndex)
    );
  } // Assign FFT bin to each walker as they are created and pushed

  console.log(numWalkers);

  fft = new p5.FFT(0, 256); // (array of indices "bins"-- range of tones searched for in program)
}

/////////////////////////////////////////////

function draw() {
  for (let i = 0; i < walkers.length; i++) {
    walkers[i].step();
    walkers[i].display();
  }
}

////////////////////////////////////////////////
//class for walker object
class Walker {
  //properties
  constructor(startX, startY, frequencyIndex) {
    this.x = startX;
    this.y = startY;
    this.color = random(colors); // assign color to each walker
    this.frequencyIndex = frequencyIndex; //to grab from fft data set
    this.stopWalking = false; // is the frequency playing rn
  }
  
  //////////////////////////////////////////////
  display() {
    let spectrum = fft.analyze();
    let amp = spectrum[this.frequencyIndex]; // Get the amp of frequency

    stroke(this.color);
    strokeWeight(1);
    fill(this.color);
    point(this.x, this.y); 
  }

  //update{}

  step() {
    let spectrum = fft.analyze();
    let amp = spectrum[this.frequencyIndex]; // Get the amp of frequency
    let stopWalking;

    /////// otional stop if you dont hear it//////
    // if (amp < 5) {
    //   this.stopWalking = true;
    // } else {
    //   this.stopWalking = false;
    // }

    if (this.stopWalking === false) {
      let direction = map(amp, 1, 255, 1, 6); // control "speed" with dramatic range
      let choice = floor(random(5));

      if (choice === 0) {
        this.x += direction;
      } else if (choice === 1) {
        this.x -= direction;
      } else if (choice === 2) {
        this.y -= direction;
      } else if (choice === 3) {
        this.y += direction;
      } else if (choice === 4) {
        // Do nothing --dynamicism
      }
    }

    //check walls
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }
}