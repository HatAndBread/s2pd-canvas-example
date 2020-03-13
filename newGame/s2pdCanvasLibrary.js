
const allAudioObjects = []
const allGameObjects = []
const allBackgrounds = []
const clickableObjects = [];
const clickableColorsHash = {};
const draggableObjects = [];
const draggableColorsHash = {};
const hitDetectObjects = [];
const objectsToLoad = [];

//// Canvas and hit detection canvas setup
///



///01. get a random integer between two numbers.
function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

 /// get a random integer between two numbers excluding zero (example between -10 and 10 except for zero) 
function sansZeroRandomBetween (min,max,myNum){
    do{
        myNum = Math.floor(Math.random() * (max - min + 1)) + min;
        }
    while (myNum === 0)
        return myNum
    
}


///02. random no repeat array
//get random elements from an arrray witout repeating. 
// must call it with arrayToBeRandomized as the array you want randomized,
//and accompanyingArray as an empty array unique to the array to be randomized.
// EXAMPLE: getRandomNoRepeatLoop(myArray, myArrayEmpty)
function getRandomNoRepeatLoop(arrayToBeRandomized, accompanyingArray, theWord, theNumber){
    if (arrayToBeRandomized.length>0){
        theNumber = Math.floor(Math.random()*arrayToBeRandomized.length)
        theWord = arrayToBeRandomized[theNumber]
        accompanyingArray.push(theWord)
        arrayToBeRandomized.splice (theNumber,1)
        return theWord        
    }
    else {
        for (c=0;c<accompanyingArray.length;c++){
            arrayToBeRandomized.push(accompanyingArray[c])            
            if (c===accompanyingArray.length-1){
            accompanyingArray.splice(0,accompanyingArray.length);
            theNumber = Math.floor(Math.random()*arrayToBeRandomized.length)
            theWord = arrayToBeRandomized[theNumber]
            accompanyingArray.push(theWord)
            arrayToBeRandomized.splice (theNumber,1)
            return theWord
            }
        }
    }
}


///03. getRandomColor
const getRandomColor=()=>{
    return `rgb(${randomBetween(0,255)},${randomBetween(0,255)},${randomBetween(0,255)})`
} 


///04. return a random integer without any repeats between a range. when every number has been used will start over with the same set of numbers.
///
///  const newSet = new NoRepeatIntegerSet (15,30)
///  console.log(newSet.getNum()) <---- logs a random number between 15 and 30 without repeating itself
///                                     until all numbers within the range have been used. 

class NoRepeatIntegerSet {
    constructor(min,max){
        this.max = max;
        this.min = min;
        this.originalMax = max;
        this.originalMin = min;
        this.numArray = [];
        this.randomizedArray = [];
        this.arrayWidth = this.originalMax-this.originalMin;
        this.numnum = 0
        this.numnum2 = 0;
        this.numnum3 = 0;
        this.make();
    }
    make(){
        for (let i = 0;i<this.arrayWidth+1;i++){
           this.numArray[i]=this.min
           this.min +=1
                
        }
        for (let i = 0; i < this.arrayWidth+1; i++){
          this.numnum = Math.floor(Math.random()*this.numArray.length);
          this.numnum2 = this.numArray[this.numnum]
          this.randomizedArray.push(this.numnum2)
          this.numArray.splice(this.numnum,1)
        }
      }
      getNum(){
        if(this.randomizedArray.length>1){
          this.numnum3 = this.randomizedArray[0]
          this.randomizedArray.splice(0,1)
          return this.numnum3
        }
        if (this.randomizedArray.length===1){
            this.numnum3 = this.randomizedArray[0]
            this.randomizedArray.splice(0,1)   
            this.numArray.splice(0,this.numArray.length);
            this.randomizedArray.splice(0,this.randomizedArray.length)
            this.max = this.originalMax;
            this.min = this.originalMin;
            this.numnum = 0
            this.numnum2 = 0    
            this.make(this.originalMin,this.originalMax)
            return this.numnum3
        }
    }
}

/////Random boolean 
function randomBoolean(){
    let number = Math.round(Math.random())
    if (number === 0){
        console.log('true');
        return true;
        
    }
    else {
        console.log('false');
        return false;
    }
}

//////////////////******************* MOUSE ******************************
let mouseX, mouseY;
let dragStarted = false;
let draggingWithMouse = true;

dragArray = [];
document.addEventListener('click', function (event){mouseClick(event)})
document.addEventListener('mousemove', function(event){mouseMove(event)})
document.addEventListener('mousedown',function (event){mouseDown(event)})
document.addEventListener('mouseup',function(){mouseUp()})

const mouseMove = (event) => {
    if (dragStarted === true){
        mouseX = event.clientX;
        mouseY = event.clientY;
    }    
}

const mouseDown = (event) => {
    if (enableDragAndDrop === true){
        let clickedObject;
        let draggableOrNot = false;    
        mouseX = event.clientX;
        mouseY = event.clientY;
        dragStarted = true;    
        const pixel = hitCtx.getImageData(mouseX, mouseY, 1, 1).data;
        const color = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
            if (draggableColorsHash.hasOwnProperty(color)){
                draggableOrNot = true;
                draggingWithMouse = true;
                if (draggableOrNot){
                clickedObject = draggableObjects[draggableColorsHash[color].draggableId]
                objectMouseDowned(clickedObject);
            }
        }
    }    
}

function objectMouseDowned (downedObject){
    downedObject.dragging=true;
    
    }

const mouseUp = () => {
    if (dragStarted === true) {
        console.log(dragArray[0])
        dragStarted = false;
        for (let i = 0; i < draggableObjects.length;i++){
            draggableObjects[i].dragging = false;
        }
    }

    
}


const mouseClick = (event) =>{
    let clickedObject;
    let clickeryObject;
    
    mouseX = event.clientX;
    mouseY = event.clientY;
    const pixel = hitCtx.getImageData(mouseX, mouseY, 1, 1).data;
    const color = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;

    //////***********when object clicked ***********
    if (clickableColorsHash.hasOwnProperty(color)){
        
        clickeryObject = clickableObjects[clickableColorsHash[color].clickableId]
        clickedObject = allGameObjects[clickeryObject.id]
        objectClicked(clickedObject)

    }
    
}


//////////************************TOUCH STUFF*****************************************
let touchX, touchY,touchMoveX,touchMoveY,touchEndX,touchEndY;
document.addEventListener('touchstart',function(e) {
    // Cache the client X/Y coordinates
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
    if (enableDragAndDrop === true){
        let clickedObject;
        let draggableOrNot = false;    
        dragStarted = true;    
        const pixel = hitCtx.getImageData(touchX, touchY, 1, 1).data;
        const color = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
            if (draggableColorsHash.hasOwnProperty(color)){
                draggingWithMouse = false;
                draggableOrNot = true;
                if (draggableOrNot){
                clickedObject = draggableObjects[draggableColorsHash[color].draggableId]
                objectMouseDowned(clickedObject)
                }        
            }
        }
  }, false);


document.addEventListener('touchmove', function(e){
    touchMoveX = e.touches[0].clientX;
    touchMoveY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e){
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    
        console.log(dragArray[0])
        for (let i = 0; i < draggableObjects.length;i++){
        draggableObjects[i].dragging = false;
        dragStarted = false;
        
    }
});

//////////*****************KEYBOARD STUFF*************************************
//// simplify keyboard input.  use keyboardHelper.up  instead of key code. 
const keyboardHelper = {
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    space: 32,
    enter: 13,
    esc: 27
};
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

let rightDown = false;
let leftDown = false;
let upDown = false;
let downDown = false;
let spaceDown = false;
let escDown = false;
let enterDown = false;
let spaceUp = false;
let leftUp = false;
let rightUp = false;
let upUp = false;
let downUp = false;
let escUp = false;
let enterUp = false;

/// Detect keys touched.
function keyDownHandler(event) {
    if(event.keyCode === keyboardHelper.right) {
        rightDown = true;
    }
    if(event.keyCode === keyboardHelper.left) {
        leftDown = true;
    }
    if(event.keyCode === keyboardHelper.down) {
        downDown = true;
    }
    if(event.keyCode === keyboardHelper.up) {
        upDown = true;
    }
    if(event.keyCode === keyboardHelper.space) {
        spaceDown = true;
    }
    if(event.keyCode === keyboardHelper.esc) {
    	escDown = true;
    }
    else if(event.keyCode === keyboardHelper.enter) {
    	enterDown = true;
    }
}
function keyUpHandler(event) {
    if(event.keyCode === keyboardHelper.right) {
        rightDown = false;
        rightUp = true;
    }
    if(event.keyCode === keyboardHelper.left) {
        leftDown = false;
        leftUp = true;
    }
    if(event.keyCode === keyboardHelper.down) {
        downDown = false;
        downUp = true;
    }
    if(event.keyCode === keyboardHelper.up) {
        upDown = false;
        upUp = true;
    }
    if(event.keyCode === keyboardHelper.space) {
        spaceDown = false;
        spaceUp = true;
    }
    if(event.keyCode === keyboardHelper.esc) {
        escDown = false;
        escUp = true;
    }
    else if(event.keyCode === keyboardHelper.enter) {
        enterDown = false;
        enterUp = true;
    }
}

// ***********************TEXT*****************************

class Text {constructor(name,text,xPos,yPos,font,size,color,thickness,innerColor){
    this.name = name;
    this.text = text;
    this.xPos = xPos;
    this.yPos = yPos;
    this.font = font;
    this.size = size;
    this.color = color;
    this.thickness = thickness;
    this.innerColor = innerColor;
    this.width = 0;
    this.height = 0;
    this.velX = 0;
    this.velY = 0;
    this.clickable = false;
    this.clicked = false;
    this.colorKey = ''
    this.opacity = 1;
    this.jumping = false;
    this.jumpFrames = 0;
    this.jumpCompleted = false;
    this.jumpHeight =0
    this.draggable = false;
    this.dragging = false;
    this.bindable = false;
    this.deadOutsideCanvas = false;
    this.detectHit = false;
    this.hitBoxX = this.xPos-this.radius;
    this.hitBoxY = this.yPos-this.radius;
    this.hitBoxWidth = this.radius*2;
    this.hitBoxHeight = this.radius*2;
    this.hitBoxId;
    this.clickableId = 0;
    this.draggableId = 0;
    this.id = 0;
    this.timeStamp = Date.now()
    this.triggeredOnce = false;
    this.mouseDowned = false;

        this.make()   
}
make(){
    if (typeof this.thickness === 'number'){   
        if (typeof this.innerColor === 'string'){
            ctx.globalAlpha = this.opacity;
            ctx.font = `${this.size}px ${this.font}`
            ctx.strokeStyle = this.color
            ctx.fillStyle = this.innerColor;
            ctx.lineWidth= this.thickness
            this.width = ctx.measureText(this.text).width
            this.height = this.size;
            ctx.fillText(this.text,this.xPos,this.yPos)
            ctx.strokeText(this.text, this.xPos, this.yPos);
            ctx.globalAlpha = 1;
        }
        ctx.globalAlpha = this.opacity;
        ctx.font = `${this.size}px ${this.font}`
        ctx.strokeStyle = this.color
        ctx.lineWidth= this.thickness
        this.width = ctx.measureText(this.text).width
        this.height = this.size;
        ctx.strokeText(this.text, this.xPos, this.yPos);
        ctx.globalAlpha = 1;
        
        
        
        if (this.clickable || this.draggable){  
            hitCtx.fillStyle = this.colorKey;
            hitCtx.fillRect(this.xPos,this.yPos-this.height,this.width,this.height);
            hitCtx.fill();
        }
    }
    else { 
         
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.font = `${this.size}px ${this.font}`
        ctx.fillText(this.text, this.xPos, this.yPos);
        this.width = ctx.measureText(this.text).width
        this.height = this.size;
        ctx.globalAlpha = 1;
        if (this.clickable || this.draggable){
            hitCtx.fillStyle = this.colorKey;
            hitCtx.fillRect(this.xPos,this.yPos-this.height,this.width,this.height);
            hitCtx.fill();    
        }
    }    

    
    if (this.jumping){
        this.jumpFrames += 1;
        if (this.jumpFrames>0 && this.jumpFrames <=5){
            this.yPos -= this.jumpHeight/10;
            }
            if (this.jumpFrames>5&&this.jumpFrames <= 11){
                this.yPos -= this.jumpHeight/20
            }
            if(this.jumpFrames>11&&this.jumpFrames <= 15){
                this.yPos-= this.jumpHeight/25
            }
            if(this.jumpFrames>15&&this.jumpFrames <= 17){
                this.yPos-= this.jumpHeight/50
            }
            if(this.jumpFrames >17 &&this.jumpFrames <= 19){
                this.yPos+= this.jumpHeight/50
                
            }
            if(this.jumpFrames >19 && this.jumpFrames <= 23){
                this.yPos += this.jumpHeight/25
            }
            if(this.jumpFrames>23&&this.jumpFrames <= 29){
                this.yPos+= this.jumpHeight/20
            }
            if(this.jumpFrames>29&&this.jumpFrames <= 34){
                this.yPos+= this.jumpHeight/10;
                
            }
            if(this.jumpFrames>=35){
                this.jumping=false;
                this.jumpFrames = 0;
                this.jumpCompleted= true;
            }
            
        }
    }
hitDetect(){
    this.detectHit = true;
    this.hitBoxId = hitDetectObjects.length
    hitDetectObjects.push(this);
}
makeClickable(){
    this.clickable = true;
    this.draggable = false;
    this.clickableId = clickableObjects.length
    clickableObjects.push(this);
    while(true) {
    const colorKey = getRandomColor();
    if (!clickableColorsHash[colorKey]) {
      this.colorKey = colorKey; 
      clickableColorsHash[colorKey] = this;
      return;
      }
    }
}
makeDraggable(){
    this.draggable = true;
    this.clickable = false;
    this.draggableId = draggableObjects.length;
    draggableObjects.push(this);
    while(true) {
        const colorKey = getRandomColor();
        if (!draggableColorsHash[colorKey]) {
          this.colorKey = colorKey; 
          draggableColorsHash[colorKey] = this;
          return;
          }
        }
}
control(speedX,speedY){
    this.xPos += speedX;
    this.yPos += speedY;
    
}
jump(howMuch){
    this.jumpHeight = howMuch
    this.jumpFrames =0;
    this.jumping=true;
}
moveTo(newX,newY){
    this.xPos = newX;
    this.yPos = newY;
}
stop () {
    this.velX = 0;
    this.velY = 0;
}
bindToCanvas(){
    this.bindable = true;
}
destroyOutsideCanvas(){
    this.deadOutsideCanvas = true;
}
updatePos(){
    allGameObjects[this.id] = this;
    if (this.bindable){
        if (this.xPos <= 0){
            this.velX = -(this.velX);
        }
        if (this.xPos >= width){
            this.velX = -(this.velX)
        }
        if (this.yPos <= 0){
            this.velY = -(this.velY)
        } 
        if (this.yPos >= height){
            this.velY = -(this.velY)
        }   
    }
    if (this.deadOutsideCanvas){
        if (this.xPos <= randomBetween(this.width*-10,this.width*-2)){
            this.destroy()
        }
        if (this.xPos >= randomBetween(width + this.width*2,width+this.width*10)){
            this.destroy()
        }
        if (this.yPos <= randomBetween(this.height*-10,this.height*-2)){
            this.destroy()
        } 
        if (this.yPos >= randomBetween(height + this.height*2,height+this.height*10)){
            this.destroy()
        }   
    }
    if (this.dragging === true){
        dragArray[0] = this
        if (draggingWithMouse){
            this.xPos = mouseX;
            this.yPos = mouseY;
        }
        else {
            this.xPos = touchMoveX;
            this.yPos = touchMoveY;
        }
        
    }
    else {
        
        this.xPos += this.velX;
        this.yPos += this.velY;
        if (this.detectHit){
            this.hitBoxX = this.xPos;
            this.hitBoxY = this.yPos;
            this.hitBoxWidth = this.width;
            this.hitBoxHeight = this.height;
            hitDetectObjects[this.hitBoxId] = this;
        }
    }
    
}
updateSize(howMuch){
    if (howMuch < 0){
        if (this.size>(howMuch*-1)){
            this.size *= howMuch;
        }
    }
   else {this.size *= howMuch;
    this.size *= howMuch;}
}
updateOpacity(howMuch){
    this.opacity = howMuch;
}
destroy(){
    if (this.clickable){
    clickableObjects.splice(this.clickableId,1)
    }
    if (this.detectHit){
        hitDetectObjects.splice (this.hitBoxId,1) 
        for (let i=0;i<hitDetectObjects.length;i++){
            hitDetectObjects[i].hitBoxId= i;
        }
    }
    
    allGameObjects.splice(this.id,1)
}
}






/////***********************SPRITES******************************** */
///
/// Sprite must be laid out in a single row with each frame sized equally. 
/// For example, a 10 frame animation with 32 x 32 pixel individual frames must be laid out 
/// in a 320 x 32 file. The library will take care of the rest. 
///
///  const rabbit = new Sprite ('rabbit', 100,100,10,'./rabbits.png',3) **create rabbit at coordinates 100,100.10 frames in file. source. speed (1 to 60 with one being the fastest)
///  rabbit.addAnimation('left',0,4) *** add an animation starting at frame 0 and continuing for 4 frames
///  rabbit.addAnimation('right',4,4) *** add an animation starting at frame 4 and continuing for 4 frames
///  rabbit.addAnimation('stopLeft',8,1) *** add a single frame animation starting at frame 8
///  rabbit.addAnimation('stopRight',9,1)  *** add a single frame animation starting at frame 9
///  finalize(rabbit)


class Sprite {
    constructor(name,xPos,yPos,numberOfFrames,source,animationSpeed,width,height){
        this.name = name;
        this.xPos = xPos;
        this.yPos = yPos;
        this.numberOfFrames = numberOfFrames;
        this.width = width;
        this.height = height;
        this.velX = 0;
        this.velY = 0;
        this.source = source;
        this.animationSpeed = animationSpeed + (60%animationSpeed/(Math.floor(60/animationSpeed)))
        this.refreshRate = 60/animationSpeed 
        this.loopLength = 0
        this.timeThroughLoop = 0;
        this.currentFrame = 0
        this.animations = [[0,0,0,0,0]]
        this.currentAnimation = 0;
        this.currentAnimationName = ''
        this.clickable = false;
        this.clicked = false;
        this.colorKey = ''
        this.opacity = 1;
        this.jumping = false;
        this.jumpFrames = 0;
        this.jumpCompleted = false;
        this.jumpHeight =0
        this.draggable = false;
        this.dragging = false;
        this.bindable = false;
        this.deadOutsideCanvas = false;
        this.detectHit = false;
        this.hitBoxX = this.xPos;
        this.hitBoxY = this.yPos;
        this.hitBoxWidth = this.width;
        this.hitBoxHeight = this.height;
        this.hitBoxId;
        this.clickableId = 0;
        this.draggableId = 0;
        this.id = 0;
        this.timeStamp = Date.now();
        this.triggeredOnce = false;
        this.mouseDowned = false;
        this.theImage = document.createElement('img');
        this.load()
    }
    load(){
        objectsToLoad.push(this)
        //this.theImage.addEventListener('load', function(){loadedObjects.push(this)})
        //this.theImage.src= this.source;
        //this.make()
    }
    make(){
        
        
        
        let heightOfFrame = this.theImage.height
        let widthOfFrame = this.theImage.width/this.numberOfFrames
        
        this.loopLength = this.refreshRate*this.animations[this.currentAnimation][2]


    if (this.timeThroughLoop === this.animationSpeed){
        this.currentFrame +=1;
        this.timeThroughLoop = 0;
        if (this.currentFrame >= this.animations[this.currentAnimation][2]/* **this is the number of frames in animation** */){
            this.currentFrame=0;
        }
        
    }
     ctx.globalAlpha = this.opacity 
      ctx.drawImage(this.theImage, 
              (this.animations[this.currentAnimation][1]*widthOfFrame)+(this.currentFrame*widthOfFrame),
              0,
              widthOfFrame,
              heightOfFrame,
              this.xPos,
              this.yPos,
              this.width,
              this.height);
        
        
              
        ctx.globalAlpha = 1;
            if (this.clickable || this.draggable){ 
                hitCtx.fillStyle = this.colorKey;
                hitCtx.fillRect(this.xPos,this.yPos,this.width,this.height);   
            }
        if (this.jumping){
            this.jumpFrames += 1;
            if (this.jumpFrames>0 && this.jumpFrames <=5){
                this.yPos -= this.jumpHeight/10;
                }
                if (this.jumpFrames>5&&this.jumpFrames <= 11){
                    this.yPos -= this.jumpHeight/20
                }
                if(this.jumpFrames>11&&this.jumpFrames <= 15){
                    this.yPos-= this.jumpHeight/25
                }
                if(this.jumpFrames>15&&this.jumpFrames <= 17){
                    this.yPos-= this.jumpHeight/50
                }
                if(this.jumpFrames >17 &&this.jumpFrames <= 19){
                    this.yPos+= this.jumpHeight/50
                    
                }
                if(this.jumpFrames >19 && this.jumpFrames <= 23){
                    this.yPos += this.jumpHeight/25
                }
                if(this.jumpFrames>23&&this.jumpFrames <= 29){
                    this.yPos+= this.jumpHeight/20
                }
                if(this.jumpFrames>29&&this.jumpFrames <= 34){
                    this.yPos+= this.jumpHeight/10;
                    
                }
                if(this.jumpFrames>=35){
                    this.jumping=false;
                    this.jumpFrames = 0;
                    this.jumpCompleted= true;
                }
                
            }

            
        
        
        this.timeThroughLoop+=1;
    }
    addAnimation(name,startFrame,numberOfFrames){
        this.animations.push([name,startFrame,numberOfFrames])
        this.currentAnimationName = name;
        

    }
    changeAnimationTo(name){
        for (let i = 0;i < this.animations.length;i++){
            if (this.animations[i][0]===name){this.currentAnimation=i}
            this.currentAnimationName= name;
        }
    }
    hitDetect(){
        this.detectHit = true;
        this.hitBoxId = hitDetectObjects.length
        hitDetectObjects.push(this);
    }
    makeClickable(){
        this.clickable = true;
        this.draggable = false;
        this.clickableId = clickableObjects.length
        clickableObjects.push(this);
        while(true) {
        const colorKey = getRandomColor();
        if (!clickableColorsHash[colorKey]) {
          this.colorKey = colorKey; 
          clickableColorsHash[colorKey] = this;
          return;
          }
        }
    }
    makeDraggable(){
        this.draggable = true;
        this.clickable = false;
        this.draggableId = draggableObjects.length;
        draggableObjects.push(this);
        while(true) {
            const colorKey = getRandomColor();
            if (!draggableColorsHash[colorKey]) {
              this.colorKey = colorKey; 
              draggableColorsHash[colorKey] = this;
              return;
              }
            }
    }

    control(speedX,speedY){
        this.xPos += speedX;
        this.yPos += speedY;
        
    }
    jump(howMuch){
        this.jumpHeight = howMuch
        this.jumpFrames =0;
        this.jumping=true;
    }
    moveTo(newX,newY){
        this.xPos = newX;
        this.yPos = newY;
    }
    stop () {
        this.velX = 0;
        this.velY = 0;
    }
    bindToCanvas(){
        this.bindable = true;
    }
    destroyOutsideCanvas(){
        this.deadOutsideCanvas = true;
    }
    updatePos(){
        allGameObjects[this.id] = this;
        if (this.bindable){
            if (this.xPos <= 0){
                this.velX = -(this.velX);
            }
            if (this.xPos >= width){
                this.velX = -(this.velX)
            }
            if (this.yPos <= 0){
                this.velY = -(this.velY)
            } 
            if (this.yPos >= height){
                this.velY = -(this.velY)
            }   
        }
        if (this.deadOutsideCanvas){
            if (this.xPos <= randomBetween(this.width*-10,this.width*-2)){
                this.destroy()
            }
            if (this.xPos >= randomBetween(width + this.width*2,width+this.width*10)){
                this.destroy()
            }
            if (this.yPos <= randomBetween(this.height*-10,this.height*-2)){
                this.destroy()
            } 
            if (this.yPos >= randomBetween(height + this.height*2,height+this.height*10)){
                this.destroy()
            }   
        }
        if (this.dragging === true){
            dragArray[0] = this
            if (draggingWithMouse){
                this.xPos = mouseX;
                this.yPos = mouseY;
            }
            else {
                this.xPos = touchMoveX;
                this.yPos = touchMoveY;
            }
            
        }
        else {
            
            this.xPos += this.velX;
            this.yPos += this.velY;
            if (this.detectHit){
                this.hitBoxX = this.xPos;
                this.hitBoxY = this.yPos;
                this.hitBoxWidth = this.width;
                this.hitBoxHeight = this.height;
                hitDetectObjects[this.hitBoxId] = this;
            }
        }
        
    }
    updateSize(howMuch){
        if (howMuch < 0){
            if (this.width>(howMuch*-1)){
                this.width *= howMuch;
            }
            if (this.height>(howMuch*-1)){
                this.height *= howMuch;
            }
        }
       else {this.width *= howMuch
        this.height *= howMuch}
    }
    updateOpacity(howMuch){
        this.opacity = howMuch
    }
    destroy(){
        if (this.clickable){
        clickableObjects.splice(this.clickableId,1)
        }
        if (this.detectHit){
            hitDetectObjects.splice (this.hitBoxId,1) 
            for (let i=0;i<hitDetectObjects.length;i++){
                hitDetectObjects[i].hitBoxId= i;
            }
        }
        
        allGameObjects.splice(this.id,1)
    }
}

////////////************************SHAPES**************************

///// Make a circle    const newCircle = new Circle ('name',x,y,radius,color, thickness - leave BLANK for filled circle)





class Circle {
    constructor(name,xPos,yPos,radius,color,thickness){
        this.name = name;
        this.xPos = xPos;
        this.yPos = yPos;
        this.radius = radius;
        this.color = color;
        this.thickness = thickness;
        this.velX = 0;
        this.velY = 0;
        this.clickable = false;
        this.clicked = false;
        this.colorKey = ''
        this.opacity = 1;
        this.outlineSwitch = false;
        this.outlineThickness = 0;
        this.outlineColor = 'rgb(0,0,0)'
        this.jumping = false;
        this.jumpFrames = 0;
        this.jumpCompleted = false;
        this.jumpHeight =0
        this.draggable = false;
        this.dragging = false;
        this.bindable = false;
        this.deadOutsideCanvas = false;
        this.detectHit = false;
        this.hitBoxX = this.xPos-this.radius;
        this.hitBoxY = this.yPos-this.radius;
        this.hitBoxWidth = this.radius*2;
        this.hitBoxHeight = this.radius*2;
        this.hitBoxId;
        this.clickableId = 0;
        this.draggableId = 0;
        this.id = 0;
        this.timeStamp = Date.now()
        this.triggeredOnce = false;
        this.mouseDowned=false;

        this.make()
    }

    
    make(){    
        if (typeof this.thickness=== 'number'){   
            ctx.beginPath();
            ctx.globalAlpha = this.opacity  
            ctx.strokeStyle=this.color
            ctx.lineWidth=this.thickness;
            ctx.arc(this.xPos,this.yPos,this.radius,0,2*Math.PI);
            ctx.stroke()
            ctx.globalAlpha = 1;
            
            if (this.clickable || this.draggable){
                hitCtx.beginPath();
                hitCtx.strokeStyle=this.colorKey
                hitCtx.lineWidth = this.thickness
                hitCtx.arc(this.xPos,this.yPos,this.radius,0,2*Math.PI);
                hitCtx.stroke();
            }
        }
        else { 
            ctx.beginPath();  
            ctx.globalAlpha = this.opacity
            ctx.fillStyle = this.color;        
            ctx.arc(this.xPos,this.yPos,this.radius,0,2*Math.PI);
            ctx.fill() 
            ctx.globalAlpha = 1;
            if (this.outlineSwitch){
                ctx.strokeStyle=this.outlineColor;
                ctx.lineWidth=this.outlineThickness;
                ctx.arc(this.xPos,this.yPos,this.radius,0,2*Math.PI);
                ctx.stroke()
            }
            if (this.clickable || this.draggable){
                hitCtx.beginPath();
                hitCtx.globalAlpha = this.opacity;
                hitCtx.fillStyle = this.colorKey;
                hitCtx.arc(this.xPos,this.yPos,this.radius,0,2*Math.PI);
                hitCtx.fill();
                hitCtx.globalAlpha = 1;
                
            }
        } 
        if (this.jumping){
            this.jumpFrames += 1;
            if (this.jumpFrames>0 && this.jumpFrames <=5){
                this.yPos -= this.jumpHeight/10;
                }
                if (this.jumpFrames>5&&this.jumpFrames <= 11){
                    this.yPos -= this.jumpHeight/20
                }
                if(this.jumpFrames>11&&this.jumpFrames <= 15){
                    this.yPos-= this.jumpHeight/25
                }
                if(this.jumpFrames>15&&this.jumpFrames <= 17){
                    this.yPos-= this.jumpHeight/50
                }
                if(this.jumpFrames >17 &&this.jumpFrames <= 19){
                    this.yPos+= this.jumpHeight/50
                    
                }
                if(this.jumpFrames >19 && this.jumpFrames <= 23){
                    this.yPos += this.jumpHeight/25
                }
                if(this.jumpFrames>23&&this.jumpFrames <= 29){
                    this.yPos+= this.jumpHeight/20
                }
                if(this.jumpFrames>29&&this.jumpFrames <= 34){
                    this.yPos+= this.jumpHeight/10;
                    
                }
                if(this.jumpFrames>=35){
                    this.jumping=false;
                    this.jumpFrames = 0;
                    this.jumpCompleted= true;
                }
                
            }   
    }
    hitDetect(){
        this.detectHit = true;
        this.hitBoxId = hitDetectObjects.length
        hitDetectObjects.push(this);
    }
    makeClickable(){
        this.clickable = true;
        this.draggable = false;
        this.clickableId = clickableObjects.length
        clickableObjects.push(this);
        while(true) {
        const colorKey = getRandomColor();
        if (!clickableColorsHash[colorKey]) {
          this.colorKey = colorKey; 
          clickableColorsHash[colorKey] = this;
          return;
          }
        }
    }
    makeDraggable(){
        this.draggable = true;
        this.clickable = false;
        this.draggableId = draggableObjects.length;
        draggableObjects.push(this);
        while(true) {
            const colorKey = getRandomColor();
            if (!draggableColorsHash[colorKey]) {
              this.colorKey = colorKey; 
              draggableColorsHash[colorKey] = this;
              return;
              }
            }
    }
    control(speedX,speedY){
        this.xPos += speedX;
        this.yPos += speedY;
    }
    moveTo(newX,newY){
        this.xPos = newX;
        this.yPos = newY;
    }
    stop () {
        this.velX = 0;
        this.velY = 0;
    }
    jump(howMuch){
        this.jumpHeight = howMuch
        this.jumpFrames =0;
        this.jumping=true;
    }
    bindToCanvas(){
        this.bindable = true;
    }
    destroyOutsideCanvas(){
        this.deadOutsideCanvas = true;
    }
    updatePos(){
        allGameObjects[this.id] = this;
        if (this.bindable){
            if (this.xPos <= this.radius){
                this.velX = -(this.velX);
            }
            if (this.xPos >= width-this.radius){
                this.velX = -(this.velX)
            }
            if (this.yPos <= this.radius){
                this.velY = -(this.velY)
            } 
            if (this.yPos >= height-this.radius){
                this.velY = -(this.velY)
            }   
        }
        if (this.deadOutsideCanvas){
            if (this.xPos <= randomBetween(this.radius*-10,this.radius*-2)){
                this.destroy()
            }
            if (this.xPos >= randomBetween(width + this.radius*2,width+this.radius*10)){
                this.destroy()
            }
            if (this.yPos <= randomBetween(this.radius*-10,this.radius*-2)){
                this.destroy()
            } 
            if (this.yPos >= randomBetween(height + this.radius*2,height+this.radius*10)){
                this.destroy()
            }   
        }
        if (this.dragging === true){
            dragArray[0] = this
            if (draggingWithMouse){
                this.xPos = mouseX;
                this.yPos = mouseY;
            }
            else {
                this.xPos = touchMoveX;
                this.yPos = touchMoveY;
            }
            
        }
        else {
            
            this.xPos += this.velX;
            this.yPos += this.velY;
            if (this.detectHit){
                this.hitBoxX = this.xPos-this.radius
                this.hitBoxY = this.yPos-this.radius
                this.hitBoxWidth = this.radius*2;
                this.hitBoxHeight = this.radius*2;
                hitDetectObjects[this.hitBoxId] = this;
            }
        }
        
    }
    updateSize(howMuch){
        if (this.radius + howMuch>0){
            this.radius += howMuch
        }
    }
    updateOpacity(howMuch){
        if (howMuch < 0){
            if (this.opacity>(howMuch*-1)){
                this.opacity += howMuch;
            }
        }
       else {this.opacity += howMuch}
    }
    updateColor(r,g,b,keepTrack){
     keepTrack = []
     keepTrack.push(r)
     keepTrack.push(g)
     keepTrack.push(b)
     keepTrack.forEach(element => {
         if (element < 0){
     element = 0}
        if (element > 255){element = 255}
         })

     this.color = `rgb(${r},${g},${b})`
    } 
    updateThickness(howMuch){
        if (howMuch < 0){
            if (this.thickness>(howMuch*-1)){
                this.thickness += howMuch;
            }
        }
       else {this.thickness += howMuch}
    }
    addOutline(color,thickness){
        this.outlineSwitch = true;
        this.outlineColor = color;
        this.outlineThickness = thickness;
        }
    destroy(){
        if (this.clickable){
        clickableObjects.splice(this.clickableId,1)
        }
        if (this.detectHit){
            hitDetectObjects.splice (this.hitBoxId,1) 
            for (let i=0;i<hitDetectObjects.length;i++){
                hitDetectObjects[i].hitBoxId= i;
            }
        }
        
        allGameObjects.splice(this.id,1)
    }
}
    



/////////// Make a rectangle. const newRectangle = new Rectangle(x,y,width,height,color,velocity1,velocity2,thickness)
//// leave thickness blank for a filled rectangle.
class Rectangle {
    constructor(name,xPos,yPos,width,height,color,thickness){
        this.name = name;
        this.xPos = xPos;
        this.yPos = yPos;
        this.wxPos = xPos  + width;       
        this.hyPos = yPos + height;       
        this.width = width;
        this.height = height;
        this.color = color;
        this.velX = 0;
        this.velY = 0;
        this.thickness = thickness;


        this.clickable = false;
        this.clicked = false;
        this.colorKey = ''
        this.opacity = 1;
        this.outlineSwitch = false;
        this.outlineThickness = 0;
        this.outlineColor = 'rgb(0,0,0)'
        this.jumping = false;
        this.jumpFrames = 0;
        this.jumpCompleted = false;
        this.jumpHeight =0
        this.draggable = false;
        this.dragging = false;
        this.bindable = false;
        this.deadOutsideCanvas = false;
        this.detectHit = false;
        this.hitBoxX = this.xPos;
        this.hitBoxY = this.yPos;
        this.hitBoxWidth = this.width;
        this.hitBoxHeight = this.height;
        this.hitBoxId;
        this.clickableId = 0;
        this.draggableId = 0;
        this.id = 0;
        this.timeStamp = Date.now()
        this.triggeredOnce = false;
        this.mouseDowned = false;

        this.make()
    }


    make(){
        if (typeof this.thickness === 'number'){
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.thickness;
            ctx.strokeRect(this.xPos,this.yPos,this.width,this.height);
            if (this.clickable || this.draggable){ 
                hitCtx.fillStyle = this.colorKey;
                hitCtx.fillRect(this.xPos,this.yPos,this.width,this.height);
            }
        }
        else{
            ctx.fillStyle = this.color;
            ctx.fillRect(this.xPos,this.yPos,this.width,this.height);
            if (this.outlineSwitch){
                ctx.strokeStyle=this.outlineColor;
                ctx.lineWidth=this.outlineThickness;
                ctx.strokeRect(this.xPos,this.yPos,this.width,this.height);
                
            }
            if (this.clickable || this.draggable){ 
                hitCtx.fillStyle = this.colorKey;
                hitCtx.fillRect(this.xPos,this.yPos,this.width,this.height);
            }  
        }
        if (this.jumping){
            this.jumpFrames += 1;
            if (this.jumpFrames>0 && this.jumpFrames <=5){
                this.yPos -= this.jumpHeight/10;
                }
                if (this.jumpFrames>5&&this.jumpFrames <= 11){
                    this.yPos -= this.jumpHeight/20
                }
                if(this.jumpFrames>11&&this.jumpFrames <= 15){
                    this.yPos-= this.jumpHeight/25
                }
                if(this.jumpFrames>15&&this.jumpFrames <= 17){
                    this.yPos-= this.jumpHeight/50
                }
                if(this.jumpFrames >17 &&this.jumpFrames <= 19){
                    this.yPos+= this.jumpHeight/50
                    
                }
                if(this.jumpFrames >19 && this.jumpFrames <= 23){
                    this.yPos += this.jumpHeight/25
                }
                if(this.jumpFrames>23&&this.jumpFrames <= 29){
                    this.yPos+= this.jumpHeight/20
                }
                if(this.jumpFrames>29&&this.jumpFrames <= 34){
                    this.yPos+= this.jumpHeight/10;
                    
                }
                if(this.jumpFrames>=35){
                    this.jumping=false;
                    this.jumpFrames = 0;
                    this.jumpCompleted= true;
                }
                
            }    
    }
    hitDetect(){
        this.detectHit = true;
        this.hitBoxId = hitDetectObjects.length
        hitDetectObjects.push(this);
    }
    makeClickable(){
        this.clickable = true;
        this.draggable = false;
        this.clickableId = clickableObjects.length
        clickableObjects.push(this);
        while(true) {
        const colorKey = getRandomColor();
        if (!clickableColorsHash[colorKey]) {
          this.colorKey = colorKey; 
          clickableColorsHash[colorKey] = this;
          return;
          }
        }
    }
    makeDraggable(){
        this.draggable = true;
        this.clickable = false;
        this.draggableId = draggableObjects.length;
        draggableObjects.push(this);
        while(true) {
            const colorKey = getRandomColor();
            if (!draggableColorsHash[colorKey]) {
              this.colorKey = colorKey; 
              draggableColorsHash[colorKey] = this;
              return;
              }
            }
    }
    control(speedX,speedY){
        this.xPos += speedX;
        this.yPos += speedY;
    }
    moveTo(newX,newY){
        this.xPos = newX;
        this.yPos = newY;
    }
    stop () {
        this.velX = 0;
        this.velY = 0;
    }
    jump(howMuch){
        this.jumpHeight = howMuch
        this.jumpFrames =0;
        this.jumping=true;
    }
    bindToCanvas(){
        this.bindable = true;
    }
    destroyOutsideCanvas(){
        this.deadOutsideCanvas = true;
    }
    updatePos(){
        allGameObjects[this.id] = this;
        if (this.bindable){
            if (this.xPos <= 0){
                this.velX = -(this.velX);
            }
            if (this.xPos >= width){
                this.velX = -(this.velX)
            }
            if (this.yPos <= 0){
                this.velY = -(this.velY)
            } 
            if (this.yPos >= height){
                this.velY = -(this.velY)
            }   
        }
        if (this.deadOutsideCanvas){
            if (this.xPos <= -this.width){
                this.destroy()
            }
            if (this.xPos >= width){
                this.destroy()
            }
            if (this.yPos <= -this.height){
                this.destroy()
            } 
            if (this.yPos >= height){
                this.destroy()
            }   
        }
        if (this.dragging === true){
            dragArray[0] = this
            if (draggingWithMouse){
                this.xPos = mouseX;
                this.yPos = mouseY;
            }
            else {
                this.xPos = touchMoveX;
                this.yPos = touchMoveY;
            }
            
        }
        else {
            
            this.xPos += this.velX;
            this.yPos += this.velY;
            if (this.detectHit){
                this.hitBoxX = this.xPos;
                this.hitBoxY = this.yPos;
                this.hitBoxWidth = this.width;
                this.hitBoxHeight = this.height;
                hitDetectObjects[this.hitBoxId] = this;
                }
            }
        }
    updateSize(howMuch){
        if (howMuch < 0){
            if (this.width>(howMuch*-1)){
                this.width *= howMuch;
            }
            if (this.height>(howMuch*-1)){
                this.height *= howMuch;
            }
        }
       else {
            this.width *= howMuch;   
            this.height *= howMuch;
            }
        }
    updateOpacity(howMuch){
        if (howMuch < 0){
            if (this.opacity>(howMuch*-1)){
                this.opacity += howMuch;
            }
        }
       else {this.opacity += howMuch}
    }
    updateColor(r,g,b,keepTrack){
        keepTrack = []
        keepTrack.push(r)
        keepTrack.push(g)
        keepTrack.push(b)
        keepTrack.forEach(element => {
         if (element < 0){
            element = 0}
        if (element > 255){element = 255}
         })

        this.color = `rgb(${r},${g},${b})`
        } 
    updateThickness(howMuch){
        if (howMuch < 0){
            if (this.thickness>(howMuch*-1)){
                this.thickness += howMuch;
            }
        }
       else {this.thickness += howMuch}
    }
    addOutline(color,thickness){
        this.outlineSwitch = true;
        this.outlineColor = color;
        this.outlineThickness = thickness;
        }
    destroy(){
        if (this.clickable){
        clickableObjects.splice(this.clickableId,1)
        }
        if (this.detectHit){
            hitDetectObjects.splice (this.hitBoxId,1) 
            for (let i=0;i<hitDetectObjects.length;i++){
                hitDetectObjects[i].hitBoxId= i;
            }
        }
        
        allGameObjects.splice(this.id,1)
    }

}

/////////////////Make a line

class Line{
    constructor(startX,startY,endX,endY,color,thickness){
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.color = color;
        this.velX = 0;
        this.velY = 0;
        this.thickness = thickness
        this.make()
    }
    make(){
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX, this.endY);
        ctx.lineWidth = this.thickness;
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }
    control(speedX,speedY){
        this.startX += speedX;
        this.endX += speedX;
        this.startY += speedY;
        this.endY += speedY;
    }
    updatePos(){
        if (this.startX <= 0){
            this.velX = -(this.velX);
        }
        if (this.endX <=0){
            this.velX = -(this.velX)
        }
        if (this.startX >= width){
            this.velX = -(this.velX)
        }
        if (this.endX >= width){
            this.velX = -(this.velX)
        }
        if (this.startY <= 0){
            this.velY = -(this.velY)
        } 
        if (this.endY <= 0){
            this.velY = -(this.velY)
        }
        if (this.startY >= height){
            this.velY = -(this.velY)
        }
        if (this.endY >= height){
            this.velY = -(this.velY)
        }
        this.startX += this.velX;
        this.endX += this.velX;
        this.startY += this.velY;
        this.endY += this.velY;
    }
}


////////////////////// triangles
class Triangle {
    constructor(startX,startY,secondX,secondY,thirdX,thirdY,color,thickness){
        this.startX = startX;
        this.startY = startY;
        this.secondX = secondX;
        this.secondY = secondY;
        this.thirdX = thirdX;
        this.thirdY = thirdY;
        this.velX = 0;
        this.velY = 0;
        this.color = color;
        this.thickness = thickness;
        this.make();
    }
    make(){
        if (typeof this.thickness === 'number'){
            ctx.beginPath();
            ctx.lineWidth = this.thickness
            ctx.strokeStyle = this.color
            ctx.moveTo(this.startX,this.startY);
            ctx.lineTo(this.secondX,this.secondY);
            ctx.lineTo(this.thirdX,this.thirdY);
            ctx.closePath();
            ctx.stroke()
            
        }
    else {
            ctx.beginPath();
            ctx.moveTo(this.startX,this.startY);
            ctx.lineTo(this.secondX,this.secondY);
            ctx.lineTo(this.thirdX,this.thirdY);
            ctx.closePath();
            ctx.fillStyle = this.color
            ctx.fill()
        }   
    }
    control(speedX,speedY){
        this.startX += speedX;
        this.secondX += speedX;
        this.thirdX += speedX;
        this.startY += speedY;
        this.secondY += speedY;
        this.thirdY += speedY;
    }
}


///// get a shape with any number of sides.                 x values          y values
/////   Syntax: const newComplexShape = new ComplexShape ([50,50,100,120],[200,300,350,300],color, thickness - nothing for filled)


class ComplexShape {
    constructor(xValueArray,yValueArray,color,thickness){
        this.xValueArray = xValueArray;
        this.yValueArray = yValueArray;
        this.color = color;
        this.thickness = thickness;
        this.make()
    }
    make(){
        if (typeof this.thickness === 'number'){
            console.log('not filled')
            ctx.beginPath();
            ctx.moveTo(this.xValueArray[0],this.yValueArray[0])
            for (let i = 1;i <= this.xValueArray.length;i++){
                ctx.lineTo(this.xValueArray[i],this.yValueArray[i])
            }
        ctx.closePath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.thickness
        ctx.stroke()
        }   

    else{
        console.log('filled')
        ctx.beginPath();
        ctx.moveTo(this.xValueArray[0],this.yValueArray[0])
        for (let i = 1;i <= this.xValueArray.length;i++){
            ctx.lineTo(this.xValueArray[i],this.yValueArray[i])
            }
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill()
        }
    }
}

class Ellipse {
    constructor (xPos,yPos,radiusX,radiusY,rotation,color,thickness){
        this.xPos = xPos;
        this.yPos = yPos;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.rotation = rotation;
        this.color = color;
        this.velX = 0;
        this.velY = 0;
        this.thickness = thickness;
        this.make()
    }
    control(speedX,speedY){
        this.xPos += speedX;
        this.yPos += speedY;
    }
    make(){
        if (typeof this.thickness === 'number'){
            ctx.strokeStyle = this.color
            ctx.lineWidth = this.thickness
            ctx.beginPath();
            ctx.ellipse(this.xPos,this.yPos,this.radiusX,this.radiusY,this.rotation,0,2*Math.PI);
            ctx.stroke()
        }
        else {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.ellipse(this.xPos,this.yPos,this.radiusX,this.radiusY,this.rotation,0,2*Math.PI);
            ctx.fill();
        }
    }
}

class Background {
    constructor(name,xPos,yPos,numberOfFrames,source,animationSpeed,width,height){
        this.name = name;
        this.xPos = xPos;
        this.yPos = yPos;  
        this.numberOfFrames = numberOfFrames;
        this.width = width;
        this.height = height;
        this.farXpos = this.xPos + this.width;
        this.negFarXPos = 0;
        this.velX = 0;
        this.velY = 0;
        this.source = source;
        this.scrolling = false;
        this.animationSpeed = animationSpeed + (60%animationSpeed/(Math.floor(60/animationSpeed)))
        this.refreshRate = 60/animationSpeed ;
        this.loopLength = 0;
        this.timeThroughLoop = 0;
        this.currentFrame = 0
        this.animations = [[0,0,0,0,0]]
        this.currentAnimation = 0;
        this.opacity = 1;
        this.jumping = false;
        this.jumpFrames = 0;
        this.jumpCompleted = false;
        this.jumpHeight =0
        this.id = 0;
        this.timeStamp = Date.now();
        this.triggeredOnce = false;
        this.theImage = document.createElement('img')
        this.load()
        
    }
    load(){
        objectsToLoad.push(this)
        
    }
    make(){
        ctx.globalAlpha = this.opacity 
        let heightOfFrame = this.theImage.height
        let widthOfFrame = this.theImage.width/this.numberOfFrames
        
        this.loopLength = this.refreshRate*this.animations[this.currentAnimation][2]


    if (this.timeThroughLoop === this.animationSpeed){
        this.currentFrame +=1;
        this.timeThroughLoop = 0;
        if (this.currentFrame >= this.animations[this.currentAnimation][2]/* **this is the number of frames in animation** */){
            this.currentFrame=0;
        }
        
    }
      if (!this.scrolling){
      ctx.drawImage(this.theImage, 
              (this.animations[this.currentAnimation][1]*widthOfFrame)+(this.currentFrame*widthOfFrame),
              0,
              widthOfFrame,
              heightOfFrame,
              this.xPos,
              this.yPos,
              this.width,
              this.height);
      }
        
        if (this.scrolling){
            
            if (this.width < (width/2)){
                this.farXpos = this.width*(Math.ceil(width/this.width)) + this.xPos
                this.negFarXPos = ((this.width*(Math.ceil(width/this.width)))*-1)+this.xPos 
                for (let i = 0;i < Math.ceil(width/this.width);i++){
                ctx.drawImage(this.theImage, 
                    (this.animations[this.currentAnimation][1]*widthOfFrame)+(this.currentFrame*widthOfFrame),
                    0,
                    widthOfFrame,
                    heightOfFrame,
                    this.xPos+(i*this.width),
                    this.yPos,
                    this.width,
                    this.height);    
                }
                if (this.xPos > 0){
                for (let i = 0;i < Math.ceil(width/this.width);i++){
                    ctx.drawImage(this.theImage, 
                        (this.animations[this.currentAnimation][1]*widthOfFrame)+(this.currentFrame*widthOfFrame),
                        0,
                        widthOfFrame,
                        heightOfFrame,
                        this.xPos-(i*this.width),
                        this.yPos,
                        this.width,
                        this.height);    
                    }
                }


                if (this.farXpos < width){
                    ctx.drawImage(this.theImage, 
                        (this.animations[this.currentAnimation][1]*widthOfFrame)+(this.currentFrame*widthOfFrame),
                        0,
                        widthOfFrame,
                        heightOfFrame,
                        this.farXpos,
                        this.yPos,
                        this.width,
                        this.height);
                        this.xPos = 0;
                }
              
                if (this.negFarXPos >= -this.width){
                    this.xPos = 0
                }
                
                
            }
            if (this.width>=(width/2)&&this.width<width){
                this.farXpos = this.xPos + this.width
                let leftOvers = ((this.width*2)-width)+this.width;
                ctx.drawImage(this.theImage, 
                    (this.animations[this.currentAnimation][1]*widthOfFrame)+(this.currentFrame*widthOfFrame),
                    0,
                    widthOfFrame,
                    heightOfFrame,
                    this.xPos,
                    this.yPos,
                    this.width+1,
                    this.height);
                ctx.drawImage(this.theImage, 
                    (this.animations[this.currentAnimation][1]*widthOfFrame)+(this.currentFrame*widthOfFrame),
                    0,
                    widthOfFrame,
                    heightOfFrame,
                    this.farXpos,
                    this.yPos,                        
                    this.width+1,
                    this.height);
                ctx.drawImage(this.theImage, 
                    (this.animations[this.currentAnimation][1]*widthOfFrame)+(this.currentFrame*widthOfFrame),
                    0,
                    widthOfFrame,
                    heightOfFrame,
                    this.width*2 + this.xPos,
                    this.yPos,                            
                    this.width+1,
                    this.height);
                ctx.drawImage(this.theImage, 
                    (this.animations[this.currentAnimation][1]*widthOfFrame)+(this.currentFrame*widthOfFrame),
                    0,
                    widthOfFrame,
                    heightOfFrame,
                    this.width*3 + this.xPos,
                    this.yPos,                            
                    this.width+1,
                    this.height);
                    
                    if (this.xPos <= (leftOvers*-1)){
                        this.xPos = ((this.width*2)-width)*-1
                    }

                            
                            
                            
                            if (this.xPos >= 0){ 
                            
                                ctx.drawImage(this.theImage, 
                                    (this.animations[this.currentAnimation][1]*widthOfFrame)+(this.currentFrame*widthOfFrame),
                                    0,
                                    widthOfFrame,
                                    heightOfFrame,
                                    this.xPos-this.width,
                                    this.yPos,
                                    this.width+1,
                                    this.height); 
                                    if (this.xPos >= this.width){  
                                        this.xPos = 0
                                        ctx.drawImage(this.theImage, 
                                            (this.animations[this.currentAnimation][1]*widthOfFrame)+(this.currentFrame*widthOfFrame),
                                            0,
                                            widthOfFrame,
                                            heightOfFrame,
                                            this.xPos,
                                            this.yPos,
                                            this.width+1,
                                            this.height)
                                        }    
                                }
                        
                        
            }

            if (this.width >= width){
               
            this.farXpos = this.xPos + this.width
            
            ctx.drawImage(this.theImage, 
                (this.animations[this.currentAnimation][1]*widthOfFrame)+(this.currentFrame*widthOfFrame),
                0,
                widthOfFrame,
                heightOfFrame,
                this.xPos,
                this.yPos,
                this.width,
                this.height);

                    if (this.farXpos <= width){ 
                        
                        ctx.drawImage(this.theImage, 
                            (this.animations[this.currentAnimation][1]*widthOfFrame)+(this.currentFrame*widthOfFrame),
                            0,
                            widthOfFrame,
                            heightOfFrame,
                            this.farXpos,
                            this.yPos,
                            this.width,
                            this.height); 
                            if (this.farXpos <= width - width){  
                                this.xPos = 0
                                }    
                        }
                        
                        if (this.xPos >= 0){ 
                        
                            ctx.drawImage(this.theImage, 
                                (this.animations[this.currentAnimation][1]*widthOfFrame)+(this.currentFrame*widthOfFrame),
                                0,
                                widthOfFrame,
                                heightOfFrame,
                                this.xPos-this.width,
                                this.yPos,
                                this.width,
                                this.height); 
                                if (this.xPos >= this.width){  
                                    this.xPos = 0
                                    ctx.drawImage(this.theImage, 
                                        (this.animations[this.currentAnimation][1]*widthOfFrame)+(this.currentFrame*widthOfFrame),
                                        0,
                                        widthOfFrame,
                                        heightOfFrame,
                                        this.xPos,
                                        this.yPos,
                                        this.width,
                                        this.height)
                                    }    
                            }
                    }
                }    
              
        ctx.globalAlpha = 1;
        if (this.jumping){
            this.jumpFrames += 1;
            if (this.jumpFrames>0 && this.jumpFrames <=5){
                this.yPos -= this.jumpHeight/10;
                }
                if (this.jumpFrames>5&&this.jumpFrames <= 11){
                    this.yPos -= this.jumpHeight/20
                }
                if(this.jumpFrames>11&&this.jumpFrames <= 15){
                    this.yPos-= this.jumpHeight/25
                }
                if(this.jumpFrames>15&&this.jumpFrames <= 17){
                    this.yPos-= this.jumpHeight/50
                }
                if(this.jumpFrames >17 &&this.jumpFrames <= 19){
                    this.yPos+= this.jumpHeight/50
                    
                }
                if(this.jumpFrames >19 && this.jumpFrames <= 23){
                    this.yPos += this.jumpHeight/25
                }
                if(this.jumpFrames>23&&this.jumpFrames <= 29){
                    this.yPos+= this.jumpHeight/20
                }
                if(this.jumpFrames>29&&this.jumpFrames <= 34){
                    this.yPos+= this.jumpHeight/10;
                    
                }
                if(this.jumpFrames>=35){
                    this.jumping=false;
                    this.jumpFrames = 0;
                    this.jumpCompleted= true;
                }
                
            }

            
        
        
        this.timeThroughLoop+=1;
    }
    makeScrollable(){
        this.scrolling = true;
    }
    addAnimation(name,startFrame,numberOfFrames){
        this.animations.push([name,startFrame,numberOfFrames])
        

    }
    changeAnimationTo(name){
        for (let i = 0;i < this.animations.length;i++){
            if (this.animations[i][0]===name){this.currentAnimation=i}
        }
    }

    control(speedX,speedY){
        this.xPos += speedX;
        this.yPos += speedY;
      
    }
    jump(howMuch){
        this.jumpHeight = howMuch
        this.jumpFrames =0;
        this.jumping=true;
    }
    moveTo(newX,newY){
        this.xPos = newX;
        this.yPos = newY;
    }
    stop () {
        this.velX = 0;
        this.velY = 0;
    }
    updatePos(){
        allBackgrounds[this.id] = this;
        this.xPos += this.velX;
        this.yPos += this.velY;       
    }
    autoSize(){
            let increaceToWidth = height/this.height
            this.height= height;
            this.width = (increaceToWidth*this.width);
            this.farXpos = this.xPos + width;
       
    }
    updateSize(howMuch){
        if (howMuch < 0){
            if (this.width>(howMuch*-1)){
                this.width *= howMuch;
                this.farXpos = this.xPos + this.width;
                this.newFarXpos = this.farXpos+this.width;
            }
            if (this.height>(howMuch*-1)){
                this.height *= howMuch;
            }
        }
       else {this.width *= howMuch
        this.height *= howMuch}
        this.farXpos = this.xPos + this.width;
        this.newFarXpos = this.farXpos+this.width;
    }
    updateOpacity(howMuch){
        if (howMuch < 0){
            if (this.opacity>(howMuch*-1)){
                this.opacity += howMuch;
            }
        }
       else {this.opacity += howMuch}
    }
    destroy(){

        allBackgrounds.splice(this.id,1)
    }
}


///***************************AUDIO************************************************* */
/// volume 0 - 1
/// playbackRate: 1 is normal speed. 2 is double normal speed.
/// loop: either true or false
class Sound {
    constructor(name,source,volume,playbackRate,loop){
        this.name=name;
        this.source = source;
        this.volume = volume;
        this.playbackRate= playbackRate
        this.loop = loop
        this.theSound = document.createElement('audio');
        this.nowPlaying = false;
        this.ended = this.theSound.ended
        this.newSound = 0
        this.finalize()
}
    finalize(){
        allAudioObjects.push(this)
        this.theSound.preload = 'auto';
        this.theSound.src = this.source;
        this.theSound.volume = this.volume;
        this.theSound.playbackRate = this.playbackRate;
        this.theSound.loop = this.loop
        

    }
    playAudio(){
        this.newSound = this.theSound.cloneNode()
        this.newSound.play()
        this.nowPlaying = true;
    }
    stopAudio(){
        if (this.nowPlaying){
            this.newSound.pause()
            this.newSound.currentTime=0;
            this.nowPlaying = false;
        }
       
    }
    pauseAudio(){
        if (this.nowPlaying){
            this.newSound.pause()
            this.nowPlaying = false;
        }
       
    }
    updateVolume(howMuch){
        this.theSound.volume += howMuch;
        this.newSound.volume += howMuch; 
    }
    updatePlaybackRate (howMuch){
        this.newSound.playbackRate += howMuch;
        this.theSound.playbackRate += howMuch;
    }

}


/////HANDY FUNCTIONS


function finalize(object){ 
       
    if (object instanceof Sprite){
        object.animations.shift()
    }
    if (object instanceof Background)
    {
    allBackgrounds.push(object);
    }
    else {
    allGameObjects.push(object); 
    }

}


//////// check if an object exists in the game yet. input using object name **** if (exists('objectName')){}

function exists(name,objectName){
    for (let i = 0; i < allGameObjects.length;i++){
        
        objectName = String(allGameObjects[i].name)
        if (objectName === name){
        return true;}
        
    }
}

function onScreen(object){
    if(object.xPos >= 0 && object.xPos <= width && object.yPos>= 0 && object.yPos <= height){
        object.onScreen = true;
        return true;
    }
    else {
        object.onScreen = false;
        return false;
    }
}



function waitThen(howLong,whenStop,name,whatToDo,howMuch1,howMuch2,howMuch3,objectName,theObject){ // leave objectName and theObject blank   
    for (let i = 0; i < allGameObjects.length;i++){
        objectName = String(allGameObjects[i].name)
        if (objectName === name){
            theObject = allGameObjects[i];
            if (Date.now() - theObject.timeStamp > (howLong*1000) && Date.now() - theObject.timeStamp < (howLong + whenStop)*1000){
                if (whatToDo === 'make'){   
                    theObject.make()
                }
                if (whatToDo === 'destroy'){
                    theObject.destroy()
                }
                if (whatToDo === 'makeDraggable'){
                    theObject.makeDraggable()
                }
                if (whatToDo === 'makeClickable'){
                    theObject.makeClickable()
                }
                if (whatToDo === 'hitDetect'){
                    theObject.hitDetect()
                }
                if (whatToDo === 'moveTo'){
                    theObject.moveTo(howMuch1,howMuch2)
                }
                if (whatToDo === 'stop'){
                    theObject.stop()
                }
                if (whatToDo === 'updateSize'){    
                    theObject.updateSize(howMuch1)                  
                }
                if (whatToDo === 'updateOpacity'){
                    theObject.updateOpacity(howMuch1)
                }
                if (whatToDo === 'updateColor'){
                    theObject.updateColor(howMuch1,howMuch2,howMuch3)
                }
                if (whatToDo === 'updateThickness'){
                    theObject.updateColor(howMuch1)
                }
                if (whatToDo === 'addOutline'){
                    theObject.addOutline(howMuch1,howMuch2)
                }
                if (whatToDo === 'finalize'){
                    theObject.finalize()
                }
            } 
        }
        
    }
}


function waitThenTriggerOnce(howLong,name,whatToDo,howMuch1,howMuch2,howMuch3,objectName,theObject){ // leave objectName and theObject blank   
    for (let i = 0; i < allGameObjects.length;i++){
        objectName = String(allGameObjects[i].name)
        if (objectName === name){
            theObject = allGameObjects[i];
            if ((Date.now() - theObject.timeStamp > (howLong*1000))&&theObject.triggeredOnce===false){
                
                if (whatToDo === 'make'){   
                    theObject.make()
                }
                if (whatToDo === 'destroy'){
                    theObject.destroy()
                }
                if (whatToDo === 'makeDraggable'){
                    theObject.makeDraggable()
                }
                if (whatToDo === 'makeClickable'){
                    theObject.makeClickable()
                }
                if (whatToDo === 'hitDetect'){
                    theObject.hitDetect()
                }
                if (whatToDo === 'moveTo'){
                    theObject.moveTo(howMuch1,howMuch2)
                }
                if (whatToDo === 'stop'){
                    theObject.stop()
                }
                if (whatToDo === 'updateSize'){    
                    theObject.updateSize(howMuch1)
                    theObject.timeStamp *= 10;
                    theObject.triggeredOnce= true;
                    
                            
                      
                }
                if (whatToDo === 'updateOpacity'){
                    theObject.updateOpacity(hotMuch1)
                }
                if (whatToDo === 'updateColor'){
                    theObject.updateColor(howMuch1,howMuch2,howMuch3)
                }
                if (whatToDo === 'updateThickness'){
                    theObject.updateColor(howMuch1)
                }
                if (whatToDo === 'addOutline'){
                    theObject.addOutline(howMuch1,howMuch2)
                }
                
            } 
        }
        
    }
}






