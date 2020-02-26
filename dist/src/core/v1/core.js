"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const request_1 = require("./request");
const auth_1 = require("./auth");
const sentence_1 = require("./sentence");
const like_1 = require("./like");
const user_1 = require("./user");
class CoreApi {
    /**
     * 创建接口 SDK
     * @param {string} [token] 令牌
     * @returns {ApiRequest}
     */
    constructor(token) {
        this.request = new request_1.ApiRequest();
        this.isValid = false;
        if (token) {
            if (token.length !== 40) {
                throw new Error('令牌的长度不正确');
            }
            this.request.Token = token;
        }
    }
    /**
     * 检验 Token 是否有效，如果有效才能进行其他的接口请求
     * @returns {Promise<boolean>}
     */
    async verifyToken() {
        if (!this.request.Token) {
            return false;
        }
        else if (this.request.Token.length !== 40) {
            return false;
        }
        const data = await this.request.get('/user');
        if (data.status === 200) {
            this.isValid = true;
        }
        return data.status === 200;
    }
    /**
     * 获得令牌
     * @returns {string} 令牌
     */
    get token() {
        return this.request.Token;
    }
    /**
     * 设置令牌
     * @param {string} token
     */
    set token(token) {
        if (token && token.length === 40) {
            this.request.Token = token;
        }
        else {
            throw new Error('令牌长度不正确');
        }
    }
}
exports.CoreApi = CoreApi;
applyMixins(CoreApi, [auth_1.AuthApi, user_1.UserApi, like_1.LikeApi, sentence_1.SentenceApi]);
/**
 * 应用 Mixins
 * 来自：https://www.typescriptlang.org/docs/handbook/mixins.html
 * @param derivedCtor
 * @param baseCtors
 */
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            const value = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);
            if (value) {
                Object.defineProperty(derivedCtor.prototype, name, value);
            }
        });
    });
}
//# sourceMappingURL=core.js.map