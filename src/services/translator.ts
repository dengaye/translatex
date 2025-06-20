import axios from 'axios'
import crypto from 'crypto'

/**
 * 翻译服务类
 */
export class TranslatorService {
  /**
   * 使用有道翻译API进行翻译
   * @param text 要翻译的文本
   * @param from 源语言，auto为自动检测
   * @param to 目标语言
   * @returns 翻译结果
   */
  static async youdaoTranslate(text: string, from = 'auto', to = 'zh-CHS'): Promise<TranslationResult> {
    try {
      // 有道智云API基本参数
      const url = 'https://openapi.youdao.com/api'

      // 这里需要用户自行注册有道智云API并获取应用ID和密钥
      // https://ai.youdao.com/
      const appId = '' // 用户需填写自己的应用ID
      const appSecret = '' // 用户需填写自己的应用密钥

      // 如果没有密钥，返回一个模拟结果用于演示
      if (!appId || !appSecret) {
        console.warn('未配置有道智云API密钥，返回模拟结果')
        return {
          success: true,
          translation: `[模拟翻译] ${text}`,
          original: text
        }
      }

      const salt = new Date().getTime()
      const curtime = Math.round(new Date().getTime() / 1000)
      const sign = this.generateSign(appId, text, salt, curtime, appSecret)

      const response = await axios.post(url, {
        q: text,
        from,
        to,
        appKey: appId,
        salt,
        sign,
        signType: 'v3',
        curtime
      })

      if (response.data.errorCode === '0') {
        return {
          success: true,
          translation: response.data.translation[0],
          original: text,
          dict: response.data.basic ? response.data.basic.explains : []
        }
      } else {
        throw new Error(`有道翻译API错误: ${response.data.errorCode}`)
      }
    } catch (error) {
      console.error('有道翻译出错:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        original: text
      }
    }
  }

  /**
   * 生成有道API签名
   */
  static generateSign(appId: string, text: string, salt: number, curtime: number, appSecret: string): string {
    const input = text.length > 20 ? text.substring(0, 10) + text.length + text.substring(text.length - 10) : text
    const raw = appId + input + salt + curtime + appSecret
    return crypto.createHash('sha256').update(raw).digest('hex')
  }

  /**
   * 使用DeepL免费API进行翻译
   * @param text 要翻译的文本
   * @param targetLang 目标语言
   * @returns 翻译结果
   */
  static async deeplTranslate(text: string, targetLang = 'ZH'): Promise<TranslationResult> {
    try {
      // DeepL API基本参数
      const url = 'https://api-free.deepl.com/v2/translate'

      // 用户需要注册并获取DeepL API密钥
      // https://www.deepl.com/pro-api
      const authKey = '' // 用户需填写自己的DeepL API密钥

      // 如果没有密钥，返回一个模拟结果用于演示
      if (!authKey) {
        console.warn('未配置DeepL API密钥，返回模拟结果')
        return {
          success: true,
          translation: `[模拟翻译] ${text}`,
          original: text
        }
      }

      const response = await axios.post(
        url,
        `auth_key=${authKey}&text=${encodeURIComponent(text)}&target_lang=${targetLang}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )

      if (response.data && response.data.translations && response.data.translations.length > 0) {
        return {
          success: true,
          translation: response.data.translations[0].text,
          original: text,
          detectedSourceLang: response.data.translations[0].detected_source_language
        }
      } else {
        throw new Error('DeepL翻译返回了空结果')
      }
    } catch (error) {
      console.error('DeepL翻译出错:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        original: text
      }
    }
  }

  /**
   * 翻译文本，自动选择合适的翻译API
   * @param text 要翻译的文本
   * @param api 要使用的API，默认为有道
   * @returns 翻译结果
   */
  static async translate(text: string, api = 'youdao'): Promise<TranslationResult> {
    if (!text || text.trim() === '') {
      return {
        success: false,
        error: '翻译文本不能为空',
        original: text
      }
    }

    switch (api.toLowerCase()) {
      case 'deepl':
        return await this.deeplTranslate(text)
      case 'youdao':
      default:
        return await this.youdaoTranslate(text)
    }
  }
}

export interface TranslationResult {
  success: boolean
  translation?: string
  original: string
  error?: string
  dict?: string[]
  detectedSourceLang?: string
}

export default TranslatorService
