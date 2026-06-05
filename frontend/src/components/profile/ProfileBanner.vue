<template>
  <div class="profile-banner" 
  style="height: 400px;">
    <img :src="imagen || defaultBanner" class="banner-img"/>
    <button v-if="editable" class="change-btn" @click="$emit('change')">
      <i class="fas fa-image"></i> Cambiar Portada
    </button>
  </div>
</template>

<script setup>
defineProps({
  imagen: String,
  editable: { type: Boolean, default: false },
})
defineEmits(['change'])

const defaultBanner = 'https://i.pinimg.com/1200x/9c/86/e5/9c86e55ffc702c8f5a57749387e239ea.jpg'
</script>

<style scoped>
.profile-banner { position: relative; border-radius: 16px; overflow: hidden; height: 400px; margin-bottom: -60px; }
.banner-img { width: 100%; height: 100%; object-fit: cover; }
.change-btn { position: absolute; top: 16px; right: 16px; background: rgba(0,0,0,0.6); color: white; border: 1px solid rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 0.875rem; display: flex; align-items: center; gap: 8px; transition: background 0.3s; }
.change-btn:hover { background: #ff6300; }
</style>
