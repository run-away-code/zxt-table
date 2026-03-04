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
| data | 表格数据 | `Array` | `[]` |
| height | 表格高度，传 `"full"` 可自适应父容器 | `String \| Number` | `400` |
| border | 是否显示边框（透传给 el-table） | `Boolean` | `false` |
| stripe | 是否显示斑马纹（透传给 el-table） | `Boolean` | `false` |
| pageable | 是否启用分页 | `Boolean` | `true` |
| pageSizes | 可选的每页条数 | `Array<Number>` | `[10, 20, 50, 100]` |
| paginationLayout | 分页组件布局 | `String` | `"total, sizes, prev, pager, next, jumper"` |
| toolbar | 工具栏配置 | `ToolbarConfig \| null` | `null` |
| formConfig | 搜索表单配置 | `FormConfig \| null` | `null` |
| formMode | 是否显示搜索表单 | `Boolean` | `false` |
| proxyConfig | 服务端数据代理配置 | `ProxyConfig \| null` | `null` |

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

| 方法名 | 说明 | 参数 | 返回值 |
| :--- | :--- | :--- | :--- |
| `getGridRef()` | 获取内部 ZxtTable 组件实例 | — | `ZxtTable` |
| `getFormRef()` | 获取内部表单组件实例 | — | `ZxtForm` |
| `getSelectedRows()` | 获取当前选中的行数据 | — | `Array<Object>` |
| `reloadData(data)` | 重新加载数据 | `data: Array` | — |
| `setFormVisible(visible)` | 控制表单区域显示/隐藏 | `visible: Boolean` | — |
| `commitProxy(type)` | 触发数据代理操作 | `type: "query" \| "reload"` | — |

```javascript
const gridRef = ref(null);

// 获取选中行
const selected = gridRef.value.getSelectedRows();

// 重置到第一页并重新查询
gridRef.value.commitProxy("query");

// 保持当前页码重新加载
gridRef.value.commitProxy("reload");
```

---

## 6. 插槽 (Slots)

| 插槽名 | 说明 | 作用域参数 |
| :--- | :--- | :--- |
| `toolbar` | 工具栏扩展区域 | `{ grid }` |
| `[columnSlotName]` | 自定义列插槽（由 `columns` 中的 `slot` 字段指定） | `{ row, index, column }` |

> 当列配置中同时存在 `slot` 和 `actionColumn` 时，`actionColumn` 优先生效。

---

## 7. 完整代码示例 (Usage Example)

### 7.1 基础用法

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

### 7.2 仅两个按钮（平铺展示）

```javascript
// 按钮数 <= 2，全部平铺，无「更多」下拉
actionColumn: {
  buttons: [
    { label: "编辑", type: "primary", code: "edit" },
    { label: "删除", type: "danger", code: "delete" },
  ],
}
```

### 7.3 多按钮 + 动态可见性

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

### 7.4 自定义平铺数量

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

## 8. 常见问题 (FAQ)

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
