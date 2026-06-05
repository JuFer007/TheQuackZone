<template>
  <div class="carousel">
    <div v-for="juego in juegos" :key="juego.id" class="carousel-item">
      <img :src="juego.imagenUrl" :alt="juego.titulo" class="carousel-cover" />
      <div class="carousel-hover">
        <img :src="juego.portadaUrl || juego.imagenUrl" :alt="juego.titulo" class="carousel-hover-img" />
        <div class="carousel-overlay">
          <h4>{{ juego.titulo }}</h4>
          <p class="text-[#ff6300] font-bold text-lg mb-1">{{ formatCurrency(juego.precio) }}</p>
          <button class="buy-btn" @click="$emit('add-cart', juego)">
            <i class="fa-solid fa-cart-plus"></i> Comprar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatCurrency } from '../../utils/format'

defineProps({ juegos: Array })
defineEmits(['add-cart'])
</script>

<style scoped>
.carousel { display: flex; gap: 32px; justify-content: center; flex-wrap: wrap; padding: 40px 0; }
.carousel-item {
  position: relative; width: 260px; height: 360px; overflow: hidden;
  border-radius: 19px; transition: width 0.4s, height 0.4s, box-shadow 0.3s;
  background: #181818; box-shadow: 0 2px 16px rgba(0,0,0,0.12); flex-shrink: 0;
}
.carousel-item:hover { width: 600px; height: 360px; box-shadow: 0 6px 36px rgba(0,0,0,0.28); z-index: 10; }
.carousel-cover { width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 18px; position: absolute; inset: 0; transition: opacity 0.2s; }
.carousel-item:hover .carousel-cover { opacity: 0; }
.carousel-hover { position: absolute; inset: 0; opacity: 0; pointer-events: none; transition: opacity 0.2s; z-index: 2; }
.carousel-item:hover .carousel-hover { opacity: 1; pointer-events: all; }
.carousel-hover-img { width: 100%; height: 100%; object-fit: cover; border-radius: 18px; position: absolute; inset: 0; z-index: 1; }
.carousel-overlay { position: absolute; bottom: 0; width: 100%; padding: 24px 16px 16px; background: linear-gradient(to top, rgba(0,0,0,0.8) 80%, rgba(0,0,0,0)); color: white; display: flex; flex-direction: column; gap: 10px; border-radius: 0 0 18px 18px; z-index: 3; align-items: flex-start; }
.carousel-overlay h4 { margin: 0 0 8px; font-size: 1.3em; font-weight: bold; }
.buy-btn { background: linear-gradient(to right, rgba(255,126,0,0.76), #ff6300); color: #000; padding: 12px 30px; font-size: 16px; font-weight: bold; border: none; border-radius: 50px; cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease; }
.buy-btn:hover { transform: scale(1.05); }
.buy-btn i { margin-right: 6px; }

@media (max-width: 600px) {
  .carousel { gap: 12px; padding: 16px 0; flex-direction: column; align-items: center; }
  .carousel-item, .carousel-item:hover { width: 96vw; max-width: 400px; min-width: 200px; height: 220px; transition: none; box-shadow: 0 2px 12px rgba(0,0,0,0.12); }
  .carousel-overlay { padding: 12px 8px 10px; gap: 6px; }
  .carousel-overlay h4 { font-size: 1.05em; }
  .buy-btn { font-size: 14px; padding: 10px 22px; }
  .carousel-cover { display: none !important; }
  .carousel-hover-img { display: block !important; opacity: 1 !important; }
  .carousel-hover { opacity: 1 !important; pointer-events: all !important; }
}
</style>
