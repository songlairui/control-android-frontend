# control-android

> control android through web
目前仅适用于本地运行

## 解决的技术点

 - Vue 自定义指令，应对需要操作DOM的场景，本项目操作CANVAS DOM
   - 指令中去的 vm 上下文的方法
 - Vue $nextTick 的使用。 使用DOM值作为前置条件，操作变量时，需要在nextTick中操作，因为Vue的DOM是异步渲染的。
 - 使用 vw、vh 布局，做等比例自适应的div容器。用来存放Canvas
 - 屏幕旋转， 后端服务Socket重启，WebSocket不重启
 - 屏幕旋转，canvas比例变化
 - Canvas 点击点坐标的计算。
 - mouse event 转为 touch事件。

## TODO

 - image detail process
 - 演示黑白图过程。



## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
