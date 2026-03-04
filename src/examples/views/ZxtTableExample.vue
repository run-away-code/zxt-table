<template>
  <div class="example-section">
    <h2>ZxtTable 基础表格</h2>
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
        @loaded="() => {}"
      >
        <template #operation="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </ZxtTable>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, h } from "vue";
import { ElMessage } from "element-plus";
import ZxtTable from "../../components/ZxtTable/ZxtTable.vue";
import "zxt-table/dist/style.css";

const generateRandomData = (count = 20) => {
  const firstNames = ["张", "李", "王", "赵", "钱", "孙", "周", "吴", "郑", "陈"];
  const lastNames = ["伟", "芳", "娜", "秀英", "敏", "静", "丽", "强", "磊", "军"];
  const cities = ["北京", "上海", "广州", "深圳", "杭州", "南京", "武汉", "成都"];
  const districts = ["朝阳区", "浦东新区", "天河区", "南山区", "西湖区", "玄武区"];
  const phones = ["138", "139", "137", "136", "135"];
  const emails = ["qq.com", "163.com", "126.com", "gmail.com"];

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
      phone,
      email,
      status: Math.random() > 0.5 ? 1 : 0,
      joinDate: `2023-${String(Math.floor(1 + Math.random() * 12)).padStart(2, "0")}-${String(Math.floor(1 + Math.random() * 28)).padStart(2, "0")}`,
    };
  });
};

const allData = ref(generateRandomData(200));
const tableData = ref(allData.value.slice(0, 10));

const tableColumns = [
  { prop: "id", label: "ID", width: "60", align: "center" },
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
  { prop: "gender", label: "性别", width: "80", align: "center" },
  { prop: "phone", label: "电话", width: "120", align: "center" },
  { prop: "email", label: "邮箱", width: "180" },
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

const tableProxy = reactive({
  ajax: {
    query: async (params) => {
      await new Promise((r) => setTimeout(r, 300));
      const page = params?.page?.currentPage ?? 1;
      const size = params?.page?.pageSize ?? 10;
      const start = (page - 1) * size;
      const list = allData.value.slice(start, start + size);
      return { list, total: allData.value.length };
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

const handleEdit = (row) => {
  ElMessage.success(`编辑: ${row.name}`);
};

const handleDelete = (row) => {
  ElMessage.warning(`删除: ${row.name}`);
};
</script>

<style scoped>
.example-section {
  margin-bottom: 40px;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
}

.table-container {
  margin-top: 20px;
}

h2 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
  color: #333;
}
</style>
