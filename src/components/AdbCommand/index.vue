<template lang="pug">
  div
    div.box-card(v-for='(device,idx) in devices' :key='idx')
      el-row(type='flex' style={flexFlow:'column',minWidth:'220px',paddingLeft:'.5em'})
        el-col(style={flex:'1 1 auto',width:'auto'})
          pre
            | 设备信息：
            |   {{ device.name }}
            |   {{ device.id }}
            |   {{ device.abi.primary }}
        el-col(style={flex:'1 1 auto',width:'auto'})
          pre
            | 正在运行的进程：
            |  {{ runningPid.join('\n')}}
        el-col(style={flex:'0 1 auto',width:'auto'})
          el-tooltip.item(effect="dark" content=" 部署相关文件" placement="top-start")
            el-button(type="primary" size="mini" round @click='deploy') 部署文件
        el-col(style={flex:'0 1 auto',width:'auto'})
          small.label Minimap 服务
        el-col(style={flex:'2',width:'auto'})
          el-button-group
            el-tooltip.item(effect="dark" content="启动minimap" placement="top-start")
              el-button(type="primary" size="mini" round @click='startMinimap') 启动
            el-tooltip.item(effect="dark" content="停止minimap" placement="top")
              el-button(type="danger" size="mini" round @click='stopMinimap') 停止
            el-tooltip.item(effect="dark" content="检查minimap状态" placement="top-end")
              el-button(size="mini" round @click='checkMinimap') 检查
</template>
<script>
import * as api from '@/api'

export default {
  name: 'adb-command',
  data() {
    return {
      devices: [],
      runningPid: [],
      debugmsg: ''
    }
  },
  created() {
    this.initAdb()
    this.checkMinimap()
  },
  methods: {
    async initAdb() {
      this.devices = (await api.listDevices()).data.devices
    },
    async checkMinimap() {
      let result = await api.checkMinimap()
      if (result.err) {
        this.runningPid = []
        return
      }
      this.runningPid = result.data.result
      // console.log('[result]', this.runningPid)
    },
    startMinimap() {
      api.startMinimap().then(() =>
        this.checkMinimap())
    },
    stopMinimap() {
      api.stopMinimap().then(() =>
        this.checkMinimap()
      )
    },
    async deploy() {
      let result = await api.deploy()
      this.debugmsg = result.data
      this.$message(this.debugmsg.result.join('\n'))
    }
  }
}
</script>
<style lang="stylus" scoped>
.box-card
  // width 480px
  // cursor pointer
.btn-group .label
  float left
  margin-left .2em
  margin-right .2em
</style>

