<template>
  <div class="container text-center mt-5">
    <h3 class="my-5">Bienvenido a BugtrackingApp</h3>
    <div class="row justify-content-center">
      <div class="col-md-3 mb-4" v-if="showCard1">
        <a href="/bugs" class="btn mx-2">
          <div class="card d-flex flex-column"> <!-- Añadidas clases aquí -->
            <img src="https://media.istockphoto.com/id/1011619072/photo/computer-bug-failure-or-error-of-software-and-hardware-concept-miniature-red-ladybug-on-black.webp?b=1&s=170667a&w=0&k=20&c=VmW34tsg7jffwLFrs_XgFhE7aavZamcaiBTerK-BKFc=" class="card-img-top" alt="Imagen 1">
            <div class="card-body flex-grow-1"> <!-- Añadida clase aquí -->
              <h5 class="card-title">Añadir un bug</h5>
              <p class="card-text">En esta sección podrás añadir un bug</p>
            </div>
          </div>
        </a>
      </div>
      <div class="col-md-3 mb-4" v-if="showCard2">
        <a href="/search" class="btn mx-2">
          <div class="card d-flex flex-column"> <!-- Añadidas clases aquí -->
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIkm0s6ZvRY_sWKfKkJ7MliKj8VhTzFY0onIpewIHyEi5zfKxZSxeS6hiVYnWgRmedqT4&usqp=CAU" class="card-img-top" alt="Imagen 2">
            <div class="card-body flex-grow-1"> <!-- Añadida clase aquí -->
              <h5 class="card-title">Buscar</h5>
              <p class="card-text">En esta sección podrás buscar un bug</p>
            </div>
          </div>
        </a>
      </div>
      <div class="col-md-3 mb-4" v-if="showCard3 && isAuthenticated">
        <a href="/account" class="btn mx-2">
          <div class="card d-flex flex-column"> <!-- Añadidas clases aquí -->
            <img src="https://t3.ftcdn.net/jpg/02/31/68/56/360_F_231685699_XRQdwOTRGwYz9Pq8w6h5X48BMhDK0S0N.jpg" class="card-img-top" alt="Imagen 2">
            <div class="card-body flex-grow-1"> <!-- Añadida clase aquí -->
              <h5 class="card-title">Mi cuenta</h5>
              <p class="card-text">Administra tus bugs y posts. Observa como evoluciona tu comunidad.</p>
            </div>
          </div>
        </a>
      </div>
      <div class="col-md-3 mb-4" v-if="!isAuthenticated && showCard3">
        <a href="/register" class="btn mx-2">
          <div class="card d-flex flex-column"> <!-- Añadidas clases aquí -->
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy2fsjpgSpidvfxf6YtS--UQdec6ZyV_B-eQ&usqp=CAU" class="card-img-top" alt="Imagen 3">
            <div class="card-body flex-grow-1"> <!-- Añadida clase aquí -->
              <h5 class="card-title">Abrir una nueva cuenta</h5>
              <p class="card-text">Regístrate en BugtrackingApp</p>
            </div>
          </div>
        </a>
      </div>
      <div class="col-md-3 mb-4" v-if="!isAuthenticated && showCard4">
        <a href="/login" class="btn mx-2">
          <div class="card d-flex flex-column"> <!-- Añadidas clases aquí -->
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs5mQ6ay0VmhqEMvRcf_M0cp_Fcc-yuhZ89aLn7TK5gu2xlNzpp3_iotZRTzAYxgTWyEo&usqp=CAU" class="card-img-top" alt="Imagen 4">
            <div class="card-body flex-grow-1"> <!-- Añadida clase aquí -->
              <h5 class="card-title">Iniciar sesión</h5>
              <p class="card-text">Inicia sesión en en BugtrackingApp y empieza a compartir tu mundo dev</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>


<script>
import { EventBus } from '@/router/event-bus.js';
export default {
  name: 'HomeView',
  data() {
    return {
      isAuthenticated: false,
      showCard1: true, // Controla la visibilidad de las tarjetas
      showCard2: true,
      showCard3: true,
      showCard4: true,
    };
  },
  created() {
    this.isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    EventBus.on('authStatusChanged', this.handleAuthStatusChanged);
  },
  methods: {
    handleAuthStatusChanged(newAuthStatus) {
      this.isAuthenticated = newAuthStatus;
      if (newAuthStatus) {
        this.showCard3 = false;
        this.showCard4 = false;
      } else {
        this.showCard3 = true;
        this.showCard4 = true;
      }
    }
  },
  beforeUnmount() {
    EventBus.off('authStatusChanged', this.handleAuthStatusChanged);
  }
};
</script>

<style scoped>
h3,h5,p {
  color: white;
}
.card{
  box-shadow: 0 0 6px rgba(0,0,0,0.5);
  background-color: rgb(5, 46, 71);
  height: 400px;
  width: 80%;
}

.card img {
  height: 200px;
  width: 100%;
  object-fit: cover;
  border-radius: 5%;
}
</style>