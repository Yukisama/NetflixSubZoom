//watching Start
function watchingStart(details) {
    if (details.url.includes("watch")) {
        console.log("watch start");
        browser.tabs.get(details.tabId).then((acttab) => {
            executeCommand(acttab, {
                cmd: commonLookup.actlist.init
            });
        });
    } else {
        console.log("watch not yet.");
    }
};

//execute command on page
function executeCommand(tab, msg) {
    browser.tabs.sendMessage(tab.id, msg)
        .then(() => {
            console.log("Command executed.");
        })
        .catch((errmsg) => {
            console.error(`Command failed: ${errmsg}`);
        });
}

//background listener
let watchingFilter = {
    url: [{
        hostContains: ".netflix.com"
    }]
};
browser.webNavigation.onHistoryStateUpdated.addListener(watchingStart, watchingFilter);
browser.browserAction.onClicked.addListener((tab) => {
    executeCommand(tab, {
        cmd: commonLookup.actlist.init
    });
});