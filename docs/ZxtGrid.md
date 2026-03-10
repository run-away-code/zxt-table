# ZxtGrid 可配置表格组件

## 1. 组件概述 (Overview)

`ZxtGrid` 是基于 `ZxtTable` 封装的高级可配置表格组件，采用**纯 JSON 配置驱动**的设计理念。通过一个 `gridOptions` 对象即可声明式地完成搜索表单、工具栏、表格列、操作列、分页等全部功能的配置，无需手写大量模板代码。

### 核心能力

| 能力 | 说明 |
| :--- | :--- |
| 搜索表单 | 通过 `formConfig` 配置顶部查询区域，支持 input / select / date / daterange 等控件，支持字段联动 |
| 工具栏 | 通过 `toolbar.buttons` 配置操作按钮组（新增、删除、刷新、导出等），支持图标和自定义 code |
| 列配置 | 通过 `columns` 数组声明所有列，支持多级表头（`children`）、自定义插槽（`slot`）、操作列（`actionColumn`） |
| 操作列 | 通过 `actionColumn` 配置化生成行内按钮，自动处理平铺/折叠策略 |
| 分页 | 内置分页组件，通过 `pageable`、`pageSizes` 等字段控制 |
| 数据代理 | 支持 `proxyConfig` 对接服务端分页/排序/过滤 |
| 透传属性 | 未被 ZxtGrid 消费的属性（如 `row-key`、`border`、`stripe`）会透传给底层 `el-table` |

### 组件层级关系

```
ZxtGrid
├── ZxtForm          (搜索表单区域)
├── Toolbar          (工具栏按钮区域)
├── ZxtTable         (表格主体)
│   ├── ZxtTableColumn  (列渲染，支持递归多级表头)
│   └── ActionColumn    (操作列，自动平铺/折叠)
└── ZxtPagination    (分页)
```

---

## 2. 参数定义 (API / Props)

### 2.1 ZxtGrid Props

| 参数名 | 说明 | 类型 | 默认值 |
| :--- | :--- | :--- | :--- |
| gridOptions | 网格配置对象，包含所有子配置 | `GridOptions` | `{}` |
| externalData | 外部传入的数据（优先级高于 `gridOptions.data`） | `Array` | `[]` |

> 除以上两个 prop 外，其余属性（如 `row-key`、`default-expand-all`、`border` 等）均会透传给底层 `el-table`。

### 2.2 GridOptions 完整字段

| 字段 | 说明 | 类型 | 默认值 |
| :--- | :--- | :--- | :--- |
| id | 表格唯一标识 | `String` | `"grid"` |
| columns | 列配置数组 | `Array<ColumnConfig>` | `[]` |
| data | 表格数据（静态模式，与 `proxyConfig` 二选一） | `Array` | `[]` |
| height | 表格高度，传 `"full"` 可自适应父容器 | `String \| Number` | `400` |
| border | 是否显示边框（透传给 el-table） | `Boolean` | `false` |
| stripe | 是否显示斑马纹（透传给 el-table） | `Boolean` | `false` |
| pageable | 是否启用分页 | `Boolean` | `true` |
| pageSizes | 可选的每页条数 | `Array<Number>` | `[10, 20, 50, 100]` |
| paginationLayout | 分页组件布局 | `String` | `"total, sizes, prev, pager, next, jumper"` |
| toolbar | 工具栏配置 | `ToolbarConfig \| null` | `null` |
| formConfig | 搜索表单配置 | `FormConfig \| null` | `null` |
| formMode | 是否显示搜索表单（设为 `false` 时隐藏表单区域） | `Boolean` | `true` |
| proxyConfig | 服务端数据代理配置（详见 2.6 节） | `ProxyConfig \| null` | `null` |
| autoLoad | 代理模式下是否在组件挂载时自动请求数据 | `Boolean` | `true` |
| spanMethod | 行/列合并方法，透传给 el-table 的 `span-method` | `Function` | — |
| cellStyle | 单元格样式，透传给 el-table 的 `cell-style` | `Function \| Object` | — |

### 2.3 ColumnConfig 列配置

| 字段 | 说明 | 类型 | 默认值 |
| :--- | :--- | :--- | :--- |
| prop | 列字段名（兼容 `field`） | `String` | — |
| label | 列标题（兼容 `title`） | `String` | — |
| width | 列宽度 | `String \| Number` | — |
| align | 对齐方式 | `"left" \| "center" \| "right"` | `"left"` |
| fixed | 固定列 | `"left" \| "right" \| Boolean` | — |
| slot | 自定义插槽名称 | `String` | — |
| children | 子列配置（多级表头） | `Array<ColumnConfig>` | — |
| cellRender | 自定义单元格渲染器 | `Object \| Function` | — |
| formatter | 格式化函数 | `Function` | — |
| actionColumn | 操作列配置（详见第 3 节） | `ActionColumnConfig` | — |

### 2.4 ToolbarConfig 工具栏配置

```javascript
{
  buttons: Array<ToolbarButton>
}
```

**ToolbarButton 字段：**

| 字段 | 说明 | 类型 | 默认值 |
| :--- | :--- | :--- | :--- |
| code | 按钮标识码 | `String` | — |
| name | 按钮文字 | `String` | — |
| type | 按钮类型 | `"primary" \| "danger" \| "success" \| "default"` | `"default"` |
| size | 按钮尺寸 | `"small" \| "default" \| "large"` | `"small"` |
| icon | 图标名称（Element Plus 内置图标） | `String` | — |
| disabled | 是否禁用 | `Boolean` | `false` |

### 2.5 FormConfig 搜索表单配置

| 字段 | 说明 | 类型 | 默认值 |
| :--- | :--- | :--- | :--- |
| data | 表单绑定数据对象 | `Object` | `{}` |
| items | 表单项配置数组 | `Array<FormItem>` | `[]` |
| rules | 校验规则 | `Object` | `{}` |
| actionConfig | 操作按钮列配置（控制查询/重置按钮的 span 等） | `Object` | — |

**FormItem 字段：**

| 字段 | 说明 | 类型 | 默认值 |
| :--- | :--- | :--- | :--- |
| prop | 字段名 | `String` | — |
| label | 标签文字 | `String` | — |
| type | 控件类型 | `"input" \| "select" \| "date" \| "daterange" \| "slot"` | `"input"` |
| span | 栅格占位（1-24） | `Number` | `12` |
| options | 下拉选项（type 为 select 时） | `Array<{ label, value }>` | — |
| events | 事件监听对象 | `Object` | — |
| startPlaceholder | 日期范围开始占位文字 | `String` | `"开始日期"` |
| endPlaceholder | 日期范围结束占位文字 | `String` | `"结束日期"` |
| valueFormat | 日期值格式 | `String` | — |
| placeholder | 自定义占位文字（不传则自动生成「请输入/请选择 + label」） | `String` | — |
| clearable | 是否可清空 | `Boolean` | — |
| disabled | 是否禁用 | `Boolean` | `false` |
| required | 是否必填（自动生成校验规则） | `Boolean` | `false` |
| slotName | 当 `type: "slot"` 时指定插槽名称，不传则使用 `prop` | `String` | — |
| dateType | 日期选择器类型（`date`、`daterange`、`datetime` 等） | `String` | — |
| cascaderProps | 级联选择器的 props 配置 | `Object` | — |
| props | 透传给底层 Element Plus 组件的额外属性（如 `filterable`、`multiple` 等） | `Object` | — |
| xs | 响应式栅格：`<768px` 时的列宽 | `Number` | 同 `span` |
| sm | 响应式栅格：`≥768px` 时的列宽 | `Number` | 同 `span` |
| md | 响应式栅格：`≥992px` 时的列宽 | `Number` | 同 `span` |
| lg | 响应式栅格：`≥1200px` 时的列宽 | `Number` | 同 `span` |

### 2.6 ProxyConfig 数据代理配置

`proxyConfig` 用于对接服务端分页/排序/过滤，替代静态 `data` 数据源。配置后组件会自动管理请求发起、参数拼装、响应解析、分页联动。

```javascript
{
  ajax: {
    query: Function    // 查询方法，接收 payload 返回 Promise
  },
  props: Object,       // 请求字段名映射（可选）
  params: Object,      // 每次请求附加的固定参数（可选）
  response: Object,    // 响应字段名映射（可选）
}
```

**ajax.query 配置：**

| 字段 | 说明 | 类型 |
| :--- | :--- | :--- |
| ajax.query | 查询接口函数，接收 `payload` 参数，返回 `Promise` | `(payload) => Promise<Response>` |

**请求 payload 结构：**

```javascript
{
  page: {
    currentPage: 1,    // 当前页码
    pageSize: 10,      // 每页条数
  },
  form: { ... },       // 搜索表单数据
  sort: "name",        // 排序字段（有排序时）
  order: "ascending",  // 排序方向（有排序时）
  filters: { ... },    // 过滤条件（有过滤时）
  // ...params（附加固定参数）
}
```

**props 请求字段映射（可选）：**

| 字段 | 说明 | 默认值 |
| :--- | :--- | :--- |
| pageField | 分页信息在 payload 中的键名 | `"page"` |
| sizeField | 每页条数在 payload 中的键名 | `"size"` |
| sortField | 排序字段在 payload 中的键名 | `"sort"` |
| orderField | 排序方向在 payload 中的键名 | `"order"` |
| filtersField | 过滤条件在 payload 中的键名 | `"filters"` |

**response 响应解析配置（可选）：**

| 字段 | 说明 | 类型 | 默认值 |
| :--- | :--- | :--- | :--- |
| listField | 响应中列表数据的字段名 | `String` | `"list"` |
| totalField | 响应中总条数的字段名 | `String` | `"total"` |
| transform | 自定义响应转换函数，优先级最高 | `(resp) => { list, total }` | — |

**完整配置示例：**

```javascript
proxyConfig: {
  ajax: {
    query: (payload) => axios.get("/api/users", { params: payload }),
  },
  params: { tenantId: "xxx" },
  response: {
    listField: "data.records",  // 嵌套取值场景可使用 transform
    totalField: "data.total",
  },
}
```

**自定义 transform 示例：**

```javascript
proxyConfig: {
  ajax: {
    query: (payload) => fetchUserList(payload),
  },
  response: {
    transform: (resp) => ({
      list: resp.data?.records || [],
      total: resp.data?.totalCount || 0,
    }),
  },
}
```

---

## 3. 操作列配置 (ActionColumn)

### 3.1 概述

操作列是表格中最常见的交互区域。`ZxtGrid` 通过 `actionColumn` 字段实现**纯配置化**的操作列，无需手写 `<template #action>` 插槽。

### 3.2 核心逻辑

```
按钮总数 = buttons 中 visible !== false 的按钮数量

if (按钮总数 <= maxVisible) {
    全部平铺显示为 link 按钮
} else {
    前 maxVisible 个平铺显示
    剩余按钮收入「更多」下拉菜单（el-dropdown, trigger="hover"）
}
```

**视觉示意：**

```
按钮数 <= 2:   [ 编辑 ] [ 删除 ]
按钮数 >  2:   [ 编辑 ] [ 删除 ] [ 更多 ▾ ]
                                      ├─ 查看
                                      └─ 复制
```

### 3.3 ActionColumnConfig

在 `columns` 数组中，将某一列的 `actionColumn` 字段设置为以下结构：

| 字段 | 说明 | 类型 | 默认值 |
| :--- | :--- | :--- | :--- |
| buttons | 按钮配置列表 | `Array<ButtonConfig>` | `[]` |
| maxVisible | 最大平铺显示数量，超出部分折叠到「更多」 | `Number` | `2` |

### 3.4 ButtonConfig 按钮数据结构

| 字段 | 说明 | 类型 | 默认值 | 必填 |
| :--- | :--- | :--- | :--- | :--- |
| label | 按钮显示文字 | `String` | — | 是 |
| code | 按钮唯一标识，用于事件回调中区分操作 | `String` | — | 是 |
| type | 按钮颜色类型，不传则渲染为默认文字按钮 | `"primary" \| "danger" \| "success" \| "warning" \| "info"` | `""` | 否 |
| icon | Element Plus 图标名称 | `String` | — | 否 |
| visible | 控制按钮是否可见，支持布尔值或按行动态判断的函数 | `Boolean \| (row: Object) => Boolean` | `true` | 否 |

**支持的图标名称：**

`Edit`、`Delete`、`View`、`Plus`、`Search`、`Refresh`、`Download`、`Upload`、`Setting`、`Warning`、`Check`、`Close`、`Document`、`CopyDocument`、`Share`、`Lock`、`Unlock`

### 3.5 列配置示例

```javascript
{
  label: "操作",
  width: "220",
  fixed: "right",
  align: "center",
  actionColumn: {
    maxVisible: 2,
    buttons: [
      { label: "编辑", type: "primary", icon: "Edit", code: "edit" },
      { label: "删除", type: "danger", icon: "Delete", code: "delete" },
      { label: "查看", icon: "View", code: "view" },
      { label: "复制", icon: "CopyDocument", code: "copy" },
    ],
  },
}
```

### 3.6 按行动态控制按钮可见性

通过 `visible` 函数，可以根据当前行数据动态决定按钮是否显示：

```javascript
actionColumn: {
  maxVisible: 2,
  buttons: [
    { label: "编辑", type: "primary", code: "edit" },
    { label: "删除", type: "danger", code: "delete" },
    {
      label: "审批",
      type: "warning",
      code: "approve",
      // 仅 status === 0（待审批）的行显示此按钮
      visible: (row) => row.status === 0,
    },
    {
      label: "发布",
      type: "success",
      code: "publish",
      // 仅 status === 1（已审批）的行显示此按钮
      visible: (row) => row.status === 1,
    },
  ],
}
```

> 折叠策略基于过滤后的可见按钮数量计算，而非 buttons 数组原始长度。

---

## 4. 事件 (Events)

### 4.1 事件列表

| 事件名 | 说明 | 回调参数 |
| :--- | :--- | :--- |
| `toolbar-click` | 工具栏按钮点击 | `{ code: String, button: ToolbarButton, grid: GridRef }` |
| `action-click` | 操作列按钮点击 | `{ code: String, button: ButtonConfig, row: Object }` |
| `submit` | 搜索表单提交 | `formData: Object` |
| `reset` | 搜索表单重置 | — |
| `page-change` | 页码变化 | `{ page: Number, size: Number }` |
| `size-change` | 每页条数变化 | `{ page: Number, size: Number }` |

### 4.2 action-click 事件详解

当用户点击操作列中的任意按钮（无论是平铺按钮还是「更多」下拉菜单中的按钮），均会触发 `action-click` 事件，回调参数结构：

```typescript
{
  code: string;       // 按钮的 code 标识，如 "edit"、"delete"
  button: ButtonConfig; // 完整的按钮配置对象
  row: Object;         // 当前行数据
}
```

**事件处理示例：**

```javascript
const handleActionClick = ({ code, button, row }) => {
  switch (code) {
    case "edit":
      // 打开编辑弹窗
      openEditDialog(row);
      break;
    case "delete":
      // 确认删除
      confirmDelete(row.id);
      break;
    case "view":
      // 跳转详情页
      router.push(`/detail/${row.id}`);
      break;
    case "copy":
      // 复制数据
      copyRow(row);
      break;
  }
};
```

### 4.3 toolbar-click 事件详解

```javascript
const handleToolbarClick = ({ code, button, grid }) => {
  switch (code) {
    case "add":
      openAddDialog();
      break;
    case "delete":
      const rows = grid.getSelectedRows();
      if (!rows.length) return ElMessage.warning("请先选择数据");
      batchDelete(rows);
      break;
    case "refresh":
      grid.reload();
      break;
    case "export":
      exportData();
      break;
  }
};
```

---

## 5. 暴露方法 (Expose Methods)

通过 `ref` 获取组件实例后，可调用以下方法：

**核心方法：**

| 方法名 | 说明 | 参数 | 返回值 |
| :--- | :--- | :--- | :--- |
| `getGridRef()` | 获取内部 ZxtTable 组件实例 | — | `ZxtTable` |
| `getFormRef()` | 获取内部 ZxtForm 组件实例 | — | `ZxtForm` |
| `getElTableRef()` | 获取底层 Element Plus el-table 实例 | — | `ElTable` |
| `getSelectedRows()` | 获取当前选中的行数据 | — | `Array<Object>` |
| `reloadData(data)` | 设置内部静态数据（非代理模式） | `data: Array` | — |
| `setFormVisible(visible)` | 控制搜索表单区域显示/隐藏 | `visible: Boolean` | — |
| `setFormData(data, autoQuery?)` | 设置表单数据并可选触发查询（适用于 URL 参数回填等场景） | `data: Object, autoQuery: Boolean = true` | — |
| `commitProxy(type)` | 触发数据代理操作 | `type: "query" \| "reload"` | — |

**el-table 代理方法（直接转发给底层 el-table）：**

| 方法名 | 说明 | 参数 |
| :--- | :--- | :--- |
| `clearSelection()` | 清空所有选中行 | — |
| `toggleRowSelection(row, selected)` | 切换某一行的选中状态 | `row: Object, selected?: Boolean` |
| `toggleAllSelection()` | 切换全选 | — |
| `toggleRowExpansion(row, expanded)` | 切换行的展开状态 | `row: Object, expanded?: Boolean` |
| `setCurrentRow(row)` | 设置当前高亮行 | `row: Object` |
| `clearSort()` | 清除排序条件 | — |
| `clearFilter(columnKeys)` | 清除过滤条件 | `columnKeys?: Array<String>` |
| `doLayout()` | 重新计算表格布局 | — |
| `sort(prop, order)` | 手动排序 | `prop: String, order: String` |

**commitProxy 说明：**

| type | 行为 |
| :--- | :--- |
| `"query"` | 重置到第 1 页，携带当前表单数据重新请求 |
| `"reload"` | 保持当前页码，携带当前表单数据重新请求 |

```javascript
const gridRef = ref(null);

// 获取选中行
const selected = gridRef.value.getSelectedRows();

// 重置到第一页并重新查询
gridRef.value.commitProxy("query");

// 保持当前页码重新加载
gridRef.value.commitProxy("reload");

// 外部设置表单数据并自动触发查询（如 URL 参数回填）
gridRef.value.setFormData({ status: 1 });

// 仅设置表单数据，不自动查询
gridRef.value.setFormData({ status: 1 }, false);

// 获取底层 el-table 实例，调用原生方法
gridRef.value.getElTableRef().scrollTo(0, 0);
```

---

## 6. 插槽 (Slots)

**表格相关插槽：**

| 插槽名 | 说明 | 作用域参数 |
| :--- | :--- | :--- |
| `toolbar` | 工具栏扩展区域，在按钮组右侧追加自定义内容 | `{ grid }` |
| `[columnSlotName]` | 自定义列插槽（由 `columns` 中的 `slot` 字段指定） | `{ row, index, column }` |

**表单相关插槽：**

| 插槽名 | 说明 | 作用域参数 |
| :--- | :--- | :--- |
| `search-actions` | 搜索表单操作按钮区域（默认渲染「查询」「重置」按钮） | — |
| `[formSlotName]` | 自定义表单项插槽（由 `formConfig.items` 中 `type: "slot"` 的项指定） | `{ formData, column }` |
| `form-*` | 以 `form-` 前缀命名的插槽会自动透传给 ZxtForm | 视具体插槽而定 |

**插槽分发规则：**

ZxtGrid 内部会根据名称自动将插槽分发给 ZxtForm 或 ZxtTable：

1. `search-actions`、`form-*` 前缀、以及 `formConfig.items` 中 `type: "slot"` 的 `slotName` → 透传给 ZxtForm
2. `toolbar` → 工具栏区域
3. 其余插槽 → 透传给 ZxtTable（用于自定义列渲染）

> 当列配置中同时存在 `slot` 和 `actionColumn` 时，`actionColumn` 优先生效。

**表单插槽示例：**

```vue
<ZxtGrid :grid-options="gridOptions">
  <!-- 自定义搜索按钮区域 -->
  <template #search-actions>
    <el-button type="primary" @click="handleSearch">高级搜索</el-button>
  </template>

  <!-- 自定义表单项（formConfig.items 中配置 type: "slot", slotName: "custom-field"） -->
  <template #custom-field="{ formData }">
    <el-cascader v-model="formData.region" :options="regionOptions" />
  </template>

  <!-- 自定义列渲染 -->
  <template #status="{ row }">
    <el-tag :type="row.status === 1 ? 'success' : 'danger'">
      {{ row.status === 1 ? '启用' : '禁用' }}
    </el-tag>
  </template>
</ZxtGrid>
```

---

## 7. useZxtGrid Hook

### 7.0 概述

`useZxtGrid` 是 ZxtGrid 的配套 Hook，将配置构建、代理请求、事件分发、操作方法统一封装。对比直接手写 `reactive({ ... })` 配置，Hook 模式有以下优势：

| 特性 | 直接 gridOptions | useZxtGrid |
| :--- | :--- | :--- |
| 配置构建 | 手动组装 `formConfig`、`proxyConfig`、`toolbar` | 扁平化参数自动组装 |
| 事件分发 | 需要 `switch/case` 或 `if/else` | `toolbarHandlers` / `actionHandlers` 对象映射 |
| 操作方法 | 需通过 `gridRef.value.xxx()` 调用 | 直接解构 `query()`、`reload()` 等 |
| URL 回填 | 需手写 `onMounted` + `setFormData` | `initialFormData` 自动处理 |
| 默认值 | 无 | 内置 `border: true`、`stripe: true`、`height: "full"` 等 |

### 7.1 入参 (Options)

**基础配置：**

| 参数 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| id | `String` | — | Grid 唯一标识 |
| columns | `Array` | — | 列配置（支持多级表头、actionColumn） |
| data | `Array` | — | 静态数据（与 `fetchApi` 二选一） |
| border | `Boolean` | `true` | 是否显示边框 |
| stripe | `Boolean` | `true` | 是否显示斑马纹 |
| pageable | `Boolean` | `true` | 是否启用分页 |
| pageSizes | `Array<Number>` | `[10, 20, 50, 100]` | 可选每页条数 |
| paginationLayout | `String` | `"total, sizes, prev, pager, next, jumper"` | 分页布局 |
| height | `String \| Number` | `"full"` | 表格高度 |

**代理请求：**

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| fetchApi | `(payload) => Promise` | 查询接口函数 |
| transform | `(resp) => { list, total }` | 自定义响应转换器 |
| listField | `String` | 响应中列表字段名（默认 `"list"`） |
| totalField | `String` | 响应中总数字段名（默认 `"total"`） |
| extraParams | `Object` | 每次请求附加的固定参数 |
| autoLoad | `Boolean` | 是否挂载时自动请求（默认 `true`） |

**搜索表单：**

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| formData | `Object` | 表单初始数据（定义字段结构） |
| formItems | `Array` | 表单项配置 |
| formRules | `Object` | 表单校验规则 |
| initialFormData | `Object` | 挂载时自动赋值的表单数据（如 URL 参数回填），隐含 `autoLoad: false` |

**工具栏：**

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| toolbarButtons | `Array<ToolbarButton>` | 工具栏按钮配置 |

**事件处理：**

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| toolbarHandlers | `Object<String, Function>` | 工具栏事件映射 `{ [code]: (event, ctx) => void }` |
| actionHandlers | `Object<String, Function>` | 操作列事件映射 `{ [code]: (event, ctx) => void }` |

**样式 / 高级：**

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| spanMethod | `Function` | 行合并方法 |
| cellStyle | `Function \| Object` | 单元格样式 |
| formMode | `Boolean` | 是否开启表单模式 |
| overrides | `Object` | 其余直接透传到 gridOptions 的属性 |

### 7.2 返回值 (Returns)

| 返回值 | 类型 | 说明 |
| :--- | :--- | :--- |
| gridRef | `Ref` | 组件引用，绑定到 `<ZxtGrid ref="gridRef">` |
| gridOptions | `Reactive<Object>` | 组装好的配置对象，绑定到 `:grid-options` |
| query | `() => void` | 重置到第 1 页并查询（等价于 `commitProxy("query")`） |
| reload | `() => void` | 保持当前页码重新查询（等价于 `commitProxy("reload")`） |
| setFormData | `(data, autoQuery?) => void` | 设置表单数据并可选触发查询 |
| getSelectedRows | `() => Array` | 获取选中行数据 |
| clearSelection | `() => void` | 清空选中 |
| getElTableRef | `() => ElTable` | 获取底层 el-table 实例 |
| getFormRef | `() => ZxtForm` | 获取表单实例 |
| doLayout | `() => void` | 重新布局 |
| handleToolbarClick | `(event) => void` | 工具栏事件处理函数，绑定到 `@toolbar-click` |
| handleActionClick | `(event) => void` | 操作列事件处理函数，绑定到 `@action-click` |

### 7.3 事件处理器的 ctx 上下文

`toolbarHandlers` 和 `actionHandlers` 中的处理函数接收两个参数：

```typescript
handler(event, ctx)
```

| 参数 | 说明 |
| :--- | :--- |
| `event` | 原始事件对象（toolbar: `{ code, button, grid }`；action: `{ code, button, row }`） |
| `ctx` | 上下文对象，包含以下方法 |

**ctx 对象结构：**

| 属性 | 类型 | 说明 |
| :--- | :--- | :--- |
| query | `() => void` | 重置到第 1 页并查询 |
| reload | `() => void` | 保持当前页码重新查询 |
| setFormData | `(data, autoQuery?) => void` | 设置表单数据 |
| getSelectedRows | `() => Array` | 获取选中行 |
| clearSelection | `() => void` | 清空选中 |
| gridRef | `Ref` | 组件引用 |

### 7.4 initialFormData 自动回填机制

当配置了 `initialFormData` 时，Hook 内部会：

1. 将 `initialFormData` 合并到 `formData` 中作为表单初始值
2. 自动设置 `autoLoad: false`（阻止默认的挂载请求）
3. 在 `onMounted` 中调用 `setFormData(initialFormData)` 触发首次查询

这意味着表单会以 `initialFormData` 的值作为初始搜索条件进行首次查询，无需手写 `onMounted`。

```javascript
// 典型场景：从列表页跳转过来，URL 带有 status 参数
const { gridRef, gridOptions } = useZxtGrid({
  fetchApi: getUserList,
  formData: { name: "", status: "" },
  formItems: [...],
  initialFormData: { status: Number(route.query.status) },
});
// 挂载后自动以 status=xxx 作为条件查询，无需额外代码
```

### 7.5 默认配置

`useZxtGrid` 提供了合理的默认值，区别于直接使用 `gridOptions`：

```javascript
{
  border: true,
  stripe: true,
  pageable: true,
  pageSizes: [10, 20, 50, 100],
  paginationLayout: "total, sizes, prev, pager, next, jumper",
  height: "full",
}
```

> 显式传入的值会覆盖默认值。

---

## 8. 完整代码示例 (Usage Example)

### 8.1 直接使用 gridOptions（基础用法）

```vue
<template>
  <ZxtGrid
    ref="gridRef"
    :grid-options="gridOptions"
    row-key="id"
    @toolbar-click="handleToolbarClick"
    @action-click="handleActionClick"
  >
    <!-- 自定义列插槽 -->
    <template #status="{ row }">
      <el-tag :type="row.status === 1 ? 'success' : 'danger'">
        {{ row.status === 1 ? "启用" : "禁用" }}
      </el-tag>
    </template>
  </ZxtGrid>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import ZxtGrid from "@/components/ZxtGrid/ZxtGrid.vue";

const gridRef = ref(null);

const gridOptions = reactive({
  id: "user-grid",
  border: true,
  height: 500,

  // ========== 工具栏 ==========
  toolbar: {
    buttons: [
      { code: "add", name: "新增", type: "primary", icon: "Plus" },
      { code: "delete", name: "删除", type: "danger", icon: "Delete" },
      { code: "refresh", name: "刷新", type: "default", icon: "Refresh" },
    ],
  },

  // ========== 搜索表单 ==========
  formConfig: {
    data: { name: "", status: "" },
    items: [
      { prop: "name", label: "姓名", span: 6 },
      {
        prop: "status",
        label: "状态",
        span: 6,
        type: "select",
        options: [
          { label: "全部", value: "" },
          { label: "启用", value: 1 },
          { label: "禁用", value: 0 },
        ],
      },
    ],
  },

  // ========== 列配置 ==========
  columns: [
    { prop: "id", label: "ID", width: "80", align: "center" },
    { prop: "name", label: "姓名", width: "120" },
    { prop: "age", label: "年龄", width: "80", align: "center" },
    // 多级表头
    {
      label: "联系方式",
      align: "center",
      children: [
        { prop: "email", label: "邮箱", width: "200" },
        { prop: "phone", label: "电话", width: "140" },
      ],
    },
    // 自定义插槽列
    { prop: "status", label: "状态", width: "80", slot: "status", align: "center" },
    { prop: "address", label: "地址" },
    // 操作列（配置化）
    {
      label: "操作",
      width: "220",
      fixed: "right",
      align: "center",
      actionColumn: {
        maxVisible: 2,
        buttons: [
          { label: "编辑", type: "primary", icon: "Edit", code: "edit" },
          { label: "删除", type: "danger", icon: "Delete", code: "delete" },
          { label: "查看", icon: "View", code: "view" },
          { label: "复制", icon: "CopyDocument", code: "copy" },
        ],
      },
    },
  ],

  // ========== 数据 ==========
  data: [
    { id: 1, name: "张伟", age: 28, email: "zhangwei@test.com", phone: "13812345678", status: 1, address: "北京市朝阳区" },
    { id: 2, name: "李娜", age: 26, email: "lina@test.com", phone: "13987654321", status: 0, address: "上海市浦东新区" },
  ],

  // ========== 分页 ==========
  pageable: true,
  pageSizes: [10, 20, 50],
  paginationLayout: "total, sizes, prev, pager, next, jumper",
});

// 工具栏事件
const handleToolbarClick = ({ code, button }) => {
  ElMessage.info(`工具栏: ${button.name} (${code})`);
};

// 操作列事件
const handleActionClick = ({ code, button, row }) => {
  switch (code) {
    case "edit":
      ElMessage.success(`编辑: ${row.name}`);
      break;
    case "delete":
      ElMessage.warning(`删除: ${row.name}`);
      break;
    case "view":
      ElMessage.info(`查看: ${row.name}`);
      break;
    case "copy":
      ElMessage.info(`复制: ${row.name}`);
      break;
  }
};
</script>
```

### 8.2 使用 useZxtGrid Hook（推荐）

```vue
<template>
  <div class="page">
    <ZxtGrid
      ref="gridRef"
      :grid-options="gridOptions"
      row-key="id"
      @toolbar-click="handleToolbarClick"
      @action-click="handleActionClick"
    >
      <template #status="{ row }">
        <el-tag :type="row.status === 1 ? 'success' : 'danger'">
          {{ row.status === 1 ? "启用" : "禁用" }}
        </el-tag>
      </template>
    </ZxtGrid>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import ZxtGrid from "@/components/ZxtGrid/ZxtGrid.vue";
import { useZxtGrid } from "@/hooks/useZxtGrid";

const { gridRef, gridOptions, handleToolbarClick, handleActionClick } = useZxtGrid({
  id: "user-grid",
  fetchApi: (payload) => axios.get("/api/users", { params: payload }),
  pageSizes: [10, 20, 50],

  // 表单
  formData: { name: "", status: "" },
  formItems: [
    { prop: "name", label: "姓名", span: 6 },
    {
      prop: "status", label: "状态", span: 6, type: "select", clearable: true,
      options: [
        { label: "全部", value: "" },
        { label: "启用", value: 1 },
        { label: "禁用", value: 0 },
      ],
    },
  ],

  // 工具栏
  toolbarButtons: [
    { code: "add", name: "新增", type: "primary", icon: "Plus" },
    { code: "delete", name: "删除", type: "danger", icon: "Delete" },
    { code: "refresh", name: "刷新", type: "default", icon: "Refresh" },
  ],

  // 列
  columns: [
    { prop: "id", label: "ID", width: "80", align: "center" },
    { prop: "name", label: "姓名", width: "120" },
    { prop: "status", label: "状态", width: "80", slot: "status", align: "center" },
    { prop: "address", label: "地址" },
    {
      label: "操作", width: "180", fixed: "right", align: "center",
      actionColumn: {
        maxVisible: 2,
        buttons: [
          { label: "编辑", type: "primary", code: "edit" },
          { label: "删除", type: "danger", code: "delete" },
        ],
      },
    },
  ],

  // 工具栏事件
  toolbarHandlers: {
    add: () => openAddDialog(),
    delete: (_, { getSelectedRows }) => {
      const rows = getSelectedRows();
      rows.length ? batchDelete(rows) : ElMessage.warning("请先选择数据");
    },
    refresh: (_, { query }) => query(),
  },

  // 操作列事件
  actionHandlers: {
    edit: ({ row }) => openEditDialog(row),
    delete: ({ row }) => deleteRow(row.id),
  },
});
</script>
```

### 8.3 useZxtGrid + initialFormData（URL 参数回填）

```vue
<script setup>
import { useRoute } from "vue-router";
import ZxtGrid from "@/components/ZxtGrid/ZxtGrid.vue";
import { useZxtGrid } from "@/hooks/useZxtGrid";

const route = useRoute();

const { gridRef, gridOptions, handleToolbarClick, handleActionClick } = useZxtGrid({
  id: "order-grid",
  fetchApi: fetchOrderList,
  formData: { name: "", status: "" },
  formItems: [
    { prop: "name", label: "名称", span: 6 },
    { prop: "status", label: "状态", span: 6, type: "select", options: [...] },
  ],
  columns: [...],

  // 从 URL 参数中回填表单数据，挂载后自动以此作为条件查询
  initialFormData: { status: Number(route.query.status) },
});
</script>
```

### 8.4 useZxtGrid + autoLoad: false（手动控制首次加载）

```vue
<script setup>
import { onMounted } from "vue";
import { useZxtGrid } from "@/hooks/useZxtGrid";

const { gridRef, gridOptions, query, setFormData } = useZxtGrid({
  id: "manual-grid",
  fetchApi: fetchData,
  autoLoad: false,    // 不自动请求
  formData: { name: "", status: "" },
  formItems: [...],
  columns: [...],
});

onMounted(() => {
  const status = new URLSearchParams(location.search).get("status");
  if (status !== null) {
    setFormData({ status: Number(status) });  // 设置表单数据并查询
  } else {
    query();  // 无参数时手动触发查询
  }
});
</script>
```

### 8.5 仅两个按钮（平铺展示）

```javascript
// 按钮数 <= 2，全部平铺，无「更多」下拉
actionColumn: {
  buttons: [
    { label: "编辑", type: "primary", code: "edit" },
    { label: "删除", type: "danger", code: "delete" },
  ],
}
```

### 8.6 多按钮 + 动态可见性

```javascript
// 4 个按钮，前 2 个平铺，后 2 个折叠到「更多」
// 其中「审批」按钮仅对 status === 0 的行可见
actionColumn: {
  maxVisible: 2,
  buttons: [
    { label: "编辑", type: "primary", code: "edit" },
    { label: "删除", type: "danger", code: "delete" },
    { label: "审批", type: "warning", code: "approve", visible: (row) => row.status === 0 },
    { label: "查看", code: "view" },
  ],
}
```

### 8.7 自定义平铺数量

```javascript
// 设置 maxVisible 为 3，前 3 个平铺
actionColumn: {
  maxVisible: 3,
  buttons: [
    { label: "编辑", type: "primary", code: "edit" },
    { label: "删除", type: "danger", code: "delete" },
    { label: "查看", code: "view" },
    { label: "复制", code: "copy" },
    { label: "导出", code: "export" },
  ],
}
```

---

## 9. 常见问题 (FAQ)

### Q: 操作列按钮的 type 不传会怎样？

A: 不传 `type` 时，按钮渲染为默认文字链接样式（无颜色），适用于次要操作。

### Q: 操作列和自定义插槽能共存吗？

A: 同一列中 `actionColumn` 和 `slot` 不应同时使用。如果需要完全自定义操作列的渲染，请使用 `slot` 方式；如果希望配置化驱动，请使用 `actionColumn`。

### Q: 如何动态修改按钮配置？

A: `gridOptions` 使用 `reactive` 声明，直接修改 `actionColumn.buttons` 数组即可触发响应式更新：

```javascript
// 动态添加按钮
gridOptions.columns[lastIndex].actionColumn.buttons.push({
  label: "新操作",
  code: "new-action",
});

// 动态禁用某个按钮的可见性
gridOptions.columns[lastIndex].actionColumn.buttons[2].visible = false;
```

### Q: 透传给 el-table 的属性有哪些？

A: 除 `gridOptions` 和 `externalData` 外的所有属性均会透传，常用的包括：`row-key`、`default-expand-all`、`tree-props`、`highlight-current-row`、`empty-text` 等。

### Q: useZxtGrid 和直接写 gridOptions 该怎么选？

A: 推荐优先使用 `useZxtGrid`。它提供了更好的默认值、更简洁的代理配置、内置的 `initialFormData` 自动回填机制，以及基于 `code` 的事件映射分发。只有在需要完全自定义配置或不使用代理模式的极简场景下，才需要直接写 `gridOptions`。

### Q: 代理模式下如何处理非标准的接口响应？

A: 使用 `response.transform` 自定义响应转换：

```javascript
// useZxtGrid 方式
useZxtGrid({
  fetchApi: getUsers,
  transform: (resp) => ({
    list: resp.result?.items || [],
    total: resp.result?.pagination?.totalCount || 0,
  }),
})

// 直接 gridOptions 方式
proxyConfig: {
  ajax: { query: getUsers },
  response: {
    transform: (resp) => ({ list: resp.result.items, total: resp.result.pagination.totalCount }),
  },
}
```

### Q: 如何在操作完成后（如新增/编辑/删除）刷新表格？

A: 根据使用方式不同：

```javascript
// useZxtGrid：直接调用返回的方法
const { query, reload } = useZxtGrid({ ... });
query();   // 回到第一页刷新
reload();  // 保持当前页刷新

// 直接 gridOptions：通过 ref 调用
gridRef.value.commitProxy("query");   // 回到第一页
gridRef.value.commitProxy("reload");  // 保持当前页
```

### Q: 搜索表单的「查询」和「重置」按钮能自定义吗？

A: 可以通过 `#search-actions` 插槽完全替换默认的查询/重置按钮：

```vue
<ZxtGrid :grid-options="gridOptions">
  <template #search-actions>
    <el-button type="primary" @click="handleCustomSearch">高级搜索</el-button>
    <el-button @click="handleCustomReset">清空</el-button>
  </template>
</ZxtGrid>
```

### Q: formConfig.actionConfig 有什么用？

A: `actionConfig` 用于自定义搜索按钮列的布局配置（如 `span`、`labelWidth` 等），在表单项较多导致按钮位置不理想时很有用：

```javascript
formConfig: {
  data: { ... },
  items: [ ... ],
  actionConfig: {
    span: 12,            // 按钮列占的栅格数
    labelWidth: "0px",   // 取消 label 占位
  },
}
```

### Q: height 设为 "full" 时表格不撑满怎么办？

A: `height: "full"` 依赖父容器有明确高度。确保 ZxtGrid 的所有祖先容器都有 `height: 100%` 或具体高度值。典型的 CSS 结构：

```css
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.page-content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
```
