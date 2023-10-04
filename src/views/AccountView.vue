<template>
  <div class="container text-center mt-5">
    <h3 class="my-3">Mi cuenta</h3>
    <!-- Muestra el saludo solo si userData existe -->
    <div v-if="userData">
      <p>Hola, {{ userData.username }}!</p>
      <p>Tu número de identificación es: {{ userData.id }}</p>
      <p>Correo electrónico: {{ userData.email }}</p>
      <p>Administrador: {{ userData.admin }}</p>
      <div class="my-5">
        <h4>Comentarios con más respuestas</h4>
        <!-- Asegúrate de que el elemento canvas tenga un tamaño definido -->
        <canvas ref="chart" width="200" height="40"></canvas>
      </div>
      <!-- Agregamos una tabla con los bugs del usuario -->
      <h4 class="my-3 mt-5 mb-4">Mis bugs        
        <router-link :to="`/add-bug`" class="btn btn-success btn-sm ms-2">Añadir bug</router-link>
      </h4>
      <table class="table table-bordered mt-2">
        <thead>
          <tr>
            <th>ID</th>
            <th>Texto del Bug</th>
            <th>Estado</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bug in userBugs" :key="bug.id">
            <td>{{ bug.id }}</td>
            <td>{{ bug.texto }}</td>
            <td>{{ bug.closed ? 'Cerrado' : 'Activo' }}</td>
            <td>
              <router-link :to="`/bug/${bug.id}`" class="btn btn-primary btn-sm me-2">Acceder</router-link>
              <router-link 
                :to="`/edit-bug/${bug.id}`" 
                class="btn btn-secondary btn-sm me-2">
                Editar
              </router-link>
              <button @click="eliminarBug(bug.id)" class="btn btn-danger btn-sm">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Fin de la tabla de bugs del usuario -->
      <h4 class="my-3 mt-5 mb-4">Mis comentarios</h4>
      <table class="table table-bordered mt-2">
        <thead>
          <tr>
            <th>ID</th>
            <th>Texto del Comentario</th>
            <th>Tipo</th>
            <th>Respuestas</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="comment in userComments" :key="comment.id">
            <td>{{ comment.id }}</td>
            <td>{{ comment.texto }}</td>
            <td>{{ comment.response === 0 ? 'General' : 'Respuesta' }}</td>
            <td>{{ countResponses(comment.id) }}</td>
            <td>
              <router-link 
                :to="`/foro/${comment.id}`" 
                class="btn btn-primary btn-sm me-2">
                Acceder
              </router-link>
              <button @click="eliminarComentario(comment.id)" class="btn btn-danger btn-sm">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Muestra un mensaje de error si userData no existe -->
    <div v-else>
      <p>No se pudo cargar la información del usuario.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Chart from 'chart.js/auto';

export default {
  name: 'AccountView',
  data() {
    return {
      userData: JSON.parse(localStorage.getItem('user') || '{}'),
      userBugs: [],
      userComments: []
    };
  },
  mounted() {
    this.obtenerBugsUsuario();
    this.obtenerComentariosUsuario();
  },
  methods: {
    generarGraficaComentarios() {
      // Filtrar los 5 comentarios con más respuestas
      const comentariosMasRespuestas = this.userComments
        .map(comment => ({
          id: comment.id,
          texto: comment.texto,
          count: this.countResponses(comment.id),
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Obtener los datos necesarios para la gráfica
      const labels = comentariosMasRespuestas.map(comment => comment.texto);
      const data = comentariosMasRespuestas.map(comment => comment.count);
      console.log(comentariosMasRespuestas);
      // Crear la gráfica
      const chartCanvas = this.$refs.chart;
      const ctx = chartCanvas.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Respuestas',
              data,
              backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color de fondo
              borderColor: 'rgba(75, 192, 192, 1)', // Color del borde
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: 20, // Establecer el valor máximo de la escala Y
            },
          },
        },
      });
    },
      obtenerBugsUsuario() {
        if (this.userData && this.userData.username) {
          axios
            .get(`http://localhost:5000/bugs?username=${this.userData.username}`)
            .then((response) => {
              this.userBugs = response.data;
            })
            .catch((error) => {
              console.error('Error al obtener los bugs del usuario:', error);
            });
        }
      },
      eliminarBug(bugId) {
        axios
          .delete(`http://localhost:5000/bugs/${bugId}`)
          .then(() => {
            this.obtenerBugsUsuario();
            console.log(`Bug ${bugId} eliminado.`);
          })
          .catch((error) => {
            console.error('Error al eliminar el bug:', error);
          });
      },
      obtenerComentariosUsuario() {
        if (this.userData && this.userData.username) {
          axios
            .get(`http://localhost:5000/comments?username=${this.userData.username}`)
            .then((response) => {
              this.userComments = response.data;
              this.ordenarComentariosPorRespuestas();
              this.generarGraficaComentarios();
            })
            .catch((error) => {
              console.error('Error al obtener los comentarios del usuario:', error);
            });
        }
      },
      eliminarComentario(commentId) {
        axios
          .delete(`http://localhost:5000/comments/${commentId}`)
          .then(() => {
            this.obtenerComentariosUsuario();
            console.log(`Comentario ${commentId} eliminado.`);
          })
          .catch((error) => {
            console.error('Error al eliminar el comentario:', error);
          });
      },
      countResponses(commentId) {
        return this.userComments.filter(comment => comment.response === commentId).length;
      },
      ordenarComentariosPorRespuestas() {
        this.userComments.sort((a, b) => {
          const respuestasA = this.countResponses(a.id);
          const respuestasB = this.countResponses(b.id);
          return respuestasB - respuestasA;
        });
      },
    },
};
</script>
