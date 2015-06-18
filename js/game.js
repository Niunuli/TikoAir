// global variables
var highScore;
var score;

// canvas
var canvas = document.getElementById("my_canvas");
var ctx = document.getElementById("my_canvas").getContext("2d");
 
//canvas dimensions
var width = canvas.width;
var height = canvas.height;

// create new Audio objects
var music = new Audio();
var bgMusic = new Audio();
var levelSound = new Audio();
 
// timing
var update;
var FPS = 50;
var distance = 0;

// key pressed
var upKey = false;
var downKey = false;
 
// plane
var plane = new Image();
var y = 200;
var frame=0;
var maxFrame=6;
 
// clouds
var howManyCircles = 10, circles = [];
 
// keyboard handling
function keyDown(e) {
    if (e.keyCode === 38) upKey = true;
    else if (e.keyCode === 40) downKey = true;
}
 
function keyUp(e) {
    if (e.keyCode === 38) upKey = false;
    else if (e.keyCode === 40) downKey = false;
}

// local storage support
function supportsLocalStorage() {
	// checks if user's browser supports HTML5 Storage
    return ('localStorage' in window) && window['localStorage'] !== null;
}

function endMusic() {
music.pause();
}

// init function
var Init = function() {
 
 // select format which is supported
if (music.canPlayType('audio/wav')) {
	// set source file
	music.src = "sounds/space.wav";
	levelSound.src = "sounds/levelup.wav";
} else if (snd.canPlayType('audio/mpeg')) {
	music.src = 'sounds/space.mp3';
}

 // add event handler, music starts as soon as canplaythrough event triggers.
// canplaythrough means that the file has loaded enough for starting the play and 
// it will finish before the playback reaches the end (assuming that it keeps 
// loading at the current rate).
    music.src = 'sounds/helicopter.wav';
 
    // load music
	//music.src = "sounds/levelup.wav";
 
    // load plane image
    plane.src = "img/planes3.png";
	
	music.addEventListener("canplaythrough", function() {
    // start	
    PlayMusic();
    });
	
	music.addEventListener('ended', function() {
	this.currentTime = 0;
	this.play();
	}, false);
 
    // populate the array containing cloud information
    for (var i = 0; i < howManyCircles; i++)
        circles.push([Math.random() * width, Math.random() * height, Math.random() * 100, Math.random() / 2]);
 
 	// get high score if exists
    if (!supportsLocalStorage()) {
		// not supporting storage so there is no high score
		highScore = 0;
	} else 
		if (localStorage["highScore"]===null) {
			// no high score in the storage
			highScore = 0;
		} else {
			// high score exists in the storage
			highScore = localStorage["highScore"];
		}
 
    // add listerners
    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);
	
	var endButton = document.getElementById('end');
	endButton.addEventListener('click', endGame, false);

	//var musicButton = document.getElementById('stopmusic');
	//musicButton.addEventListener('click', endMusic, false);
		var musicButton = document.getElementById('stopmusic');
	musicButton.addEventListener('click', playOrPause, false);
	
	var resetButton = document.getElementById('resetHighScore');
	resetButton.addEventListener('click', resetHighScore, false);
	
    // call GameLoop FPS times per second
    update = setInterval(GameLoop, 1000 / FPS);   
}

// Update highScore
function updateHighScore() {
	if (distance < highScore) 
		return false;
		
	else 
		highScore = distance;
		document.getElementById("newScore").style.display = "block";
	
	if (supportsLocalStorage()) 
		localStorage["highScore"] = distance;
		
	return true;
}

var UpdateDistance = function() {

  distance++;
  if (distance % 1000 === 0) {
  levelSound.currentTime = 0;
  levelSound.play();
  }
};


function resetHighScore() {
	if (confirm("Are you sure?")) { 
		localStorage["highScore"]=0;
		highScore = 0;
		document.getElementById("reset").innerHTML += "<br>High score set to zero.";
		return true;
	} else {
		document.getElementById("reset").innerHTML += "<br>Reset operation cancelled...";
		return false;
	}
}

function endGame() {
clearInterval(update);
updateHighScore();
music.pause();
// Display High Score in canvas
ctx.fillStyle = "#000"; 
ctx.font = "14pt Helvetica, Arial, Sans"; 
ctx.fillText("High Score: "+highScore+" m",400,60); 
if (distance < highScore) 
document.getElementById("score").style.display = "block";
}

// clear the canvas...
var clear = function(){
    // by drawing a blue rectangle
    ctx.fillStyle = '#d0e7f9';
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.closePath();
    ctx.fill();
}

// draw circles
var DrawCircles = function(){
    for (var i = 0; i < howManyCircles; i++) {
        ctx.fillStyle = 'rgba(255, 255, 255, ' + circles[i][3] + ')';
        ctx.beginPath();
        ctx.arc(circles[i][0], circles[i][1], circles[i][2], 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }
};
 
// move clouds from left to right
var MoveCircles = function(delta){
    for (var i = 0; i < howManyCircles; i++) {
        if (circles[i][0] - circles[i][2] > width) {
            circles[i][1] = Math.random() * height;
            circles[i][2] = Math.random() * 100;
            circles[i][0] = 0 - circles[i][2];
            circles[i][3] = Math.random() / 2;
        } else {
            circles[i][0] += delta;
        }
    }
};
 
// draw plane
var DrawPlane = function(delta) {
 
    // increase frame
    if (frame<maxFrame) {
        frame++;
    } else {
        frame=0;
    }
 
    // plane is getting higher
    if (upKey && y > delta) {
        y-=delta;
        ctx.save();
        ctx.translate(400,y);
        ctx.rotate(0.5);
        ctx.drawImage(plane, 0, frame*50, 100, 50, 0, 0, 100, 50);// kuva, koko=0, koko=0, 
        ctx.restore();                                            // Ala muuta kokoa
    } else if (downKey && y<height-50) {
        y+=delta;
        ctx.save();
        ctx.translate(400,y);
        ctx.rotate(-0.5);
        ctx.drawImage(plane, 0, frame*50, 100, 50, 0, 0, 100, 50);
        ctx.restore();
    } else
        ctx.drawImage(plane, 0, frame*50, 100, 50, 400, y, 100, 50); distance++; 
   if (distance % 1000 == 0) {
  levelSound.currentTime = 0;
  levelSound.play();
  }    
}

function DisplayStats() { 
  ctx.fillStyle = "#000"; 
  ctx.font = "14pt Helvetica, Arial, Sans"; 
  ctx.fillText("Distanceee: "+distance+" m", 20, 60); 
} 

function PlayMusic(){
    music.play();
}

function playOrPause(){
    if (music.paused) {
        music.play();
    } else {
        music.pause();
    }
}

function stop() {
    music.pause();
    clearInterval(update);
    updateHighScore();
    
    scores[2]=new Array();
    for(var i = 0; i < scores.length; i++){
        if (scores[i] < score){
            scores.push(score);
        }
    }
    
	ctx.fillText("Highscore: "+highScore+" m",255,60);
    DisplayStats();
}


function supportsLocalStorage() {
    // checks if user's browser supports HTML5 Storage
    return ('localStorage' in window) && window['localStorage'] !== null;
}

// gameloop which is executed FPS times per second
var GameLoop = function(){
    clear();
    DrawCircles();
    MoveCircles(5);
    DrawPlane(5);
    DisplayStats();
};
 
 
/* main */
Init();
GameLoop(); 