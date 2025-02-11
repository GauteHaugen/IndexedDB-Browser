<template>
  <h1>Database</h1>
  <template v-if="store.state.currentRoute.type === 'database'">
    <p>Database: {{ store.state.currentRoute.databaseName }}</p>
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
