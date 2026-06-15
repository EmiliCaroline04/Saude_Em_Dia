const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.erro || data.message || 'Erro na comunicação com a API')
  }

  return data
}

export function getPacienteIdAtual() {
  return Number(localStorage.getItem('saudeDiaPacienteId') || 1)
}

export function salvarPacienteIdNoStorage(idPaciente) {
  if (idPaciente) {
    localStorage.setItem('saudeDiaPacienteId', String(idPaciente))
  }
}

export async function obterUltimoSinalVital(idPaciente) {
  const sinais = await requestJson(`/sinais-vitais/${idPaciente}`)
  return Array.isArray(sinais) && sinais.length ? sinais[0] : null
}

export async function criarSinalVital(payload) {
  return requestJson('/sinais-vitais', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function atualizarSinalVital(idSinalVital, payload) {
  return requestJson(`/sinais-vitais/${idSinalVital}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}
