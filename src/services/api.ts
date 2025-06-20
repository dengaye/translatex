import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export interface TranslationRequest {
  text: string
  source: string
  target: string
}

export interface TranslationResponse {
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
}

export const translationApi = {
  translate: async (data: TranslationRequest): Promise<TranslationResponse> => {
    const response = await api.post<TranslationResponse>('/translate', data)
    return response.data
  }
}
