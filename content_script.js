const video = document.getElementsByTagName('video')[0];
const normalPlaybackRate = 1;
const videoStart = 0;
debugger;
const speedTick = 0.05;
const abTick = 0.2;

var currentState = {
    aValue: 0,
    bValue: Number.MAX_SAFE_INTEGER,
    playbackRate: normalPlaybackRate
};

function setA() {
    currentState.aValue = video.currentTime;
}

function setB() {
    currentState.bValue = video.currentTime;
}

function setAMinus() {
    currentState.aValue -= abTick;
}

function setAPlus() {
    currentState.aValue += abTick;
}

function setBMinus() {
    currentState.bValue -= abTick;
}

function setBPlus() {
    currentState.bValue += abTick;
}

function speedDown() {
    video.playbackRate -= speedTick;
    setCurrentPlaybackRate();
}

function speedUp() {
    video.playbackRate += speedTick;
    setCurrentPlaybackRate();
}

function resetAB() {
    currentState.aValue = videoStart;
    currentState.bValue = video.duration;
}

function resetSpeed() {
    video.playbackRate = normalPlaybackRate;
    setCurrentPlaybackRate();
}

function setCurrentPlaybackRate() {
    currentState.playbackRate = video.playbackRate;
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
        var key = e.key;
        var action = keyActions[key];
        if (action) {
            keyActions[key]();
            chrome.runtime.sendMessage(currentState);
        }
    });
}

function addTimeUpdateEvent() {
    debugger;
    video.addEventListener('timeupdate',
        () => {
            if (video.currentTime > currentState.bValue) {
                video.currentTime = currentState.aValue;
            }
        });
}
function init() {
    addKeyEventListener();
    addTimeUpdateEvent();
}

init();