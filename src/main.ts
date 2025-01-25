import { createApp } from 'vue'
import App from './App.vue'
import {storage} from './store'
import './assets/style/null.css'
import './assets/style/otherclasses.css'
import './assets/style/elements.css'
import './assets/style/const.css'
import './assets/style/fonts.css'
import './assets/style/quazar-elements.css'
import 'material-icons/iconfont/material-icons.css';
import 'handsontable/dist/handsontable.full.css'

import './assets/style/sidebar.scss'

import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'
import i18n from './i18n';
/* import langRu from 'quasar/lang/ru'
 */
/* import workerPlugin from "./Workers/workerPlugin"; */


createApp(App)
.use(Quasar, quasarUserOptions)
.use(i18n())
.use(storage)
/* .use(workerPlugin) */
.mount('#app')