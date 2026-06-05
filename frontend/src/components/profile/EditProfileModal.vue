<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="modal-backdrop" @click.self="$emit('close')">
        <div class="modal-box">
          <div class="modal-header">
            <h2><i class="fas fa-user-edit text-[#ff6300]"></i> Editar Perfil</h2>
            <button class="modal-close-btn" @click="$emit('close')">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSave" class="edit-form" novalidate>
              <div class="field">
                <label><i class="fas fa-user"></i> Nombre Completo</label>
                <input v-model.trim="localUser.nombre" type="text" placeholder="Nombre completo" :class="['w-full', errors.nombre ? 'border-red-500' : '']" />
                <p v-if="errors.nombre" class="text-red-400 text-xs mt-1 flex items-center gap-1"><i class="fas fa-exclamation-circle"></i> {{ errors.nombre }}</p>
              </div>
              <div class="field">
                <label><i class="fas fa-envelope"></i> Correo electrónico</label>
                <input v-model.trim="localUser.correo" type="email" placeholder="Correo electrónico" :class="['w-full', errors.correo ? 'border-red-500' : '']" />
                <p v-if="errors.correo" class="text-red-400 text-xs mt-1 flex items-center gap-1"><i class="fas fa-exclamation-circle"></i> {{ errors.correo }}</p>
              </div>
              <div class="field">
                <label><i class="fas fa-phone"></i> Número de Teléfono</label>
                <input v-model="localUser.telefono" type="text" placeholder="999 999 999" :class="['w-full', errors.telefono ? 'border-red-500' : '']" />
                <p v-if="errors.telefono" class="text-red-400 text-xs mt-1 flex items-center gap-1"><i class="fas fa-exclamation-circle"></i> {{ errors.telefono }}</p>
              </div>
            </form>
          </div>
          <div class="modal-actions">
            <button class="btn-cancel" @click="$emit('close')">Cancelar</button>
            <button class="btn-primary" @click="handleSave">
              <i class="fas fa-save"></i> Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { reactive } from 'vue'
import { validarNombre, validarEmail, validarTelefono } from '../../utils/validation'

const props = defineProps({ visible: Boolean, localUser: Object })
const emit = defineEmits(['close', 'save'])

const errors = reactive({ nombre: '', correo: '', telefono: '' })

function validar() {
  errors.nombre = validarNombre(props.localUser?.nombre || '')
  errors.correo = validarEmail(props.localUser?.correo || '')
  errors.telefono = validarTelefono(props.localUser?.telefono || '')
  return !errors.nombre && !errors.correo && !errors.telefono
}

function handleSave() {
  if (validar()) emit('save')
}
</script>

<style scoped>
.modal-backdrop { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; }
.modal-box { background: linear-gradient(145deg, #2d2d2d, #1a1a1a); width: 90%; max-width: 600px; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.7); max-height: 90vh; overflow-y: auto; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); color: white; }
.modal-header h2 { font-size: 1.25rem; font-weight: bold; display: flex; align-items: center; gap: 0.5rem; }
.modal-close-btn { background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; }
.modal-close-btn:hover { color: #ff6300; }
.modal-body { padding: 1.5rem; }
.edit-form { display: flex; flex-direction: column; gap: 1.25rem; }
.field label { display: flex; align-items: center; gap: 0.5rem; color: #ccc; font-weight: 600; margin-bottom: 0.375rem; font-size: 0.9rem; }
.field label i { color: #ff6300; width: 16px; }
.field input, .field select { width: 100%; padding: 0.75rem; border: 2px solid rgba(255,255,255,0.1); border-radius: 8px; background: rgba(0,0,0,0.3); color: white; font-size: 0.95rem; outline: none; transition: border-color 0.3s; }
.field input:focus, .field select:focus { border-color: #ff6300; }
.field select { cursor: pointer; }
.field select option { background: #2d2d2d; }
.modal-actions { display: flex; gap: 0.75rem; padding: 0 1.5rem 1.5rem; }
.btn-cancel, .btn-primary { flex: 1; padding: 0.75rem; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
.btn-cancel { background: transparent; color: white; border: 2px solid rgba(255,255,255,0.2); }
.btn-cancel:hover { background: rgba(255,255,255,0.1); }
.btn-primary { background: #ff6300; color: white; border: none; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
.btn-primary:hover { background: #ff7e2e; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
