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
    var groundTiles = new PIXI.tilemap.CompositeRectTileLayer(0, PIXI.utils.TextureCache['imgs/imgGround.png']);
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
    })

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

function jump() {

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