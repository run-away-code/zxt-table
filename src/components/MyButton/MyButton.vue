<template>
  <button 
    class="my-button" 
    :class="[`my-button--${type}`, { 'is-disabled': disabled }]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'MyButton',
  props: {
    type: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'primary', 'success', 'warning', 'danger'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const handleClick = (event) => {
      emit('click', event)
    }

    return {
      handleClick
    }
  }
}
</script>

<style scoped>
.my-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: .1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}

.my-button--primary {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}

.my-button--success {
  color: #fff;
  background-color: #67c23a;
  border-color: #67c23a;
}

.my-button--warning {
  color: #fff;
  background-color: #e6a23c;
  border-color: #e6a23c;
}

.my-button--danger {
  color: #fff;
  background-color: #f56c6c;
  border-color: #f56c6c;
}

.my-button.is-disabled {
  cursor: not-allowed;
  opacity: 0.7;
}
</style>