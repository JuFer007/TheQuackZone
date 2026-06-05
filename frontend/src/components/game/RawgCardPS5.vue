<template>
  <div class="ps5-card" @click="goToDetail">
    <div class="ps5-card-img-wrap">
      <img :src="juego.background_image" :alt="juego.name" class="ps5-card-img" />
      <div class="ps5-card-gradient"></div>
      <div v-if="juego.clip" class="clip-indicator" title="Tiene vídeo">
        <i class="fa-solid fa-play"></i>
      </div>
      <div v-if="juego.released" class="ps5-date-badge">{{ yearLabel }}</div>
      <div v-if="disponible === false" class="ps5-no-disp">No disponible</div>
      <div class="ps5-card-rating">
        <span v-for="i in 5" :key="i" class="ps5-star" :class="{ filled: i <= filledStars }">★</span>
      </div>
      <button class="ps5-info-btn" @click.stop="$emit('show-info', juego)" title="Más información">
        <i class="fa-solid fa-circle-info"></i>
      </button>
    </div>
    <div class="ps5-card-body">
      <h3 class="ps5-card-title">{{ juego.name }}</h3>
      <div class="ps5-card-genre">{{ genreList }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({ juego: Object, disponible: { type: Boolean, default: undefined } })
const emit = defineEmits(['show-info'])
const router = useRouter()

const genreList = computed(() => {
  if (!props.juego.genres?.length) return '—'
  return props.juego.genres.slice(0, 2).map(g => g.name).join(', ')
})

const filledStars = computed(() => Math.round(props.juego.rating))

const yearLabel = computed(() => {
  if (!props.juego.released) return ''
  return props.juego.released.slice(0, 4)
})

function goToDetail() {
  router.push(`/juego-rawg/${props.juego.id}`)
}
</script>

<style scoped>
.ps5-card {
  position: relative;
  background: linear-gradient(145deg, #1e1e1e, #151515);
  border-radius: 16px; overflow: hidden; transition: all 0.4s ease;
  cursor: pointer; width: 100%; max-width: 320px;
  border: 1px solid rgba(255,255,255,0.06);
}
.ps5-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(255,99,0,0.2);
  border-color: rgba(255,99,0,0.3);
}
.ps5-card-img-wrap {
  position: relative; width: 100%; padding-top: 62%;
  overflow: hidden; background: #111;
}
.ps5-card-img {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; transition: transform 0.5s ease;
}
.ps5-card:hover .ps5-card-img { transform: scale(1.08); }
.ps5-no-disp {
  position: absolute; top: 10px; left: 50%; transform: translateX(-50%);
  background: rgba(0,0,0,0.75); color: #888; padding: 3px 10px;
  border-radius: 12px; font-size: 0.65em; font-weight: 700;
  border: 1px solid #444; z-index: 3; white-space: nowrap;
}
.ps5-card-gradient {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(10,10,10,0.95) 20%, transparent 60%);
  z-index: 1;
}
.clip-indicator {
  position: absolute; top: 10px; right: 10px;
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(0,0,0,0.7); border: 2px solid rgba(255,255,255,0.2);
  color: white; display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; z-index: 3; backdrop-filter: blur(4px);
}
.ps5-date-badge {
  position: absolute; top: 10px; left: 10px;
  background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
  color: #ff8c42; padding: 3px 10px; border-radius: 20px;
  font-size: 0.75em; font-weight: 700; z-index: 3;
  border: 1px solid rgba(255,99,0,0.2);
}
.ps5-card-rating {
  position: absolute; bottom: 12px; left: 50%;
  transform: translateX(-50%);
  display: flex; gap: 3px; z-index: 3;
}
.ps5-star { color: rgba(255,255,255,0.2); font-size: 1.1em; }
.ps5-star.filled { color: #ffc107; text-shadow: 0 0 8px rgba(255,193,7,0.5); }
.ps5-info-btn {
  position: absolute; bottom: 50px; right: 10px;
  width: 30px; height: 30px; border-radius: 50%;
  background: rgba(0,0,0,0.6); border: none;
  color: white; font-size: 0.9em; cursor: pointer; z-index: 3;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: all 0.3s;
}
.ps5-card:hover .ps5-info-btn { opacity: 1; }
.ps5-info-btn:hover { background: #ff6300; transform: scale(1.15); }
.ps5-card-body {
  padding: 14px; display: flex; flex-direction: column;
  gap: 4px;
}
.ps5-card-title {
  font-size: 1em; font-weight: 700; color: white;
  line-height: 1.3; margin: 0;
}
.ps5-card-genre {
  color: #ff8c42; font-size: 0.75em; font-weight: 500;
  opacity: 0.8;
}
</style>
