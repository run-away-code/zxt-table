<template>
  <div class="zxt-grid-demo">
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

        <!-- 地址列表头带提示 icon -->
        <template #addressHeader="{ column }">
          <span class="address-header">
            {{ column.label }}
            <el-tooltip
              content="详细地址请联系客服"
              placement="top"
            >
              <el-icon class="address-header__icon">
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </span>
        </template>
      </ZxtGrid>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { QuestionFilled } from "@element-plus/icons-vue";
import ZxtGrid from "../components/ZxtGrid/ZxtGrid.vue";
import { useZxtGrid } from "../hooks/useZxtGrid";

// ============ 模拟数据 & 接口 ============

const gridData = [
  { id: 1, name: "张伟", age: 28, email: "zhangwei@test.com", phone: "13812345678", status: 1, address: "北京市朝阳区", joinDate: "2023-05-01" },
  { id: 2, name: "李娜", age: 26, email: "lina@test.com", phone: "13987654321", status: 0, address: "上海市浦东新区", joinDate: "2023-06-15" },
  { id: 3, name: "王强", age: 32, email: "wangqiang@test.com", phone: "13700001111", status: 1, address: "广州市天河区", joinDate: "2023-07-20" },
];

function mockListApi(payload) {
  console.log("[ZxtGrid 请求入参]", payload);
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
      if (form.joinRange?.length === 2) {
        const [start, end] = form.joinRange;
        list = list.filter((r) => r.joinDate >= start && r.joinDate <= end);
      }

      const total = list.length;
      const start = (currentPage - 1) * pageSize;
      resolve({ list: list.slice(start, start + pageSize), total });
    }, 300);
  });
}

// ============ Grid 配置（一行搞定） ============

const { gridRef, gridOptions, handleToolbarClick, handleActionClick } = useZxtGrid({
  id: "standalone-grid",
  fetchApi: mockListApi,
  pageSizes: [5, 10, 20],

  // 表单初始赋值：status=1，mount 时自动回填并触发首次查询，无需手写 onMounted
  initialFormData: { status: 1 },

  formData: { name: "", status: "", joinRange: [] },
  formItems: [
    { prop: "name", label: "姓名", span: 6 },
    {
      prop: "joinRange", label: "入职日期", span: 12,
      type: "daterange", dateType: "daterange",
      startPlaceholder: "开始日期", endPlaceholder: "结束日期",
      valueFormat: "YYYY-MM-DD",
    },
    {
      prop: "status", label: "状态", span: 6,
      type: "select", clearable: true,
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
    { code: "export", name: "导出", type: "success", icon: "Download" },
  ],

  columns: [
    { type: "selection", width: "55", align: "center" },
    { prop: "id", label: "ID", width: "80", align: "center" },
    { prop: "name", label: "姓名", width: "120" },
    { prop: "age", label: "年龄", width: "80", align: "center" },
    {
      label: "联系方式", align: "center",
      children: [
        { prop: "email", label: "邮箱", width: "200" },
        { prop: "phone", label: "电话", width: "140", align: "center" },
      ],
    },
    { prop: "status", label: "状态", width: "80", slot: "status", align: "center" },
    { prop: "address", label: "地址1", headerSlot: "addressHeader" },
    { prop: "joinDate", label: "入职日期", width: "120", align: "center" },
    {
      label: "操作", width: "220", fixed: "right", align: "center",
      actionColumn: {
        maxVisible: 2,
        buttons: [
          { label: "详情", type: "primary", code: "edit" },
          { label: "删除", type: "danger", code: "delete" },
          { label: "查看", icon: "View", code: "view" },
          { label: "复制", icon: "CopyDocument", code: "copy" },
        ],
      },
    },
  ],

  // 工具栏事件：code → handler，第二个参数 ctx 提供 query/getSelectedRows 等方法
  toolbarHandlers: {
    add: () => ElMessage.success("新增"),
    delete: (_, { getSelectedRows }) => {
      const rows = getSelectedRows();
      rows.length
        ? ElMessage.success(`删除 ${rows.length} 条`)
        : ElMessage.warning("请先选择数据");
    },
    refresh: (_, { query }) => query(),
    export: () => ElMessage.success("导出"),
  },

  // 操作列事件
  actionHandlers: {
    edit: ({ row }) => ElMessage.success(`编辑: ${row.name}`),
    delete: ({ row }) => ElMessage.warning(`删除: ${row.name}`),
    view: ({ row }) => ElMessage.info(`查看: ${row.name}`),
    copy: ({ row }) => ElMessage.info(`复制: ${row.name}`),
  },
});
</script>

<style scoped>
.zxt-grid-demo {
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

.address-header {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.address-header__icon {
  cursor: pointer;
  color: #909399;
}

.address-header__icon:hover {
  color: #409EFF;
}
</style>
