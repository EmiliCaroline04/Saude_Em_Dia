<template>
  <q-page class="login-page">
    <div class="login-layout">
      <!-- Lado esquerdo - imagem do idoso -->
      <div class="left-side">
        <img src="../assets/Login.png" alt="Ilustração" class="login-img" />
      </div>

      <!-- Lado direito - formulário -->
      <div class="right-side">
        <div class="logo-area">
          <img src="../assets/Logo.png" alt="Saúde em Dia" class="logo-img" />
        </div>

        <h2 class="login-title">LOGIN</h2>

        <q-form @submit="handleLogin" class="form-area">
          <q-input
            v-model="form.cpf"
            placeholder="CPF"
            outlined
            dense
            class="input-field"
            mask="###.###.###-##"
            bg-color="white"
          />

          <q-input
            v-model="form.senha"
            placeholder="Senha"
            outlined
            dense
            class="input-field"
            :type="showSenha ? 'text' : 'password'"
            bg-color="white"
          >
            <template #append>
              <q-icon
                :name="showSenha ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showSenha = !showSenha"
              />
            </template>
          </q-input>

          <div class="esqueceu-senha" @click="$router.push('/esqueceu-senha')">
            Esqueceu a senha?
          </div>

          <q-btn label="Entrar" type="submit" class="btn-entrar" unelevated :loading="loading" />
        </q-form>

        <div class="criar-conta">
          Não tem uma conta?
          <span class="link-criar" @click="$router.push('/cadastro')">Crie agora...</span>
        </div>
      </div>
    </div>

    <!-- Rodapé governo -->
    <div class="footer-logos">
      <img src="../assets/governo.png" alt="Logos Governo" class="footer-gov-img" />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../router/authStore'

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const loading = ref(false)
    const showSenha = ref(false)

    const form = reactive({
      cpf: '',
      senha: '',
    })

    async function handleLogin() {
      if (!form.cpf || !form.senha) {
        alert('Preencha todos os campos!')
        return
      }
      loading.value = true
      try {
        await authStore.login(form.cpf, form.senha)
        router.push('/home')
      } catch {
        alert('CPF ou senha inválidos.')
      } finally {
        loading.value = false
      }
    }

    return { form, loading, showSenha, handleLogin }
  },
})
</script>

<style scoped>
.login-page {
  background-color: #7b7fc4;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.login-layout {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 80px;
  padding: 40px 0 0 0;
  margin-bottom: 0;
}

/* Lado esquerdo */
.left-side {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 420px;
}

.login-img {
  max-width: 200%;
  max-height: 600px;
  object-fit: contain;
  margin-left: var(--login-img-margin-left, 0px);
  margin-top: var(--login-img-margin-top, 0px);
}

.left-side {
  /* Define as variáveis CSS apenas para o escopo do componente */
  --login-img-margin-left: 40px;
  --login-img-margin-top: 30px;
}

/* Lado direito */
.right-side {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 4px;
  max-width: 420px;
}

/* .logo-area {
  background: white;
  border-radius: 12px;
  padding: 16px 32px;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  width: 40%;
  display: flex;
  justify-content: center;
} */

.logo-img {
  height: 150px;
  border-radius: 12px;
}

.login-title {
  color: #1a1a1a;
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 4px;
  margin: 0 0 20px 0;
  text-align: center;
}

.form-area {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-field {
  border-radius: 8px;
  width: 100%;
}

.esqueceu-senha {
  color: #1a1a6e;
  font-size: 0.85rem;
  cursor: pointer;
  text-align: left;
  text-decoration: underline;
  margin-top: -4px;
}

.esqueceu-senha:hover {
  opacity: 0.7;
}

.btn-entrar {
  background: #1a1a6e !important;
  color: white !important;
  border-radius: 8px !important;
  padding: 12px;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 2px;
  width: 100%;
  margin-top: 4px;
}

.criar-conta {
  color: #1a1a1a;
  margin-top: 16px;
  font-size: 0.88rem;
  text-align: center;
}

.link-criar {
  color: #1a1a6e;
  cursor: pointer;
  text-decoration: underline;
  font-weight: 700;
}

.link-criar:hover {
  opacity: 0.7;
}

/* Rodapé */
.footer-logos {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0px 60px;
  background: rgba(0, 0, 0, 0.08);
  margin-bottom: 0px;
}

.footer-gov-img {
  height: 120px;
  object-fit: contain;
  margin-left: var(--footer-gov-img-margin-left, 60);
}
:root {
  --footer-gov-img-margin-left: 300px;
}
</style>
