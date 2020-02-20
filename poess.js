let savedUrls = []
const wrapper = document.getElementById('links-wrapper')

function load() {
    chrome.storage.local.get(['tests'], function(result) {
        savedUrls = result.tests || []
        wrapper.innerHTML = ''

        savedUrls.forEach((link, index) => {
            let el = document.createElement('a')
            el.innerHTML = link
            el.dataset.id = index
            el.setAttribute('href', link)

            wrapper.appendChild(el)
        })
    });
}

document.getElementById('btn').addEventListener('click', function() {
    
    chrome.tabs.query(
        { 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT },
        function (tabs) { 
            const currentUrl = tabs[0].url
            addUrl(currentUrl)
        }
    );

    
})

function addUrl(url) {
    chrome.storage.local.set({tests: [...savedUrls, url]}, function() {
        load()
    })
}

load()