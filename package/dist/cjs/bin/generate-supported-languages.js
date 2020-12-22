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
// eslint-disable-next-line import/no-unused-modules
const dotenv_1 = require("dotenv");
const fs_extra_1 = require("fs-extra");
const prettier_1 = require("prettier");
const node_fetch_1 = __importDefault(require("node-fetch"));
dotenv_1.config();
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const request = yield node_fetch_1.default('https://translation.googleapis.com/language/translate/v2/languages?' +
            new URLSearchParams({
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                key: process.env.GOOGLE_API_KEY,
            }));
        const response = yield request.json();
        const languages = response.data.languages.map((entry) => entry.language);
        yield fs_extra_1.outputFile('./dist/supported-languages/google.json', prettier_1.format(JSON.stringify(languages), {
            parser: 'json-stringify',
        }));
    });
}
run().then(() => '');
