<template>
  <q-page class="welcome-page flex flex-center">
    <div class="welcome-container">
      <div class="logo-card">
        <img src="../assets/Logo.png" alt="Saúde em Dia" class="logo-img" />
      </div>
      <h2 class="welcome-text">Bem-vindo (a)</h2>
      <div class="button-group">
        <q-btn label="Login" class="btn-action" unelevated @click="$router.push('/login')" />
        <q-btn
          label="Cadastre-se"
          class="btn-action"
          unelevated
          @click="$router.push('/cadastro')"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({ name: 'BemVindoPage' })
</script>

<style scoped>
.welcome-page {
  background-color: #7b7fc4;
  min-height: 100vh;
}
.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 32px 16px;
  width: 100%;
  max-width: 400px;
}
.logo-card {
  background: white;
  border-radius: 16px;
  padding: 24px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.logo-img {
  max-width: 220px;
  height: auto;
}
.welcome-text {
  color: white;
  font-size: 1.6rem;
  font-weight: 400;
  margin: 0;
}
.button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 60%;
}
.btn-action {
  background: white !important;
  color: #333 !important;
  border-radius: 8px !important;
  font-size: 1rem;
  padding: 10px 0;
  width: 100%;
}
</style>
