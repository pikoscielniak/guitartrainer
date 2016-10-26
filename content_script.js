debugger;
console.log(document);
const video = document.getElementsByTagName('video');
const normalPlaybackRate = 1;
const videoStart = 0;
const videoDuration = video.duration;

const speedTick = 0.05;
const abTick = 0.2;

var aValue = 0;
var bValue = videoDuration;

function setA() {
    aValue = video.currentTime;
}

function setB() {
    bValue = video.currentTime;
}


function setAMinus() {
    aValue -= abTick;
}


function setAPlus() {
    aValue += abTick;
}

function setBMinus() {
    bValue -= abTick;
}


function setBPlus() {
    bValue += abTick;
}

function speedDown() {
    video.playbackRate -= speedTick;
}

function speedUp() {
    video.playbackRate += speedTick;
}

function resetAB() {
    aValue = videoStart;
    bValue = videoDuration;
}

function resetSpeed() {
    video.playbackRate = normalPlaybackRate;
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
        console.log(e);
        var key = e.key;
        var action = keyActions[key];
        if (action) {
            keyActions[key]();
        }
    });
}

function init() {
    addKeyEventListener();
}

init();