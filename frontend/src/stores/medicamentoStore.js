// src/stores/medicamentoStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const CHAVE = 'saudeDiaMedsCompleto'
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const coresBarra = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#60a5fa', '#c084fc', '#f472b6']

function formatarDataParaApi(data) {
  if (!data) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(data)) return data

  const [dia, mes, ano] = String(data).split('/')
  if (dia && mes && ano) {
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
  }

  return data
}

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

  async function cadastrarMedicamento(dados) {
    loading.value = true
    try {
      const resposta = await fetch(`${API_BASE_URL}/medicamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_paciente: 1,
          id_receita: 1,
          nome: dados.nome,
          data_validade: formatarDataParaApi(dados.dataValidade),
          dose: dados.dose,
          quantidade: Number(dados.quantidade || 0),
          tipo: dados.tipo,
          mg: Number(dados.quantidade || 0),
        }),
      })

      const retorno = await resposta.json().catch(() => ({}))

      if (!resposta.ok) {
        throw new Error(retorno.erro || retorno.message || 'Erro ao salvar medicamento')
      }

      const novo = {
        ...dados,
        id: retorno.id_medicamento || retorno.id || Date.now(),
      }

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
