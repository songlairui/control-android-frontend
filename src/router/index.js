import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Screen from '@/components/Screen'
import AdbCommand from '@/components/AdbCommand'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: HelloWorld
    },
    {
      path: '/screen',
      name: 'screen',
      component: Screen
    },
    {
      path: '/adb-command',
      name: 'adb-command',
      component: AdbCommand
    }
  ]
})
