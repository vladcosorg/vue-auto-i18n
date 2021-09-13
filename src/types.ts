import { createI18n, LocaleMessages } from 'vue-i18n'

export type VueI18nOptions = Parameters<typeof createI18n>[0]
export type VueI18nReturn = ReturnType<typeof createI18n>
export type VueI18nMessages = VueI18nOptions['messages']
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Messages = LocaleMessages<any>
