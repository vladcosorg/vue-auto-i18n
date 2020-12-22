var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import flatten, { unflatten } from 'flat';
import fetch from 'node-fetch';
import { InformativeError } from './error';
export class TranslationApi {
    constructor(apiKey, apiProxyURL) {
        this.apiKey = apiKey;
        this.apiProxyURL = apiProxyURL;
    }
    translate(targetLanguage, messages) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const params = new URLSearchParams({
                q: this.encode(messages),
                target: targetLanguage,
                format: 'html',
                key: this.apiKey,
            });
            const flatMessageKeys = Object.keys(flatten(messages));
            const response = yield fetch((_a = this.apiProxyURL) !== null && _a !== void 0 ? _a : 'https://translation.googleapis.com/language/translate/v2', { method: 'POST', body: params });
            const jsonReponse = yield response.json();
            if (!response.ok) {
                if (jsonReponse.error) {
                    throw new Error(`${jsonReponse.error.message} [${jsonReponse.error.code} ${jsonReponse.error.status}]`);
                }
                throw new InformativeError('The API return an error response', {
                    data: jsonReponse,
                });
            }
            const translatedText = (_d = (_c = (_b = jsonReponse) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.translations[0]) === null || _d === void 0 ? void 0 : _d.translatedText;
            if (!translatedText) {
                throw new InformativeError('Unexpected response structure', {
                    response,
                });
            }
            return this.decode(translatedText, flatMessageKeys);
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
