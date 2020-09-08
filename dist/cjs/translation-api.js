"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.TranslationApi = void 0;
const axios_1 = __importDefault(require("axios"));
const flat_1 = __importStar(require("flat"));
class TranslationApi {
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
            const flatMessageKeys = Object.keys(flat_1.default(messages));
            const response = yield axios_1.default.post('https://translation.googleapis.com/language/translate/v2', params);
            return this.decode(response.data.data.translations[0].translatedText, flatMessageKeys);
        });
    }
    encode(input) {
        let outputXml = '';
        for (const [translationKey, translationValue] of Object.entries(flat_1.default(input))) {
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
        return flat_1.unflatten(output);
    }
}
exports.TranslationApi = TranslationApi;
