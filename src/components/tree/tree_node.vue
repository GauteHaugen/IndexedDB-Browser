<template>
  <div class="d-flex flex-column">
    <div class="d-flex">
      <div class="flex-grow-1">
        <slot name="main-node"></slot>
      </div>
    </div>

    <div class="d-flex" v-if="renderSubNodes">
      <div class="flex-grow-1">
        <slot name="sub-nodes"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  renderSubNodes: boolean;
}>();
</script>
