<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="juego" class="modal-backdrop" @click.self="$emit('close')">
        <div class="modal-content">
          <div class="modal-image">
            <img :src="juego.background_image" :alt="juego.name" />
            <span class="modal-close" @click="$emit('close')">&times;</span>
          </div>

          <div class="modal-body">
            <h2 class="modal-title">{{ juego.name }}</h2>
            <p v-if="juego.description_raw" class="modal-desc">{{ juego.description_raw }}</p>

            <div class="modal-details">
              <div class="detail-item">
                <i class="fas fa-calendar"></i>
                <div>
                  <div class="detail-label">Lanzamiento</div>
                  <div class="detail-value">{{ formatDate(juego.released) }}</div>
                </div>
              </div>
              <div class="detail-item">
                <i class="fa-solid fa-layer-group"></i>
                <div>
                  <div class="detail-label">Géneros</div>
                  <div class="detail-value">{{ generos }}</div>
                </div>
              </div>
              <div class="detail-item">
                <i class="fas fa-gamepad"></i>
                <div>
                  <div class="detail-label">Plataformas</div>
                  <div class="detail-value">{{ plataformas }}</div>
                </div>
              </div>
              <div class="detail-item">
                <i class="fas fa-star"></i>
                <div>
                  <div class="detail-label">Rating</div>
                  <div class="detail-value">
                    <span v-for="i in 5" :key="i" class="modal-star" :class="{ filled: i <= Math.round(juego.rating) }">&#9733;</span>
                    {{ juego.rating.toFixed(1) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <template v-if="disponible">
              <button class="modal-cart-btn" @click="$emit('add-cart', juego)">
                <i class="fas fa-shopping-cart"></i> Agregar al Carrito
              </button>
              <button class="modal-wish-btn" @click="$emit('add-wishlist', juego)">
                <i class="fas fa-heart"></i> Deseos
              </button>
            </template>
            <p v-else class="text-[#888] text-sm w-full text-center py-2">No disponible para compra</p>
            <button class="modal-detail-btn" @click="$emit('view-detail', juego)">
              <i class="fas fa-eye"></i> Ver Detalle
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { formatDate } from '../../utils/format'
import { gameService } from '../../services/game.service'

const props = defineProps({ juego: Object })
defineEmits(['close', 'add-cart', 'add-wishlist', 'view-detail'])
const disponible = ref(undefined)

watch(() => props.juego, async (juego) => {
  if (!juego) { disponible.value = undefined; return }
  try {
    const res = await gameService.checkRawgExists(juego.id)
    disponible.value = res.data?.exists === true
  } catch {
    disponible.value = false
  }
}, { immediate: true })

const generos = computed(() => {
  if (!props.juego.genres || props.juego.genres.length === 0) return '—'
  return props.juego.genres.map(g => g.name).join(', ')
})

const plataformas = computed(() => {
  if (!props.juego.platforms || props.juego.platforms.length === 0) return '—'
  return props.juego.platforms.map(p => p.name).slice(0, 3).join(', ')
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center;
}
.modal-content {
  position: relative; background: linear-gradient(145deg, #2d2d2d, #1a1a1a);
  width: 90%; max-width: 600px; border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.7);
  animation: slideDown 0.4s ease; overflow: hidden;
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  max-height: 90vh; overflow-y: auto;
}
.modal-image {
  position: relative; height: 250px; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
.modal-image img { width: 100%; height: 100%; object-fit: cover; object-position: center; flex-shrink: 0; }
.modal-close {
  position: absolute; top: 20px; right: 20px; color: white; font-size: 35px;
  font-weight: bold; cursor: pointer; z-index: 10; width: 45px; height: 45px;
  background: rgba(0,0,0,0.7); border-radius: 50%; display: flex;
  align-items: center; justify-content: center; transition: all 0.3s;
}
.modal-close:hover { background: #ff6300; transform: rotate(90deg); }
.modal-body { padding: 30px 40px; color: white; }
.modal-title { font-size: 1.7rem; font-weight: bold; margin-top: -10px; margin-bottom: 15px; font-family: 'Audiowide', cursive; word-spacing: 3px; }
.modal-desc { font-size: 1.05em; line-height: 1.7; color: #ccc; margin-bottom: 25px; text-align: justify; max-height: 150px; overflow-y: auto; }
.modal-details { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 30px; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 12px; }
.detail-item { display: flex; align-items: center; gap: 10px; }
.detail-item i { color: #ff6300; font-size: 1.2em; min-width: 28px; text-align: center; }
.detail-label { color: #888; font-size: 0.9em; }
.detail-value { color: white; font-weight: 600; display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.modal-star { color: #555; font-size: 1em; }
.modal-star.filled { color: #ffc107; }
.modal-footer { display: flex; gap: 10px; padding: 20px 40px; background: rgba(0,0,0,0.3); border-top: 1px solid rgba(255,255,255,0.1); flex-wrap: wrap; }
.modal-cart-btn, .modal-wish-btn, .modal-detail-btn { flex: 1; padding: 12px 16px; border: none; border-radius: 12px; font-size: 0.95em; font-weight: 700; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 6px; min-width: 120px; }
.modal-cart-btn { background: linear-gradient(to right, rgba(255,126,0,0.76), #ff6300); color: #000; }
.modal-cart-btn:hover { transform: scale(1.05); }
.modal-wish-btn { background: rgba(255,255,255,0.08); color: white; border: 2px solid rgba(255,255,255,0.15); }
.modal-wish-btn:hover { background: rgba(255,255,255,0.15); }
.modal-detail-btn { background: rgba(255,99,0,0.2); color: #ff6300; border: 2px solid #ff6300; }
.modal-detail-btn:hover { background: rgba(255,99,0,0.3); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes slideDown {
  from { opacity: 0; transform: translate(-50%, -60%); }
  to { opacity: 1; transform: translate(-50%, -50%); }
}

@media (max-width: 768px) {
  .modal-body { padding: 20px 25px; }
  .modal-details { grid-template-columns: 1fr; }
  .modal-footer { flex-direction: column; padding: 20px 25px; }
  .modal-cart-btn, .modal-wish-btn, .modal-detail-btn { width: 100%; }
}
</style>
