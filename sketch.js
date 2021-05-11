var PLAY = 1;
var END = 2;
var Ins = 0
var gameState = Ins;

var eagle;
var backGround;

var fishesGroup,carpsGroup

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var hitscore;

var gameOverImg, restartImg;

var jumpSound, checkPointSound, dieSound;

let Timer = 180;

localStorage["Highest.score"] = 0;

function preload() {
  eagle_running = loadAnimation("eagle.png", "eagle2.png", "eagle3.png","eagle4.png","eagle5.png","eagle6.png","eagle7.png", "eagle8.png", "eagle9.png","eagle10.png","eagle11.png","eagle12.png");
  eagle_collided = loadAnimation("eagle5.png");

  carpcom = loadAnimation("majestic-carp-jumping-imgur 2.gif");
  carppng = loadImage("snake.png");

  fishimg = loadImage("fin.png");
  netimg = loadImage("net.png");

  instructions = loadImage("instructions.png");

  //instructions = loadAnimation("instruct.gif");

  backgroundImg = loadImage("bg.jpeg");

  seaweedimg = loadImage("seaweed.png");

  // obstacle1 = loadImage("obstacle1.png");
  // obstacle2 = loadImage("obstacle2.png");
  // obstacle3 = loadImage("obstacle3.png");
  // obstacle4 = loadImage("obstacle4.png");
  // obstacle5 = loadImage("obstacle5.png");
  // obstacle6 = loadImage("obstacle6.png");

  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameover.png")
  
}

function setup() {
  createCanvas(1280,722);

  backGround = createSprite(600,520,800,722);
  backGround.scale = 1.7;
  backGround.addImage(backgroundImg);
  //backGround.velocityX = -5;
  backGround.x = backGround.width/4;

  eagle = createSprite(280, 360, 20, 50);
  eagle.addAnimation("running", eagle_running);
  eagle.addAnimation("collided", eagle_collided);
  eagle.scale = 1;
  //eagle.debug = true;

  instruct = createSprite(640,300)
   instruct.addImage(instructions);
   instruct.visible = false;
   instruct.scale = 1.4;

  eaglestopper1 = createSprite(280,120,200,50);
  eaglestopper1.visible = false;

  eaglestopper2 = createSprite(280,500,200,50);
  eaglestopper2.visible = false;

  gameOver = createSprite(600, 350);
  gameOver.addImage(gameOverImg);
  gameOver.visible= false;
    

  restart = createSprite(590, 460);
  restart.addImage(restartImg);
  restart.visible = false;

  gameOver.scale = 2;
  restart.scale = 1.8;

  carpc = createSprite(600,300);
  carpc.addAnimation("capcoming",carpcom);
  carpc.scale = 5;
  carpc.visible = false;

  carpsGroup = createGroup();
  fishesGroup = createGroup();
  seaweedsGroup = createGroup();
  seaweeds1Group = createGroup();
  netGroup = createGroup();

  eagle.setCollider("rectangle", 0, 0, eagle.width, eagle.height+70);
  score = 0;
  hitscore = 0;
}

function draw() {
  if(gameState === Ins){
    background(0);
  }else{ 
    background("white");
}
 

  if(gameState === Ins){
    gameOver.visible= false;
    restart.visible = false;
    eagle.visible = false;
    backGround.visible = false;
    instruct.visible = true;

    textSize(20);
    fill("white");
    text("Press 'Space' To Start the Game",500,450);
    text("😇",620,500);

    score = 0;
    Timer = 180;
   

    if(keyWentDown("Space")){
      gameState = PLAY
    //   carpc.visible = true;
     }
  }

 

  if(gameState === PLAY){
    backGround.velocityX = -5;
    backGround.visible = true;
    eagle.visible = true;
    instruct.visible = false;

   

    if(keyDown("Up_Arrow")){
      eagle.velocityY = eagle.velocityY - 0.5;
    }
  
    if(keyDown("Down_Arrow")){
      eagle.velocityY = eagle.velocityY + 0.5;
    }
  
    if(backGround.x < 480){
      backGround.x = backGround.width/2;
    }
  
    eagle.collide(eaglestopper1);
    eagle.collide(eaglestopper2);
  
    if(eagle.isTouching(fishesGroup)&& keyWentDown("Left_arrow")){
     score = score + 1;
    }
  
    spawnfishes();
    spawnCarps();
    spawnSeaWeeds();
    spawnSeaWeeds1();
    spawnnets();

    if(eagle.isTouching(carpsGroup)||eagle.isTouching(netGroup)||Timer == 0){
      gameState = END;
      carpsGroup.destroyEach();
      seaweedsGroup.destroyEach();
      seaweeds1Group.destroyEach();
      netGroup.destroyEach();
      fishesGroup.destroyEach();
      backGround.velocityX = 0;
    }
    if (frameCount % 40 == 0 && Timer > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
      Timer --;
    }
    
  }
  if(gameState === END){
    eagle.visible = false;
    gameOver.visible= true;
    restart.visible = true;
  }
  
  if (mousePressedOver(restart) && gameState === END) {
   gameState = Ins;
  }
   

  // var count = World.seconds;
  // if(carpc.visible === true && 3000 < count){
  //   carpc.visible = false;
  // }

  
  drawSprites();
  //text("Hits:" + hitscore, 450, 50)

  if(gameState === PLAY){
    stroke("Black")
    strokeWeight(4);
    fill("teal");
    textSize(20);
  text("Food Points: " + score, 900, 50);
  // text("Timer:" + Timer, width/2, height/2);
  text("Timer:" + Timer, 1100,50);
  }
}


function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  if (localStorage["Highest.score"] < score) {
    localStorage["Highest.score"] = score;
  }
  score = 0;
  console.log(localStorage["Highest.score"]);
}

function spawnfishes() {
  if (frameCount % 120 === 0) {
    var fishes = createSprite(1300, 520, 30, 30);
    fishes.addImage(carppng);
    fishes.shapeColor = "green";
    fishes.scale = 0.3;
    fishes.velocityX = -3;
    //fishes.debug = true;

   fishes.setCollider("rectangle", 0, -20, fishes.width + 120, fishes.height+120);
    fishes.lifetime = 320;

    // cloud.depth = trex.depth;
    // trex.depth = trex.depth + 1;

    fishesGroup.add(fishes);
  }
}

function spawnCarps() {
  if (frameCount % 130 === 0) {
    var carps = createSprite(1300, 520, 30, 30);
    carps.addImage(fishimg);
    carps.shapeColor = "red";
    carps.scale = 0.3;
    carps.velocityX = -3;
    //carps.debug = true;

   carps.setCollider("circle", 0, 0, 220);
    carps.lifetime = 315;

    // cloud.depth = trex.depth;
    // trex.depth = trex.depth + 1;

    carpsGroup.add(carps);
  }
}

function spawnnets() {
  if (frameCount % 180 === 0) {
    var net = createSprite(780,-10, 30, 30);
    net.addImage(netimg);
    net.scale = 0.5;
    net.velocityX = -3;
    net.velocityY = 3;
  // net.debug = true;

   net.setCollider("circle", 0, 0, 65);
    net.lifetime = 315;

    // cloud.depth = trex.depth;
    // trex.depth = trex.depth + 1;

    netGroup.add(net);
  }
}

function spawnSeaWeeds(){
  if(frameCount % 80 === 0){
    var seaWeeds = createSprite(1300,560);
    //seaWeeds.debug = true;
    seaWeeds.setCollider("circle", 0, -10, 250);
    seaWeeds.scale = 0.2;
    seaWeeds.addImage(seaweedimg);
    seaWeeds.velocityX = - 3;
    seaWeeds.lifetime = 600;
    seaweedsGroup.add(seaWeeds);
  }
}

function spawnSeaWeeds1(){
  if(frameCount % 60 === 0){
    var seaWeeds1 = createSprite(1300,660);
    //seaWeeds.debug = true;
    seaWeeds1.setCollider("circle", 0, -10, 250);
    seaWeeds1.scale = 0.2;
    seaWeeds1.addImage(seaweedimg);
    seaWeeds1.velocityX = - 3;
    seaWeeds1.lifetime = 600;
    seaweeds1Group.add(seaWeeds1);
  }
}