import ZxtTable from "./ZxtTable.vue";
import { registerRenderer } from "./cellRenderer";
import rendererManager from "./rendererManager";

ZxtTable.install = function (app) {
  app.component(ZxtTable.name, ZxtTable);
};

// 扩展 ZxtTable 的静态属性
ZxtTable.registerRenderer = registerRenderer;
ZxtTable.renderer = rendererManager;

export default ZxtTable;
export { registerRenderer, rendererManager };
