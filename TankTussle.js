//sound variables
window.themeTunePlayed = false; 


// Explosion variables
let explosionTimer = 0;
const maxCircles = 30;
const explosionRadius = 50;
let activeExplosions = [];

// Game Variables
let angle;
let speed;
let tank1, tank2;
const tankMovementSpeed = 2; // Speed at which tanks move left or right
let projectile;
let backgroundImage;
let circles = [];
let gameStarted = false; // Indicates if the game has started (welcome screen)
gameOver = false; // Game not over
let welcomeThemePlayed = false;




// Load background image in preload
function preload() {
  backgroundImage = loadImage("assets/background1.jpg");
  titleImage = loadImage("assets/titleImage.png");
}

function setup() {
  createCanvas(800, 400);
  initializeGameVariables(); // Reset game variables
  setInterval(() => {
    if (gameStarted && !gameOver) {
      timer--;
      if (timer <= 0) {
        gameOver = true; // Game ends when timer reaches zero
        window.stopTheme();
        window.victorySound();
      }
    }
  }, 1000); // Timer decreases every second
}


// Draw function to manage the welcome screen and gameplay
function draw() {
  if (!gameStarted) {
    drawWelcomeScreen(); // Draw the welcome screen
  } else {
    // If the game has just started, play the theme tune
    if (!window.themeTunePlayed) {
      
      window.playThemeTune();
      window.themeTunePlayed = true;
    }
    drawGame(); // Draw the game scene
  }
}


function startGame() {
  gameStarted = true; // Set game started flag
}

function drawWelcomeScreen() {
  if (!welcomeThemePlayed) {
    window.welcomeTheme();
    welcomeThemePlayed = true; // Set the flag to true after playing
  }
  // Create a gradient background from dark gray to light gray
  const gradientSteps = 50; // Number of gradient steps
  const bottomColor = color(50); // Dark gray
  const topColor = color(150); // Light gray

  // Draw gradient from bottom to top
  for (let i = 0; i < gradientSteps; i++) {
    let interColor = lerpColor(bottomColor, topColor, i / (gradientSteps - 1));
    fill(interColor); // Interpolated fill color
    noStroke(); // No border
    rect(0, (i / gradientSteps) * height, width, height / gradientSteps); // Draw gradient
  }

  // Draw the preloaded title image at the center
  const titleImageWidth = 700; // Adjust width as needed
  const titleImageHeight = 70; // Adjust height as needed
  const titleImageX = (width - titleImageWidth) / 2; // Center the image horizontally
  const titleImageY = 111; // Adjust vertical position as needed
  image(titleImage, titleImageX, titleImageY, titleImageWidth, titleImageHeight); // Draw the title image

  // Draw the start button
  fill(0, 100, 0); // Dark green button
  rect(width / 2 - 100, height / 2, 200, 50, 10); // Start button with rounded corners
  fill(255);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("PRESS TO START", width / 2, height / 2 + 25); // Button text

  // Check if the start button is clicked
  if (mouseIsPressed && 
      mouseX > width / 2 - 100 && 
      mouseX < width / 2 + 100 &&
      mouseY > height / 2 && 
      mouseY < height / 2 + 50) {
        window.stopWelcomeTheme();
        window.buttonNoise();
      startGame(); // Start the game
  }

  // Ensure there are always three active explosions
  if (activeExplosions.length < 3) {
    const randomX = random(width);
    const randomY = random(height);
    const randomColor = color(random(255), random(255), random(255)); // Random RGB color
    activeExplosions.push({
      x: randomX,
      y: randomY,
      color: randomColor, // Assign random color
      timer: 0, // Timer for the explosion
      circles: [], // List of circles in the explosion
    });
  }

  // Handle and display active explosions
  activeExplosions.forEach((explosion, index) => {
    // Add circles to each explosion
    if (explosion.timer < maxCircles) {
      const angle = random(TWO_PI); // Random angle
      const distance = random(explosionRadius); // Random distance
      const offsetX = cos(angle) * distance;
      const offsetY = sin(angle) * distance;
      explosion.circles.push({
        x: explosion.x + offsetX,
        y: explosion.y + offsetY,
        diameter: 0,
        growthRate: random(0.5, 1),
        maxDiameter: random(10, 30),
        opacity: 255,
        fadeRate: 2.1,
      });
      explosion.timer++; // Increment the explosion timer
    }

    // Update and display circles in each explosion
    explosion.circles.forEach((circle) => {
      if (circle.diameter < circle.maxDiameter) {
        circle.diameter += circle.growthRate; // Grow the diameter
      }
      circle.opacity -= circle.fadeRate; // Fade the opacity

      fill(red(explosion.color), green(explosion.color), blue(explosion.color), circle.opacity); // Apply color with opacity
      stroke(red(explosion.color), green(explosion.color), blue(explosion.color), circle.opacity); // Outline with opacity
      strokeWeight(2);
      ellipse(circle.x, circle.y, circle.diameter); // Draw the explosion circle
    });

    // Remove circles that are done
    explosion.circles = explosion.circles.filter((circle) => circle.opacity > 0);

    // If the explosion is done, remove it from the list
    if (explosion.circles.length === 0) {
      activeExplosions.splice(index, 1); // Remove this explosion
    }
  });
}





// Function to start the game (transition from welcome screen to gameplay)

function drawGround() {
  // Ground parameters
  const groundY = height - 36; // Y-coordinate of the ground
  const brickWidth = 20; // Width of each brick
  const brickHeight = 8; // Height of each brick
  const brickSpacing = 5; // Space between bricks
  const brickColor = color(45); // Dark gray color for bricks
  const groundColor = color(5); // Black color for background

  // Fill the ground with black background
  fill(groundColor); // Set background color
  noStroke(); // No border
  rect(0, groundY, width, height - groundY); // Draw the black background

  // Fill the entire ground area with staggered bricks
  for (let y = groundY; y < height; y += brickHeight + brickSpacing) {
    let staggerOffset = 0;

    // Stagger every other row of bricks
    if ((y - groundY) % (2 * (brickHeight + brickSpacing)) === 0) {
      staggerOffset = brickWidth / 2; // Shift the bricks for a staggered effect
    }

    // Draw bricks across the width of the canvas
    for (let x = -staggerOffset; x < width; x += brickWidth + brickSpacing) {
      fill(brickColor);
      rect(x, y, brickWidth, brickHeight); // Draw each brick
    }
  }
}


function drawGame() {
  // Draw the background and ground
  image(backgroundImage, 0, 0, width, height); // Background image

  drawGround(); // drawing pixelated ground 

  // Display the timer at the top center of the screen
  textSize(20);
  fill(255);
  textAlign(CENTER, CENTER);
  text("Timer: " + timer + "s", width / 2, 30);

  // Handle gameplay logic only if not game over
  if (!gameOver) {
    handleGameplay(); // Handle the main gameplay logic
  } else {
    handleGameOver(); // Handle the game over logic and "Play Again?" button
  }
}

// Handle the main gameplay logic, including movement and firing
function handleGameplay() {
  // Move the current tank 
  if (keyState[DOWN_ARROW]) { 
    currentTank.x = max(0, currentTank.x - tankMovementSpeed); // Move left, stay within bounds
  }
  if (keyState[UP_ARROW]) { 
    currentTank.x = min(width - currentTank.width, currentTank.x + tankMovementSpeed); // Move right, stay within bounds
  }

  // Adjust firing angle with arrow keys
  if (keyState[LEFT_ARROW]) {
    angle += PI / 180; // Increase angle
  }
  if (keyState[RIGHT_ARROW]) {
    angle -= PI / 180; // Decrease angle
  }

  // Draw tanks and health indicators
  drawTank(tank1);
  drawTank(tank2);

  // Display health
  textSize(20);
  fill(255); // White text color
  text("Player 1 HP: " + tank1.health, 200, 30); // Player 1's health
  text("Player 2 HP: " + tank2.health, 600, 30); // Player 2's health

  // Draw the trajectory line for the current tank
  push();
  stroke(0, 255, 0);
  translate(currentTank.x + currentTank.width / 2, currentTank.y - currentTank.height);
  rotate(-angle);
  line(0, 0, 30, 0); // Firing direction line
  pop();

  // Handle projectile movement and collisions
  if (projectileFired) {
    fill('green');
    ellipse(projectile.x, projectile.y, 10, 10); // Draw the projectile

    // Update projectile position with gravity effect
    projectile.x += projectile.vx;
    projectile.y += projectile.vy;
    projectile.vy += 0.08; // Gravity effect

    // Check for ground contact or tank collision
    if (projectile.y >= height - 36) {
      triggerExplosion(projectile.x, projectile.y); // Ground impact
      projectileFired = false;
      switchControl(); // Switch control after firing
    } else if (
      checkCollision(projectile, tank1) ||
      checkCollision(projectile, tank2)
    ) {
      triggerExplosion(projectile.x, projectile.y); // Tank impact
      projectileFired = false;

      // Update health and check for winner
      if (checkCollision(projectile, tank1)) {
        tank1.health--; // Decrease Player 1's health
      }

      if (checkCollision(projectile, tank2)) {
        tank2.health--; // Decrease Player 2's health
      }

      if (tank1.health <= 0) {
        winner = 2; // Player 2 wins
        gameOver = true;
        window.stopTheme();
        window.victorySound();
      } else if (tank2.health <= 0) {
        winner = 1; // Player 1 wins
        gameOver = true;
        window.stopTheme();
        window.victorySound();
      }

      switchControl(); // Switch control after collision
    }
  }

  // Handle explosions
  if (explosionActive) {
    if (explosionTimer < maxCircles) {
      addCircle();
      explosionTimer++;
    }

    circles.forEach((circle) => {
      circle.update();
      circle.display(); // Display explosion circles
    });

    // Remove finished circles
    circles = circles.filter((circle) => !circle.isDone());

    if (circles.length === 0) {
      explosionActive = false; // Reset the explosion flag
      explosionTimer = 0; // Reset the explosion timer
    }
  }
}

// Function to handle the game over logic and "Play Again?" button
function handleGameOver() {
  textSize(32);
  fill(255); // White text color
  textAlign(CENTER, CENTER);

  if (winner) {
    text("Player " + winner + " Wins!", width / 2, height / 2); // Display the winner
  } else {
    text("Times Up! It's A Tie!", width / 2, height / 2); // Display a tie message
  }

  // Add random explosions during game over
  const explosionFrequency = 10; // Frequency of explosions (lower value = more frequent)
  if (frameCount % explosionFrequency === 0) { // Add explosion at a high rate
    const randomX = random(width);
    const randomY = random(height);
    activeExplosions.push({
      x: randomX,
      y: randomY,
      timer: 0, // Timer for the explosion
      circles: [], // List of circles in the explosion
    });
  }

  // Handle and display active explosions during game over
  activeExplosions.forEach((explosion, index) => {
    // Add circles to each explosion
    if (explosion.timer < maxCircles) {
      const angle = random(TWO_PI); // Random angle
      const distance = random(explosionRadius); // Random distance
      const offsetX = cos(angle) * distance;
      const offsetY = sin(angle) * distance;
      explosion.circles.push({
        x: explosion.x + offsetX,
        y: explosion.y + offsetY,
        diameter: 0,
        growthRate: random(0.5, 1),
        maxDiameter: random(10, 30),
        opacity: 255,
        fadeRate: 2.1,
      });
      explosion.timer++; // Increment the explosion timer
    }

    // Update and display circles in each explosion
    explosion.circles.forEach((circle) => {
      if (circle.diameter < circle.maxDiameter) {
        circle.diameter += circle.growthRate; // Increase diameter
      }
      circle.opacity -= circle.fadeRate; // Fade opacity

      fill(255, 200, 0, circle.opacity); // Yellow fill with opacity
      stroke(239, 34, 90, circle.opacity); // Red outline with opacity
      strokeWeight(2);
      ellipse(circle.x, circle.y, circle.diameter); // Draw the explosion circle
    });

    // Remove circles that are done
    explosion.circles = explosion.circles.filter((circle) => circle.opacity > 0);

    // If an explosion is done, remove it from the list
    if (explosion.circles.length === 0) {
      activeExplosions.splice(index, 1); // Remove this explosion
    }
  });

  // Display "Play Again?" button
  fill(0, 100, 0); // Dark green button
  rect(width / 2 - 50, height / 2 + 30, 100, 40, 10); // Rounded corners
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(16);
  text("Play Again?", width / 2, height / 2 + 50); // Button text

  // Check if the "Play Again?" button is clicked
  if (mouseIsPressed &&
      mouseX > width / 2 - 50 &&
      mouseX < width / 2 + 50 &&
      mouseY > height / 2 + 30 &&
      mouseY < height / 2 + 70) {
        window.buttonNoise();
    resetGame(); // Reset game variables
    activeExplosions = []; // Clear active explosions
    window.playThemeTune();
  }
}


// Function to reset the game state
function resetGame() {
  initializeGameVariables(); // Reinitialize the game variables
}

// Function to draw the tanks
function drawTank(tank) {
  // Trapezoidal body: wider at the base, narrower at the top
  const bodyTopWidth = tank.width * 0.8; // Narrower top
  const bodyBottomWidth = tank.width; // Wider base
  const bodyHeight = tank.height;

  const topLeftX = tank.x + (tank.width - bodyTopWidth) / 2;
  const topRightX = topLeftX + bodyTopWidth;

  const bottomLeftX = tank.x;
  const bottomRightX = tank.x + bodyBottomWidth;

  // Draw the trapezoidal body
  fill(tank.color);
  quad(
    topLeftX, tank.y - bodyHeight, // Top left corner
    topRightX, tank.y - bodyHeight, // Top right corner
    bottomRightX, tank.y, // Bottom right corner
    bottomLeftX, tank.y // Bottom left corner
  );

  // Draw wheels with black fill and grey outline
  const wheelRadius = 4;
  const wheelSpacing = (tank.width - 2 * wheelRadius) / 5;
  const wheelY = tank.y; // Position the wheels on the lower edge of the tank

  for (let i = 0; i < 6; i++) {
    fill(128); // Dark color for wheels
    stroke(0); // Grey outline
    strokeWeight(2);
    ellipse(bottomLeftX + wheelRadius + i * wheelSpacing, wheelY, wheelRadius * 2); // Draw wheels
  }

  // Draw dome and antenna
  const domeRadius = tank.width / 4;
  fill(tank.color);
  arc(tank.x + tank.width / 2, tank.y - bodyHeight, domeRadius * 2, domeRadius * 2, PI, 0);

  stroke(128); // Black color for antenna
  strokeWeight(1);
  line(tank.x + (3 * tank.width) / 4, tank.y - bodyHeight, 
       tank.x + (3 * tank.width) / 4, tank.y - bodyHeight - 10); // Antenna
}


// Key press and release handlers
function keyPressed() {
  if (!gameOver) {
    keyState[keyCode] = true; // Mark key as pressed in state

    if (key === ' ') { // Fire projectile
      if (!projectileFired) {
        projectile = {
          x: currentTank.x + currentTank.width / 2,
          y: currentTank.y - currentTank.height,
          vx: speed * cos(-angle),
          vy: speed * sin(-angle),
        };
        projectileFired = true;

        window.fireSound(); // Play the fire sound when firing
      }
    }
  }
}

// Key release handler
function keyReleased() {
  keyState[keyCode] = false; // Mark key as released in state
}


// Switch control between tanks after firing
function switchControl() {
  currentTank = (currentTank === tank1) ? tank2 : tank1; // Toggle between tanks
  angle = PI / 2; // Reset angle after switching
}

// Function to check projectile collision with a tank
function checkCollision(projectile, tank) {
  return (
    projectile.x >= tank.x &&
    projectile.x <= tank.x + tank.width &&
    projectile.y >= tank.y - tank.height &&
    projectile.y <= tank.y
  );
}

// Function to trigger explosion
function triggerExplosion(x, y) {
  explosionActive = true; // Activate explosion
  explosionCenter = createVector(x, y); // Set explosion center
  explosionTimer = 0; // Reset explosion timer
  circles = []; // Clear previous explosion circles

  window.explosionSound();
}

// Function to add a circle to the explosion
function addCircle() {
  const angle = random(TWO_PI); // Random angle
  const distance = random(explosionRadius); // Random distance within explosion radius
  const offsetX = cos(angle) * distance;
  const offsetY = sin(angle) * distance;
  circles.push(new Circle(explosionCenter.x + offsetX, explosionCenter.y + offsetY, 0)); // Add new circle
}

// Circle class for the explosion animation
class Circle {
  constructor(x, y, diameter) {
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.growthRate = random(0.5, 1); // Random growth rate
    this.maxDiameter = random(10, 30); // Maximum diameter
    this.opacity = 255; // Initial opacity
    this.fadeRate = 2.1; // Fade rate
  }

  update() {
    if (this.diameter < this.maxDiameter) {
      this.diameter += this.growthRate; // Grow diameter
    }
    this.opacity -= this.fadeRate; // Fade over time
  }

  display() {
    fill(255, 200, 0, this.opacity); // Yellow fill with varying opacity
    stroke(239, 34, 90, this.opacity); // Red outline with varying opacity
    strokeWeight(2);
    ellipse(this.x, this.y, this.diameter); // Draw the circle
  }

  isDone() {
    return this.opacity <= 0; // Check if circle is fully faded
  }
}

function initializeGameVariables() {
  angle = PI / 2; // Default firing angle
  speed = 8; // Projectile speed

  tank1 = {
    x: 20,
    y: height - 40,
    width: 50,
    height: 18,
    color: 'blue',
    health: 3,
  };

  tank2 = {
    x: width - 60,
    y: height - 40,
    width: 50,
    height: 18,
    color: 'red',
    health: 3,
  };

  currentTank = tank1; // Start with tank1
  projectileFired = false; // No projectile fired initially
  keyState = {}; // Clear key state

  explosionActive = false; // No active explosion
  explosionCenter = null; // No defined explosion center
  circles = []; // Clear previous circles

  winner = null; // No winner at start
  gameOver = false; // Game not over
  timer = 60; // Reset timer
}
