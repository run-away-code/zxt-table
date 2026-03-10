/**
 * ZxtGrid 统一 Hook
 *
 * 整合 ZxtGrid 的配置、代理请求、事件处理、操作方法，与 ZxtGrid 组件 expose API 完全对齐。
 *
 * @example
 * // 代理模式 + 搜索表单 + 工具栏 + 事件处理，一步到位
 * const { gridRef, gridOptions, handleToolbarClick, handleActionClick } = useZxtGrid({
 *   id: 'user-list',
 *   columns: [...],
 *   fetchApi: getUserPage,
 *   formData: { name: '', status: '' },
 *   formItems: [
 *     { prop: 'name', label: '姓名', span: 6 },
 *     { prop: 'status', label: '状态', span: 6, type: 'select', options: [...] },
 *   ],
 *   toolbarButtons: [{ code: 'add', name: '新增', type: 'primary', icon: 'Plus' }],
 *   toolbarHandlers: {
 *     add: () => openDialog(),
 *     delete: (_, { getSelectedRows }) => batchDelete(getSelectedRows()),
 *     refresh: (_, { query }) => query(),
 *   },
 *   actionHandlers: {
 *     edit: ({ row }) => openDialog(row),
 *     delete: ({ row }) => deleteRow(row.id),
 *   },
 * })
 *
 * @example
 * // URL 参数回填 —— initialFormData 自动在 mount 时赋值并查询，无需手写 onMounted
 * const { gridRef, gridOptions } = useZxtGrid({
 *   id: 'order-list',
 *   columns: [...],
 *   fetchApi: getOrderPage,
 *   formData: { name: '', status: '' },
 *   formItems: [...],
 *   initialFormData: { status: Number(route.query.status) },
 * })
 *
 * @example
 * // 静态数据模式
 * const { gridRef, gridOptions } = useZxtGrid({
 *   id: 'local-grid',
 *   columns: [...],
 *   data: tableData,
 * })
 */

import { onMounted, reactive, ref } from 'vue'

// ============ 默认配置 ============

const DEFAULTS = {
  border: true,
  stripe: true,
  pageable: true,
  pageSizes: [10, 20, 50, 100],
  paginationLayout: 'total, sizes, prev, pager, next, jumper',
  height: 'full',
}

// 可直接映射到 gridOptions 的顶级 key
const GRID_OPTION_KEYS = [
  'id', 'columns', 'data', 'border', 'stripe', 'pageable',
  'pageSizes', 'paginationLayout', 'height', 'autoLoad',
  'spanMethod', 'cellStyle', 'formMode',
]

/** 从 source 中提取值不为 undefined 的字段 */
function pickDefined(source, keys) {
  const result = {}
  for (const key of keys) {
    if (source[key] !== undefined) result[key] = source[key]
  }
  return result
}

// ============ 核心 Hook ============

/**
 * @param {Object} options
 *
 * --- 基础配置 ---
 * @param {string}           options.id               - Grid 唯一标识
 * @param {Array}            options.columns           - 列配置（支持多级表头、actionColumn）
 * @param {Array}            [options.data]            - 静态数据（与 fetchApi 二选一）
 * @param {boolean}          [options.border=true]
 * @param {boolean}          [options.stripe=true]
 * @param {boolean}          [options.pageable=true]
 * @param {Array}            [options.pageSizes]
 * @param {string}           [options.paginationLayout]
 * @param {string|number}    [options.height='full']
 *
 * --- 代理请求 ---
 * @param {Function}         [options.fetchApi]        - 查询接口 (payload) => Promise<{ list, total }>
 * @param {Function}         [options.transform]       - 响应转换器，替代默认的 list/total 解析
 * @param {string}           [options.listField]       - 响应中列表字段名（默认 'list'）
 * @param {string}           [options.totalField]      - 响应中总数字段名（默认 'total'）
 * @param {Object}           [options.extraParams]     - 每次请求附加的固定参数
 * @param {boolean}          [options.autoLoad=true]   - 是否挂载时自动请求
 *
 * --- 搜索表单 ---
 * @param {Object}           [options.formData]        - 表单初始数据（定义字段结构）
 * @param {Array}            [options.formItems]       - 表单项配置
 * @param {Object}           [options.formRules]       - 表单校验规则
 * @param {Object}           [options.initialFormData] - 挂载时自动赋值的表单数据（如 URL 参数回填），隐含 autoLoad: false
 *
 * --- 工具栏 ---
 * @param {Array}            [options.toolbarButtons]  - 工具栏按钮配置
 *
 * --- 事件处理 ---
 * @param {Object.<string, Function>} [options.toolbarHandlers] - 工具栏事件 { [code]: (event, ctx) => void }
 * @param {Object.<string, Function>} [options.actionHandlers]  - 操作列事件 { [code]: (event, ctx) => void }
 *
 * --- 样式 / 高级 ---
 * @param {Function}         [options.spanMethod]      - 行合并方法
 * @param {Function|Object}  [options.cellStyle]       - 单元格样式
 * @param {boolean}          [options.formMode]        - 是否开启表单模式
 * @param {Object}           [options.overrides]       - 其余直接透传到 gridOptions 的属性
 */
export function useZxtGrid(options) {
  const gridRef = ref(null)

  // ---------- proxyConfig ----------
  let proxyConfig
  if (typeof options.fetchApi === 'function') {
    const { fetchApi, extraParams, transform, listField, totalField } = options

    const queryFn = extraParams
      ? (payload) => { Object.assign(payload, extraParams); return fetchApi(payload) }
      : fetchApi

    let response
    if (transform) {
      response = { transform }
    } else if (listField || totalField) {
      response = {}
      if (listField) response.listField = listField
      if (totalField) response.totalField = totalField
    }

    proxyConfig = {
      ajax: { query: queryFn },
      ...(response ? { response } : {}),
    }
  }

  // ---------- formConfig ----------
  let formConfig
  if (options.formData && options.formItems) {
    const effectiveData = options.initialFormData
      ? { ...options.formData, ...options.initialFormData }
      : options.formData

    formConfig = {
      data: effectiveData,
      items: options.formItems,
      ...(options.formRules ? { rules: options.formRules } : {}),
    }
  }

  // ---------- toolbar ----------
  const toolbar = options.toolbarButtons?.length
    ? { buttons: options.toolbarButtons }
    : undefined

  // ---------- gridOptions ----------
  const hasInitialFormData = options.initialFormData && Object.keys(options.initialFormData).length > 0

  const gridOptions = reactive({
    ...DEFAULTS,
    ...pickDefined(options, GRID_OPTION_KEYS),
    // initialFormData 隐含 autoLoad: false，由 hook 的 onMounted 控制首次请求
    ...(hasInitialFormData ? { autoLoad: false } : {}),
    ...(formConfig ? { formConfig } : {}),
    ...(toolbar ? { toolbar } : {}),
    ...(proxyConfig ? { proxyConfig } : {}),
    ...(options.overrides || {}),
  })

  // ============ 操作方法 ============

  const query = () => gridRef.value?.commitProxy('query')
  const reload = () => gridRef.value?.commitProxy('reload')
  const setFormData = (data, autoQuery = true) => gridRef.value?.setFormData(data, autoQuery)
  const getSelectedRows = () => gridRef.value?.getSelectedRows() || []
  const clearSelection = () => gridRef.value?.clearSelection()
  const getElTableRef = () => gridRef.value?.getElTableRef()
  const getFormRef = () => gridRef.value?.getFormRef()
  const doLayout = () => gridRef.value?.doLayout()

  // ============ 事件分发 ============

  const ctx = { query, reload, setFormData, getSelectedRows, clearSelection, gridRef }

  const handleToolbarClick = (event) => {
    const handler = options.toolbarHandlers?.[event.code]
    if (handler) handler(event, ctx)
  }

  const handleActionClick = (event) => {
    const handler = options.actionHandlers?.[event.code]
    if (handler) handler(event, ctx)
  }

  // ============ 初始表单数据自动回填 ============

  if (hasInitialFormData) {
    onMounted(() => {
      setFormData(options.initialFormData)
    })
  }

  // ============ 返回 ============

  return {
    gridRef,
    gridOptions,

    query,
    reload,
    setFormData,

    getSelectedRows,
    clearSelection,

    getElTableRef,
    getFormRef,
    doLayout,

    handleToolbarClick,
    handleActionClick,
  }
}
