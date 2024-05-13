const resolutionX = 1000;
const resolutionY = 800;
const tileSizeX = 128;
const tileSizeY = 128;
const groundTiles = new PIXI.tilemap.CompositeRectTileLayer(0, PIXI.utils.TextureCache['imgs/tile.png']);
const platforms = [];
let playerTankSprite;
let isJumping = false;
let jumpHeight = 225;
const jumpSpeed = 5;
const playerOffsetX = 25;
let playerOffsetY = 730;
const minX = 5;
const maxX = 945;
const minY = 730;
const maxY = 0;
let score = 0;

const appID = "TODO";
let currentSession;
let deltaOffset = 5;
const namespace1 = "urn:x-cast:testChannel";

const app = new PIXI.Application({ width: resolutionX, height: resolutionY, backgroundColor: 0x1099bb });
document.getElementById("pixie-container").appendChild(app.view);

PIXI.Assets.load(["imgs/tile.png", "imgs/poyoo.png"]).then(() => {
    app.stage.addChild(groundTiles);
    for (let i = 0; i <= parseInt(resolutionX / tileSizeX); i++) {
        for (let j = 0; j <= parseInt(resolutionX / tileSizeX); j++) {
            groundTiles.addFrame('imgs/tile.png', i * tileSizeX, j * tileSizeY);
        }
    }


    resetPlatforms();

    const tankTexture = PIXI.Texture.from('imgs/poyoo.png');
    playerTankSprite = new PIXI.Sprite(tankTexture);
    playerTankSprite.x = playerOffsetX;
    playerTankSprite.y = playerOffsetY;
    app.stage.addChild(playerTankSprite);
});


document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
    }
    switch (event.key) {
        case "ArrowLeft":
            moveLeft();
            break;
        case "ArrowRight":
            moveRight();
            break;
        case "ArrowUp":
            jump();
            break;
    }
});

function createPlatform(x, y, width, height, color) {
    const platform = new PIXI.Graphics();
    platform.beginFill(color);
    platform.drawRect(0, 0, width, height);
    platform.endFill();
    platform.position.set(x, y);
    app.stage.addChild(platform);
    platforms.push(platform);
    console.log("Plateforme créée : x = " + x + ", y = " + y + ", largeur = " + width + ", hauteur = " + height);
    
}

function createSingleRandomPlatform(y) {
    const platformColors = [0xFF0000, 0x00FF00, 0x0000FF]; 
    const platformWidth = 200;
    const platformHeight = 10;
    let x = Math.random() * (maxX - minX) + minX; 
    
  
    const color = platformColors[Math.floor(Math.random() * platformColors.length)]; 
    createPlatform(x, y, platformWidth, platformHeight, color);
}


function resetPlatforms() {
    platforms.forEach(platform => app.stage.removeChild(platform));
    platforms.length = 0; 
    createSingleRandomPlatform(700); 
}

function jump() {
    if (!isJumping) {
        isJumping = true;
        console.log(jumpHeight);
        console.log(playerOffsetY);
        jumpAnimation();
       
        
    }
}



function jumpAnimation() {
    const jumpInterval = setInterval(() => {
        let targetHeight = playerOffsetY - jumpHeight; 
        const collisionIndex = checkPlatformCollision(); 
        
        
        if (collisionIndex !== -1) {
        
            const platform = platforms[collisionIndex];
            targetHeight = platform.y - jumpHeight ; 
            console.log("Plateforme détectée. Hauteur de saut ajustée à la hauteur de la plateforme.");
            console.log("Hauteur de la plateforme:", platform.y);
            
            playerOffsetY = platform.y;
             
            app.stage.removeChild(platforms.shift());
        }
        
        console.log("Hauteur de saut cible:", targetHeight);

        if (playerTankSprite.y <= targetHeight) {
            clearInterval(jumpInterval);
            fallAnimation();
        } else {
            playerTankSprite.y -= jumpSpeed;
        }
    }, 20);
}



function isOnPlatform() {
    let onPlatform = false;
    for (let i = 0; i < platforms.length; i++) {
        let platform = platforms[i];
        if (
            playerTankSprite.x + playerTankSprite.width >= platform.x &&
            playerTankSprite.x <= platform.x + platform.width &&
            playerTankSprite.y + playerTankSprite.height >= platform.y &&
            playerTankSprite.y <= platform.y + platform.height + deltaOffset
        ) {
            onPlatform = true;
            console.log("Player is on platform.");
            break; 
        }
    }
    return onPlatform;
}
function incrementScore() {
    score++;
    updateScoreDisplay();
}

function updateScoreDisplay() {
    const scoreElement = document.getElementById("score"); 
    if (scoreElement) {
        scoreElement.textContent = "Score: " + score;
    }
}
function fallAnimation() {
    const fallInterval = setInterval(() => {
        let collisionIndex = checkPlatformCollision();
        
        if (collisionIndex !== -1) {
            
            clearInterval(fallInterval);
            const platform = platforms[collisionIndex];
            playerTankSprite.y = platform.y - playerTankSprite.height;
            incrementScore(); 
            isJumping = false;
            createSingleRandomPlatform(platform.y-100);
            ;
        } else {
            playerTankSprite.y += jumpSpeed;
            if (playerTankSprite.y >= minY) {
                clearInterval(fallInterval);
                playerTankSprite.y = minY;
                isJumping = false;
            }
        }
    }, 20);
}

function checkPlatformCollision() {
    for (let i = 0; i < platforms.length; i++) {
        let platform = platforms[i];
        if (
            playerTankSprite.x + playerTankSprite.width >= platform.x &&
            playerTankSprite.x <= platform.x + platform.width &&
            playerTankSprite.y + playerTankSprite.height >= platform.y &&
            playerTankSprite.y <= platform.y + platform.height + deltaOffset
        ) {
            return i;
        }
    }
    return -1;
}

function moveLeft() {
    if (isOnPlatform()) {
        let collisionIndex = checkPlatformCollision();
        let platform = platforms[collisionIndex];
        
        if (playerTankSprite.x - deltaOffset >= platform.x) {
            playerTankSprite.x -= deltaOffset;
        }
    } else {
        if (playerTankSprite.x - deltaOffset >= minX) {
            playerTankSprite.x -= deltaOffset;
        }
    }
}

function moveRight() {
    if (isOnPlatform()) {
        let collisionIndex = checkPlatformCollision();
        let platform = platforms[collisionIndex];
        if (playerTankSprite.x + playerTankSprite.width + deltaOffset <= platform.x + platform.width) {
            playerTankSprite.x += deltaOffset;
        }
    } else {
        
        if (playerTankSprite.x + deltaOffset + playerTankSprite.width <= maxX) {
            playerTankSprite.x += deltaOffset;
        }
    }
}


document.getElementById("connectBtn").addEventListener("click", () => {
    if (currentSession) {
        currentSession.leave(onCorrectLeave, onWrongLeave);
        document.getElementById("connectBtn").textContent = "Connect";
        document.getElementById("connectBtn").className = "btn btn-success connect col";
    }
    else {
        initializeApiOnly();
        document.getElementById("connectBtn").textContent = "Disconnect";
        document.getElementById("connectBtn").className = "btn btn-danger connect col";
    }
});
document.getElementById("jumpBtn").addEventListener("click", () => {
    jump();
});
document.getElementById("leftBtn").addEventListener("click", () => {
    left();
});
document.getElementById("rightBtn").addEventListener("click", () => {
    right();
});

function initializeApiOnly() {

    const sessionRequest = new chrome.cast.SessionRequest(appID);
    const apiConfig = new chrome.cast.ApiConfig(sessionRequest, sessionListener, receiverListener);
    chrome.cast.initialize(apiConfig, onInitSuccess, onError);
}

function onCorrectLeave() {
    console.log("Disconnected");
}

function onWrongLeave() {
    console.error("Chromecast disconnection error", error);
}

function sendCommand() {
    let message = { deltaPosition: deltaPosition, deltaOffset: deltaOffset }
    message = JSON.stringify(message);
    currentSession.sendMessage(namespace1, message);
}

function onInitSuccess() {
    console.log("Chromecast init success");
}

function onError() {
    console.error("Chromecast initialization error", error)
}

function receiverListener(availability) {
    if (availability === chrome.cast.ReceiverAvailability.AVAILABLE) {
        document.getElementById("connectBtn").style.display = "block";
    } else {
        document.getElementById("connectBtn").style.display = "none";
    }
}

function sessionListener(newSession) {
    currentSession = newSession
}