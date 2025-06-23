import { useSettingsStore } from '@/stores/settings'

interface TranslationConfig {
  baseUrl: string
}

const YOUDAO_CONFIG: TranslationConfig = {
  baseUrl: 'https://openapi.youdao.com/api'
}

const DEEPL_CONFIG: TranslationConfig = {
  baseUrl: 'https://api-free.deepl.com/v2/translate'
}

export const translateWithYoudao = async (text: string, from: string, to: string) => {
  const settingsStore = useSettingsStore()
  const { youdao_app_key: youdaoAppKey, youdao_app_secret: youdaoAppSecret } = settingsStore.apiKeys

  if (!youdaoAppKey || !youdaoAppSecret) {
    throw new Error('Youdao API credentials not configured')
  }

  const salt = Date.now()
  const curtime = Math.round(Date.now() / 1000)
  const input = getInput(text)
  const sign = await sha256(youdaoAppKey + input + salt + curtime + youdaoAppSecret)

  const params = new URLSearchParams({
    q: text,
    from,
    to,
    appKey: youdaoAppKey,
    salt: salt.toString(),
    sign,
    signType: 'v3',
    curtime: curtime.toString()
  })

  const response = await fetch(`${YOUDAO_CONFIG.baseUrl}?${params}`)

  if (!response.ok) throw new Error('Youdao translation failed')

  const data = await response.json()
  return data.translation[0]
}

export const translateWithDeepL = async (text: string, from: string, to: string) => {
  const settingsStore = useSettingsStore()
  const { deepl_api_key: deeplApiKey } = settingsStore.apiKeys

  if (!deeplApiKey) {
    throw new Error('DeepL API key not configured')
  }

  const params = new URLSearchParams({
    text,
    source_lang: from === 'auto' ? 'auto' : from.toUpperCase(),
    target_lang: to.toUpperCase()
  })

  const response = await fetch(`${DEEPL_CONFIG.baseUrl}?${params}`, {
    headers: {
      Authorization: `DeepL-Auth-Key ${deeplApiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  if (!response.ok) throw new Error('DeepL translation failed')

  const data = await response.json()
  return data.translations[0].text
}

// Helper function to calculate input for Youdao API signature
function getInput(q: string): string {
  const len = q.length
  if (len <= 20) return q
  return q.substring(0, 10) + len + q.substring(len - 10, len)
}

// SHA256 implementation using Web Crypto API
async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}
