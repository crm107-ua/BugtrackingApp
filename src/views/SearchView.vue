<template>
  <div class="container text-center mt-5">
    <h3 class="my-5">Buscador de bugs
      <router-link :to="`/add-bug`" class="btn btn-success btn-sm ms-2">Añadir bug</router-link>
    </h3>
    <div class="mb-4">
      <input v-model="searchText" type="text" class="form-control" placeholder="Busca los mejores bugs por usuario o texto" />
    </div>
    <table class="table table-bordered" v-if="filteredBugs.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Texto del Bug</th>
          <th>Estado</th>
          <th>Opciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="bug in filteredBugs" :key="bug.id">
          <td>{{ bug.id }}</td>
          <td>
            <router-link :to="`/user/${bug.username}`">{{ bug.username }}</router-link>
          </td>
          <td>{{ bug.texto }}</td>
          <td>{{ bug.closed ? 'Cerrado' : 'Activo' }}</td>
          <td>
            <router-link :to="`/bug/${bug.id}`" class="btn btn-primary btn-sm me-2">Acceder</router-link>
            <router-link 
              v-if="canEdit(bug)" 
              :to="`/edit-bug/${bug.id}`" 
              class="btn btn-secondary btn-sm me-2">
              Editar
            </router-link>
            <button 
              v-if="isOwner(bug)" 
              @click="eliminarBug(bug.id)" 
              class="btn btn-danger btn-sm">
              Eliminar
            </button>            
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SearchView',
  data() {
    return {
      bugs: [],
      filteredBugs: [],
      searchText: '',
      loggedInUser: JSON.parse(localStorage.getItem('user')) || null,
    };
  },
  mounted() {
    axios
      .get('http://localhost:5000/bugs')
      .then((response) => {
        this.bugs = response.data;
      })
      .catch((error) => {
        console.error('Error al obtener la lista de bugs:', error);
      });
  },
  watch: {
    searchText() {
      this.searchBugs();
    },
  },
  methods: {
    searchBugs() {
      if (this.searchText === '') {
        this.filteredBugs = [];
      } else {
        const text = this.searchText.toLowerCase();
        this.filteredBugs = this.bugs.filter(bug =>
          bug.username.toLowerCase().includes(text) ||
          bug.texto.toLowerCase().includes(text)
        );
      }
    },
    eliminarBug(bugId) {
      axios
        .delete(`http://localhost:5000/bugs/${bugId}`)
        .then(() => {
          this.bugs = this.bugs.filter(bug => bug.id !== bugId);
          this.filteredBugs = this.filteredBugs.filter(bug => bug.id !== bugId);
          console.log(`Bug ${bugId} eliminado.`);
        })
        .catch((error) => {
          console.error('Error al eliminar el bug:', error);
        });
    },
    canEdit(bug) {
      return this.loggedInUser && (this.loggedInUser.username === bug.username || this.loggedInUser.admin);
    },
    isOwner(bug) {
      return this.loggedInUser && this.loggedInUser.username === bug.username;
    },
  },
};
</script>
