<template>
  <el-container class="container">
    <ScreenVue/>
    <el-popover ref="popover4" placement="right" width="400" trigger="hover" popper-class='popover4'>
      <el-aside class="side" width='auto' v-show="isCollapse">
        <el-menu :default-openeds="['1','2','3']" router>
          <el-menu-item index="0">Screen</el-menu-item>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-menu"></i>画面</template>
            <el-menu-item-group>
              <template slot="title">Connect</template>
              <el-menu-item index="1-1" :route="{path:'/adb-command'}">adb</el-menu-item>
              <el-menu-item index="1-2">forward</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="MiniCap">
              <el-menu-item index="1-3">socket</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">redirect</template>
              <el-menu-item index="1-4-1">render</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>控制</template>
            <el-menu-item-group>
              <template slot="title">minitouch</template>
              <el-menu-item index="2-1">click</el-menu-item>
              <el-menu-item index="2-2">swipe</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="web event">
              <el-menu-item index="2-3">scroll</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="2-4">
              <template slot="title">选项4</template>
              <el-menu-item index="2-4-1">选项4-1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-setting"></i>AutoTask</template>
            <el-menu-item-group>
              <template slot="title">Identify</template>
              <el-menu-item index="3-1">current snap</el-menu-item>
              <el-menu-item index="3-2">key element</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="calc">
              <el-menu-item index="3-3">黑白图</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="3-4">
              <template slot="title">Flow</template>
              <el-menu-item index="3-4-1">设定自动程序</el-menu-item>
            </el-submenu>
          </el-submenu>
        </el-menu>
      </el-aside>
    </el-popover>
    <el-popover ref="popover1" placement="top-start" width="200" trigger="hover">
      <adb-command v-show="isCollapseR" />
    </el-popover>
    <el-button v-popover:popover4 class='switchSider' type='text' icon="el-icon-menu" @click='isCollapse = ! isCollapse'>Action</el-button>
    <el-button v-popover:popover1 class='switchSider switchSiderR' type='text' icon="el-icon-menu" @click='isCollapseR = ! isCollapseR'>AdbCommand</el-button>

  </el-container>
</template>

<script>
import ScreenVue from '@/components/Screen'
import AdbCommand from '@/components/AdbCommand'

export default {
  name: 'app',
  data() {
    return {
      isCollapse: true,
      isCollapseR: true,
      msg: 'hello App'
    }
  },
  components: {
    ScreenVue, AdbCommand
  }
}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

html,
body,
.container {
  height: 100%
}

.popover4 {
  max-height: 90%;
  overflow: auto;
}

.side {
  /* position: absolute; */
  height: 100%;
  /* z-index: 99; */
}

.switchSider {
  z-index: 1999;
  position: fixed;
  width: 140px
}

.switchSiderR {
  right: 0
}
</style>
