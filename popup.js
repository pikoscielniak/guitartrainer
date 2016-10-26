function getCurrentTabUrl() {

    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function (tabs) {
        var tab = tabs[0];

    });
}

function renderStatus(statusText) {
    document.getElementById('status').textContent = statusText;
}


document.addEventListener('DOMContentLoaded', function () {

    getCurrentTabUrl(function (url) {
        // Put the image URL in Google search.
        renderStatus('Performing Google Image search for ' + url);

        getImageUrl(url, function (imageUrl, width, height) {

            renderStatus('Search term: ' + url + '\n' +
                'Google image search result: ' + imageUrl);
            var imageResult = document.getElementById('image-result');
            // Explicitly set the width/height to minimize the number of reflows. For
            // a single image, this does not matter, but if you're going to embed
            // multiple external images in your page, then the absence of width/height
            // attributes causes the popup to resize multiple times.
            imageResult.width = width;
            imageResult.height = height;
            imageResult.src = imageUrl;
            imageResult.hidden = false;

        }, function (errorMessage) {
            renderStatus('Cannot display image. ' + errorMessage);
        });
    });
});
