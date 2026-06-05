<template>
  <DefaultLayout>
    <div class="profile-container max-w-[1200px] mx-auto mt-8 px-5">
      <ProfileBanner :imagen="perfil.imagenPortada" editable @change="openBannerModal" />

      <div class="profile-header relative z-[2] px-8" style="margin-top: -100px;">
        <div class="flex items-end gap-6">
          <div class="relative w-[120px] h-[120px] -mt-[60px] group cursor-pointer" @click="openAvatarModal">
            <img :src="perfil.imagenPerfil || AVATARS[0]"
                 class="w-full h-full rounded-full border-2 border-[#ff6300] object-cover" />
            <div class="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <i class="fas fa-pencil-alt text-white text-lg"></i>
            </div>
          </div>

          <div class="flex-1">
            <div class="flex items-start justify-between">
              <div>
                <h1 class="text-2xl font-bold text-white">{{ usuario.nombre }}</h1>
                <div class="flex items-center gap-2 text-[#888] text-sm mt-1">
                  <i class="fas fa-envelope"></i> {{ usuario.correo }}
                </div>
              </div>
              <div class="flex gap-3">
                <button @click="openViewModal"
                  class="bg-[rgba(255,255,255,0.1)] text-white border-2 border-[rgba(255,255,255,0.2)] px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer flex items-center gap-2 hover:bg-[rgba(255,255,255,0.2)] transition-all">
                  <i class="fas fa-id-card"></i> Ver Información
                </button>
                <button @click="openEditModal"
                  class="bg-[#ff6300] text-white px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer flex items-center gap-2 hover:bg-[#ff7e2e] transition-all">
                  <i class="fas fa-edit"></i> Editar Perfil
                </button>
              </div>
            </div>
          </div>

          <div class="flex gap-8">
            <div class="text-center">
              <span class="text-2xl font-bold text-white block">{{ stats.juegosComprados || 0 }}</span>
              <span class="text-xs text-[#888]">Juegos<br/>Comprados</span>
            </div>
            <div class="text-center">
              <span class="text-2xl font-bold text-white block">{{ stats.totalCompras || 0 }}</span>
              <span class="text-xs text-[#888]">Compras<br/>Totales</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-1 mt-[42px] bg-[#2d2d2d] rounded-lg p-1">
        <button
          :class="['flex-1 py-3 text-center font-semibold rounded-md cursor-pointer transition-all text-sm border-none', activeTab === 'actividad' ? 'bg-[#ff6300] text-white' : 'text-[#888] hover:text-white bg-transparent']"
          @click="activeTab = 'actividad'"
        ><i class="fas fa-user-cog"></i> Actividad Reciente</button>
        <button
          :class="['flex-1 py-3 text-center font-semibold rounded-md cursor-pointer transition-all text-sm border-none', activeTab === 'compras' ? 'bg-[#ff6300] text-white' : 'text-[#888] hover:text-white bg-transparent']"
          @click="activeTab = 'compras'"
        ><i class="fas fa-shopping-bag"></i> Mis Compras</button>
        <button
          :class="['flex-1 py-3 text-center font-semibold rounded-md cursor-pointer transition-all text-sm border-none', activeTab === 'deseos' ? 'bg-[#ff6300] text-white' : 'text-[#888] hover:text-white bg-transparent']"
          @click="activeTab = 'deseos'"
        ><i class="fas fa-heart"></i> Lista de Deseos</button>
      </div>

      <div v-if="activeTab === 'actividad'" class="mt-6">
        <div class="bg-[#242424] rounded-xl p-6">
          <h3 class="text-lg font-bold text-white mb-4"><i class="fas fa-chart-line text-[#ff6300]"></i> Actividad Reciente</h3>
          <div class="flex justify-between py-3 border-b border-[#444]">
            <span class="text-[#888]">Última Compra</span>
            <span class="text-white font-semibold">{{ stats.ultimaCompra || 'Sin compras' }}</span>
          </div>
          <div class="flex justify-between py-3">
            <span class="text-[#888]">Total Gastado</span>
            <span class="text-white font-semibold">S/ {{ (stats.totalGastado || 0).toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'compras'" class="mt-6">
        <div class="bg-[#242424] rounded-xl p-6">
          <h3 class="text-lg font-bold text-white mb-4"><i class="fas fa-history text-[#ff6300]"></i> Historial de Compras</h3>
          <div v-if="historial.length === 0" class="text-center py-6">
            <i class="fas fa-shopping-bag text-4xl text-[#444] mb-2"></i>
            <h3 class="text-lg text-[#aaa] mb-2">¡Tu Zona de Juegos te espera!</h3>
            <p class="text-[#666]">Aún no has realizado ninguna compra. ¡Explora nuestros títulos ahora!</p>
          </div>
          <div v-else>
            <div v-for="venta in historial" :key="venta.id" class="bg-[rgba(255,255,255,0.03)] rounded-lg p-4 mb-3">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm text-[#888]">{{ venta.fecha }}</span>
                <span class="text-lg font-bold text-[#ff6300]">S/ {{ venta.total?.toFixed(2) }}</span>
              </div>
              <div class="flex gap-3 flex-wrap">
                <span v-for="juego in venta.videojuegos" :key="juego.id" class="bg-[rgba(255,99,0,0.2)] text-[#ff6300] text-xs px-2.5 py-1 rounded-full">
                  {{ juego.titulo }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="activeTab === 'deseos'" class="mt-6">
        <div class="bg-[#242424] rounded-xl p-6">
          <h3 class="text-lg font-bold text-white mb-4"><i class="fas fa-heart text-[#ff6300]"></i> Lista de Deseos</h3>
          <div v-if="wishlist.length === 0" class="text-center py-6">
            <i class="fas fa-heart-broken text-4xl text-[#444] mb-2"></i>
            <h3 class="text-lg text-[#aaa] mb-2">Tu lista de deseos está vacía</h3>
            <p class="text-[#666]">Agrega juegos desde la tienda</p>
          </div>
          <div v-else class="flex flex-col gap-3">
            <div v-for="item in wishlist" :key="item.id" class="flex items-center gap-4 bg-[rgba(255,255,255,0.03)] rounded-lg p-4">
              <img :src="item.imagenUrl" :alt="item.titulo" class="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <h4 class="text-white font-semibold truncate">{{ item.titulo }}</h4>
                <span class="text-[#ff6300] font-bold">S/. {{ item.precio?.toFixed(2) }}</span>
              </div>
              <button @click="addWishlistToCart(item)" class="bg-[#ff6300] text-white px-4 py-2 border-none rounded-lg text-sm font-semibold cursor-pointer hover:bg-[#ff7e2e] transition-all">
                <i class="fas fa-shopping-cart"></i>
              </button>
              <button @click="removeFromWishlist(item.id)" class="bg-[rgba(255,0,0,0.1)] text-[#ff6666] px-3 py-2 border-none rounded-lg cursor-pointer hover:bg-[rgba(255,0,0,0.2)] transition-all">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showViewModal" class="fixed inset-0 z-[1000] bg-[rgba(0,0,0,0.85)] flex items-center justify-center" @click.self="showViewModal = false">
      <div class="bg-[#242424] w-[90%] max-w-[500px] rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.7)]">
        <div class="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.1)]">
          <h2 class="text-xl font-bold flex items-center gap-2"><i class="fas fa-id-card text-[#ff6300]"></i> Información Personal</h2>
          <button @click="showViewModal = false" class="text-white text-2xl bg-transparent border-none cursor-pointer hover:text-[#ff6300] transition-colors">&times;</button>
        </div>
        <div class="p-6">
          <div class="flex justify-between py-3 border-b border-[#444]">
            <span class="text-[#888]">Nombre Completo</span>
            <span class="text-white font-semibold">{{ usuario.nombre }}</span>
          </div>
          <div class="flex justify-between py-3 border-b border-[#444]">
            <span class="text-[#888]">Correo Electrónico</span>
            <span class="text-white font-semibold">{{ usuario.correo }}</span>
          </div>
          <div class="flex justify-between py-3">
            <span class="text-[#888]">Teléfono</span>
            <span class="text-white font-semibold">{{ usuario.numeroTelefono || 'No registrado' }}</span>
          </div>
        </div>
      </div>
    </div>

    <AvatarSelector
      :visible="showAvatarModal"
      :selected="selectedAvatar"
      @close="showAvatarModal = false"
      @select="selectedAvatar = $event"
      @confirm="selectAvatarAndClose"
    />

    <BannerSelector
      :visible="showBannerModal"
      :selected="selectedBanner"
      @close="showBannerModal = false"
      @select="selectedBanner = $event"
      @confirm="selectBannerAndClose"
    />

    <EditProfileModal
      :visible="showEditModal"
      :localUser="editForm"
      @close="showEditModal = false"
      @save="saveProfile"
    />
  </DefaultLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import ProfileBanner from '../components/profile/ProfileBanner.vue'
import AvatarSelector from '../components/profile/AvatarSelector.vue'
import BannerSelector from '../components/profile/BannerSelector.vue'
import EditProfileModal from '../components/profile/EditProfileModal.vue'
import { userService } from '../services/user.service'
import { profileService } from '../services/profile.service'
import { saleService } from '../services/sale.service'
import { wishlistService } from '../services/wishlist.service'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useToast } from '../composables/useToast'
import { AVATARS, BANNERS } from '../config/constants'

const authStore = useAuthStore()
const cartStore = useCartStore()
const toast = useToast()

const activeTab = ref('actividad')
const showViewModal = ref(false)
const showEditModal = ref(false)
const showAvatarModal = ref(false)
const showBannerModal = ref(false)

const usuario = ref({ nombre: '', correo: '', numeroTelefono: '' })
const perfil = ref({ imagenPerfil: '', imagenPortada: '' })
const stats = ref({ totalGastado: 0, totalCompras: 0, juegosComprados: 0, ultimaCompra: '' })
const historial = ref([])
const wishlist = ref([])

const editForm = reactive({ nombre: '', correo: '', telefono: '' })
const selectedAvatar = ref('')
const selectedBanner = ref('')

function openViewModal() { showViewModal.value = true }
function openEditModal() {
  editForm.nombre = usuario.value.nombre
  editForm.correo = usuario.value.correo
  editForm.telefono = usuario.value.numeroTelefono || ''
  showEditModal.value = true
}
function openAvatarModal() {
  selectedAvatar.value = perfil.value.imagenPerfil || AVATARS[0]
  showAvatarModal.value = true
}
function openBannerModal() {
  selectedBanner.value = perfil.value.imagenPortada || BANNERS[0]
  showBannerModal.value = true
}

async function selectAvatarAndClose() {
  if (!selectedAvatar.value) return
  try {
    await profileService.updateImages(usuario.value.id, {
      imagenPerfil: selectedAvatar.value,
      imagenPortada: perfil.value.imagenPortada,
    })
    perfil.value.imagenPerfil = selectedAvatar.value
    showAvatarModal.value = false
    toast.show('Avatar actualizado', 'success')
  } catch {
    toast.show('Error al actualizar avatar', 'error')
  }
}

async function selectBannerAndClose() {
  if (!selectedBanner.value) return
  try {
    await profileService.updateImages(usuario.value.id, {
      imagenPerfil: perfil.value.imagenPerfil,
      imagenPortada: selectedBanner.value,
    })
    perfil.value.imagenPortada = selectedBanner.value
    showBannerModal.value = false
    toast.show('Portada actualizada', 'success')
  } catch {
    toast.show('Error al actualizar portada', 'error')
  }
}

async function saveProfile() {
  try {
    const { data } = await userService.update(usuario.value.id, {
      nombre: editForm.nombre,
      correo: editForm.correo,
      numeroTelefono: editForm.telefono,
    })
    usuario.value = data
    authStore.user.nombre = data.nombre
    authStore.user.correo = data.correo
    authStore.setUser(authStore.user)
    showEditModal.value = false
    toast.show('Perfil actualizado', 'success')
  } catch {
    toast.show('Error al actualizar perfil', 'error')
  }
}

async function addWishlistToCart(item) {
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

onMounted(async () => {
  const userId = authStore.user?.id
  if (!userId) return

  try {
    const [usuarioRes, perfilRes, statsRes, historialRes, wishlistRes] = await Promise.all([
      userService.get(userId),
      profileService.get(userId),
      saleService.getStats(userId),
      saleService.getHistory(userId),
      wishlistService.get(userId),
    ])
    usuario.value = usuarioRes.data
    perfil.value = perfilRes.data
    stats.value = statsRes.data
    historial.value = historialRes.data
    wishlist.value = wishlistRes.data.juegos || []
    authStore.cargarJuegosComprados(userId)
  } catch (err) {
    console.error('Error loading profile:', err)
  }
})
</script>
