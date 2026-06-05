import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/sesion', name: 'Sesion', component: () => import('../views/AuthView.vue') },
  { path: '/perfil', name: 'Perfil', component: () => import('../views/ProfileView.vue') },
  { path: '/lista-deseos', name: 'ListaDeseos', component: () => import('../views/WishlistView.vue') },
  { path: '/juego-rawg/:id', name: 'GameDetail', component: () => import('../views/GameDetailView.vue') },
  { path: '/juego/:id', name: 'GameLocalDetail', component: () => import('../views/GameLocalDetailView.vue') },
  { path: '/plataforma/pc', name: 'PlatformPC', component: () => import('../views/PlatformPCView.vue') },
  { path: '/plataforma/ps5', name: 'PlatformPS5', component: () => import('../views/PlatformPS5View.vue') },
  { path: '/plataforma/:tipo', redirect: '/plataforma/pc' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
