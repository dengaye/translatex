/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_YOUDAO_APP_KEY: string
  VITE_YOUDAO_APP_SECRET: string
  VITE_DEEPL_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
