// Vercel Serverless Function - 处理与DeepSeek API的通信
// API密钥存储在环境变量中，不会暴露给前端

import fs from 'fs';
import path from 'path';

// 读取并解析CSV文件
function loadPatientData() {
    try {
        const csvPath = path.join(process.cwd(), 'data', 'patients.csv');
        const csvContent = fs.readFileSync(csvPath, 'utf-8');
        const lines = csvContent.trim().split('\n');

        if (lines.length < 2) {
            return '';
        }

        const headers = lines[0].split(',');
        const patients = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            const patient = {};
            headers.forEach((header, index) => {
                patient[header] = values[index] || '';
            });
            patients.push(patient);
        }

        // 格式化成文本
        let formattedData = '\n\n【历史患者案例参考】\n以下是过去的患者案例，供您参考分析和开方：\n\n';

        patients.forEach((p, index) => {
            formattedData += `案例${index + 1}：${p.姓名}（${p.性别}，${p.年龄}）\n`;
            formattedData += `地址：${p.地址}\n`;
            formattedData += `症状特征：\n`;
            formattedData += `  - 怕冷怕热：${p.怕冷怕热}\n`;
            formattedData += `  - 虚汗：${p.有无虚汗}\n`;
            formattedData += `  - 情绪：${p.情绪问题}\n`;
            formattedData += `  - 多动：${p.是否多动}\n`;
            formattedData += `  - 兴奋/傻笑/尖叫：${p['兴奋/傻笑/尖叫']}\n`;
            formattedData += `  - 刻板行为：${p.刻板行为}\n`;
            formattedData += `  - 对视：${p.对视情况}\n`;
            formattedData += `  - 语言：${p.语言能力}\n`;
            formattedData += `  - 五迟五软：${p.五迟五软}\n`;
            formattedData += `  - 运动：${p.运动情况}\n`;
            formattedData += `  - 睡眠：${p.睡眠}\n`;
            formattedData += `  - 饮食：${p.饮食}\n`;
            formattedData += `  - 二便：${p.二便}\n`;
            formattedData += `  - 脑电图：${p.脑电图}\n`;
            if (p.其他) {
                formattedData += `  - 其他：${p.其他}\n`;
            }
            formattedData += `处方方案：\n`;
            formattedData += `  - 汤药：${p.汤药}\n`;
            formattedData += `  - 丸散剂：${p.丸散剂}\n`;
            formattedData += `  - 辅助用药：${p.辅助用药}\n`;
            formattedData += `\n---\n\n`;
        });

        return formattedData;
    } catch (error) {
        console.error('读取患者数据失败:', error);
        return '';
    }
}

export default async function handler(req, res) {
    // 只允许POST请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '只允许POST请求' });
    }

    // 设置CORS头，允许前端访问
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 处理预检请求
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { messages } = req.body;

        // 验证请求数据
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: '无效的请求数据' });
        }

        // 从环境变量获取API密钥
        const API_KEY = process.env.DEEPSEEK_API_KEY;
        if (!API_KEY) {
            return res.status(500).json({ error: 'API密钥未配置' });
        }

        // 加载历史患者数据
        const patientData = loadPatientData();

        // 将历史数据添加到system message中
        const enrichedMessages = messages.map((msg, index) => {
            if (index === 0 && msg.role === 'system') {
                return {
                    ...msg,
                    content: msg.content + patientData
                };
            }
            return msg;
        });

        // 调用DeepSeek API
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: enrichedMessages,
                temperature: 0.7,
                max_tokens: 2000,
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API请求失败: ${response.status}`);
        }

        const data = await response.json();

        // 返回AI回复给前端
        return res.status(200).json(data);

    } catch (error) {
        console.error('DeepSeek API错误:', error);
        return res.status(500).json({
            error: error.message || '服务器内部错误'
        });
    }
}
