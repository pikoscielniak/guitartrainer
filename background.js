debugger
const STATES = {
    ENABLED: "ENABLED",
    DISABLED: "DISABLED",
};

var currentState = {
    state: STATES.ENABLED
};

const STATE_KEY = "GUITAR_TRAINER_STATE";

function setIcon(icon) {
    chrome.browserAction.setIcon({path: icon});
}

const iconMapper = {
    [STATES.ENABLED]: () => setIcon("icon_016.png"),
    [STATES.DISABLED]: () => setIcon("icon_016_off.png")
};

const stateChange = {
    [STATES.ENABLED]: () => currentState.state = STATES.DISABLED,
    [STATES.DISABLED]: () => currentState.state = STATES.ENABLED
};


function handleIcon() {
    iconMapper[currentState.state]();
    debugger;
}

function changeState() {
    stateChange[currentState.state]();
}

function toggleEnabled() {
    debugger;
    changeState();
    saveState();
    handleIcon();
}

function saveState() {
    var items = {};
    items[STATE_KEY] = currentState;
    chrome.storage.local.set(items);
}

function loadSavedState() {
    chrome.storage.local.get(STATE_KEY, function (items) {
        var savedState = items[STATE_KEY];
        if (savedState) {
            currentState = savedState;
        }
        handleIcon();
    });
}

chrome.browserAction.onClicked.addListener(toggleEnabled);

chrome.runtime.onStartup.addListener(()=> {
    debugger;
    loadSavedState();
});

chrome.runtime.onInstalled.addListener(()=> {
    loadSavedState();
});

