# 小专中医药方Bot

专门辅助主任为孩子开具中医药方的智能助手。

## 功能特点

- 基于DeepSeek AI的儿科中医药专家系统
- 根据孩子的病症和体质特点生成中药处方
- 包含历史患者案例数据库，AI可参考过往案例
- 美观的响应式网页界面
- 支持在中国境内无VPN访问

## 技术架构

- **前端**: HTML + CSS + JavaScript
- **后端**: 腾讯云Cloudbase云函数
- **AI**: DeepSeek API
- **数据存储**: CSV文件（历史患者案例）

## 部署说明

本项目部署在腾讯云Cloudbase平台。

详细部署步骤请查看：[DEPLOY_CLOUDBASE.md](./DEPLOY_CLOUDBASE.md)

## 在线访问

网站地址：https://xiaozhuan-3g66kopf179ae7ec-1393123460.tcloudbaseapp.com

## 使用说明

1. 访问网站
2. 输入孩子的病症和体质特点（如年龄、症状、体质等）
3. AI会参考历史患者案例，给出针对性的中药处方建议
4. 处方包含：汤药配方、丸散剂、辅助用药等

## 更新患者数据

当需要添加新的患者案例时：

1. 编辑 `cloudfunctions/chat/patients.csv` 文件
2. 按照现有格式添加新的患者数据
3. 重新部署云函数：
   ```bash
   cloudbase functions:deploy chat -e xiaozhuan-3g66kopf179ae7ec --force
   ```

## 安全性说明

- API密钥安全存储在云函数环境变量中
- 前端代码不包含任何敏感信息
- 云函数作为中间层保护API密钥

## 免责声明

本系统提供的信息仅供医疗专业人员参考，不能替代专业医疗建议。具体用药需由主任最终审核决定。
