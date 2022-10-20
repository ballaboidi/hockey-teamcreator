import Vue from 'vue'

export default () => {
  Vue.filter('formatDate', (value) => {
    return new Date(value).toLocaleDateString('de-DE')
  })
}