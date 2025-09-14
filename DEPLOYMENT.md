# 部署说明

## 环境变量配置

在部署平台（如Vercel、Netlify）中需要设置以下环境变量：

```
VITE_SILICONFLOW_API_KEY=sk-zvusdbvzwfohxwypmhhrxwmwjvldpnmgorceaxtfsdzewizd
```

## 部署到Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 使用GitHub账号登录
3. 点击"New Project"
4. 导入这个项目的GitHub仓库
5. 在"Environment Variables"中添加上述环境变量
6. 点击"Deploy"

## 部署到Netlify

1. 访问 [netlify.com](https://netlify.com)
2. 使用GitHub账号登录
3. 点击"New site from Git"
4. 选择这个项目的GitHub仓库
5. 在"Environment variables"中添加上述环境变量
6. 点击"Deploy site"

## 本地测试

```bash
npm install
npm run build
npm run preview
```

构建完成后，项目将在 `http://localhost:4173` 运行。
