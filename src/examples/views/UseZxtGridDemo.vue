<template>
  <div class="demo-page">
    <div class="demo-content">
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
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { ElMessage } from "element-plus";
import ZxtGrid from "../../components/ZxtGrid/ZxtGrid.vue";
import { useZxtGrid } from "../../hooks/useZxtGrid";

const gridData = [
  { id: 1, name: "张伟", age: 28, email: "zhangwei@test.com", phone: "13812345678", status: 1, address: "北京市朝阳区", joinDate: "2023-05-01" },
  { id: 2, name: "李娜", age: 26, email: "lina@test.com", phone: "13987654321", status: 0, address: "上海市浦东新区", joinDate: "2023-06-15" },
  { id: 3, name: "王强", age: 32, email: "wangqiang@test.com", phone: "13700001111", status: 1, address: "广州市天河区", joinDate: "2023-07-20" },
];

function mockListApi(payload) {
  console.log("[useZxtGrid Demo 请求入参]", payload);
  return new Promise((resolve) => {
    setTimeout(() => {
      const { page = {}, form = {} } = payload;
      const currentPage = page.currentPage ?? 1;
      const pageSize = page.pageSize ?? 10;

      let list = [...gridData];
      if (form.name) list = list.filter((r) => r.name.includes(form.name));
      if (form.status !== "" && form.status !== undefined && form.status !== null) {
        list = list.filter((r) => r.status === form.status);
      }

      const total = list.length;
      const start = (currentPage - 1) * pageSize;
      resolve({ list: list.slice(start, start + pageSize), total });
    }, 300);
  });
}

const { gridRef, gridOptions, query, setFormData, getSelectedRows } = useZxtGrid({
  id: "hook-demo-grid",
  fetchApi: mockListApi,
  autoLoad: false,
  pageSizes: [5, 10, 20],

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

  toolbarButtons: [
    { code: "add", name: "新增", type: "primary", icon: "Plus" },
    { code: "delete", name: "删除", type: "danger", icon: "Delete" },
    { code: "refresh", name: "刷新", type: "default", icon: "Refresh" },
  ],

  columns: [
    { prop: "id", label: "ID", width: "80", align: "center" },
    { prop: "name", label: "姓名", width: "120" },
    { prop: "age", label: "年龄", width: "80", align: "center" },
    {
      label: "联系方式",
      align: "center",
      children: [
        { prop: "email", label: "邮箱", width: "200" },
        { prop: "phone", label: "电话", width: "140", align: "center" },
      ],
    },
    { prop: "status", label: "状态", width: "80", slot: "status", align: "center" },
    { prop: "address", label: "地址" },
    { prop: "joinDate", label: "入职日期", width: "120", align: "center" },
    {
      label: "操作", width: "220", fixed: "right", align: "center",
      actionColumn: {
        maxVisible: 2,
        buttons: [
          { label: "编辑", type: "primary", code: "edit" },
          { label: "删除", type: "danger", code: "delete" },
          { label: "查看", icon: "View", code: "view" },
        ],
      },
    },
  ],
});

onMounted(() => {
  const params = new URLSearchParams(location.search);
  const status = params.get("status");
  if (status !== null) {
    setFormData({ status: Number(status) });
  } else {
    query();
  }
});

const handleToolbarClick = ({ code }) => {
  switch (code) {
    case "add":
      ElMessage.success("新增");
      break;
    case "delete": {
      const rows = getSelectedRows();
      if (!rows.length) return ElMessage.warning("请先选择数据");
      ElMessage.success(`删除 ${rows.length} 条`);
      break;
    }
    case "refresh":
      query();
      break;
  }
};

const handleActionClick = ({ code, row }) => {
  ElMessage.info(`${code}: ${row.name}`);
};
</script>

<style scoped>
.demo-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f5f7fa;
}

.demo-content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
</style>
