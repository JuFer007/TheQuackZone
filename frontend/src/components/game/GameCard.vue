<template>
  <div class="game-card" @click="$emit('show-detail', juego)">
    <div class="game-card-img-wrap">
      <img :src="juego.imagenUrl" :alt="juego.titulo" class="game-card-img" />
      <button class="info-btn" @click.stop="$emit('show-detail', juego)" title="Más información">
        <i class="fa-solid fa-circle-info"></i>
      </button>
      <div v-if="deal" class="discount-badge">
        -{{ deal.savings }}%
      </div>
    </div>
    <div class="game-card-body">
      <h3 class="game-card-title">{{ juego.titulo }}</h3>
      <span class="game-card-category">{{ juego.categoria }}</span>
      <div class="game-card-price">
        <span v-if="deal" class="old-price">{{ formatCurrency(juego.precio) }}</span>
        <span :class="deal ? 'sale-price' : ''">{{ deal ? formatCurrency(deal.salePrice) : formatCurrency(juego.precio) }}</span>
      </div>
      <div v-if="deal" class="game-card-store">{{ deal.storeName }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { formatCurrency } from '../../utils/format'
import { useCheapShark } from '../../composables/useCheapShark'

const props = defineProps({ juego: Object })
defineEmits(['show-detail'])

const { getDeal } = useCheapShark()
const deal = ref(null)

onMounted(async () => {
  deal.value = await getDeal(props.juego.titulo)
})
</script>

<style scoped>
.game-card {
  position: relative;
  background: linear-gradient(145deg, #252525, #1a1a1a);
  border-radius: 16px; overflow: hidden; transition: all 0.3s ease;
  cursor: pointer; border: 2px solid transparent;
  width: 260px; height: 380px; flex-shrink: 0;
}
.game-card:hover { box-shadow: 0 12px 30px rgba(0,0,0,0.5); border-color: #ff6300; }
.game-card-img-wrap { position: absolute; inset: 0; }
.game-card-img { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; transition: transform 0.3s ease; }
.game-card:hover .game-card-img { transform: scale(1.01); }
.info-btn {
  position: absolute; top: 12px; right: 12px; width: 36px; height: 36px;
  background: rgba(0,0,0,0.7); border: none; border-radius: 50%;
  color: white; font-size: 1.15em; cursor: pointer; z-index: 2;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.3s; opacity: 0;
}
.game-card:hover .info-btn { opacity: 1; }
.info-btn:hover { background: #ff6300; transform: scale(1.1); }
.discount-badge {
  position: absolute; top: 12px; left: 12px;
  background: #dc2626; color: white; font-weight: 800;
  padding: 4px 10px; border-radius: 6px; font-size: 0.85em;
  z-index: 2; box-shadow: 0 2px 8px rgba(220,38,38,0.5);
}
.game-card-body {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 1.125rem; padding-top: 60px;
  background: linear-gradient(transparent, rgba(0,0,0,0.85) 40%);
  display: flex; flex-direction: column;
}
.game-card-title { font-size: 1.2em; font-weight: 700; color: white; margin-bottom: 10px; line-height: 1.3; }
.game-card-category { display: inline-block; background: rgba(255,99,0,0.2); color: #ff6300; padding: 4px 10px; border-radius: 20px; font-size: 0.8em; margin-bottom: 8px; font-weight: 600; width: fit-content; }
.game-card-price { font-size: 1.4em; font-weight: bold; color: #ff6300; display: flex; align-items: center; gap: 8px; }
.old-price { font-size: 0.8em; color: #888; text-decoration: line-through; font-weight: normal; }
.sale-price { color: #10b981; }
.game-card-store { font-size: 0.75em; color: #10b981; font-weight: 500; margin-top: 2px; }
</style>
