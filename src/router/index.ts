import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import SettingsLayout from '../views/settings/SettingsLayout.vue'
import ApiKeysSettings from '../views/settings/ApiKeysSettings.vue'
import GeneralSettings from '../views/settings/GeneralSettings.vue'
import AboutSettings from '../views/settings/AboutSettings.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsLayout,
      redirect: '/settings/api-keys',
      children: [
        {
          path: 'api-keys',
          name: 'settings-api-keys',
          component: ApiKeysSettings
        },
        {
          path: 'general',
          name: 'settings-general',
          component: GeneralSettings
        },
        {
          path: 'about',
          name: 'settings-about',
          component: AboutSettings
        }
      ]
    }
  ]
})

export default router
