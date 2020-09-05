import { VueConstructor } from 'vue/types/vue';
import { IVueI18n, Locale } from 'vue-i18n';
interface Options {
    i18nPluginInstance: IVueI18n;
    apiKey: string;
    sourceLanguage: Locale;
}
declare const _default: {
    install(vue: VueConstructor, options: Options): void;
};
export default _default;
//# sourceMappingURL=index.d.ts.map