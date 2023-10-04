<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand ms-3" href="/">BugtrackingApp</a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item active" v-if="!isAuthenticated">
          <a class="nav-link" href="/register">Registro</a>
        </li>
        <li class="nav-item active" v-if="!isAuthenticated">
          <a class="nav-link" href="/login">Iniciar sesión</a>
        </li>
        <li class="nav-item active" v-if="isAuthenticated">
          <a class="nav-link" href="/account">Mi cuenta</a>
        </li>
        <li class="nav-item active" v-if="isAuthenticated">
          <a class="nav-link" href="/" @click="logout">Cerrar sesión</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { EventBus } from '@/router/event-bus.js';
export default {
  data() {
    return {
      isAuthenticated: localStorage.getItem('isAuthenticated') === 'true'
    };
  },
  created() {
    EventBus.on('authStatusChanged', this.handleAuthStatusChanged);
  },
  methods: {
    logout(event) {
      // Prevenir que el enlace realice la navegación
      event.preventDefault();
      // Eliminar el token de autenticación del localStorage
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      // Establecer isAuthenticated a false
      this.isAuthenticated = false;
      // Emitir el evento authStatusChanged con valor false
      EventBus.emit('authStatusChanged', false);
      this.$router.push('/');
    },
    handleAuthStatusChanged(newAuthStatus) {
      this.isAuthenticated = newAuthStatus;
    }
  },
  beforeUnmount() {
    EventBus.off('authStatusChanged', this.handleAuthStatusChanged);
  }
};
</script>


