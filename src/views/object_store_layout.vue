<template>
  <h1>Object Store</h1>
  <template v-if="store.state.currentRoute.type === 'objectStore'">
    <p>Database: {{ currentDatabase?.name }}</p>
    <p>Object Store: {{ currentObjectStore?.name }}</p>
    <ul>
      <li v-for="property in currentObjectStoreProperties" :key="property">{{ property }}</li>
    </ul>
  </template>
</template>

<script setup lang="ts">
import type { IStore } from '@/core/store';
import { storeKey } from '@/core/symbols';
import { computed, inject } from 'vue';

const store = inject<IStore>(storeKey);

if (store === undefined) {
  throw new Error('Could not find store');
}

const currentDatabaseName = computed(() => {
  if (store.state.currentRoute.type !== 'objectStore') {
    return undefined;
  }

  return store.state.currentRoute.databaseName;
});

const currentObjectStoreName = computed(() => {
  if (store.state.currentRoute.type !== 'objectStore') {
    return undefined;
  }

  return store.state.currentRoute.objectStoreName;
});

const currentDatabase = computed(() => {
  if (currentDatabaseName.value === undefined) {
    return undefined;
  }

  return store.state.indexedDB.filteredDatabases.get(currentDatabaseName.value);
});

const currentObjectStore = computed(() => {
  if (currentObjectStoreName.value === undefined || currentDatabase.value === undefined) {
    return undefined;
  }

  return currentDatabase.value.filteredObjectStores.get(currentObjectStoreName.value);
});

const currentObjectStoreProperties = computed(() => {
  if (currentObjectStore.value === undefined) {
    return undefined;
  }

  return currentObjectStore.value.propertySet;
});
</script>
