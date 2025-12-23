# 腾讯云Cloudbase部署指南

本项目支持部署到腾讯云Cloudbase（云开发），可在中国境内无需VPN访问。

## 前提条件

1. 注册腾讯云账号：https://cloud.tencent.com
2. 开通云开发服务
3. 安装腾讯云CLI工具

## 部署步骤

### 第一步：安装CloudBase CLI

```bash
npm install -g @cloudbase/cli
```

### 第二步：登录腾讯云

```bash
cloudbase login
```

会自动打开浏览器，使用微信扫码登录。

### 第三步：创建云开发环境

1. 访问 https://console.cloud.tencent.com/tcb
2. 点击"新建环境"
3. 选择"按量计费"（有免费额度）
4. 记住你的环境ID（格式类似：`xiaozhuan-xxx`）

### 第四步：配置环境变量

在cloudbaserc.json中，将 `{{env.ENV_ID}}` 替换为你的环境ID。

或者使用命令行设置：

```bash
# 设置环境ID
export ENV_ID=你的环境ID

# 设置DeepSeek API密钥
export DEEPSEEK_API_KEY=sk-5426ccb574b849e7b9f96a1758cc3868
```

### 第五步：部署项目

在项目根目录执行：

```bash
cloudbase framework deploy
```

部署过程需要3-5分钟。

### 第六步：配置云函数环境变量

部署完成后，需要在云函数中配置环境变量：

1. 访问 https://console.cloud.tencent.com/tcb/scf
2. 选择你的环境
3. 找到 `chat` 云函数
4. 点击"函数配置"
5. 在"环境变量"中添加：
   - 变量名：`DEEPSEEK_API_KEY`
   - 变量值：`sk-5426ccb574b849e7b9f96a1758cc3868`
6. 保存配置

### 第七步：获取云函数访问地址

1. 在云函数列表中，点击 `chat` 云函数
2. 进入"函数代码"标签
3. 点击"HTTP访问服务"
4. 复制HTTP访问路径（格式：`https://你的环境ID.service.tcloudbase.com/chat`）

### 第八步：修改前端配置

1. 打开 `config.js` 文件
2. 将 `API_URL` 修改为云函数的HTTP访问路径：

```javascript
const config = {
    API_URL: 'https://你的环境ID.service.tcloudbase.com/chat'
};
```

3. 重新部署：

```bash
cloudbase framework deploy
```

### 第九步：访问网站

部署完成后，会显示网站的访问地址，格式类似：

```
https://你的环境ID.tcloudbaseapp.com
```

## 更新患者数据

当需要添加新的患者案例时：

1. 修改 `cloudfunctions/chat/patients.csv` 文件
2. 提交并部署：

```bash
git add .
git commit -m "更新患者数据"
cloudbase functions deploy chat
```

## 费用说明

腾讯云开发有免费额度：
- 云函数：每月40万GBs免费
- 静态托管：每月5GB流量免费
- 数据库：每月1GB存储免费

一般个人使用完全在免费额度内。

## 常见问题

### 1. 部署失败怎么办？

检查：
- 是否已登录：`cloudbase login`
- 环境ID是否正确
- 是否有足够的权限

### 2. 云函数报错"API密钥未配置"

需要在云函数的环境变量中配置 `DEEPSEEK_API_KEY`。

### 3. 网站打不开

检查：
- 云函数是否部署成功
- config.js中的API_URL是否正确
- 云函数的HTTP访问服务是否开启

## 技术支持

如有问题，可以：
1. 查看腾讯云开发文档：https://cloud.tencent.com/document/product/876
2. 联系腾讯云技术支持

## 安全提示

- 不要将API密钥提交到公开的代码仓库
- 定期更换API密钥
- 建议设置云函数的访问限制
