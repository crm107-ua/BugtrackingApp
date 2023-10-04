<template>
    <div class="container text-center mt-5">
      <h3 class="my-3">Detalles del usuario</h3>
      <div v-if="userData">
        <p>ID: {{ userData.id }}</p>
        <p>Nombre de usuario: {{ userData.username }}</p>
        <p>Correo electrónico: {{ userData.email }}</p>
        <p>Administrador: {{ userData.admin }}</p>
        <!-- Agregamos una tabla con los bugs del usuario -->
        <h4 class="my-3 mt-5 mb-4">Bugs del usuario
          <router-link :to="`/add-bug`" class="btn btn-success btn-sm ms-2">Añadir bug</router-link>
        </h4>
        <table class="table table-bordered  mt-2">
          <thead>
            <tr>
              <th>ID</th>
              <th>Texto del Bug</th>
              <th>Estado</th>
              <th>Opciones</th>
              <!-- Agrega más columnas si es necesario -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="bug in userBugs" :key="bug.id">
              <td>{{ bug.id }}</td>
              <td>{{ bug.texto }}</td>
              <td>{{ bug.closed ? 'Cerrado' : 'Activo' }}</td>
              <td>
                <router-link :to="`/bug/${bug.id}`" class="btn btn-primary btn-sm me-2">Acceder</router-link>
                <!-- Aquí se agrega la directiva v-if -->
                <router-link 
                v-if="loggedInUser.username === bug.username || loggedInUser.admin" 
                  :to="`/edit-bug/${bug.id}`" 
                  class="btn btn-secondary btn-sm me-2">
                  Editar
                </router-link>
                <button 
                  v-if="loggedInUser.username === userData.username" 
                  @click="eliminarBug(bug.id)" 
                  class="btn btn-danger btn-sm">
                  Eliminar
                </button>              
              </td>
              <!-- Agrega más columnas si es necesario -->
            </tr>
          </tbody>
        </table>
        <h4 class="my-3 mt-5 mb-4">Comentarios del usuario</h4>
    <table class="table table-bordered mt-2">
      <thead>
        <tr>
          <th>ID</th>
          <th>Texto del Comentario</th>
          <th>Tipo</th>
          <th>Opciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="comment in userComments" :key="comment.id">
          <td>{{ comment.id }}</td>
          <td>{{ comment.texto }}</td>
          <td>{{ comment.response === 0 ? 'General' : 'Respuesta' }}</td>
          <td>
            <router-link 
              :to="`/foro/${comment.id}`" 
              class="btn btn-primary btn-sm me-2">
              Acceder
            </router-link>
            <button 
              v-if="isAuthenticated && loggedInUser.username === comment.username" 
              @click="eliminarComentario(comment.id)" 
              class="btn btn-danger btn-sm">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
        <!-- Fin de la tabla de bugs del usuario -->
      </div>
    </div>
  </template>
  
  <script>
import axios from 'axios';

export default {
  name: 'UserView',
  props: ['username'],
  data() {
    return {
      userData: null,
      userBugs: [],
      userComments: [],
      isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
      loggedInUser: JSON.parse(localStorage.getItem('user') || '{}'),
    };
  },
  mounted() {
    // Obtener datos del usuario y bugs
    this.obtenerDatosUsuario();
    this.obtenerBugsUsuario();
    this.obtenerComentariosUsuario();
  },
  methods: {
    obtenerDatosUsuario() {
      axios
        .get(`https://json-server.firstrow2.com/users?username=${this.username}`)
        .then((response) => {
          if (response.data.length > 0) {
            this.userData = response.data[0];
          }
        })
        .catch((error) => {
          console.error('Error al obtener los datos del usuario:', error);
        });
    },
    obtenerBugsUsuario() {
      axios
        .get(`https://json-server.firstrow2.com/bugs?username=${this.username}`)
        .then((response) => {
          this.userBugs = response.data;
        })
        .catch((error) => {
          console.error('Error al obtener los bugs del usuario:', error);
        });
    },
    eliminarBug(bugId) {
      axios
        .delete(`https://json-server.firstrow2.com/bugs/${bugId}`)
        .then(() => {
          this.obtenerBugsUsuario();
          console.log(`Bug ${bugId} eliminado.`);
        })
        .catch((error) => {
          console.error('Error al eliminar el bug:', error);
        });
    },
    obtenerComentariosUsuario() {
      axios
        .get(`https://json-server.firstrow2.com/comments?username=${this.username}`)
        .then((response) => {
          this.userComments = response.data;
        })
        .catch((error) => {
          console.error('Error al obtener los comentarios del usuario:', error);
        });
    },
    eliminarComentario(commentId) {
      axios
        .delete(`https://json-server.firstrow2.com/comments/${commentId}`)
        .then(() => {
          this.obtenerComentariosUsuario();
          console.log(`Comentario ${commentId} eliminado.`);
        })
        .catch((error) => {
          console.error('Error al eliminar el comentario:', error);
        });
    },
  },
};
</script>