<template>
  <h1>Object Store</h1>
  <template v-if="store.state.currentRoute.type === 'objectStore'">
    <p>Database: {{ store.state.currentRoute.databaseName }}</p>
    <p>Object Store: {{ store.state.currentRoute.objectStoreName }}</p>
  </template>
</template>

<script setup lang="ts">
import type { IStore } from '@/core/store';
import { storeKey } from '@/core/symbols';
import { inject } from 'vue';

const store = inject<IStore>(storeKey);

if (store === undefined) {
  throw new Error('Could not find store');
}
</script>
