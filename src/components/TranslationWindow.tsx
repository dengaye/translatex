import React, { useState, useEffect } from 'react'
import { ipcRenderer, clipboard } from 'electron'
import { FiX, FiCopy, FiRefreshCw } from 'react-icons/fi'
import { BsPinAngle, BsPinAngleFill } from 'react-icons/bs'
import { TranslatorService, TranslationResult } from '../services/translator'

interface DictItem {
  content: string;
}

const TranslationWindow: React.FC = () => {
  const [originalText, setOriginalText] = useState<string>('')
  const [translationText, setTranslationText] = useState<string>('')
  const [sourceLanguage, setSourceLanguage] = useState<string>('')
  const [targetLanguage, setTargetLanguage] = useState<string>('中文')
  const [dictionary, setDictionary] = useState<string[]>([])
  const [isPinned, setIsPinned] = useState<boolean>(false)
  const [currentApi, setCurrentApi] = useState<string>('youdao')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [copySuccess, setCopySuccess] = useState<boolean>(false)

  // 初始化获取设置
  useEffect(() => {
    const settings = ipcRenderer.sendSync('get-settings')
    if (settings && settings.translationApi) {
      setCurrentApi(settings.translationApi)
    }
  }, [])

  // 监听翻译请求
  useEffect(() => {
    const handleTranslateText = async (_event: any, text: string) => {
      setOriginalText(text)
      await translateText(text)
    }

    ipcRenderer.on('translate-text', handleTranslateText)

    return () => {
      ipcRenderer.removeListener('translate-text', handleTranslateText)
    }
  }, [currentApi])

  // 执行翻译
  const translateText = async (text: string) => {
    if (!text.trim()) return

    setIsLoading(true)
    setTranslationText('')
    setDictionary([])

    try {
      const result = await TranslatorService.translate(text, currentApi)
      handleTranslationResult(result)
    } catch (error) {
      setTranslationText(`发生错误: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  // 处理翻译结果
  const handleTranslationResult = (result: TranslationResult) => {
    if (result.success) {
      setTranslationText(result.translation || '')
      
      if (result.detectedSourceLang) {
        setSourceLanguage(getLanguageName(result.detectedSourceLang))
      }

      if (result.dict && result.dict.length > 0) {
        setDictionary(result.dict)
      }
    } else {
      setTranslationText(`翻译失败: ${result.error || '未知错误'}`)
    }
  }

  // 获取语言名称
  const getLanguageName = (code: string): string => {
    const langMap: Record<string, string> = {
      'EN': '英语',
      'DE': '德语',
      'FR': '法语',
      'ES': '西班牙语',
      'JA': '日语',
      'ZH': '中文',
      'auto': '自动检测'
    }
    
    return langMap[code] || code
  }

  // 关闭窗口
  const handleClose = () => {
    ipcRenderer.send('close-translation-window')
  }

  // 固定/取消固定窗口
  const handlePin = () => {
    const newPinned = !isPinned
    setIsPinned(newPinned)
    ipcRenderer.send('pin-translation-window', newPinned)
  }

  // 复制翻译结果
  const handleCopy = () => {
    if (translationText) {
      clipboard.writeText(translationText)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 1500)
    }
  }

  // 切换翻译引擎
  const handleSwitchEngine = async () => {
    const newApi = currentApi === 'youdao' ? 'deepl' : 'youdao'
    setCurrentApi(newApi)
    
    if (originalText) {
      await translateText(originalText)
    }
  }

  return (
    <div className="font-sans antialiased h-screen w-screen overflow-hidden bg-transparent">
      <div className="w-full h-full flex flex-col bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200">
        <div className="flex items-center justify-between bg-blue-600 text-white px-3 py-2 rounded-t-lg">
          <h3 className="text-sm font-medium">TranslateX</h3>
          <div className="flex items-center space-x-1">
            <button 
              onClick={handlePin} 
              className="p-1 rounded hover:bg-blue-700 transition-colors"
              title="固定窗口"
            >
              {isPinned ? <BsPinAngleFill size={16} /> : <BsPinAngle size={16} />}
            </button>
            <button 
              onClick={handleClose}
              className="p-1 rounded hover:bg-blue-700 transition-colors"
              title="关闭"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-3">
          {/* 原文 */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <div className="text-xs font-medium text-gray-500">原文</div>
              {sourceLanguage && (
                <div className="text-xs text-gray-400">{sourceLanguage}</div>
              )}
            </div>
            <div className="text-sm text-gray-800 p-2 bg-gray-50 rounded min-h-[40px]">
              {originalText}
            </div>
          </div>
          
          {/* 译文 */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <div className="text-xs font-medium text-gray-500">译文</div>
              <div className="text-xs text-gray-400">{targetLanguage}</div>
            </div>
            <div className="text-sm text-gray-800 p-2 bg-gray-50 rounded min-h-[40px]">
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2 text-gray-400 h-full">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                  <span>正在翻译...</span>
                </div>
              ) : (
                translationText
              )}
            </div>
          </div>
          
          {/* 词典 */}
          {dictionary.length > 0 && (
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">词典</div>
              <div className="text-sm">
                {dictionary.map((item, index) => (
                  <div key={index} className="p-1 text-gray-700">{item}</div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-b-lg border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleCopy}
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors flex items-center"
              disabled={!translationText || isLoading}
            >
              <FiCopy className="mr-1" size={12} />
              {copySuccess ? '已复制' : '复制'}
            </button>
            <button 
              onClick={handleSwitchEngine}
              className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors flex items-center"
              disabled={isLoading}
            >
              <FiRefreshCw className="mr-1" size={12} />
              切换引擎
            </button>
          </div>
          <div className="text-xs text-gray-500">
            API: {currentApi === 'youdao' ? '有道翻译' : 'DeepL翻译'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TranslationWindow
