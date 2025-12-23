# 小专中医药方Bot

专门辅助主任为孩子开具中医药方的智能助手。

## 功能特点

- 基于DeepSeek AI的儿科中医药专家系统
- 根据孩子的病症和体质特点生成中药处方
- 包含药材名称、用量、煎服方法等详细信息
- 美观的响应式网页界面

## 技术架构

- **前端**: HTML + CSS + JavaScript
- **后端**: Vercel Serverless Functions
- **AI**: DeepSeek API

## 部署到Vercel

### 1. 准备工作

确保你有：
- GitHub账号
- Vercel账号（可以用GitHub登录）
- DeepSeek API密钥

### 2. 部署步骤

1. 将项目推送到GitHub仓库

2. 访问 [Vercel](https://vercel.com) 并登录

3. 点击 "Add New Project" > "Import Git Repository"

4. 选择这个项目的GitHub仓库

5. **重要**: 在部署前，点击 "Environment Variables"，添加：
   - Name: `DEEPSEEK_API_KEY`
   - Value: `你的DeepSeek API密钥`

6. 点击 "Deploy" 开始部署

7. 等待几分钟，部署完成后会获得一个公网访问地址

### 3. 本地开发

如果要在本地测试，需要：

1. 创建 `.env` 文件：
   ```
   DEEPSEEK_API_KEY=你的DeepSeek_API密钥
   ```

2. 安装Vercel CLI（可选）：
   ```bash
   npm install -g vercel
   vercel dev
   ```

## 安全性说明

- API密钥存储在服务器端环境变量中，不会暴露给前端
- 使用Serverless Functions作为中间层，保护敏感信息
- 前端代码中不包含任何API密钥

## 免责声明

本系统提供的信息仅供医疗专业人员参考，不能替代专业医疗建议。具体用药需由主任最终审核决定。
