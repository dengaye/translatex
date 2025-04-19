export interface TranslationServiceConfig {
  id: string;
  name: string;
  description: string;
  apiConfig: {
    baseUrl: string;
    endpoints: {
      translate: string;
      [key: string]: string;
    };
    headers?: Record<string, string>;
    params?: Record<string, string>;
  };
  authConfig: {
    type: 'apiKey' | 'appKeySecret' | 'oauth2';
    fields: Array<{
      key: string;
      label: string;
      type: 'text' | 'password';
      required: boolean;
      placeholder?: string;
    }>;
  };
  features: {
    maxTextLength?: number;
    supportedLanguages?: string[];
    [key: string]: any;
  };
}

export const translationServiceConfigs: Record<string, TranslationServiceConfig> = {
  youdao: {
    id: 'youdao',
    name: 'Youdao Translation',
    description: 'Professional translation service by Youdao',
    apiConfig: {
      baseUrl: 'https://openapi.youdao.com',
      endpoints: {
        translate: '/api',
      },
      params: {
        q: '',
        from: '',
        to: '',
        appKey: '',
        salt: '',
        sign: '',
        signType: 'v3',
        curtime: '',
      },
    },
    authConfig: {
      type: 'appKeySecret',
      fields: [
        {
          key: 'appKey',
          label: 'App Key',
          type: 'text',
          required: true,
          placeholder: 'Enter your Youdao App Key',
        },
        {
          key: 'appSecret',
          label: 'App Secret',
          type: 'password',
          required: true,
          placeholder: 'Enter your Youdao App Secret',
        },
      ],
    },
    features: {
      maxTextLength: 5000,
      supportedLanguages: ['zh-CHS', 'en', 'ja', 'ko', 'fr', 'ru', 'es', 'pt', 'de', 'it'],
    },
  },
  deepl: {
    id: 'deepl',
    name: 'DeepL Translation',
    description: 'High-quality neural machine translation by DeepL',
    apiConfig: {
      baseUrl: 'https://api-free.deepl.com/v2',
      endpoints: {
        translate: '/translate',
      },
      headers: {
        'Authorization': 'DeepL-Auth-Key',
        'Content-Type': 'application/json',
      },
    },
    authConfig: {
      type: 'apiKey',
      fields: [
        {
          key: 'apiKey',
          label: 'API Key',
          type: 'password',
          required: true,
          placeholder: 'Enter your DeepL API Key',
        },
      ],
    },
    features: {
      maxTextLength: 5000,
      supportedLanguages: ['EN', 'DE', 'FR', 'ES', 'PT', 'IT', 'NL', 'PL', 'RU', 'JA', 'KO', 'ZH'],
    },
  },
}; 