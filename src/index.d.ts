import type { DefineComponent, App } from "vue";

export interface ZxtTableProps {
  id?: string;
  columns?: any[];
  data?: any[];
  height?: string | number;
  pageable?: boolean;
  currentPage?: number;
  pageSize?: number;
  pageSizes?: number[];
  total?: number;
  paginationLayout?: string;
  proxyConfig?: any;
  [key: string]: any;
}

export interface ZxtTableRenderer {
  add(name: string, render: any): void;
  get(name: string): any;
  mixin(map: any): void;
  delete(name: string): void;
}

export declare const ZxtTable: DefineComponent<ZxtTableProps> & {
  install(app: App): void;
  renderer: ZxtTableRenderer;
  registerRenderer: (name: string, render: any) => void;
};

export declare const MyButton: DefineComponent;
export declare const JsxButton: DefineComponent;
export declare const ZxtGrid: DefineComponent;
export declare const ZxtForm: DefineComponent;
export declare const ZxtPagination: DefineComponent;

declare const ZxtTableLib: {
  install(app: App): void;
  MyButton: typeof MyButton;
  JsxButton: typeof JsxButton;
  ZxtTable: typeof ZxtTable;
  ZxtGrid: typeof ZxtGrid;
  ZxtForm: typeof ZxtForm;
  ZxtPagination: typeof ZxtPagination;
  renderer: ZxtTableRenderer;
  registerRenderer: (name: string, render: any) => void;
};

export default ZxtTableLib;
