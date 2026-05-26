<template>
  <q-page class="emerg-page">
    <!-- Header -->
    <div class="emerg-header">
      <q-btn flat round class="back-btn" @click="$router.push('/home')">
        <q-icon name="arrow_back" size="22px" />
      </q-btn>
      <h2 class="emerg-titulo">EMERGÊNCIA</h2>
    </div>

    <div class="emerg-body">
      <div class="emerg-card">
        <!-- Contatos fixos -->
        <div class="contato-fixo" @click="ligar('193')">
          <span class="cf-icon">🧑‍🚒</span>
          <span class="cf-nome">Bombeiros</span>
          <span class="cf-num">193</span>
          <q-btn flat round dense icon="call" color="green-7" @click.stop="ligar('193')" />
        </div>
        <div class="contato-fixo" @click="ligar('190')">
          <span class="cf-icon">👮</span>
          <span class="cf-nome">Polícia</span>
          <span class="cf-num">190</span>
          <q-btn flat round dense icon="call" color="green-7" @click.stop="ligar('190')" />
        </div>

        <div class="divider" />

        <!-- Formulário -->
        <p class="form-label">{{ contatoIdx !== null ? 'Editar contato' : 'Novo contato' }}</p>

        <!-- Preview da foto -->
        <div class="foto-area" @click="triggerFoto">
          <q-avatar size="64px" class="foto-avatar">
            <img v-if="fotoPreview" :src="fotoPreview" />
            <q-icon v-else name="add_a_photo" size="28px" color="white" />
          </q-avatar>
          <span class="foto-label">{{ fotoPreview ? 'Trocar foto' : 'Adicionar foto' }}</span>
        </div>
        <input
          ref="fotoInput"
          type="file"
          accept="image/*"
          style="display: none"
          @change="onFotoChange"
        />

        <q-input
          v-model="form.nome"
          placeholder="NOME"
          outlined
          dense
          bg-color="white"
          class="q-mb-sm campo"
        />
        <q-input
          v-model="form.numero"
          placeholder="CONTATO (DDD + número)"
          outlined
          dense
          bg-color="white"
          mask="(##) #####-####"
          class="q-mb-md campo"
        />

        <!-- Lista de contatos cadastrados -->
        <div v-if="contatos.length" class="lista-contatos">
          <p class="lista-titulo">Contatos Cadastrados</p>
          <div
            v-for="(c, i) in contatos"
            :key="i"
            class="contato-item"
            :class="{ ativo: contatoIdx === i }"
            @click="selecionar(i)"
          >
            <q-avatar size="40px" class="ci-avatar">
              <img v-if="c.foto" :src="c.foto" />
              <q-icon v-else name="person" size="22px" color="white" />
            </q-avatar>
            <div class="ci-info">
              <span class="ci-nome">{{ c.nome }}</span>
              <span class="ci-num">{{ c.numero }}</span>
            </div>
            <q-btn flat round dense icon="call" color="green-7" @click.stop="ligar(c.numero)">
              <q-tooltip>Ligar para {{ c.nome }}</q-tooltip>
            </q-btn>
          </div>
        </div>

        <!-- Botões de ação -->
        <div class="acoes">
          <q-btn unelevated label="Editar" class="btn-editar" @click="editar" />
          <q-btn unelevated label="Salvar" class="btn-salvar" @click="salvar" />
          <q-btn unelevated label="Excluir" class="btn-excluir" @click="excluir" />
        </div>

        <q-btn
          flat
          unelevated
          label="+ Novo contato"
          class="btn-novo full-width q-mt-sm"
          @click="limpar"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
export default { name: 'EmergenciaPage' }
</script>

<script setup>
import { ref, reactive } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const contatos = ref(JSON.parse(localStorage.getItem('saudeDiaEmerg') || '[]'))
const form = reactive({ nome: '', numero: '' })
const contatoIdx = ref(null)
const fotoPreview = ref(null)
const fotoInput = ref(null)

function salvarStorage() {
  localStorage.setItem('saudeDiaEmerg', JSON.stringify(contatos.value))
}

function selecionar(i) {
  contatoIdx.value = i
  form.nome = contatos.value[i].nome
  form.numero = contatos.value[i].numero
  fotoPreview.value = contatos.value[i].foto || null
}

function limpar() {
  contatoIdx.value = null
  form.nome = ''
  form.numero = ''
  fotoPreview.value = null
}

function salvar() {
  if (!form.nome || !form.numero) {
    $q.notify({ type: 'warning', message: 'Preencha nome e contato!', position: 'top' })
    return
  }
  const item = { nome: form.nome, numero: form.numero, foto: fotoPreview.value }
  if (contatoIdx.value !== null) {
    contatos.value[contatoIdx.value] = item
  } else {
    contatos.value.push(item)
  }
  salvarStorage()
  limpar()
  $q.notify({ type: 'positive', message: 'Contato salvo!', position: 'top' })
}

function editar() {
  if (contatoIdx.value === null) {
    $q.notify({ type: 'warning', message: 'Selecione um contato para editar.', position: 'top' })
    return
  }
  $q.notify({
    message: 'Edite os campos e clique em Salvar.',
    icon: 'edit',
    color: 'indigo-7',
    position: 'top',
    timeout: 1500,
  })
}

function excluir() {
  if (contatoIdx.value === null) {
    $q.notify({ type: 'warning', message: 'Selecione um contato para excluir.', position: 'top' })
    return
  }
  $q.dialog({
    title: 'Excluir contato',
    message: `Excluir <strong>${contatos.value[contatoIdx.value].nome}</strong>?`,
    html: true,
    ok: { label: 'Excluir', color: 'red-7', unelevated: true },
    cancel: { label: 'Cancelar', flat: true },
  }).onOk(() => {
    contatos.value.splice(contatoIdx.value, 1)
    salvarStorage()
    limpar()
    $q.notify({ type: 'positive', message: 'Contato excluído!', position: 'top' })
  })
}

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

function triggerFoto() {
  fotoInput.value?.click()
}
function onFotoChange(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    fotoPreview.value = ev.target.result
  }
  reader.readAsDataURL(file)
}
</script>

<style scoped>
.emerg-page {
  background: #7b7fc4;
  min-height: 100vh;
  padding-bottom: 32px;
}

.emerg-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px 8px;
}
.back-btn {
  color: white !important;
  background: rgba(255, 255, 255, 0.15) !important;
  border-radius: 12px !important;
}
.emerg-titulo {
  font-family: 'Nunito', sans-serif;
  font-size: 22px;
  font-weight: 900;
  color: white;
  letter-spacing: 3px;
  margin: 0;
  flex: 1;
  text-align: center;
}

.emerg-body {
  display: flex;
  justify-content: center;
  padding: 0 16px;
}
.emerg-card {
  background: rgba(255, 255, 255, 0.88);
  border-radius: 22px;
  padding: 24px 28px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 4px 24px rgba(60, 70, 160, 0.15);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Contatos fixos */
.contato-fixo {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fef2f2;
  border-radius: 12px;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.2s;
}
.contato-fixo:hover {
  background: #fee2e2;
}
.cf-icon {
  font-size: 26px;
}
.cf-nome {
  flex: 1;
  font-family: 'Nunito', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}
.cf-num {
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 800;
  color: #dc2626;
  background: #fecaca;
  border-radius: 8px;
  padding: 2px 8px;
}

.divider {
  height: 1px;
  background: #e2e8f0;
  margin: 4px 0;
}

.form-label {
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 800;
  color: #3730a3;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
}

/* Foto */
.foto-area {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}
.foto-avatar {
  background: #6366f1;
}
.foto-label {
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  color: #6366f1;
  font-weight: 600;
}

.campo :deep(.q-field__control) {
  border-radius: 10px !important;
}

/* Lista */
.lista-titulo {
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  font-weight: 800;
  color: #3730a3;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 6px;
}
.contato-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #eef2ff;
  border-radius: 12px;
  padding: 10px 12px;
  margin-bottom: 6px;
  cursor: pointer;
  transition: background 0.2s;
  border: 2px solid transparent;
}
.contato-item:hover {
  background: #e0e7ff;
}
.contato-item.ativo {
  border-color: #6366f1;
  background: #e0e7ff;
}
.ci-avatar {
  background: #6366f1;
}
.ci-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.ci-nome {
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
}
.ci-num {
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  color: #64748b;
}

/* Botões */
.acoes {
  display: flex;
  gap: 10px;
}
.btn-editar {
  flex: 1;
  background: #0d9488 !important;
  color: white !important;
  border-radius: 10px;
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
}
.btn-salvar {
  flex: 1;
  background: #16a34a !important;
  color: white !important;
  border-radius: 10px;
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
}
.btn-excluir {
  flex: 1;
  background: #b91c1c !important;
  color: white !important;
  border-radius: 10px;
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
}
.btn-novo {
  background: rgba(99, 102, 241, 0.1) !important;
  color: #6366f1 !important;
  border-radius: 10px;
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  border: 1.5px solid #6366f1;
}
</style>
