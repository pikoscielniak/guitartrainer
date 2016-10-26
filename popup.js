function renderStatus(statusText) {
    document.getElementById('status').textContent = statusText;
}


function isForMe(request) {
    return typeof request.aValue != "undefined"
        && typeof request.bValue != "undefined"
        && typeof request.playbackRate != "undefined";
}

document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.onMessage.addListener(
        function (request) {
            if (isForMe(request)) {
                console.log(request)
                renderStatus(`A: ${request.aValue} B: ${request.bValue} Speed: ${request.playbackRate}`)
            }
        });
});
