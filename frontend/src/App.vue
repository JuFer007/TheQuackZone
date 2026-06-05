<template>
  <router-view />
  <GameModal :juego="selectedGame" @close="selectedGame = null" @add-cart="handleAddCart" @add-wishlist="handleAddWishlist" />
  <RawgGameModal
    :juego="selectedRawgGame"
    @close="selectedRawgGame = null"
    @add-cart="handleAddRawgCart"
    @add-wishlist="handleAddRawgWishlist"
    @view-detail="handleViewRawgDetail"
  />
</template>

<script setup>
import { ref, provide } from 'vue'
import { useRouter } from 'vue-router'
import GameModal from './components/game/GameModal.vue'
import RawgGameModal from './components/game/RawgGameModal.vue'
import { useAuthStore } from './stores/auth'
import { useCartStore } from './stores/cart'
import { useToast } from './composables/useToast'
import { wishlistService } from './services/wishlist.service'

const router = useRouter()

const selectedGame = ref(null)
const selectedRawgGame = ref(null)

function openGameModal(juego) {
  selectedGame.value = juego
}

function openRawgGameModal(juego) {
  selectedRawgGame.value = juego
}

provide('openGameModal', openGameModal)
provide('openRawgGameModal', openRawgGameModal)

async function handleAddCart(juego) {
  const authStore = useAuthStore()
  const cartStore = useCartStore()
  const toast = useToast()
  if (!authStore.isLoggedIn) {
    toast.show('Debes iniciar sesión para agregar al carrito', 'warning')
    return
  }
  if (authStore.esJuegoComprado(juego.id)) {
    toast.show('Ya tienes este juego en tu biblioteca', 'warning')
    return
  }
  try {
    await cartStore.addGame(authStore.user.id, juego.id)
    toast.show(`"${juego.titulo}" agregado al carrito`, 'success')
  } catch {
    toast.show('Error al agregar al carrito', 'error')
  }
}

async function handleAddRawgCart(juego) {
  const authStore = useAuthStore()
  const cartStore = useCartStore()
  const toast = useToast()
  if (!authStore.isLoggedIn) {
    toast.show('Debes iniciar sesión para agregar al carrito', 'warning')
    return
  }
  if (authStore.esJuegoComprado(juego.id)) {
    toast.show('Ya tienes este juego en tu biblioteca', 'warning')
    return
  }
  try {
    await cartStore.addGame(authStore.user.id, juego.id)
    toast.show(`"${juego.name}" agregado al carrito`, 'success')
  } catch {
    toast.show('Error al agregar al carrito', 'error')
  }
}

async function handleAddWishlist(juego) {
  const authStore = useAuthStore()
  const toast = useToast()
  if (!authStore.isLoggedIn) {
    toast.show('Debes iniciar sesión para agregar a deseos', 'warning')
    return
  }
  try {
    await wishlistService.add(authStore.user.id, juego.id)
    toast.show(`"${juego.titulo}" agregado a lista de deseos`, 'success')
  } catch {
    toast.show('Error al agregar a lista de deseos', 'error')
  }
}

async function handleAddRawgWishlist(juego) {
  const authStore = useAuthStore()
  const toast = useToast()
  if (!authStore.isLoggedIn) {
    toast.show('Debes iniciar sesión para agregar a deseos', 'warning')
    return
  }
  try {
    await wishlistService.add(authStore.user.id, juego.id)
    toast.show(`"${juego.name}" agregado a lista de deseos`, 'success')
  } catch {
    toast.show('Error al agregar a lista de deseos', 'error')
  }
}

function handleViewRawgDetail(juego) {
  selectedRawgGame.value = null
  router.push(`/juego-rawg/${juego.id}`)
}
</script>
