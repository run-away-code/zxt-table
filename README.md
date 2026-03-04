# zxt-table

一个基于 Vue 3 和 Element Plus 构建的高级表格、表单组件库。

## 特性

- 🚀 基于 Vue 3 Composition API
- 📦 开箱即用的高级组件
- 🎨 支持自定义渲染器
- 💪 TypeScript 友好（即将支持）
- 📱 响应式设计

## 安装

### 前置依赖

本组件库依赖 Vue 3 和 Element Plus，请确保已安装：

```bash
npm install vue@^3.2.0 element-plus@^2.0.0
```

### 安装组件库

```bash
npm install zxt-table
```

## 使用

### 方式一：自动按需引入（推荐）

如果您使用了 `unplugin-vue-components` 和 `unplugin-auto-import`，可以使用我们提供的 Resolver 自动引入组件和样式（包括 Element Plus 的样式）。

1. 在 `vite.config.js` 中配置：

```javascript
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { ZxtTableResolver } from 'zxt-table/resolver' // 引入 Resolver

export default defineConfig({
  plugins: [
    Components({
      resolvers: [
        // Element Plus 自动引入
        ElementPlusResolver(),
        // ZxtTable 自动引入 (会自动处理 ZxtTable 和 Element Plus 的样式依赖)
        ZxtTableResolver()
      ],
    }),
  ],
})
```

### 方式二：全局注册

在您的 `main.js` 文件中引入组件库：

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
// ❗ 重要：如果您没有使用 Resolver，必须手动引入 Element Plus 样式
import 'element-plus/dist/index.css'

// 引入 zxt-table
import ZxtTable from 'zxt-table'
// 引入组件库样式
import 'zxt-table/style.css'

const app = createApp(App)
app.use(ElementPlus)
app.use(ZxtTable)
app.mount('#app')
```

### 方式三：手动按需引入

您也可以按需引入单个组件：

```javascript
import { ZxtTable, ZxtGrid, ZxtForm, ZxtPagination } from 'zxt-table'
import 'zxt-table/dist/style.css'

export default {
  components: {
    ZxtTable,
    ZxtGrid,
    ZxtForm,
    ZxtPagination
  }
}
```

### 组件示例

#### ZxtTable 基础使用

```vue
<template>
  <div>
    <ZxtTable :columns="columns" :data="data" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = ref([
  {
    title: '姓名',
    field: 'name'
  },
  {
    title: '年龄',
    field: 'age'
  }
])

const data = ref([
  {
    name: '张三',
    age: 30
  },
  {
    name: '李四',
    age: 25
  }
])
</script>
```

#### ZxtGrid 使用（带分页和工具栏）

```vue
<template>
  <ZxtGrid
    :columns="columns"
    :data="tableData"
    :toolbar="toolbarConfig"
    :pagination="paginationConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const columns = ref([
  { title: 'ID', field: 'id' },
  { title: '名称', field: 'name' }
])

const tableData = ref([
  { id: 1, name: '数据1' },
  { id: 2, name: '数据2' }
])

const toolbarConfig = ref({
  buttons: [
    { text: '新增', code: 'add' },
    { text: '删除', code: 'delete' }
  ]
})

const paginationConfig = ref({
  total: 100,
  pageSize: 10
})
</script>
```

## 组件列表

- **ZxtTable** - 基础表格组件
- **ZxtGrid** - 高级表格组件（带工具栏和分页）
- **ZxtForm** - 表单组件
- **ZxtPagination** - 分页组件

## 自定义渲染器

支持注册自定义单元格渲染器，详见 [渲染器使用文档](./RENDERER_USAGE.md)

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build
```

## License

MIT
