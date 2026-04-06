import axios from 'axios'

const api = axios.create({
  baseURL: 'https://sua-api.com/api', // ← troque pela sua URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export { api }
