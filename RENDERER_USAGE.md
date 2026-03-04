# 渲染器注入功能使用指南

## 概述

ZxtTable 组件库现已支持自定义渲染器注入功能，类似于 vxe-table 的渲染器机制。您可以通过 `renderer.add()` 方法注册自定义渲染器，然后在表单配置中使用 `itemRender` 来调用这些渲染器。

## 快速开始

### 1. 注册自定义渲染器

```javascript
import ZxtTableLib from 'zxt-table'
import { ElSelect, ElOption } from 'element-plus'
import { h } from 'vue'

// 方式1: 通过库对象注册
ZxtTableLib.renderer.add('XSelect', {
  renderItemContent(renderOpts, params) {
    const { data, field, item } = params
    
    return h(
      ElSelect,
      {
        modelValue: data[field],
        'onUpdate:modelValue': (val) => {
          data[field] = val
        },
        clearable: true,
        filterable: true,
        style: { width: '100%' }
      },
      () => item.itemRender.options?.map((r) => {
        return h(ElOption, {
          value: r[item.itemRender.optionProps.value],
          label: r[item.itemRender.optionProps.label],
          key: r[item.itemRender.optionProps.value]
        })
      })
    )
  }
})

// 方式2: 通过组件注册
import { ZxtTable } from 'zxt-table'

ZxtTable.renderer.add('XSelect', {
  // ... 同上
})
```

### 2. 在表单中使用自定义渲染器

```vue
<template>
  <ZxtTable
    :form-mode="true"
    :form-columns="formColumns"
    :initial-form-data="formData"
  />
</template>

<script>
export default {
  setup() {
    const formData = reactive({
      selectValue: ''
    })

    const formColumns = [
      {
        label: '选择器',
        prop: 'selectValue',
        itemRender: {
          name: 'XSelect',  // 使用注册的渲染器名称
          options: [
            { id: 1, name: '选项1' },
            { id: 2, name: '选项2' },
            { id: 3, name: '选项3' }
          ],
          optionProps: {
            value: 'id',
            label: 'name'
          }
        }
      }
    ]

    return {
      formData,
      formColumns
    }
  }
}
</script>
```

## API 文档

### renderer.add(name, config)

注册自定义渲染器。

**参数:**
- `name` (String): 渲染器名称，必须唯一
- `config` (Object): 渲染器配置对象
  - `renderItemContent(renderOpts, params)`: 渲染函数
    - `renderOpts` (Object): 渲染选项（可选）
    - `params` (Object): 参数对象
      - `data` (Object): 表单数据对象
      - `field` (String): 当前字段名
      - `item` (Object): 表单项配置
      - `formData` (Object): 表单数据引用

**返回值:**
- 返回 renderer 实例，支持链式调用

**示例:**
```javascript
ZxtTable.renderer.add('XSelect', {
  renderItemContent(renderOpts, params) {
    // 返回 VNode
    return h(Component, props, children)
  }
})
```

### renderer.get(name)

获取已注册的渲染器。

**参数:**
- `name` (String): 渲染器名称

**返回值:**
- 返回渲染器配置对象，如果不存在则返回 undefined

### renderer.delete(name)

删除已注册的渲染器。

**参数:**
- `name` (String): 渲染器名称

**返回值:**
- 返回 Boolean，表示是否删除成功

### renderer.has(name)

检查渲染器是否存在。

**参数:**
- `name` (String): 渲染器名称

**返回值:**
- 返回 Boolean

### renderer.getAll()

获取所有已注册的渲染器名称。

**返回值:**
- 返回 Array<String>，包含所有渲染器名称

### renderer.clear()

清空所有已注册的渲染器。

## 完整示例

### 使用 JSX 语法

```jsx
import { defineComponent } from 'vue'
import { ElSelect, ElOption } from 'element-plus'

ZxtTable.renderer.add('XSelect', {
  renderItemContent(renderOpts, params) {
    const { data, field, item } = params
    
    return (
      <ElSelect
        v-model={data[field]}
        clearable
        filterable
        style={{ width: '100%' }}
      >
        {item.itemRender.options?.map((r) => {
          return (
            <ElOption
              value={r[item.itemRender.optionProps.value]}
              label={r[item.itemRender.optionProps.label]}
              key={r[item.itemRender.optionProps.value]}
            />
          )
        })}
      </ElSelect>
    )
  }
})
```

### 使用 h 函数

```javascript
import { h } from 'vue'
import { ElInput } from 'element-plus'

ZxtTable.renderer.add('XInput', {
  renderItemContent(renderOpts, params) {
    const { data, field, item } = params
    
    return h(ElInput, {
      modelValue: data[field],
      'onUpdate:modelValue': (val) => {
        data[field] = val
      },
      placeholder: item.placeholder || '请输入',
      clearable: true
    })
  }
})
```

### 自定义 HTML 渲染器

```javascript
ZxtTable.renderer.add('CustomHtml', {
  renderItemContent(renderOpts, params) {
    const { data, field } = params
    
    return h('div', {
      class: 'custom-wrapper',
      style: 'border: 1px solid #ddd; padding: 10px;'
    }, [
      h('label', { style: 'font-weight: bold;' }, '自定义标签: '),
      h('span', data[field] || '暂无数据')
    ])
  }
})
```

## 注意事项

1. **双向绑定**: 在自定义渲染器中，需要手动处理 v-model 的双向绑定
   - 使用 JSX: `v-model={data[field]}`
   - 使用 h 函数: `modelValue` + `onUpdate:modelValue`

2. **渲染器名称**: 建议使用大写字母开头的驼峰命名，如 `XSelect`, `XInput`

3. **注册时机**: 建议在应用启动时或组件 `onMounted` 钩子中注册渲染器

4. **性能考虑**: 渲染器会在每次表单项渲染时调用，避免在渲染函数中进行复杂计算

5. **错误处理**: 如果渲染器执行出错，会在控制台输出警告信息，并返回 null

## 与 vxe-table 的差异

本实现与 vxe-table 的渲染器机制类似，但有以下主要区别：

1. **参数结构**: params 对象包含 `data`、`field`、`item`、`formData`
2. **应用场景**: 当前主要用于表单项渲染（ZxtForm）
3. **返回值**: 渲染函数返回 VNode 或 null

## 未来计划

- [ ] 支持表格单元格渲染器
- [ ] 内置更多常用渲染器
- [ ] 支持异步渲染器
- [ ] 渲染器配置验证

## 查看演示

查看 `src/examples/RendererDemo.vue` 文件以获取完整的使用示例。

