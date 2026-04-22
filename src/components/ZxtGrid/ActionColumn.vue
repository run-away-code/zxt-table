<template>
  <div class="action-column zxt-grid-action-column">
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
      @visible-change="handleMoreDropdownVisible"
    >
      <el-button
        ref="moreTriggerRef"
        class="action-btn zxt-grid-action-more"
        :type="moreType || ''"
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
import { defineComponent, computed, ref, nextTick } from "vue";
import {
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
} from "element-plus";

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
  components: {
    ElButton,
    ElDropdown,
    ElDropdownItem,
    ElDropdownMenu,
    ElIcon,
    ArrowDown,
  },
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
    /** 与 ButtonConfig.type 一致，控制「更多」链接按钮主题色；不传为默认灰色 */
    moreType: {
      type: String,
      default: "",
    },
  },
  emits: ["action-click"],
  setup(props, { emit }) {
    const moreTriggerRef = ref(null);

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

    const handleMoreDropdownVisible = (visible) => {
      if (visible) return;
      nextTick(() => {
        const inst = moreTriggerRef.value;
        const root = inst?.$el ?? inst;
        const active = document.activeElement;
        if (
          root &&
          active &&
          typeof root.contains === "function" &&
          root.contains(active)
        ) {
          active.blur();
        }
      });
    };

    return {
      moreTriggerRef,
      visibleButtons,
      overflowButtons,
      getIconComponent,
      handleClick,
      handleCommand,
      handleTriggerClick,
      handleMoreDropdownVisible,
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

/*
 * 覆盖 EP `.el-button:focus-visible { outline: 2px solid ... }`（scoped）
 */
:deep(.action-column .action-btn.el-button:is(:focus, :focus-visible, :active)) {
  outline: none !important;
  outline-offset: 0 !important;
  box-shadow: none !important;
}

:deep(.action-column .el-dropdown .el-tooltip__trigger:focus-visible) {
  outline: none !important;
  outline-offset: 0 !important;
}
</style>

<!-- 与 el-tooltip__trigger 合并到同一 button 节点时，宿主应用内 EP 样式顺序可能压过 scoped；用根类限定 + 非 scoped 保证覆盖 -->
<style>
.zxt-grid-action-column .action-btn.el-button.is-link {
  --el-button-outline-color: transparent;
}

.zxt-grid-action-column .action-btn.el-button.is-link:is(:focus, :focus-visible, :active),
.zxt-grid-action-column .zxt-grid-action-more.el-button.el-tooltip__trigger:is(
    :focus,
    :focus-visible,
    :active
  ) {
  outline: none !important;
  outline-offset: 0 !important;
  box-shadow: none !important;
  border-color: transparent !important;
}
</style>
