<script setup>
import { reactive } from "vue";
import { ElMessage } from "element-plus";
import { ZxtGrid } from "zxt-table";
import "zxt-table/style.css";
import "element-plus/dist/index.css";

const listApi = async ({ page }) => {
  const all = [
    { id: 1, name: "张伟", status: 1, joinDate: "2023-05-01" },
    { id: 2, name: "李娜", status: 0, joinDate: "2023-06-15" },
    { id: 3, name: "王强", status: 1, joinDate: "2023-07-20" },
  ];
  const currentPage = page?.currentPage ?? 1;
  const pageSize = page?.pageSize ?? 10;
  const start = (currentPage - 1) * pageSize;
  return {
    list: all.slice(start, start + pageSize),
    total: all.length,
  };
};

const gridOptions = reactive({
  id: "smoke-grid",
  height: "full",
  pageSizes: [5, 10, 20],
  paginationLayout: "total, sizes, prev, pager, next, jumper",
  proxyConfig: {
    ajax: { query: listApi },
  },
  columns: [
    { prop: "id", label: "ID", width: "80", align: "center" },
    { prop: "name", label: "姓名", width: "120" },
    {
      prop: "status",
      label: "状态",
      width: "100",
      align: "center",
    },
    { prop: "joinDate", label: "入职日期", width: "140", align: "center" },
    {
      label: "操作",
      width: "220",
      fixed: "right",
      align: "center",
      actionColumn: {
        maxVisible: 2,
        buttons: [
          { label: "编辑", type: "primary" },
          { label: "删除", type: "danger" },
          { label: "查看", },
          { label: "复制", visible: (row) => row.status === 1 },
        ],
      },
    },
  ],
});

const handleActionClick = ({ code, row }) => {
  ElMessage.info(`${code} - row.id=${row.id}`);
};
</script>

<template>
  <div style="height: 500px; padding: 16px; box-sizing: border-box;">
    <ZxtGrid
      :grid-options="gridOptions"
      row-key="id"
      @action-click="handleActionClick"
    />
  </div>
</template>