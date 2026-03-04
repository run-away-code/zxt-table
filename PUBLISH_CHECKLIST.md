# 发布前检查清单

在发布到 npm 之前，请按照以下步骤进行检查：

## 1. 构建项目

```bash
npm run build
```

确保构建成功，并检查 `dist` 目录中是否生成了以下文件：
- `zxt-table.es.js` - ES 模块格式
- `zxt-table.umd.js` - UMD 格式
- `zxt-table.css` - 样式文件

## 2. 本地测试

### 方法一：使用 npm pack

在项目根目录运行：

```bash
npm pack
```

这会生成一个 `.tgz` 文件，例如 `zxt-table-0.0.5.tgz`

在测试项目中安装：

```bash
npm install /path/to/zxt-table-0.0.5.tgz
```

### 方法二：使用 npm link

在组件库项目中：

```bash
npm link
```

在测试项目中：

```bash
npm link zxt-table
```

## 3. 测试组件功能

在测试项目中创建测试页面：

```vue
<template>
  <div>
    <h1>测试 ZxtTable</h1>
    <ZxtTable :columns="columns" :data="data" />
    
    <h1>测试 ZxtGrid</h1>
    <ZxtGrid :columns="columns" :data="data" />
    
    <h1>测试 ZxtForm</h1>
    <ZxtForm :columns="formColumns" v-model="formData" />
    
    <h1>测试 ZxtPagination</h1>
    <ZxtPagination v-model="currentPage" :total="100" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = ref([
  { title: '姓名', field: 'name' },
  { title: '年龄', field: 'age' }
])

const data = ref([
  { name: '张三', age: 30 },
  { name: '李四', age: 25 }
])

const formColumns = ref([
  { label: '姓名', prop: 'name', type: 'input' },
  { label: '年龄', prop: 'age', type: 'number' }
])

const formData = ref({
  name: '',
  age: 0
})

const currentPage = ref(1)
</script>
```

## 4. 检查 package.json

确认以下字段正确：
- ✅ `name`: 包名称
- ✅ `version`: 版本号（遵循语义化版本）
- ✅ `description`: 描述信息
- ✅ `keywords`: 关键词数组
- ✅ `author`: 作者信息
- ✅ `license`: 许可证
- ✅ `main`: UMD 入口
- ✅ `module`: ES 模块入口
- ✅ `exports`: 导出配置
- ✅ `files`: 要发布的文件
- ✅ `peerDependencies`: 对等依赖

## 5. 检查文档

- ✅ README.md 是否完整准确
- ✅ 示例代码是否正确
- ✅ 是否包含安装说明
- ✅ 是否包含使用示例

## 6. 检查依赖

确保：
- `vue` 和 `element-plus` 在 `peerDependencies` 中
- 不在 `dependencies` 中（避免重复安装）
- 在 `devDependencies` 中用于开发

## 7. 发布到 npm

### 首次发布

如果是第一次发布，需要登录 npm：

```bash
npm login
```

### 发布命令

```bash
npm publish
```

### 发布特定标签（如 beta 版本）

```bash
npm publish --tag beta
```

## 8. 发布后验证

```bash
npm view zxt-table
npm install zxt-table
```

## 版本管理

使用 npm version 命令更新版本：

```bash
# 补丁版本（bug 修复）0.0.5 -> 0.0.6
npm version patch

# 次版本（新功能）0.0.5 -> 0.1.0
npm version minor

# 主版本（破坏性更改）0.0.5 -> 1.0.0
npm version major
```

## 注意事项

1. ⚠️ 确保 `.npmignore` 文件正确配置，避免发布源码和开发文件
2. ⚠️ 检查组件是否正确导出，可以通过按需引入测试
3. ⚠️ 确保样式文件正确打包并可以被引入
4. ⚠️ 测试 UMD 和 ES 模块两种格式是否都能正常工作
5. ⚠️ 检查是否有 console.log 等调试代码
6. ⚠️ 确保所有 peerDependencies 都已安装在测试项目中

## 常见问题

### Q: 发布后样式不生效？
A: 确保在项目中引入了样式文件：
```javascript
import 'zxt-table/dist/style.css'
```

### Q: Element Plus 组件不显示？
A: 确保已安装并引入 Element Plus：
```javascript
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
app.use(ElementPlus)
```

### Q: 组件未注册？
A: 检查是否正确使用了 `app.use(ZxtTable)` 或按需引入组件

