import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Element from 'element-ui'
import Chart from 'vue2-frappe'

import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Chart)
Vue.use(Element)

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
