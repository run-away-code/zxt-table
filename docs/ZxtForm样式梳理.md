# ZxtForm 表单组件样式梳理

供其他项目参考，复用时需基于 **Element Plus** 的 `el-form`、`el-input`、`el-select`、`el-date-picker` 等组件。

---

## 一、主题色

| 用途         | 色值       | 说明           |
|--------------|------------|----------------|
| 主色/聚焦/选中 | `#fa2314` | 边框、选中、hover |
| 错误态边框   | `#f56c6c` | 校验失败时     |
| 默认边框     | `#dcdfe6` | 未聚焦         |
| 标签文字     | `#606266` | form-label     |
| 下拉 hover 背景 | `#f5f7fa` | Select 下拉项  |

---

## 二、表单项整体（wrapper）

所有 input/select/date 等都被包在一个 **form-item-wrapper** 里，视觉上是一个带边框的“整块”。

```css
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

/* 聚焦时 */
.form-item-wrapper:focus-within {
  border-color: #fa2314;
}

/* 校验错误时 */
.custom-form-item.is-error .form-item-wrapper {
  border-color: #f56c6c;
}

/* 操作列等不需要边框时 */
.form-item-wrapper.is-action {
  border: none;
  background-color: transparent;
  padding: 0;
}
```

- **标签**：在 wrapper 左侧，用 `.form-label`  
- **控件区**：用 `.form-control` 占满剩余空间

```css
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
```

---

## 三、Input（el-input）

- 去掉 Element 自带的“盒子”和阴影，让输入框长在 **form-item-wrapper** 里。
- 所有 input 容器都放在带 `.custom-form-item` 的 `el-form-item` 下。

```css
/* 去掉默认阴影和背景，左右不额外留白 */
.custom-form-item :deep(.el-input__wrapper),
.custom-form-item :deep(.el-select__wrapper),
.custom-form-item :deep(.el-textarea__wrapper) {
  box-shadow: none !important;
  background-color: transparent !important;
  padding-left: 0;
  padding-right: 0;
}

/* 前缀/后缀图标可按需微调 */
.custom-form-item :deep(.el-input__prefix),
.custom-form-item :deep(.el-input__suffix) {
  /* 调整图标位置，如果有的话 */
}
```

效果：**边框和背景完全由外层 form-item-wrapper 提供**，input 只负责文字和图标。

---

## 四、Select（el-select）

- **输入区**：和 input 一样，用上面同一套 `.el-input__wrapper` / `.el-select__wrapper` 覆盖，无阴影、透明背景、左右 padding 为 0。
- **下拉面板**：通过 **popper-class** 挂到 body，需用**全局样式**（不要 scoped）覆盖。

使用时给 `el-select` 设置：

```html
popper-class="zxt-form-popper"
```

然后写**非 scoped** 样式：

```css
/* 选中项文字颜色 */
.zxt-form-popper .el-select-dropdown__item.selected,
.zxt-form-popper .el-select-dropdown__item.is-selected {
  color: #fa2314 !important;
}

/* 下拉项 hover */
.zxt-form-popper .el-select-dropdown__item.hover,
.zxt-form-popper .el-select-dropdown__item:hover {
  background-color: #f5f7fa;
  color: #fa2314;
}
```

---

## 五、DatePicker（el-date-picker）

- **输入区**：和 input 一致，用同一套 wrapper 覆盖；范围选择器额外去掉内边距和阴影。
- **弹出面板**：同样用 **popper-class="zxt-form-popper"**，以下均为**全局样式**。

```css
/* 日期选择器输入区 */
.custom-form-item :deep(.el-date-editor.el-input__wrapper) {
  width: 100%;
}

.custom-form-item :deep(.el-range-editor.el-input__wrapper) {
  padding: 0;
  box-shadow: none !important;
}
```

**下拉日历 / 面板（zxt-form-popper）：**

```css
/* 当前月选中格 */
.zxt-form-popper .el-date-table td.current:not(.disabled) .el-date-table-cell__text {
  background-color: #fa2314 !important;
}

/* 今天 */
.zxt-form-popper .el-date-table td.today .el-date-table-cell__text {
  color: #fa2314;
}
.zxt-form-popper .el-date-table td.today.current .el-date-table-cell__text {
  color: #fff;
}

/* 年月选择当前项 */
.zxt-form-popper .el-year-table td.current .cell,
.zxt-form-popper .el-month-table td.current .cell {
  color: #fa2314 !important;
}

/* 范围：开始/结束日期 */
.zxt-form-popper .el-date-table td.start-date .el-date-table-cell__text,
.zxt-form-popper .el-date-table td.end-date .el-date-table-cell__text {
  background-color: #fa2314 !important;
}

/* 日期 hover */
.zxt-form-popper .el-date-table td.available:hover {
  color: #fa2314;
}

/* 年月 hover */
.zxt-form-popper .el-year-table td .cell:hover,
.zxt-form-popper .el-month-table td .cell:hover {
  color: #fa2314;
}

/* 头部标签、前后月按钮 hover */
.zxt-form-popper .el-date-picker__header-label:hover,
.zxt-form-popper .el-picker-panel__icon-btn:hover {
  color: #fa2314;
}
```

---

## 六、Cascader（el-cascader）

- 输入区同样用 `.custom-form-item :deep(.el-select__wrapper)` 和上面的 input/select 同一套。
- 若下拉面板也用 `popper-class="zxt-form-popper"`，需在项目里为 **el-cascader 下拉** 单独加选中/hover 样式（选择主色 `#fa2314`），写法可参考 Select 下拉项。

---

## 七、汇总：按组件分类

| 组件           | 作用位置           | 说明 |
|----------------|--------------------|------|
| **el-form-item** | `.custom-form-item`、`.form-item-wrapper` | 整项布局、边框、聚焦/错误色 |
| **el-input**   | `.el-input__wrapper`、`.el-textarea__wrapper` | 无阴影、透明背景、左右 padding 0 |
| **el-select**  | `.el-select__wrapper` + `.zxt-form-popper` 下拉 | 同 input 容器；下拉选中/hover 主色 |
| **el-date-picker** | `.el-date-editor` / `.el-range-editor` + `.zxt-form-popper` | 同 input 容器；面板内当前/今天/范围/hover 主色 |
| **el-cascader** | 同 select 的 wrapper；下拉需单独写 popper 样式 | 与 select 一致 |

---

## 八、其他项目复用时注意

1. **popper-class**：所有下拉类组件（Select、DatePicker、Cascader）统一传 `popper-class="zxt-form-popper"`，这样主色只作用于本表单的下拉，不影响全局。
2. **全局样式**：Select/DatePicker 的下拉是挂到 body 的，对应 `.zxt-form-popper` 的样式不能写在 scoped 里，需单独 `<style>` 块或全局 CSS。
3. **主题色**：当前主色为 `#fa2314`，若其他项目主色不同，全局替换该色值即可。
4. **结构**：每个表单项为「label + form-item-wrapper（内含 form-control + 控件）」；若不用 wrapper 包裹，则需自行给 input/select 等加边框和 focus 态。

按上述变量和类名在其它项目中套用，即可与当前 ZxtForm 的 input、select、date 等样式保持一致。
