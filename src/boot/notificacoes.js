// src/boot/notificacoes.js
import { Notify } from 'quasar'

function checarEstoqueBaixo() {
  try {
    const meds = JSON.parse(localStorage.getItem('saudeDiaMedsCompleto') || '[]')
    meds.forEach((med) => {
      const qtd = Number(med.quantidade)
      if (qtd <= 2) {
        Notify.create({
          type: 'warning',
          position: 'top',
          timeout: 6000,
          icon: 'medication',
          message: `⚠️ Estoque crítico: <strong>${med.nome}</strong>`,
          caption: `Apenas ${qtd} unidade(s) restante(s). Providencie a reposição!`,
          html: true,
          actions: [{ label: 'OK', color: 'white' }],
        })
      }
    })
  } catch {
    // silencioso
  }
}

function checarConsultas() {
  try {
    const consultas = JSON.parse(localStorage.getItem('saudeDiaConsultas') || '[]')
    const hoje = new Date()

    consultas.forEach((c) => {
      if (!c.data) return

      // Formato esperado: "DD/MM" ou "DD/MM/AAAA"
      const partes = c.data.split('/')
      if (partes.length < 2) return

      const dia = parseInt(partes[0])
      const mes = parseInt(partes[1]) - 1
      const ano = partes[2] ? parseInt(partes[2]) : hoje.getFullYear()

      const dataConsulta = new Date(ano, mes, dia)
      dataConsulta.setHours(0, 0, 0, 0)

      const hojeZero = new Date(hoje)
      hojeZero.setHours(0, 0, 0, 0)

      const diffMs = dataConsulta - hojeZero
      const diffDias = Math.round(diffMs / (1000 * 60 * 60 * 24))

      if (diffDias === 0) {
        Notify.create({
          type: 'negative',
          position: 'top',
          timeout: 8000,
          icon: 'event',
          message: `📅 Consulta HOJE!`,
          caption: `${c.hora}H com <strong>${c.medico}</strong>`,
          html: true,
          actions: [{ label: 'OK', color: 'white' }],
        })
      } else if (diffDias === 1) {
        Notify.create({
          type: 'info',
          position: 'top',
          timeout: 8000,
          icon: 'event_upcoming',
          message: `🗓️ Consulta amanhã`,
          caption: `${c.hora}H com <strong>${c.medico}</strong>`,
          html: true,
          actions: [{ label: 'OK', color: 'white' }],
        })
      }
    })
  } catch {
    // silencioso
  }
}

export default () => {
  // Roda ao iniciar o app
  checarEstoqueBaixo()
  checarConsultas()

  // Fica verificando a cada 1 hora enquanto o app estiver aberto
  setInterval(
    () => {
      checarEstoqueBaixo()
      checarConsultas()
    },
    60 * 60 * 1000,
  )
}
