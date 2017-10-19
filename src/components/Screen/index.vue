<template lang="pug">
  div.screen
    canvas#screen(v-screen='screendata')
    el-button-group
      el-button(type="primary" size="mini" round @click='connectWs') 连接ws
      el-button(type="danger" size="mini" round @click='disconnectWs') 断开ws
</template>
<script>
export default {
  name: 'screen',
  data() {
    return {
      screendata: null,
      ws: null,
      stamp: ''
    }
  },
  directives: {
    screen(el, binding) {
      console.info('on message')
      if (!binding.value) return
      console.info('render an image', binding)
      let BLANK_IMG = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

      var g = el.getContext('2d')
      var blob = new Blob([binding.value], { type: 'image/jpeg' })
      var URL = window.URL || window.webkitURL
      var img = new Image()
      img.onload = () => {
        el.width = img.width
        el.height = img.height
        g.drawImage(img, 0, 0)
        img.onload = null
        img.src = BLANK_IMG
        img = null
        u = null
        blob = null
      }
      var u = URL.createObjectURL(blob)
      img.src = u
    }
  },
  methods: {
    connectWs() {
      let remoteHost = 'localhost:3001'
      if (this.ws) return
      this.ws = new WebSocket('ws://' + remoteHost, 'minicap')
      var ws = this.ws
      ws.binaryType = 'blob'

      ws.onclose = function() {
        console.log('onclose', arguments)
        this.ws = null
      }

      ws.onerror = function() {
        console.log('onerror', arguments)
        this.ws = null
      }

      ws.onmessage = (message) => {
        console.info('[message on websocket]', this)
        this.screendata = message.data
        this.stamp = +new Date() + '' + Math.round(Math.random() * 1000)
      }

      ws.onopen = function() {
        console.log('onopen', arguments)
        ws.send('480x270/0')
      }
    },
    disconnectWs() {
      if (this.ws) {
        this.ws.close()
        this.ws = null
      }
    }
  },
  created() {
    this.BLANK_IMG =
      'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
  },
  beforeDestroy() {
    this.disconnectWs()
  }
}
</script>
<style lang="stylus" scoped>
.screen
  width auto
  height 100%
  border thin solid red

canvas#screen
  height 100%
  max-height 90%
</style>

