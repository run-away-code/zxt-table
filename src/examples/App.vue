<template>
  <el-config-provider :locale="zhCn">
    <div class="container">
      <!-- 导航菜单 -->
      <div class="nav-menu">
        <el-menu
          :default-active="activeComponent"
          mode="horizontal"
          @select="handleMenuSelect"
        >
          <el-menu-item index="ZxtTable">ZxtTable 基础表格</el-menu-item>
          <el-menu-item index="ZxtGrid">ZxtGrid 可配置表格</el-menu-item>
          <el-menu-item index="ZxtGridDemo">ZxtGrid 独立 Demo</el-menu-item>
        </el-menu>
      </div>

      <!-- ZxtTable 示例 -->
      <div
        v-if="activeComponent === 'ZxtTable'"
        class="example-section"
      >
        <h2>ZxtTable Componen11t</h2>

        <!-- 表格/表单容器 -->
        <div class="table-container">
          <ZxtTable
            id="demo-table"
            :columns="tableColumns"
            :data="tableData"
            height="400"
            border
            stripe
            :proxy-config="tableProxy"
            :page-size="10"
            @loaded="
              ({ data, total }) => {
                /* 可选：接收服务端返回 */
              }
            "
          >
            <!-- 表格模式的操作列 -->
            <template #operation="{ row }">
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
        </div>
      </div>

      <!-- ZxtGrid 示例 -->
      <div
        v-if="activeComponent === 'ZxtGrid'"
        class="example-section"
      >
        <!-- ZxtGrid 组件 -->
        <ZxtGrid
          ref="gridRef"
          :grid-options="gridOptions"
          row-key="id"
          default-expand-all
          @toolbar-click="handleToolbarClick"
          @action-click="handleActionClick"
        >
          <!-- 自定义插槽 -->
          <template #status="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? "启用" : "禁用" }}
            </el-tag>
          </template>
        </ZxtGrid>
      </div>

      <!-- ZxtGrid 独立 Demo -->
      <div
        v-if="activeComponent === 'ZxtGridDemo'"
        class="example-section"
      >
        <ZxtGridDemo />
      </div>
    </div>
  </el-config-provider>
</template>

<script setup>
import { ref, reactive, h } from "vue";
import { ElMessage } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import ZxtTable from "../components/ZxtTable/ZxtTable.vue";
// import { ZxtTable } from "zxt-table";
import "zxt-table/dist/style.css";

import ZxtGrid from "../components/ZxtGrid/ZxtGrid.vue";
import ZxtGridDemo from "./ZxtGridDemo.vue";

// 当前激活的组件
const activeComponent = ref("ZxtTable");
const gridRef = ref(null);

// 全量数据（用于模拟服务端分页/排序）
const allData = ref([]);

// 表格列配置
const tableColumns = [
  { prop: "id", label: "ID", width: "60", align: "center" },
  // 姓名为链接（对象写法）
  {
    prop: "name",
    label: "姓名",
    width: "100",
    align: "center",
    cellRender: {
      name: "link",
      href: "#",
      onClick: ({ row }) => ElMessage.info(`点击了 ${row.name}`),
    },
  },
  { prop: "age", label: "年龄", width: "60", align: "center" },
  // 性别下拉（内置 select）
  {
    prop: "gender",
    label: "性别",
    width: "80",
    align: "center",
  },
  { prop: "phone", label: "电话", width: "120", align: "center" },
  { prop: "email", label: "邮箱", width: "180" },
  // 状态开关（函数写法）
  {
    prop: "status",
    label: "状态",
    width: "80",
    align: "center",
    cellRender: ({ row, updateRow }) =>
      h("el-switch", {
        modelValue: row.status === 1,
        "onUpdate:modelValue": (val) =>
          updateRow({ ...row, status: val ? 1 : 0 }),
      }),
  },
  { prop: "joinDate", label: "入职日期", width: "100", align: "center" },
  { prop: "address", label: "地址" },
  {
    slot: "operation",
    label: "操作",
    width: "150",
    fixed: "right",
    align: "center",
  },
];

// 表单列配置
const formColumns = [
  { prop: "name", label: "姓名", required: true },
  { prop: "age", label: "年龄", type: "input", required: true },
  { prop: "phone", label: "电话", required: true },
  { prop: "email", label: "邮箱", required: true },
  {
    prop: "status",
    label: "状态",
    type: "slot",
    slotName: "status",
    required: true,
    span: 24,
  },
  {
    prop: "joinDate",
    label: "入职日期",
    type: "date",
    required: true,
  },
  {
    prop: "address",
    label: "地址",
    required: true,
    span: 24,
  },
];

// 随机生成数据的函数
const generateRandomData = (count = 20) => {
  const firstNames = [
    "张",
    "李",
    "王",
    "赵",
    "钱",
    "孙",
    "周",
    "吴",
    "郑",
    "陈",
    "林",
    "黄",
    "刘",
    "马",
    "杨",
    "朱",
    "胡",
    "高",
    "林",
    "何",
  ];
  const lastNames = [
    "伟",
    "芳",
    "娜",
    "秀英",
    "敏",
    "静",
    "丽",
    "强",
    "磊",
    "军",
    "洋",
    "勇",
    "艳",
    "杰",
    "涛",
    "明",
    "超",
    "秀兰",
    "霞",
    "平",
  ];
  const cities = [
    "北京",
    "上海",
    "广州",
    "深圳",
    "杭州",
    "南京",
    "武汉",
    "成都",
    "重庆",
    "西安",
    "苏州",
    "天津",
    "长沙",
    "郑州",
    "青岛",
    "宁波",
    "厦门",
    "福州",
    "大连",
    "沈阳",
  ];
  const districts = [
    "朝阳区",
    "浦东新区",
    "天河区",
    "南山区",
    "西湖区",
    "玄武区",
    "武昌区",
    "锦江区",
    "渝中区",
    "雁塔区",
    "姑苏区",
    "和平区",
    "岳麓区",
    "金水区",
    "市南区",
    "江北区",
    "思明区",
    "鼓楼区",
    "西岗区",
    "沈河区",
  ];
  const phones = [
    "138",
    "139",
    "137",
    "136",
    "135",
    "134",
    "159",
    "158",
    "157",
    "188",
    "187",
    "186",
    "177",
    "176",
    "185",
    "184",
    "152",
    "151",
    "150",
    "189",
  ];
  const emails = [
    "qq.com",
    "163.com",
    "126.com",
    "gmail.com",
    "outlook.com",
    "hotmail.com",
    "yahoo.com",
    "sina.com",
    "sohu.com",
    "foxmail.com",
  ];

  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const district = districts[Math.floor(Math.random() * districts.length)];
    const phone =
      phones[Math.floor(Math.random() * phones.length)] +
      Math.floor(10000000 + Math.random() * 90000000);
    const email =
      firstName +
      lastName +
      Math.floor(Math.random() * 1000) +
      "@" +
      emails[Math.floor(Math.random() * emails.length)];

    return {
      id: i + 1,
      name: firstName + lastName,
      age: Math.floor(18 + Math.random() * 40),
      gender: Math.random() > 0.5 ? "男" : "女",
      address: city + "市" + district,
      phone: phone,
      email: email,
      status: Math.random() > 0.5 ? "在职" : "离职",
      joinDate: `2023-${Math.floor(1 + Math.random() * 12)
        .toString()
        .padStart(2, "0")}-${Math.floor(1 + Math.random() * 28)
        .toString()
        .padStart(2, "0")}`,
    };
  });
};

// 表格数据
// 初始化全量数据并设置默认展示页数据（客户端模式仍可用）
allData.value = generateRandomData(200);
const tableData = ref(allData.value.slice(0, 10));

// 服务端代理配置（proxyConfig），示例使用本地数据模拟
const tableProxy = reactive({
  ajax: {
    query: async (params) => {
      // 模拟服务端延迟
      await new Promise((r) => setTimeout(r, 300));
      const { page = 1, size = 10, sort, order } = params;
      let rows = [];
      if (sort) {
        rows.sort((a, b) => {
          const av = a[sort];
          const bv = b[sort];
          if (av === bv) return 0;
          const res = av > bv ? 1 : -1;
          return order === "descending" ? -res : res;
        });
      }
      const start = (page - 1) * size;
      const list = rows.slice(start, start + size);
      return { list, total: rows.length };
    },
  },
  props: {
    pageField: "page",
    sizeField: "size",
    sortField: "sort",
    orderField: "order",
  },
  response: { listField: "list", totalField: "total" },
});

// 表单数据
const form = reactive({
  name: "",
  region: "",
});

// 表格/表单模式
const tableMode = ref("table");

// 当前表单数据
const currentFormData = reactive({
  name: "",
  age: "",
  phone: "",
  email: "",
  status: "在职",
  joinDate: "",
  address: "",
});

// 处理模式切换
const handleModeChange = (mode) => {
  if (mode === "form") {
    // 清空表单数据
    Object.keys(currentFormData).forEach((key) => {
      currentFormData[key] = key === "status" ? "在职" : "";
    });
  }
};

// 操作列按钮点击
const handleActionClick = ({ code, button, row }) => {
  switch (code) {
    case "edit":
      handleEdit(row);
      break;
    case "delete":
      handleDelete(row);
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

// 处理编辑
const handleEdit = (row) => {
  // 切换到表单模式并填充数据
  tableMode.value = "form";

  // 复制行数据到表单
  Object.keys(currentFormData).forEach((key) => {
    if (row[key] !== undefined) {
      currentFormData[key] = row[key];
    }
  });

  ElMessage.success(`编辑: ${row.name}`);
};

// 处理删除
const handleDelete = (row) => {
  ElMessage.warning(`删除: ${row.name}`);
};

// 处理表单提交
const handleFormSubmit = (formData) => {
  ElMessage.success("表单提交成功");
  console.log("表单数据:", formData);

  // 添加到表格数据或更新现有数据
  const newId =
    tableData.value.length > 0
      ? Math.max(...tableData.value.map((item) => item.id)) + 1
      : 1;
  const newRow = { ...formData, id: newId };
  tableData.value.unshift(newRow);

  // 切换回表格模式
  tableMode.value = "table";
};

// 处理表单重置
const handleFormReset = () => {
  ElMessage.info("表单已重置");
};

// 自定义操作
const handleCustomAction = () => {
  ElMessage.info("执行自定义操作");
};

// 表单提交
const onSubmit = () => {
  console.log("submit!", form);
};

// 处理分页变化
const handlePageChange = ({ page, size }) => {
  ElMessage.info(`切换到第 ${page} 页，每页 ${size} 条`);
  console.log("页码变化:", { page, size });
};

// 处理每页条数变化
const handleSizeChange = ({ page, size }) => {
  ElMessage.info(`每页显示 ${size} 条`);
  console.log("每页条数变化:", { page, size });
};

// 导航菜单切换
const handleMenuSelect = (index) => {
  activeComponent.value = index;
};

// 树形数据（带 children）
const treeData = ref([
  // {
  //   id: 1,
  //   name: "技术部",
  //   age: "-",
  //   email: "tech@company.com",
  //   phone: "010-12345678",
  //   status: 1,
  //   address: "北京市朝阳区",
  //   joinDate: "2020-01-01",
  //   children: [
  //     {
  //       id: 11,
  //       name: "张伟",
  //       age: 28,
  //       email: "zhangwei@company.com",
  //       phone: "13812345678",
  //       status: 1,
  //       address: "北京市朝阳区",
  //       joinDate: "2021-03-15",
  //     },
  //     {
  //       id: 12,
  //       name: "李娜",
  //       age: 26,
  //       email: "lina@company.com",
  //       phone: "13987654321",
  //       status: 1,
  //       address: "北京市海淀区",
  //       joinDate: "2022-06-20",
  //       children: [
  //         {
  //           id: 121,
  //           name: "王磊（实习）",
  //           age: 22,
  //           email: "wanglei@company.com",
  //           phone: "15012345678",
  //           status: 1,
  //           address: "北京市海淀区",
  //           joinDate: "2024-01-10",
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: 2,
  //   name: "市场部",
  //   age: "-",
  //   email: "market@company.com",
  //   phone: "010-87654321",
  //   status: 1,
  //   address: "上海市浦东新区",
  //   joinDate: "2020-01-01",
  //   children: [
  //     {
  //       id: 21,
  //       name: "赵强",
  //       age: 32,
  //       email: "zhaoqiang@company.com",
  //       phone: "13698765432",
  //       status: 1,
  //       address: "上海市浦东新区",
  //       joinDate: "2020-08-10",
  //     },
  //     {
  //       id: 22,
  //       name: "钱敏",
  //       age: 29,
  //       email: "qianmin@company.com",
  //       phone: "13511223344",
  //       status: 0,
  //       address: "上海市静安区",
  //       joinDate: "2021-11-05",
  //     },
  //   ],
  // },
  // {
  //   id: 3,
  //   name: "人事部",
  //   age: "-",
  //   email: "hr@company.com",
  //   phone: "010-11112222",
  //   status: 1,
  //   address: "广州市天河区",
  //   joinDate: "2020-01-01",
  //   children: [
  //     {
  //       id: 31,
  //       name: "孙丽",
  //       age: 30,
  //       email: "sunli@company.com",
  //       phone: "13899887766",
  //       status: 1,
  //       address: "广州市天河区",
  //       joinDate: "2019-05-20",
  //     },
  //   ],
  // },
]);

// ZxtGrid 配置选项 (类似 vxe-grid 配置)
const gridOptions = reactive({
  id: "demo-grid",
  border: true, // 透传给 el-table
  stripe: false, // 树形数据关闭斑马纹更美观
  // 工具栏配置
  toolbar: {
    buttons: [
      {
        code: "add",
        name: "新增",
        type: "primary",
        size: "small",
        icon: "Plus",
      },
      {
        code: "delete",
        name: "删除",
        type: "danger",
        size: "small",
        icon: "Delete",
      },
      {
        code: "refresh",
        name: "刷新",
        type: "default",
        size: "small",
        icon: "Refresh",
      },
      {
        code: "export",
        name: "导出",
        type: "success",
        size: "small",
        icon: "Download",
      },
    ],
  },

  // 列配置（支持多级表头）
  columns: [
    { prop: "id", label: "ID", width: "80", align: "center" },
    { prop: "name", label: "名称", width: "180" },
    { prop: "age", label: "年龄", width: "80", align: "center" },
    // 多级表头：联系方式（父级）
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

  // 使用树形数据
  data: treeData.value,

  // 分页配置
  pageable: true,
  pageSizes: [5, 10, 20, 50],
  paginationLayout: "total, sizes, prev, pager, next, jumper",

  // 表格高度
  height: "full",

  // 表单配置
  formMode: false, // 是否显示filter
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
        events: {
          change: (val) => {
            console.log("姓名改变:", val);
            if (val) {
              ElMessage.info("正在查询状态...");
              // 模拟接口请求
              setTimeout(() => {
                gridOptions.formConfig.data.status = 0; // 0 代表禁用
                ElMessage.success("已自动联动状态为：禁用");
              }, 500);
            }
          },
        },
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
  // formColumns: [
  //   { prop: "name", label: "姓名", required: true },
  //   { prop: "age", label: "年龄", type: "input", required: true },
  //   { prop: "email", label: "邮箱", required: true },
  //   { prop: "phone", label: "电话", required: true },
  //   { prop: "address", label: "地址", required: true },
  //   { prop: "joinDate", label: "入职日期", type: "date", required: true },
  // ],
  initialFormData: {},
  rules: {},
});

// 工具栏按钮点击事件
const handleToolbarClick = ({ code, button }) => {
  ElMessage.info(`点击了工具栏按钮: ${button.name} (${code})`);

  switch (code) {
    case "add":
      handleAdd();
      break;
    case "delete":
      handleDeleteSelected();
      break;
    case "refresh":
      handleRefresh();
      break;
    case "export":
      handleExport();
      break;
  }
};

// 添加数据
const handleAdd = () => {
  ElMessage.success("执行添加操作");
};

// 删除选中数据
const handleDeleteSelected = () => {
  const selectedRows = gridRef.value?.getSelectedRows() || [];
  if (selectedRows.length === 0) {
    ElMessage.warning("请先选择要删除的数据");
    return;
  }
  ElMessage.success(`准备删除 ${selectedRows.length} 条数据`);
};

// 刷新数据
const handleRefresh = () => {
  ElMessage.success("正在刷新数据...");
};

// 导出数据
const handleExport = () => {
  ElMessage.success("正在导出数据...");
};
</script>

<style>
.container {
  margin: 0 auto;
  padding: 20px;
}

.nav-menu {
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.example-section {
  margin-bottom: 40px;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
}

.config-info {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.config-info h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
}

.config-display {
  margin-top: 30px;
  background-color: #f8f8f8;
  padding: 15px;
  border-radius: 4px;
}

.config-display h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
}

.config-display pre {
  background-color: #fff;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #ddd;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.5;
}

.button-row {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.table-container {
  margin-top: 20px;
  /* height: 400px; */
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

h2 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
  color: #333;
}
</style>
