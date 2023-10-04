<template>
  <div class="container mt-5 text-left">
    <h3 class="my-2">Detalles del bug</h3>
    <div class="row justify-content">
      <div class="col-md-12">
        <div v-if="bugData">
          <p><strong>ID:</strong> {{ bugData.id }}</p>
          <p><strong>Username:</strong> {{ bugData.username }}</p>
          <p><strong>Texto del bug:</strong> {{ bugData.texto }}</p>
          <p><strong>Estado: </strong> {{ bugData.closed ? 'Cerrado' : 'Activo' }}</p>
          <!-- Tabla de Comentarios -->
          <h4 class="my-3">Comentarios
            <router-link :to="`/add-comment/${bugData.id}`" class="btn btn-success btn-sm ms-2">Añadir comentario</router-link>
          </h4>
          <table class="table table-bordered mt-2">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Texto del Comentario</th>
                <th>Respuestas</th>
                <th>Acceder al foro</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="comment in nonResponseComments" :key="comment.id">
                <td>{{ comment.id }}</td>
                <td>
                  <router-link :to="`/user/${comment.username}`">{{ comment.username }}</router-link>
                </td>
                <td>{{ comment.texto }}</td>
                <td>{{ countResponses(comment.id) }}</td>
                <td>
                  <router-link :to="`/foro/${comment.id}`" class="btn btn-primary btn-sm me-2">Acceder</router-link>
                  <button v-if="comment.username === loggedInUsername.username" @click="eliminarComentario(comment.id)" class="btn btn-danger btn-sm">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'BugView',
  props: ['id'],
  data() {
    return {
      bugData: null,
      comments: [],
      loggedInUsername: JSON.parse(localStorage.getItem('user') || '{}'),
    };
  },
  computed: {
    // Propiedad calculada para filtrar comentarios que no son respuestas
    nonResponseComments() {
      return this.comments.filter(comment => comment.response === 0);
    },
  },
  mounted() {
    // Llamada para obtener los detalles del bug
    axios
      .get(`http://localhost:5000/bugs/${this.id}`)
      .then((response) => {
        this.bugData = response.data;
      })
      .catch((error) => {
        console.error('Error al obtener los detalles del bug:', error);
      });

    // Llamada separada para obtener los comentarios del bug
    axios
      .get(`http://localhost:5000/comments?bug=${this.id}`)
      .then((response) => {
        this.comments = response.data;
      })
      .catch((error) => {
        console.error('Error al obtener los comentarios del bug:', error);
      });
  },
  methods: {
    countResponses(commentId) {
      return this.comments.filter(comment => comment.response === commentId).length;
    },
    eliminarComentario(commentId) {
      // Asegúrate de que el usuario está autenticado antes de permitirle eliminar un comentario
      if (localStorage.getItem('isAuthenticated') === 'true') {
        axios
          .delete(`http://localhost:5000/comments/${commentId}`)
          .then(() => {
            // Recargar los comentarios después de eliminar uno
            return axios.get(`http://localhost:5000/comments?bug=${this.id}`);
          })
          .then((response) => {
            this.comments = response.data;
          })
          .catch((error) => {
            console.error('Error al eliminar el comentario:', error);
          });
      } else {
        console.error('No tienes permiso para eliminar este comentario.');
      }
    },
  },
};
</script>
