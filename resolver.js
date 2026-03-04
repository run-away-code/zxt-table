/**
 * ZxtTable Resolver for unplugin-vue-components
 *
 * 使用方法 (vite.config.js):
 * import { ZxtTableResolver } from 'zxt-table/resolver'
 *
 * Components({
 *   resolvers: [
 *     ZxtTableResolver()
 *   ]
 * })
 */
function ZxtTableResolver(options = {}) {
  return {
    type: "component",
    resolve: (name) => {
      // 匹配以 Zxt 开头的组件 (ZxtTable, ZxtGrid, ZxtForm, ZxtPagination 等)
      if (name.startsWith("Zxt")) {
        return {
          name: name,
          from: "zxt-table",
          sideEffects: [
            // 自动引入 ZxtTable 样式
            "zxt-table/style.css",
            // 自动引入 Element Plus 全量样式 (解决样式丢失问题)
            // 如果用户明确配置了 importStyle: false，则不自动引入 Element 样式
            options.importStyle !== false ? "element-plus/dist/index.css" : "",
          ].filter(Boolean),
        };
      }
    },
  };
}

module.exports = { ZxtTableResolver };
