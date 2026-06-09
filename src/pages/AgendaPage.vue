<template>
  <q-layout view="lHh lpR fFf" class="dash-layout">
    <q-drawer v-model="drawer" :width="72" :breakpoint="600" show-if-above class="sidebar">
      <div class="sidebar-inner">
        <q-btn flat round class="nav-btn" @click="router.push('/home')">
          <q-icon name="dashboard" size="22px" />
        </q-btn>

        <q-btn flat round class="nav-btn active">
          <q-icon name="event" size="22px" />
        </q-btn>
      </div>
    </q-drawer>
    
    <q-page-container>
      <q-page class="dash-page">
        <div class="dash-header">
          <span class="header-title">AGENDA</span>

          <div class="header-right">
            <span class="header-user"> Bem-vindo(a) Médico Demo </span>

            <q-avatar size="44px" class="header-avatar">
              <q-icon name="person" size="26px" color="white" />
            </q-avatar>
          </div>
        </div>

        <!-- CARD -->
        <div class="agenda-container">
          <div class="agenda-card">
            <div class="voltar-area">
              <q-btn
                round
                dense
                icon="arrow_back"
                class="btn-voltar"
                @click="router.push('/home')"
              />
            </div>

            <h2 class="agenda-title">MINHA AGENDA</h2>

            <div class="agenda-content">
              <q-card flat bordered class="consulta-card">
                <q-card-section>
                  <div class="text-h6">Consulta - João Silva</div>
                  <div>09:00 - Clínica Central</div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="consulta-card">
                <q-card-section>
                  <div class="text-h6">Consulta - Maria Souza</div>
                  <div>14:00 - Clínica Central</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const drawer = ref(true)
</script>

<style scoped>
.dash-layout {
  background: #7b7fc4;
  min-height: 100vh;
}

.sidebar {
  background: #6b6cb3;
}

.sidebar-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  gap: 12px;
}

.nav-btn {
  color: white;
}

.nav-btn.active {
  background: rgba(255, 255, 255, 0.2);
}

.dash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: rgba(0, 0, 0, 0.1);
}

.header-title,
.header-user {
  color: white;
}

.header-avatar {
  background: rgba(255, 255, 255, 0.2);
}

.agenda-container {
  display: flex;
  justify-content: center;
  padding: 40px 24px;
}

.agenda-card {
  background: white;
  width: 100%;
  max-width: 800px;
  border-radius: 16px;
  padding: 24px;
  position: relative;
}

.agenda-title {
  text-align: center;
  color: #6b6cb3;
  margin-bottom: 24px;
}

.consulta-card {
  margin-bottom: 16px;
}

.voltar-area {
  position: absolute;
  top: 16px;
  left: 16px;
}

.btn-voltar {
  background: white;
  color: #7b7fc4;
  border: 1px solid #ddd;
}
</style>
