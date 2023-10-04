<template>
    <div class="container text-center mt-5">
      <h3 class="my-5">Listado de bugs
        <router-link :to="`/add-bug`" class="btn btn-success btn-sm ms-2">Añadir bug</router-link>
      </h3>
      <table class="table table-bordered">
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
          <tr v-for="bug in bugs" :key="bug.id">
            <td>{{ bug.id }}</td>
            <td>
              <router-link :to="`/user/${bug.username}`">{{ bug.username }}</router-link>
            </td>
            <td>{{ bug.texto }}</td>
            <td>{{ bug.closed ? 'Cerrado' : 'Activo' }}</td>
            <td>
                <router-link :to="`/bug/${bug.id}`" class="btn btn-primary btn-sm me-2">Acceder</router-link>
                <router-link 
                v-if="loggedInUser.username === bug.username || loggedInUser.admin"
                :to="`/edit-bug/${bug.id}`" 
                class="btn btn-secondary btn-sm me-2">
                Editar
              </router-link>
                <button 
                  v-if="loggedInUser.username === bug.username" 
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
    name: 'BugsView',
    data() {
      return {
        bugs: [],
        loggedInUser: JSON.parse(localStorage.getItem('user') || '{}'),
      };
    },
    mounted() {
      axios
        .get('http://localhost:5000/bugs')
        .then((response) => {
          this.bugs = response.data;
          this.bugs.sort((a, b) => {
            if (a.username === this.loggedInUser.username && b.username !== this.loggedInUser.username) {
              return -1;
            }
            if (a.username !== this.loggedInUser.username && b.username === this.loggedInUser.username) {
              return 1;
            }
            return 0;
          });
          this.filteredBugs = this.bugs;
        })
        .catch((error) => {
          console.error('Error al obtener la lista de bugs:', error);
        });
    },
    methods: {
      eliminarBug(bugId) {
        axios
          .delete(`http://localhost:5000/bugs/${bugId}`)
          .then(() => {
            this.bugs = this.bugs.filter((bug) => bug.id !== bugId);
          })
          .catch((error) => {
            console.error('Error al eliminar el bug:', error);
          });
      },
    },
  };
  </script>
  