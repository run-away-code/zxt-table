import MyButton from "./components/MyButton";
import JsxButton from "./components/JsxButton";
import ZxtTable from "./components/ZxtTable";
import ZxtGrid from "./components/ZxtGrid/ZxtGrid.vue";
import ZxtForm from "./components/ZxtForm/ZxtForm.vue";
import ZxtPagination from "./components/ZxtPagination";

const components = [
  MyButton,
  JsxButton,
  ZxtTable,
  ZxtGrid,
  ZxtForm,
  ZxtPagination,
];

const install = (app) => {
  components.forEach((component) => {
    app.component(component.name, component);
  });
};

// 主模块对象
const ZxtTableLib = {
  install,
  MyButton,
  JsxButton,
  ZxtTable,
  ZxtGrid,
  ZxtForm,
  ZxtPagination,
  // 暴露渲染器 API
  renderer: ZxtTable.renderer,
  registerRenderer: ZxtTable.registerRenderer,
};

export default ZxtTableLib;

export { MyButton, JsxButton, ZxtTable, ZxtGrid, ZxtForm, ZxtPagination };
