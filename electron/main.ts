import { app, BrowserWindow, globalShortcut, ipcMain, clipboard, screen } from 'electron'
import * as path from 'path'
import Store from 'electron-store'

// 初始化配置存储
const store = new Store()

// 设置默认配置
if (!store.get('settings')) {
  store.set('settings', {
    shortcut: 'CommandOrControl+Shift+T',
    translationApi: 'youdao', // 默认使用有道翻译
    autoLaunch: true
  })
}

let mainWindow: BrowserWindow | null
let translationWindow: BrowserWindow | null

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, '../assets/icons/icon.png')
  })

  // 根据环境加载不同URL
  const isDev = process.env.NODE_ENV === 'development'
  if (isDev) {
    // 开发环境加载Vite开发服务器
    mainWindow.loadURL('http://localhost:5173')
  } else {
    // 生产环境加载打包后的HTML文件
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // 开发环境打开开发者工具
  if (process.argv.includes('--debug')) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function createTranslationWindow() {
  // 如果已经存在翻译窗口，直接返回
  if (translationWindow && !translationWindow.isDestroyed()) {
    return
  }

  translationWindow = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    show: false,
    alwaysOnTop: true,
    transparent: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // 根据环境加载不同URL
  const isDev = process.env.NODE_ENV === 'development'
  if (isDev) {
    // 开发环境加载Vite开发服务器
    translationWindow.loadURL('http://localhost:5173/translation')
  } else {
    // 生产环境加载打包后的HTML文件
    translationWindow.loadFile(path.join(__dirname, '../dist/index.html'), { hash: '/translation' })
  }

  // 开发环境打开开发者工具
  if (process.argv.includes('--debug')) {
    translationWindow.webContents.openDevTools()
  }

  translationWindow.on('blur', () => {
    translationWindow.hide()
  })
}

app.whenReady().then(() => {
  createMainWindow()
  createTranslationWindow()

  // 注册快捷键
  registerGlobalShortcut()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 注册全局快捷键
function registerGlobalShortcut() {
  const shortcut = store.get('settings.shortcut') || 'CommandOrControl+Shift+T'

  globalShortcut.unregisterAll()
  globalShortcut.register(shortcut, handleTranslationShortcut)
}

// 处理翻译快捷键
async function handleTranslationShortcut() {
  const text = clipboard.readText().trim()
  if (!text) {
    return
  }

  // 获取当前鼠标位置
  const position = screen.getCursorScreenPoint()
  const display = screen.getDisplayNearestPoint(position)

  // 设置翻译窗口位置
  translationWindow.setPosition(
    Math.min(position.x, display.bounds.width - 400),
    Math.min(position.y + 20, display.bounds.height - 300)
  )

  // 显示翻译窗口并传入文本
  translationWindow.show()
  translationWindow.webContents.send('translate-text', text)
}

// IPC 事件处理
ipcMain.on('update-settings', (event, settings) => {
  store.set('settings', settings)
  registerGlobalShortcut()
})

ipcMain.on('get-settings', event => {
  event.returnValue = store.get('settings')
})

ipcMain.on('close-translation-window', () => {
  if (translationWindow && !translationWindow.isDestroyed()) {
    translationWindow.hide()
  }
})

// 添加测试翻译处理
ipcMain.handle('test-translation', async (event, { text, api }) => {
  try {
    const TranslatorService = require('../src/services/translator')
    return await TranslatorService.translate(text, api)
  } catch (error) {
    console.error('测试翻译出错:', error)
    return {
      success: false,
      error: error.message,
      original: text
    }
  }
})

// 添加固定翻译窗口处理
ipcMain.on('pin-translation-window', (event, isPinned) => {
  if (translationWindow && !translationWindow.isDestroyed()) {
    translationWindow.setAlwaysOnTop(isPinned, 'floating')
  }
})
