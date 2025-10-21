// 拼写模式
let currentWordIndex = 0;
let spellingSourceWords = []; // 存储从后端获取的学习记录
let spellingCorrect = 0;

// 获取今日复习单词
async function fetchTodayReviewWords() {
    try {
        const res = await fetch(`http://localhost:8080/api/learning/record/today-review?userId=${currentUser.id}`);
        const json = await res.json();
        if (json.code !== 200) throw new Error(json.msg || '获取失败');
        return json.data || [];
    } catch (e) {
        console.error(e); alert('网络错误：' + e.message); return [];
    }
}

async function initSpellingMode() {
    // 1. 校验登录状态
    if (!currentUser) {
        alert('请先登录！');
        window.location.href = 'index.html';
        return;
    }

    // 获取今日复习单词
    const allRecords = await fetchTodayReviewWords();
    if (allRecords.length === 0) {
        document.getElementById('noWordsModal')?.classList.remove('hidden');
        return;
    }

    // 使用今日复习单词进行拼写测试
    spellingSourceWords = shuffleArray(allRecords);

    if (spellingSourceWords.length === 0) {
        alert('没有需要拼写的单词！');
        window.location.href = 'main.html';
        return;
    }

    // 初始化拼写
    currentWordIndex = 0;
    spellingCorrect = 0;
    setupSpellingEventListeners();
    loadSpellingQuestion();
    updateSpellingProgress();
}

function setupSpellingEventListeners() {
    document.getElementById('submitBtn')?.addEventListener('click', checkSpelling);
    document.getElementById('skipBtn')?.addEventListener('click', skipSpelling);
    document.getElementById('nextBtn')?.addEventListener('click', nextSpellingQuestion);
    const spellingInput = document.getElementById('spellingInput');
    if (spellingInput) {
        spellingInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkSpelling(); });
        spellingInput.addEventListener('input', updateLetterSlots);
    }
}

// 加载拼写题目
function loadSpellingQuestion() {
    if (currentWordIndex >= spellingSourceWords.length) {
        showSpellingCompletion();
        return;
    }
    displaySpellingQuestion(spellingSourceWords[currentWordIndex]);
}

function displaySpellingQuestion(wordData) {
    // 显示单词意思
    document.getElementById('wordMeaning').textContent = wordData.meaning;

    // 设置发音按钮
    const pronunciationBtn = document.getElementById('pronunciationBtn');
    if (pronunciationBtn) {
        pronunciationBtn.onclick = () => playWordPronunciation(wordData.word);
    }

    const spellingInput = document.getElementById('spellingInput');
    if (spellingInput) {
        spellingInput.value = '';
        spellingInput.classList.remove('correct', 'incorrect');
        spellingInput.disabled = false;
    }
    document.getElementById('feedbackArea')?.classList.add('hidden');
    createLetterSlots(wordData.word.length);
    window.currentSpellingWord = wordData;
}

function createLetterSlots(length) {
    const letterSlots = document.getElementById('letterSlots');
    if (!letterSlots) return;
    letterSlots.innerHTML = '';
    for (let i = 0; i < length; i++) {
        const slot = document.createElement('div');
        slot.className = 'letter-slot';
        slot.id = `slot${i}`;
        letterSlots.appendChild(slot);
    }
    letterSlots.classList.remove('hidden');
}

function updateLetterSlots() {
    const input = document.getElementById('spellingInput');
    const inputValue = input.value.toUpperCase();
    const word = window.currentSpellingWord.word.toUpperCase();
    for (let i = 0; i < word.length; i++) {
        const slot = document.getElementById(`slot${i}`);
        if (slot) {
            slot.textContent = inputValue[i] || '';
            slot.classList.toggle('filled', i < inputValue.length);
            if (i < inputValue.length) {
                const isCorrect = inputValue[i] === word[i];
                slot.classList.toggle('correct', isCorrect);
                slot.classList.toggle('incorrect', !isCorrect);
            } else {
                slot.classList.remove('correct', 'incorrect');
            }
        }
    }
}

// 处理拼写答案
async function checkSpelling() {
    const input = document.getElementById('spellingInput');
    const inputValue = input.value.trim().toLowerCase();
    const correctWord = window.currentSpellingWord.word.toLowerCase();
    if (!inputValue) { alert('请输入单词！'); return; }

    const isCorrect = inputValue === correctWord;
    if (isCorrect) spellingCorrect++;
    const currentWord = window.currentSpellingWord;

    // 同步拼写结果到后端
    try {
        await fetch('http://localhost:8080/api/learning/record/spelling', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                userId: currentUser.id,
                wordId: currentWord.id,
                spellingResult: isCorrect
            })
        });
    } catch (e) {
        console.error('更新拼写记录失败:', e);
        alert('拼写记录同步失败');
    }

    // 显示反馈
    const feedbackMessage = document.getElementById('feedbackMessage');
    if (isCorrect) {
        input.classList.add('correct');
        if (feedbackMessage) {
            feedbackMessage.textContent = '✅ 拼写正确！';
            feedbackMessage.className = 'text-emerald-400';
        }
        document.getElementById('correctSpelling')?.classList.add('hidden');
        // 延迟1.5秒后自动跳转到下一题
        setTimeout(() => {
            nextSpellingQuestion();
        }, 1500);
    } else {
        input.classList.add('incorrect');
        if (feedbackMessage) {
            feedbackMessage.textContent = '❌ 拼写错误';
            feedbackMessage.className = 'text-red-400';
        }
        const correctSpellingEl = document.getElementById('correctSpelling');
        if (correctSpellingEl) {
            correctSpellingEl.querySelector('span').textContent = window.currentSpellingWord.word;
            correctSpellingEl.classList.remove('hidden');
        }
        // 延迟2秒后自动跳转到下一题
        setTimeout(() => {
            nextSpellingQuestion();
        }, 2000);
    }
    document.getElementById('feedbackArea')?.classList.remove('hidden');

    // 更新本地统计
    userStats.spellingCount++;
    saveUserProgress();
}


function skipSpelling() {
    const feedbackMessage = document.getElementById('feedbackMessage');
    if (feedbackMessage) {
        feedbackMessage.textContent = '⏭️ 已跳过';
        feedbackMessage.className = 'text-slate-400';
    }
    const correctSpellingEl = document.getElementById('correctSpelling');
    if (correctSpellingEl) {
        correctSpellingEl.querySelector('span').textContent = window.currentSpellingWord.word;
        correctSpellingEl.classList.remove('hidden');
    }
    document.getElementById('feedbackArea')?.classList.remove('hidden');
    // 延迟1.5秒后自动跳转到下一题
    setTimeout(() => {
        nextSpellingQuestion();
    }, 1500);
}

function nextSpellingQuestion() {
    currentWordIndex++;
    // 重置按钮状态
    document.getElementById('submitBtn')?.classList.remove('hidden');
    document.getElementById('skipBtn')?.classList.remove('hidden');
    document.getElementById('nextBtn')?.classList.add('hidden');
    updateSpellingProgress();
    loadSpellingQuestion();
}

function updateSpellingProgress() {
    document.getElementById('spellingProgress').textContent = currentWordIndex;
    document.getElementById('totalSpellingWords').textContent = spellingSourceWords.length;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        const progress = (currentWordIndex / spellingSourceWords.length) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    }
}

function showSpellingCompletion() {
    const total = spellingSourceWords.length;
    const accuracy = total ? Math.round((spellingCorrect / total) * 100) : 0; // ③ 防除零
    document.getElementById('accuracyRate').textContent = accuracy;
    document.getElementById('completionModal').classList.remove('hidden');
}

// 播放单词发音
function playWordPronunciation(word) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.endsWith('spelling.html')) {
        initSpellingMode();
    }
});