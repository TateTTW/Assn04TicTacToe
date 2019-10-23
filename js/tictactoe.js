window.onload = function(){
const canvas = document.querySelector('canvas');
const hitCanvas = document.createElement('canvas');
canvas.height = 200;
canvas.width = 200;
var c = canvas.getContext('2d');
var hc = hitCanvas.getContext('2d');
canvas.addEventListener('click', processHit);

const player = 'X';
const computer = 'O';
const SIZE = 3;
var boardState = [
	[null,null,null],
	[null,null,null],
	[null,null,null]
];

var hitZones = [
	[null,null,null],
	[null,null,null],
	[null,null,null]
];

function buildHitZones(){
	for(let j = 0; j < SIZE;j++){
        for(let i = 0; i < SIZE; i++){
        	let zone = new Path2D();
        	zone.rect(i*50+25,j*50+10,50,50);
        	hc.fill(zone);
        	hitZones[j][i] = zone;
        }
	}
}

(function autoStart(){
	clearBoard();
	buildHitZones();
	drawBoard();
}());

function start(){
	clearBoard();
	drawBoard();
}

function winOccured(x){
 var win = true;
 // check for row win 
 for(var i = 0; i < boardState.length; i++){
	 var row = boardState[i];
	 for(var j = 0; j < row.length; j++){
		 if(row[j] !== x){
			 win = false;
			 break;
		 }
	 }
	 if(win === true){
		 return true;
	 } else {  // reset win
		 win = true;
	 }
 }
 // check for column win
 for(var ii = 0; ii < SIZE; ii++){
	 for(var jj = 0; jj < boardState.length; jj++){
		 var element = boardState[jj][ii];
		 if(element !== x){
			 win = false;
			 break;
		 }
	 }
	 if(win === true){
		 return true;
	 } else{
		 win = true;
	 }
 }
 // check diagonal wins
 if (boardState[0][2] === x && boardState[1][1] === x && boardState[2][0] === x
	|| boardState[0][0] === x && boardState[1][1] === x && boardState[2][2] === x){
	 return true;
 } else{
	 return false;
 }
 
};

function drawBoard(){
		c.lineWidth = 3;
		c.strokeStyle = "black";
		// vertical lines
		c.beginPath();
		c.moveTo(75, 10);
		c.lineTo(75, 160)
		c.stroke();

		c.beginPath();
		c.moveTo(125, 10);
		c.lineTo(125, 160)
		c.stroke();
		// horizontal lines
		c.beginPath();
		c.moveTo(25, 60);
		c.lineTo(175, 60)
		c.stroke();
		
		c.beginPath();
		c.moveTo(25, 110);
		c.lineTo(175, 110)
		c.stroke();
}

function drawMove(type, y, x){
	// draw players
	if(type === player){
		c.beginPath();
		c.moveTo(x*50+34,y*50+17);
		c.lineTo(x*50+34+30,y*50+47);
		c.stroke();
		c.beginPath();
		c.moveTo(x*50+34+30,y*50+17);
		c.lineTo(x*50+34,y*50+47)
		c.stroke();
	} else if (type === computer){
		c.beginPath();
		c.arc(x*50+50, y*50+33, 18, 0, 2 * Math.PI);
		c.stroke();
	}
}
	
function processHit(event){
	var outsideZone = true;	
	for(let y = 0; y < hitZones.length; y++){
        for(let x = 0; x < hitZones[y].length; x++ ){
        	let zone = hitZones[y][x];
        	if (c.isPointInPath(zone, event.offsetX, event.offsetY)) {
        		outsideZone = false;
        		if(boardState[y][x] === null ){
        			boardState[y][x] = player;
        			drawMove(player,y ,x);
        		} else {
        			alert("Choose an Empty Spot");
        			return;
        		}
        	}
        }
	}
	if (outsideZone) return;
	
	var playerWon = winOccured(player);	
	if(playerWon){
		setTimeout(function(){ 
			alert("You Won!"); 
			start();
		}, 0);
		return;
	}
	
	if (!processAI() && !playerWon){
		setTimeout(function(){ 
			alert("You Tied!"); 
			start();
		}, 0);
	}
}

function clearBoard(){
	c.clearRect(0, 0, 400, 400);
	boardState = [
		[null,null,null],
		[null,null,null],
		[null,null,null]
	];
}

function processAI(){
	var compWinSpt = potentialWins(computer);
	if(compWinSpt !== null ){
		var compX = compWinSpt.x;
		var compY = compWinSpt.y;
		
		boardState[compY][compX] = computer;
		drawMove(computer, compY, compX);
		
		if(winOccured(computer)){
			setTimeout(function(){ 
				alert("You Lose!"); 
				start();
			}, 0);
		}
		return true;
	}
	
	var plyrsNxtSpt = potentialWins(player);
	if(plyrsNxtSpt !== null ){
		var compX = plyrsNxtSpt.x;
		var compY = plyrsNxtSpt.y;
		
		boardState[compY][compX] = computer;
		drawMove(computer, compY, compX);
		
		if(winOccured(computer)){
			setTimeout(function(){ 
				alert("You Lose!"); 
				start();
			}, 0);
		}
		return true;
	}
	
	var EmptySpot = function(){this.x = null ,this.y = null};
	var spots = [];
	
	for(var i = 0; i < boardState.length; i++){
		for(var ii=0; ii < boardState[i].length; ii++){
			if(boardState[i][ii] === null){
				var spot = new EmptySpot;
				spot.x = ii;
				spot.y = i;
				spots[spots.length] = spot;
			}
		}
	}
	
	if(spots.length === 0)
		return false;

	var max = spots.length - 1;
	var num = Math.floor((Math.random() * max) + 0);
	var compX = spots[num].x;
	var compY = spots[num].y;
	
	boardState[compY][compX] = computer;
	drawMove(computer, compY, compX);
	
	if(winOccured(computer)){
		setTimeout(function(){ 
			alert("You Lose!"); 
			start();
		}, 0);
	}
	return true;
}

function potentialWins(x){
	 var EmptySpot = function(){this.x = null ,this.y = null};
	 var spot = null;
	 var playerCount = 0;
	 // check for row win 
	 for(let i = 0; i < boardState.length; i++){
		 var row = boardState[i];
		 for(let j = 0; j < row.length; j++){
			 if(row[j] === x)
				 playerCount++;
			 else if (row[j] === null){
				 spot = new EmptySpot;
				 spot.x = j;
				 spot.y = i;
			 }
		 }
		 if(spot !== null && playerCount === 2){
			 return spot;
		 } else{
			 spot = null;
			 playerCount = 0;
		 }
	 } 
	 // check for column win
	 for(let i = 0; i < SIZE; i++){
		 for(let j = 0; j < boardState.length; j++){
			 var item = boardState[j][i];
			 if(item === x)
				 	playerCount++;
			 else if (item === null){
				 	spot = new EmptySpot;
					spot.x = i;
					spot.y = j;
			}
		 }
		 if(spot !== null && playerCount === 2){
			 return spot;
		 } else{
			 spot = null;
			 playerCount = 0;
		 }
	 }
	 // check diagonal wins
	 for(var t = 0; t < boardState.length; t++){
		 if(boardState[t][t] === x)
			 playerCount++;
		 else if(boardState[t][t] === null){
			 spot = new EmptySpot;
			 spot.x = t;
			 spot.y = t;
		 }
	 }	 
	 if(spot !== null && playerCount === 2){
		 return spot;
	 } else{
		 spot = null;
		 playerCount = 0;
	 }
	 	 
	 var p = SIZE-1
	 for(var k = 0; k < boardState.length; k++){
		 if(boardState[k][p] === x)
			 playerCount++;
		 else if(boardState[k][p] === null){
			 spot = new EmptySpot;
			 spot.x = p;
			 spot.y = k;
		 }
		 p--;
	 }	 
	 if(spot !== null && playerCount === 2){
		 return spot;
	 } else{
		 spot = null;
		 playerCount = 0;
	 }
	 
	 return null;	 
}
}