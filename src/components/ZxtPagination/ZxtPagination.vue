<template>
  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :page-sizes="pageSizes"
    :total="total"
    :layout="layout"
    class="zxt-pagination"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import { ElPagination } from "element-plus";

export default defineComponent({
  name: "ZxtPagination",
  components: { ElPagination },
  props: {
    // 当前页码
    modelValue: { type: Number, default: 1 },
    // 每页显示条数
    pageSize: { type: Number, default: 10 },
    // 可选的分页大小
    pageSizes: { type: Array, default: () => [10, 20, 50, 100] },
    // 总条数
    total: { type: Number, default: 0 },
    // 分页布局
    layout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper",
    },
  },
  emits: ["update:modelValue", "update:pageSize", "page-change", "size-change"],
  setup(props, { emit }) {
    const currentPage = ref(props.modelValue);
    const pageSize = ref(props.pageSize);

    // 监听 props 变化并同步到内部状态
    watch(
      () => props.modelValue,
      (newVal) => {
        currentPage.value = newVal;
      }
    );

    watch(
      () => props.pageSize,
      (newVal) => {
        pageSize.value = newVal;
      }
    );

    // 处理每页条数变化
    const handleSizeChange = (size) => {
      pageSize.value = size;
      currentPage.value = 1;
      emit("update:pageSize", size);
      emit("size-change", { page: currentPage.value, size });
    };

    // 处理当前页变化
    const handleCurrentChange = (page) => {
      currentPage.value = page;
      emit("update:modelValue", page);
      emit("page-change", { page, size: pageSize.value });
    };

    return {
      currentPage,
      pageSize,
      handleSizeChange,
      handleCurrentChange,
    };
  },
});
</script>

<style scoped>
.zxt-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  /* 重新定义局部主色变量，影响内部能够继承变量的组件 */
  --el-color-primary: #ff3a33;
  /* 覆盖 hover 颜色变量 */
  --el-pagination-hover-color: #ff3a33;
}

/* ------------------- 页码部分 ------------------- */

/* 选中页码文字颜色 */
:deep(.el-pager li.is-active) {
  color: #ff3a33 !important;
}

/* 兼容 background 模式的选中背景色 */
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #ff3a33 !important;
  color: #fff;
}

/* 页码 Hover 颜色 */
:deep(.el-pager li:hover) {
  color: #ff3a33 !important;
}

/* ------------------- Sizes 选择器部分 ------------------- */

/* 1. 输入框 Focus 状态 (点击后) */
:deep(.el-pagination__sizes .el-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 1px #ff3a33 inset !important;
}

/* 2. 输入框 Hover 状态 */
:deep(.el-pagination__sizes .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #ff3a33 inset !important;
}
</style>

<style>
/* 下拉菜单选中项颜色 */
.el-select-dropdown__item.is-selected {
  color: #ff3a33 !important;
}
</style>
