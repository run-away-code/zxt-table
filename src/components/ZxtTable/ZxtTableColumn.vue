<template>
  <!-- 1. 如果有 children，递归渲染多级表头 -->
  <el-table-column
    v-if="normalizedColumn.children && normalizedColumn.children.length"
    v-bind="columnProps"
    :key="normalizedColumn.prop + '-group'"
  >
    <ZxtTableColumn
      v-for="(child, index) in normalizedColumn.children"
      :key="index"
      :column="child"
      :current-page="currentPage"
      :page-size="pageSize"
    >
      <!-- 递归透传插槽 -->
      <template
        v-for="(_, name) in $slots"
        #[name]="slotData"
      >
        <slot
          :name="name"
          v-bind="slotData"
        />
      </template>
    </ZxtTableColumn>
  </el-table-column>

  <!-- 2. 常规列渲染 -->
  <el-table-column
    v-else
    v-bind="columnProps"
    :key="normalizedColumn.prop"
    :index="normalizedColumn.indexMethod || defaultIndexMethod"
  >
    <template #default="scope" v-if="!['selection', 'index'].includes(normalizedColumn.type) && (normalizedColumn.type !== 'expand' || normalizedColumn.slot)">
      <!-- 2.1 插槽 (优先级最高) -->
      <template v-if="normalizedColumn.slot">
        <slot
          :name="normalizedColumn.slot"
          :row="scope.row"
          :index="scope.$index"
          :column="normalizedColumn"
        />
      </template>
      <!-- 2.2 cellRender (自定义渲染器) -->
      <template v-else-if="normalizedColumn.cellRender">
        <component :is="renderCell(scope)" />
      </template>
      <!-- 2.3 formatter (格式化函数) -->
      <template v-else-if="normalizedColumn.formatter">
        {{
          normalizedColumn.formatter(
            scope.row,
            normalizedColumn,
            scope.row[normalizedColumn.prop],
            scope.$index
          )
        }}
      </template>
      <!-- 2.4 默认文本 -->
      <template v-else>
        {{ scope.row[normalizedColumn.prop] }}
      </template>
    </template>
  </el-table-column>
</template>

<script>
import { defineComponent, inject, computed } from "vue";
import { ElTableColumn } from "element-plus";
import { resolveCellRender } from "./cellRenderer";

export default defineComponent({
  name: "ZxtTableColumn",
  components: { ElTableColumn },
  props: {
    column: {
      type: Object,
      required: true,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
  },
  setup(props) {
    // 注入父组件提供的方法
    const updateRow = inject("updateRow", () => {});

    // 默认的序号计算方法：(当前页 - 1) * 每页条数 + 当前行索引 + 1
    const defaultIndexMethod = (index) => {
      const { currentPage, pageSize } = props;
      return (currentPage - 1) * pageSize + index + 1;
    };

    // 标准化列配置（兼容 field/title 写法）
    const normalizedColumn = computed(() => {
      const col = props.column;
      return {
        ...col,
        prop: col.prop ?? col.field, // 优先使用 prop，兼容 field
        label: col.label ?? col.title, // 优先使用 label，兼容 title
      };
    });

    // 列属性（排除 children，因为 el-table-column 的 children 是只读的）
    const columnProps = computed(() => {
      const { children, ...rest } = normalizedColumn.value;
      return rest;
    });

    // 封装渲染逻辑
    const renderCell = (scope) => {
      const col = normalizedColumn.value;
      // 获取原始值
      const rawValue = scope.row[col.prop];

      // 安全处理：如果是 undefined 或 null，且使用了输入类组件，最好转为空字符串
      // 也可以在这里支持 column.defaultValue 配置
      const safeValue =
        rawValue === undefined || rawValue === null
          ? col.defaultValue ?? ""
          : rawValue;

      return resolveCellRender(col.cellRender, {
        row: scope.row,
        column: col,
        rowIndex: scope.$index,
        cellValue: safeValue,
        updateRow: (newRow) => updateRow(newRow, scope.$index),
      });
    };

    return {
      normalizedColumn,
      columnProps,
      renderCell,
      defaultIndexMethod,
    };
  },
});
</script>
