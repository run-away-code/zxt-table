<template>
  <div class="zxt-form-container">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      class="zxt-form"
    >
      <el-row :gutter="20">
        <el-col
          v-for="(column, index) in processedColumns"
          :key="index"
          v-bind="column.colSpan"
        >
          <el-form-item
            :prop="column.prop"
            :required="column.required"
            label-width="0"
            class="custom-form-item"
          >
            <div
              class="form-item-wrapper"
              :class="{ 'is-action': column.isAction }"
            >
              <span
                class="form-label"
                v-if="column.label"
                >{{ column.label }}</span
              >
              <div class="form-control">
                <!-- 自定义插槽 -->
                <slot
                  v-if="column.type === 'slot'"
                  :name="column.slotName || column.prop"
                  :form-data="formData"
                  :column="column"
                />

                <!-- itemRender 自定义渲染器 -->
                <component
                  v-else-if="column.itemRender"
                  :is="renderCustomItem(column)"
                />

                <!-- 动态组件 -->
                <component
                  v-else
                  :is="getComponentType(column.type)"
                  v-model="formData[column.prop]"
                  v-bind="getComponentProps(column)"
                  v-on="column.events || {}"
                >
                  <!-- Select 的 options 插槽 -->
                  <template v-if="column.type === 'select'">
                    <el-option
                      v-for="(option, optIndex) in column.options"
                      :key="optIndex"
                      :label="option.label"
                      :value="option.value"
                    />
                  </template>
                </component>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 表单按钮 -->
      <!-- <div class="form-actions">
        <el-button @click="resetForm">重置</el-button>
        <el-button
          type="primary"
          @click="submitForm"
          >提交</el-button
        >
        <slot name="form-actions"></slot>
      </div> -->
    </el-form>
  </div>
</template>

<script>
import { defineComponent, ref, computed, reactive, watch } from "vue";
import { renderFormItem } from "../ZxtTable/rendererManager";

export default defineComponent({
  name: "ZxtForm",
  props: {
    formColumns: { type: Array, default: () => [] },
    initialFormData: { type: Object, default: () => ({}) },
    rules: { type: Object, default: () => ({}) },
  },
  emits: ["submit", "reset"],
  setup(props, { emit, expose }) {
    const formRef = ref(null);
    const formData = reactive({});

    // 组件类型映射
    const componentMap = {
      input: "el-input",
      select: "el-select",
      date: "el-date-picker",
      daterange: "el-date-picker",
      datetime: "el-date-picker",
      datetimerange: "el-date-picker",
      cascader: "el-cascader",
    };

    // 获取组件类型
    const getComponentType = (type) => {
      return componentMap[type] || "el-input";
    };

    // 获取组件属性
    const getComponentProps = (column) => {
      const type = column.type || "input";
      const isSelectType = [
        "select",
        "date",
        "daterange",
        "datetime",
        "datetimerange",
        "cascader",
      ].includes(type);

      const baseProps = {
        placeholder:
          column.placeholder ||
          `请${isSelectType ? "选择" : "输入"}${column.label}`,
        disabled: column.disabled,
        style: "width: 100%",
        "popper-class": "zxt-form-popper",
      };

      // 根据不同类型添加特定属性
      switch (type) {
        case "date":
        case "daterange":
        case "datetime":
        case "datetimerange":
          return {
            ...baseProps,
            type: column.dateType || type,
            startPlaceholder: column.startPlaceholder || "开始日期",
            endPlaceholder: column.endPlaceholder || "结束日期",
            format: column.format,
            valueFormat: column.valueFormat,
          };
        case "cascader":
          return {
            ...baseProps,
            options: column.options,
            props: column.cascaderProps,
            clearable: column.clearable !== false,
          };
        case "select":
          return baseProps;
        case "input":
        default:
          return baseProps;
      }
    };

    // 预处理所有列配置（栅格响应式配置）
    const processedColumns = computed(() => {
      return props.formColumns.map((column) => ({
        ...column,
        colSpan: {
          xs: column.xs ?? column.span ?? 24,
          sm: column.sm ?? column.span ?? 12,
          md: column.md ?? column.span ?? 12,
          lg: column.lg ?? column.span ?? 12,
          xl: column.xl ?? column.span ?? 12,
        },
      }));
    });

    // 同步初始数据
    watch(
      () => props.initialFormData,
      (newVal) => {
        Object.keys(formData).forEach((key) => {
          delete formData[key];
        });
        Object.assign(formData, newVal);
      },
      { immediate: true, deep: true }
    );

    // 生成校验规则
    const formRules = computed(() => {
      const rules = { ...props.rules };
      if (Object.keys(rules).length === 0 && props.formColumns.length > 0) {
        props.formColumns.forEach((column) => {
          if (column.required) {
            const isSelectType = [
              "select",
              "date",
              "daterange",
              "datetime",
              "datetimerange",
              "cascader",
            ].includes(column.type);

            rules[column.prop] = [
              {
                required: true,
                message: `请${isSelectType ? "选择" : "输入"}${column.label}`,
                trigger: isSelectType ? "change" : "blur",
              },
            ];
          }
        });
      }
      return rules;
    });

    const submitForm = () => {
      if (!formRef.value) return;
      formRef.value.validate((valid) => {
        if (valid) emit("submit", { ...formData });
      });
    };

    const resetForm = () => {
      if (formRef.value) formRef.value.resetFields();
      emit("reset");
    };

    // 渲染自定义表单项
    const renderCustomItem = (column) => {
      return () => {
        const vnode = renderFormItem(column, formData, {});
        return vnode || null;
      };
    };

    // 暴露方法
    expose({
      validate: () =>
        formRef.value ? formRef.value.validate() : Promise.resolve(false),
      resetFields: () => formRef.value && formRef.value.resetFields(),
      getFormData: () => ({ ...formData }),
      submitForm,
      resetForm,
    });

    return {
      formRef,
      formData,
      formRules,
      submitForm,
      resetForm,
      processedColumns,
      getComponentType,
      getComponentProps,
      renderCustomItem,
    };
  },
});
</script>

<style>
/* 全局样式 - 覆盖 Select/DatePicker 下拉框样式 */
.zxt-form-popper .el-select-dropdown__item.selected,
.zxt-form-popper .el-select-dropdown__item.is-selected {
  color: #fa2314 !important;
}

.zxt-form-popper .el-select-dropdown__item.hover,
.zxt-form-popper .el-select-dropdown__item:hover {
  background-color: #f5f7fa; /* 保持背景色不变或自定义 */
  color: #fa2314; /* hover文字变红 */
}

.zxt-form-popper
  .el-date-table
  td.current:not(.disabled)
  .el-date-table-cell__text {
  background-color: #fa2314 !important;
}

.zxt-form-popper .el-date-table td.today .el-date-table-cell__text {
  color: #fa2314;
}

.zxt-form-popper .el-date-table td.today.current .el-date-table-cell__text {
  color: #fff; /* 选中时文字变白 */
}

/* 年月选择 */
.zxt-form-popper .el-year-table td.current .cell,
.zxt-form-popper .el-month-table td.current .cell {
  color: #fa2314 !important;
}

/* 范围选择 */
.zxt-form-popper .el-date-table td.start-date .el-date-table-cell__text,
.zxt-form-popper .el-date-table td.end-date .el-date-table-cell__text {
  background-color: #fa2314 !important;
}

/* 日期 Hover */
.zxt-form-popper .el-date-table td.available:hover {
  color: #fa2314;
}

/* 年月 Hover */
.zxt-form-popper .el-year-table td .cell:hover,
.zxt-form-popper .el-month-table td .cell:hover {
  color: #fa2314;
}

/* 头部按钮 Hover */
.zxt-form-popper .el-date-picker__header-label:hover,
.zxt-form-popper .el-picker-panel__icon-btn:hover {
  color: #fa2314;
}
</style>

<style scoped>

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 10px;
}

.form-item-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 12px;
  width: 100%;
  background-color: #fff;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.form-item-wrapper.is-action {
  border: none;
  background-color: transparent;
  padding: 0;
}

.form-item-wrapper:focus-within {
  border-color: #fa2314;
}

.custom-form-item.is-error .form-item-wrapper {
  border-color: #f56c6c;
}

.form-label {
  color: #606266;
  white-space: nowrap;
  margin-right: 12px;
  font-size: 14px;
  line-height: 32px;
}

.form-control {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
}

/* 覆盖 Element Plus 默认样式 */
.custom-form-item :deep(.el-input__wrapper),
.custom-form-item :deep(.el-select__wrapper),
.custom-form-item :deep(.el-textarea__wrapper) {
  box-shadow: none !important;
  background-color: transparent !important;
  padding-left: 0;
  padding-right: 0;
}

.custom-form-item :deep(.el-input__prefix),
.custom-form-item :deep(.el-input__suffix) {
  /* 调整图标位置，如果有的话 */
}

/* 日期选择器特殊处理 */
.custom-form-item :deep(.el-date-editor.el-input__wrapper) {
  width: 100%;
}

.custom-form-item :deep(.el-range-editor.el-input__wrapper) {
  padding: 0;
  box-shadow: none !important;
}
</style>
