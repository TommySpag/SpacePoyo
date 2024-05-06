const resolutionX = 1000;
const resolutionY = 800;
const tileSizeX = 128;
const tileSizeY = 128;
const groundTiles = new PIXI.tilemap.CompositeRectTileLayer(0, PIXI.utils.TextureCache['imgs/tile.png']);
const platforms = [];
let playerTankSprite;
let isJumping = false;
const jumpHeight = 200;
const jumpSpeed = 5;
const playerOffsetX = 25;
const playerOffsetY = 730;
const minX = 5;
const maxX = 945;
const minY = 730;
const maxY = 0;
let score = 0;

const appID = "TODO";
let currentSession;
const deltaOffset = 5;
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

    createPlatform(100, 700, 200, 20, 0xFF0000); // Rouge
    createPlatform(400, 600, 150, 20, 0x00FF00); // Vert
    createPlatform(700, 500, 250, 20, 0x0000FF); // Bleu

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
    platform.drawRect(0, 0, width, height); // Définition du rectangle à (0, 0) car les coordonnées seront définies lors de l'ajout à la scène
    platform.endFill();
    platform.position.set(x, y); // Définition des coordonnées x et y
    app.stage.addChild(platform);
    platforms.push(platform);
    console.log("Plateforme créée : x = " + x + ", y = " + y + ", largeur = " + width + ", hauteur = " + height);
    
}

function jump() {
    if (!isJumping) {
        isJumping = true;
        console.log(jumpHeight);
        jumpAnimation();
    }
}



function jumpAnimation() {
    const jumpInterval = setInterval(() => {
        if (playerTankSprite.y <= playerOffsetY - jumpHeight) {
            clearInterval(jumpInterval);
            fallAnimation();
        } else {
            if (isOnPlatform()) { // Si le personnage est sur une plateforme
                playerTankSprite.y -= jumpSpeed + 200; // Sauter plus haut si le personnage est sur une plateforme
            } else {
                playerTankSprite.y -= jumpSpeed; // Sauter à la hauteur normale
                
            }
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
            break; // Sortir de la boucle une fois qu'une plateforme est trouvée
        }
    }
    return onPlatform;
}
function incrementScore() {
    score++;
    updateScoreDisplay();
}

function updateScoreDisplay() {
    const scoreElement = document.getElementById("score"); // Utilise l'ID "score"
    if (scoreElement) {
        scoreElement.textContent = "Score: " + score;
    }
}

function fallAnimation() {
    const fallInterval = setInterval(() => {
        let collisionIndex = checkPlatformCollision();
        if (collisionIndex !== -1) {
            clearInterval(fallInterval);
            playerTankSprite.y = platforms[collisionIndex].y - playerTankSprite.height;
            incrementScore(); // Incrémente le score lorsque le joueur se pose sur une plateforme
            isJumping = false;
        } else if (playerTankSprite.y < playerOffsetY) {
            playerTankSprite.y += jumpSpeed;
        } else {
            clearInterval(fallInterval);
            isJumping = false;
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
    if (playerTankSprite.x - deltaOffset >= minX) {
        playerTankSprite.x -= deltaOffset + 5;
    }
}

function moveRight() {
    if (playerTankSprite.x + deltaOffset + playerTankSprite.width <= maxX) {
        playerTankSprite.x += deltaOffset + 5;
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