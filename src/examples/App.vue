<template>
  <el-config-provider :locale="zhCn">
    <div class="container">
      <!-- 导航菜单 -->
      <div class="nav-menu">
        <el-menu
          :default-active="activeMenu"
          mode="horizontal"
          :router="true"
        >
          <el-menu-item index="/zxt-table">ZxtTable 基础表格</el-menu-item>
          <el-menu-item index="/zxt-grid">ZxtGrid 可配置表格</el-menu-item>
          <el-menu-item index="/zxt-grid-demo">ZxtGrid 独立 Demo</el-menu-item>
        </el-menu>
      </div>

      <!-- 路由内容：flex:1 占满剩余空间，min-height:0 允许内部滚动 -->
      <div class="router-view-wrapper">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import zhCn from "element-plus/es/locale/lang/zh-cn";

const route = useRoute();

// 当前激活的菜单（根据路由路径）
const activeMenu = computed(() => route.path || "/zxt-table");
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0;
  padding: 0 20px 20px;
  box-sizing: border-box;
  overflow: hidden;
}

.nav-menu {
  flex-shrink: 0;
  border-bottom: 1px solid #eee;
}

.router-view-wrapper {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
