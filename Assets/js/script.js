//DOMS
const playerScore = document.querySelector("#playerscore")
const cpuScore = document.querySelector("#cpuscore")
const leftPaddle = document.querySelector(".leftpaddle")
const rightPaddle = document.querySelector(".rightpaddle")
const ball = document.querySelector(".ball")

document.addEventListener("mousemove", movePaddle)

//initial velocities/locations
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
    console.log(yLocation)

    //LAZY AI (/6 seems to work. not sure what the math on that really is tho)
    rightPaddle.style.setProperty("--rightpaddle", yLocation)
}

let lastTime;
function update(time) {
    if (lastTime != null){
        
        const delta = lastTime - time 
        lastTime += time

        if (delta > 60) {
            step(delta)
            lastTime = time
        }
    } 
    if (lastTime == null) lastTime = time
    window.requestAnimationFrame(update)
}
window.requestAnimationFrame(update)

function movePaddle(e){
    if(e.clientY/6 > 100) return
    leftPaddle.style.setProperty("--leftpaddle", + (e.clientY/6))
}

function victory(winner){
    if (winner === "player"){playerScore.innerText++
    } else cpuScore.innerText++
    yLocation = 50
    xLocation = 50
    BALL_XACCELERATION = .000001
    BALL_XVELOCITY *= -1
    newAngle()
}

function newAngle(){
    let randomY;
    while (Math.abs(randomY) < .1 || randomY == null){
    randomY = rando(-.5,.5, "float")
    console.log(randomY)
 }
    BALL_YVELOCITY = randomY
}



//COLLISSION WORKS
//TODO: RANDOM START ANGLES EACH ROUND -- DONE
//SOMEHOW RESET THE SPEED EACH ROUND (FIGURE OUT WEIRD DELTA RAMPING ISSUE) -- DONE, ITS STEADY NOW
//AI SOMEHOW 
//SCALE BOTTOM/RIGHT VIEWPORT BOUNDS -- WORKS NOW