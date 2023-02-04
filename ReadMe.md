# 如何开始 ？

**插件安装提示（vscode）**

需要安装插件: prettier, vetur。 prettier 格式化，注意 "printWidth": 1800 不能小于这个值。 .vscode 里配置了格式化代码的参数

安装 npm install

开发模式 npm run work

打包模式 npm run build

提供服务 npm run server

**封装的请求方法使用**

```javascript
var { state, list } = await this.$axios.asyncRequestInterface('/interface-name', {}, 'get', {
    autoPrompt: false
});
// state true | false 最终请求处理状态
// list = 接口返回的数据字段名
if (state) return list;
```

# 是什么 ？

一个基于 vue2 + koa 的单入口 SSR 脚手架。集成的功能应该可以让你快速开始开发业务页面。

# 都作了什么 ？

### 1）结构规划

规划的思想原则是低耦合、同类、分类归纳，可复用性。

**/vender**

这里存放一些辅助开发的工程文件；如：三方的引入插件（没有进行过修改或定制的）。

**/src/components**

可跨项目所使用的通用组件库（如：消息提示，骨架图组件等）与 vender 区别是，自己开发的组件，或对三方组件进行了一定程度的封装。

**/src/plugins**

工具库，封装了一些会经常使用的工具方法。

**/src/router**

vue router 的配置，封装。

**/src/static**

通用性的静态素材资源，如：字体，icon，影响整个项目全局通用的样式库等。图片素材尽可能放在业务组件内的 assets 目录里。

**/src/store**

vue store 状态管理器。

**/src/views**

存放业务文件的目录名称，以落地业务命名（小写单词命名，如需多个，使用中划线进行拼接）。

如：generic, communally, login, article-list, user-center；其中 communally 适用于混合于其它业务而又不是独立存在的业务代码。

assets 目录存放当前业务页面独有的静态文件（如：样式 css，图片，js 文件等）具有高偶合性。

widgets 目录当前业务页面所使用的通用组件，具有低耦合性（通常是当前业务页面有多个不同视图表达形式，有一些共用的视图封装存放于此）。

subassembly 目录存放与本页面逻辑相关的分拆组件（如过于复杂的交互，超过上千行的组件分拆）具有高偶合性。

此处为什么要这么设计 ？

如需求是有多种文章列表（article-list/normal.vue 和 article-list/simple.vue）页面中一部分元素可以共用，这个共用可以封装成 widget 组件。这样不同的文章列表页面布局，都可以引用 widget 组件，方便后续维护。

引用的素材也都在在一个目录单元内，对于引用、删除、清理都会方便一些。

### 2）封装了请求，统一处理请求状态

请求接口与业务页面放到一起，而不进行统计存放的设计是为了方便（尤其是多个版本接口并存的时候）。封装了请求出错提示，可以单独设置是否使用默认出错提示。

### 3）接口请求缓存

可以指定某个接口进行缓存处理。

### 4）语言包

多语言插件的简单封装。

### 5）路由地址生成封装

工作流程： 1=》请求接口获取生成路由的数据。 2=》根据规则生成路由，相应需要的初始化操作等。 3=》进入业务页面。

# Contributors

fulinte@189.cn 欢迎同行交流合作
