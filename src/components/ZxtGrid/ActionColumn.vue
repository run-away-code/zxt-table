<template>
  <div class="action-column">
    <!-- 平铺显示的按钮（前 maxVisible 个） -->
    <el-button
      v-for="btn in visibleButtons"
      :key="btn.code"
      class="action-btn"
      :type="btn.type || ''"
      :icon="getIconComponent(btn.icon)"
      size="small"
      link
      @mousedown.prevent
      @click="handleClick(btn, $event)"
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
        class="action-btn"
        type=""
        size="small"
        link
        @mousedown.prevent
        @click="handleTriggerClick"
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

    console.log("[ActionColumn][5] props.buttons =", props.buttons);
    console.log("[ActionColumn][5] row =", props.row);
    console.log("[ActionColumn][5] resolvedButtons =", resolvedButtons.value);
    console.log("[ActionColumn][5] visibleButtons =", visibleButtons.value);
    console.log("[ActionColumn][5] overflowButtons =", overflowButtons.value);

    const getIconComponent = (iconName) => {
      if (!iconName) return undefined;
      if (typeof iconName === "object" || typeof iconName === "function")
        return iconName;
      return iconMap[iconName];
    };

    const blurButton = (event) => {
      event?.currentTarget?.blur?.();
    };

    const handleClick = (btn, event) => {
      blurButton(event);
      emit("action-click", { code: btn.code, button: btn, row: props.row });
    };

    const handleCommand = (btn) => {
      emit("action-click", { code: btn.code, button: btn, row: props.row });
    };

    const handleTriggerClick = (event) => {
      blurButton(event);
    };

    return {
      visibleButtons,
      overflowButtons,
      getIconComponent,
      handleClick,
      handleCommand,
      handleTriggerClick,
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

/* 操作列按钮点击/聚焦后不显示边框或高亮轮廓 */
:deep(.action-column .action-btn.el-button:focus),
:deep(.action-column .action-btn.el-button:focus-visible),
:deep(.action-column .action-btn.el-button:active),
:deep(.action-column .action-btn:focus),
:deep(.action-column .action-btn:focus-visible),
:deep(.action-column .action-btn:active) {
  outline: none;
  box-shadow: none;
}
</style>
