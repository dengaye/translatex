const { ipcRenderer, clipboard } = require('electron');
const TranslatorService = require('../services/translator');

// 获取DOM元素
const closeButton = document.getElementById('closeButton');
const pinButton = document.getElementById('pinButton');
const originalTextElement = document.getElementById('originalText');
const translationTextElement = document.getElementById('translationText');
const sourceLanguageElement = document.getElementById('sourceLanguage');
const targetLanguageElement = document.getElementById('targetLanguage');
const dictionaryElement = document.getElementById('dictionary');
const copyButton = document.getElementById('copyButton');
const switchButton = document.getElementById('switchButton');
const apiInfoElement = document.getElementById('apiInfo');

// 状态变量
let isPinned = false;
let currentApi = 'youdao'; // 默认使用有道翻译
let currentTranslation = '';

// 获取设置
const settings = ipcRenderer.sendSync('get-settings');
if (settings && settings.translationApi) {
  currentApi = settings.translationApi;
}

// 初始化API信息显示
updateApiInfo();

// 接收需要翻译的文本
ipcRenderer.on('translate-text', async (event, text) => {
  // 显示原文
  originalTextElement.textContent = text;
  
  // 重置翻译区域，显示加载中
  translationTextElement.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <span>正在翻译...</span>
    </div>
  `;
  
  // 清空词典区域
  dictionaryElement.innerHTML = '';
  
  // 执行翻译
  try {
    const result = await TranslatorService.translate(text, currentApi);
    
    if (result.success) {
      // 显示翻译结果
      translationTextElement.textContent = result.translation;
      currentTranslation = result.translation;
      
      // 显示语言信息
      if (result.detectedSourceLang) {
        sourceLanguageElement.textContent = getLanguageName(result.detectedSourceLang);
      }
      targetLanguageElement.textContent = currentApi === 'deepl' ? '中文' : '中文';
      
      // 显示词典信息（如果有）
      if (result.dict && result.dict.length > 0) {
        showDictionary(result.dict);
      }
    } else {
      translationTextElement.textContent = `翻译失败: ${result.error}`;
    }
  } catch (error) {
    translationTextElement.textContent = `发生错误: ${error.message}`;
  }
});

// 显示词典信息
function showDictionary(dict) {
  if (!dict || dict.length === 0) return;
  
  let html = '<div class="section-title">词典</div>';
  
  dict.forEach(item => {
    html += `<div class="dict-item">${item}</div>`;
  });
  
  dictionaryElement.innerHTML = html;
}

// 获取语言名称
function getLanguageName(code) {
  const langMap = {
    'EN': '英语',
    'DE': '德语',
    'FR': '法语',
    'ES': '西班牙语',
    'JA': '日语',
    'ZH': '中文',
    'auto': '自动检测'
  };
  
  return langMap[code] || code;
}

// 更新API信息显示
function updateApiInfo() {
  apiInfoElement.textContent = `API: ${currentApi === 'youdao' ? '有道翻译' : 'DeepL翻译'}`;
}

// 关闭窗口
closeButton.addEventListener('click', () => {
  ipcRenderer.send('close-translation-window');
});

// 固定窗口
pinButton.addEventListener('click', () => {
  isPinned = !isPinned;
  pinButton.classList.toggle('pinned', isPinned);
  
  // 发送消息到主进程设置窗口是否固定
  ipcRenderer.send('pin-translation-window', isPinned);
});

// 复制翻译结果
copyButton.addEventListener('click', () => {
  if (currentTranslation) {
    clipboard.writeText(currentTranslation);
    
    // 显示复制成功提示
    const originalText = copyButton.textContent;
    copyButton.textContent = '已复制';
    setTimeout(() => {
      copyButton.textContent = originalText;
    }, 1500);
  }
});

// 切换翻译引擎
switchButton.addEventListener('click', async () => {
  // 切换API
  currentApi = currentApi === 'youdao' ? 'deepl' : 'youdao';
  updateApiInfo();
  
  // 如果有原文，重新翻译
  const originalText = originalTextElement.textContent;
  if (originalText) {
    // 重置翻译区域，显示加载中
    translationTextElement.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <span>正在翻译...</span>
      </div>
    `;
    
    // 执行翻译
    try {
      const result = await TranslatorService.translate(originalText, currentApi);
      
      if (result.success) {
        // 显示翻译结果
        translationTextElement.textContent = result.translation;
        currentTranslation = result.translation;
        
        // 显示语言信息
        if (result.detectedSourceLang) {
          sourceLanguageElement.textContent = getLanguageName(result.detectedSourceLang);
        }
        targetLanguageElement.textContent = currentApi === 'deepl' ? '中文' : '中文';
        
        // 显示词典信息（如果有）
        dictionaryElement.innerHTML = '';
        if (result.dict && result.dict.length > 0) {
          showDictionary(result.dict);
        }
      } else {
        translationTextElement.textContent = `翻译失败: ${result.error}`;
      }
    } catch (error) {
      translationTextElement.textContent = `发生错误: ${error.message}`;
    }
  }
});
