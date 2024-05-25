let balls = [];
const numBalls = 50;
const ballSize = 30;
let explosions = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < numBalls; i++) {
    let x = random(width);
    let y = random(height);
    let ballColor = color(random(255), random(255), random(255));
    balls.push(new Ball(x, y, ballSize, ballColor));
  }
}

function draw() {
  background(0, 0, 140);
  for (let i = explosions.length - 1; i >= 0; i--) {
    explosions[i].update();
    explosions[i].display();
    if (explosions[i].isFinished()) {
      explosions.splice(i, 1);
    }
  }

  for (let i = 0; i < balls.length; i++) {
    balls[i].move();
    balls[i].checkEdges();
    for (let j = i + 1; j < balls.length; j++) {
      if (balls[i].checkCollision(balls[j])) {
        let explosion = new Explosion(balls[i].x, balls[i].y);
        explosions.push(explosion);
      }
    }
    balls[i].show();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Ball {
  constructor(x, y, size, ballColor) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.ballColor = ballColor;
    this.speed = 5;
    this.angle = random(TWO_PI);
    this.isColliding = false;
    this.originalColor = ballColor;
  }

  show() {
    noStroke();
    fill(this.ballColor);
    ellipse(this.x, this.y, this.size);
  }

  move() {
    let dx = cos(this.angle) * this.speed;
    let dy = sin(this.angle) * this.speed;
    this.x += dx;
    this.y += dy;
  }

  checkEdges() {
    let hitEdge = false;
    if (this.x + this.size / 2 > width || this.x - this.size / 2 < 0) {
      this.angle = PI - this.angle;
      this.x = constrain(this.x, this.size / 2, width - this.size / 2);
      hitEdge = true;
    }
    if (this.y + this.size / 2 > height || this.y - this.size / 2 < 0) {
      this.angle = -this.angle;
      this.y = constrain(this.y, this.size / 2, height - this.size / 2);
      hitEdge = true;
    }
    if (hitEdge) {
      this.ballColor = color(random(255), random(255), random(255));
      this.isColliding = true;
    }
  }

  checkCollision(other) {
    let d = dist(this.x, this.y, other.x, other.y);
    if (d < this.size) {
      let angle1 = atan2(this.y - other.y, this.x - other.x);
      let angle2 = atan2(other.y - this.y, other.x - this.x);

      this.angle = angle1;
      other.angle = angle2;

      let overlap = this.size - d;
      this.x += cos(angle1) * overlap / 2;
      this.y += sin(angle1) * overlap / 2;
      other.x += cos(angle2) * overlap / 2;
      other.y += sin(angle2) * overlap / 2;

      return true;
    }
    return false;
  }
}

class Explosion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.alpha = 255;
  }

  update() {
    this.radius += 5;
    this.alpha -= 10;
  }

  display() {
    noFill();
    stroke(255, this.alpha);
    ellipse(this.x, this.y, this.radius * 2);
  }

  isFinished() {
    return this.alpha <= 0;
  }
}

document.getElementById('motion').onclick = requestMotionPermission;
window.addEventListener('deviceorientation', handleOrientation);

function handleOrientation(event) {
  let tiltLR = event.gamma;
  let tiltFB = event.beta;
  let dir = 90;
  let rotation = event.alpha;

  let angle = radians(dir - rotation);
  for (let i = 0; i < balls.length; i++) {
    balls[i].angle = angle;
  }
}
