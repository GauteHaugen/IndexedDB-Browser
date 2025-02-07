import { createApp } from 'vue';
import App from './App.vue';

const extensionContainer = document.createElement('div');
extensionContainer.id = 'indexed-db-browser-container';
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
appContainer.id = 'indexed-db-browser-app';
Object.assign(appContainer.style, {
  position: 'absolute',
});
shadowRoot.appendChild(appContainer);

const app = createApp(App);
app.mount(appContainer);
