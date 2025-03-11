import React, { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'
import { FiSettings, FiHelpCircle } from 'react-icons/fi'

interface Settings {
  shortcut: string;
  translationApi: string;
  autoLaunch: boolean;
}

const App: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    shortcut: 'CommandOrControl+Shift+T',
    translationApi: 'youdao',
    autoLaunch: true
  });
  const [testText, setTestText] = useState<string>('');
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 加载设置
  useEffect(() => {
    const savedSettings = ipcRenderer.sendSync('get-settings');
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);

  // 保存设置
  const saveSettings = () => {
    ipcRenderer.send('update-settings', settings);
  };

  // 处理快捷键更改
  const handleShortcutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, shortcut: e.target.value });
  };

  // 处理API选择更改
  const handleApiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings({ ...settings, translationApi: e.target.value });
  };

  // 处理自动启动更改
  const handleAutoLaunchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, autoLaunch: e.target.checked });
  };

  // 测试翻译
  const testTranslation = async () => {
    if (!testText.trim()) return;
    
    setIsLoading(true);
    setTestResult('测试中...');
    
    try {
      const result = await ipcRenderer.invoke('test-translation', {
        text: testText,
        api: settings.translationApi
      });
      
      if (result.success) {
        setTestResult(`翻译结果: ${result.translation}`);
      } else {
        setTestResult(`测试失败: ${result.error}`);
      }
    } catch (error) {
      setTestResult(`发生错误: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">TranslateX</h1>
          <span className="text-sm text-gray-500">轻量级翻译工具</span>
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 设置卡片 */}
          <div className="col-span-2 bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <FiSettings className="text-blue-500 mr-2" size={20} />
              <h2 className="text-xl font-semibold">设置</h2>
            </div>
            
            <div className="space-y-6">
              {/* 快捷键设置 */}
              <div>
                <label htmlFor="shortcut" className="block text-sm font-medium text-gray-700 mb-1">
                  翻译快捷键
                </label>
                <input
                  type="text"
                  id="shortcut"
                  value={settings.shortcut}
                  onChange={handleShortcutChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="例如: CommandOrControl+Shift+T"
                />
                <p className="mt-1 text-sm text-gray-500">
                  默认为 CommandOrControl+Shift+T (Mac上为Command+Shift+T，Windows上为Ctrl+Shift+T)
                </p>
              </div>
              
              {/* 翻译API设置 */}
              <div>
                <label htmlFor="api" className="block text-sm font-medium text-gray-700 mb-1">
                  翻译API
                </label>
                <select
                  id="api"
                  value={settings.translationApi}
                  onChange={handleApiChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="youdao">有道翻译</option>
                  <option value="deepl">DeepL翻译</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  选择要使用的翻译API，需要在服务中配置相应的API密钥
                </p>
              </div>
              
              {/* 自动启动设置 */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoLaunch"
                  checked={settings.autoLaunch}
                  onChange={handleAutoLaunchChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="autoLaunch" className="ml-2 block text-sm text-gray-700">
                  开机自动启动
                </label>
              </div>
              
              {/* 保存按钮 */}
              <button
                onClick={saveSettings}
                className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                保存设置
              </button>
            </div>
          </div>
          
          {/* 测试翻译卡片 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <FiHelpCircle className="text-blue-500 mr-2" size={20} />
              <h2 className="text-xl font-semibold">测试翻译</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="testText" className="block text-sm font-medium text-gray-700 mb-1">
                  输入要测试的文本
                </label>
                <textarea
                  id="testText"
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="在此输入要翻译的文本..."
                />
              </div>
              
              <button
                onClick={testTranslation}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400"
              >
                {isLoading ? '翻译中...' : '测试翻译'}
              </button>
              
              {testResult && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm">{testResult}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* 使用说明 */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">使用说明</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>1. 选择文本后，按下设置的快捷键（默认：Command+Shift+T 或 Ctrl+Shift+T）</p>
            <p>2. 翻译窗口将在鼠标位置附近弹出，显示翻译结果</p>
            <p>3. 点击翻译窗口中的"📌"图标可以固定窗口，防止失焦时自动关闭</p>
            <p>4. 点击"复制"按钮可以复制翻译结果到剪贴板</p>
            <p>5. 点击"切换引擎"按钮可以在不同的翻译引擎之间切换</p>
          </div>
        </div>
      </main>
      
      <footer className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
        <p>TranslateX &copy; {new Date().getFullYear()} - 跨平台桌面翻译工具</p>
      </footer>
    </div>
  )
}

export default App
