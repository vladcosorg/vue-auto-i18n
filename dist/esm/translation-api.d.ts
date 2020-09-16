import { Locale, LocaleMessageObject } from 'vue-i18n';
export declare type TranslationAPIResponse = {
    data: {
        translations: {
            translatedText: string;
        }[];
    };
};
export declare class TranslationApi {
    private readonly apiKey;
    constructor(apiKey: string);
    translate(targetLanguage: Locale, messages: LocaleMessageObject): Promise<LocaleMessageObject>;
    private encode;
    private decode;
}
//# sourceMappingURL=translation-api.d.ts.map