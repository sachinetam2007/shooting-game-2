var soldier,soldierImg,BG,BGImg_day,BGImg_night,thief,thiefImg,family,familyImg,bullet,bulletImg
var invisibleGround;
var bulletGroup, thiefGroup;
var score=0;
var gameover, gameoverImg,BGImg;
var gameState="PLAY";
var theivesArray=[]
var database
var reward=""
var blueBadge
function preload(){
  soldierImg=loadImage("soldier.png");
  thiefImg=loadImage("thief.png");
  familyImg=loadImage("family.png");
  bulletImg=loadImage("bullet.png");
  BGImg=loadImage("morning.jpg");
  BGImg_night=loadImage("nightBG.jpg");
  gameoverImg=loadImage("gameover.png");
  blueBadge=loadImage("blueBadge.png")
 // getBackground();
}

function setup() {
  createCanvas(displayWidth-20,displayHeight-20);
  database=firebase.database()
  BG=createSprite(800,400,2400,800)
  if(BGImg){
  BG.addImage(BGImg);
  BG.scale=2
  BG.velocityX=-2;
  BG.x=BG.width/2;
  bulletGroup=new Group()
  thiefGroup=new Group()

  //invisible ground
  invisibleGround=createSprite(width/2,displayHeight-140,displayWidth*2,20)
  invisibleGround.velocityX=-2;
  invisibleGround.x=invisibleGround.width/2
  invisibleGround.visible=false;

  //soldier sprite
  soldier=createSprite(500,displayHeight-140,10,10)
  soldier.addImage(soldierImg);
  soldier.scale=0.2

  //family sprite
  family=createSprite(100,displayHeight-160,10,10)
  family.addImage(familyImg);
  family.scale=0.5
  family.velocityY=0;


 //thief sprite
 //thief=createSprite(displayWidth-80,displayHeight-160,10,10)
 //thief.addImage(thiefImg);
 //thief.scale=0.4
 
 //gameover sprite
 gameover=createSprite(displayWidth/2,displayHeight/2,10,10)
 gameover.addImage(gameoverImg);
 gameover.scale=1;
 gameover.visible=false;
  }
}

function draw() {
 background("black")
 if(gameState==="PLAY"){
   if(BG.x<0) {
     BG.x=BG.width/2
   } 
   
   
   if(invisibleGround.x<0){
     invisibleGround.x=invisibleGround.width/2
   }
  Edges=createEdgeSprites();
   family.bounceOff(Edges[3])
   family.bounceOff(Edges[2])

   database.ref('score').on("value",function(data){
     score=data.val()
   })
  if(score%10===0&&score>0){
    var ref='reward/'+score
    console.log(ref)
    database.ref(ref).once("value",function(data){
    reward=data.val()
      console.log(reward)
    })
    
  }

  if(reward==="blue badge"){
    image(blueBadge,displayWidth-100,100,100,100)
  }
  spawnThief();
    
    
  //console.log(displayWidth)
  //console.log(displayHeight)
  for(var i=0;i<theivesArray.length;i++){
    if(bulletGroup.isTouching(theivesArray[i])){
      theivesArray[i].destroy();
      bulletGroup.destroyEach();
      score=score+1
      database.ref('/').update({score:score})
      

    }
    if(theivesArray[i].isTouching(family)){
      gameState="END"

    }
  }

  //if(thiefGroup.isTouching(family)){
    //gameState="END"
 // }
} 
  if(gameState==="END"){
    gameover.visible=true
    family.velocityY=0
    //thiefGroup.setVelocityXEach(0)
    BG.velocityX=0;
    invisibleGround.velocityX=0;
    for(var i=0;i<theivesArray.length;i++){
      theivesArray[i].velocityX=0
      
    }
    score=0
    database.ref('/').update({score:score})
  }
  
 
  soldier.collide(invisibleGround);
  drawSprites();
  stroke ("white")
  textSize(40)
  text("Theives killed : "+score,displayWidth-400,200)
  
}

function spawnBullets(){
 
    var bullet=createSprite(soldier.x,soldier.y-155,10,10)
    bullet.addImage(bulletImg)
    bullet.velocityX=4;
    bullet.scale=0.05
    bullet.depth=soldier.depth
    soldier.depth=soldier.depth+1
    bullet.lifetime=displayWidth/bullet.velocityX
    //bullet.debug=true;
    bulletGroup.add(bullet)

  
}

function spawnThief(){
  if (frameCount%100===0){
     //thief sprite
      thief=createSprite(displayWidth-80,random(100,900),10,10)
     thief.addImage(thiefImg);
     thief.setCollider("rectangle",0,0,thief.width-200,thief.height)
     thief.scale=0.3
    thief.velocityX=-8;
    //thief.debug=true;
    thief.depth=gameover.depth
    gameover.depth=gameover.depth+1
    console.log(thief.width)
    theivesArray.push(thief)
    //thiefGroup.add(thief)
  }
}

function keyPressed(){
  if(keyCode===32){
    spawnBullets();
    console.log()
  }

  if(keyCode===UP_ARROW){
    soldier.y=soldier.y-20
  }
  if(keyCode===DOWN_ARROW){
    soldier.y=soldier.y+20
  }

}
async function  getBackground(){
   var response=await fetch("http://worldtimeapi.org/api/timezone/India/Kolkata")
   var responsejson=await response.json()
   var datetime = responsejson.datetime
   var hour = datetime.slice(11,13)
   if(hour>=6&&hour<=19){
     BG="morning.jpg"
   }else{
     BG="nightBG.jpg"
   }
   BGImg=loadImage(BG)
   console.log(hour)
 }
