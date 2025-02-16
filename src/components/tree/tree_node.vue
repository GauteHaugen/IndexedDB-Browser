<template>
  <div class="d-flex flex-column">
    <div class="d-flex p-2">
      <button v-if="renderSubNodes" @click="() => (showSubNodes = !showSubNodes)">{{ showSubNodes ? 'Hide' : 'Show' }}</button>
      <div class="flex-grow-1 p-2">
        <slot name="main-node"></slot>
      </div>
    </div>

    <div class="d-flex" v-if="showSubNodes">
      <div class="flex-grow-1 p-2">
        <slot name="sub-nodes"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref } from 'vue';

defineProps<{
  renderSubNodes: boolean;
}>();

const showSubNodes = ref(false);
</script>
