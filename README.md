# TranslateX - 跨平台桌面划词翻译工具

TranslateX 是一款基于 Electron 开发的跨平台桌面划词翻译工具，支持 Windows 和 macOS 系统。您可以使用快捷键调用翻译功能，翻译选中的文本。

## 特性

- 跨平台支持：同时支持 Windows 和 macOS 系统
- 快捷键划词翻译：通过快捷键快速翻译选中的文本
- 支持多种翻译 API：目前支持有道翻译和 DeepL 翻译，可以根据需要自由切换
- 词典功能：对于词汇，提供详细的词典解释
- 用户友好的界面：简洁直观的用户界面，易于使用
- 可自定义的设置：自定义快捷键、翻译 API 等

## 安装

### 下载安装包

从 Releases 页面下载适合您系统的安装包：

- Windows: `TranslateX-Setup-{版本号}.exe`
- macOS: `TranslateX-{版本号}.dmg`

### 从源码构建

如果您想从源码构建应用，请按照以下步骤操作：

1. 克隆此仓库
   ```bash
   git clone https://github.com/yourusername/translatex.git
   cd translatex
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 运行开发环境
   ```bash
   npm run dev
   ```

4. 构建应用
   ```bash
   # 构建所有平台
   npm run build
   
   # 仅构建 Windows 版本
   npm run build:win
   
   # 仅构建 macOS 版本
   npm run build:mac
   ```

## 使用方法

1. 启动 TranslateX 应用
2. 在任意应用中选择要翻译的文本并复制（Ctrl+C / Command+C）
3. 按下默认快捷键 `Ctrl+Shift+T`（Windows）或 `Command+Shift+T`（macOS）
4. 弹出翻译窗口，显示翻译结果

## 配置翻译 API

### 有道翻译 API

1. 访问 [有道智云开放平台](https://ai.youdao.com/)
2. 注册并创建应用，获取应用 ID 和应用密钥
3. 在 TranslateX 设置中填入应用 ID 和应用密钥

### DeepL 翻译 API

1. 访问 [DeepL API](https://www.deepl.com/pro-api)
2. 注册并获取 API 密钥
3. 在 TranslateX 设置中填入 API 密钥

## 常见问题

### 无法使用快捷键

- 检查是否与其他应用的快捷键冲突
- 尝试在设置中更改快捷键

### 翻译失败

- 检查网络连接
- 检查 API 密钥是否正确
- 查看应用日志获取更多信息

## 开发

### 项目结构

```
translatex/
├── src/                  # 源代码
│   ├── css/              # 样式文件
│   ├── js/               # 渲染进程脚本
│   ├── services/         # 服务（如翻译服务）
│   ├── index.html        # 主窗口 HTML
│   └── translation.html  # 翻译窗口 HTML
├── main.js               # 主进程脚本
├── package.json          # 项目配置
└── README.md             # 项目说明
```

### 技术栈

- Electron: 跨平台桌面应用框架
- JavaScript: 主要编程语言
- HTML/CSS: 用户界面

## 许可证

[MIT License](LICENSE)
