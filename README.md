# LifeChoice AI - 智能人生决策助手

一个基于AI的个性化决策分析平台，帮助用户做出更好的人生选择。

## ✨ 功能特点

- 🤖 **AI驱动分析**: 使用先进的大语言模型提供个性化建议
- 🌍 **双语支持**: 完整的中英文界面切换
- 📊 **可视化分析**: 雷达图展示综合能力评估
- 🎯 **个性化推荐**: 基于性格类型、情绪状态等多维度分析
- 📱 **响应式设计**: 适配各种设备屏幕

## 🚀 快速开始

### 本地开发

1. **安装依赖**
   ```bash
   npm install
   ```

2. **配置环境变量**
   创建 `.env` 文件：
   ```
   VITE_SILICONFLOW_API_KEY=sk-your-api-key-here
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **访问应用**
   打开浏览器访问 `http://localhost:3000`

### 在线部署

#### 方法一：Vercel (推荐)

1. **准备项目**
   ```bash
   npm run build
   ```

2. **部署到Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用GitHub账号登录
   - 点击 "New Project"
   - 导入项目仓库
   - 设置环境变量：`VITE_SILICONFLOW_API_KEY`
   - 点击 "Deploy"

#### 方法二：Netlify

1. **准备项目**
   ```bash
   npm run build
   ```

2. **部署到Netlify**
   - 访问 [netlify.com](https://netlify.com)
   - 使用GitHub账号登录
   - 点击 "New site from Git"
   - 选择项目仓库
   - 设置环境变量：`VITE_SILICONFLOW_API_KEY`
   - 点击 "Deploy site"

## 🔧 环境变量配置

在部署平台中需要设置以下环境变量：

| 变量名 | 描述 | 示例值 |
|--------|------|--------|
| `VITE_SILICONFLOW_API_KEY` | SiliconFlow API密钥 | `sk-xxx...` |

## 📁 项目结构

```
src/
├── pages/           # 页面组件
│   ├── Home.tsx     # 主页
│   └── Results.tsx  # 结果页
├── services/        # API服务
│   └── api.ts       # API调用逻辑
├── lib/             # 工具函数
└── App.tsx          # 主应用组件
```

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **图表**: Recharts
- **路由**: React Router
- **AI服务**: SiliconFlow API

## 📱 使用说明

1. **描述困境**: 在主页输入你面临的人生决策问题
2. **完善信息**: 填写性格类型、情绪状态、决策因子等信息
3. **开始分析**: 点击"开始分析"按钮
4. **查看结果**: 获得AI生成的个性化建议和分析报告

## 🌐 在线演示

部署完成后，你可以通过以下方式分享给他人测试：

1. 复制部署后的URL链接
2. 分享给需要测试的用户
3. 用户可以立即体验完整的AI分析功能

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

---

**注意**: 请确保在部署时正确设置API密钥，否则AI分析功能将无法正常工作。