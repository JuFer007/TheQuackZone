<template>
  <DefaultLayout>
    <div v-if="loading" class="loading-screen">
      <i class="fa-solid fa-spinner fa-spin text-4xl mb-4"></i>
      <p class="text-[#888]">Cargando juego...</p>
    </div>

    <div v-else-if="juego" class="detail-container">
      <div class="detail-hero" :style="{ backgroundImage: `url(${juego.background_image})` }">
        <div class="hero-overlay">
          <div class="hero-content">
            <h1 class="hero-title">{{ juego.name }}</h1>
            <div class="hero-meta">
              <span v-if="juego.released" class="meta-badge">
                <i class="fas fa-calendar"></i> {{ formatDate(juego.released) }}
              </span>
              <span class="meta-badge rating-badge">
                <i class="fas fa-star"></i> {{ juego.rating.toFixed(1) }} / 5
              </span>
              <span v-if="juego.metacritic" class="meta-badge" :class="{ 'meta-high': juego.metacritic >= 75, 'meta-mid': juego.metacritic >= 50 && juego.metacritic < 75 }">
                <i class="fas fa-flask"></i> {{ juego.metacritic }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="detail-body">
        <div class="detail-main">
          <div v-if="juego.description_raw" class="desc-section">
            <h2 class="section-title">Descripción</h2>
            <p class="desc-text">{{ juego.description_raw }}</p>
          </div>

          <div v-if="screenshots.length > 0" class="screenshots-section">
            <h2 class="section-title">Capturas</h2>
            <div class="screenshots-grid">
              <img v-for="(ss, idx) in screenshots" :key="ss.id" :src="ss.image" :alt="`Screenshot ${idx + 1}`" class="screenshot-img" @click="selectedScreenshot = ss.image" />
            </div>
          </div>
        </div>

        <div class="detail-sidebar">
          <div class="sidebar-card">
            <h3 class="sidebar-title">Géneros</h3>
            <div class="genre-tags">
              <span v-for="g in juego.genres" :key="g.id" class="genre-tag">{{ g.name }}</span>
            </div>
          </div>

          <div class="sidebar-card">
            <h3 class="sidebar-title">Plataformas</h3>
            <div class="platform-list">
              <span v-for="p in juego.platforms" :key="p.id" class="platform-item">
                <i class="fas fa-gamepad"></i> {{ p.name }}
              </span>
            </div>
          </div>

          <div class="sidebar-card acciones-card">
            <template v-if="disponible">
              <button class="btn-cart" @click="addToCart" :disabled="cartLoading">
                <i v-if="cartLoading" class="fa-solid fa-spinner fa-spin"></i>
                <i v-else class="fas fa-shopping-cart"></i> {{ cartLoading ? 'Agregando...' : 'Agregar al Carrito' }}
              </button>
              <button class="btn-wish" @click="addToWishlist" :disabled="wishLoading">
                <i v-if="wishLoading" class="fa-solid fa-spinner fa-spin"></i>
                <i v-else class="fas fa-heart"></i> {{ wishLoading ? 'Agregando...' : 'Lista de Deseos' }}
              </button>
            </template>
            <p v-else class="text-[#888] text-sm text-center py-4">Juego no disponible para compra</p>
          </div>
        </div>
      </div>

      <Transition name="fade">
        <div v-if="selectedScreenshot" class="lightbox" @click.self="selectedScreenshot = null">
          <img :src="selectedScreenshot" class="lightbox-img" />
          <button class="lightbox-close" @click="selectedScreenshot = null">&times;</button>
        </div>
      </Transition>
    </div>

    <div v-else class="loading-screen">
      <p class="text-[#888]">No se encontró el juego</p>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import { rawgService } from '../services/rawg.service'
import { gameService } from '../services/game.service'
import { wishlistService } from '../services/wishlist.service'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../composables/useToast'
import { formatDate } from '../utils/format'

const route = useRoute()
const cartStore = useCartStore()
const authStore = useAuthStore()
const toast = useToast()

const juego = ref(null)
const screenshots = ref([])
const loading = ref(true)
const selectedScreenshot = ref(null)
const cartLoading = ref(false)
const wishLoading = ref(false)
const disponible = ref(undefined)

async function cargarDetalle() {
  loading.value = true
  juego.value = null
  screenshots.value = []
  disponible.value = undefined
  try {
    const id = route.params.id
    const [detailRes, ssRes, existsRes] = await Promise.all([
      rawgService.obtenerJuego(id),
      rawgService.obtenerScreenshots(id),
      gameService.checkRawgExists(id).catch(() => ({ data: { exists: false } })),
    ])
    juego.value = detailRes.data
    screenshots.value = ssRes.data.results || []
    disponible.value = existsRes.data?.exists === true
  } catch (err) {
    console.error('Error loading game detail:', err)
  } finally {
    loading.value = false
  }
}

onMounted(cargarDetalle)
watch(() => route.params.id, cargarDetalle)

async function addToCart() {
  if (!authStore.isLoggedIn) {
    toast.show('Debes iniciar sesión para agregar al carrito', 'warning')
    return
  }
  if (!juego.value?.id) return
  if (authStore.esJuegoComprado(juego.value.id)) {
    toast.show('Ya tienes este juego en tu biblioteca', 'warning')
    return
  }
  cartLoading.value = true
  try {
    await cartStore.addGame(authStore.user.id, juego.value.id)
    toast.show(`"${juego.value.name}" agregado al carrito`, 'success')
  } catch {
    toast.show('Error al agregar al carrito', 'error')
  } finally {
    cartLoading.value = false
  }
}

async function addToWishlist() {
  if (!authStore.isLoggedIn) {
    toast.show('Debes iniciar sesión para agregar a deseos', 'warning')
    return
  }
  wishLoading.value = true
  try {
    await wishlistService.add(authStore.user.id, juego.value.id)
    toast.show(`"${juego.value.name}" agregado a lista de deseos`, 'success')
  } catch {
    toast.show('Error al agregar a lista de deseos', 'error')
  } finally {
    wishLoading.value = false
  }
}
</script>

<style scoped>
.loading-screen { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; }
.detail-hero {
  position: relative; height: 420px; background-size: cover; background-position: center;
  border-radius: 0 0 30px 30px; overflow: hidden;
}
.hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.3) 70%);
  display: flex; align-items: flex-end; padding: 40px;
}
.hero-content { max-width: 900px; width: 100%; margin: 0 auto; }
.hero-title { font-size: 2.8em; font-weight: 800; color: white; margin: 0 0 20px; font-family: 'Audiowide', cursive; text-shadow: 0 2px 20px rgba(0,0,0,0.6); }
.hero-meta { display: flex; gap: 15px; flex-wrap: wrap; }
.meta-badge {
  background: rgba(255,255,255,0.12); backdrop-filter: blur(8px);
  color: white; padding: 8px 18px; border-radius: 30px;
  font-size: 0.95em; font-weight: 600; display: flex; align-items: center; gap: 8px;
}
.meta-badge i { color: #ff6300; }
.rating-badge i { color: #ffc107; }
.meta-high i { color: #4caf50; }
.meta-mid i { color: #ff9800; }

.detail-body { display: flex; gap: 30px; max-width: 1200px; margin: 40px auto; padding: 0 20px; }
.detail-main { flex: 1; }
.detail-sidebar { width: 320px; flex-shrink: 0; }

.section-title { font-size: 1.5em; font-weight: 700; color: white; margin: 0 0 20px; font-family: 'Audiowide', cursive; }
.desc-text { color: #ccc; line-height: 1.8; font-size: 1.05em; text-align: justify; }

.desc-section, .screenshots-section { margin-bottom: 40px; }
.screenshots-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
.screenshot-img { width: 100%; height: 140px; object-fit: cover; border-radius: 12px; cursor: pointer; transition: transform 0.3s; }
.screenshot-img:hover { transform: scale(1.05); }

.sidebar-card {
  background: linear-gradient(145deg, #252525, #1a1a1a);
  border-radius: 16px; padding: 20px; margin-bottom: 20px;
}
.sidebar-title { font-size: 1.1em; font-weight: 700; color: white; margin: 0 0 15px; }
.genre-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.genre-tag { background: rgba(255,99,0,0.2); color: #ff6300; padding: 5px 14px; border-radius: 20px; font-size: 0.85em; font-weight: 600; }
.platform-list { display: flex; flex-direction: column; gap: 8px; }
.platform-item { color: #ccc; font-size: 0.9em; display: flex; align-items: center; gap: 8px; }
.platform-item i { color: #ff6300; width: 18px; }

.acciones-card { display: flex; flex-direction: column; gap: 12px; }
.btn-cart, .btn-wish { padding: 14px; border: none; border-radius: 12px; font-size: 1em; font-weight: 700; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 8px; }
.btn-cart { background: linear-gradient(to right, rgba(255,126,0,0.76), #ff6300); color: #000; }
.btn-cart:hover { transform: scale(1.03); }
.btn-wish { background: rgba(255,255,255,0.08); color: white; border: 2px solid rgba(255,255,255,0.15); }
.btn-wish:hover { background: rgba(255,255,255,0.15); }

.lightbox { position: fixed; inset: 0; z-index: 2000; background: rgba(0,0,0,0.92); display: flex; align-items: center; justify-content: center; }
.lightbox-img { max-width: 90vw; max-height: 90vh; border-radius: 12px; object-fit: contain; }
.lightbox-close { position: absolute; top: 30px; right: 40px; color: white; font-size: 40px; background: none; border: none; cursor: pointer; }

@media (max-width: 768px) {
  .detail-hero { height: 280px; }
  .hero-title { font-size: 1.8em; }
  .detail-body { flex-direction: column; }
  .detail-sidebar { width: 100%; }
  .screenshots-grid { grid-template-columns: repeat(2, 1fr); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
