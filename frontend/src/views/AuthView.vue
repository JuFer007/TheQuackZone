<template>
  <AuthLayout>
    <div class="flex min-h-screen">
      <div class="flex-1 flex items-end justify-center bg-gradient-to-br from-[#ff6300] to-[#ff8c42] relative overflow-hidden pb-0">
        <div class="branding-content w-full flex justify-center relative">
          <Transition name="form-fade" mode="out-in">
            <img v-if="activeTab === 'login'" key="login-img" src="/recursos/imagen.png" alt="Login" class="w-[90%] block align-bottom" />
            <img v-else key="register-img" src="/recursos/imagen2.png" alt="Registro" class="w-[90%] block align-bottom" />
          </Transition>
        </div>
      </div>

      <div class="flex-1 flex items-center justify-center bg-[#191919] p-6">
        <div class="w-full max-w-[420px]">
          <a href="/" class="inline-flex items-center gap-2 text-[#888] no-underline mb-4 text-sm hover:text-[#ff6300] transition-colors">
            <i class="fas fa-arrow-left"></i> Volver al inicio
          </a>

          <div class="forms-header mb-5">
            <h2 class="text-2xl font-bold text-white mb-1">¡Bienvenido!</h2>
            <p class="text-[#888] text-sm">Inicia sesión o crea tu cuenta para continuar</p>
          </div>

          <div class="flex mb-8 bg-[#2d2d2d] rounded-lg p-1">
            <button
              :class="['flex-1 py-3 text-center font-semibold rounded-md cursor-pointer transition-all duration-300 text-sm border-none', activeTab === 'login' ? 'bg-[#ff6300] text-white' : 'text-[#888] hover:text-white bg-transparent']"
              @click="activeTab = 'login'"
            >Iniciar Sesión</button>
            <button
              :class="['flex-1 py-3 text-center font-semibold rounded-md cursor-pointer transition-all duration-300 text-sm border-none', activeTab === 'register' ? 'bg-[#ff6300] text-white' : 'text-[#888] hover:text-white bg-transparent']"
              @click="activeTab = 'register'"
            >Registrarse</button>
          </div>

          <Transition name="form-fade" mode="out-in">
            <div v-if="activeTab === 'login'" key="login">
              <div v-if="loginError" class="flex items-center gap-2 bg-[rgba(255,0,0,0.1)] border border-red-500 text-red-400 p-3 rounded-lg mb-4 text-sm">
                <i class="fas fa-exclamation-circle"></i> {{ loginError }}
              </div>

              <form @submit.prevent="handleLogin" novalidate>
                <div class="mb-3">
                  <label class="block text-sm font-semibold text-white mb-1">Correo Electrónico</label>
                  <div class="relative">
                    <input type="email" v-model.trim="loginForm.email" @blur="validarCampo('login', 'email')" @input="limpiarError('login', 'email')" :class="['w-full bg-[#2d2d2d] text-white border-2 rounded-lg px-3 py-2.5 pr-12 text-sm focus:outline-none transition-colors', loginErrors.email ? 'border-red-500' : 'border-[#444] focus:border-[#ff6300]']" placeholder="tu@email.com" />
                    <i class="fas fa-envelope absolute right-4 top-1/2 -translate-y-1/2 text-[#888]"></i>
                  </div>
                  <p v-if="loginErrors.email" class="text-red-400 text-xs mt-1 flex items-center gap-1"><i class="fas fa-exclamation-circle"></i> {{ loginErrors.email }}</p>
                </div>

                <div class="mb-3">
                  <label class="block text-sm font-semibold text-white mb-1">Contraseña</label>
                  <div class="relative">
                    <input :type="showLoginPw ? 'text' : 'password'" v-model="loginForm.password" @blur="validarCampo('login', 'password')" @input="limpiarError('login', 'password')" :class="['w-full bg-[#2d2d2d] text-white border-2 rounded-lg px-3 py-2.5 pr-12 text-sm focus:outline-none transition-colors', loginErrors.password ? 'border-red-500' : 'border-[#444] focus:border-[#ff6300]']" placeholder="••••••••" />
                    <i class="fas fa-lock absolute right-12 top-1/2 -translate-y-1/2 text-[#888]"></i>
                    <button type="button" @click="showLoginPw = !showLoginPw" class="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#888] cursor-pointer">
                      <i :class="showLoginPw ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                  <p v-if="loginErrors.password" class="text-red-400 text-xs mt-1 flex items-center gap-1"><i class="fas fa-exclamation-circle"></i> {{ loginErrors.password }}</p>
                </div>

                <button type="submit" :disabled="loginLoading" class="w-full bg-accent-gradient text-black py-2.5 px-5 text-sm font-bold border-none rounded-lg cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                  <i v-if="loginLoading" class="fa-solid fa-spinner fa-spin"></i>
                  <i v-else class="fas fa-sign-in-alt"></i> {{ loginLoading ? 'Ingresando...' : 'Iniciar Sesión' }}
                </button>
              </form>

              <div class="flex items-center gap-4 my-4">
                <div class="flex-1 h-px bg-[#444]"></div>
                <span class="text-[#888] text-xs">O continúa con</span>
                <div class="flex-1 h-px bg-[#444]"></div>
              </div>

              <div class="flex gap-3">
                <button class="flex-1 flex items-center justify-center gap-2 bg-[#2d2d2d] text-white border-2 border-[#444] rounded-lg py-3 text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-[#ff6300] hover:text-white hover:border-[#ff6300]">
                  <i class="fab fa-google"></i> Google
                </button>
                <button class="flex-1 flex items-center justify-center gap-2 bg-[#2d2d2d] text-white border-2 border-[#444] rounded-lg py-3 text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-[#ff6300] hover:text-white hover:border-[#ff6300]">
                  <i class="fab fa-facebook-f"></i> Facebook
                </button>
              </div>
            </div>

            <div v-else key="register">
              <div v-if="registerError" class="flex items-center gap-2 bg-[rgba(255,0,0,0.1)] border border-red-500 text-red-400 p-3 rounded-lg mb-4 text-sm">
                <i class="fas fa-exclamation-circle"></i> {{ registerError }}
              </div>
              <div v-if="registerSuccess" class="flex items-center gap-2 bg-[rgba(0,255,0,0.1)] border border-green-500 text-green-400 p-3 rounded-lg mb-4 text-sm">
                <i class="fas fa-check-circle"></i> ¡Cuenta creada exitosamente!
              </div>

              <form @submit.prevent="handleRegister" novalidate>
                <div class="mb-3">
                  <label class="block text-sm font-semibold text-white mb-1">Nombre Completo</label>
                  <div class="relative">
                    <input type="text" v-model.trim="registerForm.nombre" @blur="validarCampo('register', 'nombre')" @input="limpiarError('register', 'nombre')" :class="['w-full bg-[#2d2d2d] text-white border-2 rounded-lg px-3 py-2.5 pr-12 text-sm focus:outline-none transition-colors', regErrors.nombre ? 'border-red-500' : 'border-[#444] focus:border-[#ff6300]']" placeholder="Juan Pérez" />
                    <i class="fas fa-user absolute right-4 top-1/2 -translate-y-1/2 text-[#888]"></i>
                  </div>
                  <p v-if="regErrors.nombre" class="text-red-400 text-xs mt-1 flex items-center gap-1"><i class="fas fa-exclamation-circle"></i> {{ regErrors.nombre }}</p>
                </div>

                <div class="mb-3">
                  <label class="block text-sm font-semibold text-white mb-1">Correo Electrónico</label>
                  <div class="relative">
                    <input type="email" v-model.trim="registerForm.correo" @blur="validarCampo('register', 'correo')" @input="limpiarError('register', 'correo')" :class="['w-full bg-[#2d2d2d] text-white border-2 rounded-lg px-3 py-2.5 pr-12 text-sm focus:outline-none transition-colors', regErrors.correo ? 'border-red-500' : 'border-[#444] focus:border-[#ff6300]']" placeholder="tu@email.com" />
                    <i class="fas fa-envelope absolute right-4 top-1/2 -translate-y-1/2 text-[#888]"></i>
                  </div>
                  <p v-if="regErrors.correo" class="text-red-400 text-xs mt-1 flex items-center gap-1"><i class="fas fa-exclamation-circle"></i> {{ regErrors.correo }}</p>
                </div>

                <div class="mb-3">
                  <label class="block text-sm font-semibold text-white mb-1">Número de Teléfono</label>
                  <div class="relative">
                    <input type="text" v-model="registerForm.numeroTelefono" @blur="validarCampo('register', 'telefono')" @input="limpiarError('register', 'telefono')" :class="['w-full bg-[#2d2d2d] text-white border-2 rounded-lg px-3 py-2.5 pr-12 text-sm focus:outline-none transition-colors', regErrors.telefono ? 'border-red-500' : 'border-[#444] focus:border-[#ff6300]']" placeholder="999 999 999" />
                    <i class="fas fa-mobile-screen absolute right-4 top-1/2 -translate-y-1/2 text-[#888]"></i>
                  </div>
                  <p v-if="regErrors.telefono" class="text-red-400 text-xs mt-1 flex items-center gap-1"><i class="fas fa-exclamation-circle"></i> {{ regErrors.telefono }}</p>
                </div>

                <div class="mb-3">
                  <label class="block text-sm font-semibold text-white mb-1">Contraseña</label>
                  <div class="relative">
                    <input :type="showRegPw ? 'text' : 'password'" v-model="registerForm.contraseña" @blur="validarCampo('register', 'contraseña')" @input="limpiarError('register', 'contraseña')" :class="['w-full bg-[#2d2d2d] text-white border-2 rounded-lg px-3 py-2.5 pr-12 text-sm focus:outline-none transition-colors', regErrors.contraseña ? 'border-red-500' : 'border-[#444] focus:border-[#ff6300]']" placeholder="••••••••" />
                    <i class="fas fa-lock absolute right-12 top-1/2 -translate-y-1/2 text-[#888]"></i>
                    <button type="button" @click="showRegPw = !showRegPw" class="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#888] cursor-pointer">
                      <i :class="showRegPw ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                  <p v-if="regErrors.contraseña" class="text-red-400 text-xs mt-1 flex items-center gap-1"><i class="fas fa-exclamation-circle"></i> {{ regErrors.contraseña }}</p>
                </div>

                <div class="mb-3">
                  <label class="block text-sm font-semibold text-white mb-1">Confirmar Contraseña</label>
                  <div class="relative">
                    <input :type="showRegPw ? 'text' : 'password'" v-model="registerForm.confirmarContraseña" @blur="validarCampo('register', 'confirmar')" @input="limpiarError('register', 'confirmar')" :class="['w-full bg-[#2d2d2d] text-white border-2 rounded-lg px-3 py-2.5 pr-12 text-sm focus:outline-none transition-colors', regErrors.confirmar ? 'border-red-500' : 'border-[#444] focus:border-[#ff6300]']" placeholder="••••••••" />
                    <i class="fas fa-lock absolute right-12 top-1/2 -translate-y-1/2 text-[#888]"></i>
                    <button type="button" @click="showRegPw = !showRegPw" class="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#888] cursor-pointer">
                      <i :class="showRegPw ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                  <p v-if="regErrors.confirmar" class="text-red-400 text-xs mt-1 flex items-center gap-1"><i class="fas fa-exclamation-circle"></i> {{ regErrors.confirmar }}</p>
                </div>

                <div class="mb-3">
                  <label class="flex items-start gap-2 text-sm text-[#888] cursor-pointer">
                    <input type="checkbox" v-model="registerForm.terms" class="accent-[#ff6300] mt-0.5" @change="regErrors.terms = registerForm.terms ? '' : 'Debes aceptar los términos y condiciones'" />
                    Acepto los <a href="#" class="text-[#ff6300] no-underline ml-1">términos y condiciones</a>
                  </label>
                  <p v-if="regErrors.terms" class="text-red-400 text-xs mt-1 flex items-center gap-1"><i class="fas fa-exclamation-circle"></i> {{ regErrors.terms }}</p>
                </div>

                <button type="submit" :disabled="regLoading" class="w-full bg-accent-gradient text-black py-2.5 px-5 text-sm font-bold border-none rounded-lg cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                  <i v-if="regLoading" class="fa-solid fa-spinner fa-spin"></i>
                  <i v-else class="fas fa-user-plus"></i> {{ regLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
                </button>
              </form>

              <div class="flex items-center gap-4 my-4">
                <div class="flex-1 h-px bg-[#444]"></div>
                <span class="text-[#888] text-xs">O regístrate con</span>
                <div class="flex-1 h-px bg-[#444]"></div>
              </div>

              <div class="flex gap-3">
                <button class="flex-1 flex items-center justify-center gap-2 bg-[#2d2d2d] text-white border-2 border-[#444] rounded-lg py-3 text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-[#ff6300] hover:text-white hover:border-[#ff6300]">
                  <i class="fab fa-google"></i> Google
                </button>
                <button class="flex-1 flex items-center justify-center gap-2 bg-[#2d2d2d] text-white border-2 border-[#444] rounded-lg py-3 text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-[#ff6300] hover:text-white hover:border-[#ff6300]">
                  <i class="fab fa-facebook-f"></i> Facebook
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '../layouts/AuthLayout.vue'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../composables/useToast'
import { validarEmail, validarNombre, validarTelefono, validarPassword, validarConfirmarPassword } from '../utils/validation'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const activeTab = ref('login')
const showLoginPw = ref(false)
const showRegPw = ref(false)
const loginError = ref('')
const registerSuccess = ref(false)
const loginLoading = ref(false)
const regLoading = ref(false)

const loginForm = reactive({ email: '', password: '' })
const loginErrors = reactive({ email: '', password: '' })
const registerForm = reactive({ nombre: '', correo: '', numeroTelefono: '', contraseña: '', confirmarContraseña: '', terms: false })

const regErrors = reactive({ nombre: '', correo: '', telefono: '', contraseña: '', confirmar: '', terms: '' })

function validarCampo(form, campo) {
  if (form === 'login') {
    if (campo === 'email') loginErrors.email = validarEmail(loginForm.email)
    if (campo === 'password') loginErrors.password = validarPassword(loginForm.password)
  } else {
    if (campo === 'nombre') regErrors.nombre = validarNombre(registerForm.nombre)
    if (campo === 'correo') regErrors.correo = validarEmail(registerForm.correo)
    if (campo === 'telefono') regErrors.telefono = validarTelefono(registerForm.numeroTelefono)
    if (campo === 'contraseña') {
      regErrors.contraseña = validarPassword(registerForm.contraseña)
      if (registerForm.confirmarContraseña) regErrors.confirmar = validarConfirmarPassword(registerForm.contraseña, registerForm.confirmarContraseña)
    }
    if (campo === 'confirmar') regErrors.confirmar = validarConfirmarPassword(registerForm.contraseña, registerForm.confirmarContraseña)
  }
}

function limpiarError(form, campo) {
  if (form === 'login') {
    loginErrors[campo] = ''
    loginError.value = ''
  } else {
    regErrors[campo] = ''
  }
}

function loginValido() {
  const e = validarEmail(loginForm.email)
  const p = validarPassword(loginForm.password)
  loginErrors.email = e
  loginErrors.password = p
  return !e && !p
}

function registroValido() {
  regErrors.nombre = validarNombre(registerForm.nombre)
  regErrors.correo = validarEmail(registerForm.correo)
  regErrors.telefono = validarTelefono(registerForm.numeroTelefono)
  regErrors.contraseña = validarPassword(registerForm.contraseña)
  regErrors.confirmar = validarConfirmarPassword(registerForm.contraseña, registerForm.confirmarContraseña)
  regErrors.terms = registerForm.terms ? '' : 'Debes aceptar los términos y condiciones'
  return !regErrors.nombre && !regErrors.correo && !regErrors.telefono && !regErrors.contraseña && !regErrors.confirmar && !regErrors.terms
}

async function handleLogin() {
  if (!loginValido()) return
  loginError.value = ''
  loginLoading.value = true
  try {
    await authStore.login(loginForm.email, loginForm.password)
    toast.show('¡Inicio de sesión exitoso!', 'success')
    router.push('/')
  } catch (err) {
    loginError.value = err.response?.data?.message || 'Correo o contraseña incorrectos'
  } finally {
    loginLoading.value = false
  }
}

async function handleRegister() {
  if (!registroValido()) return
  registerSuccess.value = false
  regLoading.value = true
  try {
    await authStore.register({
      nombre: registerForm.nombre.trim(),
      correo: registerForm.correo.trim(),
      numeroTelefono: registerForm.numeroTelefono.trim(),
      contraseña: registerForm.contraseña,
    })
    registerSuccess.value = true
    setTimeout(() => {
      activeTab.value = 'login'
      loginForm.email = registerForm.correo.trim()
      registerSuccess.value = false
    }, 1500)
  } catch (err) {
    const msj = err.response?.data?.message || 'Error al crear la cuenta'
    if (err.response?.data?.message?.toLowerCase().includes('correo')) regErrors.correo = msj
    else if (err.response?.data?.message?.toLowerCase().includes('teléfono') || err.response?.data?.message?.toLowerCase().includes('telefono')) regErrors.telefono = msj
    else regErrors.nombre = msj
  } finally {
    regLoading.value = false
  }
}
</script>

<style scoped>
.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 0.3s ease;
}
.form-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.form-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
