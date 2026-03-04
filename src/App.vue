<script setup>
import { ref, computed } from "vue";
import ZxtTable from "./components/ZxtTable/ZxtTable.vue";

const columns = ref([
  { prop: "name", label: "姓名" },
  { prop: "age", label: "年龄" },
  { prop: "address", label: "地址" },
  {
    prop: "status",
    label: "状态",
    formatter: (row, column, cellValue) => {
      return cellValue === 1 ? "启用" : "禁用";
    },
  },
  {
    prop: "createdAt",
    label: "创建时间",
    formatter: (row, column, cellValue) => {
      return new Date(cellValue).toLocaleDateString();
    },
  },
  { prop: "action", label: "操作", slot: "action" },
]);

const tableData = ref(
  Array.from({ length: 100 }, (_, i) => ({
    name: `用户 ${i + 1}`,
    age: Math.floor(Math.random() * 40) + 20,
    address: `地址 ${i + 1}`,
    status: i % 2 === 0 ? 1 : 0,
    createdAt: new Date(Date.now() - Math.random() * 10000000000),
  }))
);

const currentPage = ref(1);
const pageSize = ref(10);

const displayedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tableData.value.slice(start, end);
});

const handlePageChange = (params) => {
  currentPage.value = params.page;
};

const handleSizeChange = (params) => {
  pageSize.value = params.size;
};

const handleEdit = (row) => {
  console.log("编辑:", row);
};

const handleDelete = (row) => {
  console.log("删除:", row);
};
</script>

<template>
  <ZxtTable
    :columns="columns"
    :data="displayedData"
    :total="tableData.length"
    :current-page="currentPage"
    :page-size="pageSize"
    @page-change="handlePageChange"
    @size-change="handleSizeChange"
  >
    <template #action="{ row }">
      <el-button
        type="primary"
        size="small"
        @click="handleEdit(row)"
        >编辑</el-button
      >
      <el-button
        type="danger"
        size="small"
        @click="handleDelete(row)"
        >删除</el-button
      >
    </template>
  </ZxtTable>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
