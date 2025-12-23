// Vercel Serverless Function - 处理与DeepSeek API的通信
// API密钥存储在环境变量中，不会暴露给前端

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

        // 调用DeepSeek API
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: messages,
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
