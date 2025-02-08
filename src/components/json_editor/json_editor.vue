<template>
  <JsonEditor v-model="json" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

import JsonEditor from 'json-editor-vue';

const json = ref({});
</script>
