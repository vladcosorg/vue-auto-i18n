import { TranslationApi } from './translation-api';
export default {
    install(vue, options) {
        const instance = options.i18nPluginInstance;
        const translator = new TranslationApi(options.apiKey);
        instance.vm.$watch('locale', async (newLocale) => {
            const newLocaleMessages = instance.getLocaleMessage(newLocale);
            const newLocaleHasMessages = Object.keys(newLocaleMessages).length;
            if (newLocaleHasMessages) {
                return;
            }
            const sourceMessages = instance.getLocaleMessage(options.sourceLanguage);
            const translatedMessages = await translator.translate(newLocale, sourceMessages);
            console.log(translatedMessages);
            instance.setLocaleMessage(newLocale, translatedMessages);
        }, { immediate: true });
    },
};
