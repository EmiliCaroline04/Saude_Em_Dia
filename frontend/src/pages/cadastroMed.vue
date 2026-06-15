<template>
  <q-layout view="hHh lpR fFf" class="cadastro-layout">
    <q-page-container>
      <q-page class="cadastro-page flex flex-center">
        <main class="cartao-principal" aria-label="Cadastro de Médico">
          <aside class="coluna-ilustracao">
            <img
              src="../assets/cadastro.png"
              alt="Ilustração de médico com tablet"
              class="imagem-cadastro"
              @error="onImgError"
            />
          </aside>
          <section class="coluna-formulario" aria-label="Formulário de cadastro">
            <header class="area-logo">
              <div class="caixa-logo">
                <img src="../assets/Logo.png" alt="Logo Saúde em Dia" class="imagem-logo" />
              </div>
            </header>
            <h1 class="titulo-formulario">Cadastro</h1>
            <q-form @submit.prevent="handleCadastro" class="formulario-cadastro" greedy>
              <q-input
                v-model="form.nome"
                placeholder="Nome completo"
                outlined
                dense
                class="campo-formulario"
                :rules="[(val) => !!val || 'Nome é obrigatório']"
                bg-color="white"
              >
                <template #prepend><q-icon name="person" color="blue-6" /></template>
              </q-input>
              <q-input
                v-model="form.crm"
                placeholder="CRM"
                outlined
                dense
                class="campo-formulario"
                :rules="[(val) => !!val || 'CRM é obrigatório']"
                bg-color="white"
              >
                <template #prepend><q-icon name="badge" color="blue-6" /></template>
              </q-input>
              <q-input
                v-model="form.especialidade"
                placeholder="Especialidade"
                outlined
                dense
                class="campo-formulario"
                :rules="[(val) => !!val || 'Especialidade é obrigatória']"
                bg-color="white"
              >
                <template #prepend><q-icon name="medical_services" color="blue-6" /></template>
              </q-input>
              <q-input
                v-model="form.telefone"
                placeholder="Telefone"
                outlined
                dense
                class="campo-formulario"
                mask="(##) #####-####"
                :rules="[(val) => !!val || 'Telefone é obrigatório']"
                bg-color="white"
              >
                <template #prepend><q-icon name="phone" color="blue-6" /></template>
              </q-input>
              <q-input
                v-model="form.email"
                placeholder="E-mail"
                type="email"
                outlined
                dense
                class="campo-formulario"
                :rules="[
                  (val) => !!val || 'E-mail é obrigatório',
                  (val) => /.+@.+\..+/.test(val) || 'E-mail inválido',
                ]"
                bg-color="white"
              >
                <template #prepend><q-icon name="email" color="blue-6" /></template>
              </q-input>
              <q-input
                v-model="form.senha"
                placeholder="Senha"
                :type="mostrarSenha ? 'text' : 'password'"
                outlined
                dense
                class="campo-formulario"
                :rules="[
                  (val) => !!val || 'Senha é obrigatória',
                  (val) => val.length >= 6 || 'Mínimo 6 caracteres',
                ]"
                bg-color="white"
              >
                <template #prepend><q-icon name="lock" color="blue-6" /></template>
                <template #append>
                  <q-icon
                    :name="mostrarSenha ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    color="grey-6"
                    @click="mostrarSenha = !mostrarSenha"
                  />
                </template>
              </q-input>

              <q-input
                v-model="form.confirmarSenha"
                placeholder="Confirme a senha"
                :type="mostrarConfirmar ? 'text' : 'password'"
                outlined
                dense
                class="campo-formulario"
                :rules="[
                  (val) => !!val || 'Confirmação é obrigatória',
                  (val) => val === form.senha || 'As senhas não coincidem',
                ]"
                bg-color="white"
              >
                <template #prepend><q-icon name="lock_reset" color="blue-6" /></template>
                <template #append>
                  <q-icon
                    :name="mostrarConfirmar ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    color="grey-6"
                    @click="mostrarConfirmar = !mostrarConfirmar"
                  />
                </template>
              </q-input>
              <div v-if="erroGeral" class="mensagem-erro">
                <q-icon name="error_outline" size="16px" /> {{ erroGeral }}
              </div>
              <q-btn
                type="submit"
                label="Cadastrar"
                unelevated
                class="botao-cadastrar full-width"
                :loading="carregando"
              >
                <template #loading>
                  <q-spinner-dots size="24px" color="#1d4ed8" />
                </template>
              </q-btn>
            </q-form>
            <footer class="rodape-formulario">
              <nav aria-label="Voltar para login">
                <span class="link-voltar" @click="$router.push('/login')">Voltar para login</span>
              </nav>
              <div class="area-logos-governo">
                <img
                  src="../assets/governo.png"
                  alt="Logos do governo federal"
                  class="imagem-governo"
                  @error="onGovernoError"
                />
                <div v-if="governoError" class="placeholder-logos">
                  <span class="tag-logo">🔵 FNS</span>
                  <span class="tag-logo">➕ SUS</span>
                  <span class="tag-logo">🏥 Ministério da Saúde</span>
                  <span class="tag-logo">🇧🇷 GOVERNO FEDERAL</span>
                </div>
              </div>
            </footer>
          </section>
        </main>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default { name: 'PaginaCadastroMedico' }
</script>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { cadastrarMedico } from '../services/authService'

const router = useRouter()
const $q = useQuasar()

const mostrarSenha = ref(false)
const mostrarConfirmar = ref(false)
const governoError = ref(false)
const carregando = ref(false)
const erroGeral = ref('')

const form = reactive({
  nome: '',
  crm: '',
  especialidade: '',
  telefone: '',
  email: '',
  senha: '',
  confirmarSenha: '',
})

function onImgError(e) {
  e.target.style.display = 'none'
}

function onGovernoError() {
  governoError.value = true
}

async function handleCadastro() {
  erroGeral.value = ''
  carregando.value = true
  try {
    const resultado = await cadastrarMedico({
      nome: form.nome,
      crm: form.crm,
      especialidade: form.especialidade,
      telefone: form.telefone,
      email: form.email,
      senha: form.senha,
    })

    if (resultado.sucesso) {
      $q.notify({
        type: 'positive',
        message: `Cadastro realizado! Bem-vindo, ${resultado.usuario.nome}!`,
        icon: 'check_circle',
        position: 'top',
        timeout: 2500,
      })
      setTimeout(() => router.push('/login'), 1000)
      return
    }

    erroGeral.value = resultado.erro || 'Erro ao realizar cadastro.'
  } catch {
    erroGeral.value = 'Erro inesperado. Tente novamente.'
  } finally {
    carregando.value = false
  }
}


onMounted(() => {
  erroGeral.value = ''
})
</script>

<style scoped>
.cadastro-layout {
  min-height: 100vh;
}
.cadastro-page {
  background: #7b7fc4;
  min-height: 100vh;
  padding: 24px 16px;
}
.cartao-principal {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  max-width: 1100px;
  width: 100%;
}
.coluna-ilustracao {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.imagem-cadastro {
  width: 100%;
  max-width: 650px;
  height: auto;
  object-fit: contain;
}
.coluna-formulario {
  flex: 0 0 400px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 24px;
  padding: 28px 32px 24px;
  border: 1.5px solid rgba(255, 255, 255, 0.45);
  box-shadow: 0 8px 40px rgba(60, 80, 160, 0.18);
}
.area-logo {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
.caixa-logo {
  background: white;
  border-radius: 14px;
  padding: 5px 100px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
.imagem-logo {
  max-height: 30px;
  max-width: 50px;
  object-fit: contain;
}
.titulo-formulario {
  font-family: 'Nunito', sans-serif;
  font-size: 22px;
  font-weight: 800;
  color: white;
  text-align: center;
  margin: 0 0 16px;
  letter-spacing: 2px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
}
.formulario-cadastro {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.campo-formulario {
  border-radius: 12px;
}
:deep(.q-field--outlined .q-field__control) {
  border-radius: 12px !important;
  background: white;
}
:deep(.q-field__native),
:deep(.q-field__input) {
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  color: #374151;
}
:deep(.q-field__placeholder) {
  font-family: 'Nunito', sans-serif;
  color: #9ca3af;
  font-size: 13px;
}
.mensagem-erro {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #fecaca;
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  background: rgba(220, 38, 38, 0.18);
  border-radius: 8px;
  padding: 6px 10px;
}
.botao-cadastrar {
  margin-top: 6px;
  background: white !important;
  color: #1d4ed8 !important;
  font-family: 'Nunito', sans-serif;
  font-weight: 800;
  font-size: 15px;
  border-radius: 12px;
  height: 44px;
  letter-spacing: 1px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transition: all 0.2s ease;
}
.botao-cadastrar:hover {
  background: #eff6ff !important;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.16);
}
.rodape-formulario {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.link-voltar {
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  transition: color 0.2s;
}
.link-voltar:hover {
  color: white;
  text-decoration: underline;
}
.area-logos-governo {
  display: flex;
  align-items: center;
  justify-content: center;
}
.imagem-governo {
  max-height: 40px;
  max-width: 280px;
  object-fit: contain;
}
.placeholder-logos {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}
.tag-logo {
  font-family: 'Nunito', sans-serif;
  font-size: 9px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.75);
  white-space: nowrap;
}
@media (max-width: 768px) {
  .cartao-principal {
    flex-direction: column;
    align-items: center;
  }
  .coluna-ilustracao {
    display: none;
  }
  .coluna-formulario {
    flex: unset;
    width: 100%;
    max-width: 420px;
  }
}
</style>
