"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendWithAutoI18n = void 0;
const isPlainObject_1 = __importDefault(require("lodash/isPlainObject"));
const merge_1 = __importDefault(require("lodash/merge"));
const reduce_1 = __importDefault(require("lodash/reduce"));
const translation_api_1 = require("./translation-api");
function excludeKeys(input, blacklistedPaths, path) {
    return reduce_1.default(input, (result, value, key) => {
        const currentPath = path ? `${path}.${key}` : key;
        if (isPlainObject_1.default(value)) {
            result[key] = excludeKeys(value, blacklistedPaths, path ? `${path}.${key}` : key);
        }
        else {
            if (!blacklistedPaths.includes(currentPath)) {
                result[key] = value;
            }
        }
        return result;
    }, {});
}
function extendWithAutoI18n(options) {
    const instance = options.i18nPluginInstance;
    const translator = new translation_api_1.TranslationApi(options.apiKey, options.apiProxyURL);
    function translate(newLocale) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const instance = options.i18nPluginInstance;
            const newLocaleMessages = instance.getLocaleMessage(newLocale);
            const newLocaleHasMessages = Object.keys(newLocaleMessages).length;
            if (newLocaleHasMessages) {
                return;
            }
            const sourceMessages = instance.messages[options.sourceLanguage];
            let messagesForTranslation = sourceMessages;
            messagesForTranslation = excludeKeys(messagesForTranslation, (_a = options.blacklistedPaths) !== null && _a !== void 0 ? _a : []);
            let translatedMessages = yield translator.translate(newLocale, messagesForTranslation);
            translatedMessages = merge_1.default(sourceMessages, translatedMessages);
            instance.setLocaleMessage(newLocale, translatedMessages);
        });
    }
    if (options.automatic === undefined || options.automatic) {
        instance.vm.$watch('locale', translate);
    }
    return translate;
}
exports.extendWithAutoI18n = extendWithAutoI18n;
