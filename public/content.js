(() => {
  'use strict';

  import(chrome.runtime.getURL('assets/index.js')).catch(console.error);
})();
