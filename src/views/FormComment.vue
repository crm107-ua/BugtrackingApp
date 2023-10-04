<template>
  <div class="container mx-auto mt-5" style="width:30%">
    <h3 v-if="!responseId">Añadir Comentario</h3>
    <h3 v-else>Responder al Comentario de {{ responseUsername }} en el Bug {{ bugId }}</h3>
    <form @submit.prevent="addComment()">
      <div class="form-group mt-1">
        <label for="texto" class="mb-1 mt-3">Texto del Comentario</label>
        <textarea v-model="texto" class="form-control" id="texto" rows="3"></textarea>
      </div>
      <button type="submit" class="btn btn-primary mt-3 me-2">Añadir</button>
      <router-link :to="`/bug/${bugId}`" class="btn btn-secondary mt-3">Volver</router-link>
    </form>
    <div v-if="message" :class="{'text-success': isSuccess, 'text-danger': !isSuccess, 'mt-3': true}">
      {{ message }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FormCommentView',
  props: ['bugId', 'responseId', 'responseUsername'],
  data() {
    return {
      texto: '',
      message: '',
      isSuccess: false,
      loggedInUsername: JSON.parse(localStorage.getItem('user') || '{}'),
    };
  },
  methods: {
    addComment() {
      const newComment = {
        username: this.loggedInUsername.username,
        texto: this.texto,
        bug: parseInt(this.bugId),
        response: this.responseId ? parseInt(this.responseId) : 0
      };
      axios.post('http://localhost:5000/comments', newComment)
        .then(() => {
          this.message = 'Comentario añadido exitosamente!';
          this.isSuccess = true;
        })
        .catch(() => {
          this.message = 'Error al añadir el comentario!';
          this.isSuccess = false;
        });
    },
  },
};
</script>

<style>
/* Aquí puedes añadir estilos específicos para el formulario de comentarios si lo necesitas */
</style>
