import type { App, Plugin } from 'vue'
import VueJsonCompare from './components/VueJsonCompare.vue'

export { VueJsonCompare }
export type { JsonValue, VueJsonCompareTheme } from './types'

/**
 * Vue plugin install function. Registers `<vue-json-compare>` globally.
 *
 * @example
 *   import { createApp } from 'vue'
 *   import VueJsonComparePlugin from 'vue-json-compare'
 *   import 'vue-json-compare/style.css'
 *
 *   createApp(App).use(VueJsonComparePlugin).mount('#app')
 */
const plugin: Plugin = {
  install(app: App) {
    app.component('VueJsonCompare', VueJsonCompare)
  },
}

export default plugin
