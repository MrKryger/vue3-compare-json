import { Plugin } from 'vue';
import { default as VueJsonCompare } from './components/VueJsonCompare.vue';

export { VueJsonCompare };
export type { JsonValue, VueJsonCompareTheme } from './types';
/**
 * Vue plugin install function. Registers `<vue3-compare-json>` globally.
 *
 * @example
 *   import { createApp } from 'vue'
 *   import VueJsonComparePlugin from 'vue3-compare-json'
 *   import 'vue3-compare-json/style.css'
 *
 *   createApp(App).use(VueJsonComparePlugin).mount('#app')
 */
declare const plugin: Plugin;
export default plugin;
