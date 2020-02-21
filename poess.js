let savedUrls = []
const wrapper = document.getElementById('links-wrapper')

function load() {
    chrome.storage.local.get(['tests'], function(result) {
        savedUrls = result.tests || []
        wrapper.innerHTML = ''

        render()
    });
}

document.getElementById('addButton').addEventListener('click', function() {
    
    chrome.tabs.query(
        { 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT },
        function (tabs) { 
            const currentUrl = tabs[0].url
            addItem(currentUrl)
        }
    );

    
})

function link(url, asd) {
    console.log(url, asd)
    chrome.tabs.create({ url: url });
    
}

function addItem(url) {
    chrome.storage.local.set({tests: [...savedUrls, url]}, function() {
        load()
    })
}

function generateItem(name, url, index, website) {
    let el = document.createElement('a')
    el.innerHTML = url
    el.dataset.id = index
    el.classList.add('link')
    el.onclick= () => link(url)


    return el
}

function render() {
    savedUrls.forEach((link, index) => {
            
        let el = generateItem('test', link, index, 'web')
        wrapper.appendChild(el)
    })
}

load()