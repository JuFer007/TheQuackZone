<template>
  <div class="pc-card">
    <div class="pc-card-img-wrap">
      <img :src="juego.background_image" :alt="juego.name" class="pc-card-img" />
      <div class="pc-card-actions">
        <template v-if="disponible">
          <button class="action-btn cart-btn" :disabled="cartLoading" @click.stop="addToCart" title="Agregar al carrito">
            <i v-if="cartLoading" class="fa-solid fa-spinner fa-spin"></i>
            <i v-else class="fa-solid fa-cart-plus"></i>
          </button>
          <button class="action-btn wish-btn" :disabled="wishLoading" @click.stop="addToWishlist" title="Agregar a deseos">
            <i v-if="wishLoading" class="fa-solid fa-spinner fa-spin"></i>
            <i v-else class="fa-solid fa-heart"></i>
          </button>
        </template>
        <button class="action-btn info-btn" @click.stop="$emit('show-info', juego)" title="Más información">
          <i class="fa-solid fa-circle-info"></i>
        </button>
      </div>
      <div v-if="juego.metacritic" class="meta-badge" :class="metaClass">{{ juego.metacritic }}</div>
      <div v-if="juego.esrb_rating" class="esrb-badge">{{ esrbLabel }}</div>
      <div v-if="disponible === false" class="no-disponible-badge">No disponible</div>
    </div>
    <div class="pc-card-body" @click="goToDetail">
      <h3 class="pc-card-title">{{ juego.name }}</h3>
      <div class="pc-card-genres">{{ genreList }}</div>
      <div class="pc-card-stats">
        <span class="stat" title="Rating">
          <i class="fa-solid fa-star"></i> {{ juego.rating.toFixed(1) }}
        </span>
        <span class="stat" title="Reseñas">
          <i class="fa-solid fa-comment"></i> {{ juego.reviews_count || juego.ratings_count || 0 }}
        </span>
        <span v-if="juego.playtime" class="stat" title="Horas de juego">
          <i class="fa-solid fa-clock"></i> {{ juego.playtime }}h
        </span>
      </div>
      <div v-if="juego.released" class="pc-card-date">
        <i class="fa-solid fa-calendar"></i> {{ formatDate(juego.released) }}
      </div>
      <div v-if="pcTags.length" class="pc-card-tags">
        <span v-for="t in pcTags" :key="t.id" class="pc-tag">{{ t.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useCartStore } from '../../stores/cart'
import { useToast } from '../../composables/useToast'
import { wishlistService } from '../../services/wishlist.service'
import { formatDate } from '../../utils/format'

const props = defineProps({ juego: Object, disponible: { type: Boolean, default: undefined } })
const emit = defineEmits(['show-info'])
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const toast = useToast()
const cartLoading = ref(false)
const wishLoading = ref(false)

const genreList = computed(() => {
  if (!props.juego.genres?.length) return '—'
  return props.juego.genres.map(g => g.name).join(', ')
})

const metaClass = computed(() => {
  const m = props.juego.metacritic
  if (!m) return ''
  if (m >= 75) return 'meta-high'
  if (m >= 50) return 'meta-mid'
  return 'meta-low'
})

const esrbLabel = computed(() => {
  const name = props.juego.esrb_rating?.name
  if (!name) return ''
  return name.replace(/[^A-Z0-9]/g, '')
})

const PC_TAG_IDS = new Set([
  31, 32, 33, 34, 35, 36, 37, 38,
  97, 98, 99, 100, 101, 102, 103,
  119, 120, 121, 122, 123, 124,
  158, 159, 160, 161, 162, 163, 164, 165,
  405, 406, 407, 408, 409, 410, 411, 412, 413,
])

const pcTags = computed(() => {
  if (!props.juego.tags?.length) return []
  return props.juego.tags.filter(t => PC_TAG_IDS.has(t.id)).slice(0, 4)
})

function goToDetail() {
  router.push(`/juego-rawg/${props.juego.id}`)
}

async function addToCart() {
  if (!authStore.isLoggedIn) {
    toast.show('Debes iniciar sesión', 'warning')
    return
  }
  if (authStore.esJuegoComprado(props.juego.id)) {
    toast.show('Ya tienes este juego', 'warning')
    return
  }
  cartLoading.value = true
  try {
    await cartStore.addGame(authStore.user.id, props.juego.id)
    toast.show(`"${props.juego.name}" agregado al carrito`, 'success')
  } catch {
    toast.show('Error al agregar al carrito', 'error')
  } finally {
    cartLoading.value = false
  }
}

async function addToWishlist() {
  if (!authStore.isLoggedIn) {
    toast.show('Debes iniciar sesión', 'warning')
    return
  }
  wishLoading.value = true
  try {
    await wishlistService.add(authStore.user.id, props.juego.id)
    toast.show(`"${props.juego.name}" agregado a deseos`, 'success')
  } catch {
    toast.show('Error al agregar a deseos', 'error')
  } finally {
    wishLoading.value = false
  }
}
</script>

<style scoped>
.pc-card {
  background: linear-gradient(145deg, #1e1e1e, #151515);
  border-radius: 12px; overflow: hidden; transition: all 0.3s ease;
  border: 1px solid #2a2a2a; display: flex; flex-direction: column;
  width: 100%; max-width: 420px;
}
.pc-card:hover { border-color: #ff6300; box-shadow: 0 8px 24px rgba(255,99,0,0.15); }
.pc-card-img-wrap {
  position: relative; width: 100%; padding-top: 52%;
  overflow: hidden; background: #111;
}
.pc-card-img {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; transition: transform 0.4s ease;
}
.pc-card:hover .pc-card-img { transform: scale(1.05); }
.pc-card-actions {
  position: absolute; top: 8px; right: 8px;
  display: flex; flex-direction: column; gap: 6px;
  opacity: 0; transition: opacity 0.3s; z-index: 2;
}
.pc-card:hover .pc-card-actions { opacity: 1; }
.action-btn {
  width: 32px; height: 32px; border-radius: 8px;
  border: none; background: rgba(0,0,0,0.8);
  color: white; font-size: 0.85rem; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}
.action-btn:hover { background: #ff6300; transform: scale(1.1); }
.meta-badge {
  position: absolute; top: 8px; left: 8px;
  padding: 3px 8px; border-radius: 6px;
  font-size: 0.8em; font-weight: 800; z-index: 2;
}
.meta-high { background: #4caf50; color: white; }
.meta-mid { background: #ff9800; color: #000; }
.meta-low { background: #dc2626; color: white; }
.esrb-badge {
  position: absolute; bottom: 6px; left: 6px;
  background: rgba(0,0,0,0.85); color: #fff;
  padding: 2px 7px; border-radius: 4px; font-size: 0.7em;
  font-weight: 700; letter-spacing: 0.5px; z-index: 2;
}
.no-disponible-badge {
  position: absolute; top: 8px; left: 8px;
  background: rgba(0,0,0,0.75); color: #888;
  padding: 4px 10px; border-radius: 6px; font-size: 0.7em;
  font-weight: 700; letter-spacing: 0.5px; z-index: 2;
  border: 1px solid #444;
}
.pc-card-body {
  padding: 12px; display: flex; flex-direction: column;
  gap: 6px; cursor: pointer;
}
.pc-card-title {
  font-size: 1em; font-weight: 700; color: white;
  line-height: 1.3; margin: 0;
}
.pc-card-genres {
  color: #ff6300; font-size: 0.75em; font-weight: 600;
}
.pc-card-stats {
  display: flex; gap: 12px; flex-wrap: wrap;
}
.stat {
  color: #aaa; font-size: 0.78em; display: flex;
  align-items: center; gap: 4px;
}
.stat i { color: #ff6300; font-size: 0.7em; }
.pc-card-date {
  color: #888; font-size: 0.75em; display: flex;
  align-items: center; gap: 5px;
}
.pc-card-date i { color: #888; font-size: 0.7em; }
.pc-card-tags {
  display: flex; flex-wrap: wrap; gap: 4px;
  margin-top: 2px;
}
.pc-tag {
  background: rgba(255,255,255,0.06);
  color: #999; padding: 2px 8px; border-radius: 4px;
  font-size: 0.65em; font-weight: 500;
  border: 1px solid rgba(255,255,255,0.08);
}
</style>
