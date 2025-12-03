<script setup lang="ts">
import Logo from '../components/logo.vue';
</script>

<template>
  <div class="text-left p-4">
    <Logo />
    <div class="slidev-layout default flex-column justify-between">
      <slot />
    </div>

    <Edit />
  </div>
</template>
