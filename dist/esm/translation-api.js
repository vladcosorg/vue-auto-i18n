import axios from 'axios';
import flatten, { unflatten } from 'flat';
export class TranslationApi {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    async translate(targetLanguage, messages) {
        const params = new URLSearchParams({
            q: this.encode(messages),
            target: targetLanguage,
            format: 'html',
            key: this.apiKey,
        });
        const flatMessageKeys = Object.keys(flatten(messages));
        const response = await axios.post('https://translation.googleapis.com/language/translate/v2', params);
        return this.decode(response.data.data.translations[0].translatedText, flatMessageKeys);
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
