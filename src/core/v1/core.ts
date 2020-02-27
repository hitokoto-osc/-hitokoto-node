/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import { ApiRequest, ResponseStruct, checkStatusCode } from './request'
import { AuthApi } from './auth'
import { SentenceApi } from './sentence'
import { LikeApi } from './like'
import { UserApi, GetUserInformationApi } from './user'

export class CoreApi {
  request = new ApiRequest()

  /**
   * 创建接口 SDK
   * @param {string} [token] 令牌
   * @returns {ApiRequest}
   */
  constructor (token?: string) {
    if (token) {
      if (token.length !== 40) {
        throw new Error('令牌的长度不正确')
      }
      this.request.token = token
    }
  }

  /**
   * 检验 Token 是否有效，如果有效才能进行其他的接口请求
   * @returns {Promise<CoreApi>}
   */
  async verifyToken (): Promise<CoreApi> {
    if (!this.request.token) {
      throw new Error('令牌无效')
    } else if (this.request.token.length !== 40) {
      throw new Error('令牌长度不符合')
    }
    const data: ResponseStruct<UserApi> = await this.request.get('/user')
    checkStatusCode(data)
    this.request.isValid = true
    return this
  }

  /**
   * 获得令牌
   * @returns {string} 令牌
   */
  get token () {
    return this.request.token
  }

  /**
   * 设置令牌
   * @param {string} token
   */
  set token (token: string) {
    if (token && token.length === 40) {
      this.request.token = token
      this.request.isValid = false
    } else {
      throw new Error('令牌长度不正确')
    }
  }
}

export interface CoreApi extends AuthApi, UserApi, LikeApi, SentenceApi {}
applyMixins(CoreApi, [AuthApi, UserApi, LikeApi, SentenceApi])

/**
 * 应用 Mixins
 * 来自：https://www.typescriptlang.org/docs/handbook/mixins.html
 * @param derivedCtor
 * @param baseCtors
 */
function applyMixins (derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      const value = Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
      if (value) {
        Object.defineProperty(derivedCtor.prototype, name, value)
      }
    })
  })
}
