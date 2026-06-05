<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="modal-backdrop" @click.self="$emit('close')">
        <div class="modal-box">
          <div class="modal-header">
            <h2><i class="fas fa-images text-[#ff6300]"></i> Seleccionar Avatar</h2>
            <button class="modal-close-btn" @click="$emit('close')">&times;</button>
          </div>
          <div class="modal-body">
            <div class="avatar-grid">
              <div v-for="(avatar, i) in avatars" :key="i"
                :class="['avatar-option', { selected: selected === avatar }]"
                @click="$emit('select', avatar)">
                <img :src="avatar" />
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn-cancel" @click="$emit('close')">Cancelar</button>
            <button class="btn-primary" @click="$emit('confirm')">
              <i class="fas fa-check"></i> Seleccionar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { AVATARS } from '../../config/constants'

defineProps({ visible: Boolean, selected: String })
defineEmits(['close', 'select', 'confirm'])

const avatars = AVATARS
</script>

<style scoped>
.modal-backdrop { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; }
.modal-box { background: linear-gradient(145deg, #2d2d2d, #1a1a1a); width: 90%; max-width: 600px; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.7); }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); color: white; }
.modal-header h2 { font-size: 1.25rem; font-weight: bold; display: flex; align-items: center; gap: 0.5rem; }
.modal-close-btn { background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; }
.modal-close-btn:hover { color: #ff6300; }
.modal-body { padding: 1.5rem; }
.avatar-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem; }
.avatar-option { cursor: pointer; border-radius: 12px; overflow: hidden; border: 2px solid transparent; transition: all 0.3s; }
.avatar-option:hover { border-color: rgba(255,99,0,0.5); }
.avatar-option.selected { border-color: #ff6300; transform: scale(1.05); }
.avatar-option img { width: 100%; aspect-ratio: 1; object-fit: cover; }
.modal-actions { display: flex; gap: 0.75rem; padding: 0 1.5rem 1.5rem; }
.btn-cancel, .btn-primary { flex: 1; padding: 0.75rem; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
.btn-cancel { background: transparent; color: white; border: 2px solid rgba(255,255,255,0.2); }
.btn-cancel:hover { background: rgba(255,255,255,0.1); }
.btn-primary { background: #ff6300; color: white; border: none; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
.btn-primary:hover { background: #ff7e2e; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
