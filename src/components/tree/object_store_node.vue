<template>
  <li>{{ objectStore.name }}</li>
</template>

<script setup lang="ts">
import type { IObjectStore } from '@/core/models/object_store';
import { defineProps } from 'vue';

defineProps<{
  objectStore: IObjectStore;
}>();
</script>
