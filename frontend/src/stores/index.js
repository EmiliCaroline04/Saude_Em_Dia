// src/stores/index.js
// O Quasar CLI com pinia espera que este arquivo exporte
// uma função que retorna a instância do pinia, OU a instância diretamente.
// O template do Quasar faz: app.use(store) onde store = export default
// Por isso exportamos createPinia() diretamente.

import { createPinia } from 'pinia'

export default createPinia()
