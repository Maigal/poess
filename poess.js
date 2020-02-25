let savedUrls = []
const wrapper = document.getElementById('links-wrapper')
const input = document.getElementById('nameInput')
const addButton = document.getElementById('addButton')
const notification = document.getElementById('notification')
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
    if (!savedUrls.find(el => el.url === url)) {
        chrome.storage.local.set({tests: [...savedUrls, {url, name}]}, function() {
            input.value = ''
            load()
        })
    } else {
        throwNotification('Link already exists')
    }
    
}

function activateItem(url, name) {
    const textEl = document.getElementById(`text-${url}`)
    const inputEl = document.getElementById(`input-${url}`)

    textEl.style.display = 'none'
    inputEl.style.display = 'flex'
    inputEl.value = name;
}

function editItem(val, url) {

    const textEl = document.getElementById(`text-${url}`)
    const inputEl = document.getElementById(`input-${url}`)

    textEl.style.display = 'flex'
    inputEl.style.display = 'none'
    inputEl.value = '';

    const newUrls = savedUrls.map(el => {
        if (el.url === url) {
            return {
                ...el,
                name: val
            }
        }
        return el
    })
    chrome.storage.local.set({tests: newUrls}, function() {
        load()
    })
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
    elLink.id = `text-${url}`
    elLink.classList.add('link-name')
    el.appendChild(elLink)

    let elLinkEdit = document.createElement('input')
    elLinkEdit.setAttribute('type', 'text')
    elLinkEdit.classList.add('link-input')
    elLinkEdit.id = `input-${url}`
    elLinkEdit.onblur= (e) => editItem(e.target.value, url)
    el.appendChild(elLinkEdit)

    let elBtnEdit = document.createElement('span')
    elBtnEdit.classList.add('btn-edit')
    elBtnEdit.onclick= () => activateItem(url, name)
    elBtnEdit.innerHTML = 'E'
    el.appendChild(elBtnEdit)

    let elBtnDelete = document.createElement('span')
    elBtnDelete.classList.add('btn-delete')
    elBtnDelete.onclick= () => deleteItem(url)
    elBtnDelete.innerHTML = 'X'
    el.appendChild(elBtnDelete)
    

    return el
}

function throwNotification(msg) {
    notification.classList.add('active')
    notification.innerHTML = msg
    setTimeout(function() {
        notification.classList.remove('active')
    }, 2000)    
}

function render() {
    savedUrls.forEach((link, index) => {
        let el = generateItem(link.name, link.url, index, 'web')
        wrapper.appendChild(el)
    })
}

init()