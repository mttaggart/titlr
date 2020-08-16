function getTab() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const tab = tabs[0];
            resolve(tab);
        });
    });
}

function getTabUrl(tabId) {
    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tabId, {action: "getTabUrl"}, url => {
            resolve(url);
        });
    });
}

function getTitles() {
    return new Promise((resolve, reject) => {
     chrome.storage.sync.get(["titlr"], titles => {
        if(titles.titlr){
            resolve(titles.titlr);   
        } else {
            resolve([]);
        } 
     });
    });
}

async function saveTitle(title, url) {
    const titles = await getTitles();
    const found  = checkTitle(titles, url);
    if (found < 0) {
        titles.push({
            url,
            title 
        });
    } else {
        titles[0].title = title;
    }
    chrome.storage.sync.set({titlr: titles});
}


async function checkTitle(titles, url) {
    return titles.findIndex( t => t.url === url);
}

async function setTitle(title) {
    const tab = await getTab();
    const tabUrl = await getTabUrl(tab.id);
    chrome.tabs.sendMessage(tab.id, {action: "changeTitle", title}, (resultTitle) => {
        saveTitle(title, tabUrl);
    });
}

document.querySelector("#change-title")
    .addEventListener("click", (e) => {
        const newTitle = document.querySelector("#new-title").value;
        setTitle(newTitle);
    });

document.querySelector("#load-title")
    .addEventListener("click", async (e) => {
        const titles = await getTitles();
        const tab = await getTab();
        const url = await getTabUrl(tab.id);
        const found = await checkTitle(titles, url);
        console.log(found);
        if (found >= 0) {
            setTitle(titles[found].title);
        }
    })
