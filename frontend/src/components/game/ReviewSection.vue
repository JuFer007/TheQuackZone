<template>
  <div class="review-section">
    <h3 class="section-title">
      <i class="fa-solid fa-star"></i> Reseñas
      <span class="review-count">({{ reviews.length }})</span>
      <span v-if="promedio > 0" class="avg-rating">
        {{ promedio.toFixed(1) }} / 5
      </span>
    </h3>

    <div v-if="authStore.isLoggedIn && !showForm" class="add-review-btn-wrap">
      <button class="btn-add-review" @click="showForm = true">
        <i class="fa-solid fa-pen"></i> Escribir reseña
      </button>
    </div>

    <form v-if="showForm" class="review-form" @submit.prevent="submitReview" novalidate>
      <div class="star-rating">
        <span class="star-label">Tu puntuación:</span>
        <span v-for="i in 5" :key="i" class="star-select" :class="{ active: i <= nuevaPuntuacion }" @click="nuevaPuntuacion = i; errorPuntuacion = ''">
          &#9733;
        </span>
      </div>
      <p v-if="errorPuntuacion" class="text-red-400 text-xs mt-1 flex items-center gap-1"><i class="fas fa-exclamation-circle"></i> {{ errorPuntuacion }}</p>
      <textarea v-model="nuevoComentario" class="review-textarea" :class="{ 'border-red-500': errorComentario }" placeholder="Escribe tu opinión sobre este juego..." rows="4" maxlength="500" @input="errorComentario = ''"></textarea>
      <p v-if="errorComentario" class="text-red-400 text-xs mt-1 flex items-center gap-1"><i class="fas fa-exclamation-circle"></i> {{ errorComentario }}</p>
      <div class="form-actions">
        <button type="button" class="btn-cancel" @click="cancelReview">Cancelar</button>
        <button type="submit" class="btn-submit" :disabled="enviando">
          <i v-if="enviando" class="fa-solid fa-spinner fa-spin"></i>
          <i v-else class="fa-solid fa-paper-plane"></i> {{ enviando ? 'Enviando...' : 'Enviar reseña' }}
        </button>
      </div>
    </form>

    <div v-if="loading" class="text-center text-[#888] py-6">
      <i class="fa-solid fa-spinner fa-spin"></i> Cargando reseñas...
    </div>

    <div v-else-if="reviews.length === 0" class="empty-reviews">
      <i class="fa-solid fa-star"></i>
      <p>No hay reseñas aún. ¡Sé el primero en opinar!</p>
    </div>

    <div v-else class="reviews-list">
      <div v-for="review in reviews" :key="review.id" class="review-item">
        <div class="review-header">
          <div class="review-user">
            <div class="review-avatar">{{ review.usuario.nombre.charAt(0).toUpperCase() }}</div>
            <div>
              <span class="review-name">{{ review.usuario.nombre }}</span>
              <span class="review-date">{{ formatDate(review.fecha) }}</span>
            </div>
          </div>
          <div class="review-stars">
            <span v-for="i in 5" :key="i" class="star-display" :class="{ filled: i <= review.puntuacion }">&#9733;</span>
          </div>
        </div>
        <p v-if="review.comentario" class="review-text">{{ review.comentario }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { reviewService } from '../../services/review.service'
import { useAuthStore } from '../../stores/auth'
import { useToast } from '../../composables/useToast'
import { formatDate } from '../../utils/format'
import { validarComentario } from '../../utils/validation'

const props = defineProps({ juegoId: { type: Number, required: true } })

const authStore = useAuthStore()
const toast = useToast()

const reviews = ref([])
const promedio = ref(0)
const loading = ref(true)
const showForm = ref(false)
const nuevaPuntuacion = ref(0)
const nuevoComentario = ref('')
const errorPuntuacion = ref('')
const errorComentario = ref('')
const enviando = ref(false)

async function loadReviews() {
  loading.value = true
  try {
    const [res, promRes] = await Promise.all([
      reviewService.getByJuego(props.juegoId),
      reviewService.getPromedio(props.juegoId),
    ])
    reviews.value = res.data
    promedio.value = promRes.data
  } catch {
    toast.show('Error al cargar reseñas', 'error')
  } finally {
    loading.value = false
  }
}

async function submitReview() {
  errorPuntuacion.value = ''
  errorComentario.value = ''
  if (nuevaPuntuacion.value === 0) {
    errorPuntuacion.value = 'Debes seleccionar una puntuación'
    return
  }
  const errCom = validarComentario(nuevoComentario.value)
  if (errCom) {
    errorComentario.value = errCom
    return
  }
  enviando.value = true
  try {
    await reviewService.crear({
      juego: { id: props.juegoId },
      usuario: { id: authStore.user.id },
      puntuacion: nuevaPuntuacion.value,
      comentario: nuevoComentario.value.trim(),
    })
    toast.show('Reseña enviada correctamente', 'success')
    showForm.value = false
    nuevaPuntuacion.value = 0
    nuevoComentario.value = ''
    await loadReviews()
  } catch {
    toast.show('Error al enviar la reseña', 'error')
  } finally {
    enviando.value = false
  }
}

function cancelReview() {
  showForm.value = false
  nuevaPuntuacion.value = 0
  nuevoComentario.value = ''
}

onMounted(loadReviews)
</script>

<style scoped>
.review-section { margin-top: 40px; }
.section-title {
  font-size: 1.3em; font-weight: 700; color: white; margin-bottom: 20px;
  font-family: 'Audiowide', cursive; display: flex; align-items: center; gap: 8px;
}
.section-title i { color: #ffc107; }
.review-count { color: #888; font-size: 0.85rem; font-weight: 400; }
.avg-rating { margin-left: auto; color: #ffc107; font-size: 1rem; background: rgba(255,193,7,0.1); padding: 4px 14px; border-radius: 20px; }

.add-review-btn-wrap { margin-bottom: 20px; }
.btn-add-review {
  background: linear-gradient(to right, rgba(255,126,0,0.76), #ff6300);
  color: #000; border: none; padding: 10px 22px; border-radius: 10px;
  font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.3s;
  display: inline-flex; align-items: center; gap: 8px;
}
.btn-add-review:hover { transform: scale(1.03); }

.review-form {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px; padding: 20px; margin-bottom: 25px;
}
.star-rating { display: flex; align-items: center; gap: 6px; margin-bottom: 14px; }
.star-label { color: #aaa; font-size: 0.9rem; margin-right: 6px; }
.star-select { font-size: 1.8rem; color: #444; cursor: pointer; transition: all 0.2s; line-height: 1; }
.star-select:hover, .star-select.active { color: #ffc107; transform: scale(1.1); }
.review-textarea {
  width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px; color: white; padding: 12px; font-size: 0.9rem;
  resize: vertical; outline: none; transition: border-color 0.3s;
  font-family: inherit;
}
.review-textarea:focus { border-color: #ff6300; }
.form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 12px; }
.btn-cancel {
  background: rgba(255,255,255,0.08); color: #ccc; border: none;
  padding: 10px 20px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s;
}
.btn-cancel:hover { background: rgba(255,255,255,0.15); }
.btn-submit {
  background: linear-gradient(to right, rgba(255,126,0,0.76), #ff6300);
  color: #000; border: none; padding: 10px 22px; border-radius: 10px;
  font-weight: 700; cursor: pointer; transition: all 0.3s;
  display: flex; align-items: center; gap: 6px;
}
.btn-submit:hover { transform: scale(1.03); }
.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.empty-reviews {
  text-align: center; padding: 40px 20px; color: #888;
}
.empty-reviews i { font-size: 2.5rem; color: #444; margin-bottom: 12px; display: block; }
.empty-reviews p { font-size: 0.95rem; }

.reviews-list { display: flex; flex-direction: column; gap: 14px; }
.review-item {
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px; padding: 16px;
}
.review-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
.review-user { display: flex; align-items: center; gap: 10px; }
.review-avatar {
  width: 38px; height: 38px; border-radius: 50%; background: #ff6300;
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 700; font-size: 1rem; flex-shrink: 0;
}
.review-name { display: block; color: white; font-weight: 600; font-size: 0.9rem; }
.review-date { display: block; color: #888; font-size: 0.75rem; }
.review-stars { display: flex; gap: 2px; flex-shrink: 0; }
.star-display { color: #444; font-size: 1.1rem; }
.star-display.filled { color: #ffc107; }
.review-text { color: #bbb; font-size: 0.9rem; line-height: 1.6; margin: 0; }
</style>
