<template>
  <div class="display-flex flex-column" style="width: 300px">
    <input class="form-control" type="text" placeholder="Search" />
    <div class="d-flex flex-column flex-grow-1 overflow-y-auto">
      <TreeNode
        v-for="[key, database] in store.state.databases.entries()"
        :render-sub-nodes="database.loadedObjectStores.size > 0"
        :key="key"
      >
        <template #main-node>
          <DatabaseNode :database="(() => database as Database)()" />
        </template>

        <template #sub-nodes>
          <TreeNode v-for="[key, objectStore] in database.loadedObjectStores.entries()" class="ms-4" :render-sub-nodes="false" :key="key">
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

import { inject } from 'vue';
import { storeKey } from '@/core/symbols';

import TreeNode from '@/components/tree/tree_node.vue';
import DatabaseNode from '@/components/tree/database_node.vue';
import ObjectStoreNode from '@/components/tree/object_store_node.vue';
import { Database } from '@/core/models/database';
import type { ObjectStore } from '@/core/models/object_store';

const store = inject<IStore>(storeKey);

if (store === undefined) {
  throw new Error('Store is not provided');
}
</script>
