let handpose;
let video;
let predictions = [];
let modelLoaded = false;
let appleImg;
let BombImg;
let x = 155;
let y = 255;
let BombX = 155;
let BombY = 255;
let points = 0;
let lives = 3;

function preload() {
  appleImg = loadImage('Middel 1.png');
  BombImg = loadImage('Middel 4.png');
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  handpose = ml5.handpose(video, modelReady);

  handpose.on("predict", results => {
    predictions = results;
    console.log(predictions);
  });

  video.hide();

  setInterval(updateApplePosition, 2000);
  setInterval(updateBombPosition, 3000);
}

function modelReady() {
  console.log("Model ready!");
  modelLoaded = true;
}

function draw() {
  frameRate(30);
  if (modelLoaded) {
    translate(width, 0);
    scale(-1, 1);

    image(video, 0, 0, width, height);
    drawFingers();
    drawApple();
    drawBomb();
    hit();

    resetMatrix();
    textSize(24);
    fill(255);
    textAlign(LEFT);
    text("Points: " + points, 20, 40);
    text("Lives: " + lives, 20, 80);

    // Controleer of het spel voorbij is
    if (lives <= 0) {
      showGameOver();
    }
  }
}

function updateApplePosition() {
  x = random(width);
  y = random(height);
}

function updateBombPosition() {
  BombX = random(width);
  BombY = random(height);
}

function drawFingers() {
  push();
  rectMode(CORNERS);
  noStroke();
  fill(255, 0, 0);
  if (predictions[0] && predictions[0].hasOwnProperty('annotations')) {
    let index1 = predictions[0].annotations.indexFinger[0];
    let index2 = predictions[0].annotations.indexFinger[1];
    let index3 = predictions[0].annotations.indexFinger[2];
    let index4 = predictions[0].annotations.indexFinger[3];

    circle(index4[0], index4[1], 10);
    xcord = index4[0];
    ycord = index4[1];
  }
  pop();
}

function drawApple() {
  image(appleImg, x - 25, y - 30, 50, 60); 
}

function drawBomb() {
  image(BombImg, BombX - 25, BombY - 30, 50, 60);
}

function hit() {
  if (Math.abs(xcord - x) < 25 && Math.abs(ycord - y) < 30) {
    points++;
    updateApplePosition(); 
  } else if (Math.abs(xcord - BombX) < 25 && Math.abs(ycord - BombY) < 30) {
    points++;
    lives--;
    updateBombPosition();
  } else {
    // Geen verandering in levens
  }
}

function showGameOver() {
  textSize(48);
  textAlign(CENTER, CENTER);
  fill(255, 0, 0);
  text("Game Over", width / 2, height / 2);
  textSize(24);
  fill(255);
  text("Final Score: " + points, width / 2, height / 2 + 50);
  noLoop(); // Stop de draw loop om te voorkomen dat het spel doorgaat
}
