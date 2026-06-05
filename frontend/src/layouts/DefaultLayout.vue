<template>
  <div>
    <AppHeader @open-cart="cartOpen = true" />
    <CartSidebar :visible="cartOpen" @close="cartOpen = false" />
    <ToastContainer />
    <main class="wrapper">
      <slot />
    </main>
    <footer class="home-footer">
      <div class="footer-content">
        <img src="/recursos/logoPagina.png" alt="TheQuackZone" class="footer-logo" />
        <p class="footer-copy">&copy; 2026 TheQuackZone. Todos los derechos reservados.</p>
        <div class="social-icons">
          <a href="#"><i class="fa-brands fa-facebook"></i></a>
          <a href="#"><i class="fa-brands fa-twitter"></i></a>
          <a href="#"><i class="fa-brands fa-instagram"></i></a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '../components/common/AppHeader.vue'
import CartSidebar from '../components/common/CartSidebar.vue'
import ToastContainer from '../components/common/ToastContainer.vue'

const cartOpen = ref(false)
</script>

<style scoped>
.home-footer {
  background: #2a2a2a;
  color: #ccc; margin-top: 60px;
}
.footer-content {
  max-width: 1400px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 60px; height: 90px;
}
.footer-logo { height: 45px; }
.footer-copy { color: #999; font-size: 0.9rem; white-space: nowrap; }
.social-icons { display: flex; gap: 12px; }
.social-icons a {
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(255,255,255,0.08);
  display: flex; align-items: center; justify-content: center;
  color: #999; font-size: 1.1rem; transition: all 0.3s; text-decoration: none;
}
.social-icons a:hover { background: #ff6300; color: white; transform: scale(1.1); }
@media (max-width: 768px) {
  .footer-content { flex-direction: column; height: auto; gap: 15px; padding: 25px 20px; }
  .footer-copy { font-size: 0.8rem; }
}
</style>
