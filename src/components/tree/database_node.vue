<template>
  <div v-if="database" @click="() => store.navigateToDatabase(database)">{{ database.name ?? 'Name Missing' }}</div>
  <div v-else>Database Missing</div>
</template>

<script setup lang="ts">
import type { Database } from '@/core/models/database';
import type { IStore } from '@/core/store';
import { storeKey } from '@/core/symbols';
import { defineProps, inject } from 'vue';

const store = inject<IStore>(storeKey);

if (store === undefined) {
  throw new Error('Could not find store');
}

defineProps<{
  database: Database;
}>();
</script>
