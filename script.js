// API 配置 - 调用后端API，API密钥安全存储在服务器端
const API_URL = '/api/chat';

// 对话历史
let conversationHistory = [
    {
        role: 'system',
        content: '你是一位专业的儿科中医药专家，名叫"小专"，专门辅助主任为孩子开具中医药方。你精通小儿中医理论、中药配伍、儿童用药剂量等知识。当用户输入孩子的病症与特点时，你需要：1）分析病情和体质特点；2）给出针对性的中药处方，包括药材名称、用量（需注意儿童用药剂量）、煎服方法；3）说明注意事项。请用专业、严谨的语气回答。在给出方子时，请提醒这仅供主任参考，具体用药需由主任最终审核决定。'
    }
];

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');

    // 回车发送消息（Shift+Enter换行）
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // 自动聚焦输入框
    userInput.focus();
});

// 发送消息
async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const message = userInput.value.trim();

    if (!message) {
        return;
    }

    // 禁用输入
    userInput.disabled = true;
    sendButton.disabled = true;

    // 显示用户消息
    addMessage(message, 'user');

    // 清空输入框
    userInput.value = '';

    // 显示加载动画
    showLoading(true);

    try {
        // 添加用户消息到对话历史
        conversationHistory.push({
            role: 'user',
            content: message
        });

        // 调用后端API（后端会安全地调用DeepSeek）
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: conversationHistory
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API 请求失败: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // 获取 AI 回复
        const aiMessage = data.choices[0].message.content;

        // 添加 AI 回复到对话历史
        conversationHistory.push({
            role: 'assistant',
            content: aiMessage
        });

        // 显示 AI 回复
        addMessage(aiMessage, 'bot');

    } catch (error) {
        console.error('错误:', error);
        addMessage(
            `抱歉，发生了错误：${error.message}\n\n请检查网络连接或稍后重试。`,
            'bot'
        );

        // 移除失败的用户消息
        conversationHistory.pop();
    } finally {
        // 隐藏加载动画
        showLoading(false);

        // 启用输入
        userInput.disabled = false;
        sendButton.disabled = false;
        userInput.focus();
    }
}

// 添加消息到聊天界面
function addMessage(text, type) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    // 将文本中的换行符转换为 HTML
    const formattedText = formatMessage(text);
    contentDiv.innerHTML = formattedText;

    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);

    // 滚动到底部
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 格式化消息（处理换行、列表等）
function formatMessage(text) {
    // 转义 HTML 特殊字符
    let formatted = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // 处理换行
    formatted = formatted.replace(/\n/g, '<br>');

    // 处理有序列表 (1. 2. 3. 等)
    formatted = formatted.replace(/^(\d+)\.\s+(.+)$/gm, '<li>$2</li>');

    // 处理无序列表 (- 或 * 开头)
    formatted = formatted.replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>');

    // 包装列表项
    formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // 处理粗体 **文本**
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // 处理段落
    formatted = formatted.replace(/(<br>){2,}/g, '</p><p>');
    if (!formatted.includes('<ul>') && !formatted.includes('<ol>')) {
        formatted = '<p>' + formatted + '</p>';
    }

    return formatted;
}

// 显示/隐藏加载动画
function showLoading(show) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (show) {
        loadingOverlay.classList.add('active');
    } else {
        loadingOverlay.classList.remove('active');
    }
}

// 清空对话（可选功能）
function clearConversation() {
    if (confirm('确定要清空对话历史吗？')) {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '';

        // 重置对话历史，保留系统提示
        conversationHistory = [conversationHistory[0]];

        // 重新显示欢迎消息
        addMessage(
            '您好！我是小专中医药方Bot，专门辅助主任为孩子开具中医药方。\n\n请输入孩子的病症与特点，我会给您生成合适的方子。',
            'bot'
        );
    }
}
