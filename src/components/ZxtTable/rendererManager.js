import { h } from "vue";

// 全局渲染器存储
const globalRenderers = new Map();

/**
 * 渲染器管理器
 */
class RendererManager {
  /**
   * 注册自定义渲染器
   * @param {String} name - 渲染器名称
   * @param {Object} config - 渲染器配置对象
   * @example
   * renderer.add('XSelect', {
   *   renderItemContent(renderOpts, params) {
   *     // params: { data, field, item }
   *     return vnode
   *   }
   * })
   */
  add(name, config) {
    if (!name || typeof name !== "string") {
      console.warn("[ZxtTable] 渲染器名称必须是字符串");
      return this;
    }

    if (!config || typeof config !== "object") {
      console.warn("[ZxtTable] 渲染器配置必须是对象");
      return this;
    }

    if (globalRenderers.has(name)) {
      console.warn(`[ZxtTable] 渲染器 "${name}" 已存在，将被覆盖`);
    }

    globalRenderers.set(name, config);
    return this;
  }

  /**
   * 获取渲染器
   * @param {String} name - 渲染器名称
   * @returns {Object|undefined}
   */
  get(name) {
    return globalRenderers.get(name);
  }

  /**
   * 删除渲染器
   * @param {String} name - 渲染器名称
   */
  delete(name) {
    return globalRenderers.delete(name);
  }

  /**
   * 检查渲染器是否存在
   * @param {String} name - 渲染器名称
   * @returns {Boolean}
   */
  has(name) {
    return globalRenderers.has(name);
  }

  /**
   * 获取所有渲染器名称
   * @returns {Array<String>}
   */
  getAll() {
    return Array.from(globalRenderers.keys());
  }

  /**
   * 清空所有自定义渲染器
   */
  clear() {
    globalRenderers.clear();
  }
}

// 创建单例
const rendererManager = new RendererManager();

/**
 * 渲染表单项内容
 * @param {Object} item - 表单项配置
 * @param {Object} formData - 表单数据
 * @param {Object} renderOpts - 渲染选项
 * @returns {VNode|null}
 */
export function renderFormItem(item, formData, renderOpts = {}) {
  if (!item || !item.itemRender) {
    return null;
  }

  const { name } = item.itemRender;

  // 检查是否有自定义渲染器
  if (name && rendererManager.has(name)) {
    const renderer = rendererManager.get(name);

    if (typeof renderer.renderItemContent === "function") {
      const params = {
        data: formData,
        field: item.field || item.prop,
        item: item,
        formData: formData,
      };

      try {
        return renderer.renderItemContent(renderOpts, params);
      } catch (error) {
        console.error(`[ZxtTable] 渲染器 "${name}" 执行出错:`, error);
        return null;
      }
    }
  }

  return null;
}

export { rendererManager };
export default rendererManager;
