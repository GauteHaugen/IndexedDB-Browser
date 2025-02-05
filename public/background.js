chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: injectVueApp
  });
});

function injectVueApp() {
  if (document.getElementById('indexed-db-browser-container')) {
    document.getElementById('indexed-db-browser-container').style.display = 'block';

    return;
  }

  const container = document.createElement('div');
  container.id = 'indexed-db-browser-container';
  container.dataset.cssUrl = chrome.runtime.getURL('assets/index.css')
  document.body.appendChild(container);

  const indexedDbBrowser = document.createElement('indexed-db-browser');
  container.appendChild(indexedDbBrowser);


  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('assets/index.js');
  document.head.appendChild(script);
}
