const appID = "C69A6C46";
let currentSession;
const namespace1 = "urn:x-cast:SpacePoyo";

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
    sendCommand("jump");
});
document.getElementById("leftBtn").addEventListener("click", () => {
    sendCommand("jump");
});
document.getElementById("rightBtn").addEventListener("click", () => {
    sendCommand("jump");
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

function sendCommand(movement) {
    let message = { movement: movement}
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

function load() {
    const mediaInfo = new chrome.cast.media.MediaInfo('https://transfertco.ca/SpacePoyo_Jeu/SpacePoyo/jeu.html', 'video/mp4');
    const request = new chrome.cast.media.LoadRequest(mediaInfo);
    currentSession.loadMedia(request);
}

function startSession() {
    if(currentSession){
        load();
    }
}

function sessionListener(newSession) {
    currentSession = newSession;
    startSession();
}