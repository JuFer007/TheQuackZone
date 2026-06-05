<template>
  <div class="min-h-screen bg-[#191919]">
    <slot />
    <ToastContainer />
  </div>
</template>

<script setup>
import ToastContainer from '../components/common/ToastContainer.vue'
</script>
