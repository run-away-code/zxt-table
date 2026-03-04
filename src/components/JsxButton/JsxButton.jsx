import { defineComponent, ref } from 'vue'
import './style.css'

export default defineComponent({
  name: 'JsxButton',
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
  setup(props, { emit, slots }) {
    const handleClick = (event) => {
      if (!props.disabled) {
        emit('click', event)
      }
    }

    return () => (
      <button 
        class={[
          'jsx-button', 
          `jsx-button--${props.type}`, 
          { 'is-disabled': props.disabled }
        ]}
        disabled={props.disabled}
        onClick={handleClick}
      >
        {/* 使用默认插槽 */}
        {slots.default?.()}
      </button>
    )
  }
})