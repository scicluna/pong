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

let pauseFlag = true
pauseGame()

//handles ball movement and collissions 
function step(){
    //updating ball location
    ball.style.setProperty("--ballx", parseFloat(xLocation) + parseFloat(BALL_XVELOCITY) + parseFloat(BALL_XACCELERATION))
    ball.style.setProperty("--bally", parseFloat(yLocation) + parseFloat(BALL_YVELOCITY)  + parseFloat(BALL_YACCELERATION))
    xLocation = getComputedStyle(ball).getPropertyValue("--ballx")
    yLocation = getComputedStyle(ball).getPropertyValue("--bally")

    //updating rectangles
    const pageRect = document.querySelector("html").getBoundingClientRect()
    const playerRect = leftPaddle.getBoundingClientRect()
    const cpuRect = rightPaddle.getBoundingClientRect()
    const ballRect = ball.getBoundingClientRect()

    //paddle collissions
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

    //detecting a point scored
    if(ballRect.right > pageRect.right) victory("player", ballRect)
    if(xLocation < pageRect.left ) victory("cpu", ballRect)

    //top and bottom collissions
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
    
    //handles acceleration
    if (BALL_XACCELERATION < 0) BALL_XACCELERATION -= .0002
    if (BALL_XACCELERATION > 0) BALL_XACCELERATION += .0002
    if (BALL_YACCELERATION < 0) BALL_YACCELERATION -= .0002
    if (BALL_YACCELERATION > 0) BALL_YACCELERATION += .0002

    console.log(BALL_YACCELERATION)
 
    aiPaddle()
}

//handling main game loop controlling for 60 fps
let lastTime;
function update(time) {
    if (lastTime != null){
        
        const delta = lastTime - time 
        lastTime += time

        if (delta > 16 && pauseFlag == false) {
            step(delta)
            lastTime = time
        }
    } 
    if (lastTime == null) lastTime = time
    window.requestAnimationFrame(update)
}
window.requestAnimationFrame(update)

//handling mousemovement/paddle movement
const movePaddle = (e) => leftPaddle.style.setProperty("--leftpaddle", `${e.clientY}px`)
document.addEventListener("mousemove", movePaddle)

//handling the victory cases
function victory(winner){
    if (winner === "player"){playerScore.innerText++
    } else cpuScore.innerText++

    yLocation = 50
    xLocation = 50

    if (winner === "player"){
        BALL_XACCELERATION = -.0005
        BALL_YACCELERATION = -.0005
    } 
    if (winner === "cpu") {
        BALL_XACCELERATION = .0005
        BALL_YACCELERATION = .0005
    }
    BALL_XVELOCITY *= -1

    newHue()
    newAngle()
    pauseGame()
}

//generates a new angle for each round
function newAngle(){
    let randomY;
    while (Math.abs(randomY) < .6 || randomY == null){
        randomY = rando(-.8,.8, "float")
    }
    console.log(randomY)
    BALL_YVELOCITY = randomY
}

//handle simple AI
function aiPaddle(){
    const yPaddle = getComputedStyle(rightPaddle).getPropertyValue("--rightpaddle") 
    const positionOffset = yPaddle - yLocation

    if (positionOffset > .5) rightPaddle.style.setProperty("--rightpaddle", parseFloat(parseFloat(yPaddle)-.6))
    if (positionOffset < -.5) rightPaddle.style.setProperty("--rightpaddle", parseFloat(parseFloat(yPaddle)+.6))
    if (positionOffset >= -.5 && positionOffset <= .5) rightPaddle.style.setProperty("--rightpaddle", parseFloat(yLocation))
}

//changes the color theme between rounds
const newHue = () =>{
    const randomHue = rando(0, 350)
    document.documentElement.style.setProperty('--hue', randomHue);
}

//handles paused games
function pauseGame(){
    pause.classList.remove("hide")
    pauseFlag = true
    document.addEventListener("click", unPause)
}

//handles unpausing the game
function unPause(){
    pause.classList.add("hide")
    pauseFlag = false
}
