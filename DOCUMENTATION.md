TANKY TENSION PROJECT DOCUMENTATION:

//Project Description:
-   TANKY TENSION is a simple local two player video game which allows 2 users to each take turns controling their own respective tank. the player one and player 2 tanks are represented by a blue and red tank on each respective side of the canvas.
    each tank as the capability to: Move along the ground from left to right as far as they want, control the angle of their tank barrel in 360 degrees around the firing location of the tank, and fire a physics-affected projectile from their tank barrel
    in order to try and hit the enemny tank. The game begins on a Welcome screen which has the title logo for the game along with a few colored explosion effects for added visual appeal. this screen also plays a baseline drum beat, known as the welcome theme,
    and a button which will start the game when interacted with. Upon clicking this button, the game will begin, and a new loop will be added along to the already started tone sequence that was playing on the welcome screen, creating a more complex and exciting song.
    The game has a 60 second timer to encourage players to be fast paced with the game, each tank also has 3 health points that are displayed which will decrease whenever a projectile from either the enemy tank or their own tank is fired. These projectiles will explode on contact with either
    the ground of the canvas or a tank, the only difference in the explosion upon hitting a tank is that the explosion sound has increased reverb and is slightly louder. upon either the timer running out, or either tank falling to 0 hp, the game will end and the game over
    screen will appear. A victory tune will play once the game has ended and will have a slighly more upbeat loop playing in the background. this screen will also display which one of the 3 conditions were met to cause the game to end. this screen has a play again button,
    which upon pressing will reset the game back to the started game state and the players will be able to play the game immediatley

//Game controls / arduino output:
- for ease of gameplay, the only control on the breadboard is the button which will fire the projectile from whichevers tanks turn it is. the output on the breadboard is 6 LED's, 3 red 3 blue, which are to represent the health points of each players respective tank
- the controls for the game are as follows:
-   MOVE RIGHT: D key
-   MOVE LEFT: A key
-   ADJUST BARREL CLOCKWISE: E key
-   ADJUST BARREL COUNTERCLOCKWISE: Q key
-   FIRE PROJECTILE: button assigned on the arduino or spacebar (if you dont have access to arduino)
-   CANVAS BUTTON INTERACTION: done with mouse inputs

//How to run the game:
-  I found it is easiest to run this game in VS code using the p5.play extension, and running from the live server there. first unzip the project file and open the folder inside of VS code. Then, run the arduino code and connect the arduino, ensuring that it compiles properly
   Now open the live sever while the main game sketch is running, and click on the canvas window once it opens to access it (if the music or animations dont start with this, simply click back into the project file and save the project to restart the canvas).
   there will be a button the bottom of the canvas to connect the arduino, so esnure that you connect this before interacting with the game at all. Once you follow all these steps, the game should play with the controls described above.
    
//Project outline: 
-  this project works mainly through the calling of specific functions and objects in the project folder to occur whenever speccific events occur either on the canvas or whenever a user gives some sort of input. All of the game states are stored as seperate draw functions,
   which update and change whenever there is a certian stimuli. the tanks, projectiles, explosions, and terrain are all stored as their own objects in the code, and are all called whenever interactions when the game require them. the timer and health points are stored as
   mutable values that change in accordance to their specific parameters (I.E. timer decreases with each subsequent second that passes). Allof the previously described portions of code are all located in the same project file. The portions of the project that are located
   elsewhere is the code for reading the arduino inputs and outputs, and a seperate js file which contains all of the sound fucntions for the project. All of the functions in this sound.js file are global functions, and are called inside of the main sketch.js file whenever
   they are needed for specific events / scenes. Generally, this project has a pretty simple and straightforward flow of data, and along with this the all of the funtional code in both the project and sound files are well commented to allow for easy reading and discersion
   of "what-does-what" inside of the code itself.
-  The main portions of the project that I had to implement are as follows:
    - Creation of the welcome screen
    - creation of the gameplay scene
    - creation of the game over scene
    - creation of the tank, projectile, explosion, ground, timer, and button objects
    - Creation of all artistic pieces of this project, such as the background and the title logo for the game 
    - animation for the explosions
    - physics for the projectile component
    - logic for all of the above components to make the game functional
    - interaction from the user, such as the movement, firing of the projectile, and angling of the barrel
    - interaction with the buttons to do their required components
    - game flow logic that takes care of the condiitons of the scenes, such as the which player wins, which players turn it is, etc. Also the implementation of switiching between scenes whenever required conditions / user inputs are given in the canvas
    - creation of the soundtrack, sound effects, and themes for the game
    - importing of these soundtracks to the main game (this took me SOOOOOOOO long to get working with p5 and Tone.js)
    - implementation of these imported functions in the sketch to have the functions called whenever their respective events occur.
    - creation of the .ino file to handle the physical components of the project on the  breadboard
    - connection of the .ino file with the p5 project
    - implementation in the p5 project to receive the physical arduino inputs
    - implementation in the p5 project to send signals to the arduino outputs
    - cleaning up the code and adding comments to ensure readability for others
    - working build is complete :)

//Link to video of this project working as intended
-  

//images of the different scenes of the game with notes to say what each respective one is: 
- 

//Future development:
-  in the future, I am planning on updating this game on my own for my own personal enjoyment. There are a few major things I would like to add to this game, with the main features being:
   1 Multiple weapons for tanks to use to allow for different gameplay loops
     2 ability for tanks to place down different shapes on the canvas that will act as terrain that the projectiles can interact with (similar to the game Worms)
       3 a larger gameplay canvas and randomly generated terrain shapes and properties (such as having increased gravity, less traction, or difficult to navigate terrain)
        4 giving the tank objects themselves physics so they can interact with the new terrain more, fall apart piece by piece whenever they are destroyed, and get knocked around by the explosions near/on them
          5 creating more detailed and clean looking graphics for the project to make it more visually appealing
            6 having the music for the game be affected by different events in the game, such as the track becoming more intnese as tanks get lower hp / the timer passes a certian threshold


//THANK YOU FOR READING ABOUT MY GAME, FOR FURTHER QUESTIONS ABOUT THE GAME EMAIL AT SMALO15@LSU.EDU//
