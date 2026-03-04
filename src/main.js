import { createApp } from 'vue'
import './style.css'
import App from './examples/App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// In a real application, you would import the library like this:
// import MyComponents from './index.js'

const app = createApp(App)
app.use(ElementPlus)
// app.use(MyComponents) // Register all components at once

// For development, we're importing components individually
// This is already done in App.vue

app.mount('#app')
