<template>
  <q-page class="login-page">
    <main class="login-layout" aria-label="Página de login">
      <aside class="lado-imagem" aria-label="Ilustração de login">
        <img src="../assets/Login.png" alt="Ilustração de idoso" class="login-img" />
      </aside>
      <section class="lado-formulario" aria-label="Formulário de login">
        <header class="area-logo">
          <img src="../assets/Logo.png" alt="Logo Saúde em Dia" class="logo-img" />
        </header>
        <h1 class="titulo-login">Login</h1>
        <q-form @submit="handleLogin" class="formulario-login">
          <q-input
            v-model="form.email"
            placeholder="E-mail"
            type="email"
            outlined
            dense
            class="campo-input"
            bg-color="white"
            aria-label="E-mail"
          />
          <q-input
            v-model="form.senha"
            placeholder="Senha"
            outlined
            dense
            class="campo-input"
            :type="showSenha ? 'text' : 'password'"
            bg-color="white"
            aria-label="Senha"
          >
            <template #append>
              <q-icon
                :name="showSenha ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showSenha = !showSenha"
              />
            </template>
          </q-input>
          <div class="esqueceu-senha">Esqueceu a senha?</div>
          <q-btn label="Entrar" type="submit" class="botao-entrar" unelevated :loading="loading" />
        </q-form>
        <footer class="area-criar-conta">
          Não tem uma conta?
          <span class="link-criar" @click="$router.push('/cadastro-med')">Crie agora...</span>
        </footer>
      </section>
    </main>
    <footer class="footer-logos" aria-label="Logos do governo">
      <img src="../assets/governo.png" alt="Logos Governo Federal" class="footer-gov-img" />
    </footer>
  </q-page>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { loginMedico } from '../services/authService'

export default defineComponent({
  name: 'PaginaLogin',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const showSenha = ref(false)
    const form = reactive({ email: '', senha: '' })

    async function handleLogin() {
      if (!form.email || !form.senha) {
        alert('Preencha todos os campos!')
        return
      }
      loading.value = true
      try {
        const resultado = await loginMedico(form.email, form.senha)
        if (resultado.sucesso) {
          router.push('/home')
        } else {
          alert(resultado.erro || 'CPF ou senha inválidos.')
        }
      } catch {
        alert('Erro inesperado. Tente novamente.')
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
}
.lado-imagem {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 420px;
}
.login-img {
  max-width: 200%;
  max-height: 600px;
  object-fit: contain;
}
.lado-formulario {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 420px;
  width: 100%;
}
.area-logo {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
}
.logo-img {
  height: 150px;
  border-radius: 12px;
}
.titulo-login {
  color: #1a1a1a;
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 4px;
  margin: 0 0 20px 0;
  text-align: center;
  width: 100%;
}
.formulario-login {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.campo-input {
  border-radius: 8px;
  width: 100%;
}
.esqueceu-senha {
  color: #1a1a6e;
  font-size: 0.85rem;
  cursor: pointer;
  text-decoration: underline;
  margin-top: -4px;
}
.esqueceu-senha:hover {
  opacity: 0.7;
}
.botao-entrar {
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
.area-criar-conta {
  color: #1a1a1a;
  margin-top: 16px;
  font-size: 0.88rem;
  text-align: center;
  width: 100%;
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
.footer-logos {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 60px;
  background: rgba(0, 0, 0, 0.08);
}
.footer-gov-img {
  height: 120px;
  object-fit: contain;
  margin-left: 300px;
}
</style>
