async function fetchWordsByLevel(level) {
    try {
        const res = await fetch(`http://localhost:8080/api/vocabulary/words?level=${level}`);
        if (!res.ok) throw new Error('网络错误 ' + res.status);
        const result = await res.json();
        if (result.code !== 200) throw new Error(result.msg || '获取失败');
        return result.data.map(w => ({
            wordId: w.id,
            word: w.word,
            phonetic: w.phonetic || '',
            meaning: w.meaning,
            level: w.level
        }));
    } catch (e) {
        console.error('获取单词失败:', e);
        alert('获取单词失败，请检查后端服务！');
        return [];
    }
}

// 初始化学习模式
export function initLearningMode() {
    // 首先加载用户数据，确保 currentUser 和 progress 已被加载
    loadUserData();
    if (!currentUser) {
        alert('请先登录！');
        window.location.href = 'index.html';
        return;
    }

    loadCurrentWord();
    setupLearningEventListeners();
    updateLearningProgress();
}

// 加载当前单词
async function loadCurrentWord() {
    console.log('[DEBUG] 开始加载单词，等级=', selectedLevel);
    console.log('[DEBUG] 已学数量=', todayLearnedWords.length);

    const allWords = await fetchWordsByLevel(selectedLevel);
    console.log('[DEBUG] 后端返回单词数=', allWords.length);

    const availableWords = allWords.filter(word =>
        !todayLearnedWords.some(learned => learned.word === word.word)
    );
    console.log('[DEBUG] 可用单词数=', availableWords.length);

    if (availableWords.length === 0) {
        showCompletionModal();
        return;
    }

    const currentWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    displayWord(currentWord);
}

// 显示单词 - 重置动画状态
function displayWord(wordData) {
    const currentWordElement = document.getElementById('currentWord');
    const phoneticElement = document.getElementById('phonetic');
    const meaningElement = document.getElementById('meaning');
    const wordLevelElement = document.getElementById('wordLevel');
    const wordCard = document.getElementById('wordCard');

    // 重置卡片的CSS变换，清除之前动画的效果
    if (wordCard) {
        wordCard.style.transform = 'scale(1)';
        wordCard.style.opacity = '1';
    }

    if (currentWordElement) currentWordElement.textContent = wordData.word;
    if (phoneticElement) phoneticElement.textContent = wordData.phonetic;
    if (meaningElement) meaningElement.textContent = wordData.meaning;
    if (wordLevelElement) {
        const levelNames = { level4: '四级词汇', level6: '六级词汇' };
        wordLevelElement.textContent = levelNames[wordData.level];
    }

    // 存储当前单词
    window.currentWordData = wordData;
}

// 设置学习模式事件监听器
function setupLearningEventListeners() {
    const knowBtn   = document.getElementById('knowBtn');
    const dontKnowBtn = document.getElementById('dontKnowBtn');
    const pronBtn   = document.getElementById('pronunciationBtn');

    // 先解除旧监听，防止重复
    knowBtn?.removeEventListener('click', handleKnow);
    dontKnowBtn?.removeEventListener('click', handleDontKnow);
    pronBtn?.removeEventListener('click', playPronunciation);

    // 再绑定新监听
    knowBtn?.addEventListener('click', handleKnow);
    dontKnowBtn?.addEventListener('click', handleDontKnow);
    pronBtn?.addEventListener('click', playPronunciation);
}

// 把箭头函数提出来，方便 removeEventListener
function handleKnow()        { handleWordResponse(true);  }
function handleDontKnow()    { handleWordResponse(false); }

// 处理单词响应
async function handleWordResponse(isKnown) {
    const knowBtn = document.getElementById('knowBtn');
    const dontKnowBtn = document.getElementById('dontKnowBtn');
    // 禁用按钮，防止重复点击
    if (knowBtn) knowBtn.disabled = true;
    if (dontKnowBtn) dontKnowBtn.disabled = true;

    const wordData = window.currentWordData;
    const wordLevel = wordData.level;
    // 调用后端接口记录学习数据
    try {
        const res = await fetch('http://localhost:8080/api/learning/record/learn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `userId=${currentUser.id}&wordId=${wordData.wordId}&wordLevel=${wordLevel}&isCorrect=${isKnown}`
            // 注意：需确保 wordData 包含 wordId（后端单词表的ID）
        });
        if (!res.ok) throw new Error('记录学习数据失败');
    } catch (e) {
        console.error('提交学习记录失败:', e);
        alert('提交学习记录失败，请检查后端服务！');
    }

    // 更新前端数据
    todayLearnedWords.push({
        ...wordData,
        isKnown: isKnown,
        learnedAt: new Date().toISOString()
    });

    if (!isKnown) {
        if (!notebookWords.some(word => word.word === wordData.word)) {
            notebookWords.push(wordData);
        }
    }

    userStats.totalLearned++;
    userStats.learningCount++;
    if (wordData.level === 'level4') userStats.level4Count++;
    else if (wordData.level === 'level6') userStats.level6Count++;

    saveUserProgress();   //保存统计
    updateLearningProgress();   //更新顶部进度条

    // 保存学习历史数据
    if (typeof saveLearningHistory === 'function') {
        saveLearningHistory(todayLearnedWords.length);
    }

    animateCardTransition();  //卡片动画

    // 等待动画完成
    await new Promise(resolve => setTimeout(resolve, 600));

    // 加载新单词 (displayWord 会重置样式)
    await loadCurrentWord();

    //恢复按钮
    if (knowBtn) knowBtn.disabled = false;
    if (dontKnowBtn) dontKnowBtn.disabled = false;
}

// 卡片过渡动画
function animateCardTransition() {
    const wordCard = document.getElementById('wordCard');
    if (wordCard && typeof anime !== 'undefined') {
        anime({
            targets: wordCard,
            scale: [1, 0.95, 1],
            opacity: [1, 0.7, 1],
            duration: 600,
            easing: 'easeInOutQuad'
        });
    }
}

// 更新学习进度
function updateLearningProgress() {
    const todayProgressElement = document.getElementById('todayProgress');
    const remainingWordsElement = document.getElementById('remainingWords');
    const progressBarElement = document.getElementById('progressBar');

    if (todayProgressElement) todayProgressElement.textContent = todayLearnedWords.length;
    if (remainingWordsElement) remainingWordsElement.textContent = Math.max(0, 10 - todayLearnedWords.length);

    if (progressBarElement) {
        const progress = (todayLearnedWords.length / 10) * 100;
        progressBarElement.style.width = `${Math.min(progress, 100)}%`;
    }
}

// 显示完成模态框
function showCompletionModal() {
    const modal = document.getElementById('completionModal');
    const completedCountElement = document.getElementById('completedCount');

    if (completedCountElement) completedCountElement.textContent = todayLearnedWords.length;
    if (modal) modal.classList.remove('hidden');

    // 确保完成学习时也保存历史数据
    if (typeof saveLearningHistory === 'function') {
        saveLearningHistory(todayLearnedWords.length);
    }
}

// 继续学习
function continueLearning() {
    const modal = document.getElementById('completionModal');
    if (modal) modal.classList.add('hidden');
    loadCurrentWord();
}

// 页面加载完成后初始化 (此监听器适用于 learning.html)
document.addEventListener('DOMContentLoaded', function() {
    // 确保只在 learning.html 页面执行
    if (window.location.pathname.endsWith('learning.html')) {
        initLearningMode();
    }
});

// function afterJudgeWord(wordData) {
//     // 判重
//     if (!todayLearnedWords.find(w => w.word === wordData.word)) {
//         todayLearnedWords.push(wordData);
//     }
//     // 落盘
//     saveUserProgress();
//     // 广播给其它标签页
//     localStorage.setItem('_learning_refresh_', Date.now());
// }

// 返回主页按钮点击时先广播，再后退
window.goHome = function () {
    localStorage.setItem('_learning_refresh_', Date.now()); // 通知主页刷新
    location.replace('main.html');
};