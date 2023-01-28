//DOMS
const playerScore = document.querySelector("#playerscore")
const cpuScore = document.querySelector("#cpuscore")
const leftPaddle = document.querySelector(".leftpaddle")
const rightPaddle = document.querySelector(".rightpaddle")
const ball = document.querySelector(".ball")
const pause = document.querySelector(".clickme")

//initial velocities/locations
let BALL_XVELOCITY = -.5
let BALL_YVELOCITY = -.5
let BALL_XACCELERATION = -.00005
let BALL_YACCELERATION = -.00005

let xLocation = getComputedStyle(ball).getPropertyValue("--ballx")
let yLocation = getComputedStyle(ball).getPropertyValue("--bally")

let victoryFlag = true

pauseGame()
document.addEventListener("mousemove", movePaddle)


function step(){
    ball.style.setProperty("--ballx", parseFloat(xLocation) + parseFloat(BALL_XVELOCITY) + parseFloat(BALL_XACCELERATION))
    ball.style.setProperty("--bally", parseFloat(yLocation) + parseFloat(BALL_YVELOCITY)  + parseFloat(BALL_YACCELERATION))
    
    xLocation = getComputedStyle(ball).getPropertyValue("--ballx")
    yLocation = getComputedStyle(ball).getPropertyValue("--bally")

    const pageRect = document.querySelector("html").getBoundingClientRect()
    const playerRect = leftPaddle.getBoundingClientRect()
    const cpuRect = rightPaddle.getBoundingClientRect()
    const ballRect = ball.getBoundingClientRect()

    if(ballRect.right > cpuRect.left && ballRect.y < cpuRect.bottom && ballRect.y > cpuRect.top){
        BALL_XVELOCITY *= -1
        BALL_XACCELERATION *= -1
        xLocation = 97
    }

    if(ballRect.left < playerRect.right && ballRect.y < playerRect.bottom && ballRect.y > playerRect.top){
        BALL_XVELOCITY *= -1
        BALL_XACCELERATION *= -1
        xLocation = 3
    }

    if(ballRect.right > pageRect.right) victory("player", ballRect)
    
    if(xLocation < pageRect.left ) victory("cpu", ballRect)

    if (ballRect.bottom < pageRect.top-5) {
        BALL_YVELOCITY *= -1
        BALL_YACCELERATION *= -1
        yLocation = 0
    }
    
    if (ballRect.top > pageRect.bottom+5){
        BALL_YVELOCITY *= -1
        BALL_YACCELERATION *= -1
        yLocation = 100
    } 
    

    if (BALL_XACCELERATION < 0) BALL_XACCELERATION -= .0001
    if (BALL_XACCELERATION > 0) BALL_XACCELERATION += .0001
    
    if (BALL_XACCELERATION < 0) BALL_YACCELERATION -= .0001
    if (BALL_XACCELERATION > 0) BALL_YACCELERATION += .0001

    aiPaddle()
    console.log(BALL_XACCELERATION)
}

let lastTime;
function update(time) {
    if (lastTime != null){
        
        const delta = lastTime - time 
        lastTime += time

        if (delta > 16 && victoryFlag == false) {
            step(delta)
            lastTime = time
        }
    } 
    if (lastTime == null) lastTime = time
    window.requestAnimationFrame(update)
}
window.requestAnimationFrame(update)

function movePaddle(e){
    if(e.screenY/10 < 0) return
    if(e.screenY/10 > 100) return
    leftPaddle.style.setProperty("--leftpaddle", + (e.screenY/10)-5)
}

function victory(winner){
    if (winner === "player"){playerScore.innerText++
    } else cpuScore.innerText++

    yLocation = 50
    xLocation = 50

    if (winner === "player") BALL_XACCELERATION = -.0005
    if (winner === "cpu") BALL_XACCELERATION = .0005
    BALL_XVELOCITY *= -1

    newHue()
    newAngle()
    pauseGame()

    victoryFlag = true

}

function newAngle(){
    let randomY;
    while (Math.abs(randomY) < .4 || randomY == null){
        randomY = rando(-.9,.9, "float")
    }
    BALL_YVELOCITY = randomY
}

function aiPaddle(){
    const yPaddle = getComputedStyle(rightPaddle).getPropertyValue("--rightpaddle") 
    const positionOffset = yPaddle - yLocation

    if (positionOffset > .5) rightPaddle.style.setProperty("--rightpaddle", parseFloat(parseFloat(yPaddle)-.5))
    if (positionOffset < -.5) rightPaddle.style.setProperty("--rightpaddle", parseFloat(parseFloat(yPaddle)+.5))
    if (positionOffset >= -.5 && positionOffset <= .5) rightPaddle.style.setProperty("--rightpaddle", parseFloat(yLocation))
}

const newHue = () =>{
    const randomHue = rando(0, 350)
    document.documentElement.style.setProperty('--hue', randomHue);
}


//COLLISSION WORKS
//TODO:
//NERF AI - DONE
//MORE ANGLE VARIATION THROUGHO?UT GAME

function pauseGame(){
    pause.classList.remove("hide")
    victoryFlag = true
    document.addEventListener("click", unPause)
}

function unPause(){
    pause.classList.add("hide")
    victoryFlag = false
}