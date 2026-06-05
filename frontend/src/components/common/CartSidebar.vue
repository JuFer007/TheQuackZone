<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="overlay" @click="$emit('close')" />
    </Transition>

    <Transition name="slide">
      <aside v-if="visible" class="sidebar">
        <div class="sidebar-header">
          <h2><i class="fa-solid fa-shopping-cart text-[#ff6300]"></i> Carrito de Compras</h2>
          <button class="close-btn" @click="$emit('close')">&times;</button>
        </div>

        <div class="sidebar-body">
          <div v-if="cartStore.items.length === 0" class="empty-cart">
            <i class="fa-solid fa-shopping-cart text-6xl text-[#444] mb-5"></i>
            <p class="text-lg">Tu carrito está vacío</p>
            <p class="text-sm text-[#888] mt-2">Agrega juegos para continuar</p>
          </div>

            <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
            <img :src="item.imagenUrl" :alt="item.titulo" class="cart-item-img" />
            <div class="cart-item-info">
              <h4 class="cart-item-title">{{ item.titulo }}</h4>
              <span class="cart-item-platform">{{ item.plataforma }}</span>
              <div v-if="deals[item.id]" class="cart-item-price discount">
                <span class="old-price">{{ formatCurrency(item.precio) }}</span>
                <span class="sale-price">{{ formatCurrency(deals[item.id].salePrice) }}</span>
                <span class="store-name">{{ deals[item.id].storeName }}</span>
              </div>
              <div v-else class="cart-item-price">{{ formatCurrency(item.precio) }}</div>
            </div>
            <button class="remove-btn" @click="removeItem(item)">&times;</button>
          </div>
        </div>

          <div v-if="cartStore.items.length > 0" class="sidebar-footer">
          <div class="flex justify-between mb-2 text-sm text-[#ccc]">
            <span>Subtotal:</span>
            <span>{{ formatCurrency(discountedTotal) }}</span>
          </div>
          <div v-if="totalSavings > 0" class="flex justify-between mb-2 text-sm text-[#10b981]">
            <span>Ahorro:</span>
            <span>-{{ formatCurrency(totalSavings) }}</span>
          </div>
          <div class="flex justify-between mb-4 text-white font-bold text-lg">
            <span>Total:</span>
            <span class="text-[#ff6300]">{{ formatCurrency(discountedTotal) }}</span>
          </div>
          <button class="checkout-btn" @click="openPaymentModal">
            <i class="fa-solid fa-credit-card"></i> Proceder al Pago
          </button>
          <button class="clear-btn" @click="clearCart">
            <i class="fa-solid fa-trash"></i> Vaciar Carrito
          </button>
        </div>
      </aside>
    </Transition>
  </Teleport>

  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showPaymentModal" class="payment-overlay" @click.self="closePaymentModal">
        <div class="payment-modal">
          <div class="payment-header">
            <h2><i class="fa-solid fa-credit-card text-[#ff6300]"></i> Pagar con tarjeta</h2>
            <button class="payment-close" @click="closePaymentModal">&times;</button>
          </div>
          <div class="payment-body">
            <div class="payment-amount mb-6 text-center">
              <span class="text-[#888] text-sm">Total a pagar</span>
              <div class="text-3xl font-bold text-white">{{ formatCurrency(discountedTotal) }}</div>
            </div>
            <form @submit.prevent="procesarPago" novalidate>
              <div class="field mb-4">
                <label class="text-sm text-[#ccc] font-semibold mb-1 block">Titular de la tarjeta</label>
                <input v-model.trim="payment.cardHolder" @input="paymentErrors.cardHolder = ''" :class="['w-full p-3 border-2 rounded-lg bg-[rgba(0,0,0,0.3)] text-white text-sm outline-none transition-colors', paymentErrors.cardHolder ? 'border-red-500' : 'border-[rgba(255,255,255,0.1)] focus:border-[#ff6300]']" placeholder="Juan Pérez" />
                <p v-if="paymentErrors.cardHolder" class="text-red-400 text-xs mt-1"><i class="fas fa-exclamation-circle"></i> {{ paymentErrors.cardHolder }}</p>
              </div>
              <div class="field mb-4">
                <label class="text-sm text-[#ccc] font-semibold mb-1 block">Número de tarjeta</label>
                <input v-model="payment.cardNumber" @input="formatCardNumber" :class="['w-full p-3 border-2 rounded-lg bg-[rgba(0,0,0,0.3)] text-white text-sm outline-none transition-colors', paymentErrors.cardNumber ? 'border-red-500' : 'border-[rgba(255,255,255,0.1)] focus:border-[#ff6300]']" placeholder="4111 1111 1111 1111" maxlength="19" />
                <p v-if="paymentErrors.cardNumber" class="text-red-400 text-xs mt-1"><i class="fas fa-exclamation-circle"></i> {{ paymentErrors.cardNumber }}</p>
              </div>
              <div class="flex gap-4 mb-4">
                <div class="flex-1">
                  <label class="text-sm text-[#ccc] font-semibold mb-1 block">Vencimiento</label>
                  <input v-model="payment.expiry" @input="formatExpiry" :class="['w-full p-3 border-2 rounded-lg bg-[rgba(0,0,0,0.3)] text-white text-sm outline-none transition-colors', paymentErrors.expiry ? 'border-red-500' : 'border-[rgba(255,255,255,0.1)] focus:border-[#ff6300]']" placeholder="MM/AA" maxlength="5" />
                  <p v-if="paymentErrors.expiry" class="text-red-400 text-xs mt-1"><i class="fas fa-exclamation-circle"></i> {{ paymentErrors.expiry }}</p>
                </div>
                <div class="w-[120px]">
                  <label class="text-sm text-[#ccc] font-semibold mb-1 block">CVV</label>
                  <input v-model="payment.cvv" @input="paymentErrors.cvv = ''" :class="['w-full p-3 border-2 rounded-lg bg-[rgba(0,0,0,0.3)] text-white text-sm outline-none transition-colors', paymentErrors.cvv ? 'border-red-500' : 'border-[rgba(255,255,255,0.1)] focus:border-[#ff6300]']" placeholder="123" maxlength="4" type="text" inputmode="numeric" />
                  <p v-if="paymentErrors.cvv" class="text-red-400 text-xs mt-1"><i class="fas fa-exclamation-circle"></i> {{ paymentErrors.cvv }}</p>
                </div>
              </div>
              <div v-if="paymentError" class="flex items-center gap-2 bg-[rgba(255,0,0,0.1)] border border-red-500 text-red-400 p-3 rounded-lg mb-4 text-sm">
                <i class="fas fa-exclamation-circle"></i> {{ paymentError }}
              </div>
              <div v-if="paymentResult" class="flex items-center gap-2 bg-[rgba(0,255,0,0.1)] border border-green-500 text-green-400 p-3 rounded-lg mb-4 text-sm">
                <i class="fas fa-check-circle"></i> Pago aprobado ({{ paymentResult.transactionId }})
              </div>
              <button type="submit" :disabled="pagando || paymentResult" class="w-full bg-[#ff6300] text-white py-3 rounded-lg font-bold border-none cursor-pointer text-sm transition-all hover:bg-[#ff7e2e] disabled:opacity-50 disabled:cursor-not-allowed">
                <i v-if="pagando" class="fa-solid fa-spinner fa-spin"></i>
                <i v-else class="fa-solid fa-lock"></i>
                {{ pagando ? 'Procesando...' : `Pagar S/ ${discountedTotal.toFixed(2)}` }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useCartStore } from '../../stores/cart'
import { useToast } from '../../composables/useToast'
import { useCheapShark } from '../../composables/useCheapShark'
import { formatCurrency } from '../../utils/format'
import { paymentService } from '../../services/payment.service'
import { validarTarjeta, validarExpiracion, validarCVV, validarTitular } from '../../utils/validation'

const props = defineProps({ visible: Boolean })
defineEmits(['close'])

const authStore = useAuthStore()
const cartStore = useCartStore()
const toast = useToast()
const { getDeal } = useCheapShark()
const deals = ref({})

const discountedTotal = computed(() => {
  return cartStore.items.reduce((sum, item) => {
    const d = deals.value[item.id]
    return sum + (d ? Number(d.salePrice) : Number(item.precio))
  }, 0)
})

const totalSavings = computed(() => {
  const original = cartStore.items.reduce((sum, item) => sum + Number(item.precio), 0)
  return original - discountedTotal.value
})

async function fetchDeals() {
  const result = {}
  await Promise.all(cartStore.items.map(async (item) => {
    const d = await getDeal(item.titulo)
    if (d) result[item.id] = d
  }))
  deals.value = result
}

watch(() => cartStore.items.length, () => fetchDeals(), { immediate: true })
watch(() => props.visible, (v) => { if (v) fetchDeals() })

const showPaymentModal = ref(false)
const pagando = ref(false)
const paymentError = ref('')
const paymentResult = ref(null)
const payment = reactive({ cardNumber: '', expiry: '', cvv: '', cardHolder: '' })
const paymentErrors = reactive({ cardNumber: '', expiry: '', cvv: '', cardHolder: '' })

function formatCardNumber() {
  payment.cardNumber = payment.cardNumber.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim()
  paymentErrors.cardNumber = ''
}

function formatExpiry() {
  let v = payment.expiry.replace(/\D/g, '')
  if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2)
  payment.expiry = v
  paymentErrors.expiry = ''
}

function validarPayment() {
  paymentErrors.cardHolder = validarTitular(payment.cardHolder)
  paymentErrors.cardNumber = validarTarjeta(payment.cardNumber)
  paymentErrors.expiry = validarExpiracion(payment.expiry)
  paymentErrors.cvv = validarCVV(payment.cvv)
  return !paymentErrors.cardHolder && !paymentErrors.cardNumber && !paymentErrors.expiry && !paymentErrors.cvv
}

function openPaymentModal() {
  if (!authStore.isLoggedIn) {
    toast.show('Debes iniciar sesión para comprar', 'warning')
    return
  }
  if (cartStore.items.length === 0) {
    toast.show('Tu carrito está vacío', 'warning')
    return
  }
  showPaymentModal.value = true
  paymentError.value = ''
  paymentResult.value = null
  payment.cardNumber = ''
  payment.expiry = ''
  payment.cvv = ''
  payment.cardHolder = ''
  Object.keys(paymentErrors).forEach(k => paymentErrors[k] = '')
}

function closePaymentModal() {
  if (pagando.value) return
  showPaymentModal.value = false
}

async function procesarPago() {
  if (!validarPayment()) return
  paymentError.value = ''
  pagando.value = true
  try {
    const juegosDuplicados = cartStore.items.filter(item => authStore.esJuegoComprado(item.id))
    if (juegosDuplicados.length > 0) {
      paymentError.value = `Ya tienes en tu biblioteca: ${juegosDuplicados.map(j => j.titulo).join(', ')}. Retíralos del carrito.`
      pagando.value = false
      return
    }
    const result = await paymentService.simulate({
      cardNumber: payment.cardNumber,
      expiry: payment.expiry,
      cvv: payment.cvv,
      amount: discountedTotal.value,
      cardHolder: payment.cardHolder,
    })
    if (result.success) {
      paymentResult.value = result
      await cartStore.checkout(authStore.user.id)
      authStore.cargarJuegosComprados(authStore.user.id)
      toast.show('¡Compra realizada con éxito!', 'success')
      setTimeout(() => {
        closePaymentModal()
      }, 1500)
    } else {
      paymentError.value = result.message || 'Pago rechazado'
    }
  } catch {
    paymentError.value = 'Error de conexión al procesar el pago'
  } finally {
    pagando.value = false
  }
}

async function removeItem(item) {
  cartStore.removeGame(item.id)
}

async function clearCart() {
  if (cartStore.items.length === 0) return
  if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
    cartStore.clearLocal()
    toast.show('Carrito vaciado', 'success')
  }
}
</script>

<style scoped>
.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 998;
}
.sidebar {
  position: fixed; top: 0; right: 0; width: 400px; max-width: 100vw;
  height: 100vh; background: linear-gradient(to bottom, #2d2d2d, #1a1a1a);
  z-index: 999; box-shadow: -4px 0 20px rgba(0,0,0,0.5);
  display: flex; flex-direction: column;
}
.sidebar-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.25rem; border-bottom: 1px solid #444;
}
.sidebar-header h2 { font-size: 1.25rem; font-weight: bold; display: flex; align-items: center; gap: 0.5rem; color: white; }
.close-btn { background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; }
.close-btn:hover { color: #ff6300; }
.sidebar-body { flex: 1; overflow-y: auto; padding: 1.25rem; }
.empty-cart { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #888; }
.cart-item { display: flex; gap: 1rem; padding: 0.75rem; margin-bottom: 0.75rem; background: rgba(255,255,255,0.03); border-radius: 0.5rem; }
.cart-item-img { width: 80px; height: 96px; object-fit: cover; border-radius: 0.375rem; }
.cart-item-info { flex: 1; min-width: 0; }
.cart-item-title { color: white; font-weight: 600; font-size: 0.875rem; margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cart-item-platform { display: inline-block; background: rgba(255,99,0,0.2); color: #ff6300; font-size: 0.75rem; padding: 0.125rem 0.5rem; border-radius: 9999px; font-weight: 600; }
.cart-item-price { color: #ff6300; font-weight: bold; font-size: 1rem; margin-top: 0.5rem; display: flex; align-items: center; gap: 6px; }
.cart-item-price.discount { color: #10b981; }
.cart-item-price .old-price { color: #888; font-size: 0.85em; text-decoration: line-through; font-weight: normal; }
.cart-item-price .sale-price { color: #10b981; }
.cart-item-price .store-name { font-size: 0.75em; color: #10b981; font-weight: 500; margin-left: 4px; }
.remove-btn { background: none; border: none; color: #888; font-size: 1.25rem; cursor: pointer; align-self: flex-start; }
.remove-btn:hover { color: #ef4444; }
.sidebar-footer { border-top: 1px solid #444; padding: 1.25rem; }
.checkout-btn {
  width: 100%; background: linear-gradient(to right, rgba(255,126,0,0.76), #ff6300);
  color: #000; padding: 0.75rem 1.5rem; font-size: 1rem; font-weight: bold;
  border: none; border-radius: 9999px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  margin-bottom: 0.5rem; transition: transform 0.3s;
}
.checkout-btn:hover { transform: scale(1.05); }
.clear-btn {
  width: 100%; background: transparent; color: white; padding: 0.75rem 1.5rem;
  font-size: 0.875rem; font-weight: 600; border: 2px solid rgba(255,255,255,0.2);
  border-radius: 0.5rem; cursor: pointer; display: flex; align-items: center;
  justify-content: center; gap: 0.5rem; transition: all 0.3s;
}
.clear-btn:hover { background: rgba(255,0,0,0.2); border-color: #ef4444; color: #f87171; }

.payment-overlay {
  position: fixed; inset: 0; z-index: 2000;
  background: rgba(0,0,0,0.8); display: flex;
  align-items: center; justify-content: center;
}
.payment-modal {
  background: linear-gradient(145deg, #2d2d2d, #1a1a1a);
  width: 90%; max-width: 440px; border-radius: 16px;
  overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.7);
  max-height: 90vh; overflow-y: auto;
}
.payment-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.1);
  color: white;
}
.payment-header h2 { font-size: 1.15rem; font-weight: bold; display: flex; align-items: center; gap: 0.5rem; }
.payment-close { background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; }
.payment-close:hover { color: #ff6300; }
.payment-body { padding: 1.25rem; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
.slide-enter-from { transform: translateX(100%); }
.slide-leave-to { transform: translateX(100%); }
</style>
