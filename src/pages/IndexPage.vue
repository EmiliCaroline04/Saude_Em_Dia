<template>
  <q-layout view="lHh lpR fFf" class="dash-layout">
    <!-- ── SIDEBAR ESQUERDA ── -->
    <q-drawer v-model="drawer" :width="72" :breakpoint="600" show-if-above class="sidebar">
      <div class="sidebar-inner">
        <q-btn flat round class="nav-btn" @click="handleLogout">
          <q-icon name="logout" size="22px" />
          <q-tooltip anchor="center right" self="center left" :offset="[8, 0]">Sair</q-tooltip>
        </q-btn>

        <div class="nav-divider" />

        <q-btn flat round class="nav-btn active" @click="secao = 'dashboard'">
          <q-icon name="dashboard" size="22px" />
          <q-tooltip anchor="center right" self="center left" :offset="[8, 0]">Dashboard</q-tooltip>
        </q-btn>

        <q-btn flat round class="nav-btn" @click="secao = 'pacientes'">
          <q-icon name="person_add" size="22px" />
          <q-tooltip anchor="center right" self="center left" :offset="[8, 0]">Pacientes</q-tooltip>
        </q-btn>

        <q-btn flat round class="nav-btn" @click="secao = 'agenda'">
          <q-icon name="event" size="22px" />
          <q-tooltip anchor="center right" self="center left" :offset="[8, 0]">Agenda</q-tooltip>
        </q-btn>

        <q-btn flat round class="nav-btn" @click="secao = 'lembretes'">
          <q-icon name="alarm" size="22px" />
          <q-tooltip anchor="center right" self="center left" :offset="[8, 0]">Lembretes</q-tooltip>
        </q-btn>

        <q-btn flat round class="nav-btn" @click="secao = 'medicamentos'">
          <q-icon name="medication" size="22px" />
          <q-tooltip anchor="center right" self="center left" :offset="[8, 0]"
            >Medicamentos</q-tooltip
          >
        </q-btn>

        <q-btn flat round class="nav-btn" @click="secao = 'cadastro-paciente'">
          <q-icon name="assignment_ind" size="22px" />
          <q-tooltip anchor="center right" self="center left" :offset="[8, 0]"
            >Cadastro Paciente</q-tooltip
          >
        </q-btn>

        <q-btn flat round class="nav-btn" @click="secao = 'emergencia'">
          <q-icon name="local_phone" size="22px" />
          <q-tooltip anchor="center right" self="center left" :offset="[8, 0]"
            >Emergência</q-tooltip
          >
        </q-btn>

        <div class="nav-divider" />

        <q-btn flat round class="nav-btn" @click="secao = 'configuracoes'">
          <q-icon name="settings" size="22px" />
          <q-tooltip anchor="center right" self="center left" :offset="[8, 0]"
            >Configurações</q-tooltip
          >
        </q-btn>
      </div>
    </q-drawer>

    <!-- ── CONTEÚDO PRINCIPAL ── -->
    <q-page-container>
      <q-page class="dash-page">
        <!-- HEADER -->
        <div class="dash-header">
          <div class="header-left">
            <span class="header-mes">{{ mesAtual }}</span>
          </div>
          <div class="header-right">
            <span class="header-boas-vindas">Bem-vindo (a) {{ nomeUsuario }}</span>
            <q-avatar size="44px" class="header-avatar">
              <q-icon name="person" size="26px" color="white" />
            </q-avatar>
            <q-btn flat round class="notif-btn" @click="verNotificacoes">
              <q-badge color="red" floating>{{ notificacoes }}</q-badge>
              <q-icon name="notifications" size="26px" color="white" />
            </q-btn>
          </div>
        </div>

        <!-- GRID DASHBOARD -->
        <div class="dash-grid">
          <!-- Card 1: Dados do paciente -->
          <div class="card card-dados">
            <h3 class="card-title">{{ mesAtual }}</h3>
            <div class="dado-item">
              <span class="dado-icon">🩸</span
              ><span
                >Tipo sanguíneo: <strong>{{ dadosPaciente.tipoSanguineo }}</strong></span
              >
            </div>
            <div class="dado-item">
              <span class="dado-icon">⚖️</span
              ><span
                >Peso: <strong>{{ dadosPaciente.peso }} kg</strong></span
              >
            </div>
            <div class="dado-item">
              <span class="dado-icon">🩺</span
              ><span
                >Pressão arterial: <strong>{{ dadosPaciente.pressao }}</strong></span
              >
            </div>
            <div class="dado-item">
              <span class="dado-icon">❤️</span
              ><span
                >Frequência cardíaca: <strong>{{ dadosPaciente.frequencia }} bpm</strong></span
              >
            </div>
            <div class="dado-item">
              <span class="dado-icon">🩸</span
              ><span
                >Glicemia (jejum): <strong>{{ dadosPaciente.glicemia }} mg/dL</strong></span
              >
            </div>
            <q-btn
              flat
              dense
              class="btn-editar-dados"
              icon="edit"
              label="Editar"
              @click="editarDados = true"
            />
          </div>

          <!-- Card 2: Calendário -->
          <div class="card card-calendario">
            <q-date
              v-model="dataCalendario"
              :events="datasConsultas"
              event-color="indigo-6"
              flat
              minimal
              class="q-date-custom"
            />
          </div>

          <!-- Card 3: Próximas consultas -->
          <div class="card card-consultas">
            <h3 class="card-title">PRÓXIMAS CONSULTAS</h3>
            <div v-for="(c, i) in consultas" :key="i" class="consulta-item">
              <span
                >{{ c.data }} - {{ c.hora }}H | <strong>{{ c.medico }}</strong></span
              >
            </div>
            <q-btn
              flat
              dense
              class="btn-add-mini"
              icon="add"
              label="Nova consulta"
              @click="dialogConsulta = true"
            />
          </div>

          <!-- Card 4: Estoque -->
          <div class="card card-estoque">
            <h3 class="card-title">ESTOQUE</h3>
            <div class="grafico-barras">
              <div v-for="med in medicamentos" :key="med.nome" class="barra-wrap">
                <div
                  class="barra"
                  :style="{ height: (med.qtd / maxEstoque) * 120 + 'px', background: med.cor }"
                >
                  <q-tooltip>{{ med.nome }}: {{ med.qtd }} un.</q-tooltip>
                </div>
                <span class="barra-label">{{ med.qtd }}</span>
              </div>
            </div>
          </div>

          <!-- Card 5: Lista medicamentos -->
          <div class="card card-medicamentos">
            <div v-for="(med, i) in medicamentos" :key="i" class="med-row">
              <span class="med-qtd">{{ med.qtd }}</span>
              <span class="med-nome">{{ med.nome }}</span>
            </div>
            <q-btn
              flat
              dense
              class="btn-add-mini"
              icon="add"
              label="Adicionar"
              @click="dialogMed = true"
            />
          </div>

          <!-- Card 6: Emergência -->
          <div class="card card-emergencia">
            <h3 class="card-title emerg-title">EMERGÊNCIA</h3>
            <div class="emerg-btn" @click="ligar('193')">
              <span class="emerg-icon">🧑‍🚒</span>
              <span class="emerg-label"><strong>Bombeiros</strong></span>
              <span class="emerg-num">193</span>
            </div>
            <div class="emerg-btn" @click="ligar('190')">
              <span class="emerg-icon">👮</span>
              <span class="emerg-label"><strong>Polícia</strong></span>
              <span class="emerg-num">190</span>
            </div>
            <div class="historico-btn" @click="secao = 'historico'">
              <q-icon name="assignment" size="28px" color="indigo-8" />
              <span class="historico-label">HISTÓRICO</span>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>

    <!-- Dialog: Editar Dados -->
    <q-dialog v-model="editarDados">
      <q-card class="dialog-card">
        <q-card-section><h3 class="dialog-title">Editar Dados</h3></q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            v-model="dadosPaciente.tipoSanguineo"
            label="Tipo sanguíneo"
            outlined
            dense
            class="q-mb-sm"
          />
          <q-input
            v-model="dadosPaciente.peso"
            label="Peso (kg)"
            outlined
            dense
            class="q-mb-sm"
            type="number"
          />
          <q-input
            v-model="dadosPaciente.pressao"
            label="Pressão arterial"
            outlined
            dense
            class="q-mb-sm"
          />
          <q-input
            v-model="dadosPaciente.frequencia"
            label="Freq. cardíaca (bpm)"
            outlined
            dense
            class="q-mb-sm"
            type="number"
          />
          <q-input
            v-model="dadosPaciente.glicemia"
            label="Glicemia (mg/dL)"
            outlined
            dense
            type="number"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn
            unelevated
            label="Salvar"
            class="btn-salvar"
            v-close-popup
            @click="onSalvarDados"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog: Nova Consulta -->
    <q-dialog v-model="dialogConsulta">
      <q-card class="dialog-card">
        <q-card-section><h3 class="dialog-title">Nova Consulta</h3></q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            v-model="novaConsulta.data"
            label="Data (DD/MM)"
            outlined
            dense
            class="q-mb-sm"
            mask="##/##"
          />
          <q-input
            v-model="novaConsulta.hora"
            label="Hora"
            outlined
            dense
            class="q-mb-sm"
            mask="##:##"
          />
          <q-input v-model="novaConsulta.medico" label="Médico" outlined dense />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn
            unelevated
            label="Adicionar"
            class="btn-salvar"
            v-close-popup
            @click="onAdicionarConsulta"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog: Novo Medicamento -->
    <q-dialog v-model="dialogMed">
      <q-card class="dialog-card">
        <q-card-section><h3 class="dialog-title">Novo Medicamento</h3></q-card-section>
        <q-card-section class="q-pt-none">
          <q-input v-model="novoMed.nome" label="Nome" outlined dense class="q-mb-sm" />
          <q-input v-model="novoMed.qtd" label="Quantidade" outlined dense type="number" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn
            unelevated
            label="Adicionar"
            class="btn-salvar"
            v-close-popup
            @click="onAdicionarMedicamento"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
// ...
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { getUsuarioLocal, logoutMedico } from '../services/authService'

const router = useRouter()
const $q = useQuasar()

// ── Usuário ──
const usuario = getUsuarioLocal()
const nomeUsuario = computed(() => usuario?.nome ?? 'Usuário')

// ── Sidebar ──
const drawer = ref(true)
const secao = ref('dashboard')

// ── Header ──
const notificacoes = ref(3)
const meses = [
  'JANEIRO',
  'FEVEREIRO',
  'MARÇO',
  'ABRIL',
  'MAIO',
  'JUNHO',
  'JULHO',
  'AGOSTO',
  'SETEMBRO',
  'OUTUBRO',
  'NOVEMBRO',
  'DEZEMBRO',
]
const mesAtual = meses[new Date().getMonth()]

function verNotificacoes() {
  $q.notify({
    message: `Você tem ${notificacoes.value} notificações pendentes.`,
    icon: 'notifications',
    color: 'indigo-7',
    position: 'top',
  })
}

// ── Calendário ──
const dataCalendario = ref(new Date().toISOString().substring(0, 10).replace(/-/g, '/'))
const datasConsultas = ref(['2024/08/01', '2024/08/03', '2024/08/15', '2024/08/16'])

// ── Dados do paciente ──
const dadosPaciente = reactive(
  JSON.parse(localStorage.getItem('saudeDiaDados') || 'null') ?? {
    tipoSanguineo: 'O+',
    peso: 72.5,
    pressao: '12x8',
    frequencia: 76,
    glicemia: 92,
  },
)
const editarDados = ref(false)
function onSalvarDados() {
  localStorage.setItem('saudeDiaDados', JSON.stringify(dadosPaciente))
  $q.notify({ type: 'positive', message: 'Dados atualizados!', position: 'top' })
}

// ── Consultas ──
const consultas = ref(
  JSON.parse(localStorage.getItem('saudeDiaConsultas') || 'null') ?? [
    { data: '01/08', hora: '19', medico: 'DR. PAULO' },
    { data: '03/08', hora: '19', medico: 'DR. FELIPE' },
    { data: '15/08', hora: '20', medico: 'DRA. LARISSA' },
    { data: '16/08', hora: '20', medico: 'DRA. ANDRESSA' },
  ],
)
const dialogConsulta = ref(false)
const novaConsulta = reactive({ data: '', hora: '', medico: '' })
function onAdicionarConsulta() {
  if (!novaConsulta.data || !novaConsulta.medico) return
  consultas.value.push({ ...novaConsulta })
  localStorage.setItem('saudeDiaConsultas', JSON.stringify(consultas.value))
  novaConsulta.data = ''
  novaConsulta.hora = ''
  novaConsulta.medico = ''
  $q.notify({ type: 'positive', message: 'Consulta adicionada!', position: 'top' })
}

// ── Medicamentos ──
const coresBarra = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#60a5fa']
const medicamentos = ref(
  (
    JSON.parse(localStorage.getItem('saudeDiaMeds') || 'null') ?? [
      { nome: 'AMITRIPTILINA', qtd: 8 },
      { nome: 'LOSARTANA', qtd: 5 },
      { nome: 'SINVASTATINA', qtd: 4 },
      { nome: 'CLONAZEPAM', qtd: 10 },
      { nome: 'ENALAPRIL', qtd: 2 },
    ]
  ).map((m, i) => ({ ...m, cor: coresBarra[i % coresBarra.length] })),
)
const maxEstoque = computed(() => Math.max(...medicamentos.value.map((m) => m.qtd), 1))
const dialogMed = ref(false)
const novoMed = reactive({ nome: '', qtd: 0 })
function onAdicionarMedicamento() {
  if (!novoMed.nome) return
  const cor = coresBarra[medicamentos.value.length % coresBarra.length]
  medicamentos.value.push({ nome: novoMed.nome.toUpperCase(), qtd: Number(novoMed.qtd), cor })
  localStorage.setItem(
    'saudeDiaMeds',
    JSON.stringify(medicamentos.value.map(({ nome, qtd }) => ({ nome, qtd }))),
  )
  novoMed.nome = ''
  novoMed.qtd = 0
  $q.notify({ type: 'positive', message: 'Medicamento adicionado!', position: 'top' })
}

// ── Emergência ──
function ligar(numero) {
  $q.dialog({
    title: '📞 Confirmar ligação',
    message: `Ligar para <strong>${numero}</strong>?`,
    html: true,
    ok: { label: 'Ligar', color: 'red-7', unelevated: true },
    cancel: { label: 'Cancelar', flat: true },
  }).onOk(() => {
    window.location.href = 'tel:' + numero
  })
}

// ── Logout ──
function handleLogout() {
  $q.dialog({
    title: 'Sair',
    message: 'Deseja encerrar a sessão?',
    ok: { label: 'Sair', color: 'indigo-7', unelevated: true },
    cancel: { label: 'Cancelar', flat: true },
  }).onOk(() => {
    logoutMedico()
    router.push('/login')
  })
}
</script>

<!-- name multi-word fix -->
<script>
export default { name: 'IndexPage' }
</script>

<style scoped>
.dash-layout {
  background: #7b7fc4;
  min-height: 100vh;
}
.dash-page {
  background: #7b7fc4;
  min-height: 100vh;
  padding: 0 16px 24px 16px;
}

/* Sidebar */
:deep(.sidebar) {
  background: #5a5fa8 !important;
  border-right: none !important;
}
.sidebar-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 0;
  height: 100%;
}
.nav-btn {
  width: 48px;
  height: 48px;
  border-radius: 14px !important;
  color: rgba(255, 255, 255, 0.65) !important;
  transition: all 0.2s;
}
.nav-btn:hover,
.nav-btn.active {
  background: rgba(255, 255, 255, 0.18) !important;
  color: white !important;
}
.nav-divider {
  width: 36px;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 6px 0;
}

/* Header */
.dash-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 8px 12px;
}
.header-mes {
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 1px;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.header-boas-vindas {
  font-family: 'Nunito', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: white;
}
.header-avatar {
  background: #5a5fa8;
  border: 2px solid rgba(255, 255, 255, 0.4);
}
.notif-btn {
  color: white !important;
}

/* Grid */
.dash-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 14px;
}

/* Cards base */
.card {
  background: rgba(255, 255, 255, 0.82);
  border-radius: 20px;
  padding: 16px 18px;
  box-shadow: 0 4px 18px rgba(60, 70, 160, 0.12);
}
.card-title {
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 900;
  color: #3730a3;
  margin: 0 0 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Dados */
.card-dados {
  grid-column: 1;
  grid-row: 1;
}
.dado-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  color: #1e293b;
  padding: 5px 0;
  border-bottom: 1px solid #f0f0f0;
}
.dado-item:last-of-type {
  border-bottom: none;
}
.dado-icon {
  font-size: 16px;
}
.btn-editar-dados {
  margin-top: 8px;
  color: #6366f1 !important;
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
}

/* Calendário */
.card-calendario {
  grid-column: 2;
  grid-row: 1;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
:deep(.q-date-custom) {
  background: transparent !important;
  width: 100%;
}
:deep(.q-date__header) {
  display: none;
}

/* Consultas */
.card-consultas {
  grid-column: 3;
  grid-row: 1;
}
.consulta-item {
  font-family: 'Nunito', sans-serif;
  font-size: 12.5px;
  color: #1e293b;
  background: #eef2ff;
  border-radius: 10px;
  padding: 8px 12px;
  margin-bottom: 6px;
}
.btn-add-mini {
  margin-top: 6px;
  color: #6366f1 !important;
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
}

/* Estoque */
.card-estoque {
  grid-column: 1;
  grid-row: 2;
}
.grafico-barras {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 140px;
  padding-top: 12px;
}
.barra-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
}
.barra {
  width: 100%;
  border-radius: 6px 6px 0 0;
  min-height: 6px;
  transition: height 0.4s ease;
  cursor: pointer;
}
.barra-label {
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #475569;
}

/* Medicamentos */
.card-medicamentos {
  grid-column: 2;
  grid-row: 2;
}
.med-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 7px 0;
  border-bottom: 1px solid #f0f4ff;
  font-family: 'Nunito', sans-serif;
}
.med-qtd {
  font-size: 15px;
  font-weight: 900;
  color: #3730a3;
  min-width: 24px;
  text-align: right;
}
.med-nome {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  letter-spacing: 0.5px;
}

/* Emergência */
.card-emergencia {
  grid-column: 3;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.emerg-title {
  color: #b91c1c;
}
.emerg-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fef2f2;
  border-radius: 12px;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.2s;
}
.emerg-btn:hover {
  background: #fee2e2;
}
.emerg-icon {
  font-size: 26px;
}
.emerg-label {
  flex: 1;
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  color: #1e293b;
}
.emerg-num {
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 800;
  color: #dc2626;
  background: #fecaca;
  border-radius: 8px;
  padding: 2px 8px;
}
.historico-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #eef2ff;
  border-radius: 12px;
  padding: 12px 14px;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 4px;
}
.historico-btn:hover {
  background: #e0e7ff;
}
.historico-label {
  font-family: 'Nunito', sans-serif;
  font-size: 15px;
  font-weight: 900;
  color: #3730a3;
  letter-spacing: 1px;
}

/* Dialogs */
.dialog-card {
  border-radius: 20px;
  min-width: 320px;
}
.dialog-title {
  font-family: 'Nunito', sans-serif;
  font-weight: 800;
  font-size: 17px;
  color: #3730a3;
  margin: 0;
}
.btn-salvar {
  background: #6366f1 !important;
  color: white !important;
  border-radius: 10px;
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
}

/* Responsivo */
@media (max-width: 900px) {
  .dash-grid {
    grid-template-columns: 1fr 1fr;
  }
  .card-calendario {
    grid-column: 1 / -1;
  }
  .card-emergencia {
    grid-column: 1 / -1;
  }
}
@media (max-width: 600px) {
  .dash-grid {
    grid-template-columns: 1fr;
  }
  .card-dados,
  .card-calendario,
  .card-consultas,
  .card-estoque,
  .card-medicamentos,
  .card-emergencia {
    grid-column: 1;
    grid-row: auto;
  }
}
</style>
