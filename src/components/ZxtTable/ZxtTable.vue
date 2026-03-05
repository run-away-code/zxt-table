<template>
  <div
    class="zxt-table-container"
    :class="{ 'zxt-table-container--full': height === 'full' }"
    :style="containerStyle"
  >
    <!-- 表格模式 -->
    <el-table
      ref="tableRef"
      :data="renderData"
      v-loading="loading"
      :height="tableHeight"
      v-bind="$attrs"
      :id="id"
      @sort-change="handleSortChange"
      @filter-change="handleFilterChange"
    >
      <template
        v-for="(column, index) in columns"
        :key="index"
      >
        <!-- 使用递归组件 ZxtTableColumn -->
        <ZxtTableColumn
          :column="column"
          :current-page="currentPage"
          :page-size="pageSize"
        >
          <!-- 透传插槽 -->
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
      </template>
    </el-table>

    <!-- 分页组件 -->
    <ZxtPagination
      v-if="pageable"
      :model-value="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="pageSizes"
      :total="total"
      :layout="paginationLayout"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
import { defineComponent, ref, computed, provide, onMounted, watch } from "vue";
import { ElTable } from "element-plus";
import ZxtPagination from "../ZxtPagination/ZxtPagination.vue";
import ZxtTableColumn from "./ZxtTableColumn.vue";

export default defineComponent({
  name: "ZxtTable",
  inheritAttrs: false,
  components: { ZxtPagination, ZxtTableColumn, ElTable },
  props: {
    // 表格唯一标识
    id: { type: String, default: "" },
    // 列配置
    columns: { type: Array, default: () => [] },
    // 表格数据
    data: { type: Array, default: () => [] },
    // 表格高度
    height: { type: [String, Number], default: "" },
    // 是否启用分页
    pageable: { type: Boolean, default: true },
    // 当前页码
    currentPage: { type: Number, default: 1 },
    // 每页显示条数
    pageSize: { type: Number, default: 10 },
    // 可选的分页大小
    pageSizes: { type: Array, default: () => [10, 20, 50, 100] },
    // 总条数
    total: { type: Number, default: 0 },
    // 分页布局
    paginationLayout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper",
    },
    // 服务端数据代理配置（参考 vxe-grid 的 proxyConfig 简化版）
    proxyConfig: {
      type: Object,
      default: null,
    },
    // 是否在挂载时自动加载数据（proxy 模式下）
    autoLoad: {
      type: Boolean,
      default: true,
    },
  },
  emits: [
    "page-change",
    "size-change",
    "sort-change",
    "filter-change",
    "loaded",
    "load-error",
    "update:row",
  ],
  setup(props, { emit }) {
    const tableRef = ref(null);
    const pageSize = ref(props.pageSize);
    const currentPage = ref(props.currentPage);
    const loading = ref(false);
    const innerData = ref([]);
    const innerTotal = ref(0);
    const sortState = ref({ prop: "", order: "" });
    const filtersState = ref({});
    const latestFormData = ref({});

    watch(() => props.currentPage, (val) => {
      currentPage.value = val;
    });
    watch(() => props.pageSize, (val) => {
      pageSize.value = val;
    });

    // 计算容器样式
    const containerStyle = computed(() => {
      if (props.height === "full") {
        return { height: "100%" };
      }
      return {};
    });

    // 计算表格高度（full 模式下不传固定高度，由 flex 控制）
    const tableHeight = computed(() => {
      if (props.height === "full") {
        return undefined; // flex 布局自动撑满
      }
      return props.height;
    });

    // 计算总条数（如果启用分页但没有传入 total，则使用 data 的长度）
    const usingProxy = computed(() => !!props.proxyConfig);

    const totalCount = computed(() => {
      if (usingProxy.value) return innerTotal.value;
      return props.total > 0 ? props.total : props.data.length;
    });

    const renderData = computed(() =>
      usingProxy.value ? innerData.value : props.data
    );

    // 处理每页条数变化
    const handleSizeChange = (params) => {
      if (usingProxy.value) {
        currentPage.value = params.page;
        pageSize.value = params.size;
        loadData();
      }
      emit("size-change", params);
    };

    // 处理当前页变化
    const handlePageChange = (params) => {
      if (usingProxy.value) {
        currentPage.value = params.page;
        pageSize.value = params.size;
        loadData();
      }
      emit("page-change", params);
    };

    // 排序变化
    const handleSortChange = ({ column, prop, order }) => {
      sortState.value = { prop, order };
      if (usingProxy.value) loadData();
      emit("sort-change", { column, prop, order });
    };

    // 过滤变化（Element Plus 传入对象）
    const handleFilterChange = (filters) => {
      filtersState.value = filters || {};
      if (usingProxy.value) loadData();
      emit("filter-change", filtersState.value);
    };

    // 服务端数据加载，overrides 可选传入 { formData, page, pageSize } 绕过 prop 时序问题
    const loadData = async (overrides) => {
      if (!usingProxy.value) return;
      const cfg = props.proxyConfig || {};
      const ajax = cfg.ajax?.query;
      if (typeof ajax !== "function") return;

      // 字段映射
      const reqProps = cfg.props || {};
      const pageField = reqProps.pageField || "page";
      const sizeField = reqProps.sizeField || "size";
      const sortField = reqProps.sortField || "sort";
      const orderField = reqProps.orderField || "order";
      const filtersField = reqProps.filtersField || "filters";

      if (overrides?.formData !== undefined) {
        latestFormData.value = overrides.formData;
      } else if (cfg._formData) {
        latestFormData.value = cfg._formData;
      }

      const baseParams = cfg.params || {};
      const payload = {
        [pageField]: {
          currentPage: overrides?.page ?? currentPage.value,
          pageSize: overrides?.pageSize ?? pageSize.value,
        },
        form: latestFormData.value,
        ...baseParams,
      };
      
      // 排序信息
      if (sortState.value?.prop) {
        payload[sortField] = sortState.value.prop;
        payload[orderField] = sortState.value.order;
      }
      
      // 过滤信息
      if (filtersState.value && Object.keys(filtersState.value).length) {
        payload[filtersField] = filtersState.value;
      }

      loading.value = true;
      try {
        const resp = await ajax(payload);
        const resProps = cfg.response || {};
        const listField = resProps.listField || "list";
        const totalField = resProps.totalField || "total";
        const transform = resProps.transform;

        let list = [];
        let total = 0;
        if (typeof transform === "function") {
          const out = transform(resp);
          list = out?.list ?? [];
          total = out?.total ?? 0;
        } else if (resp && typeof resp === "object") {
          list = resp?.[listField] ?? resp?.data ?? [];
          total = resp?.[totalField] ?? resp?.total ?? 0;
        }
        innerData.value = Array.isArray(list) ? list : [];
        innerTotal.value = Number(total) || 0;
        emit("loaded", {
          data: innerData.value,
          total: innerTotal.value,
          payload,
        });
      } catch (err) {
        emit("load-error", err);
      } finally {
        loading.value = false;
      }
    };

    // 行内更新（供 cellRender 调用）
    const updateRow = (newRow, index) => {
      if (usingProxy.value) {
        innerData.value.splice(index, 1, newRow);
      } else {
        // 非代理模式，直接修改 props.data（需父组件配合 .sync 或 v-model）
        emit("update:row", { index, row: newRow });
      }
    };

    // 提供 updateRow 给子组件
    provide("updateRow", updateRow);

    // 初始化加载数据
    onMounted(() => {
      if (usingProxy.value && props.autoLoad) {
        loadData();
      }
    });

    // 暴露方法给父组件
    const getTableRef = () => tableRef.value;
    const getSelectedRows = () => tableRef.value?.getSelectionRows?.() || [];
    const reload = (overrides) => loadData(overrides);

    return {
      tableRef,
      containerStyle,
      tableHeight,
      getTableRef,
      pageSize,
      currentPage,
      loading,
      renderData,
      total: totalCount,
      pageSizes: computed(() => props.pageSizes),
      paginationLayout: computed(() => props.paginationLayout),
      handleSizeChange,
      handlePageChange,
      handleSortChange,
      handleFilterChange,
      reload,
      getSelectedRows,
      updateRow,
    };
  },
});
</script>

<style scoped>
.zxt-table-container {
  width: 100%;
}

/* 全高度模式 */
.zxt-table-container--full {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.zxt-table-container--full :deep(.el-table) {
  flex: 1;
  min-height: 0; /* 重要：允许表格收缩 */
}

.zxt-table-container--full :deep(.el-table__inner-wrapper) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.zxt-table-container--full :deep(.el-table__body-wrapper) {
  flex: 1;
  overflow: auto;
}

.zxt-table-container--full :deep(.el-table__empty-block) {
  height: 100%;
}

/* 表格整体样式覆盖 */
:deep(.el-table) {
  --el-table-header-bg-color: #f8f8f9; /* 浅灰表头背景 */
  --el-table-header-text-color: #333333; /* 表头文字颜色 */
  --el-table-text-color: #606266; /* 内容文字颜色 */
  --el-table-border-color: #ebeef5; /* 边框颜色 */
  --el-table-row-hover-bg-color: #f5f7fa; /* 悬停背景 */
}

/* 表头单元格 */
:deep(.el-table th.el-table__cell) {
  background-color: var(--el-table-header-bg-color) !important;
  color: var(--el-table-header-text-color);
  font-weight: 600;
  height: 48px;
  padding: 6px 0;
}

/* 内容单元格 */
:deep(.el-table td.el-table__cell) {
  padding: 8px 0;
}

/* 单元格内的文字容器 */
:deep(.el-table .cell) {
  line-height: 24px;
  padding: 0 12px;
}

/* 链接样式优化 */
:deep(.el-link.el-link--default),
:deep(.el-link.el-link--primary) {
  --el-link-text-color: #409eff;
  color: #409eff;
  font-weight: 400;
}

:deep(.el-link:hover) {
  color: #66b1ff;
  text-decoration: none; /* 去掉下划线，保持清爽 */
}

/* 针对操作列按钮的样式优化 */
:deep(.el-button--primary.is-link),
:deep(.el-button--primary.is-text) {
  color: #409eff;
}

/* 斑马纹 */
:deep(
    .el-table--striped
      .el-table__body
      tr.el-table__row--striped
      td.el-table__cell
  ) {
  background-color: #fafafa;
}

/* 表格内的 Tag 样式优化 */
:deep(.el-table .el-tag) {
  border-radius: 4px;
  height: 24px;
  line-height: 22px;
  padding: 0 8px;
}

/* 树形表格展开图标样式 - 去除 focus 边框 */
:deep(.el-table__expand-icon) {
  outline: none;
  border: none;
}

:deep(.el-table__expand-icon:focus),
:deep(.el-table__expand-icon:focus-visible) {
  outline: none;
  box-shadow: none;
  border: none;
}

:deep(.el-table__expand-icon .el-icon) {
  outline: none;
}

:deep(.el-table__expand-icon .el-icon:focus),
:deep(.el-table__expand-icon .el-icon:focus-visible) {
  outline: none;
  box-shadow: none;
}
</style>
