import { IVueI18n, Locale } from 'vue-i18n';
export interface Options {
    i18nPluginInstance: IVueI18n;
    apiKey: string;
    sourceLanguage: Locale;
    apiProxyURL?: string;
    automatic?: boolean;
    blacklistedPaths?: string[];
}
export declare function extendWithAutoI18n(options: Options): (newLocale: string) => void;
//# sourceMappingURL=index.d.ts.map