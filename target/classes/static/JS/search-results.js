document.addEventListener('DOMContentLoaded', async () => {
    const keywordSpan = document.getElementById('search-keyword');
    const resultCountSpan = document.getElementById('result-count');
    const resultsContainer = document.getElementById('results-container');
    const loadingIndicator = document.getElementById('loading-indicator');

    // 从URL获取搜索关键词
    const params = new URLSearchParams(window.location.search);
    const keyword = params.get('keyword');

    if (!keyword) {
        loadingIndicator.textContent = '没有提供搜索关键词。';
        return;
    }

    keywordSpan.textContent = keyword;

    try {
        // 调用后端的搜索API
        const response = await fetch(`http://localhost:8080/api/search/words?keyword=${encodeURIComponent(keyword)}`);

        if (!response.ok) {
            throw new Error('搜索服务暂时不可用。');
        }
        const results = await response.json();

        // 3. 渲染结果
        loadingIndicator.style.display = 'none'; // 隐藏加载提示
        resultCountSpan.textContent = results.length;

        if (results.length === 0) {
            resultsContainer.innerHTML = '<p class="text-slate-400">未找到与该关键词相关的单词。</p>';
            return;
        }

        results.forEach(word => {
            const wordCard = createWordCard(word);
            resultsContainer.appendChild(wordCard);
        });

    } catch (error) {
        loadingIndicator.textContent = `加载失败: ${error.message}`;
        console.error('搜索失败:', error);
    }
});

/**
 *
 * @param {object} wordData - 包含单词信息的对象
 * @returns {HTMLElement}
 */
function createWordCard(wordData) {
    const card = document.createElement('div');
    card.className = 'bg-slate-800 border border-slate-700 rounded-lg p-6';

    card.innerHTML = `
        <div class="flex justify-between items-center mb-2">
            <h3 class="text-2xl font-bold">${wordData.word}</h3>
            </div>
        <p class="text-slate-400 mb-3">${wordData.phonetic || ''}</p>
        <p class="text-slate-200">${wordData.meaning}</p>
    `;
    return card;
}