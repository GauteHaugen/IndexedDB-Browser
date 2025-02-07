<script setup lang="ts">
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { ref, onMounted } from 'vue';

const showIndexedDbBrowser = ref(false);
const bodyOverflowValue = ref('');
const databases = ref<Array<IDBDatabaseInfo>>([]);

const loadDatabases = async () => {
  const indexedDbDatabases = await indexedDB.databases();

  for (const database of indexedDbDatabases) {
    databases.value.push(database);
  }
};

const onClose = () => {
  document.body.style.overflow = bodyOverflowValue.value;
  bodyOverflowValue.value = '';

  showIndexedDbBrowser.value = false;
};

onMounted(() => {
  loadDatabases();
});

window.chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'OPEN_INDEXED_DB_BROWSER') {
    bodyOverflowValue.value = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    showIndexedDbBrowser.value = true;
  }
});
</script>

<template>
  <div
    v-if="showIndexedDbBrowser"
    class="position-fixed inset-0 bg-white d-flex flex-column"
    :style="{ 'z-index': Number.MAX_SAFE_INTEGER }"
  >
    <div class="d-flex flex-grow-1">
      <div class="display-flex flex-column border" style="width: 300px">
        <input class="form-control" type="text" placeholder="Search" />
        <ul class="flex-grow-1 overflow-y-auto">
          <li v-for="database in databases" :key="database.name">
            {{ database.name }}
          </li>
        </ul>
      </div>
      <div class="d-flex flex-column flex-grow-1 border">
        <div class="d-flex justify-content-end border">
          <button class="btn btn-sm btn-secondary" @click="onClose">Close</button>
        </div>
        <div class="border flex-grow-1">
          <h1>Detail View</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
:host {
  font-family: 'Arial', sans-serif;
  color: black;
}
</style>

<style scoped>
.inset-0 {
  inset: 0;
}
</style>
