import { h } from "vue";
import { ElInput, ElSelect, ElOption, ElCheckbox, ElLink } from "element-plus";

// 内置渲染器映射表
const builtinRenderers = {
  default: ({ cellValue }) => cellValue ?? "",
  input: ({ cellValue, row, column, updateRow }) =>
    h(ElInput, {
      modelValue: cellValue,
      size: "small",
      onInput: (val) => updateRow({ ...row, [column.property]: val }),
    }),
  select: ({ cellValue, row, column, updateRow, options = [] }) =>
    h(
      ElSelect,
      {
        modelValue: cellValue,
        size: "small",
        onChange: (val) => updateRow({ ...row, [column.property]: val }),
      },
      () =>
        options.map((opt) =>
          h(ElOption, { label: opt.label, value: opt.value, key: opt.value })
        )
    ),
  checkbox: ({ cellValue, row, column, updateRow }) =>
    h(ElCheckbox, {
      modelValue: Boolean(cellValue),
      onChange: (val) => updateRow({ ...row, [column.property]: val }),
    }),
  link: ({ cellValue, href, target = "_blank" }) =>
    h(ElLink, { href, target }, () => cellValue),
};

/**
 * 统一解析 cellRender 配置
 * @param {Object|Function|String} cellRender - 列配置中的 cellRender
 * @param {Object} params - 包含 row, column, rowIndex, cellValue, updateRow 等
 * @returns {VNode|string|null}
 */
export function resolveCellRender(cellRender, params) {
  if (!cellRender) return null;

  // 1. 字符串：认为是内置渲染器名称
  if (typeof cellRender === "string") {
    const renderer = builtinRenderers[cellRender];
    if (!renderer) {
      console.warn(`[ZxtTable] 未找到内置渲染器: ${cellRender}`);
      return params.cellValue ?? "";
    }
    return renderer(params);
  }

  // 2. 函数：直接调用
  if (typeof cellRender === "function") {
    return cellRender(params);
  }

  // 3. 对象：{ name, props, attrs, events, content }
  if (typeof cellRender === "object" && !Array.isArray(cellRender)) {
    const { name, props = {}, attrs = {}, events = {}, content } = cellRender;
    if (typeof name === "string" && builtinRenderers[name]) {
      // 内置渲染器 + 额外 props/attrs/events
      return builtinRenderers[name]({
        ...params,
        ...props,
        ...attrs,
        ...events,
      });
    }
    // 自定义组件渲染
    if (typeof name === "object" || typeof name === "function") {
      return h(name, { ...props, ...attrs, ...events }, content);
    }
    console.warn("[ZxtTable] cellRender 对象缺少有效的 name 字段");
    return params.cellValue ?? "";
  }

  // 兜底
  return params.cellValue ?? "";
}

/**
 * 注册全局自定义渲染器（供外部插件化）
 * @param {String} key
 * @param {Function} renderer
 */
export function registerRenderer(key, renderer) {
  if (builtinRenderers[key]) {
    console.warn(`[ZxtTable] 内置渲染器 ${key} 已被覆盖`);
  }
  builtinRenderers[key] = renderer;
}

export { builtinRenderers };
