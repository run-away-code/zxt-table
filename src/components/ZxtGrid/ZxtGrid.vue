<template>
  <div
    class="zxt-grid-container"
    :class="{ 'zxt-grid-container--full': gridOptions.height === 'full' }"
  >
    <!-- 搜索表单 -->
    <div
      v-if="gridOptions.formConfig && isFormVisible"
      class="grid-search-form"
    >
      <ZxtForm
        ref="searchFormRef"
        :form-columns="searchFormColumns"
        :initial-form-data="gridOptions.formConfig.data"
        :rules="gridOptions.formConfig.rules"
        @submit="handleSearchSubmit"
        @reset="handleSearchReset"
      >
        <!-- 搜索按钮插槽 -->
        <template #search-actions>
          <div class="search-btn-group">
            <el-button
              class="btn-search"
              :icon="Search"
              @click="handleSearch"
            >
              查询
            </el-button>
            <el-button
              class="btn-reset"
              :icon="Refresh"
              @click="handleReset"
            >
              重置
            </el-button>
          </div>
        </template>
        <!-- 透传表单相关插槽 -->
        <template
          v-for="(_, name) in formFilteredSlots"
          :key="name"
          #[name]="slotData"
        >
          <slot
            :name="name"
            v-bind="slotData"
          />
        </template>
      </ZxtForm>
    </div>

    <!-- 表格模式 -->
    <div class="grid-table-wrapper">
      <!-- 工具栏 -->
      <div
        v-if="gridOptions.toolbar"
        class="grid-toolbar"
      >
        <template
          v-for="(btn, index) in gridOptions.toolbar.buttons"
          :key="index"
        >
          <el-button
            :type="btn.type || 'default'"
            :size="btn.size || 'small'"
            :icon="getIconComponent(btn.icon)"
            :disabled="btn.disabled"
            @click="handleToolbarClick(btn.code, btn)"
          >
            {{ btn.name }}
          </el-button>
        </template>

        <!-- 工具栏插槽 -->
        <slot
          name="toolbar"
          :grid="$refs.gridRef"
        />
      </div>

      <!-- 表格 -->
      <ZxtTable
        ref="gridRef"
        v-bind="{ ...tableProps, ...attrs }"
        :id="gridOptions.id"
        :columns="mergedColumns"
        :data="tableData"
        :height="gridOptions.height"
        :pageable="gridOptions.pageable !== false"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="gridOptions.pageSizes"
        :total="total"
        :pagination-layout="gridOptions.paginationLayout"
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
      >
        <!-- 操作列自动渲染 -->
        <template
          v-if="actionColumnConfig"
          #__action__="{ row }"
        >
          <ActionColumn
            :buttons="actionColumnConfig.buttons"
            :row="row"
            :max-visible="actionColumnConfig.maxVisible || 2"
            @action-click="handleActionClick"
          />
        </template>

        <!-- 透传表格相关插槽 -->
        <template
          v-for="(_, name) in tableFilteredSlots"
          :key="name"
          #[name]="slotData"
        >
          <slot
            :name="name"
            v-bind="slotData"
          />
        </template>
      </ZxtTable>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch, useAttrs, useSlots } from "vue";
import { ElMessage } from "element-plus";
import {
  Plus,
  Delete,
  Refresh,
  Download,
  Search,
  Edit,
  View,
  Upload,
  Setting,
} from "@element-plus/icons-vue";
import ZxtTable from "../ZxtTable/ZxtTable.vue";
import ZxtForm from "../ZxtForm/ZxtForm.vue";
import ActionColumn from "./ActionColumn.vue";

export default defineComponent({
  name: "ZxtGrid",
  inheritAttrs: false,
  components: {
    ZxtTable,
    ZxtForm,
    ActionColumn,
    Plus,
    Delete,
    Refresh,
    Download,
    Search,
    Edit,
    View,
    Upload,
    Setting,
  },
  props: {
    // 网格配置选项
    gridOptions: {
      type: Object,
      default: () => ({
        id: "grid",
        columns: [],
        data: [],
        height: 400,
        pageable: true,
        pageSizes: [10, 20, 50, 100],
        paginationLayout: "total, sizes, prev, pager, next, jumper",
        toolbar: null,
        formMode: false,
        formColumns: [],
        rules: {},
      }),
    },
    // 外部传入的数据
    externalData: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["toolbar-click", "action-click", "submit", "reset", "page-change", "size-change"],
  setup(props, { emit, expose }) {
    const attrs = useAttrs();
    const slots = useSlots();
    const gridRef = ref(null);
    const searchFormRef = ref(null);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const internalData = ref(null);
    const isFormVisible = ref(props.gridOptions.formMode !== false);
    const proxyFormData = ref({});

    // 图标组件映射
    const iconMap = {
      Plus,
      Delete,
      Refresh,
      Download,
      Search,
      Edit,
      View,
      Upload,
      Setting,
    };

    // 操作列配置：从 columns 中提取 actionColumn
    const actionColumnConfig = computed(() => {
      const cols = props.gridOptions.columns || [];
      const actionCol = cols.find((col) => col.actionColumn);
      return actionCol ? actionCol.actionColumn : null;
    });

    // 合并列配置：将 actionColumn 转换为带内部插槽标记的列
    const mergedColumns = computed(() => {
      const cols = props.gridOptions.columns || [];
      return cols.map((col) => {
        if (col.actionColumn) {
          return {
            ...col,
            slot: "__action__",
            actionColumn: undefined,
          };
        }
        return col;
      });
    });

    // 操作列按钮点击
    const handleActionClick = (payload) => {
      emit("action-click", payload);
    };

    // 搜索表单列配置
    const searchFormColumns = computed(() => {
      const config = props.gridOptions.formConfig;
      if (!config || !config.items) return [];

      const columns = [...config.items];
      // 如果没有自定义操作列，且需要显示按钮，则添加操作列
      const hasActionCol = columns.some(
        (col) => col.type === "slot" && col.slotName === "search-actions"
      );

      if (!hasActionCol) {
        columns.push({
          type: "slot",
          slotName: "search-actions",
          span: 6,
          labelWidth: "0px",
          isAction: true,
          ...config.actionConfig,
        });
      }
      return columns;
    });

    const formSlotNames = computed(() => {
      const names = new Set(['search-actions']);
      (searchFormColumns.value || []).forEach(col => {
        if (col.type === 'slot') {
          names.add(col.slotName || col.prop);
        }
      });
      return names;
    });

    const formFilteredSlots = computed(() => {
      const result = {};
      for (const name in slots) {
        if (name === 'search-actions' || name === 'toolbar') continue;
        if (formSlotNames.value.has(name) || name.startsWith('form-')) {
          result[name] = slots[name];
        }
      }
      return result;
    });

    const tableFilteredSlots = computed(() => {
      const result = {};
      for (const name in slots) {
        if (name === 'toolbar') continue;
        if (!formSlotNames.value.has(name) && !name.startsWith('form-')) {
          result[name] = slots[name];
        }
      }
      return result;
    });

    // 搜索表单处理
    const handleSearch = () => {
      searchFormRef.value?.submitForm();
    };

    const handleSearchSubmit = (formData) => {
      emit("submit", formData);

      if (props.gridOptions.proxyConfig) {
        proxyFormData.value = { ...formData };
        currentPage.value = 1;
        gridRef.value?.reload?.({ formData: proxyFormData.value, page: 1 });
      }
    };

    const handleReset = () => {
      searchFormRef.value?.resetForm();
    };

    const handleSearchReset = () => {
      emit("reset");

      if (props.gridOptions.proxyConfig) {
        proxyFormData.value = {};
        currentPage.value = 1;
        gridRef.value?.reload?.({ formData: {}, page: 1 });
      }
    };

    // 获取图标组件
    const getIconComponent = (iconName) => {
      if (!iconName) return undefined;
      // 如果已经是组件，直接返回
      if (typeof iconName === "object" || typeof iconName === "function") {
        return iconName;
      }
      // 如果是字符串，从映射中查找
      return iconMap[iconName];
    };

    // 计算透传给 ZxtTable 的 proxyConfig（附加表单数据）
    const resolvedProxyConfig = computed(() => {
      const cfg = props.gridOptions.proxyConfig;
      if (!cfg) return null;
      return {
        ...cfg,
        _formData: proxyFormData.value,
      };
    });

    // 计算透传给 ZxtTable 的属性
    const tableProps = computed(() => {
      const {
        formConfig,
        toolbar,
        formMode,
        formColumns,
        rules,
        data,
        proxyConfig,
        ...others
      } = props.gridOptions;
      return {
        ...others,
        proxyConfig: resolvedProxyConfig.value || proxyConfig || null,
      };
    });

    // 合并数据和配置
    const tableData = computed(() => {
      if (internalData.value !== null) {
        return internalData.value;
      }
      return props.externalData.length > 0
        ? props.externalData
        : props.gridOptions.data || [];
    });

    const usingProxy = computed(() => !!props.gridOptions.proxyConfig);

    // 计算总条数（非代理模式下由本地数据决定，代理模式下交由 ZxtTable 内部处理）
    const total = computed(() => {
      if (usingProxy.value) {
        return 0;
      }
      return tableData.value.length;
    });

    // 处理工具栏按钮点击
    const handleToolbarClick = (code, button) => {
      emit("toolbar-click", { code, button, grid: gridRef.value });

      // 内置操作
      switch (code) {
        case "add":
          handleAdd();
          break;
        case "delete":
          handleDelete();
          break;
        case "refresh":
          handleRefresh();
          break;
        case "export":
          handleExport();
          break;
        default:
          // 自定义操作
          break;
      }
    };

    // 内置操作函数
    const handleAdd = () => {
      // 切换到表单模式
      isFormVisible.value = true;
    };

    const handleDelete = () => {
      const selectedRows =
        gridRef.value?.getTableRef()?.getSelectionRows?.() || [];
      if (selectedRows.length === 0) {
        ElMessage.warning("请先选择要删除的数据");
        return;
      }
      ElMessage.success(`删除 ${selectedRows.length} 条数据`);
    };

    const handleRefresh = () => {
      ElMessage.success("刷新数据");
      // 这里可以实现数据刷新逻辑
      gridRef.value?.reload?.();
    };

    const handleExport = () => {
      ElMessage.success("导出数据");
      // 这里可以实现数据导出逻辑
    };

    // 表格/表单事件处理
    const handleSubmit = (formData) => {
      emit("submit", formData);
      // 提交成功后是否切回表格？通常由父组件控制，这里先不做自动切换，或者提供一个配置
    };

    const handleFormReset = () => {
      emit("reset");
    };

    const handleFormCancel = () => {
      isFormVisible.value = false;
    };

    const handlePageChange = (params) => {
      currentPage.value = params.page;
      emit("page-change", params);
    };

    const handleSizeChange = (params) => {
      pageSize.value = params.size;
      emit("size-change", params);
    };

    // 暴露方法给父组件
    const getGridRef = () => gridRef.value;
    const getFormRef = () => searchFormRef.value;
    const getSelectedRows = () => {
      return gridRef.value?.getTableRef()?.getSelectionRows?.() || [];
    };
    const reloadData = (data) => {
      internalData.value = data ?? null;
    };
    const setFormVisible = (visible) => {
      isFormVisible.value = visible;
    };

    // commitProxy 方法，模拟 vxe-grid 的 API
    const commitProxy = (type, ...args) => {
      const formData = proxyFormData.value;
      switch (type) {
        case 'query':
          currentPage.value = 1;
          gridRef.value?.reload?.({ formData, page: 1 });
          break;
        case 'reload':
          gridRef.value?.reload?.({ formData });
          break;
        default:
          console.warn(`[ZxtGrid] commitProxy: unknown type "${type}"`);
      }
    };

    // 监听配置变化 (如果外部强制改变 mode)
    watch(
      () => props.gridOptions.formMode,
      (newMode) => {
        if (newMode !== undefined) {
          isFormVisible.value = newMode;
        }
      }
    );

    const getElTableRef = () => gridRef.value?.getTableRef?.();

    expose({
      getGridRef,
      getFormRef,
      getElTableRef,
      getSelectedRows,
      reloadData,
      setFormVisible,
      commitProxy,
      clearSelection: () => getElTableRef()?.clearSelection(),
      toggleRowSelection: (...args) => getElTableRef()?.toggleRowSelection(...args),
      toggleAllSelection: () => getElTableRef()?.toggleAllSelection(),
      toggleRowExpansion: (...args) => getElTableRef()?.toggleRowExpansion(...args),
      setCurrentRow: (...args) => getElTableRef()?.setCurrentRow(...args),
      clearSort: () => getElTableRef()?.clearSort(),
      clearFilter: (...args) => getElTableRef()?.clearFilter(...args),
      doLayout: () => getElTableRef()?.doLayout(),
      sort: (...args) => getElTableRef()?.sort(...args),
    });

    return {
      attrs,
      gridRef,
      searchFormRef,
      currentPage,
      pageSize,
      tableData,
      tableProps,
      mergedColumns,
      actionColumnConfig,
      total,
      isFormVisible,
      searchFormColumns,
      formFilteredSlots,
      tableFilteredSlots,
      getIconComponent,
      handleToolbarClick,
      handleActionClick,
      handleSubmit,
      handleFormReset,
      handleFormCancel,
      handlePageChange,
      handleSizeChange,
      handleSearch,
      handleSearchSubmit,
      handleReset,
      handleSearchReset,
      Search,
      Refresh,
    };
  },
});
</script>

<style scoped>
.zxt-grid-container {
  --zxt-primary-color: #fa2314;
  --zxt-primary-hover: #fb4f43;
  --zxt-primary-active: #e12012;
  width: 100%;
}

/* 全高度模式 */
.zxt-grid-container--full {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.zxt-grid-container--full .grid-table-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.zxt-grid-container--full .zxt-table-container {
  flex: 1;
  min-height: 0;
}

.grid-search-form {
  padding: 10px;
  padding-bottom: 6px;
  border-radius: 4px;
}

.search-btn-group {
  display: flex;
  gap: 10px;
}

.grid-toolbar {
  margin-bottom: 10px;
  padding: 10px;
  padding-top: 0px;
  border-radius: 4px;
  display: flex;
  gap: 10px;
  align-items: center;
}

/* 查询按钮样式 */
.btn-search {
  background-color: #fff;
  border-color: var(--zxt-primary-color);
  color: var(--zxt-primary-color);
}

.btn-search:hover,
.btn-search:focus,
.btn-search:active {
  background-color: #fff;
}

.btn-search:hover,
.btn-search:focus {
  border-color: var(--zxt-primary-hover);
  color: var(--zxt-primary-hover);
  outline: none;
}

.btn-search.el-button:focus,
.btn-search.el-button:focus-visible {
  background-color: #fff;
  border-color: var(--zxt-primary-hover);
  color: var(--zxt-primary-hover);
  outline: none;
}

.btn-search:active,
.btn-search.el-button:active {
  background-color: #fff;
  border-color: var(--zxt-primary-active);
  color: var(--zxt-primary-active);
}

/* 重置按钮样式 */
.btn-reset {
  background-color: #fff;
  border-color: #dddddd;
  color: #111111;
}

.btn-reset:hover,
.btn-reset:focus,
.btn-reset:active {
  background-color: #fff;
}

.btn-reset:focus,
.btn-reset.el-button:focus,
.btn-reset.el-button:focus-visible {
  border-color: #dddddd;
  color: #111111;
  outline: none;
}

.btn-reset:hover,
.btn-reset.el-button:hover {
  border-color: var(--zxt-primary-hover);
  color: var(--zxt-primary-hover);
}

.btn-reset:active,
.btn-reset.el-button:active {
  background-color: #fff;
  border-color: var(--zxt-primary-active);
  color: var(--zxt-primary-active);
}
</style>
