<template>
  <div class="renderer-demo">
    <h2>渲染器注入功能演示</h2>

    <div class="demo-section">
      <h3>1. 表单中使用自定义渲染器</h3>
      <ZxtTable
        :form-mode="true"
        :form-columns="formColumns"
        :initial-form-data="formData"
      />
    </div>

    <div class="demo-section">
      <h3>2. 表单数据预览</h3>
      <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, onMounted } from "vue";
import { ElSelect, ElOption } from "element-plus";
import { h } from "vue";
import ZxtTable from "../components/ZxtTable";

export default defineComponent({
  name: "RendererDemo",
  components: {
    ZxtTable,
  },
  setup() {
    // 注册自定义渲染器 - XSelect
    onMounted(() => {
      ZxtTable.renderer.add("XSelect", {
        renderItemContent(renderOpts, params) {
          const { data, field, item } = params;

          return h(
            ElSelect,
            {
              modelValue: data[field],
              "onUpdate:modelValue": (val) => {
                data[field] = val;
              },
              clearable: true,
              filterable: true,
              style: { width: "100%" },
              placeholder: "请选择",
            },
            () =>
              item.itemRender.options?.map((r) => {
                const valueKey = item.itemRender.optionProps?.value || "value";
                const labelKey = item.itemRender.optionProps?.label || "label";
                return h(ElOption, {
                  value: r[valueKey],
                  label: r[labelKey],
                  key: r[valueKey],
                });
              })
          );
        },
      });

      // 注册另一个自定义渲染器 - XInput
      ZxtTable.renderer.add("XInput", {
        renderItemContent(renderOpts, params) {
          const { data, field, item } = params;

          return h("div", { class: "custom-input-wrapper" }, [
            h(
              "label",
              { style: "margin-right: 8px; color: #409eff;" },
              "自定义:"
            ),
            h("input", {
              value: data[field],
              onInput: (e) => {
                data[field] = e.target.value;
              },
              placeholder: item.placeholder || "请输入",
              style:
                "flex: 1; padding: 4px 8px; border: 1px solid #dcdfe6; border-radius: 4px;",
            }),
          ]);
        },
      });

      console.log("已注册的渲染器:", ZxtTable.renderer.getAll());
    });

    const formData = reactive({
      username: "",
      gender: "",
      city: "",
      description: "",
    });

    const formColumns = [
      {
        label: "用户名",
        prop: "username",
        itemRender: {
          name: "XInput",
          placeholder: "请输入用户名",
        },
      },
      {
        label: "性别",
        prop: "gender",
        itemRender: {
          name: "XSelect",
          options: [
            { id: 1, name: "男" },
            { id: 2, name: "女" },
            { id: 3, name: "保密" },
          ],
          optionProps: {
            value: "id",
            label: "name",
          },
        },
      },
      {
        label: "城市",
        prop: "city",
        itemRender: {
          name: "XSelect",
          options: [
            { code: "bj", title: "北京" },
            { code: "sh", title: "上海" },
            { code: "gz", title: "广州" },
            { code: "sz", title: "深圳" },
          ],
          optionProps: {
            value: "code",
            label: "title",
          },
        },
      },
      {
        label: "描述",
        prop: "description",
        type: "input", // 使用普通类型，对比效果
      },
    ];

    return {
      formData,
      formColumns,
    };
  },
});
</script>

<style scoped>
.renderer-demo {
  padding: 20px;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 4px;
}

.demo-section h3 {
  margin-top: 0;
  color: #303133;
}

.custom-input-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
}

pre {
  background: white;
  padding: 15px;
  border-radius: 4px;
  overflow: auto;
}
</style>
