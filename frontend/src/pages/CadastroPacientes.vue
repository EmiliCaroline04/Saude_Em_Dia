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

    <q-btn flat round class="nav-btn" @click="router.push('/home')">
        <q-icon name="dashboard" size="22px" />
        <q-tooltip anchor="center right" self="center left" :offset="[8, 0]">Dashboard</q-tooltip>
    </q-btn>

    <q-btn flat round class="nav-btn" @click="router.push('/cadastro-paciente')">
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

<q-page-container>
    <q-page class="dash-page">
    <div class="dash-header">
        <div class="header-left">
        <span class="header-mes">CADASTRO DE PACIENTE</span>
        </div>
        <div class="header-right">
        <span class="header-boas-vindas">Bem-vindo (a) {{ nomeUsuario }}</span>
        <q-avatar size="44px" class="header-avatar">
            <q-icon name="person" size="26px" color="white" />
        </q-avatar>
        </div>
    </div>

    <div class="cadastro-container">
        <div class="card-cadastro">
        <div class="voltar-area">
            <q-btn
            round
            dense
            icon="arrow_back"
            @click="router.push('/home')"
            class="btn-voltar"
            />
        </div>
        <h3 class="card-title">NOVO PACIENTE</h3>
        <q-form @submit.prevent="cadastrarPaciente" class="form-cadastro">
            <div class="form-row">
            <q-input
                v-model="paciente.nome"
                label="Nome completo"
                outlined
                dense
                class="form-input"
                :rules="[(val) => !!val || 'Nome é obrigatório']"
            />
            <q-input
                v-model="paciente.cpf"
                label="CPF"
                outlined
                dense
                class="form-input"
                mask="###.###.###-##"
                :rules="[(val) => !!val || 'CPF é obrigatório']"
            />
            </div>
            <div class="form-row">
            <q-input
                v-model="paciente.email"
                label="Email"
                type="email"
                outlined
                dense
                class="form-input"
                :rules="[(val) => !!val || 'Email é obrigatório']"
            />
            <q-input
                v-model="paciente.telefone"
                label="Telefone"
                outlined
                dense
                class="form-input"
                mask="(##) #####-####"
            />
            </div>
            <div class="form-row">
            <q-input
                v-model="paciente.dataNascimento"
                label="Data de Nascimento"
                type="date"
                outlined
                dense
                class="form-input"
            />
            <q-input
                v-model="paciente.endereco"
                label="Endereço"
                outlined
                dense
                class="form-input"
            />
            </div>
            <div class="form-row">
            <q-input
                v-model="paciente.tipoSanguineo"
                label="Tipo Sanguíneo"
                outlined
                dense
                class="form-input-small"
            />
            <q-input
                v-model="paciente.alergias"
                label="Alergias"
                outlined
                dense
                class="form-input"
            />
            </div>
            <div class="form-actions">
            <q-btn flat label="Cancelar" class="btn-cancelar" @click="router.push('/home')" />
            <q-btn
                :label="pacienteEditandoId ? 'Atualizar' : 'Salvar'"
                class="btn-salvar"
                type="submit"
            />
            </div>
        </q-form>
        <div class="lista-pacientes">
            <div class="lista-header">
            <h4>Pacientes cadastrados</h4>

            <q-badge color="indigo">
                {{ pacientesCadastrados.length }}
            </q-badge>
            </div>

            <q-table
            flat
            bordered
            :rows="pacientesCadastrados"
            row-key="id"
            :pagination="{ rowsPerPage: 5 }"
            :columns="[
                {
                name: 'nome',
                label: 'Nome',
                field: 'nome',
                align: 'left',
                },
                {
                name: 'cpf',
                label: 'CPF',
                field: 'cpf',
                },
                {
                name: 'telefone',
                label: 'Telefone',
                field: 'telefone',
                },
                {
                name: 'acoes',
                label: 'Ações',
                field: 'acoes',
                },
            ]"
            >
            <template v-slot:body-cell-acoes="props">
                <q-td>
                <div class="acoes-tabela">
                    <q-btn
                    flat
                    round
                    icon="edit"
                    color="indigo"
                    size="sm"
                    @click="editarPaciente(props.row)"
                    >
                    <q-tooltip>Editar</q-tooltip>
                    </q-btn>

                    <q-btn
                    flat
                    round
                    dense
                    icon="delete"
                    color="negative"
                    @click.stop="excluirPaciente(props.row.id)"
                    >
                    <q-tooltip>Excluir</q-tooltip>
                    </q-btn>
                </div>
                </q-td>
            </template>
            <template v-slot:no-data>
                <div class="full-width text-center q-pa-md text-grey">
                Nenhum paciente cadastrado
                </div>
            </template>
            </q-table>
        </div>
        </div>
    </div>
    </q-page>
</q-page-container>
</q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { getUsuarioLocal, logoutMedico } from '../services/authService'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const router = useRouter()
const $q = useQuasar()
const usuario = getUsuarioLocal()
const nomeUsuario = computed(() => usuario?.nome ?? 'Usuário')

const drawer = ref(true)
const secao = ref('cadastro-paciente')

const pacientesCadastrados = ref([])
const pacienteEditandoId = ref(null)

const paciente = ref({
nome: '',
cpf: '',
email: '',
telefone: '',
dataNascimento: '',
endereco: '',
tipoSanguineo: '',
alergias: '',
})

function limparFormulario() {
paciente.value = {
nome: '',
cpf: '',
email: '',
telefone: '',
dataNascimento: '',
endereco: '',
tipoSanguineo: '',
alergias: '',
}
}

function editarPaciente(row) {
paciente.value = { ...row }

pacienteEditandoId.value = row.id

window.scrollTo({
top: 0,
behavior: 'smooth',
})
}

function excluirPaciente(id) {
$q.dialog({
title: 'Excluir paciente',
message: 'Deseja realmente excluir este paciente?',
ok: {
    label: 'Excluir',
    color: 'negative',
    unelevated: true,
},
cancel: {
    label: 'Cancelar',
    flat: true,
},
}).onOk(() => {
const pacientes = JSON.parse(localStorage.getItem('saudeDiaPacientes') || '[]')
const atualizados = pacientes.filter((item) => String(item.id) !== String(id))

localStorage.setItem('saudeDiaPacientes', JSON.stringify(atualizados))

carregarPacientes()

if (String(pacienteEditandoId.value) === String(id)) {
    limparFormulario()
    pacienteEditandoId.value = null
}

$q.notify({
    type: 'positive',
    message: 'Paciente excluído com sucesso!',
    position: 'top',
})
})
}

async function carregarPacientes() {
  try {
    const resposta = await fetch(`${API_BASE_URL}/pacientes`)
    const dados = await resposta.json()
    if (Array.isArray(dados)) {
      pacientesCadastrados.value = dados
      localStorage.setItem('saudeDiaPacientes', JSON.stringify(dados))
      return
    }
  } catch {
    // fallback para storage local
  }

  pacientesCadastrados.value = JSON.parse(localStorage.getItem('saudeDiaPacientes') || '[]')
}

async function cadastrarPaciente() {
const obrigatorios = paciente.value.nome && paciente.value.cpf && paciente.value.email

if (!obrigatorios) {
$q.notify({
    type: 'warning',
    message: 'Preencha Nome, CPF e Email.',
    position: 'top',
})

return
}

try {
  const payload = {
    nome: paciente.value.nome,
    cpf: paciente.value.cpf,
    endereco: paciente.value.endereco,
    telefone: paciente.value.telefone,
    sexo: paciente.value.tipoSanguineo || 'Não informado',
    data_nascimento: paciente.value.dataNascimento,
  }

  const resposta = await fetch(`${API_BASE_URL}/pacientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const dados = await resposta.json()
  if (!resposta.ok) {
    throw new Error(dados.erro || 'Erro ao salvar paciente')
  }

  $q.notify({
    type: 'positive',
    message: 'Paciente salvo com sucesso!',
    position: 'top',
  })

  await carregarPacientes()
  limparFormulario()
  pacienteEditandoId.value = null
} catch (erro) {
  const mensagem = erro?.message || 'Erro ao salvar paciente.'

  $q.notify({
    type: 'negative',
    message: mensagem,
    position: 'top',
  })

  console.error('[CadastroPacientes] Falha ao salvar paciente:', mensagem)
}
}

function handleLogout() {
$q.dialog({
title: 'Sair',
message: 'Deseja encerrar a sessão?',
ok: {
    label: 'Sair',
    color: 'indigo-7',
    unelevated: true,
},
cancel: {
    label: 'Cancelar',
    flat: true,
},
}).onOk(() => {
logoutMedico()
router.push('/login')
})
}

onMounted(() => {
carregarPacientes()
})
</script>

<script>
export default { name: 'CadastroPaciente' }
</script>

<style scoped>
.dash-layout {
background: #7b7fc4;
min-height: 100vh;
}

.q-layout__section--marginal,
.q-layout__section--main,
.q-page-container,
.q-page,
.cadastro-container {
background: #7b7fc4 !important;
}

.sidebar {
background: #6b6cb3;
}

.sidebar-inner {
display: flex;
flex-direction: column;
align-items: center;
padding: 16px 0;
gap: 4px;
}

.nav-btn {
color: white;
opacity: 0.7;
transition: all 0.2s;
}

.nav-btn:hover,
.nav-btn.active {
opacity: 1;
background: rgba(255, 255, 255, 0.15);
}

.nav-divider {
width: 40px;
height: 1px;
background: rgba(255, 255, 255, 0.2);
margin: 8px 0;
}

.dash-page {
padding: 0;
background: #7b7fc4 !important;
}

.dash-header {
display: flex;
justify-content: space-between;
align-items: center;
padding: 16px 24px;
background: rgba(0, 0, 0, 0.1);
}

.header-mes {
color: white;
font-size: 1.1rem;
font-weight: 600;
letter-spacing: 1px;
}

.header-right {
display: flex;
align-items: center;
gap: 16px;
}

.header-boas-vindas {
color: white;
font-size: 0.95rem;
}

.header-avatar {
background: rgba(255, 255, 255, 0.2);
}

.cadastro-container {
padding: 24px;
display: flex;
justify-content: center;
align-items: center;
min-height: 80vh;
background: #7b7fc4 !important;
}

.card-cadastro {
background: white;
border-radius: 12px;
padding: 24px;
width: 100%;
max-width: 700px;
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
position: relative;
}

.voltar-area {
position: absolute;
top: 16px;
left: 16px;
z-index: 10;
}

.btn-voltar {
background: white;
color: #7b7fc4;
border: 1px solid #dcdcdc;
box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.card-title {
color: #7b7fc4;
font-size: 1.2rem;
font-weight: 600;
margin: 0 0 20px 0;
text-align: center;
}

.form-cadastro {
display: flex;
flex-direction: column;
gap: 16px;
}

.form-row {
display: flex;
gap: 16px;
}

.form-input {
flex: 1;
}

.form-input-small {
width: 150px;
}

.form-actions {
display: flex;
justify-content: flex-end;
gap: 12px;
margin-top: 8px;
}

.btn-salvar {
background: #7b7fc4;
color: white;
}

.btn-cancelar {
color: #666;
}

.btn-salvar:hover {
background: #6b6cb3;
}

.lista-pacientes {
margin-top: 32px;
}

.lista-header {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 16px;
}

.lista-header h4 {
margin: 0;
color: #7b7fc4;
font-size: 1rem;
}

:deep(.q-table) {
border-radius: 10px;
overflow: hidden;
}

:deep(.q-table thead tr) {
background: #f5f5ff;
}

:deep(.q-table tbody tr:hover) {
background: #f7f7ff;
}
.acoes-tabela {
display: flex;
align-items: center;
gap: 4px;
}
</style>

carregarPacientes()
