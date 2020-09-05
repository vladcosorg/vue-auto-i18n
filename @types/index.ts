import { IVueI18n } from 'vue-i18n'
declare module 'vue-i18n' {
  interface IVueI18n {
    vm: Vue
  }
}
