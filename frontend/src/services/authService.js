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

function criarUsuarioDemo(dados) {
  const usuario = {
    id: Date.now(),
    nome: dados.nome || 'Médico Demo',
    crm: dados.crm || '12345',
    especialidade: dados.especialidade || 'Clínico Geral',
    telefone: dados.telefone || '(00) 00000-0000',
    email: dados.email || 'demo@saudedia.com',
    criadoEm: new Date().toISOString(),
  }

  localStorage.setItem('saudeDiaUser', JSON.stringify(usuario))
  return { sucesso: true, usuario }
}

export async function cadastrarMedico(dados) {
  try {
    const resposta = await requestJson('/medicos', {
      method: 'POST',
      body: JSON.stringify({
        nome: dados.nome,
        crm: dados.crm,
        especialidade: dados.especialidade,
        telefone: dados.telefone,
        telefone_consultorio: dados.telefone,
        email: dados.email,
        senha: dados.senha,
      }),
    })

    const usuario = resposta.usuario || {
      id: resposta.id || Date.now(),
      nome: dados.nome || dados.email,
      email: dados.email,
      crm: dados.crm,
      especialidade: dados.especialidade,
      telefone: dados.telefone,
    }

    localStorage.setItem('saudeDiaUser', JSON.stringify(usuario))
    return { sucesso: true, usuario }
  } catch (err) {
    console.warn('[authService] cadastro via API falhou, usando modo demo:', err.message)
    return criarUsuarioDemo(dados)
  }
}

export async function loginMedico(emailOuCpf, senha) {
  try {
    const resposta = await requestJson('/auth', {
      method: 'POST',
      body: JSON.stringify({ email: emailOuCpf, senha_hash: senha }),
    })

    const usuario = resposta.usuario || {
      id: Date.now(),
      email: emailOuCpf,
      nome: 'Usuário autenticado',
    }

    const token = btoa(JSON.stringify({ id: usuario.id, exp: Date.now() + 86400000 }))
    localStorage.setItem('saudeDiaToken', token)
    localStorage.setItem('saudeDiaUser', JSON.stringify(usuario))

    return { sucesso: true, token, usuario }
  } catch (err) {
    console.warn('[authService] login via API falhou, usando modo demo:', err.message)

    let usuarioSalvo = JSON.parse(localStorage.getItem('saudeDiaUser') || 'null')
    if (!usuarioSalvo) {
      usuarioSalvo = {
        id: Date.now(),
        nome: 'Médico Demo',
        crm: '12345',
        especialidade: 'Clínico Geral',
        telefone: '(00) 00000-0000',
        email: emailOuCpf || 'demo@saudedia.com',
        criadoEm: new Date().toISOString(),
      }
      localStorage.setItem('saudeDiaUser', JSON.stringify(usuarioSalvo))
    }

    const token = btoa(JSON.stringify({ id: usuarioSalvo.id, exp: Date.now() + 86400000 }))
    localStorage.setItem('saudeDiaToken', token)

    return { sucesso: true, token, usuario: usuarioSalvo }
  }
}

export function logoutMedico() {
  localStorage.removeItem('saudeDiaToken')
  localStorage.removeItem('saudeDiaUser')
}

export function getToken() {
  return localStorage.getItem('saudeDiaToken')
}

export const obterToken = getToken

export function getUsuarioLocal() {
  return JSON.parse(localStorage.getItem('saudeDiaUser') || 'null')
}
