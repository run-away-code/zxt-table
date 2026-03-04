<template>
  <div class="zxt-grid-demo">

    <!-- 内容区域：使用 flex 让 ZxtGrid 全高度撑满 -->
    <div class="demo-content">
      <ZxtGrid
        ref="gridRef"
        :grid-options="gridOptions"
        row-key="id"
        @toolbar-click="handleToolbarClick"
        @action-click="handleActionClick"
      >
        <!-- 自定义状态列 -->
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
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import ZxtGrid from "../components/ZxtGrid/ZxtGrid.vue";

const gridRef = ref(null);

// 简单静态数据
const gridData = [
  {
    id: 1,
    name: "张伟",
    age: 28,
    email: "zhangwei@test.com",
    phone: "13812345678",
    status: 1,
    address: "北京市朝阳区",
    joinDate: "2023-05-01",
  },
  {
    id: 2,
    name: "李娜",
    age: 26,
    email: "lina@test.com",
    phone: "13987654321",
    status: 0,
    address: "上海市浦东新区",
    joinDate: "2023-06-15",
  },
  {
    id: 3,
    name: "王强",
    age: 32,
    email: "wangqiang@test.com",
    phone: "13700001111",
    status: 1,
    address: "广州市天河区",
    joinDate: "2023-07-20",
  },
];

const gridOptions = reactive({
  id: "standalone-grid",
  border: true,
  stripe: true,

  // 表格高度：full，配合外层 flex，让内容自动撑满
  height: "full",

  // 工具栏
  toolbar: {
    buttons: [
      { code: "add", name: "新增", type: "primary", icon: "Plus" },
      { code: "delete", name: "删除", type: "danger", icon: "Delete" },
      { code: "refresh", name: "刷新", type: "default", icon: "Refresh" },
      { code: "export", name: "导出", type: "success", icon: "Download" },
    ],
  },

  // 搜索表单
  formConfig: {
    data: {
      name: "",
      status: "",
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
        clearable: true,
        props: {
          clearable: true,
        },
        options: [
          { label: "全部", value: "" },
          { label: "启用", value: 1 },
          { label: "禁用", value: 0 },
        ],
      },
    ],
  },

  // 列配置
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
    {
      prop: "status",
      label: "状态",
      width: "80",
      slot: "status",
      align: "center",
    },
    { prop: "address", label: "地址" },
    {
      prop: "joinDate",
      label: "入职日期",
      width: "120",
      align: "center",
    },
    {
      label: "操作",
      width: "220",
      fixed: "right",
      align: "center",
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

  // 数据
  data: gridData,

  // 分页
  pageable: true,
  pageSizes: [5, 10, 20],
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
    default:
      ElMessage.info(`操作: ${code} - ${row.name}`);
  }
};
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

.demo-title {
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: 600;
}

.demo-desc {
  margin-bottom: 16px;
  font-size: 13px;
  color: #666;
}

.demo-desc ul {
  margin: 4px 0 0 18px;
  padding: 0;
}

.demo-desc li {
  line-height: 1.6;
}

.demo-content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
</style>
