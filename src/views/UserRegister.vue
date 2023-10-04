<template>
  <div class="container mx-auto mt-5" style="width:30%">
    <!-- Cambia el título basado en la ruta -->
    <h3 v-if="$route.path === '/register'">Registrarse</h3>
    <h3 v-else>Iniciar sesión</h3>
    <form @submit.prevent="$route.path === '/register' ? register() : login()">
      <div class="form-group mt-4">
        <label for="username">Nombre de Usuario</label>
        <input v-model="username"  @input="isTyping = true" type="text" class="form-control" id="username" />
      </div>
      <!-- Muestra el campo de correo electrónico solo cuando la ruta es /register -->
      <div class="form-group mt-1" v-if="$route.path === '/register'">
        <label for="email">Correo electrónico</label>
        <input v-model="email"  @input="isTyping = true" type="text" class="form-control" id="email" />
      </div>
      <div class="form-group mt-1">
        <label for="password">Contraseña</label>
        <input v-model="password"  @input="isTyping = true" type="password" class="form-control" id="password" />
      </div>
      <!-- Cambia el texto del botón basado en la ruta -->
      <button type="submit" class="btn btn-primary mt-3">
        {{ $route.path === '/register' ? 'Registrar' : 'Iniciar Sesión' }}
      </button>
    </form>
    <div v-if="message" :class="{'text-success': isSuccess, 'text-danger': !isSuccess, 'mt-3': true}">
      {{ message }}
    </div>
    <div v-if="isTyping && validationMessage" class="text-danger mt-3">
      {{ validationMessage }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { EventBus } from '@/router/event-bus.js';
export default {
  name: 'UserRegister',
    data() {
      return {
      username: '',
      email: '',
      password: '',
      message: '',
      isSuccess: false,
      isTyping: false
    };
    },
    computed: {
      validationMessage() {
        if (this.username === '' || this.password === '' || (this.$route.path === '/register' && this.email === '')) {
          return 'Todos los campos son obligatorios';
        }
        if(this.password.length < 4){
          return 'La contraseña debe tener al menos 4 caracteres';
        }
        if(this.email !== '' && !this.email.includes('@')){
          return 'El correo electrónico debe ser válido';
        }
        return '';
      }
    },
    methods: {
      register() {
        // Comprobar si el nombre de usuario ya existe
        axios.get(`http://localhost:5000/users?username=${this.username}`)
          .then((response) => {
            if (response.data.length > 0) {
              this.message = 'El nombre de usuario ya está en uso.';
              this.isSuccess = false;
            } else {
              // Comprobar si el correo electrónico ya existe
              axios.get(`http://localhost:5000/users?email=${this.email}`)
                .then((emailResponse) => {
                  if (emailResponse.data.length > 0) {
                    this.message = 'El correo electrónico ya está en uso.';
                    this.isSuccess = false;
                  } else {
                    // Si el nombre de usuario y el correo electrónico no están repetidos, procede con el registro
                    const newUser = {
                      username: this.username,
                      email: this.email,
                      password: this.password,
                      admin: false
                    };
                    axios.post('http://localhost:5000/users', newUser)
                      .then(() => {
                        this.message = 'Registro exitoso!';
                        this.isSuccess = true;
                      })
                      .catch(() => {
                        this.message = 'Error en el registro!';
                        this.isSuccess = false;
                      });
                  }
                })
                .catch(() => {
                  this.message = 'Error al verificar el correo electrónico.';
                  this.isSuccess = false;
                });
            }
          })
          .catch(() => {
            this.message = 'Error al verificar el nombre de usuario.';
            this.isSuccess = false;
          });
      },
      login() {
        axios.get('http://localhost:5000/users')
          .then(response => {
            const users = response.data;
            const user = users.find(u => u.username === this.username && u.password === this.password);

            if (user) {
              localStorage.setItem('isAuthenticated', 'true');
              localStorage.setItem('user', JSON.stringify(user));
              this.message = 'Inicio de sesión exitoso';
              this.isSuccess = true;
              EventBus.emit('authStatusChanged', true);
              this.$router.push('/');
            } else {
              throw new Error();
            }
          })
          .catch(() => {
            this.message = 'Error en el inicio de sesión';
            this.isSuccess = false;
          });
      },
    },
};
</script>

<style>
/* Aquí puedes añadir estilos específicos para la página de registro si lo necesitas */
</style>
