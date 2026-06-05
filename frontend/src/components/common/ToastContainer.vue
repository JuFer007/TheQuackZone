<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div v-for="t in toasts" :key="t.id" class="toast-item" :class="t.type">
          <i :class="iconMap[t.type] || iconMap.info" class="toast-icon"></i>
          {{ t.message }}
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '../../composables/useToast'

const { toasts } = useToast()

const iconMap = {
  success: 'fa-solid fa-check-circle',
  error: 'fa-solid fa-times-circle',
  warning: 'fa-solid fa-exclamation-triangle',
  info: 'fa-solid fa-info-circle',
}
</script>

<style scoped>
.toast-container {
  position: fixed; top: 100px; right: 20px; z-index: 9999;
  display: flex; flex-direction: column; gap: 0.5rem;
}
.toast-item {
  color: white; padding: 1rem 1.5rem; border-radius: 9999px;
  font-weight: 600; display: flex; align-items: center; gap: 0.75rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.toast-item.success { background: linear-gradient(135deg, #22c55e, #16a34a); }
.toast-item.error { background: linear-gradient(135deg, #ef4444, #dc2626); }
.toast-item.warning { background: linear-gradient(135deg, #ff6300, #ff8c42); }
.toast-item.info { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.toast-icon { color: white; font-size: 1.1rem; }
.toast-enter-active { animation: slideIn 0.3s ease; }
.toast-leave-active { animation: fadeOut 0.3s ease; }
@keyframes slideIn { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
@keyframes fadeOut { to { opacity: 0; transform: translateX(400px); } }
</style>
