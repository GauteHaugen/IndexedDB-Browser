import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';

const extensionContainer = document.createElement('div');
extensionContainer.id = 'indexed-db-browser-container';
document.body.appendChild(extensionContainer);

const shadowRoot = extensionContainer.attachShadow({ mode: 'open' });

const appContainer = document.createElement('div');
appContainer.id = 'indexed-db-browser-app';
Object.assign(appContainer.style, {
  position: 'absolute',
});
shadowRoot.appendChild(appContainer);

const app = createApp(App);
app.mount(appContainer);

// const link = document.createElement('link')
// link.href = cssUrl
// link.rel = 'stylesheet'
// shadowRoot.appendChild(link)
