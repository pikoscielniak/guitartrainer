const video = document.getElementsByTagName('video')[0];
const normalPlaybackRate = 1;
const videoStart = 0;
const speedTick = 0.05;
const abTick = 0.1;
const ENABLED_STATE = "ENABLED";
const STATE_KEY = "GUITAR_TRAINER_STATE";
const elemId = STATE_KEY + "_id";

var guiElement;

var currentState = {
    aValue: 0,
    bValue: video.duration,
    state: ENABLED_STATE
};

function isDisabled() {
    return currentState.state != ENABLED_STATE;
}

function setA() {
    currentState.aValue = video.currentTime;
}

function setB() {
    currentState.bValue = video.currentTime;
}

function setAMinus() {
    changeA(-abTick);
}

function setAPlus() {
    changeA(abTick);
}

function setBMinus() {
    changeB(-abTick);
}

function setBPlus() {
    changeB(abTick);
}

function speedDown() {
    setCurrentPlaybackRate(-speedTick);
}

function speedUp() {
    setCurrentPlaybackRate(speedTick);
}

function resetAB() {
    currentState.aValue = videoStart;
    currentState.bValue = video.duration;
}

function resetSpeed() {
    video.playbackRate = normalPlaybackRate;
    setCurrentPlaybackRate(normalPlaybackRate);
}

function setCurrentPlaybackRate(val) {
    video.playbackRate += val;
    roundPlaybackRate();
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function createGuiElement() {
    guiElement = document.createElement('div');
    guiElement.setAttribute("id", elemId);
    video.parentNode.insertBefore(guiElement, video);
}

function hideGuiElement() {
    guiElement.style.display = 'none';
}

function showGuiElement() {
    guiElement.style.display = 'block';
}

function updateGui() {
    if (isDisabled()) {
        hideGuiElement();
        return;
    }

    showGuiElement();
    var valA = roundTo2Places(currentState.aValue);
    var valB = roundTo2Places(currentState.bValue);
    if (isNaN(valB)) {
        valB = "\u221E";
    }
    var html = (`A: ${valA} B: ${valB} Speed: ${video.playbackRate}`);
    guiElement.innerHTML = html;
}

var keyActions = {
    "q": setA,
    "a": setB,
    "w": setAMinus,
    "e": setAPlus,
    "s": setBMinus,
    "d": setBPlus,
    "r": resetAB,
    "z": speedDown,
    "x": speedUp,
    "c": resetSpeed
};

function addKeyEventListener() {
    document.addEventListener("keydown", e => {
        if (isDisabled()) return;
        var key = e.key;
        var action = keyActions[key];
        if (action) {
            keyActions[key]();
            chrome.runtime.sendMessage(currentState);
        }
        updateGui();
    });
}

function timeUpdateLister() {
    if (video.currentTime > currentState.bValue) {
        video.currentTime = currentState.aValue;
    }
}

function addTimeUpdateListener() {
    video.addEventListener('timeupdate', timeUpdateLister);
}


function removeTimeUpdateListener() {
    video.removeEventListener('timeupdate', timeUpdateLister);
}

function handleStateChange(state) {
    if (currentState.state != state && state == ENABLED_STATE) {
        addTimeUpdateListener();
    } else {
        removeTimeUpdateListener();
    }
    currentState.state = state;
    updateGui();
}

function setMessageListener() {
    chrome.runtime.onMessage.addListener(
        (request)=> {
            if (request.state) {
                handleStateChange(request.state);
            }
        });
}
function loadSavedState() {
    chrome.storage.local.get(STATE_KEY, function (items) {
        var savedState = items[STATE_KEY];
        if (!savedState || savedState.state == ENABLED_STATE) {
            addTimeUpdateListener();
        }
        currentState.state = savedState.state;
        updateGui();
    });
}
function round(num, places) {
    var multiplier = Math.pow(10, places);
    return Math.round(num * multiplier) / multiplier;
}
function roundTo2Places(num) {
    return round(num, 2);
}
function roundPlaybackRate() {
    video.playbackRate = roundTo2Places(video.playbackRate);
}

function changeA(val) {
    var newValue = roundTo2Places(currentState.aValue + val);
    if (newValue < 0) {
        newValue = 0;
    }
    if (newValue >= currentState.bValue) return;
    currentState.aValue = newValue;
}


function changeB(val) {
    var newValue = roundTo2Places(currentState.bValue + val);
    if (newValue > video.duration) {
        newValue = video.duration;
    }
    if (newValue <= currentState.aValue) return;
    currentState.bValue = newValue;
}

function init() {
    addKeyEventListener();
    setMessageListener();
    loadSavedState();
    createGuiElement();
}

init();