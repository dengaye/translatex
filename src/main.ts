import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// Import Tailwind CSS
import './assets/tailwind.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 初始化设置store，从缓存加载数据
import { useSettingsStore } from './stores/settings'
const settingsStore = useSettingsStore()
settingsStore.init()

app.mount('#app')
