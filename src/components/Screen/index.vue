<template lang="pug">
  div.screenPage
    el-button-group.action
      el-button(type="primary" size="mini" round @click='connectWs') 连接ws
      el-button(type="danger" size="mini" round @click='disconnectWs') 断开ws
    el-button-group.action
      el-button(type="primary" size="mini" round @click='key("back")') 返回
      el-button(type="primary" size="mini" round @click='key("home")') 桌面
      el-button(type="primary" size="mini" round @click='key("menu")') 菜单
    div.stage(:style='`height:${Math.round(8000 * canvasHeight/canvasWidth)/100}vw;max-width:${Math.round(8000 * canvasWidth/canvasHeight)/100}vh`')
      canvas#screen(v-screen='screendata' @mousedown='mouseAct'  @mouseup='mouseAct'  @mousemove='mouseAct' :width='canvasWidth'  :height='canvasHeight')
</template>
<script>
// ,height:Math.round(80 * canvasHeight/canvasWidth)/100 + 'vw',maxWidth:+'vh'
// import Vue from 'vue'
import _ from 'lodash'
import keyMap from '@/api/android_key.json'

// let firstImgLoad = false

export default {
  name: 'screen',
  data() {
    return {
      screendata: null,
      ws: null,
      stamp: '',
      canvasWidth: 100,
      canvasHeight: 100,
      ratio: 1,
      canvasBoundary: {
        x: 0, y: 0, width: 1
      },
      flag: 'NONE'
    }
  },
  directives: {
    screen(el, binding, vNode) {
      // console.info('on message')
      if (!binding.value) return
      // console.info('render an image ---- ', +new Date())
      let BLANK_IMG = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
      var g = el.getContext('2d')
      var blob = new Blob([binding.value], { type: 'image/jpeg' })
      var URL = window.URL || window.webkitURL
      var img = new Image()
      img.onload = () => {
        vNode.context.canvasWidth = img.width
        vNode.context.canvasHeight = img.height
        g.drawImage(img, 0, 0)
        // firstImgLoad = true
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
        // console.info('[message on websocket]', this)
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
    },
    async mouseAct(e) {
      // console.info('mouseAct', e.type)
      // this.flag = 'NONE'  // DRAGGING
      let ws = this.ws
      if (ws.readyState !== WebSocket.OPEN) return
      let x = Math.round(this.ratio * (e.x - this.canvasBoundary.x))
      let y = Math.round(this.ratio * (e.y - this.canvasBoundary.y))
      let currentStamp = +new Date()
      switch (e.type) {
        case 'mousemove':
          if (currentStamp - this.clickStamp < 100) return
          if (this.flag === 'TRY' || this.flag === 'DRAGGING') {
            ws.send(JSON.stringify({
              type: 'touch',
              data: {
                act: 'm',
                x,
                y
              }
            }))
            // `${} 0 ${x} ${y} 50\n`
            this.flag = 'DRAGGING'
          }
          break
        case 'mousedown':
          // console.info('mousedown')
          this.clickStamp = currentStamp
          this.flag = 'TRY'
          ws.send(JSON.stringify({
            type: 'touch',
            data: {
              act: 'r'
            }
          }))
          ws.send(JSON.stringify({
            type: 'touch',
            data: {
              act: 'd',
              x,
              y
            }
          }))
          break
        case 'mouseup':
          ws.send(JSON.stringify({
            type: 'touch',
            data: {
              act: 'u'
            }
          }))
          if (this.flag !== 'DRAGGING') {
            // this commit click
            console.info(`click @ ${x} ${y}`)
            // await this.click(e)
          } else {
            // this commit swipe
            // console.info('move complete')
          }
          this.flag = 'NONE'
          break
      }
    },
    calcTouchParams() {
      this.$nextTick(function() {
        let targetEl = this.$el.querySelector('canvas')
        this.canvasBoundary = targetEl.getBoundingClientRect()
        console.info('new Boundary Data Settled')
        let width = this.canvasBoundary.width || 1
        this.ratio = this.canvasWidth * 3 / Math.ceil(width)
        console.info(`
        CANVAS EL: width - ${width}
        IMG width: ${this.canvasWidth}
        ratio: ${this.ratio}
      `)
      })
    },
    key(keyname) {
      let keycode = keyMap[`KEYCODE_${keyname.toUpperCase()}`]
      console.info('send key ', keyname, keycode)
      let ws = this.ws
      ws.send(JSON.stringify({
        type: 'key',
        data: keyname.toLowerCase()
      }))
    }
  },
  created() {
    this.BLANK_IMG =
      'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
    this.connectWs()
  },
  beforeDestroy() {
    this.disconnectWs()
  },
  mounted() {
    window.onresize = _.debounce(this.calcTouchParams, 500)
  },
  watch: {
    canvasWidth: function(newValue, oldValue) {
      // console.info({ newValue, oldValue })
      this.calcTouchParams()
    }
  }
}
</script>
<style lang="stylus" scoped>
.screenPage
  width 100%
  height 100%

.stage
  width 80vw
  max-height 80vh
  // background yellowgreen
  position relative
  margin-left auto
  margin-right auto
  // box-sizing border-box

.action
  max-height 10vh
  display flex
  justify-content center
  padding 10px

canvas#screen
  // display none
  position absolute
  width 100%
  height 100%
  left 0
  top 0
  // border thin solid yellowgreen
  border-radius 4px
</style>

