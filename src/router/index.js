import { createRouter, createWebHistory } from 'vue-router';
import Register from '@/views/UserRegister.vue';
import Home from '@/views/HomeView.vue';
import Error from '@/views/ErrorView.vue';
import Bugs from '@/views/BugsView.vue';
import UserView from '@/views/UserView.vue';
import BugView from '@/views/BugView.vue';
import Search from '@/views/SearchView.vue';
import AccountView from '@/views/AccountView.vue';
import FormBugView from '@/views/FormBugView.vue';
import Foro from '@/views/ForoView.vue';
import FormCommentView from '@/views/FormComment.vue';

const routes = [
  {
    path: '/register',
    name: 'Register',
    component: Register,
    beforeEnter: (to, from, next) => {
      // Verificar si el usuario está autenticado
      if (localStorage.getItem('isAuthenticated') === 'true' && localStorage.getItem('isAuthenticated') != null) {
        // Si está autenticado, redirigir a la página de inicio
        next('/');
      } else {
        // Si no está autenticado, permitir el acceso a la ruta
        next();
      }
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Register,
    beforeEnter: (to, from, next) => {
      // Verificar si el usuario está autenticado
      if (localStorage.getItem('isAuthenticated') === 'true' && localStorage.getItem('isAuthenticated') != null) {
        // Si está autenticado, redirigir a la página de inicio
        next('/');
      } else {
        // Si no está autenticado, permitir el acceso a la ruta
        next();
      }
    },
  },
  {
    path: '/bugs',
    name: 'Bugs',
    component: Bugs,
    beforeEnter: (to, from, next) => {
      // Verificar si el usuario está autenticado
      if (localStorage.getItem('isAuthenticated') === 'false' || localStorage.getItem('isAuthenticated') === null) {
        // Si no está autenticado, redirigir a la página de inicio
        next('/login');
      } else {
        // Si no está autenticado, permitir el acceso a la ruta
        next();
      }
    },
  },
  {
    path: '/bug/:id',
    name: 'BugView',
    component: BugView,
    props: true
  },
  {
    path: '/user/:username',
    name: 'UserView',
    component: UserView,
    props: true
  },
  {
    path: '/account',
    name: 'AccountView',
    component: AccountView,
    props: true,
    beforeEnter: (to, from, next) => {
      // Verificar si el usuario está autenticado
      if (localStorage.getItem('isAuthenticated') === 'false' || localStorage.getItem('isAuthenticated') === null) {
        // Si no está autenticado, redirigir a la página de inicio
        next('/login');
      } else {
        // Si no está autenticado, permitir el acceso a la ruta
        next();
      }
    },
  },
  {
    path: '/add-bug',
    name: 'AddBug',
    component: FormBugView,
    beforeEnter: (to, from, next) => {
      // Verificar si el usuario está autenticado
      if (localStorage.getItem('isAuthenticated') === 'false' || localStorage.getItem('isAuthenticated') === null) {
        // Si no está autenticado, redirigir a la página de inicio
        next('/login');
      } else {
        // Si no está autenticado, permitir el acceso a la ruta
        next();
      }
    },
  },
  {
    path: '/edit-bug/:id',
    name: 'EditBug',
    component: FormBugView,
    props: true,
    beforeEnter: (to, from, next) => {
      // Verificar si el usuario está autenticado
      if (localStorage.getItem('isAuthenticated') === 'false' || localStorage.getItem('isAuthenticated') === null) {
        // Si no está autenticado, redirigir a la página de inicio
        next('/login');
      } else {
        // Si no está autenticado, permitir el acceso a la ruta
        next();
      }
    },
  },
  {
    path: '/add-comment/:bugId',
    name: 'AddComment',
    component: FormCommentView,
    props: true,
    beforeEnter: (to, from, next) => {
      // Verificar si el usuario está autenticado
      if (localStorage.getItem('isAuthenticated') === 'false' || localStorage.getItem('isAuthenticated') === null) {
        // Si no está autenticado, redirigir a la página de inicio
        next('/login');
      } else {
        // Si no está autenticado, permitir el acceso a la ruta
        next();
      }
    },
  },
  {
    path: '/add-response/:bugId/:responseId/:responseUsername',
    name: 'AddCommentResponse',
    component: FormCommentView,
    props: true,
    beforeEnter: (to, from, next) => {
      // Verificar si el usuario está autenticado
      if (localStorage.getItem('isAuthenticated') === 'false' || localStorage.getItem('isAuthenticated') === null) {
        // Si no está autenticado, redirigir a la página de inicio
        next('/login');
      } else {
        // Si no está autenticado, permitir el acceso a la ruta
        next();
      }
    },
  },
  {
    path: '/foro/:id',
    name: 'ForoView',
    component: Foro,
    props: true,
  },
  {
    path: '/search',
    name: 'SearchView',
    component: Search,
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/:catchAll(.*)',
    component: Error,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
