<template>
  <DefaultLayout>
    <section class="pc-page">
      <!-- Header -->
      <div class="pc-header">
        <div class="pc-header-left">
          <div class="pc-header-icon"><i class="fa-solid fa-desktop"></i></div>
          <div>
            <h1 class="pc-header-title">PC</h1>
            <p class="pc-header-sub">Catálogo técnico de juegos para PC</p>
          </div>
        </div>
        <div v-if="!loading && !error" class="pc-header-stats">
          <div class="pc-stat">
            <span class="pc-stat-value">{{ totalCount }}</span>
            <span class="pc-stat-label">juegos</span>
          </div>
          <div class="pc-stat">
            <span class="pc-stat-value">{{ avgRating.toFixed(1) }}</span>
            <span class="pc-stat-label">rating promedio</span>
          </div>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="pc-filters">
        <div class="pc-filter-group">
          <div class="pc-search-wrap">
            <i class="fa-solid fa-search pc-search-icon"></i>
            <input v-model.trim="filters.search" type="text" class="pc-search-input" placeholder="Buscar en PC..." @input="onFilterChange" />
          </div>
          <select v-model="filters.genre" class="pc-select" @change="onFilterChange">
            <option value="">Todos los géneros</option>
            <option v-for="g in genres" :key="g.id" :value="g.id">{{ g.name }}</option>
          </select>
          <select v-model="filters.sort" class="pc-select" @change="onFilterChange">
            <option value="-added">Más añadidos</option>
            <option value="-rating">Mejor rating</option>
            <option value="-released">Más recientes</option>
            <option value="name">A-Z</option>
          </select>
          <select v-model="filters.metacritic" class="pc-select" @change="onFilterChange">
            <option value="">Metacritic: todos</option>
            <option value="90,100">90-100</option>
            <option value="75,89">75-89</option>
            <option value="50,74">50-74</option>
            <option value="0,49">0-49</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="pc-grid">
        <div v-for="n in 8" :key="n" class="pc-skeleton">
          <div class="sk-img"></div>
          <div class="sk-body">
            <div class="sk-line w-75"></div>
            <div class="sk-line w-50"></div>
            <div class="sk-line w-60"></div>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="pc-error">
        <i class="fa-solid fa-exclamation-triangle"></i>
        <p>{{ error }}</p>
        <button class="pc-retry-btn" @click="cargarInicial">Reintentar</button>
      </div>

      <!-- Empty -->
      <div v-else-if="games.length === 0" class="pc-empty">
        <i class="fa-solid fa-gamepad"></i>
        <p>No se encontraron juegos con estos filtros</p>
        <button class="pc-retry-btn" @click="resetFilters">Limpiar filtros</button>
      </div>

      <!-- Grid -->
      <TransitionGroup v-else name="fade" tag="div" class="pc-grid">
        <RawgCardPC v-for="game in games" :key="game.id" :juego="game" :disponible="disponibles[game.id]" @show-info="openInfo" />
      </TransitionGroup>

      <!-- Load More -->
      <div v-if="hasMore && !loading" class="pc-load-more-wrap">
        <button class="pc-load-more" :disabled="loadingMore" @click="cargarMas">
          <i v-if="loadingMore" class="fa-solid fa-spinner fa-spin"></i>
          {{ loadingMore ? 'Cargando...' : 'Cargar más juegos' }}
        </button>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, reactive, inject, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import RawgCardPC from '../components/game/RawgCardPC.vue'
import { rawgService } from '../services/rawg.service'
import { gameService } from '../services/game.service'

const route = useRoute()
const openRawgGameModal = inject('openRawgGameModal')

const PLATFORM_ID = '4'
const PAGE_SIZE = 24

const games = ref([])
const genres = ref([])
const loading = ref(true)
const error = ref(null)
const loadingMore = ref(false)
const currentPage = ref(1)
const totalCount = ref(0)
const hasMore = ref(true)
const disponibles = reactive({})

const filters = ref({
  search: '',
  genre: '',
  sort: '-added',
  metacritic: '',
})

const allGames = ref([])
const initialLoadDone = ref(false)

const avgRating = computed(() => {
  if (allGames.value.length === 0) return 0
  const sum = allGames.value.reduce((a, g) => a + g.rating, 0)
  return sum / allGames.value.length
})

let filterTimeout = null

function onFilterChange() {
  clearTimeout(filterTimeout)
  filterTimeout = setTimeout(() => {
    cargarInicial()
  }, 400)
}

function openInfo(juego) {
  openRawgGameModal(juego)
}

function getFilterParams() {
  const params = {
    pageSize: PAGE_SIZE,
    platforms: PLATFORM_ID,
  }
  if (filters.value.search) params.q = filters.value.search
  if (filters.value.genre) params.genres = filters.value.genre
  if (filters.value.sort) params.ordering = filters.value.sort
  if (filters.value.metacritic) {
    const [min, max] = filters.value.metacritic.split(',')
    params.metacritic = `${min},${max}`
  }
  return params
}

async function verificarDisponibles() {
  const rawgIds = games.value.map(g => g.id).filter(id => disponibles[id] === undefined)
  if (rawgIds.length === 0) return
  try {
    const res = await gameService.checkRawgExistsBatch(rawgIds)
    for (const [id, exists] of Object.entries(res.data)) {
      disponibles[Number(id)] = exists
    }
  } catch { /* ignore */ }
}

async function cargarInicial() {
  loading.value = true
  error.value = null
  games.value = []
  allGames.value = []
  currentPage.value = 1
  hasMore.value = true
  try {
    const params = { ...getFilterParams(), page: 1 }
    const res = await rawgService.listarJuegos(params)
    games.value = res.data.results || []
    allGames.value = [...games.value]
    totalCount.value = res.data.count || 0
    hasMore.value = !!res.data.next
    currentPage.value = 1
    await verificarDisponibles()
  } catch (err) {
    console.error('Error loading PC games:', err)
    error.value = 'Error al cargar juegos de PC'
  } finally {
    loading.value = false
  }
}

async function cargarMas() {
  if (loadingMore.value || !hasMore.value) return
  loadingMore.value = true
  try {
    const nextPage = currentPage.value + 1
    const params = { ...getFilterParams(), page: nextPage }
    const res = await rawgService.listarJuegos(params)
    const newGames = res.data.results || []
    games.value = [...games.value, ...newGames]
    allGames.value = [...allGames.value, ...newGames]
    hasMore.value = !!res.data.next
    currentPage.value = nextPage
    await verificarDisponibles()
  } catch (err) {
    console.error('Error loading more PC games:', err)
  } finally {
    loadingMore.value = false
  }
}

function resetFilters() {
  filters.value = { search: '', genre: '', sort: '-added', metacritic: '' }
  cargarInicial()
}

onMounted(async () => {
  try {
    const genreRes = await rawgService.listarGeneros()
    genres.value = genreRes.data.results || []
  } catch { /* ignore */ }
  cargarInicial()
})

watch(() => route.params.tipo, () => {
  if (route.params.tipo === 'pc') cargarInicial()
})
</script>

<style scoped>
.pc-page {
  max-width: 1200px; margin: 0 auto; padding: 24px 20px 60px;
}
.pc-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: 24px; gap: 20px; flex-wrap: wrap;
}
.pc-header-left { display: flex; align-items: center; gap: 16px; }
.pc-header-icon {
  width: 56px; height: 56px; border-radius: 16px;
  background: linear-gradient(135deg, #ff6300, #ff8c00);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.6rem; color: #000; flex-shrink: 0;
}
.pc-header-title {
  font-family: 'Audiowide', cursive; font-size: 2em;
  color: white; margin: 0; line-height: 1.1;
}
.pc-header-sub { color: #888; font-size: 0.85em; margin: 2px 0 0; }
.pc-header-stats { display: flex; gap: 20px; }
.pc-stat { text-align: center; }
.pc-stat-value {
  display: block; font-size: 1.4em; font-weight: 800;
  color: #ff6300; line-height: 1;
}
.pc-stat-label { color: #666; font-size: 0.7em; text-transform: uppercase; letter-spacing: 1px; }

.pc-filters {
  background: #1a1a1a; border-radius: 12px; padding: 12px 16px;
  margin-bottom: 24px; border: 1px solid #2a2a2a;
}
.pc-filter-group {
  display: flex; gap: 10px; flex-wrap: wrap;
}
.pc-search-wrap {
  position: relative; flex: 1; min-width: 180px;
}
.pc-search-icon {
  position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
  color: #666; font-size: 0.85em;
}
.pc-search-input {
  width: 100%; padding: 10px 12px 10px 36px;
  background: #252525; border: 1px solid #333;
  border-radius: 8px; color: white; font-size: 0.9em;
  outline: none; transition: border 0.2s;
}
.pc-search-input:focus { border-color: #ff6300; }
.pc-select {
  padding: 10px 12px; background: #252525; border: 1px solid #333;
  border-radius: 8px; color: #ccc; font-size: 0.85em;
  outline: none; cursor: pointer; min-width: 140px;
}
.pc-select:focus { border-color: #ff6300; }
.pc-select option { background: #1a1a1a; color: #ccc; }

.pc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.pc-skeleton {
  background: #1a1a1a; border-radius: 12px; overflow: hidden;
  border: 1px solid #252525;
}
.sk-img { width: 100%; padding-top: 52%; background: #252525; animation: pulse 1.5s infinite; }
.sk-body { padding: 12px; display: flex; flex-direction: column; gap: 8px; }
.sk-line { height: 14px; background: #252525; border-radius: 4px; animation: pulse 1.5s infinite; }
.w-75 { width: 75%; }
.w-50 { width: 50%; }
.w-60 { width: 60%; }
@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }

.pc-error, .pc-empty {
  text-align: center; padding: 60px 20px; color: #888;
}
.pc-error i, .pc-empty i { font-size: 2.5em; color: #ff6300; margin-bottom: 16px; }
.pc-retry-btn {
  margin-top: 16px; padding: 10px 24px;
  background: #ff6300; color: #000; border: none;
  border-radius: 8px; font-weight: 700; cursor: pointer;
  font-size: 0.9em;
}
.pc-load-more-wrap { text-align: center; padding: 32px 0; }
.pc-load-more {
  padding: 14px 40px; background: transparent;
  border: 2px solid #ff6300; color: #ff6300;
  border-radius: 10px; font-size: 1em; font-weight: 700;
  cursor: pointer; transition: all 0.3s;
}
.pc-load-more:hover { background: #ff6300; color: #000; }
.pc-load-more:disabled { opacity: 0.5; cursor: default; }

.fade-enter-active { transition: all 0.4s ease; }
.fade-enter-from { opacity: 0; transform: translateY(12px); }

@media (max-width: 768px) {
  .pc-header { flex-direction: column; align-items: stretch; }
  .pc-header-stats { justify-content: center; }
  .pc-grid { grid-template-columns: 1fr; }
  .pc-filter-group { flex-direction: column; }
  .pc-select { min-width: auto; }
}
</style>
