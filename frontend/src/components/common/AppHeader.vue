<template>
  <header class="bg-[#1e1e1e]/95 backdrop-blur-sm h-[80px] flex items-center justify-center px-8 shadow-[0_2px_12px_rgba(0,0,0,0.3)] sticky top-0 z-50">
    <div class="grid grid-cols-3 items-center w-full max-w-[1400px]">
      <nav class="flex items-center justify-self-start gap-1">
        <router-link to="/" class="nav-link uppercase">
          <i class="fa-solid fa-house"></i> Inicio
        </router-link>
        <router-link to="/plataforma/ps5" class="nav-link uppercase">
          <i class="fa-brands fa-playstation"></i> PS5
        </router-link>
        <router-link to="/plataforma/pc" class="nav-link uppercase">
          <i class="fa-solid fa-desktop"></i> PC
        </router-link>
      </nav>

      <router-link to="/" class="flex justify-self-center w-[160px]">
        <img src="/recursos/logoPagina.png" alt="The QuackZone" class="w-full" />
      </router-link>

      <div class="flex items-center justify-self-end gap-2">
        <div class="w-[280px] relative" ref="searchRef">
          <div class="relative">
            <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#666] text-xs"></i>
            <input
              v-model="searchQuery"
              @input="onSearchInput"
              @focus="showResults = true"
              @keydown.escape="showResults = false"
              placeholder="Buscar..."
              class="w-full h-[34px] bg-[#2d2d2d] border border-transparent focus:border-[#ff6300] rounded-lg pl-8 pr-3 text-white text-sm outline-none transition-all duration-300 placeholder:text-[#555]"
            />
            <button v-if="searchQuery" @click="clearSearch" class="absolute right-2 top-1/2 -translate-y-1/2 text-[#666] hover:text-white transition-colors text-xs bg-transparent border-none cursor-pointer">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>

          <Transition name="dropdown">
            <div v-if="showResults && searchQuery" class="search-dropdown">
              <div v-if="searchLoading" class="search-status">
                <i class="fa-solid fa-spinner fa-spin"></i> Buscando...
              </div>
              <div v-else-if="searchResults.length === 0" class="search-status">
                <i class="fa-solid fa-search-minus"></i> Sin resultados para "{{ searchQuery }}"
              </div>
              <div v-else>
                <div
                  v-for="juego in searchResults"
                  :key="juego.id"
                  class="search-result-item"
                  @click="selectGame(juego)"
                >
                  <img :src="juego.imagenUrl || juego.portadaUrl" :alt="juego.titulo" class="search-result-img" />
                  <div class="search-result-info">
                    <span class="search-result-title">{{ juego.titulo }}</span>
                    <span class="search-result-platform"><i class="fa-solid fa-gamepad"></i> {{ juego.plataforma }}</span>
                  </div>
                  <span class="search-result-price">S/ {{ juego.precio?.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <template v-if="!authStore.isLoggedIn">
          <button @click="$router.push('/sesion')" class="icon-btn" title="Iniciar Sesi�n">
            <i class="fa-solid fa-right-to-bracket"></i>
          </button>
        </template>

        <template v-else>
          <div class="relative"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave">
            <div class="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg transition-all duration-300 hover:bg-[rgba(255,255,255,0.06)]">
              <img :src="profileImage" alt="Avatar" class="w-8 h-8 rounded-full border-2 border-[#ff8c42] object-cover" />
              <span class="text-[#ccc] text-sm font-medium hidden sm:block max-w-[100px] truncate">{{ authStore.user?.nombre || 'Usuario' }}</span>
              <i class="fa-solid fa-chevron-down text-[#666] text-xs transition-transform duration-300" :class="{ 'rotate-180': showDropdown }"></i>
            </div>

            <Transition name="dropdown">
              <div v-if="showDropdown" class="dropdown-menu"
                @mouseenter="handleMouseEnter"
                @mouseleave="handleMouseLeave">
                <router-link to="/perfil" class="dropdown-item">
                  <i class="fa-solid fa-id-badge"></i> Mi Perfil
                </router-link>
                <a href="#" @click.prevent="openCartDropdown" class="dropdown-item">
                  <i class="fa-solid fa-cart-shopping"></i> Carrito de compras
                </a>
                <router-link to="/lista-deseos" class="dropdown-item">
                  <i class="fa-solid fa-heart"></i> Lista de Deseos
                </router-link>
                <div class="dropdown-divider"></div>
                <a href="#" @click.prevent="showLogoutModal = true" class="dropdown-item">
                  <i class="fa-solid fa-right-from-bracket"></i> Cerrar Sesión
                </a>
              </div>
            </Transition>
          </div>
        </template>

        <button v-if="!authStore.isLoggedIn" @click="$emit('open-cart')" class="icon-btn" title="Carrito">
          <i class="fa-solid fa-cart-shopping"></i>
          <span v-if="cartStore.count > 0" class="cart-badge">{{ cartStore.count }}</span>
        </button>
      </div>
    </div>
  </header>

  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showLogoutModal" class="modal-backdrop" @click.self="showLogoutModal = false">
        <div class="modal-box">
          <h3>Cerrar Sesión</h3>
          <p>¿Estás seguro de que deseas cerrar sesión?</p>
          <div class="modal-actions">
            <button class="btn-cancel" @click="showLogoutModal = false">Cancelar</button>
            <button class="btn-confirm" @click="handleLogout">Cerrar Sesión</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useCartStore } from '../../stores/cart'
import { profileService } from '../../services/profile.service'
import { gameService } from '../../services/game.service'

const emit = defineEmits(['open-cart'])

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const showDropdown = ref(false)
const showLogoutModal = ref(false)
const profileImage = ref('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop')
let dropdownTimeout = null

const searchQuery = ref('')
const showResults = ref(false)
const searchResults = ref([])
const searchLoading = ref(false)
const searchRef = ref(null)
let searchTimeout = null

function handleMouseEnter() {
  if (dropdownTimeout) clearTimeout(dropdownTimeout)
  showDropdown.value = true
}

function handleMouseLeave() {
  dropdownTimeout = setTimeout(() => {
    showDropdown.value = false
  }, 150)
}

function openCartDropdown() {
  showDropdown.value = false
  emit('open-cart')
}

function handleLogout() {
  showLogoutModal.value = false
  showDropdown.value = false
  authStore.logout()
  router.push('/')
}

function clearSearch() {
  searchQuery.value = ''
  searchResults.value = []
  showResults.value = false
}

function onSearchInput() {
  if (searchTimeout) clearTimeout(searchTimeout)
  const q = searchQuery.value.trim()
  if (!q) {
    searchResults.value = []
    showResults.value = false
    return
  }
  if (q.length < 2) return
  searchTimeout = setTimeout(async () => {
    searchLoading.value = true
    showResults.value = true
    try {
      const { data } = await gameService.search(q)
      searchResults.value = data
    } catch {
      searchResults.value = []
    } finally {
      searchLoading.value = false
    }
  }, 300)
}

function selectGame(juego) {
  showResults.value = false
  searchQuery.value = ''
  searchResults.value = []
  router.push(`/juego/${juego.id}`)
}

function handleClickOutside(e) {
  if (searchRef.value && !searchRef.value.contains(e.target)) {
    showResults.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  if (authStore.isLoggedIn && authStore.user?.id) {
    try {
      profileService.get(authStore.user.id).then(({ data }) => {
        if (data?.imagenPerfil) profileImage.value = data.imagenPerfil
      })
    } catch {}
    authStore.cargarJuegosComprados(authStore.user.id)
    cartStore.syncFromBackend(authStore.user.id)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.nav-link {
  display: flex; align-items: center; gap: 6px;
  color: #999; text-decoration: none; padding: 8px 14px;
  border-radius: 8px; font-size: 0.85rem; font-weight: 500;
  transition: all 0.25s ease;
}
.nav-link:hover { color: white; background: rgba(255,255,255,0.06); }
.nav-link i { font-size: 0.9rem; }
.nav-link.router-link-exact-active { color: #ff8c42; background: rgba(255,99,0,0.1); }
.nav-link.router-link-active:not(.router-link-exact-active) { color: #ddd; }

.icon-btn {
  background: linear-gradient(135deg, #ff6300, #f4500f); color: white;
  width: 36px; height: 36px; border-radius: 8px; border: none;
  font-size: 1rem; cursor: pointer; position: relative;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.3s ease;
}
.icon-btn:hover { background: linear-gradient(135deg, #f4500f, #d9450d); }

.dropdown-menu {
  position: absolute; top: 100%; right: 0; width: 220px;
  background-color: #1a1a1a; border-radius: 12px; padding: 0.5rem;
  box-shadow: 0 12px 32px rgba(0,0,0,0.6); z-index: 1000;
  border: 1px solid rgba(255,255,255,0.08);
}
.dropdown-item {
  display: flex; align-items: center; gap: 0.8rem;
  color: #ccc; text-decoration: none; padding: 0.6rem 0.8rem;
  border-radius: 8px; transition: all 0.2s;
}
.dropdown-item:hover { background-color: #2d2d2d; color: #ff8c42; }
.dropdown-item i { width: 20px; text-align: center; }
.dropdown-divider { height: 1px; background-color: #333; margin: 0.4rem 0; }

.cart-badge {
  position: absolute; top: -4px; right: -4px;
  background: #ff6300; color: white; font-size: 0.65rem;
  border-radius: 50%; width: 17px; height: 17px;
  display: flex; align-items: center; justify-content: center; font-weight: bold;
}

.search-dropdown {
  position: absolute; top: 48px; left: 0; right: 0;
  background-color: #1a1a1a; border-radius: 12px; padding: 0.5rem;
  box-shadow: 0 12px 32px rgba(0,0,0,0.6); z-index: 1000;
  border: 1px solid rgba(255,255,255,0.08);
  max-height: 400px; overflow-y: auto;
}
.search-status {
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  padding: 1.5rem; color: #888; font-size: 0.9rem;
}
.search-result-item {
  display: flex; align-items: center; gap: 0.8rem;
  padding: 0.6rem; border-radius: 8px; cursor: pointer;
  transition: background 0.2s;
}
.search-result-item:hover { background-color: #2d2d2d; }
.search-result-img {
  width: 44px; height: 44px; border-radius: 8px; object-fit: cover; flex-shrink: 0;
}
.search-result-info {
  flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px;
}
.search-result-title { color: white; font-size: 0.9rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.search-result-platform { color: #888; font-size: 0.75rem; }
.search-result-price { color: #ff6300; font-weight: 700; font-size: 0.9rem; white-space: nowrap; }

.dropdown-enter-active, .dropdown-leave-active { transition: all 0.2s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-8px); }

.modal-backdrop {
  position: fixed; inset: 0; z-index: 2000;
  background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center;
}
.modal-box {
  background: #2a2a2a; border-radius: 16px; padding: 30px 35px;
  width: 90%; max-width: 380px; text-align: center;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  animation: slideDown 0.3s ease;
}
.modal-box h3 { color: white; font-size: 1.3rem; margin-bottom: 12px; font-weight: 700; }
.modal-box p { color: #aaa; font-size: 0.95rem; margin-bottom: 25px; }
.modal-actions { display: flex; gap: 12px; justify-content: center; }
.btn-cancel, .btn-confirm {
  padding: 10px 24px; border-radius: 10px; font-weight: 600; font-size: 0.9rem;
  cursor: pointer; transition: all 0.3s; border: none;
}
.btn-cancel { background: rgba(255,255,255,0.08); color: #ccc; }
.btn-cancel:hover { background: rgba(255,255,255,0.15); }
.btn-confirm { background: #ff6300; color: white; }
.btn-confirm:hover { background: #e05500; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
