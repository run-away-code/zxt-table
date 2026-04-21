# Vue3 + Element Plus 项目规范
## 技术栈
- 框架：Vue 3 (Composition API + <script setup>)
- UI 库：Element Plus
- 语言：TypeScript
- 构建：Vite
- 样式：SCSS / scoped

## 组件开发规则
1. 所有 UI 必须使用 Element Plus 官方组件
2. 表单：ElForm + 校验规则 + 提交/重置逻辑
3. 表格：ElTable + ElPagination 分页 + 搜索筛选
4. 弹窗：ElDialog + 关闭清空 + 确认/取消
5. 状态：使用 ref/reactive，禁止过度复杂
6. 接口请求：统一使用 async/await
7. 工具函数：放在 src/utils/
8. 接口定义：放在 src/api/
9. 类型定义：放在 src/types/
