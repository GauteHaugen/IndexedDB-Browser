import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

class IndexedDbBrowser extends HTMLElement {
  constructor() {
    super()

    const shadowRoot = this.attachShadow({ mode: 'open' })

    const indexedDbBrowserContainer = document.getElementById('indexed-db-browser-container')
    const cssUrl = indexedDbBrowserContainer?.dataset.cssUrl

    if (cssUrl) {
      const link = document.createElement('link')
      link.href = cssUrl
      link.rel = 'stylesheet'
      shadowRoot.appendChild(link)
    }

    const appContainer = document.createElement('div')
    appContainer.id = 'app'
    Object.assign(appContainer.style, {
      position: 'absolute',
    })
    shadowRoot.appendChild(appContainer)

    const app = createApp(App)

    app.mount(appContainer)
  }
}

customElements.define('indexed-db-browser', IndexedDbBrowser)
