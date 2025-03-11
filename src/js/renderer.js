const { ipcRenderer } = require('electron');

// 获取DOM元素
const shortcutDisplay = document.getElementById('shortcutDisplay');
const shortcutInput = document.getElementById('shortcut');
const resetShortcutBtn = document.getElementById('resetShortcut');
const translationApiSelect = document.getElementById('translationApi');
const apiConfigDiv = document.getElementById('apiConfig');
const autoLaunchCheckbox = document.getElementById('autoLaunch');
const settingsForm = document.getElementById('settingsForm');
const testTranslationBtn = document.getElementById('testTranslation');
const testModal = document.getElementById('testTranslationModal');
const closeModalBtn = document.querySelector('.close');
const testText = document.getElementById('testText');
const runTestTranslationBtn = document.getElementById('runTestTranslation');
const testResult = document.getElementById('testResult');
const translationResult = document.getElementById('translationResult');
const appVersionSpan = document.getElementById('appVersion');

// 应用版本
const appVersion = require('electron').remote ? require('electron').remote.app.getVersion() : '1.0.0';
appVersionSpan.textContent = appVersion;

// 默认设置
const defaultSettings = {
  shortcut: 'CommandOrControl+Shift+T',
  translationApi: 'youdao',
  autoLaunch: true,
  apiKeys: {
    youdao: { appId: '', appSecret: '' },
    deepl: { authKey: '' }
  }
};

// 获取设置
let settings = ipcRenderer.sendSync('get-settings') || defaultSettings;

// 初始化设置表单
function initSettingsForm() {
  // 设置快捷键显示
  const shortcutText = settings.shortcut
    .replace('CommandOrControl', process.platform === 'darwin' ? 'Command' : 'Ctrl')
    .replace(/\+/g, ' + ');
  shortcutDisplay.textContent = shortcutText;
  shortcutInput.value = shortcutText;
  
  // 设置翻译API下拉菜单
  translationApiSelect.value = settings.translationApi || 'youdao';
  
  // 初始化API配置
  updateApiConfigForm();
  
  // 设置自启动复选框
  autoLaunchCheckbox.checked = settings.autoLaunch;
}

// 根据选择的API更新配置表单
function updateApiConfigForm() {
  const api = translationApiSelect.value;
  let html = '';
  
  if (api === 'youdao') {
    html = `
      <div class="form-group">
        <label for="youdaoAppId">有道智云 App ID:</label>
        <input type="text" id="youdaoAppId" placeholder="请输入有道智云应用ID">
      </div>
      <div class="form-group">
        <label for="youdaoAppSecret">有道智云 App Secret:</label>
        <input type="text" id="youdaoAppSecret" placeholder="请输入有道智云应用密钥">
      </div>
      <p class="api-note">需要到 <a href="#" onclick="openExternal('https://ai.youdao.com/')">有道智云开放平台</a> 注册并创建应用</p>
    `;
  } else if (api === 'deepl') {
    html = `
      <div class="form-group">
        <label for="deeplAuthKey">DeepL API Key:</label>
        <input type="text" id="deeplAuthKey" placeholder="请输入DeepL API密钥">
      </div>
      <p class="api-note">需要到 <a href="#" onclick="openExternal('https://www.deepl.com/pro-api')">DeepL API</a> 注册并获取API密钥</p>
    `;
  }
  
  apiConfigDiv.innerHTML = html;
  
  // 填充已保存的API密钥
  if (api === 'youdao' && settings.apiKeys && settings.apiKeys.youdao) {
    document.getElementById('youdaoAppId').value = settings.apiKeys.youdao.appId || '';
    document.getElementById('youdaoAppSecret').value = settings.apiKeys.youdao.appSecret || '';
  } else if (api === 'deepl' && settings.apiKeys && settings.apiKeys.deepl) {
    document.getElementById('deeplAuthKey').value = settings.apiKeys.deepl.authKey || '';
  }
}

// 打开外部链接
function openExternal(url) {
  require('electron').shell.openExternal(url);
}

// 保存设置
function saveSettings() {
  // 获取当前表单的值
  const api = translationApiSelect.value;
  
  // 保存API密钥
  if (!settings.apiKeys) settings.apiKeys = {};
  
  if (api === 'youdao') {
    settings.apiKeys.youdao = {
      appId: document.getElementById('youdaoAppId').value,
      appSecret: document.getElementById('youdaoAppSecret').value
    };
  } else if (api === 'deepl') {
    settings.apiKeys.deepl = {
      authKey: document.getElementById('deeplAuthKey').value
    };
  }
  
  // 更新设置对象
  settings = {
    ...settings,
    shortcut: shortcutInput.value
      .replace('Command', 'CommandOrControl')
      .replace('Ctrl', 'CommandOrControl')
      .replace(/\s+\+\s+/g, '+'),
    translationApi: api,
    autoLaunch: autoLaunchCheckbox.checked
  };
  
  // 发送设置到主进程
  ipcRenderer.send('update-settings', settings);
  
  // 更新快捷键显示
  const shortcutText = settings.shortcut
    .replace('CommandOrControl', process.platform === 'darwin' ? 'Command' : 'Ctrl')
    .replace(/\+/g, ' + ');
  shortcutDisplay.textContent = shortcutText;
  
  alert('设置已保存！');
}

// 测试翻译
async function testTranslate() {
  const text = testText.value.trim();
  if (!text) {
    alert('请输入要翻译的文本');
    return;
  }
  
  translationResult.textContent = '正在翻译...';
  testResult.style.display = 'block';
  
  try {
    // 发送到主进程进行翻译
    const result = await ipcRenderer.invoke('test-translation', {
      text,
      api: translationApiSelect.value
    });
    
    if (result.success) {
      translationResult.innerHTML = `
        <div><strong>原文:</strong> ${result.original}</div>
        <div><strong>译文:</strong> ${result.translation}</div>
      `;
      
      if (result.dict && result.dict.length > 0) {
        translationResult.innerHTML += `<div><strong>词典解释:</strong></div><ul>`;
        result.dict.forEach(item => {
          translationResult.innerHTML += `<li>${item}</li>`;
        });
        translationResult.innerHTML += `</ul>`;
      }
    } else {
      translationResult.textContent = `翻译失败: ${result.error}`;
    }
  } catch (error) {
    translationResult.textContent = `发生错误: ${error.message}`;
  }
}

// 事件监听
document.addEventListener('DOMContentLoaded', initSettingsForm);

translationApiSelect.addEventListener('change', updateApiConfigForm);

resetShortcutBtn.addEventListener('click', () => {
  shortcutInput.value = process.platform === 'darwin' ? 'Command + Shift + T' : 'Ctrl + Shift + T';
});

shortcutInput.addEventListener('click', () => {
  shortcutInput.value = '按下组合键...';
  shortcutInput.classList.add('recording');
  
  const keys = [];
  
  const keydownHandler = (e) => {
    e.preventDefault();
    
    if (e.key === 'Escape') {
      shortcutInput.value = process.platform === 'darwin' ? 'Command + Shift + T' : 'Ctrl + Shift + T';
      shortcutInput.classList.remove('recording');
      document.removeEventListener('keydown', keydownHandler);
      return;
    }
    
    if (e.key === 'Control' || e.key === 'Shift' || e.key === 'Alt' || e.key === 'Meta') {
      keys[e.key] = true;
      return;
    }
    
    let shortcut = '';
    if (keys['Meta'] || keys['Control']) shortcut += process.platform === 'darwin' ? 'Command + ' : 'Ctrl + ';
    if (keys['Shift']) shortcut += 'Shift + ';
    if (keys['Alt']) shortcut += 'Alt + ';
    shortcut += e.key.toUpperCase();
    
    shortcutInput.value = shortcut;
    shortcutInput.classList.remove('recording');
    document.removeEventListener('keydown', keydownHandler);
  };
  
  document.addEventListener('keydown', keydownHandler);
});

testTranslationBtn.addEventListener('click', () => {
  testModal.style.display = 'block';
});

closeModalBtn.addEventListener('click', () => {
  testModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === testModal) {
    testModal.style.display = 'none';
  }
});

runTestTranslationBtn.addEventListener('click', testTranslate);

settingsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  saveSettings();
});

// 外部链接点击处理
document.addEventListener('click', (e) => {
  if (e.target.tagName === 'A' && e.target.getAttribute('href')) {
    e.preventDefault();
    const url = e.target.getAttribute('href');
    if (url.startsWith('http')) {
      openExternal(url);
    }
  }
});
