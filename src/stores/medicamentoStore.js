// src/stores/medicamentoStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const CHAVE = 'saudeDiaMedsCompleto'

const coresBarra = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#60a5fa', '#c084fc', '#f472b6']

function carregarDoStorage() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE) || '[]')
  } catch {
    return []
  }
}

export const useMedicamentoStore = defineStore('medicamento', () => {
  const medicamentos = ref(carregarDoStorage())
  const loading = ref(false)

  // Computed para o dashboard (compatível com o formato antigo)
  const medicamentosParaDashboard = computed(() =>
    medicamentos.value.map((m, i) => ({
      nome: m.nome.toUpperCase(),
      qtd: Number(m.quantidade) || 0,
      cor: coresBarra[i % coresBarra.length],
    })),
  )

  function salvarStorage() {
    localStorage.setItem(CHAVE, JSON.stringify(medicamentos.value))
    // Sincroniza também com a chave antiga do dashboard
    localStorage.setItem(
      'saudeDiaMeds',
      JSON.stringify(
        medicamentos.value.map(({ nome, quantidade }, i) => ({
          nome: nome.toUpperCase(),
          qtd: Number(quantidade) || 0,
          cor: coresBarra[i % coresBarra.length],
        })),
      ),
    )
  }

  function cadastrarMedicamento(dados) {
    loading.value = true
    try {
      const novo = { ...dados, id: Date.now() }
      medicamentos.value.push(novo)
      salvarStorage()
      return novo
    } finally {
      loading.value = false
    }
  }

  function atualizarMedicamento(id, dados) {
    const idx = medicamentos.value.findIndex((m) => m.id === id)
    if (idx !== -1) {
      medicamentos.value[idx] = { ...medicamentos.value[idx], ...dados }
      salvarStorage()
    }
  }

  function deletarMedicamento(id) {
    medicamentos.value = medicamentos.value.filter((m) => m.id !== id)
    salvarStorage()
  }

  function listarMedicamentos() {
    medicamentos.value = carregarDoStorage()
    return medicamentos.value
  }

  return {
    medicamentos,
    medicamentosParaDashboard,
    loading,
    cadastrarMedicamento,
    atualizarMedicamento,
    deletarMedicamento,
    listarMedicamentos,
  }
})
