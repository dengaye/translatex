import { useSettingsStore } from '@/stores/settings'

interface TranslationConfig {
  baseUrl: string;
}

const YOUDAO_CONFIG: TranslationConfig = {
  baseUrl: 'https://openapi.youdao.com/api'
}

const DEEPL_CONFIG: TranslationConfig = {
  baseUrl: 'https://api-free.deepl.com/v2/translate'
}

export const translateWithYoudao = async (text: string, from: string, to: string) => {
  const settingsStore = useSettingsStore()
  const { youdaoAppKey, youdaoAppSecret } = settingsStore.apiKeys

  if (!youdaoAppKey || !youdaoAppSecret) {
    throw new Error('Youdao API credentials not configured')
  }

  const salt = Date.now()
  const curtime = Math.round(Date.now() / 1000)
  const sign = md5(youdaoAppKey + truncate(text) + salt + curtime + youdaoAppSecret)

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
  const { deeplApiKey } = settingsStore.apiKeys

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
      'Authorization': `DeepL-Auth-Key ${deeplApiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  if (!response.ok) throw new Error('DeepL translation failed')
  
  const data = await response.json()
  return data.translations[0].text
}

// Helper function to truncate text for Youdao API
function truncate(q: string): string {
  const len = q.length
  if (len <= 20) return q
  return q.substring(0, 10) + len + q.substring(len - 10, len)
}

// Simple MD5 implementation (you should use a proper crypto library in production)
function md5(text: string): string {
  // This is a placeholder. In production, use a proper crypto library
  return text // Replace with actual MD5 implementation
} 