<template>
  <q-page class="alarme-page">
    <!-- ── HEADER ── -->
    <div class="alarme-header">
      <q-btn flat round class="back-btn" @click="$router.push('/cadastro-medicamento')">
        <q-icon name="arrow_back" size="24px" />
      </q-btn>
      <div class="alarme-header-info">
        <h2 class="alarme-titulo">ALARMES</h2>
        <span class="alarme-med-nome">{{ nomeMedicamento }}</span>
      </div>
      <q-btn flat round class="notif-btn-h">
        <q-badge color="red" floating>{{ alarmes.length || 0 }}</q-badge>
        <q-icon name="notifications" size="28px" color="white" />
      </q-btn>
    </div>

    <!-- ── LISTA DE ALARMES ── -->
    <div class="alarme-lista">
      <div v-if="!alarmes.length" class="alarme-vazio">
        <q-icon name="alarm_off" size="72px" color="rgba(255,255,255,0.35)" />
        <p>Nenhum alarme cadastrado.</p>
        <p class="alarme-vazio-sub">Clique em "NOVO ALARME" para adicionar.</p>
      </div>

      <transition-group name="card-list" tag="div" class="alarmes-group">
        <div
          v-for="(al, i) in alarmes"
          :key="al.id"
          class="alarme-card"
          :class="{ inativo: !al.ativo }"
        >
          <!-- Ícone alarme -->
          <div class="al-icon-wrap" :class="al.ativo ? 'al-ativo' : 'al-inativo'">
            <q-icon name="alarm" size="28px" color="white" />
          </div>

          <!-- Info -->
          <div class="al-info">
            <span class="al-hora">{{ al.hora }}</span>
            <span class="al-label">{{ al.label || 'Tomar medicamento' }}</span>
            <div class="al-dias">
              <span
                v-for="dia in diasSemana"
                :key="dia.sigla"
                class="dia-chip"
                :class="{ 'dia-ativo': al.dias?.includes(dia.sigla) }"
                >{{ dia.abrev }}</span
              >
            </div>
          </div>

          <!-- Toggle -->
          <q-toggle
            v-model="al.ativo"
            color="indigo-6"
            size="44px"
            @update:model-value="salvarStorage"
          />

          <!-- Excluir -->
          <q-btn flat round dense icon="delete" color="red-4" @click="excluirAlarme(i)">
            <q-tooltip>Excluir alarme</q-tooltip>
          </q-btn>
        </div>
      </transition-group>
    </div>

    <!-- ── BOTÃO NOVO ALARME ── -->
    <div class="alarme-footer">
      <q-btn
        unelevated
        label="NOVO ALARME"
        icon="add_alarm"
        class="btn-novo-alarme"
        @click="abrirDialog"
      />
    </div>

    <!-- ══════════════════════════════════════════════════════
         DIALOG: Novo alarme com cálculo automático
    ══════════════════════════════════════════════════════ -->
    <q-dialog v-model="dialogAberto" persistent>
      <q-card class="alarme-form-card">
        <!-- Topo -->
        <div class="alarme-form-topo">
          <span class="alarme-form-titulo">NOVO ALARME</span>
          <q-btn flat round dense icon="close" color="grey-6" @click="fecharDialog" />
        </div>

        <div class="alarme-form-inner">
          <!-- ── Rótulo ── -->
          <input
            v-model="novoAlarme.label"
            placeholder="Rótulo (ex: Tomar em jejum)"
            class="input-rotulo"
          />

          <!-- ── Intervalo ── -->
          <div class="intervalo-section">
            <label class="field-label">Intervalo entre doses:</label>
            <div class="intervalo-chips">
              <button
                v-for="h in intervalosDisponiveis"
                :key="h"
                type="button"
                class="intervalo-chip"
                :class="{ 'intervalo-ativo': novoAlarme.intervaloHoras === h }"
                @click="selecionarIntervalo(h)"
              >
                {{ h }}h
              </button>
            </div>
          </div>

          <!-- ── Primeiro horário ── -->
          <div class="field-hora-wrap">
            <q-icon name="schedule" size="20px" class="hora-icon" />
            <div class="hora-label-wrap">
              <label class="field-label-sm">Primeiro horário</label>
              <input
                v-model="novoAlarme.horaInicio"
                type="time"
                class="hora-input-native"
                @change="calcularHorarios"
              />
            </div>
          </div>

          <!-- ── Preview dos horários gerados ── -->
          <div v-if="horariosGerados.length" class="preview-horarios">
            <label class="field-label">Horários gerados ({{ horariosGerados.length }}x/dia):</label>
            <div class="preview-chips">
              <div v-for="(h, i) in horariosGerados" :key="i" class="preview-chip">
                <q-icon name="alarm" size="13px" />
                <span>{{ h }}</span>
              </div>
            </div>
          </div>

          <!-- ── Dias da semana ── -->
          <div class="dias-selector">
            <label class="field-label">Repetir nos dias:</label>
            <div class="dias-chips">
              <button
                v-for="dia in diasSemana"
                :key="dia.sigla"
                type="button"
                class="dia-chip-sel"
                :class="{ selecionado: novoAlarme.dias.includes(dia.sigla) }"
                @click="toggleDia(dia.sigla)"
              >
                {{ dia.abrev }}
              </button>
            </div>
          </div>

          <!-- ── Botões ── -->
          <div class="alarme-form-btns">
            <button class="btn-al-salvar" @click="salvarAlarmes">SALVAR</button>
            <button class="btn-al-cancelar" @click="fecharDialog">CANCELAR</button>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default { name: 'AlarmePage' }
</script>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue' // 'watch' removido daqui
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

const route = useRoute()
const $q = useQuasar()

const medId = computed(() => route.query.id)
const nomeMedicamento = computed(() => route.query.nome || 'Medicamento')
const chaveStorage = computed(() => `saudeDiaAlarmes_${medId.value}`)

// ── Dias ──────────────────────────────────────────────────────
const diasSemana = [
  { sigla: 'dom', abrev: 'Dom' },
  { sigla: 'seg', abrev: 'Seg' },
  { sigla: 'ter', abrev: 'Ter' },
  { sigla: 'qua', abrev: 'Qua' },
  { sigla: 'qui', abrev: 'Qui' },
  { sigla: 'sex', abrev: 'Sex' },
  { sigla: 'sab', abrev: 'Sáb' },
]

// ── Intervalos disponíveis ──────────────────────────────────
const intervalosDisponiveis = [4, 6, 8, 12, 24]

// ── State ──────────────────────────────────────────────────
const alarmes = ref([])
const dialogAberto = ref(false)

const novoAlarme = reactive({
  label: '',
  horaInicio: '08:00',
  intervaloHoras: 12,
  dias: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'],
})

// ── Horários gerados automaticamente ───────────────────────
const horariosGerados = computed(() => {
  if (!novoAlarme.horaInicio || !novoAlarme.intervaloHoras) return []

  const [hStr, mStr] = novoAlarme.horaInicio.split(':')
  let totalMin = parseInt(hStr) * 60 + parseInt(mStr)
  const qtd = Math.floor(24 / novoAlarme.intervaloHoras)
  const lista = []

  for (let i = 0; i < qtd; i++) {
    const m = totalMin % (24 * 60)
    const hh = String(Math.floor(m / 60)).padStart(2, '0')
    const mm = String(m % 60).padStart(2, '0')
    lista.push(`${hh}:${mm}`)
    totalMin += novoAlarme.intervaloHoras * 60
  }
  return lista
})

// ── Reage a mudança de intervalo ────────────────────────────
function selecionarIntervalo(h) {
  novoAlarme.intervaloHoras = h
}
function calcularHorarios() {
  // reatividade já cuida pelo computed
}

// ── Storage ──────────────────────────────────────────────
onMounted(() => {
  const salvo = localStorage.getItem(chaveStorage.value)
  alarmes.value = salvo ? JSON.parse(salvo) : []
})

function salvarStorage() {
  localStorage.setItem(chaveStorage.value, JSON.stringify(alarmes.value))
}

// ── Dialog ───────────────────────────────────────────────
function abrirDialog() {
  novoAlarme.label = ''
  novoAlarme.horaInicio = '08:00'
  novoAlarme.intervaloHoras = 12
  novoAlarme.dias = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']
  dialogAberto.value = true
}

function fecharDialog() {
  dialogAberto.value = false
}

function toggleDia(sigla) {
  const idx = novoAlarme.dias.indexOf(sigla)
  if (idx === -1) novoAlarme.dias.push(sigla)
  else novoAlarme.dias.splice(idx, 1)
}

// ── Salvar (cria um registro por horário gerado) ──────────
function salvarAlarmes() {
  if (!novoAlarme.horaInicio) {
    $q.notify({ type: 'warning', message: 'Informe o horário inicial.', position: 'top' })
    return
  }
  if (!horariosGerados.value.length) {
    $q.notify({ type: 'warning', message: 'Nenhum horário calculado.', position: 'top' })
    return
  }

  horariosGerados.value.forEach((hora, idx) => {
    alarmes.value.push({
      id: Date.now() + idx,
      hora,
      label: novoAlarme.label || 'Tomar medicamento',
      dias: [...novoAlarme.dias],
      ativo: true,
      intervalo: novoAlarme.intervaloHoras,
    })
  })

  // Ordenar por hora
  alarmes.value.sort((a, b) => a.hora.localeCompare(b.hora))

  salvarStorage()
  fecharDialog()
  $q.notify({
    type: 'positive',
    message: `${horariosGerados.value.length} alarme(s) criado(s)!`,
    position: 'top',
    icon: 'check_circle',
  })
}

// ── Excluir ──────────────────────────────────────────────
function excluirAlarme(i) {
  $q.dialog({
    title: 'Excluir alarme',
    message: `Excluir o alarme das <strong>${alarmes.value[i].hora}</strong>?`,
    html: true,
    ok: { label: 'Excluir', color: 'red-7', unelevated: true },
    cancel: { label: 'Cancelar', flat: true },
  }).onOk(() => {
    alarmes.value.splice(i, 1)
    salvarStorage()
    $q.notify({ type: 'positive', message: 'Alarme excluído!', position: 'top' })
  })
}
</script>

<style scoped>
/* ══ Página ══ */
.alarme-page {
  background: #7b7fc4;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 110px;
  font-family: 'Nunito', sans-serif;
}

/* ══ Header ══ */
.alarme-header {
  display: flex;
  align-items: center;
  padding: 20px 24px 14px;
  gap: 14px;
}
.back-btn {
  color: white !important;
  background: rgba(255, 255, 255, 0.2) !important;
  border-radius: 50% !important;
}
.notif-btn-h {
  color: white !important;
  margin-left: auto;
}
.alarme-header-info {
  flex: 1;
  text-align: center;
}
.alarme-titulo {
  font-size: 26px;
  font-weight: 900;
  color: white;
  letter-spacing: 3px;
  margin: 0;
  text-transform: uppercase;
}
.alarme-med-nome {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 600;
}

/* ══ Lista ══ */
.alarme-lista {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 8px 24px;
  flex: 1;
}
.alarmes-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.alarme-vazio {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 0 40px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  gap: 8px;
  text-align: center;
}
.alarme-vazio-sub {
  font-size: 13px;
  opacity: 0.7;
}

/* ══ Card ══ */
.alarme-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255, 255, 255, 0.93);
  border-radius: 20px;
  padding: 14px 18px;
  box-shadow: 0 3px 14px rgba(60, 70, 160, 0.12);
  transition:
    opacity 0.25s,
    transform 0.2s;
}
.alarme-card:hover {
  transform: translateY(-1px);
}
.alarme-card.inativo {
  opacity: 0.5;
}

.al-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.al-ativo {
  background: #6366f1;
}
.al-inativo {
  background: #94a3b8;
}

.al-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.al-hora {
  font-size: 28px;
  font-weight: 900;
  color: #1e293b;
  line-height: 1;
}
.al-label {
  font-size: 13px;
  color: #64748b;
}
.al-dias {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 4px;
}
.dia-chip {
  font-size: 11px;
  font-weight: 700;
  background: #e2e8f0;
  color: #64748b;
  border-radius: 6px;
  padding: 2px 6px;
}
.dia-chip.dia-ativo {
  background: #6366f1;
  color: white;
}

/* ══ Footer ══ */
.alarme-footer {
  position: fixed;
  bottom: 24px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 10;
}
.btn-novo-alarme {
  background: rgba(255, 255, 255, 0.95) !important;
  color: #3730a3 !important;
  border-radius: 30px;
  font-weight: 900;
  font-size: 15px;
  padding: 12px 40px;
  letter-spacing: 1px;
  box-shadow: 0 4px 20px rgba(60, 70, 160, 0.22);
  border: 2px solid rgba(99, 102, 241, 0.25);
}

/* ══ Dialog ══ */
.alarme-form-card {
  border-radius: 24px !important;
  width: 100%;
  max-width: 460px;
  overflow: hidden;
}
.alarme-form-topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 0;
}
.alarme-form-titulo {
  font-size: 17px;
  font-weight: 900;
  color: #3730a3;
  letter-spacing: 1.5px;
}
.alarme-form-inner {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 20px 20px;
}

/* Rótulo */
.input-rotulo {
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 16px;
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.input-rotulo:focus {
  border-color: #6366f1;
}
.input-rotulo::placeholder {
  color: #94a3b8;
}

/* Labels */
.field-label {
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  letter-spacing: 0.3px;
  margin-bottom: 6px;
  display: block;
  text-transform: uppercase;
}
.field-label-sm {
  font-size: 11px;
  font-weight: 700;
  color: #6366f1;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

/* Intervalo chips */
.intervalo-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.intervalo-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.intervalo-chip {
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 800;
  padding: 8px 16px;
  border-radius: 20px;
  border: 2px solid #e2e8f0;
  background: white;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s;
}
.intervalo-chip:hover {
  border-color: #6366f1;
  color: #6366f1;
}
.intervalo-ativo {
  background: #6366f1 !important;
  color: white !important;
  border-color: #6366f1 !important;
}

/* Horário */
.field-hora-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #f1f5f9;
  border-radius: 14px;
  padding: 12px 16px;
}
.hora-icon {
  color: #6366f1;
  flex-shrink: 0;
}
.hora-label-wrap {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}
.hora-input-native {
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Nunito', sans-serif;
  font-size: 26px;
  font-weight: 900;
  color: #1e293b;
  width: 100%;
  cursor: pointer;
}

/* Preview horários */
.preview-horarios {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.preview-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.preview-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #eef2ff;
  color: #4338ca;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 800;
  border: 1.5px solid #c7d2fe;
  animation: popIn 0.2s ease;
}
.preview-chip .q-icon {
  color: #6366f1;
}
@keyframes popIn {
  from {
    transform: scale(0.85);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Dias */
.dias-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dias-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.dia-chip-sel {
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  font-weight: 800;
  background: #e2e8f0;
  color: #64748b;
  border-radius: 8px;
  padding: 7px 11px;
  border: none;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s,
    transform 0.1s;
  user-select: none;
}
.dia-chip-sel.selecionado {
  background: #6366f1;
  color: white;
}
.dia-chip-sel:hover {
  opacity: 0.85;
}
.dia-chip-sel:active {
  transform: scale(0.93);
}

/* Botões form */
.alarme-form-btns {
  display: flex;
  gap: 10px;
}
.btn-al-salvar,
.btn-al-cancelar {
  flex: 1;
  border: none;
  border-radius: 14px;
  padding: 14px 0;
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 1px;
  cursor: pointer;
  transition:
    filter 0.15s,
    transform 0.1s;
}
.btn-al-salvar {
  background: #22c55e;
  color: white;
}
.btn-al-cancelar {
  background: #ef4444;
  color: white;
}
.btn-al-salvar:hover {
  filter: brightness(1.08);
}
.btn-al-cancelar:hover {
  filter: brightness(1.08);
}
.btn-al-salvar:active,
.btn-al-cancelar:active {
  transform: scale(0.97);
}

/* ══ Animação lista ══ */
.card-list-enter-active,
.card-list-leave-active {
  transition: all 0.3s ease;
}
.card-list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.card-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
