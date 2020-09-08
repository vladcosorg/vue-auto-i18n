var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TranslationApi } from './translation-api';
export default {
    install(vue, options) {
        const instance = options.i18nPluginInstance;
        const translator = new TranslationApi(options.apiKey);
        instance.vm.$watch('locale', (newLocale) => __awaiter(this, void 0, void 0, function* () {
            const newLocaleMessages = instance.getLocaleMessage(newLocale);
            const newLocaleHasMessages = Object.keys(newLocaleMessages).length;
            if (newLocaleHasMessages) {
                return;
            }
            const sourceMessages = instance.getLocaleMessage(options.sourceLanguage);
            const translatedMessages = yield translator.translate(newLocale, sourceMessages);
            console.log(translatedMessages);
            instance.setLocaleMessage(newLocale, translatedMessages);
        }), { immediate: true });
    },
};
