export interface ApiKey {
  name: string
  label: string
  placeholder: string
  type?: 'text' | 'password'
}

export interface TranslationService {
  id: string
  name: string
  description: string
  apiKeys: ApiKey[]
}

export interface ApiKeys {
  [key: string]: string
}

export const translationServiceKeys: TranslationService[] = [
  {
    id: 'youdao',
    name: '有道翻译',
    description: '使用有道翻译 API 进行翻译',
    apiKeys: [
      {
        name: 'youdao_app_key',
        label: '应用 ID',
        placeholder: '请输入有道翻译应用 ID',
        type: 'text'
      },
      {
        name: 'youdao_app_secret',
        label: '应用密钥',
        placeholder: '请输入有道翻译应用密钥',
        type: 'password'
      }
    ]
  },
  {
    id: 'deepl',
    name: 'DeepL',
    description: '使用 DeepL API 进行翻译',
    apiKeys: [
      {
        name: 'deepl_api_key',
        label: 'API 密钥',
        placeholder: '请输入 DeepL API 密钥',
        type: 'password'
      }
    ]
  }
] 