<template>
  <q-layout view="lHh lpR fFf" :class="['dash-layout', modoEscuro ? 'dark-mode' : '']">
    <!-- ── SIDEBAR ESQUERDA ── -->
    <q-drawer v-model="drawer" :width="72" :breakpoint="600" show-if-above class="sidebar">
      <div class="sidebar-inner">
        <q-btn flat round class="nav-btn" @click="handleLogout">
          <q-icon name="logout" size="22px" />
          <q-tooltip anchor="center right" self="center left" :offset="[8, 0]">Sair</q-tooltip>
        </q-btn>

        <div class="nav-divider" />

        <q-btn
          flat
          round
          :class="['nav-btn', secao === 'dashboard' ? 'active' : '']"
          @click="secao = 'dashboard'"
        >
          <q-icon name="dashboard" size="22px" />
          <q-tooltip anchor="center right" self="center left" :offset="[8, 0]">Dashboard</q-tooltip>
        </q-btn>

        <q-btn
          flat
          round
          :class="['nav-btn', secao === 'pacientes' ? 'active' : '']"
          @click="secao = 'pacientes'"
        >
          <q-icon name="person" size="22px" />
          <q-tooltip anchor="center right" self="center left" :offset="[8, 0]">Pacientes</q-tooltip>
        </q-btn>

        <q-btn
          flat
          round
          :class="['nav-btn', secao === 'agenda' ? 'active' : '']"
          @click="abrirAgenda(null)"
        >
          <q-icon name="event" size="22px" />
          <q-tooltip anchor="center right" self="center left" :offset="[8, 0]">Agenda</q-tooltip>
        </q-btn>

        <q-btn
          flat
          round
          :class="['nav-btn', secao === 'alarmes' ? 'active' : '']"
          @click="abrirAlarmes"
        >
          <q-icon name="alarm" size="22px" />
          <q-tooltip anchor="center right" self="center left" :offset="[8, 0]">Alarmes</q-tooltip>
        </q-btn>

        <q-btn
          flat
          round
          :class="['nav-btn', secao === 'medicamentos' ? 'active' : '']"
          @click="router.push('/cadastro-medicamento')"
        >
          <q-icon name="medication" size="22px" />
          <q-tooltip anchor="center right" self="center left" :offset="[8, 0]"
            >Medicamentos</q-tooltip
          >
        </q-btn>

        <q-btn
          flat
          round
          :class="['nav-btn', secao === 'emergencia' ? 'active' : '']"
          @click="router.push('/emergencia')"
        >
          <q-icon name="local_phone" size="22px" />
          <q-tooltip anchor="center right" self="center left" :offset="[8, 0]"
            >Emergência</q-tooltip
          >
        </q-btn>

        <div class="nav-divider" />

        <q-btn
          flat
          round
          :class="['nav-btn', secao === 'configuracoes' ? 'active' : '']"
          @click="secao = 'configuracoes'"
        >
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
        <!-- ═══════════════ CONFIGURAÇÕES ═══════════════ -->
        <div v-if="secao === 'configuracoes'" class="config-page">
          <div class="config-header">
            <q-btn flat round class="config-back-btn" @click="secao = 'dashboard'">
              <q-icon name="arrow_back" size="22px" />
            </q-btn>
            <h2 class="config-title">CONFIGURAÇÕES</h2>
          </div>
          <div class="config-card">
            <div class="config-row">
              <div class="config-row-left">
                <q-icon name="notifications" size="28px" class="config-icon" />
                <span class="config-label">NOTIFICAÇÕES</span>
              </div>
              <q-toggle
                v-model="notifAtivas"
                color="blue-6"
                size="56px"
                @update:model-value="onToggleNotif"
              />
            </div>
            <div class="config-row">
              <div class="config-row-left">
                <q-icon name="dark_mode" size="28px" class="config-icon" />
                <span class="config-label">Modo Escuro</span>
              </div>
              <q-toggle
                v-model="modoEscuro"
                color="blue-6"
                size="56px"
                @update:model-value="onToggleModoEscuro"
              />
            </div>
          </div>
        </div>

        <!-- ═══════════════ AGENDA ═══════════════ -->
        <div v-else-if="secao === 'agenda'" class="agenda-page">
          <!-- Header -->
          <div class="agenda-header">
            <q-btn flat round class="config-back-btn" @click="secao = 'dashboard'">
              <q-icon name="arrow_back" size="22px" />
            </q-btn>
            <div class="agenda-header-info">
              <h2 class="config-title" style="margin: 0">AGENDA</h2>
              <span class="agenda-header-sub">{{ consultasFiltradas.length }} consulta(s)</span>
            </div>
            <q-btn
              unelevated
              icon="add"
              label="NOVA CONSULTA"
              class="btn-nova-consulta"
              @click="dialogConsulta = true"
              style="margin-left: auto"
            />
          </div>

          <!-- Filtro por data -->
          <div class="agenda-filtro">
            <div class="filtro-input-wrap">
              <q-icon name="filter_alt" size="18px" color="#6366f1" />
              <input
                v-model="filtroData"
                type="text"
                placeholder="Filtrar por data (DD/MM ou DD/MM/AAAA)"
                class="filtro-input"
              />
              <q-btn
                v-if="filtroData"
                flat
                round
                dense
                icon="close"
                size="sm"
                color="grey-5"
                @click="filtroData = ''"
              />
            </div>
            <div v-if="filtroData" class="filtro-badge">
              {{ consultasFiltradas.length }} resultado(s) para "{{ filtroData }}"
            </div>
          </div>

          <!-- Vazio -->
          <div v-if="!consultasFiltradas.length" class="agenda-vazio">
            <q-icon name="event_busy" size="72px" color="rgba(255,255,255,0.3)" />
            <p class="agenda-vazio-titulo">
              {{ filtroData ? 'Nenhuma consulta nesta data' : 'Nenhuma consulta cadastrada' }}
            </p>
            <q-btn
              unelevated
              label="NOVA CONSULTA"
              icon="add"
              class="btn-salvar"
              style="
                margin-top: 16px;
                border-radius: 24px;
                padding: 12px 32px;
                font-family: 'Nunito', sans-serif;
                font-weight: 900;
              "
              @click="dialogConsulta = true"
            />
          </div>

          <!-- Lista de consultas -->
          <div class="agenda-lista">
            <div
              v-for="(c, i) in consultasFiltradas"
              :key="i"
              class="agenda-card"
              :class="{ 'agenda-hoje': isHoje(c.data), 'agenda-amanha': isAmanha(c.data) }"
            >
              <!-- Data destaque -->
              <div class="agenda-card-data">
                <span class="agenda-card-dia">{{ c.data.split('/')[0] }}</span>
                <span class="agenda-card-mes">{{
                  nomesMes[parseInt(c.data.split('/')[1]) - 1] || ''
                }}</span>
              </div>

              <!-- Info -->
              <div class="agenda-card-info">
                <div class="agenda-card-medico">{{ c.medico }}</div>
                <div class="agenda-card-hora">
                  <q-icon name="schedule" size="14px" color="#6366f1" />
                  <span>{{ c.hora }}H</span>
                </div>
                <div v-if="isHoje(c.data)" class="agenda-badge-hoje">HOJE</div>
                <div v-else-if="isAmanha(c.data)" class="agenda-badge-amanha">AMANHÃ</div>
              </div>

              <!-- Ações -->
              <div class="agenda-card-acoes">
                <q-btn
                  flat
                  round
                  dense
                  icon="edit"
                  color="indigo-5"
                  size="sm"
                  @click="editarConsulta(i)"
                >
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  dense
                  icon="delete"
                  color="red-4"
                  size="sm"
                  @click="excluirConsulta(i)"
                >
                  <q-tooltip>Excluir</q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>
        </div>

        <!-- ═══════════════ ALARMES ═══════════════ -->
        <div v-else-if="secao === 'alarmes'" class="alarmes-page">
          <div class="alarmes-page-header">
            <q-btn flat round class="config-back-btn" @click="secao = 'dashboard'">
              <q-icon name="arrow_back" size="22px" />
            </q-btn>
            <h2 class="config-title">ALARMES</h2>
            <div style="margin-left: auto; display: flex; align-items: center; gap: 10px">
              <span class="alarmes-total-badge" v-if="totalAlarmes > 0">
                {{ totalAlarmes }} alarme{{ totalAlarmes !== 1 ? 's' : '' }}
              </span>
              <q-btn flat round class="notif-btn">
                <q-badge color="red" floating>{{ totalAlarmes }}</q-badge>
                <q-icon name="notifications" size="26px" color="white" />
              </q-btn>
            </div>
          </div>

          <div v-if="!todosAlarmes.length" class="alarmes-vazio">
            <q-icon name="alarm_off" size="80px" color="rgba(255,255,255,0.3)" />
            <p class="alarmes-vazio-titulo">Nenhum alarme cadastrado</p>
            <p class="alarmes-vazio-sub">
              Cadastre medicamentos e adicione alarmes na página de medicamentos.
            </p>
            <q-btn
              unelevated
              label="IR PARA MEDICAMENTOS"
              icon="medication"
              class="btn-salvar"
              style="
                margin-top: 16px;
                border-radius: 24px;
                padding: 12px 32px;
                font-family: 'Nunito', sans-serif;
                font-weight: 900;
              "
              @click="router.push('/cadastro-medicamento')"
            />
          </div>

          <div v-for="grupo in todosAlarmes" :key="grupo.medId" class="alarme-grupo">
            <div class="alarme-grupo-header">
              <div class="alarme-grupo-header-left">
                <div class="alarme-grupo-icon">
                  <q-icon name="medication" size="18px" color="white" />
                </div>
                <span class="alarme-grupo-nome">{{ grupo.medNome }}</span>
                <span class="alarme-grupo-count">{{ grupo.alarmes.length }}x</span>
              </div>
              <q-btn
                flat
                round
                dense
                icon="open_in_new"
                color="white"
                size="sm"
                @click="
                  router.push({ path: '/alarme', query: { id: grupo.medId, nome: grupo.medNome } })
                "
              >
                <q-tooltip>Gerenciar alarmes deste medicamento</q-tooltip>
              </q-btn>
            </div>

            <div
              v-for="(al, idx) in grupo.alarmes"
              :key="al.id"
              class="alarme-item"
              :class="{ 'alarme-inativo': !al.ativo }"
            >
              <div class="al-icone" :style="{ background: al.ativo ? '#6366f1' : '#94a3b8' }">
                <q-icon name="alarm" size="22px" color="white" />
              </div>
              <div class="al-info">
                <span class="al-hora">{{ al.hora }}</span>
                <span class="al-label">{{ al.label || 'Tomar medicamento' }}</span>
                <div class="al-dias">
                  <span
                    v-for="dia in diasSemana"
                    :key="dia.sigla"
                    class="al-dia"
                    :class="{ 'al-dia-on': al.dias?.includes(dia.sigla) }"
                    >{{ dia.abrev }}</span
                  >
                </div>
              </div>
              <q-toggle
                :model-value="al.ativo"
                color="indigo-6"
                size="40px"
                @update:model-value="(val) => toggleAlarme(grupo.medId, idx, val)"
              />
              <q-btn
                flat
                round
                dense
                icon="delete"
                color="red-4"
                size="sm"
                @click="excluirAlarme(grupo.medId, idx, al.hora)"
              >
                <q-tooltip>Excluir alarme</q-tooltip>
              </q-btn>
            </div>
          </div>

          <div
            v-if="todosAlarmes.length"
            style="display: flex; justify-content: center; margin-top: 8px"
          >
            <q-btn
              unelevated
              label="GERENCIAR MEDICAMENTOS"
              icon="medication"
              class="btn-salvar"
              style="
                border-radius: 24px;
                padding: 12px 32px;
                font-family: 'Nunito', sans-serif;
                font-weight: 900;
              "
              @click="router.push('/cadastro-medicamento')"
            />
          </div>
        </div>

        <!-- ═══════════════ DASHBOARD ═══════════════ -->
        <template v-else>
          <div class="dash-header">
            <div class="header-left">
              <span class="header-mes">{{ mesAtual }}</span>
            </div>
            <div class="header-right">
              <span class="header-boas-vindas">Bem-vindo (a) {{ nomeUsuario }}</span>
              <q-avatar size="44px" class="header-avatar">
                <q-icon name="person" size="26px" color="white" />
              </q-avatar>
              <q-btn v-if="notifAtivas" flat round class="notif-btn" @click="verNotificacoes">
                <q-badge color="red" floating>{{ notificacoes }}</q-badge>
                <q-icon name="notifications" size="26px" color="white" />
              </q-btn>
              <q-btn v-else flat round class="notif-btn" disabled>
                <q-icon name="notifications_off" size="26px" color="rgba(255,255,255,0.35)" />
              </q-btn>
            </div>
          </div>

          <div class="dash-grid">
            <!-- Card 1: Dados -->
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

            <!-- Card 2: Calendário clicável -->
            <div class="card card-calendario">
              <q-date
                v-model="dataCalendario"
                :events="datasConsultasFormatadas"
                event-color="indigo-6"
                flat
                minimal
                class="q-date-custom"
                @update:model-value="onClicarCalendario"
              />
            </div>

            <!-- Card 3: Consultas -->
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

            <!-- Card 5: Medicamentos -->
            <div class="card card-medicamentos">
              <h3 class="card-title">MEDICAMENTOS</h3>
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
                @click="router.push('/cadastro-medicamento?novo=1')"
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
        </template>
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

    <!-- Dialog: Nova / Editar Consulta -->
    <q-dialog v-model="dialogConsulta" @hide="resetarFormConsulta">
      <q-card class="dialog-card">
        <q-card-section>
          <h3 class="dialog-title">
            {{ editandoConsultaIdx !== null ? 'EDITAR CONSULTA' : 'NOVA CONSULTA' }}
          </h3>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            v-model="novaConsulta.data"
            label="Data (DD/MM ou DD/MM/AAAA)"
            outlined
            dense
            class="q-mb-sm"
            mask="##/##/####"
            hint="Ex: 15/08/2026"
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
            :label="editandoConsultaIdx !== null ? 'SALVAR' : 'ADICIONAR'"
            class="btn-salvar"
            v-close-popup
            @click="onSalvarConsulta"
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
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { getUsuarioLocal, logoutMedico } from '../services/authService'

const router = useRouter()
const $q = useQuasar()

const usuario = getUsuarioLocal()
const nomeUsuario = computed(() => usuario?.nome ?? 'Usuário')
const drawer = ref(true)
const secao = ref('dashboard')

// ── Configurações ──────────────────────────────────────────
const notifAtivas = ref(JSON.parse(localStorage.getItem('saudeDiaNotif') ?? 'true'))
const modoEscuro = ref(JSON.parse(localStorage.getItem('saudeDiaDark') ?? 'false'))

function onToggleNotif(val) {
  localStorage.setItem('saudeDiaNotif', JSON.stringify(val))
  $q.notify({
    message: val ? 'Notificações ativadas' : 'Notificações desativadas',
    icon: val ? 'notifications' : 'notifications_off',
    color: 'indigo-7',
    position: 'top',
    timeout: 1500,
  })
}
function onToggleModoEscuro(val) {
  localStorage.setItem('saudeDiaDark', JSON.stringify(val))
  $q.notify({
    message: val ? 'Modo escuro ativado' : 'Modo claro ativado',
    icon: val ? 'dark_mode' : 'light_mode',
    color: 'indigo-7',
    position: 'top',
    timeout: 1500,
  })
}

// ── Dias da semana ─────────────────────────────────────────
const diasSemana = [
  { sigla: 'dom', abrev: 'Dom' },
  { sigla: 'seg', abrev: 'Seg' },
  { sigla: 'ter', abrev: 'Ter' },
  { sigla: 'qua', abrev: 'Qua' },
  { sigla: 'qui', abrev: 'Qui' },
  { sigla: 'sex', abrev: 'Sex' },
  { sigla: 'sab', abrev: 'Sáb' },
]

const nomesMes = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
]

// ── Alarmes ────────────────────────────────────────────────
const alarmesTick = ref(0)

const todosAlarmes = computed(() => {
  void alarmesTick.value
  const meds = (() => {
    try {
      return JSON.parse(localStorage.getItem('saudeDiaMedsCompleto') || '[]')
    } catch {
      return []
    }
  })()
  return meds
    .map((m) => {
      const alarmes = (() => {
        try {
          return JSON.parse(localStorage.getItem(`saudeDiaAlarmes_${m.id}`) || '[]')
        } catch {
          return []
        }
      })()
      return { medId: m.id, medNome: m.nome.toUpperCase(), alarmes }
    })
    .filter((g) => g.alarmes.length > 0)
})

const totalAlarmes = computed(() =>
  todosAlarmes.value.reduce((acc, g) => acc + g.alarmes.length, 0),
)

function abrirAlarmes() {
  alarmesTick.value++
  secao.value = 'alarmes'
}

function toggleAlarme(medId, idx, val) {
  const lista = (() => {
    try {
      return JSON.parse(localStorage.getItem(`saudeDiaAlarmes_${medId}`) || '[]')
    } catch {
      return []
    }
  })()
  lista[idx].ativo = val
  localStorage.setItem(`saudeDiaAlarmes_${medId}`, JSON.stringify(lista))
  alarmesTick.value++
}

function excluirAlarme(medId, idx, hora) {
  $q.dialog({
    title: 'Excluir alarme',
    message: `Excluir o alarme das <strong>${hora}</strong>?`,
    html: true,
    ok: { label: 'Excluir', color: 'red-7', unelevated: true },
    cancel: { label: 'Cancelar', flat: true },
  }).onOk(() => {
    const lista = (() => {
      try {
        return JSON.parse(localStorage.getItem(`saudeDiaAlarmes_${medId}`) || '[]')
      } catch {
        return []
      }
    })()
    lista.splice(idx, 1)
    localStorage.setItem(`saudeDiaAlarmes_${medId}`, JSON.stringify(lista))
    alarmesTick.value++
    $q.notify({ type: 'positive', message: 'Alarme excluído!', position: 'top' })
  })
}

// ── Notificações ───────────────────────────────────────────
const notificacoes = ref(0)

function atualizarBadge() {
  let total = 0
  try {
    const meds = JSON.parse(localStorage.getItem('saudeDiaMedsCompleto') || '[]')
    meds.forEach((m) => {
      if (Number(m.quantidade) <= 2) total++
    })
    const cons = JSON.parse(localStorage.getItem('saudeDiaConsultas') || '[]')
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    cons.forEach((c) => {
      if (!c.data) return
      const p = c.data.split('/')
      if (p.length < 2) return
      const d = new Date(
        p[2] ? parseInt(p[2]) : hoje.getFullYear(),
        parseInt(p[1]) - 1,
        parseInt(p[0]),
      )
      d.setHours(0, 0, 0, 0)
      const diff = Math.round((d - hoje) / 86400000)
      if (diff === 0 || diff === 1) total++
    })
    const diasSigla = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']
    const diaHoje = diasSigla[new Date().getDay()]
    meds.forEach((med) => {
      const al = JSON.parse(localStorage.getItem(`saudeDiaAlarmes_${med.id}`) || '[]')
      total += al.filter((a) => a.ativo && a.dias?.includes(diaHoje)).length
    })
  } catch {
    /* silencioso */
  }
  notificacoes.value = total
}
atualizarBadge()

function verNotificacoes() {
  const msgs = []
  try {
    const meds = JSON.parse(localStorage.getItem('saudeDiaMedsCompleto') || '[]')
    meds.forEach((med) => {
      if (Number(med.quantidade) <= 2)
        msgs.push(`💊 Estoque crítico: <strong>${med.nome}</strong> — ${med.quantidade} unidade(s)`)
    })
  } catch {
    /* silencioso */
  }
  try {
    const cons = JSON.parse(localStorage.getItem('saudeDiaConsultas') || '[]')
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    cons.forEach((c) => {
      if (!c.data) return
      const p = c.data.split('/')
      if (p.length < 2) return
      const d = new Date(
        p[2] ? parseInt(p[2]) : hoje.getFullYear(),
        parseInt(p[1]) - 1,
        parseInt(p[0]),
      )
      d.setHours(0, 0, 0, 0)
      const diff = Math.round((d - hoje) / (1000 * 60 * 60 * 24))
      if (diff === 0) msgs.push(`📅 Consulta <strong>HOJE</strong> — ${c.hora}H com ${c.medico}`)
      else if (diff === 1)
        msgs.push(`🗓️ Consulta <strong>amanhã</strong> — ${c.hora}H com ${c.medico}`)
    })
  } catch {
    /* silencioso */
  }
  try {
    const meds = JSON.parse(localStorage.getItem('saudeDiaMedsCompleto') || '[]')
    const diasSigla = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']
    const diaHoje = diasSigla[new Date().getDay()]
    meds.forEach((med) => {
      const al = JSON.parse(localStorage.getItem(`saudeDiaAlarmes_${med.id}`) || '[]')
      al.filter((a) => a.ativo && a.dias?.includes(diaHoje)).forEach((a) => {
        msgs.push(`⏰ <strong>${med.nome}</strong> — tomar às ${a.hora}`)
      })
    })
  } catch {
    /* silencioso */
  }
  notificacoes.value = msgs.length
  $q.dialog({
    title: '🔔 Notificações do Dia',
    message: msgs.length
      ? msgs
          .map((m) => `<div style="padding:8px 0;border-bottom:1px solid #f0f0f0">${m}</div>`)
          .join('')
      : '<div style="text-align:center;padding:16px;color:#94a3b8">✅ Nenhuma notificação pendente</div>',
    html: true,
    ok: { label: 'Fechar', color: 'indigo-7', unelevated: true },
  })
}

// ── Header ─────────────────────────────────────────────────
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

// ── Calendário ─────────────────────────────────────────────
const dataCalendario = ref(new Date().toISOString().substring(0, 10).replace(/-/g, '/'))

// Converte consultas para formato YYYY/MM/DD para o q-date
const datasConsultasFormatadas = computed(() => {
  return consultas.value
    .map((c) => {
      if (!c.data) return null
      const p = c.data.split('/')
      if (p.length < 2) return null
      const ano = p[2] || new Date().getFullYear()
      const mes = p[1].padStart(2, '0')
      const dia = p[0].padStart(2, '0')
      return `${ano}/${mes}/${dia}`
    })
    .filter(Boolean)
})

function onClicarCalendario(val) {
  // val: YYYY/MM/DD
  if (!val) return
  const partes = val.split('/')
  const dia = partes[2]
  const mes = partes[1]
  const filtro = `${dia}/${mes}`
  abrirAgenda(filtro)
}

// ── Dados paciente ─────────────────────────────────────────
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

// ── Consultas ──────────────────────────────────────────────
const consultas = ref(
  JSON.parse(localStorage.getItem('saudeDiaConsultas') || 'null') ?? [
    { data: '01/08', hora: '19', medico: 'DR. PAULO' },
    { data: '03/08', hora: '19', medico: 'DR. FELIPE' },
    { data: '15/08', hora: '20', medico: 'DRA. LARISSA' },
    { data: '16/08', hora: '20', medico: 'DRA. ANDRESSA' },
  ],
)

const dialogConsulta = ref(false)
const editandoConsultaIdx = ref(null)
const novaConsulta = reactive({ data: '', hora: '', medico: '' })
const filtroData = ref('')

const consultasFiltradas = computed(() => {
  if (!filtroData.value.trim()) return consultas.value
  return consultas.value.filter((c) => c.data?.startsWith(filtroData.value.trim()))
})

function abrirAgenda(filtro) {
  filtroData.value = filtro || ''
  secao.value = 'agenda'
}

function resetarFormConsulta() {
  editandoConsultaIdx.value = null
  novaConsulta.data = ''
  novaConsulta.hora = ''
  novaConsulta.medico = ''
}

function editarConsulta(idxFiltrado) {
  // Acha o índice real na lista original
  const consultaAlvo = consultasFiltradas.value[idxFiltrado]
  const idxReal = consultas.value.indexOf(consultaAlvo)
  editandoConsultaIdx.value = idxReal
  novaConsulta.data = consultaAlvo.data
  novaConsulta.hora = consultaAlvo.hora
  novaConsulta.medico = consultaAlvo.medico
  dialogConsulta.value = true
}

function excluirConsulta(idxFiltrado) {
  const consultaAlvo = consultasFiltradas.value[idxFiltrado]
  $q.dialog({
    title: 'Excluir consulta',
    message: `Excluir consulta de <strong>${consultaAlvo.medico}</strong>?`,
    html: true,
    ok: { label: 'Excluir', color: 'red-7', unelevated: true },
    cancel: { label: 'Cancelar', flat: true },
  }).onOk(() => {
    const idxReal = consultas.value.indexOf(consultaAlvo)
    consultas.value.splice(idxReal, 1)
    localStorage.setItem('saudeDiaConsultas', JSON.stringify(consultas.value))
    $q.notify({ type: 'positive', message: 'Consulta excluída!', position: 'top' })
  })
}

function onSalvarConsulta() {
  if (!novaConsulta.data || !novaConsulta.medico) return
  if (editandoConsultaIdx.value !== null) {
    consultas.value[editandoConsultaIdx.value] = { ...novaConsulta }
    $q.notify({ type: 'positive', message: 'Consulta atualizada!', position: 'top' })
  } else {
    consultas.value.push({ ...novaConsulta })
    $q.notify({ type: 'positive', message: 'Consulta adicionada!', position: 'top' })
  }
  localStorage.setItem('saudeDiaConsultas', JSON.stringify(consultas.value))
  atualizarBadge()
}

function isHoje(data) {
  if (!data) return false
  const p = data.split('/')
  const hoje = new Date()
  const d = new Date(p[2] || hoje.getFullYear(), parseInt(p[1]) - 1, parseInt(p[0]))
  d.setHours(0, 0, 0, 0)
  hoje.setHours(0, 0, 0, 0)
  return d.getTime() === hoje.getTime()
}

function isAmanha(data) {
  if (!data) return false
  const p = data.split('/')
  const amanha = new Date()
  amanha.setDate(amanha.getDate() + 1)
  const d = new Date(p[2] || amanha.getFullYear(), parseInt(p[1]) - 1, parseInt(p[0]))
  d.setHours(0, 0, 0, 0)
  amanha.setHours(0, 0, 0, 0)
  return d.getTime() === amanha.getTime()
}

// ── Medicamentos ───────────────────────────────────────────
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

// ── Emergência ─────────────────────────────────────────────
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

// ── Logout ─────────────────────────────────────────────────
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

/* Modo escuro */
.dark-mode.dash-layout {
  background: #1e1e2e;
}
.dark-mode .dash-page {
  background: #1e1e2e;
}
.dark-mode .card {
  background: rgba(40, 40, 60, 0.92) !important;
}
.dark-mode .card-title {
  color: #a5b4fc !important;
}
.dark-mode .dado-item {
  color: #e2e8f0 !important;
  border-color: #2d2d4e !important;
}
.dark-mode .consulta-item {
  background: #2d2d4e !important;
  color: #e2e8f0 !important;
}
.dark-mode .med-row {
  border-color: #2d2d4e !important;
}
.dark-mode .med-nome {
  color: #e2e8f0 !important;
}
.dark-mode .med-qtd {
  color: #a5b4fc !important;
}
.dark-mode .barra-label {
  color: #e2e8f0 !important;
}
.dark-mode .historico-btn {
  background: #2d2d4e !important;
}
.dark-mode .historico-label {
  color: #a5b4fc !important;
}
.dark-mode .header-boas-vindas {
  color: #e2e8f0;
}
.dark-mode .config-card {
  background: rgba(40, 40, 60, 0.92) !important;
}
.dark-mode .config-label {
  color: #e2e8f0 !important;
}
.dark-mode .config-icon {
  color: #a5b4fc !important;
}
.dark-mode .config-title {
  color: white !important;
}
.dark-mode .alarme-grupo {
  background: rgba(40, 40, 60, 0.92) !important;
}
.dark-mode .alarme-item {
  border-color: #2d2d4e !important;
}
.dark-mode .alarme-item:hover {
  background: #2d2d4e !important;
}
.dark-mode .al-hora {
  color: #e2e8f0 !important;
}
.dark-mode .al-label {
  color: #94a3b8 !important;
}
.dark-mode .emerg-btn {
  background: #3d2020 !important;
}
.dark-mode .emerg-label {
  color: #f1f5f9 !important;
}
.dark-mode .emerg-num {
  background: #7f1d1d !important;
  color: #fca5a5 !important;
}
.dark-mode .emerg-title {
  color: #fca5a5 !important;
}
.dark-mode .agenda-card {
  background: rgba(40, 40, 60, 0.92) !important;
}
.dark-mode .agenda-card-medico {
  color: #e2e8f0 !important;
}
.dark-mode .filtro-input {
  background: rgba(40, 40, 60, 0.7) !important;
  color: #e2e8f0 !important;
}
.dark-mode :deep(.q-date__calendar-days-row .q-date__calendar-item button) {
  color: #e2e8f0 !important;
}
.dark-mode :deep(.q-date__calendar-weekdays > div) {
  color: #a5b4fc !important;
}
.dark-mode :deep(.q-date__navigation .q-btn) {
  color: #e2e8f0 !important;
}
.dark-mode :deep(.q-date .q-btn__content) {
  color: #e2e8f0 !important;
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
  position: relative;
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
  gap: 14px;
}

/* Cards */
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

/* ══ Agenda ══ */
.agenda-page {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-bottom: 40px;
}
.agenda-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 8px 4px;
  flex-wrap: wrap;
}
.agenda-header-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.agenda-header-sub {
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
  font-weight: 600;
}
.btn-nova-consulta {
  background: rgba(255, 255, 255, 0.95) !important;
  color: #3730a3 !important;
  border-radius: 20px;
  font-family: 'Nunito', sans-serif;
  font-weight: 900;
  font-size: 13px;
  padding: 8px 20px;
}

.agenda-filtro {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.filtro-input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 14px;
  padding: 10px 16px;
  box-shadow: 0 2px 8px rgba(60, 70, 160, 0.1);
}
.filtro-input {
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  color: #1e293b;
  flex: 1;
}
.filtro-input::placeholder {
  color: #94a3b8;
}
.filtro-badge {
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
  padding-left: 6px;
}

.agenda-vazio {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Nunito', sans-serif;
  gap: 8px;
  text-align: center;
}
.agenda-vazio-titulo {
  font-size: 18px;
  font-weight: 800;
  margin: 0;
}

.agenda-lista {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.agenda-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.93);
  border-radius: 18px;
  padding: 14px 18px;
  box-shadow: 0 3px 14px rgba(60, 70, 160, 0.11);
  transition: transform 0.15s;
  border-left: 4px solid transparent;
}
.agenda-card:hover {
  transform: translateY(-1px);
}
.agenda-card.agenda-hoje {
  border-left-color: #ef4444;
  background: rgba(255, 255, 255, 0.98) !important;
}
.agenda-card.agenda-amanha {
  border-left-color: #f59e0b;
}

.agenda-card-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #6366f1;
  border-radius: 12px;
  padding: 8px 14px;
  min-width: 52px;
  flex-shrink: 0;
}
.agenda-card-dia {
  font-family: 'Nunito', sans-serif;
  font-size: 22px;
  font-weight: 900;
  color: white;
  line-height: 1;
}
.agenda-card-mes {
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
}

.agenda-card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.agenda-card-medico {
  font-family: 'Nunito', sans-serif;
  font-size: 16px;
  font-weight: 800;
  color: #1e293b;
}
.agenda-card-hora {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  color: #6366f1;
  font-weight: 700;
}
.agenda-badge-hoje {
  display: inline-block;
  background: #ef4444;
  color: white;
  font-family: 'Nunito', sans-serif;
  font-size: 10px;
  font-weight: 900;
  border-radius: 6px;
  padding: 2px 8px;
  letter-spacing: 0.5px;
  width: fit-content;
}
.agenda-badge-amanha {
  display: inline-block;
  background: #f59e0b;
  color: white;
  font-family: 'Nunito', sans-serif;
  font-size: 10px;
  font-weight: 900;
  border-radius: 6px;
  padding: 2px 8px;
  letter-spacing: 0.5px;
  width: fit-content;
}
.agenda-card-acoes {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

/* Configurações */
.config-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
  min-height: 100vh;
}
.config-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 40px;
}
.config-back-btn {
  color: white !important;
  background: rgba(255, 255, 255, 0.15) !important;
  border-radius: 12px !important;
}
.config-title {
  font-family: 'Nunito', sans-serif;
  font-size: 22px;
  font-weight: 900;
  color: white;
  letter-spacing: 3px;
  margin: 0;
  text-transform: uppercase;
}
.config-card {
  background: rgba(255, 255, 255, 0.82);
  border-radius: 20px;
  padding: 8px 24px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 4px 18px rgba(60, 70, 160, 0.12);
}
.config-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.config-row:last-child {
  border-bottom: none;
}
.config-row-left {
  display: flex;
  align-items: center;
  gap: 14px;
}
.config-icon {
  color: #3730a3;
}
.config-label {
  font-family: 'Nunito', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: 1px;
}

/* Alarmes */
.alarmes-page {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-bottom: 40px;
}
.alarmes-page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 4px;
}
.alarmes-total-badge {
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.25);
  color: white;
  border-radius: 20px;
  padding: 4px 12px;
}
.alarmes-vazio {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0 40px;
  color: rgba(255, 255, 255, 0.75);
  font-family: 'Nunito', sans-serif;
  gap: 8px;
  text-align: center;
}
.alarmes-vazio-titulo {
  font-size: 18px;
  font-weight: 800;
  margin: 0;
}
.alarmes-vazio-sub {
  font-size: 13px;
  opacity: 0.75;
  max-width: 280px;
  margin: 0;
}
.alarme-grupo {
  background: rgba(255, 255, 255, 0.93);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 3px 14px rgba(60, 70, 160, 0.13);
}
.alarme-grupo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #6366f1;
  padding: 12px 18px;
}
.alarme-grupo-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.alarme-grupo-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
.alarme-grupo-nome {
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 900;
  color: white;
}
.alarme-grupo-count {
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.25);
  color: white;
  border-radius: 10px;
  padding: 2px 8px;
}
.alarme-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 18px;
  border-bottom: 1px solid #f1f5f9;
  transition:
    opacity 0.2s,
    background 0.15s;
}
.alarme-item:last-child {
  border-bottom: none;
}
.alarme-item:hover {
  background: #f8faff;
}
.alarme-item.alarme-inativo {
  opacity: 0.45;
}
.al-icone {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.al-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.al-hora {
  font-size: 26px;
  font-weight: 900;
  color: #1e293b;
  line-height: 1;
  font-family: 'Nunito', sans-serif;
}
.al-label {
  font-size: 12px;
  color: #64748b;
  font-family: 'Nunito', sans-serif;
}
.al-dias {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
  margin-top: 4px;
}
.al-dia {
  font-size: 10px;
  font-weight: 700;
  background: #e2e8f0;
  color: #94a3b8;
  border-radius: 5px;
  padding: 1px 4px;
  font-family: 'Nunito', sans-serif;
}
.al-dia-on {
  background: #6366f1;
  color: white;
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
  .agenda-header {
    flex-wrap: wrap;
  }
  .btn-nova-consulta {
    width: 100%;
    justify-content: center;
  }
}
</style>
