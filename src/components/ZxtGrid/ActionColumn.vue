<template>
  <div class="action-column">
    <!-- 平铺显示的按钮（前 maxVisible 个） -->
    <el-button
      v-for="btn in visibleButtons"
      :key="btn.code"
      :type="btn.type || ''"
      :icon="getIconComponent(btn.icon)"
      size="small"
      link
      @click="handleClick(btn)"
    >
      {{ btn.label }}
    </el-button>

    <!-- 更多下拉菜单 -->
    <el-dropdown
      v-if="overflowButtons.length"
      trigger="hover"
      @command="handleCommand"
    >
      <el-button
        type=""
        size="small"
        link
      >
        更多
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="btn in overflowButtons"
            :key="btn.code"
            :command="btn"
            :icon="getIconComponent(btn.icon)"
          >
            {{ btn.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import {
  ArrowDown,
  Plus,
  Delete,
  Refresh,
  Download,
  Search,
  Edit,
  View,
  Upload,
  Setting,
  Warning,
  Check,
  Close,
  Document,
  CopyDocument,
  Share,
  Lock,
  Unlock,
} from "@element-plus/icons-vue";

const iconMap = {
  Plus,
  Delete,
  Refresh,
  Download,
  Search,
  Edit,
  View,
  Upload,
  Setting,
  Warning,
  Check,
  Close,
  Document,
  CopyDocument,
  Share,
  Lock,
  Unlock,
  ArrowDown,
};

export default defineComponent({
  name: "ActionColumn",
  components: { ArrowDown },
  props: {
    buttons: {
      type: Array,
      default: () => [],
    },
    row: {
      type: Object,
      default: () => ({}),
    },
    maxVisible: {
      type: Number,
      default: 2,
    },
  },
  emits: ["action-click"],
  setup(props, { emit }) {
    const resolvedButtons = computed(() => {
      return props.buttons.filter((btn) => {
        if (typeof btn.visible === "function") return btn.visible(props.row);
        if (typeof btn.visible === "boolean") return btn.visible;
        return true;
      });
    });

    const needCollapse = computed(
      () => resolvedButtons.value.length > props.maxVisible
    );

    const visibleButtons = computed(() =>
      needCollapse.value
        ? resolvedButtons.value.slice(0, props.maxVisible)
        : resolvedButtons.value
    );

    const overflowButtons = computed(() =>
      needCollapse.value
        ? resolvedButtons.value.slice(props.maxVisible)
        : []
    );

    const getIconComponent = (iconName) => {
      if (!iconName) return undefined;
      if (typeof iconName === "object" || typeof iconName === "function")
        return iconName;
      return iconMap[iconName];
    };

    const handleClick = (btn) => {
      emit("action-click", { code: btn.code, button: btn, row: props.row });
    };

    const handleCommand = (btn) => {
      emit("action-click", { code: btn.code, button: btn, row: props.row });
    };

    return {
      visibleButtons,
      overflowButtons,
      getIconComponent,
      handleClick,
      handleCommand,
    };
  },
});
</script>

<style scoped>
.action-column {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-wrap: nowrap;
}
</style>
