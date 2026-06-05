<template>
  <DefaultLayout>
    <div v-if="loading" class="loading-screen">
      <i class="fa-solid fa-spinner fa-spin text-4xl mb-4"></i>
      <p class="text-[#888]">Cargando juego...</p>
    </div>

    <div v-else-if="juego" class="detail-container">
      <div class="detail-hero" :style="{ backgroundImage: `url(${heroImage})` }">
        <div class="hero-overlay">
          <div class="hero-content">
            <h1 class="hero-title">{{ juego.titulo }}</h1>
            <div class="hero-meta">
              <span class="meta-badge">
                <i class="fas fa-calendar"></i> {{ formatDate(juego.fechaLanzamiento) }}
              </span>
              <span class="meta-badge">
                <i class="fa-solid fa-layer-group"></i> {{ juego.categoria }}
              </span>
              <span class="meta-badge">
                <i class="fas fa-gamepad"></i> {{ juego.plataforma }}
              </span>
              <span v-if="promedioResenas > 0" class="meta-badge rating-badge">
                <i class="fas fa-star"></i> {{ promedioResenas.toFixed(1) }}
              </span>
              <span v-if="deal" class="meta-badge discount-badge-header">
                <i class="fas fa-tag"></i> -{{ deal.savings }}% en {{ deal.storeName }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="detail-body">
        <div class="detail-main">
          <div class="desc-section">
            <h2 class="section-title">Descripción</h2>
            <p class="desc-text">{{ juego.descripcion }}</p>
          </div>

          <div v-if="rawgData && screenshots.length > 0" class="screenshots-section">
            <h2 class="section-title">Capturas</h2>
            <div class="screenshots-grid">
              <img v-for="(ss, idx) in screenshots" :key="idx" :src="ss?.image" :alt="`Screenshot ${idx + 1}`" class="screenshot-img" @click="selectedScreenshot = ss?.image" />
            </div>
          </div>

          <ReviewSection :juego-id="juego.id" />
        </div>

        <div class="detail-sidebar">
          <div class="sidebar-card precio-card">
            <div v-if="deal" class="price-with-discount">
              <div class="discount-tag">-{{ deal.savings }}%</div>
              <div class="old-price-large">{{ formatCurrency(juego.precio) }}</div>
              <div class="sale-price-large">{{ formatCurrency(deal.salePrice) }}</div>
              <div class="store-label">Precio en {{ deal.storeName }}</div>
            </div>
            <div v-else class="precio-valor">{{ formatCurrency(juego.precio) }}</div>
            <button class="btn-cart" @click="addToCart" :disabled="cartLoading">
              <i v-if="cartLoading" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fas fa-shopping-cart"></i> {{ cartLoading ? 'Agregando...' : 'Agregar al Carrito' }}
            </button>
            <button class="btn-wish" @click="addToWishlist" :disabled="wishLoading">
              <i v-if="wishLoading" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fas fa-heart"></i> {{ wishLoading ? 'Agregando...' : 'Lista de Deseos' }}
            </button>
          </div>

          <div v-if="rawgData?.platforms?.length > 0" class="sidebar-card">
            <h3 class="sidebar-title">Plataformas</h3>
            <div class="platform-list">
              <span v-for="p in rawgData.platforms" :key="p.id" class="platform-item">
                <i class="fas fa-gamepad"></i> {{ p.name }}
              </span>
            </div>
          </div>

          <div v-if="rawgData?.genres?.length > 0" class="sidebar-card">
            <h3 class="sidebar-title">Géneros</h3>
            <div class="genre-tags">
              <span v-for="g in rawgData.genres" :key="g.id" class="genre-tag">{{ g.name }}</span>
            </div>
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
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import ReviewSection from '../components/game/ReviewSection.vue'
import { gameService } from '../services/game.service'
import { rawgService } from '../services/rawg.service'
import { wishlistService } from '../services/wishlist.service'
import { reviewService } from '../services/review.service'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useToast } from '../composables/useToast'
import { useCheapShark } from '../composables/useCheapShark'
import { formatCurrency, formatDate } from '../utils/format'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const toast = useToast()
const { getDeal } = useCheapShark()

const juego = ref(null)
const rawgData = ref(null)
const screenshots = ref([])
const promedioResenas = ref(0)
const loading = ref(true)
const selectedScreenshot = ref(null)
const deal = ref(null)
const cartLoading = ref(false)
const wishLoading = ref(false)

const heroImage = computed(() => {
  return rawgData.value?.background_image || juego.value?.imagenUrl || juego.value?.portadaUrl || juego.value?.background_image || ''
})

async function loadGame(gameId) {
  loading.value = true
  juego.value = null
  rawgData.value = null
  screenshots.value = []
  promedioResenas.value = 0
  deal.value = null
  const id = parseInt(gameId, 10)
  if (!id || isNaN(id)) {
    loading.value = false
    return
  }
  try {
    const gameRes = await gameService.getById(id)
    juego.value = gameRes.data

    const promRes = reviewService.getPromedio(juego.value.id)

    if (juego.value.rawgId) {
      const [rawgRes, promedio] = await Promise.all([
        rawgService.obtenerJuego(juego.value.rawgId),
        promRes,
      ])
      promedioResenas.value = promedio.data
      rawgData.value = rawgRes.data

      const ssRes = await rawgService.obtenerScreenshots(juego.value.rawgId)
      screenshots.value = ssRes.data.results || []
    } else {
      const [rawgSearch, promedio] = await Promise.all([
        rawgService.listarJuegos({ q: juego.value.titulo, pageSize: 5, searchExact: true }),
        promRes,
      ])
      promedioResenas.value = promedio.data

      if (rawgSearch.data.results && rawgSearch.data.results.length > 0) {
        const found = rawgSearch.data.results[0]
        rawgData.value = found

        const ssRes = await rawgService.obtenerScreenshots(found.id)
        screenshots.value = ssRes.data.results || []
      }
    }

    deal.value = await getDeal(juego.value.titulo)
  } catch (err) {
    console.error('Error loading game:', err)
    toast.show('Error al cargar el juego', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => loadGame(route.params.id))
watch(() => route.params.id, (newId) => loadGame(newId))

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
    toast.show(`"${juego.value.titulo}" agregado al carrito`, 'success')
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
    toast.show(`"${juego.value.titulo}" agregado a lista de deseos`, 'success')
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
.discount-badge-header {
  background: rgba(220,38,38,0.85) !important;
}
.discount-badge-header i { color: white !important; }

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
.precio-card { text-align: center; }
.precio-valor { font-size: 2rem; font-weight: 800; color: #ff6300; margin-bottom: 20px; }
.price-with-discount { margin-bottom: 20px; }
.discount-tag {
  display: inline-block; background: #dc2626; color: white;
  font-weight: 800; padding: 4px 14px; border-radius: 6px;
  font-size: 1.1em; margin-bottom: 10px;
}
.old-price-large {
  font-size: 1.2rem; color: #888; text-decoration: line-through;
  margin-bottom: 4px;
}
.sale-price-large {
  font-size: 2rem; font-weight: 800; color: #10b981;
}
.store-label { color: #888; font-size: 0.85em; margin-top: 4px; }
.genre-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.genre-tag { background: rgba(255,99,0,0.2); color: #ff6300; padding: 5px 14px; border-radius: 20px; font-size: 0.85em; font-weight: 600; }
.platform-list { display: flex; flex-direction: column; gap: 8px; }
.platform-item { color: #ccc; font-size: 0.9em; display: flex; align-items: center; gap: 8px; }
.platform-item i { color: #ff6300; width: 18px; }

.btn-cart, .btn-wish {
  width: 100%; padding: 14px; border: none; border-radius: 12px;
  font-size: 1em; font-weight: 700; cursor: pointer; transition: all 0.3s;
  display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 10px;
}
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
