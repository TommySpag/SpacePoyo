const resolutionX = 1000;
const resolutionY = 800;
var tileSizeX = 128;
var tileSizeY = 128;
var groundTiles;
var playerTankSprite;
var minX = 5;
var maxX = 945;
var minY = 730;
var maxY = 0;
var playerOffsetX = (resolutionX / 2 - 24);
var playerOffsetY = 730;
var isJumping = false;
var jumpHeight = 200; // Hauteur du saut
var jumpSpeed = 5; // Vitesse de saut
var platforms = [];



const appID = "TODO"
var currentSession;
var deltaPosition;
const deltaOffset = 5;
var deltaRotation = 0;
const namespace1 = "urn:x-cast:testChannel";

const app = new PIXI.Application({ width: resolutionX, height: resolutionY, backgroundColor: 0x1099bb });

document.getElementById("pixie-container").appendChild(app.view);
const texturePromise = PIXI.Assets.load("imgs/tile.png");

texturePromise.then((texturePromise) => {

    

    var groundTiles = new PIXI.tilemap.CompositeRectTileLayer(0, PIXI.utils.TextureCache['imgs/tile.png']);
    app.stage.addChild(groundTiles);


    for (var i = 0; i <= parseInt(resolutionX / tileSizeX); i++) {
        for (var j = 0; j <= parseInt(resolutionX / tileSizeX); j++) {
            groundTiles.addFrame('imgs/tile.png', i * tileSizeX, j * tileSizeY);
        }
    }
    const tanksPromise = PIXI.Assets.load("imgs/poyoo.png");

    tanksPromise.then((tanksPromiseReceived) => {
        var tankTexture = new PIXI.Texture(
            PIXI.utils.TextureCache['imgs/poyoo.png'],

        );
        playerTankSprite = new PIXI.Sprite(tankTexture);
        playerTankSprite.x = playerOffsetX;
        playerTankSprite.y = playerOffsetY;
        app.stage.addChild(playerTankSprite);

        createPlatform(100, 700, 200, 20, 0xFF0000); // Rouge
        createPlatform(400, 600, 150, 20, 0x00FF00); // Vert
        createPlatform(700, 500, 250, 20, 0x0000FF); // Bleu
    })

    function createPlatform(x, y, width, height, color) {
        var platform = new PIXI.Graphics();
        platform.beginFill(color);
        platform.drawRect(x, y, width, height);
        platform.endFill();
        app.stage.addChild(platform);
        platforms.push(platform)
    }
    

  
    
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
    
    
    
    function jump() {
        
        if (!isJumping && playerTankSprite.y === playerOffsetY) {
            isJumping = true;
            jumpAnimation();
        }
    }
    
    function jumpAnimation() {
        var jumpInterval;
        var initialY = playerTankSprite.y;
        var maxHeight = initialY - jumpHeight;
    
        jumpInterval = setInterval(function() {
            
            if (playerTankSprite.y <= maxHeight) {
                clearInterval(jumpInterval);
                fallAnimation();
                return;
            }
    
            playerTankSprite.y -= jumpSpeed;
    
            if (moveLeftKeyPressed) {
                moveLeft();
            } else if (moveRightKeyPressed) {
                moveRight();
            }
        }, 20);
    }
    function fallAnimation() {
        var iterations = jumpHeight / jumpSpeed;
    
    
        var fallInterval = setInterval(function() {
          
            playerTankSprite.y += jumpSpeed;
            iterations--;
    
            
            if (iterations <= 0 && playerTankSprite.y >= playerOffsetY) {
                clearInterval(fallInterval);
                playerTankSprite.y = playerOffsetY;
                isJumping = false; 
            }
        }, 20);
    }
    
    
    function moveLeft() {
        
        if (playerTankSprite.x - deltaOffset >= minX) {
            playerTankSprite.x -= deltaOffset + 5;
            sendCommand(); 
        }
    }
    
    
    function moveRight() {
        
        if (playerTankSprite.x + deltaOffset <= maxX) {
            playerTankSprite.x += deltaOffset + 5;
            sendCommand(); 
        }
    }

})


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


function left() {

}

function right() {

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