<template>
  <q-page class="cadastro-page">
    <div class="cadastro-layout">
      <div class="left-side">
        <div class="lembrete-card">
          <h3 class="lembrete-title">Lembrete!</h3>
          <div class="lembrete-item">
            <q-icon name="schedule" color="orange" size="28px" />
            <div>
              <div class="hora">10:00</div>
              <div class="descricao">Tomar Remédio 💊</div>
            </div>
          </div>
          <div class="lembrete-item">
            <q-icon name="calendar_month" color="blue" size="28px" />
            <div>
              <div class="hora">14:00</div>
              <div class="descricao">Consulta Médica 🩺</div>
            </div>
          </div>
        </div>
      </div>

      <div class="right-side">
        <div class="logo-area">
          <img src="../assets/Logo.png" alt="Saúde em Dia" class="logo-img" />
        </div>

        <h2 class="cadastro-title">CADASTRO</h2>

        <q-form @submit="handleCadastro" class="form-area">
          <q-input
            v-model="form.cpf"
            placeholder="CPF"
            outlined
            dense
            class="input-field"
            mask="###.###.###-##"
          />
          <q-input v-model="form.nome" placeholder="Nome" outlined dense class="input-field" />
          <q-input
            v-model="form.email"
            placeholder="E-mail"
            outlined
            dense
            class="input-field"
            type="email"
          />
          <q-input
            v-model="form.senha"
            placeholder="Senha"
            outlined
            dense
            class="input-field"
            :type="showSenha ? 'text' : 'password'"
          >
            <template #append>
              <q-icon
                :name="showSenha ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showSenha = !showSenha"
              />
            </template>
          </q-input>
          <q-input
            v-model="form.confirmarSenha"
            placeholder="Confirme a senha"
            outlined
            dense
            class="input-field"
            :type="showConfirmar ? 'text' : 'password'"
          >
            <template #append>
              <q-icon
                :name="showConfirmar ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showConfirmar = !showConfirmar"
              />
            </template>
          </q-input>

          <q-btn label="Entrar" type="submit" class="btn-entrar" unelevated :loading="loading" />
        </q-form>

        <div class="voltar-login" @click="$router.push('/login')">Voltar para login</div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

export default defineComponent({
  name: 'CadastroPage',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const loading = ref(false)
    const showSenha = ref(false)
    const showConfirmar = ref(false)

    const form = reactive({
      cpf: '',
      nome: '',
      email: '',
      senha: '',
      confirmarSenha: '',
    })

    async function handleCadastro() {
      if (form.senha !== form.confirmarSenha) {
        alert('As senhas não coincidem!')
        return
      }
      loading.value = true
      try {
        await authStore.register(form)
        router.push('/login')
      } catch {
        alert('Erro ao cadastrar. Tente novamente.')
      } finally {
        loading.value = false
      }
    }

    return { form, loading, showSenha, showConfirmar, handleCadastro }
  },
})
</script>

<style scoped>
.cadastro-page {
  background-color: #7b7fc4;
  min-height: 100vh;
}
.cadastro-layout {
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 32px;
}
.left-side {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lembrete-card {
  background: #5b6abf;
  border-radius: 20px;
  padding: 24px 28px;
  color: white;
  min-width: 200px;
}
.lembrete-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 16px 0;
}
.lembrete-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}
.hora {
  font-size: 1.1rem;
  font-weight: 700;
}
.descricao {
  font-size: 0.85rem;
  opacity: 0.9;
}
.right-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 360px;
}
.logo-area {
  background: white;
  border-radius: 12px;
  padding: 12px 24px;
  margin-bottom: 16px;
}
.logo-img {
  height: 50px;
}
.cadastro-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin: 0 0 16px 0;
}
.form-area {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.input-field {
  background: white;
  border-radius: 8px;
}
.btn-entrar {
  background: #1a1a6e !important;
  color: white !important;
  border-radius: 8px !important;
  padding: 10px;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 4px;
  width: 60%;
  align-self: center;
}
.voltar-login {
  color: white;
  margin-top: 12px;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: underline;
}
</style>
