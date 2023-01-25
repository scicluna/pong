//DOMS
const playerScore = document.querySelector("#playerscore")
const cpuScore = document.querySelector("#cpuscore")
const leftPaddle = document.querySelector(".leftpaddle")
const rightPaddle = document.querySelector(".rightpaddle")
const ball = document.querySelector(".ball")

document.addEventListener("mousemove", movePaddle)

let BALL_XVELOCITY = -.5
let BALL_YVELOCITY = -.5
let BALL_XACCELERATION = -.000001
let xLocation = getComputedStyle(ball).getPropertyValue("--ballx")
let yLocation = getComputedStyle(ball).getPropertyValue("--bally")

function step(){
    ball.style.setProperty("--ballx", parseFloat(xLocation) + parseFloat(BALL_XVELOCITY) + parseFloat(BALL_XACCELERATION))
    ball.style.setProperty("--bally", parseFloat(yLocation) + parseFloat(BALL_YVELOCITY))

    xLocation = getComputedStyle(ball).getPropertyValue("--ballx")
    yLocation = getComputedStyle(ball).getPropertyValue("--bally")

    const pageRect = document.querySelector("html").getBoundingClientRect()
    const playerRect = leftPaddle.getBoundingClientRect()
    const cpuRect = rightPaddle.getBoundingClientRect()
    const ballRect = ball.getBoundingClientRect()

    if(ballRect.right > cpuRect.left && ballRect.right < cpuRect.right && ballRect.y < cpuRect.bottom && ballRect.y > cpuRect.top){
        BALL_XVELOCITY *= -1
        BALL_XACCELERATION *= -1
    }

    if(ballRect.x > playerRect.left && ballRect.x < playerRect.right && ballRect.y < playerRect.bottom && ballRect.y > playerRect.top){
        BALL_XVELOCITY *= -1
        BALL_XACCELERATION *= -1
    }

    if(ballRect.right > pageRect.right) victory("player", ballRect)
    
    if(xLocation < pageRect.left ) victory("cpu", ballRect)

    if (ballRect.top < pageRect.top) BALL_YVELOCITY *= -1
    
    if (ballRect.bottom > pageRect.bottom) BALL_YVELOCITY *= -1
    
    BALL_XACCELERATION *= 1.001

    //LAZY AI
    rightPaddle.style.setProperty("--rightpaddle", ballRect.top/6)
}


//
//||   o    ||

let lastTime;
function update(time) {
    if (lastTime != null){
        
        const delta = lastTime - time 
        lastTime += time

        if (delta > 30) {
            step(delta)
            lastTime = time
        }
    } 
    if (lastTime == null) lastTime = time
    window.requestAnimationFrame(update)
}
window.requestAnimationFrame(update)

function movePaddle(e){
    if(e.clientY/5 > 100) return
    leftPaddle.style.setProperty("--leftpaddle", + (e.clientY/5))
}

function victory(winner){
    if (winner === "player"){playerScore.innerText++
    } else cpuScore.innerText++
    yLocation = 40
    xLocation = 50
    BALL_XACCELERATION = .000001
    BALL_XVELOCITY *= -1
    newAngle()
}

function newAngle(){
    let randomY;
    while (randomY > Math.abs(.01) || randomY == null){
    randomY = rando(-.5,.5, "float")
 }
    BALL_YVELOCITY = randomY
    console.log(BALL_YVELOCITY)
}



//COLLISSION WORKS
//TODO: RANDOM START ANGLES EACH ROUND -- DONE
//SOMEHOW RESET THE SPEED EACH ROUND (FIGURE OUT WEIRD DELTA RAMPING ISSUE) -- DONE, ITS STEADY NOW
//AI SOMEHOW 
//SCALE BOTTOM/RIGHT VIEWPORT BOUNDS -- WORKS NOW