<template>
  <div v-if="objectStore" @click="() => store.navigateToObjectStore(objectStore)">{{ objectStore.name ?? 'Name Missing' }}</div>
  <div v-else>Object Store Missing</div>
</template>

<script setup lang="ts">
import type { ObjectStore } from '@/core/models/object_store';
import type { IStore } from '@/core/store';
import { storeKey } from '@/core/symbols';
import { defineProps, inject } from 'vue';

const store = inject<IStore>(storeKey);

if (store === undefined) {
  throw new Error('Could not find store');
}

defineProps<{
  objectStore: ObjectStore;
}>();
</script>
