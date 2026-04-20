// src/services/authService.js

export async function cadastrarMedico(dados) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const usuario = {
      id: Date.now(),
      nome: dados.nome,
      crm: dados.crm,
      especialidade: dados.especialidade,
      telefone: dados.telefone,
      email: dados.email,
      senha: dados.senha || 'senha123',
      cpf: dados.cpf || '000.000.000-00',
      criadoEm: new Date().toISOString(),
    }

    localStorage.setItem('saudeDiaUser', JSON.stringify(usuario))
    return { sucesso: true, usuario }
  } catch (err) {
    console.error('[authService] cadastrarMedico:', err)
    return { sucesso: false, erro: 'Erro ao realizar cadastro. Tente novamente.' }
  }
}

/**
 * Modo DEMO: aceita qualquer CPF e senha.
 * Cria um usuário fictício se não houver nenhum cadastrado.
 * TODO: substituir pela validação real quando integrar com API.
 */
export async function loginMedico(cpf, senha) {
  void cpf // usado futuramente na validação real
  void senha // usado futuramente na validação real

  try {
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Se não há usuário cadastrado, cria um fictício para demo
    let usuarioSalvo = JSON.parse(localStorage.getItem('saudeDiaUser') || 'null')
    if (!usuarioSalvo) {
      usuarioSalvo = {
        id: Date.now(),
        nome: 'Médico Demo',
        crm: '12345',
        especialidade: 'Clínico Geral',
        telefone: '(00) 00000-0000',
        email: 'demo@saudedia.com',
        cpf: cpf || '000.000.000-00',
        criadoEm: new Date().toISOString(),
      }
      localStorage.setItem('saudeDiaUser', JSON.stringify(usuarioSalvo))
    }

    const token = btoa(JSON.stringify({ id: usuarioSalvo.id, exp: Date.now() + 86400000 }))
    localStorage.setItem('saudeDiaToken', token)

    return { sucesso: true, token, usuario: usuarioSalvo }
  } catch (err) {
    console.error('[authService] loginMedico:', err)
    return { sucesso: false, erro: 'Erro ao realizar login. Tente novamente.' }
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
