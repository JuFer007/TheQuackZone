<template>
  <DefaultLayout>
    <section class="ps5-page">
      <!-- Hero Carousel -->
      <div v-if="!loading && heroGames.length > 0" class="ps5-hero-carousel">
        <Transition name="hero-fade" mode="out-in">
          <div
            :key="currentHeroIndex"
            class="ps5-hero-slide"
            :style="{ backgroundImage: `url(${heroGames[currentHeroIndex].background_image})` }"
          >
            <div class="ps5-hero-overlay">
              <div class="ps5-hero-content">
                <div class="ps5-hero-badge">DESTACADO</div>
                <h1 class="ps5-hero-title">{{ heroGames[currentHeroIndex].name }}</h1>
                <div class="ps5-hero-meta">
                  <span class="ps5-hero-rating">
                    <i class="fa-solid fa-star"></i> {{ heroGames[currentHeroIndex].rating.toFixed(1) }}
                  </span>
                  <span v-if="heroGames[currentHeroIndex].released" class="ps5-hero-year">
                    <i class="fa-solid fa-calendar"></i> {{ heroGames[currentHeroIndex].released.slice(0, 4) }}
                  </span>
                  <span v-if="heroGames[currentHeroIndex].metacritic" class="ps5-hero-meta-score" :class="{ 'hero-high': heroGames[currentHeroIndex].metacritic >= 75 }">
                    MC {{ heroGames[currentHeroIndex].metacritic }}
                  </span>
                </div>
                <div class="ps5-hero-genres">
                  <span v-for="g in heroGames[currentHeroIndex].genres?.slice(0, 3)" :key="g.id" class="ps5-hero-genre-tag">{{ g.name }}</span>
                </div>
                <button class="ps5-hero-btn" @click="goToDetail(heroGames[currentHeroIndex])">
                  <i class="fa-solid fa-eye"></i> Ver detalle
                </button>
              </div>
            </div>
          </div>
        </Transition>
        <div class="ps5-hero-dots">
          <button
            v-for="(_, idx) in heroGames"
            :key="idx"
            class="ps5-hero-dot"
            :class="{ active: idx === currentHeroIndex }"
            @click="currentHeroIndex = idx"
          ></button>
        </div>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="ps5-loading">
        <div class="ps5-skeleton-hero"></div>
        <div class="ps5-skeleton-sections">
          <div v-for="n in 3" :key="n" class="ps5-skeleton-section">
            <div class="sk-section-title"></div>
            <div class="sk-carousel">
              <div v-for="m in 5" :key="m" class="sk-card"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="ps5-error">
        <i class="fa-solid fa-exclamation-triangle"></i>
        <p>{{ error }}</p>
        <button class="ps5-retry" @click="cargarJuegos">Reintentar</button>
      </div>

      <!-- Genre sections -->
      <div v-else class="ps5-sections">
        <div v-for="section in genreSections" :key="section.slug" class="ps5-section">
          <div class="ps5-section-header">
            <div class="ps5-section-title-wrap">
              <i :class="section.icon" class="ps5-section-icon"></i>
              <h2 class="ps5-section-title">{{ section.name }}</h2>
            </div>
            <button v-if="section.games.length > VISIBLE_PER_SECTION" class="ps5-section-toggle" @click="section.expanded = !section.expanded">
              {{ section.expanded ? 'Ver menos' : `Ver todos (${section.games.length})` }}
              <i class="fa-solid" :class="section.expanded ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
            </button>
          </div>
          <div class="ps5-carousel-wrap">
            <div :ref="el => { if (el) sectionRefs[section.slug] = el }" class="ps5-carousel" :class="{ expanded: section.expanded }">
              <RawgCardPS5
                v-for="game in (section.expanded ? section.games : section.games.slice(0, VISIBLE_PER_SECTION))"
                :key="game.id"
                :juego="game"
                :disponible="disponibles[game.id]"
                @show-info="openInfo"
              />
            </div>
            <button v-if="!section.expanded && section.games.length > VISIBLE_PER_SECTION" class="ps5-scroll-btn ps5-scroll-left" @click="scrollSection(section.slug, -1)">
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <button v-if="!section.expanded && section.games.length > VISIBLE_PER_SECTION" class="ps5-scroll-btn ps5-scroll-right" @click="scrollSection(section.slug, 1)">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div v-if="noGenreGames.length > 0" class="ps5-section">
          <div class="ps5-section-header">
            <div class="ps5-section-title-wrap">
              <i class="fa-solid fa-layer-group ps5-section-icon"></i>
              <h2 class="ps5-section-title">Otros</h2>
            </div>
          </div>
          <div class="ps5-carousel-wrap">
            <div class="ps5-carousel">
              <RawgCardPS5
                v-for="game in noGenreGames"
                :key="game.id"
                :juego="game"
                :disponible="disponibles[game.id]"
                @show-info="openInfo"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup>
import { ref, reactive, computed, inject, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import RawgCardPS5 from '../components/game/RawgCardPS5.vue'
import { rawgService } from '../services/rawg.service'
import { gameService } from '../services/game.service'

const route = useRoute()
const router = useRouter()
const openRawgGameModal = inject('openRawgGameModal')

const PLATFORM_ID = '187'

const games = ref([])
const genres = ref([])
const loading = ref(true)
const error = ref(null)
const sectionRefs = ref({})
const currentHeroIndex = ref(0)
let heroInterval = null
const VISIBLE_PER_SECTION = 8
const disponibles = reactive({})

const MAIN_GENRES = [
  { slug: 'action', name: 'Acción', icon: 'fa-solid fa-bolt' },
  { slug: 'role-playing-games-rpg', name: 'RPG', icon: 'fa-solid fa-hat-wizard' },
  { slug: 'adventure', name: 'Aventura', icon: 'fa-solid fa-compass' },
  { slug: 'shooter', name: 'Shooter', icon: 'fa-solid fa-crosshairs' },
  { slug: 'sports', name: 'Deportes', icon: 'fa-solid fa-futbol' },
]

const genreSections = ref([])
const noGenreGames = ref([])
const heroGames = ref([])

function openInfo(juego) {
  openRawgGameModal(juego)
}

function goToDetail(juego) {
  router.push(`/juego-rawg/${juego.id}`)
}

function scrollSection(slug, dir) {
  const el = sectionRefs.value[slug]
  if (!el) return
  const cardWidth = 300
  el.scrollBy({ left: cardWidth * 4 * dir, behavior: 'smooth' })
}

function startHeroRotation() {
  stopHeroRotation()
  if (heroGames.value.length < 2) return
  heroInterval = setInterval(() => {
    currentHeroIndex.value = (currentHeroIndex.value + 1) % heroGames.value.length
  }, 5000)
}

function stopHeroRotation() {
  if (heroInterval) {
    clearInterval(heroInterval)
    heroInterval = null
  }
}

async function cargarJuegos() {
  loading.value = true
  error.value = null
  games.value = []
  genreSections.value = []
  noGenreGames.value = []
  heroGames.value = []
  currentHeroIndex.value = 0

  try {
    const [gamesRes, genreRes] = await Promise.all([
      rawgService.listarJuegos({ pageSize: 40, platforms: PLATFORM_ID, ordering: '-added' }),
      rawgService.listarGeneros(),
    ])
    genres.value = genreRes.data.results || []
    games.value = gamesRes.data.results || []
  } catch (err) {
    console.error('Error loading PS5 games:', err)
    error.value = 'Error al cargar juegos de PlayStation 5'
    loading.value = false
    return
  }

  if (games.value.length === 0) {
    loading.value = false
    return
  }

  const sections = MAIN_GENRES.map(mg => {
    const genreInfo = genres.value.find(g => g.slug === mg.slug)
    if (!genreInfo) return null
    const matching = games.value.filter(g =>
      g.genres?.some(gg => gg.id === genreInfo.id)
    )
    if (matching.length === 0) return null
    return {
      ...mg,
      id: genreInfo.id,
      games: matching,
      expanded: false,
    }
  }).filter(Boolean)

  const usedIds = new Set()
  sections.forEach(s => s.games.forEach(g => usedIds.add(g.id)))

  const remaining = games.value.filter(g => !usedIds.has(g.id))
  const assignedRemaining = new Set()
  sections.forEach(s => {
    const needed = Math.min(8 - s.games.length, remaining.filter(g => !assignedRemaining.has(g.id)).length)
    let count = 0
    for (const g of remaining) {
      if (count >= needed) break
      if (!assignedRemaining.has(g.id)) {
        s.games.push(g)
        assignedRemaining.add(g.id)
        count++
      }
    }
  })

  const allAssigned = new Set()
  sections.forEach(s => s.games.forEach(g => allAssigned.add(g.id)))
  noGenreGames.value = games.value.filter(g => !allAssigned.has(g.id))

  genreSections.value = sections

  heroGames.value = [...games.value].sort((a, b) => b.rating - a.rating).slice(0, 5)

  await verificarDisponibles()
  loading.value = false
  startHeroRotation()
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

onMounted(cargarJuegos)
onUnmounted(stopHeroRotation)

watch(() => route.params.tipo, () => {
  if (route.params.tipo === 'ps5') {
    cargarJuegos()
  }
})
</script>

<style scoped>
.ps5-page {
  max-width: 1400px; margin: 0 auto; padding: 0 20px 60px;
}

/* Hero Carousel */
.ps5-hero-carousel {
  position: relative; height: 480px; border-radius: 0 0 30px 30px;
  margin: 0 -20px 40px; overflow: hidden;
}
.ps5-hero-slide {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
}
.ps5-hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(10,10,10,0.95) 20%, rgba(10,10,10,0.3) 60%, rgba(10,10,10,0.1) 100%);
  display: flex; align-items: flex-end; padding: 48px;
}
.ps5-hero-content { max-width: 700px; }
.ps5-hero-badge {
  display: inline-block; background: rgba(255,99,0,0.25);
  border: 1px solid rgba(255,99,0,0.5); backdrop-filter: blur(8px);
  color: #ff6300; padding: 4px 14px; border-radius: 20px;
  font-size: 0.75em; font-weight: 700; letter-spacing: 2px;
  margin-bottom: 12px;
}
.ps5-hero-title {
  font-family: 'Audiowide', cursive; font-size: 3em;
  color: white; margin: 0 0 16px; line-height: 1.1;
  text-shadow: 0 2px 20px rgba(0,0,0,0.5);
}
.ps5-hero-meta { display: flex; gap: 16px; margin-bottom: 14px; flex-wrap: wrap; }
.ps5-hero-rating, .ps5-hero-year, .ps5-hero-meta-score {
  color: rgba(255,255,255,0.8); font-size: 0.95em;
  font-weight: 600; display: flex; align-items: center; gap: 6px;
}
.ps5-hero-rating i { color: #ffc107; }
.ps5-hero-year i { color: #888; }
.hero-high { color: #4caf50; }
.ps5-hero-genres { display: flex; gap: 8px; margin-bottom: 20px; }
.ps5-hero-genre-tag {
  background: rgba(255,255,255,0.1); backdrop-filter: blur(4px);
  color: #ccc; padding: 4px 12px; border-radius: 20px;
  font-size: 0.8em; font-weight: 500;
}
.ps5-hero-btn {
  padding: 14px 32px; background: linear-gradient(135deg, #ff6300, #e55a00);
  color: #000; border: none; border-radius: 12px;
  font-size: 1em; font-weight: 700; cursor: pointer;
  transition: all 0.3s; display: inline-flex; align-items: center; gap: 8px;
}
.ps5-hero-btn:hover { transform: scale(1.05); box-shadow: 0 8px 24px rgba(255,99,0,0.4); }
.ps5-hero-dots {
  position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 10px; z-index: 3;
}
.ps5-hero-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: rgba(255,255,255,0.3); border: none;
  cursor: pointer; transition: all 0.3s; padding: 0;
}
.ps5-hero-dot.active {
  background: #ff6300; width: 28px; border-radius: 6px;
}

.hero-fade-enter-active { transition: opacity 0.6s ease; }
.hero-fade-leave-active { transition: opacity 0.6s ease; }
.hero-fade-enter-from { opacity: 0; }
.hero-fade-leave-to { opacity: 0; }

/* Sections */
.ps5-sections { display: flex; flex-direction: column; gap: 40px; }
.ps5-section-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 16px;
}
.ps5-section-title-wrap { display: flex; align-items: center; gap: 10px; }
.ps5-section-icon { color: #ff6300; font-size: 1.2em; }
.ps5-section-title {
  font-family: 'Audiowide', cursive; font-size: 1.4em;
  color: white; margin: 0;
}
.ps5-section-toggle {
  background: none; border: 1px solid rgba(255,255,255,0.1);
  color: #ff6300; padding: 6px 14px; border-radius: 8px;
  font-size: 0.8em; cursor: pointer; display: flex; align-items: center; gap: 6px;
  transition: all 0.2s;
}
.ps5-section-toggle:hover { background: rgba(255,99,0,0.1); border-color: #ff6300; }
.ps5-carousel-wrap { position: relative; }
.ps5-carousel {
  display: flex; gap: 16px; overflow-x: auto; padding: 8px 0 16px;
  scroll-behavior: smooth; scrollbar-width: none;
}
.ps5-carousel::-webkit-scrollbar { display: none; }
.ps5-carousel.expanded {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  overflow-x: visible;
}
.ps5-scroll-btn {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.1);
  color: white; font-size: 1em; cursor: pointer; z-index: 5;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s; opacity: 0;
}
.ps5-carousel-wrap:hover .ps5-scroll-btn { opacity: 1; }
.ps5-scroll-btn:hover { background: #ff6300; }
.ps5-scroll-left { left: -14px; }
.ps5-scroll-right { right: -14px; }

/* Loading */
.ps5-loading { padding: 20px 0; }
.ps5-skeleton-hero {
  height: 400px; border-radius: 30px;
  background: #1a1a1a; margin-bottom: 40px; animation: pulse 1.5s infinite;
}
.ps5-skeleton-sections { display: flex; flex-direction: column; gap: 40px; }
.sk-section-title { width: 200px; height: 24px; background: #1a1a1a; border-radius: 6px; margin-bottom: 16px; animation: pulse 1.5s infinite; }
.sk-carousel { display: flex; gap: 16px; }
.sk-card {
  width: 280px; height: 380px; border-radius: 16px;
  background: #1a1a1a; flex-shrink: 0; animation: pulse 1.5s infinite;
}
@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.7; } }

.ps5-error { text-align: center; padding: 80px 20px; color: #888; }
.ps5-error i { font-size: 2.5em; color: #ff6300; margin-bottom: 16px; }
.ps5-retry {
  margin-top: 16px; padding: 10px 24px;
  background: #ff6300; color: #000; border: none;
  border-radius: 8px; font-weight: 700; cursor: pointer;
}

@media (max-width: 768px) {
  .ps5-hero-carousel { height: 360px; margin: 0 -20px 24px; }
  .ps5-hero-overlay { padding: 24px; }
  .ps5-hero-title { font-size: 1.8em; }
  .ps5-hero-btn { width: 100%; justify-content: center; }
  .ps5-carousel.expanded { grid-template-columns: 1fr 1fr; }
  .ps5-scroll-btn { display: none !important; }
}
</style>
