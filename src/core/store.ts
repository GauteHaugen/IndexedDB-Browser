import { reactive, readonly } from 'vue'

const state = reactive({})

async function initialize() {
  await loadDatabases()
  await loadObjectStores()
  await loadIndexes()
}

async function loadDatabases() {}

async function loadObjectStores() {}

async function loadIndexes() {}

export const store = {
  state: readonly(state),
  initialize: initialize,
}
