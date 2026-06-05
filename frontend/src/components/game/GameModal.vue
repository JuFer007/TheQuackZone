<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="juego" class="modal-backdrop" @click.self="$emit('close')">
        <div class="modal-content">
          <div class="modal-image">
            <img :src="juego.portadaUrl || juego.imagenUrl" :alt="juego.titulo" />
            <span class="modal-close" @click="$emit('close')">&times;</span>
            <div v-if="deal" class="modal-discount-badge">
              -{{ deal.savings }}%
            </div>
          </div>

          <div class="modal-body">
            <h2 class="modal-title">{{ juego.titulo }}</h2>
            <p class="modal-desc">{{ juego.descripcion }}</p>

            <div class="modal-details">
              <div class="detail-item">
                <i class="fas fa-calendar"></i>
                <div>
                  <div class="detail-label">Fecha de lanzamiento</div>
                  <div class="detail-value">{{ formatDate(juego.fechaLanzamiento) }}</div>
                </div>
              </div>
              <div class="detail-item">
                <i class="fa-solid fa-layer-group"></i>
                <div>
                  <div class="detail-label">Categoria</div>
                  <div class="detail-value">{{ juego.categoria }}</div>
                </div>
              </div>
              <div class="detail-item">
                <i class="fas fa-gamepad"></i>
                <div>
                  <div class="detail-label">Plataforma</div>
                  <div class="detail-value">{{ juego.plataforma }}</div>
                </div>
              </div>
              <div class="detail-item">
                <i class="fas fa-star"></i>
                <div>
                  <div class="detail-label">Rating</div>
                  <div class="detail-value">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
            </div>

            <div v-if="deal" class="other-stores">
              <h3 class="other-stores-title">
                <i class="fa-solid fa-tag"></i> En oferta en {{ deal.storeName }}
              </h3>
              <div v-if="deal.steamRating" class="other-store-rating">
                <i class="fa-brands fa-steam"></i> Rating Steam: {{ deal.steamRating }}%
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <div class="modal-price">
              <span v-if="deal" class="old-price">{{ formatCurrency(juego.precio) }}</span>
              <span :class="deal ? 'sale-price' : ''">{{ deal ? formatCurrency(deal.salePrice) : formatCurrency(juego.precio) }}</span>
            </div>
            <div class="modal-footer-actions">
              <button class="modal-wishlist-btn" @click="$emit('add-wishlist', juego)">
                <i class="fa-solid fa-heart"></i>
              </button>
              <button class="modal-buy-btn" @click="$emit('add-cart', juego)">
                <i class="fas fa-shopping-cart"></i> Agregar al Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { formatCurrency, formatDate } from '../../utils/format'
import { useCheapShark } from '../../composables/useCheapShark'

const props = defineProps({ juego: Object })
defineEmits(['close', 'add-cart', 'add-wishlist'])

const { getDeal } = useCheapShark()
const deal = ref(null)
const cartLoading = ref(false)
const wishLoading = ref(false)

watch(() => props.juego, async (juego) => {
  if (!juego) { deal.value = null; return }
  deal.value = await getDeal(juego.titulo)
}, { immediate: true })
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
  animation: slideDown 0.4s ease;
  max-height: 85vh; overflow-y: auto;
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}
.modal-image {
  position: relative; height: 180px; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
.modal-image img { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; }
.modal-close {
  position: absolute; top: 12px; right: 12px; color: white; font-size: 28px;
  font-weight: bold; cursor: pointer; z-index: 10; width: 36px; height: 36px;
  background: rgba(0,0,0,0.7); border-radius: 50%; display: flex;
  align-items: center; justify-content: center; transition: all 0.3s;
}
.modal-close:hover { background: #ff6300; transform: rotate(90deg); }
.modal-discount-badge {
  position: absolute; top: 12px; left: 12px;
  background: #dc2626; color: white; font-weight: 800;
  padding: 4px 10px; border-radius: 6px; font-size: 0.85em;
  z-index: 10; box-shadow: 0 2px 8px rgba(220,38,38,0.5);
}
.modal-body { padding: 16px 24px; color: white; }
.modal-title { font-size: 1.3rem; font-weight: bold; margin-bottom: 8px; font-family: 'Audiowide', cursive; }
.modal-desc { font-size: 0.9em; line-height: 1.5; color: #ccc; margin-bottom: 14px; text-align: justify; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.modal-details { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 14px; padding: 12px 16px; background: rgba(0,0,0,0.3); border-radius: 12px; }
.detail-item { display: flex; align-items: center; gap: 10px; }
.detail-item i { color: #ff6300; font-size: 1em; min-width: 20px; text-align: center; }
.detail-label { color: #888; font-size: 0.75em; }
.detail-value { color: white; font-weight: 600; font-size: 0.85em; }
.other-stores {
  margin-bottom: 12px; padding: 10px 14px;
  background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3);
  border-radius: 10px;
}
.other-stores-title { color: #10b981; font-size: 0.85em; font-weight: 700; }

.modal-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 24px;
  border-top: 1px solid rgba(255,255,255,0.1);
}
.modal-price {
  font-size: 1.2em; font-weight: bold; color: #ff6300;
  display: flex; align-items: center; gap: 10px;
  white-space: nowrap;
}
.old-price { font-size: 0.7em; color: #888; text-decoration: line-through; font-weight: normal; }
.sale-price { color: #10b981; }
.modal-footer-actions { display: flex; align-items: center; gap: 10px; }
.modal-wishlist-btn { width: 36px; height: 36px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.15); background: transparent; color: white; font-size: 1rem; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; }
.modal-wishlist-btn:hover { background: #ff6300; border-color: #ff6300; transform: scale(1.1); }
.modal-buy-btn { background: linear-gradient(to right, rgba(255,126,0,0.76), #ff6300); color: #000; padding: 10px 22px; font-size: 14px; font-weight: bold; border: none; border-radius: 50px; cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
.modal-buy-btn:hover { transform: scale(1.05); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .modal-body { padding: 12px 16px; }
  .modal-details { grid-template-columns: 1fr; }
  .modal-footer { flex-direction: column; gap: 10px; padding: 12px 16px; }
  .modal-image { height: 140px; }
}
</style>
