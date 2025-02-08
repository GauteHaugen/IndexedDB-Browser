import { createApp } from 'vue';
import App from './App.vue';
import { storeKey } from './core/symbols';
import { store } from './core/store';

const extensionContainer = document.createElement('div');
extensionContainer.id = 'indexed-db-manager-container';
document.body.appendChild(extensionContainer);

const shadowRoot = extensionContainer.attachShadow({ mode: 'open' });

fetch(chrome.runtime.getURL('assets/index.css')).then((response) => {
  response.text().then((css) => {
    const styleElement = document.createElement('style');
    styleElement.textContent = css.replace(':root', ':host');
    shadowRoot.appendChild(styleElement);
  });
});

const appContainer = document.createElement('div');
appContainer.id = 'indexed-db-manager-app';
Object.assign(appContainer.style, {
  position: 'absolute',
});
shadowRoot.appendChild(appContainer);

const app = createApp(App);

app.provide(storeKey, store);

app.mount(appContainer);
