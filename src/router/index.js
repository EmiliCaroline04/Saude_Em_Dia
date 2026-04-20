// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { obterToken } from '../services/authService'

// Definição das rotas principais do app
const rotas = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('../pages/bemVindo.vue') },
      { path: '/login', component: () => import('../pages/login.vue') },
      // { path: '/cadastro', component: () => import('../pages/cadastro.vue') },
      { path: '/cadastro-med', component: () => import('../pages/cadastroMed.vue') },
      {
        path: '/home',
        component: () => import('../pages/IndexPage.vue'),
        meta: { requerAutenticacao: true },
      },
    ],
  },
]

const roteador = createRouter({
  history: createWebHistory(),
  routes: rotas,
})

// Guardião global de rotas
roteador.beforeEach((to, _from, next) => {
  const estaAutenticado = !!obterToken()

  // Se rota protegida e não autenticado → redireciona para login
  if (to.meta.requerAutenticacao && !estaAutenticado) {
    next('/login')
    return
  }

  // Se autenticado e tentando acessar login/cadastro/boas-vindas → redireciona para home
  if (estaAutenticado && (to.path === '/login' || to.path === '/cadastro-med' || to.path === '/')) {
    next('/home')
    return
  }

  next()
})

export default roteador
