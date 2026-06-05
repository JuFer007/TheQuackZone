<template>
  <DefaultLayout>
    <div class="max-w-[1200px] mx-auto mt-10 px-5">
      <div class="mb-8">
        <h1 class="text-[2.5rem] font-bold text-white flex items-center gap-4 mb-2.5">
          <i class="fas fa-heart text-[#ff6300]"></i> Mi Lista de Deseos
        </h1>
        <p class="text-[#888] text-lg">Guarda tus juegos favoritos para comprarlos más tarde</p>
      </div>

      <div v-if="wishlist.length > 0" class="bg-[#242424] rounded-xl p-5 px-7 mb-8 flex justify-between items-center border-2 border-[rgba(255,99,0,0.15)]">
        <div class="flex gap-10">
          <div class="flex items-center gap-2.5">
            <i class="fas fa-gamepad text-[#ff6300] text-xl"></i>
            <div>
              <div class="text-[#888]">Total de Juegos</div>
              <div class="text-white font-bold text-lg">{{ wishlist.length }}</div>
            </div>
          </div>
          <div class="flex items-center gap-2.5">
            <i class="fas fa-dollar-sign text-[#ff6300] text-xl"></i>
            <div>
              <div class="text-[#888]">Valor Total</div>
              <div class="text-white font-bold text-lg">S/. {{ totalValue.toFixed(2) }}</div>
            </div>
          </div>
        </div>
        <button @click="clearAllWishlist" class="bg-[rgba(255,0,0,0.1)] text-[#ff6666] border-2 border-[rgba(255,0,0,0.3)] px-5 py-2.5 rounded-lg cursor-pointer font-semibold flex items-center gap-2 hover:bg-[rgba(255,0,0,0.2)] hover:border-red-500 transition-all">
          <i class="fas fa-trash"></i> Limpiar Lista
        </button>
      </div>

      <div v-if="wishlist.length === 0" class="text-center py-20">
        <i class="fas fa-heart-broken text-6xl text-[#444] mb-6"></i>
        <h3 class="text-[1.8rem] text-[#aaa] mb-4">Tu lista de deseos está vacía</h3>
        <p class="text-[#666] text-lg mb-8">Comienza a agregar juegos increíbles a tu lista</p>
        <router-link to="/" class="inline-flex items-center gap-2.5 bg-gradient-to-r from-[rgba(255,126,0,0.76)] to-[#ff6300] text-black border-none px-8 py-4 rounded-full font-semibold cursor-pointer text-base no-underline transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_5px_20px_rgba(255,99,0,0.5)]">
          <i class="fas fa-gamepad"></i> Explorar Juegos
        </router-link>
      </div>

      <div v-else class="flex flex-col gap-5">
        <div v-for="item in wishlist" :key="item.id" class="bg-[#242424] rounded-xl overflow-hidden border-2 border-transparent transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(0,0,0,0.3)] hover:border-[rgba(255,99,0,0.5)] flex h-[200px]">
          <img :src="item.imagenUrl" :alt="item.titulo" class="w-[280px] h-[200px] object-cover flex-shrink-0" />
          <div class="p-5 flex flex-col justify-between flex-1">
            <div class="flex-1">
              <h3 class="text-xl font-bold text-white mb-2.5">{{ item.titulo }}</h3>
              <span class="inline-block bg-[rgba(255,99,0,0.2)] text-[#ff6300] text-sm px-3 py-1 rounded-full mb-2.5">
                <i :class="item.plataforma === 'PC' ? 'fas fa-desktop' : 'fas fa-playstation'"></i> {{ item.plataforma }}
              </span>
              <div class="text-2xl font-bold text-[#ff6300] mt-2.5">S/. {{ item.precio.toFixed(2) }}</div>
            </div>
            <div class="flex gap-2.5">
              <button @click="addToCart(item)" class="flex-1 bg-[#ff6300] text-white py-3 border-none rounded-lg font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 text-base hover:bg-[#ff7e2e] hover:scale-105">
                <i class="fas fa-shopping-cart"></i> Agregar al Carrito
              </button>
              <button @click="removeFromWishlist(item.id)" class="flex-1 bg-[rgba(255,255,255,0.1)] text-white border-2 border-[rgba(255,255,255,0.2)] py-3 rounded-lg font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 hover:bg-[rgba(255,0,0,0.2)] hover:border-red-500 hover:text-[#ff6666]">
                <i class="fas fa-trash"></i> Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import { wishlistService } from '../services/wishlist.service'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useToast } from '../composables/useToast'

const authStore = useAuthStore()
const cartStore = useCartStore()
const toast = useToast()

const wishlist = ref([])

const totalValue = computed(() => wishlist.value.reduce((sum, item) => sum + (item.precio || 0), 0))

async function addToCart(item) {
  if (!authStore.isLoggedIn) {
    toast.show('Debes iniciar sesión', 'warning')
    return
  }
  if (authStore.esJuegoComprado(item.id)) {
    toast.show('Ya tienes este juego en tu biblioteca', 'warning')
    return
  }
  try {
    await cartStore.addGame(authStore.user.id, item.id)
    toast.show(`"${item.titulo}" agregado al carrito`, 'success')
  } catch {
    toast.show('Error al agregar al carrito', 'error')
  }
}

async function removeFromWishlist(id) {
  try {
    await wishlistService.remove(authStore.user.id, id)
    wishlist.value = wishlist.value.filter(i => i.id !== id)
    toast.show('Eliminado de tu lista de deseos', 'success')
  } catch {
    toast.show('Error al eliminar', 'error')
  }
}

async function clearAllWishlist() {
  if (wishlist.value.length === 0) return
  if (!confirm('¿Estás seguro de que quieres eliminar todos los juegos de tu lista de deseos?')) return
  try {
    await Promise.all(wishlist.value.map(item => wishlistService.remove(authStore.user.id, item.id)))
    wishlist.value = []
    toast.show('Lista de deseos limpiada', 'success')
  } catch {
    toast.show('Error al limpiar lista', 'error')
  }
}

onMounted(async () => {
  const userId = authStore.user?.id
  if (!userId) return
  try {
    const res = await wishlistService.get(userId)
    wishlist.value = res.data.juegos || []
  } catch {
    wishlist.value = []
  }
})
</script>
