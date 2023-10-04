<template>
    <div class="container mt-5 text-left">
      <h3 class="my-2">Título del bug: #<router-link :to="`/bug/${bugId}`">{{ bugTitle}}</router-link></h3>
      <p><strong>Username del creador:</strong> <router-link :to="`/user/${bugUser}`">{{ bugUser}}</router-link></p>
      <div v-if="mainComment">
        <h4 class="my-3">Comentario Principal
            <router-link :to="`/add-response/${mainComment.bug}/${mainComment.id}/${mainComment.username}`" class="btn btn-success btn-sm ms-2">Añadir comentario al hilo</router-link>
        </h4>
        <div class="card p-3 mb-3">
          <p><strong>ID:</strong> {{ mainComment.id }}</p>
          <p><strong>Username:</strong> <router-link :to="`/user/${mainComment.username}`">{{ mainComment.username }}</router-link></p>
          <p><strong>Texto del Comentario:</strong> {{ mainComment.texto }}</p>
        </div>
      </div>
      <div v-if="responses.length">
        <h4 class="my-3">Respuestas</h4>
        <div v-for="response in responses" :key="response.id" class="card p-3 mb-2 bg-light">
          <p><strong>ID:</strong> {{ response.id }}</p>
          <p><strong>Nombre de usuario:</strong> <router-link :to="`/user/${response.username}`">{{ response.username }}</router-link></p>
          <p><strong>Texto del Comentario:</strong> {{ response.texto }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'ForoView',
    props: ['id'],
    data() {
      return {
        mainComment: null,
        responses: [],
        bugId: 0,
        bugTitle: '',
        bugUser: ''
      };
    },
    mounted() {
      // Obtener el comentario principal
      axios
        .get(`https://json-server.firstrow2.com/comments/${this.id}`)
        .then((response) => {
          this.mainComment = response.data;
          // Obtener el título del bug
          return axios.get(`https://json-server.firstrow2.com/bugs/${this.mainComment.bug}`);
        })
        .then((response) => {
          this.bugId = response.data.id;
          this.bugTitle = response.data.texto;
          this.bugUser = response.data.username;
        })
        .catch((error) => {
          console.error('Error al obtener el comentario principal:', error);
        });
  
      // Obtener las respuestas del comentario principal
      axios
        .get(`https://json-server.firstrow2.com/comments?response=${this.id}`)
        .then((response) => {
          this.responses = response.data;
        })
        .catch((error) => {
          console.error('Error al obtener las respuestas del comentario:', error);
        });
    },
  };
  </script>
  
  <style scoped>
/* Puedes agregar estilos personalizados aquí */
.card {
  border-radius: 20px;
  position: relative;
  margin-left: 20px;
}
.card::after {
  content: '';
  position: absolute;
  top: 10px;
  left: -10px;
  border: 10px solid transparent;
  border-right-color: #ffffff; /* Color del fondo */
  border-left: 0;
}
</style>