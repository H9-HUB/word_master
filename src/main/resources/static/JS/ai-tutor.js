document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chat-container');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const handleSendMessage = async () => {
        const userInput = chatInput.value.trim();
        if (!userInput) {
            return;
        }

        addMessageToUI(userInput, 'user');
        chatInput.value = '';
        setFormState(true);
        const typingIndicator = showTypingIndicator();

        try {
            const aiResponse = await fetchAIResponse(userInput);
            addMessageToUI(aiResponse, 'ai');
        } catch (error) {
            console.error('AI 请求或处理过程中发生错误:', error);
            addMessageToUI(error.message, 'ai', true);
        } finally {
            hideTypingIndicator(typingIndicator);
            setFormState(false);
        }
    };
    async function fetchAIResponse(userInput) {
        const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userInput }),
        });

        // 检查HTTP响应状态是否OK
        if (!response.ok) {
            throw new Error(`网络请求失败，服务器状态码: ${response.status}`);
        }

        console.log('[调试信息] 已成功从后端收到响应。');
        const data = await response.json();
        console.log('[调试信息] 后端返回的原始JSON数据:', data);

        // 主动检查多种可能的字段名，增强兼容性
        const aiReply = data.reply || data.content || data.message;

        if (typeof aiReply !== 'string' || aiReply.trim() === '') {
            throw new Error('从后端返回的数据中，未能找到有效的回复内容。');
        }

        return aiReply;
    }


    //将消息添加到聊天界面
    const addMessageToUI = (text, sender, isError = false) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender} flex items-start space-x-4 max-w-xl ${sender === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''}`;

        const avatar = `<div class="avatar w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xl">${sender === 'user' ? '👤' : '🤖'}</div>`;
        const textContent = `<div class="text-content ${isError ? 'bg-red-900/50 text-red-300' : 'bg-slate-800'} rounded-lg p-4"><p>${text.replace(/\n/g, '<br>')}</p></div>`;

        messageDiv.innerHTML = avatar + textContent;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight; // 自动滚动到底部
    };


    //显示“正在输入”的加载提示
    const showTypingIndicator = () => {
        const indicator = document.createElement('div');
        indicator.className = 'message ai flex items-start space-x-4 max-w-xl';
        indicator.id = 'typing-indicator';
        indicator.innerHTML = `
            <div class="avatar w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xl">🤖</div>
            <div class="text-content bg-slate-800 rounded-lg p-4 typing-indicator">
                <span>●</span><span>●</span><span>●</span>
            </div>
        `;
        chatContainer.appendChild(indicator);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return indicator;
    };


    //隐藏“正在输入”的加载提示
    const hideTypingIndicator = () => {
        const indicator = document.getElementById('typing-indicator');
        if(indicator) {
            chatContainer.removeChild(indicator);
        }
    };

    //设置表单的可用状态 (加载中/可输入)
    const setFormState = (isLoading) => {
        chatInput.disabled = isLoading;
        sendBtn.disabled = isLoading;
        sendBtn.style.opacity = isLoading ? '0.6' : '1';
        if (!isLoading) {
            chatInput.focus(); // 加载结束后自动聚焦到输入框
        }
    };

    // 绑定事件监听器
    sendBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
});