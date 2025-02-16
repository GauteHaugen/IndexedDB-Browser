<template>
  <div class="d-flex flex-column">
    <div class="d-flex">
      <input class="form-control" type="text" placeholder="Search..." v-model="searchModel" />

      <button class="btn btn-secondary" @click="store.refreshDatabases">Refresh</button>
    </div>

    <div class="d-flex flex-column flex-grow-1 overflow-y-auto">
      <p v-if="store.state.loadingRegister">loading</p>
      <TreeNode
        v-else
        v-for="[key, database] in store.state.indexedDB.filteredDatabases"
        :render-sub-nodes="database.filteredObjectStores.size > 0"
        :key="key"
      >
        <template #main-node>
          <DatabaseNode :database="(() => database as Database)()" />
        </template>

        <template #sub-nodes>
          <TreeNode v-for="[key, objectStore] in database.filteredObjectStores" class="ms-4" :render-sub-nodes="false" :key="key">
            <template #main-node>
              <ObjectStoreNode :objectStore="(() => objectStore as ObjectStore)()" />
            </template>
          </TreeNode>
        </template>
      </TreeNode>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IStore } from '@/core/store';

import { inject, ref, watch } from 'vue';
import { storeKey } from '@/core/symbols';

import TreeNode from '@/components/tree/tree_node.vue';
import DatabaseNode from '@/components/tree/database_node.vue';
import ObjectStoreNode from '@/components/tree/object_store_node.vue';
import { Database } from '@/core/models/database';
import type { ObjectStore } from '@/core/models/object_store';
import { debounce } from '@/core/functions/debounce';

const store = inject<IStore>(storeKey);

if (store === undefined) {
  throw new Error('Store is not provided');
}

const searchModel = ref<string>('');
const currentSearch = ref<string>('');

watch(
  () => searchModel.value,
  debounce((newValue, oldValue) => {
    if (newValue === oldValue) {
      return;
    }

    currentSearch.value = searchModel.value.toLowerCase();

    const search = currentSearch.value.trim();

    store.applyFilter(search);
  }, 500),
);
</script>
