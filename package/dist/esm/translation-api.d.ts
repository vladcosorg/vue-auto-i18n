import { Locale, LocaleMessageObject } from 'vue-i18n';
export declare class TranslationApi {
    private readonly apiKey;
    private readonly apiProxyURL?;
    constructor(apiKey: string, apiProxyURL?: string | undefined);
    translate(targetLanguage: Locale, messages: LocaleMessageObject): Promise<LocaleMessageObject>;
    private encode;
    private decode;
}
//# sourceMappingURL=translation-api.d.ts.map