<template>
  <q-page class="pagina-boas-vindas flex flex-center">
    <main class="container-boas-vindas" aria-label="Boas-vindas">
      <figure class="cartao-logo">
        <img src="../assets/Logo.png" alt="Logo Saúde em Dia" class="imagem-logo" />
      </figure>
      <h1 class="texto-boas-vindas">Bem-vindo(a)</h1>
      <nav class="grupo-botoes" aria-label="Ações principais">
        <q-btn label="Entrar" class="botao-acao" unelevated @click="$router.push('/login')" />
        <q-btn
          label="Cadastre-se"
          class="botao-acao"
          unelevated
          @click="$router.push('/cadastro-med')"
        />
      </nav>
    </main>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({ name: 'PaginaBoasVindas' })
</script>

<style scoped>
.pagina-boas-vindas {
  background-color: #7b7fc4;
  min-height: 100vh;
}
.container-boas-vindas {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 32px 16px;
  width: 100%;
  max-width: 400px;
}
.cartao-logo {
  background: white;
  border-radius: 16px;
  padding: 24px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin: 0;
}
.imagem-logo {
  max-width: 220px;
  height: auto;
}
.texto-boas-vindas {
  color: white;
  font-size: 1.6rem;
  font-weight: 400;
  margin: 0;
}
.grupo-botoes {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 60%;
}
.botao-acao {
  background: white !important;
  color: #333 !important;
  border-radius: 8px !important;
  font-size: 1rem;
  padding: 10px 0;
  width: 100%;
}
</style>
