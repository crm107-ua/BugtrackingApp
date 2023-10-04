<template>
  <div class="container mx-auto mt-5" style="width:30%">
    <notification-component></notification-component>
    <h3 v-if="isEditing">Modificar Bug</h3>
    <h3 v-else>Añadir Bug</h3>
    <form @submit.prevent="isEditing ? modifyBug() : addBug()">
      <div class="form-group mt-1">
        <label for="texto" class="mb-1">Texto del Bug</label>
        <textarea v-model="texto" class="form-control" id="texto" rows="3"></textarea>
      </div>
      <!-- Añadir el checkbox para modificar el estado closed cuando se está editando -->
      <div class="form-group mt-3" v-if="isEditing && this.loggedInUsername.admin">
        <label for="closed" class="mb-1">Estado del bug:</label>
        <select v-model="closed" id="closed" class="form-control mx-2">
          <option :value="true">Cerrado</option>
          <option :value="false">Abierto</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary mt-3 me-2">
        {{ isEditing ? 'Modificar' : 'Añadir' }}
      </button>
      <a :href="`/bugs`" class="btn btn-secondary mt-3">
        Volver
      </a>
    </form>
    <div v-if="message" :class="{'text-success': isSuccess, 'text-danger': !isSuccess, 'mt-3': true}">
      {{ message }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
name: 'FormBugView',
props: ['id'], 
data() {
  return {
    bugId: this.id, 
    texto: '',
    closed: false, // Añadir una propiedad para el estado closed
    message: '',
    isSuccess: false,
    isEditing: false,
    loggedInUsername: JSON.parse(localStorage.getItem('user') || '{}'),
  };
},
created() {
  if (this.$route.name === 'EditBug') {
    this.isEditing = true;
    this.loadBug();
  }
},
methods: {
  loadBug() {
    axios.get(`https://json-server.firstrow2.com/bugs/${this.id}`)
      .then(response => {
        this.texto = response.data.texto;
        this.username = response.data.username;
        this.closed = response.data.closed; // Cargar el estado closed
      })
      .catch(error => {
        console.error('Error al cargar el bug:', error);
      });
  },
  addBug() {
    const newBug = {
      username: this.loggedInUsername.username,
      texto: this.texto,
      closed: false
    };
    axios.post('https://json-server.firstrow2.com/bugs', newBug)
      .then(() => {
        this.message = 'Bug añadido exitosamente!';
        this.isSuccess = true;
      })
      .catch(() => {
        this.message = 'Error al añadir el bug!';
        this.isSuccess = false;
      });
  },
  modifyBug() {
    const updatedBug = {
      username: this.username,
      texto: this.texto,
      closed: this.closed || false,
    };
    axios.put(`https://json-server.firstrow2.com/bugs/${this.bugId}`, updatedBug)
      .then(() => {
        this.message = 'Bug modificado exitosamente!';
        this.isSuccess = true;
      })
      .catch(() => {
        this.message = 'Error al modificar el bug!';
        this.isSuccess = false;
      });
  },
},
};
</script>

<style>
/* Aquí puedes añadir estilos específicos para el formulario de bugs si lo necesitas */
</style>
