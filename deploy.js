#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 开始部署准备...');

// 检查环境变量
if (!process.env.VITE_SILICONFLOW_API_KEY) {
  console.log('⚠️  警告: 未找到 VITE_SILICONFLOW_API_KEY 环境变量');
  console.log('请在部署平台中设置环境变量: VITE_SILICONFLOW_API_KEY=sk-your-api-key-here');
}

// 构建项目
console.log('📦 构建项目...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ 构建完成!');
} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
}

// 检查构建输出
if (fs.existsSync('dist')) {
  console.log('✅ 构建输出目录已创建');
  console.log('📁 构建文件:');
  const files = fs.readdirSync('dist');
  files.forEach(file => {
    const stats = fs.statSync(`dist/${file}`);
    const size = (stats.size / 1024).toFixed(2);
    console.log(`   - ${file} (${size} KB)`);
  });
} else {
  console.error('❌ 构建输出目录不存在');
  process.exit(1);
}

console.log('\n🎉 部署准备完成!');
console.log('\n📋 下一步:');
console.log('1. 将项目推送到GitHub仓库');
console.log('2. 在Vercel或Netlify中导入项目');
console.log('3. 设置环境变量: VITE_SILICONFLOW_API_KEY');
console.log('4. 部署!');
