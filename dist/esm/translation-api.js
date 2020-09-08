var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import flatten, { unflatten } from 'flat';
export class TranslationApi {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    translate(targetLanguage, messages) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = new URLSearchParams({
                q: this.encode(messages),
                target: targetLanguage,
                format: 'html',
                key: this.apiKey,
            });
            const flatMessageKeys = Object.keys(flatten(messages));
            const response = yield axios.post('https://translation.googleapis.com/language/translate/v2', params);
            return this.decode(response.data.data.translations[0].translatedText, flatMessageKeys);
        });
    }
    encode(input) {
        let outputXml = '';
        for (const [translationKey, translationValue] of Object.entries(flatten(input))) {
            outputXml += `<${translationKey}>${translationValue}</${translationKey}>`;
        }
        return outputXml;
    }
    decode(input, keys) {
        const output = {};
        for (const translationKey of keys) {
            const regex = new RegExp(`<${translationKey}>(.*?)</${translationKey}>`);
            const match = input.match(regex);
            if (!match) {
                continue;
            }
            output[translationKey] = match[1].trim();
        }
        return unflatten(output);
    }
}
