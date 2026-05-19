import type { App, Plugin } from 'vue'
import VueJsonCompare from './components/VueJsonCompare.vue'

export { VueJsonCompare }
export type { JsonValue, VueJsonCompareTheme } from './types'

/**
 * Vue plugin install function. Registers the component globally under two
 * names so both PascalCase and the package name work in templates:
 *   - `<VueJsonCompare>` / `<vue-json-compare>`
 *   - `<vue3-compare-json>`
 *
 * @example
 *   import { createApp } from 'vue'
 *   import VueJsonComparePlugin from 'vue3-compare-json'
 *   import 'vue3-compare-json/style.css'
 *
 *   createApp(App).use(VueJsonComparePlugin).mount('#app')
 */
const plugin: Plugin = {
  install(app: App) {
    app.component('VueJsonCompare', VueJsonCompare)
    app.component('vue3-compare-json', VueJsonCompare)
  },
}

export default plugin
