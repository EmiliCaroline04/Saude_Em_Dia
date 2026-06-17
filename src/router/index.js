// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { obterToken } from '../services/authService'

const rotas = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('../pages/bemVindo.vue') },
      { path: '/login', component: () => import('../pages/login.vue') },
      { path: '/cadastro-med', component: () => import('../pages/cadastroMed.vue') },
      {
        path: '/home',
        component: () => import('../pages/IndexPage.vue'),
        meta: { requerAutenticacao: true },
      },
      {
        path: '/cadastro-medicamento',
        component: () => import('../pages/medicamentoPage.vue'),
        meta: { requerAutenticacao: true },
      },
      {
        path: '/emergencia',
        component: () => import('../pages/Emergenciapage.vue'),
        meta: { requerAutenticacao: true },
      },
      {
        path: '/alarme',
        component: () => import('../pages/Alarmepage.vue'),
        meta: { requerAutenticacao: true },
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/ErrorNotFound.vue'),
  },
]

const roteador = createRouter({
  history: createWebHistory(),
  routes: rotas,
})

roteador.beforeEach((to, _from, next) => {
  const estaAutenticado = !!obterToken()

  if (to.meta.requerAutenticacao && !estaAutenticado) {
    next('/login')
    return
  }

  if (
    estaAutenticado &&
    (to.path === '/login' || to.path === '/cadastro-med' || to.path === '/') &&
    to.path !== '/home'
  ) {
    next('/home')
    return
  }

  next()
})

export default roteador
