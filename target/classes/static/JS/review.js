let reviewWords = [];
let curIdx = 0;
let curWord = null;
let options = [];
let correctCount=0;

document.addEventListener('DOMContentLoaded', initReviewMode);
async function initReviewMode() {
    if (!currentUser) { /* ... */ }
    reviewWords = await fetchTodayReview();
    if (reviewWords.length === 0) { showNoWords(); return; }
    curIdx = 0;
    correctCount = 0; // 每次进入复习模式重置为0
    renderQuestion();
}

// 获取今日复习单词
async function fetchTodayReview() {
    try {
        const res = await fetch(`http://localhost:8080/api/learning/record/today-review?userId=${currentUser.id}`);
        const json = await res.json();
        if (json.code !== 200) throw new Error(json.msg || '获取失败');
        return json.data || [];
    } catch (e) {
        console.error(e); alert('网络错误：' + e.message); return [];
    }
}

// 渲染题目
function renderQuestion() {
    curWord = reviewWords[curIdx];
    // 单词
    document.getElementById('questionWord').textContent = curWord.word;
    // 生成四选一
    genOptions();
    // 进度
    document.getElementById('reviewProgress').textContent = curIdx + 1;
    document.getElementById('totalReviewWords').textContent = reviewWords.length;
    updateCircle();
}

// 生成四选一选项
function genOptions() {
    // 去掉自己，抽3个干扰项
    const pool = reviewWords.filter(w => w.id !== curWord.id);
    const distracts = pool.sort(() => Math.random() - 0.5).slice(0, 3);
    options = [curWord, ...distracts].sort(() => Math.random() - 0.5);

    const box = document.getElementById('optionsBox');
    box.innerHTML = '';
    options.forEach((w, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn text-white p-6 rounded-2xl text-left';
        btn.textContent = `${String.fromCharCode(65 + i)}. ${w.meaning}`;
        btn.onclick = () => selectOption(w, btn);
        box.appendChild(btn);
    });
}

// 选择释义后
async function selectOption(selected, btn) {
    // 禁用全部选项
    document.querySelectorAll('#optionsBox button').forEach(b => b.disabled = true);
    // 打印当前判断依据，确认是否正确识别"正确答案"
    console.log('当前单词ID：', curWord.id);
    console.log('选择的单词ID：', selected.id);
    const correct = selected.id === curWord.id; // 核心判断条件
    console.log('是否正确：', correct);

    btn.classList.add(correct ? 'correct' : 'incorrect');
    if (!correct) {
        // 标绿正确答案（验证正确答案是否被正确识别）
        document.querySelectorAll('#optionsBox button').forEach(b => {
            if (b.textContent.includes(curWord.meaning)) {
                b.classList.add('correct');
                console.log('正确答案文本：', curWord.meaning);
            }
        });
    }

    userStats.reviewCount++;
    saveUserProgress();

    // 提交结果并计数
    try {
        await fetch('http://localhost:8080/api/learning/record/review', { /* ... */ });

        // 只有正确时才累加，同时打印计数过程
        if (correct) {
            correctCount++;
            console.log('累加后正确数：', correctCount);
        }
    } catch (e) {
        console.error('提交失败:', e);
    }

    setTimeout(() => nextWord(), 1500);
}

// 下一题
function nextWord() {
    curIdx++;
    if (curIdx >= reviewWords.length) return showCompletion();
    renderQuestion();
}
// 辅助弹窗和进度环
function showCompletion() {
    const total = reviewWords.length;
    console.log('总题数：', total);
    console.log('最终正确数：', correctCount);

    // 处理除数为0的情况
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    console.log('计算出的正确率：', accuracy);

    // 确保DOM元素存在
    const accuracyEl = document.getElementById('accuracyRate');
    if (accuracyEl) {
        accuracyEl.textContent = accuracy; // 赋值到DOM
    } else {
        console.error('未找到accuracyRate元素！');
    }
    document.getElementById('completionModal').classList.remove('hidden');
}
function showNoWords() {
    document.getElementById('noWordsModal').classList.remove('hidden');
}
function updateCircle() {
    const total = reviewWords.length;
    const done = curIdx;
    const percent = total ? Math.round((done / total) * 100) : 0;
    document.getElementById('progressPercent').textContent = percent + '%';
    const circle = document.getElementById('progressCircle');
    const offset = 283 - (283 * percent) / 100;
    circle.style.strokeDashoffset = offset;
}

// 发音按钮
document.getElementById('pronunciationBtn').addEventListener('click', () => {
    if (curWord && 'speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(curWord.word);
        u.lang = 'en-US'; u.rate = 0.9;
        speechSynthesis.speak(u);
    }
});