chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        console.log(sender);
        if (message.action === "changeTitle") {
            document.title = message.title;
            sendResponse(document.title);
        }
        if (message.action === "getTabUrl") {
            sendResponse(document.location.href);
        }
});


