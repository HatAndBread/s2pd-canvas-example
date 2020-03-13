/// sound effects courtesy of syncopika on opengameart.org
/// http://greenbearmusic.bandcamp.com
/// game over music by Mega Pixel Music Lab


const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const hitCanvas = document.createElement('canvas')
const hitCtx = hitCanvas.getContext('2d')
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
canvas.width = 1200;   ////// window.innerWidth for full screen
canvas.height = 800;    ////////  window.innerHeight for full screen
hitCanvas.width = canvas.width;
hitCanvas.height = canvas.height;
width = canvas.width;
height = canvas.height;
canvas.style.backgroundColor = 'rgb(4,9,32)'

let enableDragAndDrop = true;

//What to do when an object is clicked on?
function objectClicked (clickedObject){
    clickedObject.clicked = true; 
}
// GAME VARIABLES******************************
/////////////////////////////////////////
/////////////////////////////////////////
let increasingBats = 0
let heroLives = 6
let gameOver = false;
let gameOverFirstTime = true;
let timer = 0
let counter = 1


//name,text,xPos,yPos,font,size,color,thickness,innerColor
const loadingText = new Text ('loadingText','LOADING...',(width/2)-100,height/2,'Arial',30,getRandomColor(),1,getRandomColor())
finalize(loadingText)

const startText = new Text ('startText', '❤️START❤️',(width/2)-(310/2),height/2,'Arial',60,getRandomColor(),2,getRandomColor())
startText.makeClickable()
startText.started = false;
finalize(startText)
const startRect = new Rectangle ('startRect',(startText.xPos),(startText.yPos-60),startText.width,startText.height+10,getRandomColor())
startRect.addOutline(getRandomColor(),4)
const instructions1 = new Text ('instructions','Use arrow keys to move.',0,0,'Arial',30,'Green')
const instructions2 = new Text ('instructions2','Use space to shoot mucus balls.',0,0,'Arial',30,'Green')
const instructions3 = new Text ('instructions3',`Don't touch the floating balls of death or you will die.`,0,0,'Arial',30,'Green')
finalize (instructions1)
finalize (instructions2)
finalize (instructions3)



const timeText = new Text ('timeText', `You have survived: ${timer} seconds`,(width/2),50,'Arial',30,'rgb(0,0,0)')
timeText.xPos = (width/2)-(timeText.width/2)
finalize (timeText)
const gameOverText = new Text ('gameOverText','💀GAME OVER💀',(width/2)-(310/2),height/2,'Arial',60,getRandomColor(),2,getRandomColor())
gameOverText.updateOpacity(0)
const stats = new Text ('stats', `You managed to stay alive for ${timer} seconds!`,(width/2)-260,height/1.5,'Arial',40,getRandomColor(),1,getRandomColor())
stats.updateOpacity(0)
const restartButton = new Rectangle ('restartButton',-45989,54867,200,100,getRandomColor())
restartButton.addOutline(getRandomColor(),8)
restartButton.makeClickable()
finalize(restartButton)
const restartText = new Text ('restartText', 'RESTART?',-600,-600,'Arial',36,getRandomColor(),1,getRandomColor())
gameOverText.xPos = (width/2) - (gameOverText.width/2)
stats.text= `You managed to stay alive for ${timer} seconds!`
stats.xPos = (width/2)-(stats.width/2)




const talking = new Sound ('talking','./talking.mp3',1,1.1,true)
const bgm = new Sound ('bgm','./bgm.mp3',1,1,true)
bgm.firstTime = true;
const birdChirp = new Sound('bird','birdChirp.mp3',1,1,false)
const moan = new Sound('moan','./moan.mp3',0.3,1,false)
const lazer = new Sound ('lazer','./lazer.mp3',1,1,false)
const explosion = new Sound ('explosion','./explosion.mp3',1,1,false)
const ouch = new Sound ('ouch','ouch.mp3',1,1,false)
const gameOverMusic = new Sound ('gameOverMusic','./gameOverMusic.mp3',1,1,true)




const clouds = new Background ('clouds',0,0,1,'./clouds.png',1,800,600)
clouds.autoSize()
clouds.makeScrollable()
clouds.velX = -0.15
finalize(clouds)

const mountains = new Background('mountains',0,0,1,'mountains.png',1,800,600)
mountains.autoSize()
mountains.makeScrollable()
finalize (mountains)

const onpu = new Sprite ('onpu',width-75,30,1,'./onpu.png',1,16,16)
onpu.addAnimation('main',0,1)
onpu.updateSize(2)
onpu.makeClickable()
finalize(onpu)

const hearts = []
for (let i = 0;i < 7;i++){
    const heart = new Sprite ('heart',40*i,30,1,'./heart.png',1,35,31);
    heart.addAnimation('main',0,1);
    hearts.push(heart)
    finalize(hearts[i])
    
}


const trees = new Background ('trees',0,0,1,'trees.png',1,800,600)
trees.autoSize()
trees.makeScrollable()
finalize(trees)

const ground = new Background ('ground',0,0,1,'ground.png',1,800,600)
ground.autoSize()
ground.makeScrollable()
finalize(ground);

const batFireLeft = new Sprite ('batFireLeft',-98724,-23974,8,'./fire.png',3,16,16)
batFireLeft.addAnimation('main',0,8)
batFireLeft.updateSize(4)
const batFireRight = new Sprite ('batFireRight',-98724,-23974,8,'./fire.png',3,16,16)
batFireRight.addAnimation('main',0,8)
batFireRight.updateSize(4)
finalize(batFireLeft)
finalize(batFireRight)

const bats = []
for (let i = 0;i <2;i++){
    const bat = new Sprite ('bat',300,300,14,'bat.png',3,64,48)
    bat.addAnimation ('flyingRight',0,6)
    bat.addAnimation('flyingLeft',6,6)
    bat.addAnimation('deadLeft',12,1)
    bat.addAnimation('deadRight',13,1)
    bat.dead = false;
    bat.updateSize(height*0.002)
    finalize(bat)
    bat.changeAnimationTo('flyingLeft')
    bat.hitDetect()
    bat.attacking = false;
    bat.launchedMissle = false;
    bats.push(bat)
}
bats[1].changeAnimationTo('flyingRight')
bats[0].xPos = width
bats[1].xPos = -bats[1].width
bats[0].orientation = 'left'
bats[1].orientation = 'right'


const hero = new Sprite ('hero',(width/4)-64,height-(height/3.08),35,'hero.png',3,128,128)
hero.addAnimation('standingRight',0,1)
hero.addAnimation('walkingRight',1,6)
hero.addAnimation('blinkingRight',7,4)
hero.addAnimation('standingLeft',21,1)
hero.addAnimation('walkingLeft',15,6)
hero.addAnimation('blinkingLeft',11,4)
hero.addAnimation('talkingLeft',21,7)
hero.addAnimation('talkingRight',28,7)
finalize(hero)
hero.hitDetect()
hero.updateSize(height*0.002)
hero.changeAnimationTo('standingRight')
hero.currentOrientation = 'right';
hero.frameCounter = 0;
hero.openedYap= false;



let increasingBatMissles = 0
const batMissles = [];
for (let i = 0; i < 200;i++){
    const batMissle = new Circle ('batMissle',-800,-800,randomBetween(20,30),getRandomColor())
    batMissle.addOutline(getRandomColor(),6)
    batMissle.bindToCanvas()
    batMissle.hitDetect()
    finalize(batMissle)
    batMissles.push(batMissle)
}

let increasingHeroMissle = 0
const heroMissles = [];
for (let i = 0; i < 10; i++){
    const heroMissle = new Circle('heroMissle',-420,-420,15,getRandomColor())
    finalize(heroMissle)
    heroMissle.hitDetect()  
    heroMissles.push(heroMissle)
}


////****************************************BEGIN GAME LOOP******************************************************
////****************************************BEGIN GAME LOOP******************************************************
////****************************************BEGIN GAME LOOP******************************************************
////****************************************BEGIN GAME LOOP******************************************************
////****************************************BEGIN GAME LOOP******************************************************
////****************************************BEGIN GAME LOOP******************************************************

const loop = () => {
    ctx.clearRect(0,0,width,height);
    hitCtx.clearRect(0,0,width,height)

    if (!gameOver){
        instructions1.moveTo((width/2)-(instructions1.width/2),startText.yPos+60)
        instructions2.moveTo((width/2)-(instructions2.width/2),startText.yPos+120)
        instructions3.moveTo((width/2)-(instructions3.width/2),startText.yPos+180)
    }
    startRect.make()
    startText.make()
    instructions1.make()
    instructions2.make()
    instructions3.make()
    if (startText.clicked && !gameOver){ ////// the whole loop is nested in here.
        
        startText.xPos = -42000
        instructions1.xPos = -42000
        instructions2.xPos = -42000
        instructions3.xPos = -42000
    if (heroLives===-1){
        gameOver = true;
    }

    if (restartButton.clicked){
        restartButton.clicked = false
    }
        
        

    if (bgm.firstTime){
        bgm.playAudio()
        bgm.firstTime = false;

    }    

    for (let i = 0; i <allAudioObjects.length;i++ ){
        if (allAudioObjects[i].ended){
            allAudioObjects.nowPlaying = false;
        }
    }
    for (let i = 0; i < allBackgrounds.length;i++){
        allBackgrounds[i].make();
        allBackgrounds[i].id = i;
        allBackgrounds[i].updatePos();
    }
    for (let i = 0; i < allGameObjects.length; i++){
        
        allGameObjects[i].make()
        allGameObjects[i].id = i
        allGameObjects[i].updatePos()
    }
    for (let i = 0; i < clickableObjects.length;i++){
        clickableObjects[i].clickableId = i;
        }
    if (hitDetectObjects.length>0){
        for (let i = 0; i < hitDetectObjects.length;i++){  
            hitDetectObjects[i].hitBoxId = i;
        }
    }
    if (enableDragAndDrop){
        for (let i = 0; i < draggableObjects.length;i++){
        draggableObjects[i].draggableId = i;
        }
    }

    ///REDUCE HERO'S HITBOX
    hero.hitBoxX=hero.xPos+(hero.width/3)
    hero.hitBoxWidth=(hero.width/3)
    hero.hitBoxHeight=(hero.height/1.2)
    if  (hero.openedYap){
        if (hero.currentFrame=== 6 && hero.currentOrientation === 'right'){
        hero.changeAnimationTo('standingRight')
        hero.openedYap = false;
        }
        if (hero.currentFrame=== 6 && hero.currentOrientation === 'left'){
         hero.changeAnimationTo('standingLeft')   
         hero.openedYap = false;
        }
    }

    counter++
    if (counter===60){
        timer++
        counter = 1}
    timeText.text = `You have survived: ${timer} seconds`    

    waitThen(0.01,1.9,'fire','updateSize',-0.2)
    waitThenTriggerOnce(2,'fire','destroy')

    if (bats[0].dead){
        batFireRight.xPos = bats[0].xPos+(bats[0].width/3)
        batFireRight.yPos = bats[0].yPos-(batFireRight.height-(bats[0].height/6))
    }
    if (bats[1].dead){
        batFireLeft.xPos = bats[1].xPos
        batFireLeft.yPos = bats[1].yPos-(batFireLeft.height-(bats[1].height/6))
    }
    if (!bats[0].dead){
        batFireRight.xPos=-23874
        batFireRight.yPos = -23456
    }
    if (!bats[1].dead){
        batFireLeft.xPos=-23874
        batFireLeft.yPos = -23456
    }


if (onpu.clicked && bgm.nowPlaying){
        bgm.stopAudio()
        onpu.clicked=false;
    }
if (onpu.clicked && !bgm.nowPlaying){
    bgm.playAudio()
    onpu.clicked=false;
    }
    

if (hero.currentAnimationName === 'standingLeft'){
    hero.frameCounter = 0;
    let ran = randomBetween(0,420)
    if (ran === 3){
        hero.changeAnimationTo('blinkingLeft')
    }
}

if (hero.currentAnimationName === 'blinkingLeft'){
    hero.frameCounter += 1
    if (hero.frameCounter=== hero.animationSpeed*4){
        hero.frameCounter = 0;
        hero.changeAnimationTo('standingLeft')
    }    
}
if (hero.currentAnimationName === 'standingRight'){
    hero.frameCounter = 0;
    let ran = randomBetween(0,420)
    if (ran === 3){
        hero.changeAnimationTo('blinkingRight')
    }
}

if (hero.currentAnimationName === 'blinkingRight'){
    hero.frameCounter += 1
    if (hero.frameCounter=== hero.animationSpeed*4){
        hero.frameCounter = 0;
        hero.changeAnimationTo('standingRight')
    }    
}

if (hero.xPos<=0){
    hero.xPos = 0;
}
if (hero.xPos >= width-hero.width){
    hero.xPos = width-hero.width;
}

for (let i = 0;i < heroMissles.length;i++){

    if (onScreen(heroMissles[i])){
        
    }
    else{
    heroMissles[i].moveTo(-420,420)
    heroMissles[i].velX = 0
    heroMissles[i].velY = 0
}
}



let toChirpOrNot = randomBetween(0,500)
if (toChirpOrNot === 420){
    birdChirp.playAudio()
}



//////////// ATTACK
if (increasingBatMissles === batMissles.length){
    increasingBatMissles = 0;
}

let attackOrNot = randomBetween(0,100)
if (attackOrNot === 0){
    batMissles[increasingBatMissles].xPos = randomBetween(1,width-1)
    batMissles[increasingBatMissles].yPos = batMissles[increasingBatMissles].radius+1
    batMissles[increasingBatMissles].velX = sansZeroRandomBetween(-10,10);
    batMissles[increasingBatMissles].velY = randomBetween(1,10)
    increasingBatMissles++
}
if (attackOrNot === 5){
    increasingBats= randomBetween(0,1)
    
    if (!bats[increasingBats].attacking){
    bats[increasingBats].whereToFire = randomBetween(0,width)    
    bats[increasingBats].attacking= true;
    if (increasingBats===0){
        bats[increasingBats].xPos = width
        bats[increasingBats].velX = -5;
        bats[increasingBats].yPos = randomBetween(height/3,height/2)
        
        }
    if (increasingBats===1){
        bats[increasingBats].xPos = -bats[increasingBats].width
        bats[increasingBats].velX = 5;
        bats[increasingBats].yPos = randomBetween(height/3,height/2)
    }
    }
}

if (bats[0].xPos<0-bats[0].width){
    bats[0].attacking = false;
    bats[0].launchedMissle = false;
    bats[0].xPos = width;
    bats[0].velX = 0;
}
if (bats[0].xPos <=bats[0].whereToFire+10 &&bats[0].xPos >= bats[0].whereToFire-10 && bats[0].launchedMissle === false){
    batMissles[increasingBatMissles].moveTo(bats[0].xPos,bats[0].yPos)
    batMissles[increasingBatMissles].velX = randomBetween(-10,-4)
    batMissles[increasingBatMissles].velY = randomBetween(0,10)
    lazer.playAudio()
    increasingBatMissles++
    bats[0].launchedMissle = true;
}

if (bats[1].xPos <=bats[1].whereToFire+10 &&bats[1].xPos >= bats[1].whereToFire-10 && bats[1].launchedMissle === false){
    batMissles[increasingBatMissles].moveTo(bats[1].xPos,bats[1].yPos)
    batMissles[increasingBatMissles].velX = randomBetween(4,10)
    batMissles[increasingBatMissles].velY = randomBetween(0,10)
    increasingBatMissles++
    lazer.playAudio()
    bats[1].launchedMissle = true;
}


if (bats[1].xPos>width){
    bats[1].attacking = false;
    bats[1].launchedMissle = false;
    bats[1].xPos = -bats[1].width;
    bats[1].velX = 0;
}

    ///keyboard
    if (leftDown){
        hero.frameCounter=0
        hero.currentOrientation = 'left'
        hero.changeAnimationTo('walkingLeft')
        mountains.control(0.6,0)
        trees.control(2,0)
        ground.control(5,0)
        hero.control(-9,0)
        if(!talking.nowPlaying){
            talking.playAudio()
        }

    }
    
    if (rightDown){
        hero.frameCounter=0
        hero.currentOrientation = 'right'
        hero.changeAnimationTo('walkingRight')
        mountains.control(-0.6,0)
        trees.control(-2,0)
        ground.control(-5,0)
        hero.control(9,0)
        if(!talking.nowPlaying){
            talking.playAudio()
        }
    }
    if(leftUp){
        hero.currentOrientation = 'left'
        hero.changeAnimationTo('standingLeft')
        if (talking.nowPlaying){
            talking.stopAudio()
        }
        leftUp = false;
    }
    if(rightUp){
        hero.currentOrientation = 'right'    
        hero.changeAnimationTo('standingRight')
        if (talking.nowPlaying){
            talking.stopAudio()
        }
        rightUp = false;
    }
    if (upUp){
        if(!hero.jumping){
            hero.currentFrame=0;
            hero.jump(randomBetween((height/2.3),(height/2.1)))
        } 
        upUp=false;    
    }
    if (upDown){   
    }
    
    if (downDown){
    }
    
    for (let i = 0;i < heroMissles.length;i++){
        heroMissles[i].color=getRandomColor()
    }
    if (spaceUp){
        heroMissles[increasingHeroMissle].moveTo(hero.xPos+(hero.width/2),hero.yPos+(hero.height/2))
        if (hero.currentOrientation==='right'){
            hero.changeAnimationTo('talkingRight')
            hero.openedYap= true;
            heroMissles[increasingHeroMissle].velX=20

        }
        if (hero.currentOrientation==='left'){
            hero.changeAnimationTo('talkingLeft')
            hero.openedYap = true;
            heroMissles[increasingHeroMissle].velX=-20
        }

        increasingHeroMissle++
        if (increasingHeroMissle===9){
            increasingHeroMissle=0;
        }
        spaceUp=false;    
    }


//**************PUT WHAT TO DO ON COLLISION HERE*************/

//// BAT DEATH
for (let i = 0;i<bats.length;i++){
    if (bats[i].dead && bats[i].yPos > height){
        bats[i].velX = 0;
        bats[i].velY = 0;
        bats[i].dead = false;
        bats[i].attacking=false;
        
        if (bats[i].orientation==='left'){
            bats[i].changeAnimationTo('flyingLeft')
        }
        if (bats[i].orientation==='right'){
            bats[i].changeAnimationTo('flyingRight')
        }
    }
}



const onHit = (hitObject1,hitObject2)  =>{

    if (hitObject1.name==='bat' && hitObject2.name=== 'heroMissle' && hitObject1.dead === false){
        if (hitObject1.orientation==='left'){
            hitObject1.changeAnimationTo('deadLeft')
            hitObject1.velX=0
            hitObject1.velY=10
            hitObject1.dead = true;
            moan.playAudio()
        }
        if (hitObject1.orientation==='right'){
            hitObject1.changeAnimationTo('deadRight')
            hitObject1.velX=0
            hitObject1.velY=10
            hitObject1.dead = true;
            moan.playAudio()
        }
    }
    if (hitObject2.name==='bat' && hitObject1.name=== 'heroMissle'){
        if (hitObject2.orientation==='left'){
            hitObject2.changeAnimationTo('deadLeft')
            hitObject2.velX=0
            hitObject2.velY=10
            hitObject2.dead = true;
            
        }
        if (hitObject2.orientation==='right'){
            hitObject2.changeAnimationTo('deadRight')
            hitObject2.velX=0
            hitObject2.velY=10
            hitObject2.dead = true;
        }
    }

    if (hitObject1.name==='hero' && hitObject2.name=== 'batMissle'){
        hitObject2.velX =0
        hitObject2.velY = 0
        hitObject2.xPos=randomBetween(-2000,200)
        hitObject2.yPos = randomBetween(-2000,200)
        hearts[heroLives].updateOpacity(0)
        heroLives -=1
        ouch.playAudio()
        
    }
    if (hitObject2.name==='hero' && hitObject1.name=== 'batMissle'){
        hitObject1.velX =0
        hitObject1.velY = 0
        hitObject1.xPos=randomBetween(-2000,200)
        hitObject1.yPos = randomBetween(-2000,200)
        ouch.playAudio()
        //hearts[heroLives].updateOpacity(0)
        //heroLives -=
    }

    if (hitObject1.name==='batMissle' && hitObject2.name=== 'heroMissle' || hitObject1.name==='heroMissle'&&hitObject2.name==='batMissle'){
        for (let i = 0; i<30;i++){
            const fire = new Circle('fire',hitObject1.xPos,hitObject1.yPos,randomBetween(3,5),'rgb('+ randomBetween(170,255)+','+randomBetween(0,90)+','+randomBetween(0,90)+')')
            fire.addOutline('rgb('+ randomBetween(170,255)+','+randomBetween(0,90)+','+randomBetween(0,90)+')',randomBetween(1,3))
            fire.velX = sansZeroRandomBetween(-10,10)
            fire.velY = sansZeroRandomBetween(-10,10)
            finalize(fire)
          
        }
        hitObject1.velX = 0
        hitObject1.velY = 0
        hitObject2.velX = 0
        hitObject2.velY = 0
        hitObject1.xPos = randomBetween(-2000,-200)
        hitObject1.yPos = randomBetween(-2000,-200)
        hitObject2.xPos = randomBetween(-2000,-200)
        hitObject2.yPos = randomBetween(-2000,-200)
        explosion.playAudio()
        
    }

}
//********************DETECT HITS************************************ */
if (hitDetectObjects.length >1){  
    for (let i = 0;i < hitDetectObjects.length;i++){   
        for (let j = 0; j < hitDetectObjects.length;j++){
            if (i !== j){
                if (hitDetectObjects[i].hitBoxX <= hitDetectObjects[j].hitBoxX+hitDetectObjects[j].hitBoxWidth&&
                    hitDetectObjects[i].hitBoxX + hitDetectObjects[i].hitBoxWidth >= hitDetectObjects[j].hitBoxX&&
                    hitDetectObjects[i].hitBoxY <= hitDetectObjects[j].hitBoxY+hitDetectObjects[j].hitBoxHeight&&
                    hitDetectObjects[i].hitBoxY + hitDetectObjects[i].hitBoxHeight >= hitDetectObjects[j].hitBoxY){
                    let hitObject1 = hitDetectObjects[i];
                    let hitObject2 = hitDetectObjects[j];
                    
                    onHit(hitObject1,hitObject2)                    
                        break;
                    }
                }
            }
        }
    } 
} 
if (gameOver){
    if (gameOverFirstTime){
        for (let i = 0; i < allAudioObjects.length;i++){
                allAudioObjects[i].stopAudio() 
                gameOverText.updateOpacity(1)
                stats.updateOpacity(1) 
        }
        gameOverMusic.playAudio()
        gameOverFirstTime = false;
        startRect.xPos=-1000
        
    }
    if (restartButton.clicked){
        location.reload()
    }


    stats.text = `You managed to stay alive for ${timer} seconds`
    gameOverText.make()
    stats.make()
    restartButton.make()
    restartText.make()
    gameOverText.updatePos()
    stats.updatePos()
    restartButton.updatePos()
    restartText.updatePos()
    restartButton.xPos = (width/2) - (restartButton.width/2)
    restartButton.yPos = height -200
    restartText.xPos = (width/2) - (restartText.width/2)
    restartText.yPos = restartButton.yPos+ (restartButton.height/2)
    
}    
    requestAnimationFrame(loop)    
}



function loadAssets(){
    let count = objectsToLoad.length, count2 = allAudioObjects.length;
    const canplay = () => {if (--count2 == 0) {
        startLoadingImages();
        }
    }
    const onLoad = () => {if (--count == 0) {
        finalize(startText);
        loop();
        loadingText.destroy();
        }
    }
    for (let i = 0; i < allAudioObjects.length;i++){
        allAudioObjects[i].theSound.addEventListener('canplaythrough',canplay,false);
        ctx.clearRect(0,0,width,height);
        hitCtx.clearRect(0,0,width,height)
        loadingText.make()
    }

    const startLoadingImages = () =>{
        for (let i = 0; i < objectsToLoad.length;i++){
            objectsToLoad[i].theImage.addEventListener('load',onLoad);
            objectsToLoad[i].theImage.src = objectsToLoad[i].source;
            objectsToLoad[i].make();
        }
    }
    
}


loadAssets()
