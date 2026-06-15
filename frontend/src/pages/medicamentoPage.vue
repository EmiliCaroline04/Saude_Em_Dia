<template>
  <q-page class="med-page">
    <!-- ── HEADER ── -->
    <div class="med-header">
      <q-btn flat round class="back-btn" @click="$router.push('/home')">
        <q-icon name="arrow_back" size="24px" />
      </q-btn>
      <h2 class="med-titulo">MEDICAMENTOS</h2>
      <q-btn flat round class="notif-btn-h">
        <q-badge color="red" floating>1</q-badge>
        <q-icon name="notifications" size="28px" color="white" />
      </q-btn>
    </div>

    <!-- ── LISTA DE MEDICAMENTOS ── -->
    <div class="med-lista">
      <div v-if="!store.medicamentos.length" class="med-vazio">
        <q-icon name="medication" size="72px" color="rgba(255,255,255,0.35)" />
        <p>Nenhum medicamento cadastrado.</p>
        <p class="med-vazio-sub">Clique em "NOVO MEDICAMENTO" para adicionar.</p>
      </div>

      <div v-for="med in store.medicamentos" :key="med.id" class="med-card">
        <div class="med-card-main">
          <!-- Info esquerda -->
          <div class="med-card-info">
            <span class="med-card-qtd-nome">
              <span class="med-qtd">{{ med.quantidade }}</span>
              <span class="med-nome">{{ med.nome.toUpperCase() }}</span>
            </span>
            <div class="med-card-sub">
              <span v-if="med.tipo" class="tag-info">{{ med.tipo }}</span>
              <span v-if="med.dose" class="tag-info">{{ med.dose }}</span>
              <span v-if="med.medico" class="tag-info medico-tag">Dr(a). {{ med.medico }}</span>
            </div>
            <div class="med-card-datas" v-if="med.dataInicio || med.dataValidade">
              <span v-if="med.dataInicio">Início: {{ med.dataInicio }}</span>
              <span v-if="med.dataValidade"> · Val: {{ med.dataValidade }}</span>
            </div>

            <!-- Alarmes inline -->
            <div v-if="alarmesDo(med.id).length" class="med-alarmes-inline">
              <div
                v-for="al in alarmesDo(med.id)"
                :key="al.id"
                class="al-inline-chip"
                :class="{ 'al-inline-inativo': !al.ativo }"
              >
                <q-icon name="alarm" size="13px" />
                <span class="al-inline-hora">{{ al.hora }}</span>
                <span class="al-inline-label">{{ al.label }}</span>
                <div class="al-inline-dias">
                  <span
                    v-for="dia in diasSemana"
                    :key="dia.sigla"
                    class="al-inline-dia"
                    :class="{ 'al-inline-dia-on': al.dias?.includes(dia.sigla) }"
                    >{{ dia.abrev }}</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Ações direita -->
          <div class="med-card-acoes">
            <div class="pill-wrap">
              <span class="pill-emoji">💊</span>
            </div>

            <!-- Botão alarme → /alarme?id=&nome= -->
            <div class="clock-wrap" @click="irParaAlarme(med)" title="Gerenciar alarmes">
              <q-icon name="alarm" size="26px" color="white" />
              <span v-if="alarmesDo(med.id).length" class="clock-badge">
                {{ alarmesDo(med.id).length }}
              </span>
              <span v-else-if="med.horarioInicio" class="clock-hora">{{ med.horarioInicio }}</span>
            </div>

            <!-- Badge estoque -->
            <div
              class="status-chip"
              :class="Number(med.quantidade) >= 10 ? 'chip-ok' : 'chip-baixo'"
            >
              {{ Number(med.quantidade) >= 10 ? 'OK' : 'BAIXO' }}
            </div>

            <!-- Menu ⋮ -->
            <q-btn flat round dense icon="more_vert" color="grey-6" size="md">
              <q-menu>
                <q-list style="min-width: 150px">
                  <q-item clickable v-close-popup @click="abrirEdicao(med)">
                    <q-item-section avatar><q-icon name="edit" color="indigo-6" /></q-item-section>
                    <q-item-section>Editar</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="irParaAlarme(med)">
                    <q-item-section avatar><q-icon name="alarm" color="orange-7" /></q-item-section>
                    <q-item-section>Alarmes</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable v-close-popup @click="excluir(med.id)">
                    <q-item-section avatar><q-icon name="delete" color="red-6" /></q-item-section>
                    <q-item-section class="text-red-6">Excluir</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>

        <!-- Barra progresso -->
        <div class="med-card-prog">
          <q-linear-progress
            :value="Math.min(Number(med.quantidade) / 30, 1)"
            :color="Number(med.quantidade) >= 10 ? 'green-5' : 'orange-6'"
            track-color="rgba(255,255,255,0.3)"
            rounded
            size="6px"
          />
          <span class="prog-label">{{ med.quantidade }} unidades restantes</span>
        </div>
      </div>
    </div>

    <!-- ── BOTÃO NOVO MEDICAMENTO ── -->
    <div class="med-footer">
      <q-btn unelevated label="NOVO MEDICAMENTO" class="btn-novo" icon="add" @click="abrirNovo" />
    </div>

    <!-- ══════════════════════════════════════
         DIALOG: Cadastro / Edição
    ══════════════════════════════════════ -->
    <q-dialog v-model="dialogAberto" persistent>
      <q-card class="form-card">
        <q-card-section class="form-card-topo">
          <span class="form-card-titulo">
            {{ editandoId ? 'EDITAR MEDICAMENTO' : 'CADASTRO DE MEDICAMENTOS' }}
          </span>
          <q-btn flat round dense icon="close" color="grey-6" @click="fecharDialog" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit.prevent="salvar" greedy class="form-inner">
            <q-input
              v-model="form.nome"
              placeholder="NOME"
              outlined
              dense
              bg-color="white"
              class="campo"
              :rules="[(v) => !!v || 'Obrigatório']"
            />
            <q-select
              v-model="form.tipo"
              :options="tiposOpcoes"
              placeholder="TIPO DE MEDICAMENTO"
              outlined
              dense
              bg-color="white"
              emit-value
              map-options
              class="campo"
            />
            <div class="linha-dupla">
              <q-input
                v-model="form.dose"
                placeholder="DOSE"
                outlined
                dense
                bg-color="white"
                class="campo-meio"
              />
              <q-input
                v-model="form.quantidade"
                placeholder="QUANTIDADE"
                outlined
                dense
                bg-color="white"
                type="number"
                class="campo-meio"
              />
            </div>
            <div class="linha-dupla">
              <q-input
                v-model="form.periodicidade"
                placeholder="PERIODICIDADE"
                outlined
                dense
                bg-color="white"
                class="campo-meio"
              />
              <q-input
                v-model="form.periodoDias"
                placeholder="PERÍODO (DIAS)"
                outlined
                dense
                bg-color="white"
                type="number"
                class="campo-meio"
              />
            </div>
            <div class="linha-dupla">
              <q-input
                v-model="form.dataInicio"
                placeholder="DATA DE INICIO"
                outlined
                dense
                bg-color="white"
                mask="##/##/####"
                class="campo-meio"
              />
              <q-input
                v-model="form.horarioInicio"
                placeholder="HORÁRIO DE INICIO"
                outlined
                dense
                bg-color="white"
                mask="##:##"
                class="campo-meio"
              />
            </div>
            <q-input
              v-model="form.dataValidade"
              placeholder="DATA DE VALIDADE"
              outlined
              dense
              bg-color="white"
              mask="##/##/####"
              class="campo"
            />
            <q-input
              v-model="form.medico"
              placeholder="MÉDICO"
              outlined
              dense
              bg-color="white"
              class="campo"
            />

            <div class="linha-dupla q-mt-sm">
              <q-btn
                type="submit"
                label="SALVAR"
                unelevated
                class="btn-salvar campo-meio"
                :loading="store.loading"
              />
              <q-btn
                label="CANCELAR"
                unelevated
                class="btn-cancelar campo-meio"
                @click="fecharDialog"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default { name: 'MedicamentoPage' }
</script>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useMedicamentoStore } from '../stores/medicamentoStore'

const $q = useQuasar()
const store = useMedicamentoStore()
const router = useRouter()

const diasSemana = [
  { sigla: 'dom', abrev: 'Dom' },
  { sigla: 'seg', abrev: 'Seg' },
  { sigla: 'ter', abrev: 'Ter' },
  { sigla: 'qua', abrev: 'Qua' },
  { sigla: 'qui', abrev: 'Qui' },
  { sigla: 'sex', abrev: 'Sex' },
  { sigla: 'sab', abrev: 'Sáb' },
]

function alarmesDo(medId) {
  try {
    return JSON.parse(localStorage.getItem(`saudeDiaAlarmes_${medId}`) || '[]')
  } catch {
    return []
  }
}

function irParaAlarme(med) {
  router.push({ path: '/alarme', query: { id: med.id, nome: med.nome } })
}

const dialogAberto = ref(false)
const editandoId = ref(null)

const tiposOpcoes = [
  { label: 'Cápsula', value: 'Cápsula' },
  { label: 'Comprimido', value: 'Comprimido' },
  { label: 'Xarope', value: 'Xarope' },
  { label: 'Gotas', value: 'Gotas' },
  { label: 'Injetável', value: 'Injetável' },
  { label: 'Pomada', value: 'Pomada' },
  { label: 'Outro', value: 'Outro' },
]

const form = reactive({
  nome: '',
  tipo: '',
  dose: '',
  quantidade: '',
  periodicidade: '',
  periodoDias: '',
  dataInicio: '',
  horarioInicio: '',
  dataValidade: '',
  medico: '',
})

function limpar() {
  editandoId.value = null
  Object.keys(form).forEach((k) => (form[k] = ''))
}
function abrirNovo() {
  limpar()
  dialogAberto.value = true
}
function fecharDialog() {
  dialogAberto.value = false
  limpar()
}

function abrirEdicao(med) {
  editandoId.value = med.id
  Object.keys(form).forEach((k) => {
    form[k] = med[k] ?? ''
  })
  dialogAberto.value = true
}

async function salvar() {
  if (!form.nome) {
    $q.notify({ type: 'warning', message: 'Informe o nome.', position: 'top' })
    return
  }

  try {
    if (editandoId.value) {
      store.atualizarMedicamento(editandoId.value, { ...form })
      $q.notify({ type: 'positive', message: 'Medicamento atualizado!', position: 'top' })
    } else {
      await store.cadastrarMedicamento({ ...form })
      $q.notify({ type: 'positive', message: 'Medicamento salvo!', position: 'top' })
    }
    fecharDialog()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Não foi possível salvar o medicamento.',
      position: 'top',
    })
  }
}

function excluir(id) {
  const med = store.medicamentos.find((m) => m.id === id)
  $q.dialog({
    title: 'Excluir medicamento',
    message: `Excluir <strong>${med?.nome}</strong>?`,
    html: true,
    ok: { label: 'Excluir', color: 'red-7', unelevated: true },
    cancel: { label: 'Cancelar', flat: true },
  }).onOk(() => {
    store.deletarMedicamento(id)
    $q.notify({ type: 'positive', message: 'Medicamento excluído!', position: 'top' })
  })
}
</script>

<style scoped>
.med-page {
  background: #7b7fc4;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 110px;
  font-family: 'Nunito', sans-serif;
}
.med-header {
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
.med-titulo {
  font-size: 26px;
  font-weight: 900;
  color: white;
  letter-spacing: 3px;
  margin: 0;
  flex: 1;
  text-align: center;
  text-transform: uppercase;
}
.med-lista {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 8px 24px;
  flex: 1;
}
.med-vazio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0 40px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  gap: 8px;
}
.med-vazio-sub {
  font-size: 13px;
  opacity: 0.7;
}

/* Card */
.med-card {
  background: rgba(255, 255, 255, 0.93);
  border-radius: 20px;
  padding: 18px 20px 12px;
  box-shadow: 0 3px 14px rgba(60, 70, 160, 0.13);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.med-card-main {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.med-card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.med-card-qtd-nome {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.med-qtd {
  font-size: 26px;
  font-weight: 900;
  color: #3730a3;
  line-height: 1;
}
.med-nome {
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
}
.med-card-sub {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 2px;
}
.tag-info {
  font-size: 12px;
  background: #eef2ff;
  color: #4338ca;
  border-radius: 6px;
  padding: 2px 8px;
  font-weight: 600;
}
.medico-tag {
  background: #f0fdf4;
  color: #15803d;
}
.med-card-datas {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
}

/* Alarmes inline */
.med-alarmes-inline {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 6px;
}
.al-inline-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #eef2ff;
  border-radius: 10px;
  padding: 5px 10px;
  transition: opacity 0.2s;
  flex-wrap: wrap;
}
.al-inline-chip.al-inline-inativo {
  opacity: 0.45;
}
.al-inline-chip .q-icon {
  color: #6366f1;
  flex-shrink: 0;
}
.al-inline-hora {
  font-size: 13px;
  font-weight: 900;
  color: #3730a3;
  flex-shrink: 0;
}
.al-inline-label {
  font-size: 12px;
  color: #64748b;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.al-inline-dias {
  display: flex;
  gap: 3px;
}
.al-inline-dia {
  font-size: 10px;
  font-weight: 700;
  background: #e2e8f0;
  color: #94a3b8;
  border-radius: 5px;
  padding: 1px 4px;
}
.al-inline-dia-on {
  background: #6366f1 !important;
  color: white !important;
}

/* Ações direita */
.med-card-acoes {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.pill-wrap {
  font-size: 28px;
  line-height: 1;
}

.clock-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #e11d48;
  border-radius: 14px;
  width: 52px;
  height: 52px;
  cursor: pointer;
  gap: 2px;
  transition:
    background 0.2s,
    transform 0.15s;
}
.clock-wrap:hover {
  background: #be123c;
  transform: scale(1.06);
}
.clock-hora {
  font-size: 10px;
  font-weight: 800;
  color: white;
  line-height: 1;
}
.clock-badge {
  font-size: 11px;
  font-weight: 900;
  color: white;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 20px;
  padding: 1px 6px;
  line-height: 1.4;
}

.status-chip {
  font-size: 13px;
  font-weight: 900;
  border-radius: 10px;
  padding: 6px 14px;
  letter-spacing: 0.5px;
}
.chip-ok {
  background: #16a34a;
  color: white;
}
.chip-baixo {
  background: #ea580c;
  color: white;
}

.med-card-prog {
  display: flex;
  align-items: center;
  gap: 10px;
}
.prog-label {
  font-size: 11px;
  color: #64748b;
  white-space: nowrap;
  flex-shrink: 0;
}

.med-footer {
  position: fixed;
  bottom: 24px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 10;
}
.btn-novo {
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

/* Dialog */
.form-card {
  border-radius: 22px;
  width: 100%;
  max-width: 600px;
  max-height: 92vh;
  overflow-y: auto;
}
.form-card-topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0;
}
.form-card-titulo {
  font-size: 16px;
  font-weight: 900;
  color: #3730a3;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.form-inner {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.campo :deep(.q-field__control) {
  border-radius: 10px !important;
}
.campo-meio :deep(.q-field__control) {
  border-radius: 10px !important;
}
.linha-dupla {
  display: flex;
  gap: 10px;
}
.campo-meio {
  flex: 1;
}
.btn-salvar {
  background: #16a34a !important;
  color: white !important;
  border-radius: 10px;
  font-weight: 900;
  font-size: 14px;
  height: 46px;
  letter-spacing: 1px;
}
.btn-cancelar {
  background: #b91c1c !important;
  color: white !important;
  border-radius: 10px;
  font-weight: 900;
  font-size: 14px;
  height: 46px;
  letter-spacing: 1px;
}
</style>
