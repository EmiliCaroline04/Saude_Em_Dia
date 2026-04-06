import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('../pages/bemVindo.vue') },
      { path: '/login', component: () => import('../pages/login.vue') },
      { path: '/cadastro', component: () => import('../pages/cadastro.vue') },
      { path: '/home', component: () => import('../pages/IndexPage.vue') },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
