const board=document.getElementById("game-board")
const instructionText=document.getElementById("instruction-text");
const logo=document.getElementById("logo");
const score=document.getElementById("score");
const highScoreText=document.getElementById("highScore");

//console.log(board);
let gridSize=20;
let snake=[{x:10,y:10}]
let food=generateFood();
let bigFood=null;
let bigFoodTimeout=null;
let highScore=0;
let direction="right";
let gameInterval;
let gameSpeedDelay=200;
let gameStarted=false;
let foodEatenCount=0;
let sc=0;

const foodSound=new Audio("./eating-sound.mp3")

//Draw game map, snake, food
function draw(){
    board.innerHTML="";
    drawSnake();
    drawFood();
    if(bigFood){
        drawBigFood();
    }
    updateScore();
}

//drawSnake
function drawSnake(){
    snake.forEach((segment)=>{
        const snakeElement=createGameElement("div","snake");
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    })
}

function createGameElement(tag, className){
    const element=document.createElement(tag);
    element.className=className;
    return element;
}

function setPosition(element, position){
    element.style.gridColumn=position.x;
    element.style.gridRow=position.y;
}

function drawFood(){
    if(gameStarted){
        const foodElement=createGameElement("div","food");
        setPosition(foodElement,food);
        board.appendChild(foodElement);
    }
}

function drawBigFood(){
    if(gameStarted){
        const bigFoodElement=createGameElement("div","big-food");
        setPosition(bigFoodElement, bigFood);
        board.appendChild(bigFoodElement);
    }
}

function generateFood(){
    const x=Math.floor(Math.random()*gridSize)+1;
    const y=Math.floor(Math.random()*gridSize)+1;
    return {x,y};
}

function move(){
    const head={...snake[0]};
    switch (direction) {
        case "up":
            head.y--;
            break;
        case "right":
                head.x++;
                break;
        case "left":
                head.x--;
                break;
        case "down":
                head.y++;
                break;
    }
    snake.unshift(head);
    if (bigFood && head.x === bigFood.x && head.y === bigFood.y) {
        bigFood = null;
        foodEatenCount = 0; // Reset the count after eating big food
        increaseSpeed();
        foodSound.play();
        sc+=5; // Add 5 points for big food
    } else if (head.x === food.x && head.y === food.y) {
        foodEatenCount++;
        food = generateFood();
        sc+=1;
        foodSound.play();
        if (foodEatenCount % 5 === 0) {
            bigFood = generateFood();
            if (bigFoodTimeout) {
                clearTimeout(bigFoodTimeout);
            }
            bigFoodTimeout = setTimeout(() => {
                bigFood = null;
                draw();
            }, 5000); // Big food disappears after 5 seconds
        }
        increaseSpeed();
    } else {
        snake.pop();
    }
    
}

//draw();
// setInterval(()=>{
//     move(); //move
//     draw();  //then again draw nothing will be displayed
// },200)

function startGame(){
    gameStarted=true;
    instructionText.style.display="none";
    logo.style.display="none";
    gameInterval=setInterval(()=>{
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

function handleKeyPress(event){
    if((!gameStarted && event.code === "Space")||
    (!gameStarted && event.key === " ")
    ){
        startGame();
    }
    else{
        switch(event.key){
            case "ArrowUp":
                direction="up";
                break;
            case "ArrowDown":
                direction="down";
                break;
            case "ArrowRight":
                direction="right";
                break;
            case "ArrowLeft":
                direction="left";
                break;
            
        }
    }
}

document.addEventListener("keydown", handleKeyPress);
function increaseSpeed(){
    ///console.log(gameSpeedDelay);
    if(gameSpeedDelay>150){
        gameSpeedDelay-=5;
    }
    else if(gameSpeedDelay>100){
        gameSpeedDelay-=3;
    }
    else if(gameSpeedDelay>50){
        gameSpeedDelay-=2;
    }
    else if(gameSpeedDelay>25){
        gameSpeedDelay-=1;
    }
}

function checkCollision(){
    const head=snake[0];
    if(head.x<1 || head.x> gridSize || head.y<1 || head.y>gridSize){
        resetGame();
    }

    for(let i=1;i<snake.length;i++){
        if(head.x===snake[i].x  && head.y===snake[i].y){
            resetGame();
        }
    }
}

function resetGame(){
    updateHighScore();
    stopGame();
    snake=[{x:10, y:10}];
    sc=0;
    food=generateFood();
    direction="right";
    gameSpeedDelay=200;
    updateScore();
}

function updateScore(){
    score.textContent=sc.toString().padStart(3,'0');
}

function stopGame(){
    clearInterval(gameInterval);
    if(bigFoodTimeout){
        clearTimeout(bigFoodTimeout);
    }
    gameStarted=false;
    instructionText.style.display="block";
    logo.style.display="block";
}

function updateHighScore(){
    if(sc>highScore){
        highScore=sc;
        highScoreText.textContent=highScore.toString().padStart(3,'0');
    }
    highScoreText.style.display="block";
}

// function addScore(points){
//     const currentScore=snake.length-1 + points;
//     score.textContent=currentScore.toString().padStart(3,'0');
// }