<template>
  <DefaultLayout>
    <div>
      <h2 class="mt-[60px] mb-5 text-center font-gaming text-[22px] text-white">Juegos Populares</h2>
      <div v-if="popularesLoading" class="text-center text-[#888] py-10">Cargando juegos populares...</div>
      <div v-else-if="populares.length > 0" class="mb-16 overflow-x-auto" style="scrollbar-width: none;">
        <div class="min-w-max px-5">
          <GameCarousel :juegos="populares" @add-cart="addToCart" />
        </div>
      </div>
    </div>

    <section id="home" class="px-5 py-10 max-w-[1400px] mx-auto">
      <div v-if="loading" class="text-center py-20">
        <i class="fa-solid fa-spinner fa-spin text-4xl text-[#ff6300]"></i>
      </div>

      <div v-else>
        <div v-for="(games, cat) in groupedGames" :key="cat" class="mb-14">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-gaming text-white">{{ cat }}</h2>
            <div class="flex gap-2">
              <button class="nav-arrow" title="Anterior" @click="scrollCategory(cat, -1)">
                <i class="fa-solid fa-chevron-left"></i>
              </button>
              <button class="nav-arrow" title="Siguiente" @click="scrollCategory(cat, 1)">
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
          <div class="scroll-wrap">
            <div :ref="el => { if (el) categoryRefs[cat] = el }" class="scroll-container">
              <GameCard
                v-for="juego in games"
                :key="juego.id"
                :juego="juego"
                @show-detail="openGameModal"
                @add-cart="addToCart"
                @add-wishlist="addToWishlist"
              />
            </div>
          </div>
        </div>

        <div v-if="Object.keys(groupedGames).length === 0" class="text-center py-20 text-[#888]">
          <i class="fa-solid fa-gamepad text-3xl mb-4"></i>
          <p>No hay juegos disponibles</p>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import GameCard from '../components/game/GameCard.vue'
import GameCarousel from '../components/game/GameCarousel.vue'
import { gameService } from '../services/game.service'
import { wishlistService } from '../services/wishlist.service'
import { cheapsharkService } from '../services/cheapshark.service'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useToast } from '../composables/useToast'

const authStore = useAuthStore()
const cartStore = useCartStore()
const toast = useToast()
const openGameModal = inject('openGameModal')

const juegos = ref([])
const populares = ref([])
const loading = ref(true)
const popularesLoading = ref(true)
const categoryRefs = ref({})
const dealsMap = ref({})
const loadingGames = ref(new Set())

const popularesIds = computed(() => new Set(populares.value.map(j => j.id)))

function interleaveDeals(games) {
  const withDeal = []
  const without = []
  for (const j of games) {
    if (dealsMap.value[j.titulo]) withDeal.push(j)
    else without.push(j)
  }
  const result = []
  let i = 0, j = 0
  while (i < withDeal.length || j < without.length) {
    if (i < withDeal.length) result.push(withDeal[i++])
    if (j < without.length) result.push(without[j++])
  }
  return result
}

const groupedGames = computed(() => {
  const groups = {}
  for (const j of juegos.value) {
    const cat = j.categoria || 'Otros'
    if (popularesIds.value.has(j.id)) continue
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(j)
  }
  for (const cat of Object.keys(groups)) {
    groups[cat] = interleaveDeals(groups[cat])
  }
  return groups
})

function scrollCategory(cat, direction) {
  const el = categoryRefs.value[cat]
  if (!el) return
  const scrollAmount = el.clientWidth * 0.7
  el.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' })
}

function addToCart(juego) {
  if (!authStore.isLoggedIn) {
    toast.show('Debes iniciar sesión para agregar al carrito', 'warning')
    return
  }
  if (authStore.esJuegoComprado(juego.id)) {
    toast.show('Ya tienes este juego en tu biblioteca', 'warning')
    return
  }
  if (loadingGames.value.has(`cart-${juego.id}`)) return
  loadingGames.value.add(`cart-${juego.id}`)
  cartStore.addGame(authStore.user.id, juego.id)
    .then(() => toast.show(`"${juego.titulo}" agregado al carrito`, 'success'))
    .catch(() => toast.show('Error al agregar al carrito', 'error'))
    .finally(() => loadingGames.value.delete(`cart-${juego.id}`))
}

async function addToWishlist(juego) {
  if (!authStore.isLoggedIn) {
    toast.show('Debes iniciar sesión para agregar a deseos', 'warning')
    return
  }
  if (loadingGames.value.has(`wish-${juego.id}`)) return
  loadingGames.value.add(`wish-${juego.id}`)
  try {
    await wishlistService.add(authStore.user.id, juego.id)
    toast.show(`"${juego.titulo}" agregado a lista de deseos`, 'success')
  } catch {
    toast.show('Error al agregar a lista de deseos', 'error')
  } finally {
    loadingGames.value.delete(`wish-${juego.id}`)
  }
}

onMounted(async () => {
  try {
    const [popRes, allRes] = await Promise.all([
      gameService.getBySection('populares'),
      gameService.getAll(),
    ])
    populares.value = popRes.data
    juegos.value = allRes.data
    cheapsharkService.getBatchDeals(juegos.value.map(j => j.titulo)).then((res) => {
      dealsMap.value = res
    }).catch(() => {})
  } catch (err) {
    console.error('Error loading games:', err)
    toast.show('Error al cargar juegos', 'error')
  } finally {
    popularesLoading.value = false
    loading.value = false
  }
})
</script>

<style scoped>
.nav-arrow {
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  color: white; font-size: 0.85rem; cursor: pointer; transition: all 0.3s;
  display: flex; align-items: center; justify-content: center;
}
.nav-arrow:hover { background: #ff6300; border-color: #ff6300; transform: scale(1.1); }
.scroll-wrap { position: relative; }
.scroll-container {
  display: flex; gap: 20px; overflow-x: auto; padding: 10px 0 20px;
  scroll-behavior: smooth; scrollbar-width: none; -ms-overflow-style: none;
}
.scroll-container::-webkit-scrollbar { display: none; }
</style>
