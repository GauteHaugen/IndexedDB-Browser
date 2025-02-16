<script setup lang="ts">
import type { IStore } from './core/store';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { ref, onMounted, inject } from 'vue';
import { storeKey } from './core/symbols';

import SplitContainer from '@/components/util/split_container.vue';
import IndexedDBTreeView from '@/components/tree/indexed_db_tree_view.vue';
import WelcomeLayout from './views/welcome_layout.vue';
import DatabaseLayout from './views/database_layout.vue';
import ObjectStoreLayout from './views/object_store_layout.vue';
import IndexLayout from './views/index_layout.vue';

const store = inject<IStore>(storeKey);

if (store === undefined) {
  throw new Error('Store is not provided');
}

const showIndexedDbManager = ref(false);
const bodyOverflowValue = ref('');

const onClose = () => {
  document.body.style.overflow = bodyOverflowValue.value;
  bodyOverflowValue.value = '';

  showIndexedDbManager.value = false;
};

onMounted(() => {
  store.initialize();
});

window.chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'OPEN_INDEXED_DB_MANAGER') {
    bodyOverflowValue.value = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    showIndexedDbManager.value = true;
  }
});
</script>

<template>
  <div
    v-if="showIndexedDbManager"
    class="position-fixed inset-0 bg-white d-flex flex-column"
    :style="{ 'z-index': Number.MAX_SAFE_INTEGER }"
  >
    <SplitContainer :initial-size="300" :container1-options="{ minSize: 300, maxSize: 800 }" :container2-options="{ minSize: 300 }">
      <template #container1>
        <IndexedDBTreeView />
      </template>

      <template #container2>
        <div class="d-flex flex-column flex-grow-1">
          <div class="d-flex justify-content-end">
            <button class="btn btn-sm btn-secondary" @click="onClose">Close</button>
          </div>
          <hr />
          <div class="border flex-grow-1">
            <WelcomeLayout v-if="store.state.currentRoute.type === 'welcome'" />
            <DatabaseLayout v-if="store.state.currentRoute.type === 'database'" />
            <ObjectStoreLayout v-if="store.state.currentRoute.type === 'objectStore'" />
            <IndexLayout v-if="store.state.currentRoute.type === 'index'" />
          </div>
        </div>
      </template>
    </SplitContainer>
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
