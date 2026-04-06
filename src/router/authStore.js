import { defineStore } from 'pinia'
import { api } from '../boot/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    async login(email, password) {
      const response = await api.post('/auth/login', { email, password })
      this.token = response.data.token
      this.user = response.data.user
      localStorage.setItem('token', this.token)
    },

    async register(data) {
      const response = await api.post('/auth/register', data)
      return response.data
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    },
  },
})
