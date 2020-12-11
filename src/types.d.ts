import { IVueI18n } from 'vue-i18n'

declare module 'vue-i18n' {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface IVueI18n {
    vm: Vue
  }
}
