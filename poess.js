let savedUrls = []
const wrapper = document.getElementById('links-wrapper')
const input = document.getElementById('nameInput')
const addButton = document.getElementById('addButton')
let currentUrl = ''

function init() {
    chrome.tabs.query(
        { 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT },
        function (tabs) { 
            currentUrl = tabs[0].url
        }
    );
    validateButtonStatus(currentUrl)
    load()
}

function load() {
    chrome.storage.local.get(['tests'], function(result) {
        savedUrls = result.tests || []
        wrapper.innerHTML = ''

        render()
    });
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    currentUrl = tab.url
    validateButtonStatus(currentUrl)
 });

addButton.addEventListener('click', function() {

    if(isUrlValid(currentUrl)) {
        storeItem({
            url: currentUrl,
            name: input.value
        })
    } else {
        console.log('Invalid website')
    }
})

function isUrlValid(url) {
    return url.includes('https://poe.trade/') || url.includes('pathofexile.com')
}

function validateButtonStatus(url) {
    if (isUrlValid(url)) {
        addButton.disabled = false
    } else {
        addButton.disabled = true
    }
}

function link(url) {
    chrome.tabs.create({ url: url });
    
}

function storeItem({url, name}) {
    chrome.storage.local.set({tests: [...savedUrls, {url, name}]}, function() {
        load()
    })
}

function generateItem(name, url, index, website) {
    let el = document.createElement('a')
    el.innerHTML = name
    el.dataset.id = index
    el.dataset.url = url
    el.classList.add('link')
    el.onclick= () => link(url)


    return el
}

function render() {
    savedUrls.forEach((link, index) => {
        let el = generateItem(link.name, link.url, index, 'web')
        wrapper.appendChild(el)
    })
}

init()