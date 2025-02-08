<template>
  <li @click="() => (nodeOpen = !nodeOpen)">{{ database.name }}</li>

  <template v-if="nodeOpen">
    <ul class="ms-4">
      <li v-if="isLoadingObjectStores">Loading...</li>
      <li v-else-if="objectStores.length === 0">No object stores</li>
      <ObjectStoreNode v-else v-for="objectStore in objectStores" :key="objectStore.name" :objectStore="objectStore" />
    </ul>
  </template>
</template>

<script setup lang="ts">
import type { IDatabase } from '@/core/models/database';
import type { IObjectStore } from '@/core/models/object_store';
import { defineProps, ref, onMounted } from 'vue';

import ObjectStoreNode from '@/components/tree/object_store_node.vue';

const nodeOpen = ref(false);
const isLoadingObjectStores = ref(false);
const objectStores = ref(new Array<IObjectStore>());

const props = defineProps<{
  database: IDatabase;
}>();

onMounted(() => {
  loadObjectStores();
});

const loadObjectStores = async () => {
  try {
    isLoadingObjectStores.value = true;

    objectStores.value = await props.database.getObjectStores();
  } catch (reason) {
    console.error(reason);
  } finally {
    isLoadingObjectStores.value = false;
  }
};
</script>
