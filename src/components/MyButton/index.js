import MyButton from './MyButton.vue'

MyButton.install = function(app) {
  app.component(MyButton.name, MyButton)
}

export default MyButton