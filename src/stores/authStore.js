// src/stores/authStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  cadastrarMedico,
  loginMedico,
  logoutMedico,
  getToken,
  getUsuarioLocal,
} from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref(getUsuarioLocal())
  const token = ref(getToken())
  const carregando = ref(false)
  const erro = ref('')

  const isAutenticado = computed(() => !!token.value)
  const nomeUsuario = computed(() => usuario.value?.nome ?? '')

  async function cadastrar(dados) {
    carregando.value = true
    erro.value = ''
    try {
      const resultado = await cadastrarMedico(dados)
      if (!resultado.sucesso) erro.value = resultado.erro || 'Erro ao cadastrar.'
      return resultado
    } catch {
      erro.value = 'Erro inesperado. Tente novamente.'
      return { sucesso: false, erro: erro.value }
    } finally {
      carregando.value = false
    }
  }

  // Recebe cpf e senha — senha é passada ao service mas não validada ainda (modo demo)
  async function login(cpf, senha) {
    carregando.value = true
    erro.value = ''
    try {
      const resultado = await loginMedico(cpf, senha)
      if (resultado.sucesso) {
        token.value = resultado.token
        usuario.value = resultado.usuario
      } else {
        erro.value = resultado.erro || 'Credenciais inválidas.'
      }
      return resultado
    } catch {
      erro.value = 'Erro inesperado. Tente novamente.'
      return { sucesso: false, erro: erro.value }
    } finally {
      carregando.value = false
    }
  }

  function logout() {
    logoutMedico()
    token.value = null
    usuario.value = null
    erro.value = ''
  }

  function limparErro() {
    erro.value = ''
  }

  return {
    usuario,
    token,
    carregando,
    erro,
    isAutenticado,
    nomeUsuario,
    cadastrar,
    login,
    logout,
    limparErro,
  }
})
