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
            validateButtonStatus(currentUrl)
            load()
        }
    );
    
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
    return url.includes('poe.trade') || url.includes('pathofexile.com')
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
        input.value = ''
        load()
    })
}

function editItem(url) {
    // const newUrls = savedUrls.filter(el => el.url !== url)
    // chrome.storage.local.set({tests: newUrls}, function() {
    //     load()
    // })
}

function deleteItem(url) {
    const newUrls = savedUrls.filter(el => el.url !== url)
    chrome.storage.local.set({tests: newUrls}, function() {
        load()
    })
}

function generateItem(name, url, index, website) {
    let el = document.createElement('div')
    //el.innerHTML = name
    el.dataset.id = index
    el.dataset.url = url
    el.classList.add('link')
    

    let elLink = document.createElement('span')
    elLink.onclick= () => link(url)
    elLink.innerHTML = name
    elLink.classList.add('link-name')
    el.appendChild(elLink)

    let elBtnEdit = document.createElement('span')
    elBtnEdit.classList.add('btn-edit')
    elBtnEdit.onclick= () => editItem(url)
    elBtnEdit.innerHTML = 'E'
    el.appendChild(elBtnEdit)

    let elBtnDelete = document.createElement('span')
    elBtnDelete.classList.add('btn-delete')
    elBtnDelete.onclick= () => deleteItem(url)
    elBtnDelete.innerHTML = 'X'
    el.appendChild(elBtnDelete)
    

    return el
}

function render() {
    savedUrls.forEach((link, index) => {
        let el = generateItem(link.name, link.url, index, 'web')
        wrapper.appendChild(el)
    })
}

init()