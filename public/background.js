chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: "OPEN_INDEXED_DB_BROWSER" });
});
