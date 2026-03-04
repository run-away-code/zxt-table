<template>
  <div class="example-section">
    <ZxtGrid
      ref="gridRef"
      :grid-options="gridOptions"
      row-key="id"
      default-expand-all
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
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import ZxtGrid from "../../components/ZxtGrid/ZxtGrid.vue";

const gridRef = ref(null);
const treeData = ref([
  { id: 1, name: "张伟", age: 28, email: "zhangwei@test.com", phone: "13812345678", status: 1, address: "北京市朝阳区", joinDate: "2023-05-01" },
  { id: 2, name: "李娜", age: 26, email: "lina@test.com", phone: "13987654321", status: 0, address: "上海市浦东新区", joinDate: "2023-06-15" },
  { id: 3, name: "王强", age: 32, email: "wangqiang@test.com", phone: "13700001111", status: 1, address: "广州市天河区", joinDate: "2023-07-20" },
]);

const gridOptions = reactive({
  id: "demo-grid",
  border: true,
  stripe: false,
  toolbar: {
    buttons: [
      { code: "add", name: "新增", type: "primary", size: "small", icon: "Plus" },
      { code: "delete", name: "删除", type: "danger", size: "small", icon: "Delete" },
      { code: "refresh", name: "刷新", type: "default", size: "small", icon: "Refresh" },
      { code: "export", name: "导出", type: "success", size: "small", icon: "Download" },
    ],
  },
  columns: [
    { prop: "id", label: "ID", width: "80", align: "center" },
    { prop: "name", label: "名称", width: "180" },
    { prop: "age", label: "年龄", width: "80", align: "center" },
    {
      label: "联系方式",
      align: "center",
      children: [
        { prop: "email", label: "邮箱", width: "200" },
        { prop: "phone", label: "电话", width: "140", align: "center" },
      ],
    },
    {
      prop: "status",
      label: "状态",
      width: "80",
      slot: "status",
      align: "center",
    },
    { prop: "address", label: "地址" },
    { prop: "joinDate", label: "入职日期", width: "120", align: "center" },
    {
      label: "操作",
      width: "220",
      fixed: "right",
      align: "center",
      actionColumn: {
        maxVisible: 2,
        buttons: [
          { label: "编辑", type: "primary", code: "edit" },
          { label: "删除", type: "danger", code: "delete" },
          { label: "查看", icon: "View", code: "view" },
          { label: "复制", icon: "CopyDocument", code: "copy" },
        ],
      },
    },
  ],
  data: treeData.value,
  pageable: true,
  pageSizes: [5, 10, 20, 50],
  paginationLayout: "total, sizes, prev, pager, next, jumper",
  height: "full",
  formMode: false,
  formConfig: {
    data: {
      name: "",
      status: "",
      createDate: "",
      updateDate: [],
    },
    items: [
      {
        prop: "name",
        label: "姓名",
        span: 6,
      },
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
      {
        prop: "updateDate",
        label: "更新时间",
        span: 12,
        type: "daterange",
        startPlaceholder: "开始",
        endPlaceholder: "结束",
        valueFormat: "YYYY-MM-DD",
      },
      {
        prop: "createDate",
        label: "创建日期",
        span: 6,
        type: "date",
        valueFormat: "YYYY-MM-DD",
      },
    ],
  },
  initialFormData: {},
  rules: {},
});

const handleToolbarClick = ({ code, button }) => {
  ElMessage.info(`点击了工具栏按钮: ${button.name} (${code})`);
  switch (code) {
    case "add":
      ElMessage.success("执行添加操作");
      break;
    case "delete":
      const selectedRows = gridRef.value?.getSelectedRows() || [];
      if (selectedRows.length === 0) {
        ElMessage.warning("请先选择要删除的数据");
      } else {
        ElMessage.success(`准备删除 ${selectedRows.length} 条数据`);
      }
      break;
    case "refresh":
      ElMessage.success("正在刷新数据...");
      gridRef.value?.reload?.();
      break;
    case "export":
      ElMessage.success("正在导出数据...");
      break;
  }
};

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
    default:
      ElMessage.info(`操作: ${code} - ${row.name}`);
  }
};
</script>

<style scoped>
.example-section {
  margin-bottom: 40px;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  min-height: 400px;
}
</style>
