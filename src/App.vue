<script setup lang="ts">
import { ref, onMounted } from 'vue';

const showIndexedDbBrowser = ref(false);
const databases = ref<Array<IDBDatabaseInfo>>([]);

const loadDatabases = async () => {
  const indexedDbDatabases = await indexedDB.databases();

  for (const database of indexedDbDatabases) {
    databases.value.push(database);
  }
};

const onClose = () => {
  showIndexedDbBrowser.value = false;
};

onMounted(() => {
  loadDatabases();
});

window.chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'OPEN_INDEXED_DB_BROWSER') {
    showIndexedDbBrowser.value = true;
  }
});
</script>

<template>
  <div
    v-if="showIndexedDbBrowser"
    style="position: fixed; inset: 0; background-color: white; display: flex; flex-direction: column"
    :style="{ 'z-index': Number.MAX_SAFE_INTEGER }"
  >
    <div style="display: flex; flex-grow: 1">
      <div style="display: flex; flex-direction: column; width: 300px">
        <input type="text" placeholder="Search" />
        <ul style="flex-grow: 1; overflow-y: auto">
          <li v-for="database in databases" :key="database.name">
            {{ database.name }}
          </li>
        </ul>
      </div>
      <div style="display: flex; flex-direction: column; flex-grow: 1">
        <div style="display: flex; justify-content: end">
          <button @click="onClose">Close</button>
        </div>
        <div>
          <h1>Detail View</h1>
        </div>
      </div>
    </div>
  </div>
</template>
