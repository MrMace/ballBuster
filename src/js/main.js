var container = document.querySelector('.container');
var ball = document.querySelector('#ball');
var paddle = document.querySelector('.paddle');
var startButton = document.querySelector('.startBtn');

var gameOver = false;
var gameInPlay = false;
var score = 0;
var lives;
var animationRepeat;
var ballDirection = [5, 5, 5];
var containerDim = container.getBoundingClientRect();

startButton.addEventListener('click', startGame);

startButton.onclick = function() {
    // score = 0;
    scoreUpdate(0);
};

document.addEventListener('keydown', function (e) {
    var key = e.keyCode;
    e.preventDefault();
    if (key === 37) {
        paddle.left = true
    }
    else if (key === 39) {
        paddle.right = true;
    }else if (key === 38 && !gameInPlay) {
        gameInPlay = true;
    }

});
document.addEventListener('keyup', function (e) {
    var key = e.keyCode;
    e.preventDefault();
    if (key === 37) {
        paddle.left = false;
    }
    else if (key === 39) {
        paddle.right = false;
    }
});


function startGame() {
    document.querySelector('.gameOver').style.display = 'none';
    document.querySelector('.startBtn').style.display = 'none';
    ball.style.display = 'block';
    brickSetup(15);
    lives = 5;
    score = 0;
    lifeUpdate();
    animationRepeat = requestAnimationFrame(update);
    gameOver = false;
    gameInPlay = false;

}



function brickSetup(num){
var row ={x:((containerDim.width % 100) /2), y:50};
for(var x=0;x<num;x++){
    if(row.x > (containerDim.width - 100)){
        row.y += 70;
        row.x =((containerDim.width % 100) /2)

    }
    brickMaker(row);
    row.x += 100;
}

}

function brickMaker(row){
var div = document.createElement('div');
div.setAttribute('class', 'brick');
// div.style.background = 'linear-gradient(' + randomColor()+',' + randomColor()+')';
div.style.background =  randomColor();
var pointDiv = Math.ceil(Math.random()*10) + 2;
div.dataset.points = pointDiv;
div.innerHTML = pointDiv;
div.style.left = row.x + 'px';
div.style.top = row.y + 'px';
container.appendChild(div);
}

function update() {
    if (gameOver === false) {
        var paddleCurrent = paddle.offsetLeft;
        if (paddle.left && paddleCurrent > 0) {
            paddleCurrent -= 5;
        }
        else if (paddle.right && paddleCurrent < (containerDim.width - paddle.offsetWidth)) {
            paddleCurrent += 5;
        }
        paddle.style.left = paddleCurrent + 'px';
        if (!gameInPlay) {
            waitingOnPaddle();
        } else {
            ballMove();
        }
        animationRepeat = requestAnimationFrame(update)

    }
}

function waitingOnPaddle() {
    ball.style.top = (paddle.offsetTop - 22) + 'px';
    ball.style.left = (paddle.offsetLeft + 70) + 'px';
}

function ballMove() {
    var x = ball.offsetLeft;
    var y = ball.offsetTop;

    if (x > (containerDim.width - 20) || x < 0) {
        ballDirection[0] *= -1;
    }
    if (y > (containerDim.height - 20) || y < 0) {
        if(y > (containerDim.height -20)){
            fallOffEdge();
            return;
        }
        ballDirection[1] *= -1;
    }
   if(isCollide(ball,paddle)){
//collision
       var nDirection = ((x - paddle.offsetLeft) - (paddle.offsetWidth / 2))/10;
        ballDirection[0] = nDirection;
        ballDirection[1] *= -1;
       console.log("HIT");


   };

    var tempBricks = document.querySelectorAll('.brick');
    if(tempBricks.length === 0){
    stopper();
    brickSetup(30);
        lives++;
        lifeUpdate();
    }
    for(var targetBrick of tempBricks){
        if(isCollide(targetBrick,ball)){

            ballDirection[1] *= -1;
            targetBrick.parentNode.removeChild(targetBrick);
            scoreUpdate(targetBrick.dataset.points);
        }
    }

    x += ballDirection[0];
    y += ballDirection[1];
    ball.style.top = y + 'px';
    ball.style.left = x + 'px';
};

// function randomColor(){
//     function color(){
//         var hex = Math.floor(Math.random() * 256).toString(16);
//         var response = ('0' + String(hex)).substr(-2);
//         return response;
//     }
//     return '#' + color() + color() + color();
// }

function randomColor(){

    function color () {

        var colorArray = [

            '#FBF0B2',
            '#FBCC9E',
            '#FA8E89',
            '#31A3B2',
            '#4AD99A',
            '#766483',
            '#8BFC87'
        ]
        var response = colorArray[Math.floor(Math.random()* colorArray.length)];
        return response;
    }

    return color();
}
function scoreUpdate(num){
score += parseInt(num);
document.querySelector('.score').innerText = score;

}

function lifeUpdate(){
    document.querySelector('.lives').innerText = lives;
}

function stopper(){
    gameInPlay = false;
    ballDirection[0,-5];
    waitingOnPaddle()
    window.cancelAnimationFrame(animationRepeat);
}

function endGame(){
    document.querySelector('.gameOver').style.display = 'block';
    document.querySelector('.gameOver').innerHTML = '<br>GAME OVER Your Score: ' + score;
    document.querySelector('.startBtn').style.display = 'block';
    gameOver = true;
    ball.style.display = 'none';
    var tempBricks = document.querySelectorAll('.brick');
    for(var targetBrick of tempBricks){
            targetBrick.parentNode.removeChild(targetBrick);
    }
}

function fallOffEdge() {
    lives--;
    if(lives < 0){

        endGame();
        lives = 0;
    }
    lifeUpdate();
    stopper();
}
function isCollide(a,b){
    var aRectangle = a.getBoundingClientRect();
    var bRectangle = b.getBoundingClientRect();

    return(!(aRectangle.bottom < bRectangle.top || aRectangle.top > bRectangle.bottom || aRectangle.right < bRectangle.left || aRectangle.left > bRectangle.right));
};
