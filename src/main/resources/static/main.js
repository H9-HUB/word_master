// 单词大师主程序
const selectedLevel = localStorage.getItem('selectedLevel') || 'level6';

// 全局变量
let currentUser = null;
let todayLearnedWords = [];
let notebookWords = [];
let userStats = {
    totalLearned: 0,
    todayLearnedWords: 0,
    streakDays: 0,
    learningCount: 0,
    reviewCount: 0,
    spellingCount: 0,
    level4Count: 0,
    level6Count: 0
};
let isDarkMode;
let errorWords = [];

// 工具函数
//const todayKey = () => new Date().toISOString().slice(0, 10);
//const cacheKey = () => `progress_${currentUser.username}_${todayKey()}`;

// 初始化应用
function initApp() {
    loadUserData();
    setupEventListeners();
    updateTodayProgress();
    if (currentUser) {
        fetchErrorWords();
        fetchUserStats();
    } else {
        updateUI();
    }
}

// 加载用户数据
function loadUserData() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        loadUserProgress();
    }
}

// 加载用户学习进度
function loadUserProgress() {
    if (!currentUser) return;

    const today = new Date().toISOString().slice(0, 10);
    const dayKey = `progress_${currentUser.username}_${today}`;
    const dayRaw = localStorage.getItem(dayKey);
    if (dayRaw) {
        try { todayLearnedWords = JSON.parse(dayRaw).todayLearnedWords || []; } catch {}
    } else {
        todayLearnedWords = [];
    }

    const savedProgress = localStorage.getItem(`progress_${currentUser.username}`);
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        todayLearnedWords = progress.todayLearnedWords || [];
        notebookWords = progress.notebookWords || [];
        userStats = progress.userStats || {
            totalLearned: 0,
            streakDays: 0,
            learningCount: 0,
            reviewCount: 0,
            spellingCount: 0,
            level4Count: 0,
            level6Count: 0
        };
        errorWords = progress.errorWords || [];
    }
}

// 获取错误单词列表
async function fetchErrorWords() {
    if (!currentUser) return;
    // NOTE: 如果需要将删除操作同步到后端，
   // notebookWords.splice(window.wordToDelete, 1);
   // saveUserProgress();
   // loadNotebookWords();
   // hideDeleteModal();
    try {
        const response = await fetch(`http://localhost:8080/api/learning/record/error-words?userId=${currentUser.id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('获取错误单词失败');
        }

        const data = await response.json();
        if (data.code === 200) {
            errorWords = data.data;
            notebookWords = data.data;

            const savedProgress = localStorage.getItem(`progress_${currentUser.username}`);
            if (savedProgress) {
                const progress = JSON.parse(savedProgress);
                progress.errorWords = data.data;
                progress.notebookWords = data.data;
                localStorage.setItem(`progress_${currentUser.username}`, JSON.stringify(progress));
            }

            if (window.location.pathname.includes('notebook.html') && typeof loadNotebookWords === 'function') {
                loadNotebookWords();
            }
            if (window.location.pathname.includes('stats.html') && typeof updateStatsDisplay === 'function') {
                updateStatsDisplay();
            }
        }
    } catch (error) {
        console.error('获取错误单词出错，将使用本地缓存:', error);
        const savedProgress = localStorage.getItem(`progress_${currentUser.username}`);
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            errorWords = progress.errorWords || [];
            notebookWords = progress.notebookWords || errorWords;
        } else {
            errorWords = [];
            notebookWords = [];
        }
        if (window.location.pathname.includes('notebook.html') && typeof loadNotebookWords === 'function') {
            loadNotebookWords();
        }
        if (window.location.pathname.includes('stats.html') && typeof updateStatsDisplay === 'function') {
            updateStatsDisplay();
        }
    }
}

// 保存用户学习进度
function saveUserProgress() {
    if (currentUser) {
        const progress = {
            todayLearnedWords,
            notebookWords,
            userStats,
            lastStudyDate: new Date().toDateString()
        };
        localStorage.setItem(`progress_${currentUser.username}`, JSON.stringify(progress));
    }
}
// 设置事件监听器
function setupEventListeners() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    if (typeof setupAuthEventListeners === 'function') {
        setupAuthEventListeners();
    }
}


// 显示模式选择界面
function showModeSelection() {
    const loginSection = document.getElementById('loginSection');
    const modeSelection = document.getElementById('modeSelection');
    const logoutBtn = document.getElementById('logoutBtn');
    if (loginSection) loginSection.classList.add('hidden');
    if (modeSelection) modeSelection.classList.remove('hidden');
    if (logoutBtn) logoutBtn.classList.remove('hidden');
}

// 显示登录界面
function showLoginSection() {
    const loginSection = document.getElementById('loginSection');
    const modeSelection = document.getElementById('modeSelection');
    const logoutBtn = document.getElementById('logoutBtn');
    if (loginSection) loginSection.classList.remove('hidden');
    if (modeSelection) modeSelection.classList.add('hidden');
    if (logoutBtn) logoutBtn.classList.add('hidden');
}

// 更新UI界面
function updateUI() {
    if (currentUser) {
        showModeSelection();
        updateTodayProgress();
    } else {
        showLoginSection();
    }
}


// 更新今日学习进度
function updateTodayProgress() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;
    const key = `progress_${user.username}`;
    const raw = localStorage.getItem(key);
    let learned = 0;
    if (raw) {
        try { learned = JSON.parse(raw).todayLearnedWords.length; } catch {}
    }
    const el = document.getElementById('todayProgress');
    if (el) el.textContent = learned;
}
//开始学习
function startLearning() {
    if (!currentUser) { alert('请先登录！'); return; }
    window.location.href = 'learning.html';
}
//开始复习
function startReview() {
    if (!currentUser) { alert('请先登录！'); return; }
    window.location.href = 'review.html';
}
//开始拼写
function startSpelling() {
    if (!currentUser) { alert('请先登录！'); return; }
    window.location.href = 'spelling.html';
}
//打开单词本
function openNotebook() {
    if (!currentUser) { alert('请先登录！'); return; }
    window.location.href = 'notebook.html';
}
//打开统计页面
function openStats() {
    if (!currentUser) { alert('请先登录！'); return; }
    window.location.href = 'stats.html';
}
//返回主页
function goHome() {
    window.location.href = 'main.html';
}

function playPronunciation() {
    const wordData = window.currentWordData || window.currentReviewWord || window.currentSpellingWord;
    if (wordData && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(wordData.word);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
    }
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
//初始化单词本
function initNotebookMode() {
    if (!currentUser) { alert('请先登录！'); window.location.href = 'index.html'; return; }
    setupNotebookEventListeners();

    loadNotebookWords();
    fetchErrorWords();
}

//单词本事件监听
function setupNotebookEventListeners() {
    ['filterAll', 'filterLevel4', 'filterLevel6', 'filterKaoyan'].forEach(id => {
        document.getElementById(id)?.addEventListener('click', () => filterNotebookWords(id));
    });
    document.getElementById('cancelDelete')?.addEventListener('click', hideDeleteModal);
    document.getElementById('confirmDelete')?.addEventListener('click', confirmDeleteWord);
}
//加载数据到单词本
function loadNotebookWords() {
    // 此时 notebookWords 已经包含最新的错误单词列表
    document.getElementById('totalWords').textContent = notebookWords.length;
    const emptyState = document.getElementById('emptyState');
    const wordsContainer = document.getElementById('wordsContainer');
    if (notebookWords.length === 0) {
        emptyState?.classList.remove('hidden');
        if (wordsContainer) wordsContainer.innerHTML = '';
        return;
    }
    emptyState?.classList.add('hidden');
    displayNotebookWords(notebookWords);
}
//展示单词
function displayNotebookWords(words) {
    const wordsContainer = document.getElementById('wordsContainer');
    if (!wordsContainer) return;
    wordsContainer.innerHTML = '';
    words.forEach((word, index) => {
        wordsContainer.appendChild(createWordCard(word, index));
    });
}
//创建单词卡片
function createWordCard(wordData, index) {
    const card = document.createElement('div');
    card.className = 'word-card rounded-2xl p-6';
    const levelNames = { level4: '四级', level6: '六级' };
    const levelClasses = { level4: 'level-4', level6: 'level-6' };
    const level = wordData.level || 'level4'; // 添加默认处理
    card.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div class="word-text text-2xl font-bold">${wordData.word}</div>
            <span class="level-badge ${levelClasses[level]}">${levelNames[level]}</span>
        </div>
        <div class="text-slate-300 mb-2">${wordData.phonetic}</div>
        <div class="text-slate-200 mb-4">${wordData.meaning}</div>
        <div class="flex space-x-2">
            <button onclick="playWordPronunciation('${wordData.word}')" class="pronunciation-btn text-white px-4 py-2 rounded-lg text-sm font-medium flex-1">
                🔊 发音
            </button>
            <button onclick="showDeleteModal(${index})" class="remove-btn text-white px-4 py-2 rounded-lg text-sm font-medium">
                删除
            </button>
        </div>`;
    return card;
}
//展示卡片发音
function playWordPronunciation(word) {
    // 检查浏览器是否支持 speechSynthesis
    if ('speechSynthesis' in window) {
        // 创建一个语音合成实例
        const utterance = new SpeechSynthesisUtterance(word);
        // 设置语言为美式英语
        utterance.lang = 'en-US';
        // 设置语速稍慢（0.8 倍速）
        utterance.rate = 0.8;
        // 开始朗读
        speechSynthesis.speak(utterance);
    }
}
//显示删除
function showDeleteModal(index) {
    window.wordToDelete = index;
    document.getElementById('deleteModal')?.classList.remove('hidden');
}

function hideDeleteModal() {
    document.getElementById('deleteModal')?.classList.add('hidden');
    window.wordToDelete = null;
}
//确认删除单词
async function confirmDeleteWord() {
    if (window.wordToDelete !== null) {
        const wordToDelete = notebookWords[window.wordToDelete];
        if (!wordToDelete || !currentUser) {
            hideDeleteModal();
            return;
        }

        try {
            // 调用后端API删除记录
            const response = await fetch(`http://localhost:8080/api/learning/record/delete?userId=${currentUser.id}&wordId=${wordToDelete.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('删除失败');
            }

            const result = await response.json();
            if (result.code === 200) {
                // 从本地数组中删除
                notebookWords.splice(window.wordToDelete, 1);
                saveUserProgress();
                loadNotebookWords();
                hideDeleteModal();
                
                // 显示成功消息
                console.log('单词已从单词本中删除');
            } else {
                throw new Error(result.msg || '删除失败');
            }
        } catch (error) {
            console.error('删除单词失败:', error);
            alert('删除失败，请重试');
        }
    }
}

function filterNotebookWords(filterId) {
    ['filterAll', 'filterLevel4', 'filterLevel6', 'filterKaoyan'].forEach(id => {
        document.getElementById(id)?.classList.remove('active');
    });
    document.getElementById(filterId)?.classList.add('active');

    let filteredWords = notebookWords;
    if (filterId !== 'filterAll') {
        const level = filterId.replace('filter', '').toLowerCase();
        // 过滤时使用单词的 level 字段
        filteredWords = notebookWords.filter(word => word.level === level);
    }

    const filterEmptyState = document.getElementById('filterEmptyState');
    if (filteredWords.length === 0) {
        filterEmptyState?.classList.remove('hidden');
        document.getElementById('wordsContainer').innerHTML = '';
    } else {
        filterEmptyState?.classList.add('hidden');
        displayNotebookWords(filteredWords);
    }
}

// 统计模式
function initStatsMode() {
    if (!currentUser) { alert('请先登录！'); window.location.href = 'index.html'; return; }
    // updateStatsDisplay() 会在数据拉取成功的回调中触发，这里先用本地缓存数据初始化
    updateStatsDisplay();
    // 异步初始化图表
    setTimeout(() => {
        initLearningChart();
    }, 100);

    // 在这里调用，确保数据在渲染前被拉取和更新
    fetchErrorWords();
    fetchUserStats();
}

function updateStatsDisplay() {
    document.getElementById('learningCount').textContent = userStats.totalLearned || 0;   // 学习模式 = 累计
    document.getElementById('reviewCount').textContent = userStats.reviewCount || 0;
    document.getElementById('spellingCount').textContent = userStats.spellingCount || 0; // 拼写测试 = 拼写总量

    document.getElementById('todayLearned').textContent = todayLearnedWords.length;
    document.getElementById('totalLearned').textContent = userStats.totalLearned || 0;
    document.getElementById('notebookCount').textContent = notebookWords.length;
    document.getElementById('streakDays').textContent = userStats.streakDays || 0;

    const progressRing = document.getElementById('progressRing');
    const progressPercent = document.getElementById('progressPercent');
    const currentProgress = document.getElementById('currentProgress');
    if (progressRing && progressPercent && currentProgress) {
        const progress = Math.min((todayLearnedWords.length / 10) * 100, 100);
        const circumference = 2 * Math.PI * 40;
        progressRing.style.strokeDashoffset = circumference - (progress / 100) * circumference;
        progressPercent.textContent = `${Math.round(progress)}%`;
        currentProgress.textContent = todayLearnedWords.length;
    }

    document.getElementById('level4Count').textContent = userStats.level4Count || 0;
    document.getElementById('level6Count').textContent = userStats.level6Count || 0;


    updateAchievementStatus();
}
//更新成就
function updateAchievementStatus() {
    const dailyGoalStatus = document.getElementById('dailyGoalStatus');
    if (dailyGoalStatus) {
        const completed = todayLearnedWords.length >= 10;
        dailyGoalStatus.textContent = completed ? '已完成' : '未完成';
        dailyGoalStatus.className = completed ? 'ml-auto text-emerald-400 font-bold' : 'ml-auto text-slate-400';
    }
    document.getElementById('vocabularyMasterStatus').textContent = `${userStats.totalLearned || 0}/100`;
    document.getElementById('consistentLearnerStatus').textContent = `${userStats.streakDays || 0}/7`;
}


// 使用真实数据
async function initLearningChart() {
    const chartElement = document.getElementById('learningChart');
    if (!chartElement || typeof echarts === 'undefined') return;

    const chart = echarts.init(chartElement);

    try {
        // 从本地存储获取学习历史数据
        const learningHistory = getLearningHistory();

        // 如果有学习历史数据，使用真实数据
        if (learningHistory.length > 0) {
            // 按日期排序
            learningHistory.sort((a, b) => new Date(a.date) - new Date(b.date));

            // 提取日期和学习数量
            const dates = learningHistory.map(item => {
                const date = new Date(item.date);
                return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
            });

            const data = learningHistory.map(item => item.learnedCount);

            const option = {
                backgroundColor: 'transparent',
                textStyle: { color: '#94a3b8' },
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: '#334155',
                    borderColor: '#475569',
                    textStyle: { color: '#f8fafc' }
                },
                xAxis: {
                    type: 'category',
                    data: dates,
                    axisLine: { lineStyle: { color: '#475569' } },
                    axisLabel: { color: '#94a3b8' }
                },
                yAxis: {
                    type: 'value',
                    axisLine: { show: false },
                    axisLabel: { color: '#94a3b8' },
                    splitLine: { lineStyle: { color: '#475569' } }
                },
                grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                series: [{
                    data: data,
                    type: 'line',
                    smooth: true,
                    lineStyle: { color: '#3b82f6', width: 3 },
                    itemStyle: { color: '#3b82f6' },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
                            { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
                        ])
                    }
                }]
            };
            chart.setOption(option);
        } else {
            // 如果没有学习历史，显示空图表
            showEmptyChart(chart);
        }
    } catch (error) {
        console.error('加载学习趋势数据失败:', error);
        showEmptyChart(chart);
    }
}

// 显示空图表
function showEmptyChart(chart) {
    const option = {
        backgroundColor: 'transparent',
        textStyle: { color: '#94a3b8' },
        xAxis: {
            type: 'category',
            data: [],
            axisLine: { lineStyle: { color: '#475569' } },
            axisLabel: { color: '#94a3b8' }
        },
        yAxis: {
            type: 'value',
            axisLine: { show: false },
            axisLabel: { color: '#94a3b8' },
            splitLine: { lineStyle: { color: '#475569' } }
        },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        series: [{
            data: [],
            type: 'line'
        }]
    };
    chart.setOption(option);
}

// 获取学习历史数据
function getLearningHistory() {
    if (!currentUser) return [];

    const key = `learning_history_${currentUser.username}`;
    const historyData = localStorage.getItem(key);

    if (historyData) {
        try {
            return JSON.parse(historyData);
        } catch (error) {
            console.error('解析学习历史数据失败:', error);
            return [];
        }
    }
    return [];
}

// 保存学习历史数据
function saveLearningHistory(learnedCount) {
    if (!currentUser) return;

    const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
    const key = `learning_history_${currentUser.username}`;

    // 获取现有历史数据
    let history = getLearningHistory();

    // 查找今天是否已有记录
    const todayRecordIndex = history.findIndex(item => item.date === today);

    if (todayRecordIndex !== -1) {
        // 更新今天的记录
        history[todayRecordIndex].learnedCount = learnedCount;
    } else {
        // 添加新记录
        history.push({
            date: today,
            learnedCount: learnedCount
        });
    }

    // 保存到本地存储
    localStorage.setItem(key, JSON.stringify(history));
}


// 主题逻辑
function initTheme() {
    const saved = localStorage.getItem('darkMode');
    isDarkMode = saved ? JSON.parse(saved) : true;
    applyTheme();
    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.addEventListener('click', toggleTheme);
    }
}
//主题模式切换
function applyTheme() {
    const body = document.body;
    body.classList.remove('dark-mode', 'light-mode');
    body.classList.add(isDarkMode ? 'dark-mode' : 'light-mode');
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.textContent = isDarkMode ? '🌙' : '☀️';
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    applyTheme();
}

// 搜索功能
function searchWord() {
    const searchInput = document.getElementById('searchInput');
    let keyword = searchInput.value.trim();

    if (!keyword) {
        const mobileSearchInput = document.querySelector('#mobileSearchBox input');
        if(mobileSearchInput) {
            keyword = mobileSearchInput.value.trim();
        }
    }

    if (!keyword) {
        alert('请输入要搜索的单词');
        return;
    }

    window.location.href = `search-results.html?keyword=${encodeURIComponent(keyword)}`;
}

// 退出登录
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        //localStorage.clear();
        localStorage.removeItem('currentUser'); // 仅删登录态
        window.location.href = 'index.html';
    });
}

// 页面加载时绑定头像点击事件
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initApp();

    const path = window.location.pathname;
    const page = path.split("/").pop();

    loadUserData();

    if (page === 'index.html' || page === '') {
        initApp();
    } else if (page === 'notebook.html') {
        initNotebookMode();
    } else if (page === 'stats.html') {
        initStatsMode();
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                searchWord();
            }
        });
    }

    // 绑定关闭按钮事件
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeUserInfoModal();
        });
    }

    // 绑定取消按钮事件
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeUserInfoModal();
        });
    }

    // 绑定表单提交事件
    const updateUserForm = document.getElementById('updateUserForm');
    if (updateUserForm) {
        updateUserForm.addEventListener('submit', handleUpdateUserInfo);
    }

    // 点击模态框外部关闭
    const userInfoModal = document.getElementById('userInfoModal');
    if (userInfoModal) {
        window.addEventListener('click', function(event) {
            if (event.target === userInfoModal) {
                closeUserInfoModal();
            }
        });
    }

    // 使用事件委托绑定头像点击事件
    document.addEventListener('click', function(event) {
        if (event.target.closest('.avatar-container')) {
            openUserInfoModal();
        }
    });
});
//从后端获取用户的学习记录
async function fetchWordLearningRecords() {
    if (!currentUser) return [];

    try {
        // 将路径从 /api/learning/records 改为 /api/learning/record/list
        const res = await fetch(`http://localhost:8080/api/learning/record/list?userId=${currentUser.id}`);
        if (!res.ok) throw new Error('获取学习记录失败');

        const records = await res.json();
        return records.data; // 假设后端Result封装了data字段
    } catch (e) {
        console.error('获取学习记录错误:', e);
        alert('无法加载学习记录，请检查网络');
        return [];
    }
}


async function fetchUserStats() {
    if (!currentUser) return;

    try {
        // 改用你后端实际的接口路径
        const response = await fetch(
            `http://localhost:8080/api/learning/record/stats-summary?userId=${currentUser.id}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }
        );

        if (!response.ok) {
            throw new Error('获取用户统计数据失败');
        }

        const data = await response.json();
        console.log('统计数据响应:', data); // 调试日志

        if (data.code === 200 && data.data) {
            const stats = data.data;

            // 更新全局统计变量
            userStats = {
                totalLearned  : stats.totalLearned || 0,
                streakDays    : stats.streakDays || 0,
                level4Count   : stats.level4Count || 0,
                level6Count   : stats.level6Count || 0,
                learningCount : userStats.learningCount, // 保留本地
                spellingCount : userStats.spellingCount, // 保留本地
                reviewCount   : userStats.reviewCount    // 保留本地
            };

            // 保存到本地缓存
            saveUserProgress();

            // 刷新主页 UI
            if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
                updateUI();
            }

            // 刷新统计页 UI
            if (window.location.pathname.includes('stats.html') && typeof updateStatsDisplay === 'function') {
                updateStatsDisplay();
            }

            console.log('统计数据已更新:', userStats);
        } else {
            throw new Error(`API 返回错误: ${data.msg || '未知错误'}`);
        }
    } catch (error) {
        console.error('获取用户统计数据出错:', error);
        // 接口失败时保持本地缓存，不中断程序
        console.log('将使用本地缓存数据');
    }
}
//主页-学习进度实时联动
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && currentUser) {
        loadUserProgress();   // 重新读缓存
        updateTodayProgress();
    }
});
window.addEventListener('storage', e => {
    if (e.key === '_learning_refresh_' && currentUser) {
        loadUserProgress();
        updateTodayProgress();
    }
});
// 打开用户信息修改模态框
function openUserInfoModal() {
    if (!currentUser) {
        alert('请先登录');
        return;
    }

    const modal = document.getElementById('userInfoModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        // 填充当前用户名
        const newUsernameInput = document.getElementById('newUsername');
        if (newUsernameInput) {
            newUsernameInput.value = currentUser.username || '';
        }
        // 清空密码字段
        const oldPasswordInput = document.getElementById('oldPassword');
        const newPasswordInput = document.getElementById('newPassword');
        if (oldPasswordInput) oldPasswordInput.value = '';
        if (newPasswordInput) newPasswordInput.value = '';
        // 清空消息提示
        const updateMessage = document.getElementById('updateMessage');
        if (updateMessage) {
            updateMessage.textContent = '';
            updateMessage.classList.add('hidden');
        }
    }
}

// 关闭用户信息修改模态框
function closeUserInfoModal() {
    const modal = document.getElementById('userInfoModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
}

// 处理用户信息更新
async function handleUpdateUserInfo(event) {
    event.preventDefault();

    if (!currentUser) {
        alert('请先登录');
        return;
    }

    const newUsername = document.getElementById('newUsername').value.trim();
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;

    // 验证用户名不为空
    if (!newUsername) {
        showUpdateMessage('用户名不能为空', 'error');
        return;
    }

    // 如果修改密码，则旧密码和新密码都必填
    if ((oldPassword || newPassword) && (!oldPassword || !newPassword)) {
        showUpdateMessage('修改密码时，旧密码和新密码都不能为空', 'error');
        return;
    }
    try {
        showUpdateMessage('正在保存...', 'loading');
        const updateData = {
            userId: currentUser.id,
            newUsername: newUsername,
        };
        if (oldPassword) {
            updateData.oldPassword = oldPassword;
        }
        if (newPassword) {
            updateData.newPassword = newPassword;
        }

        const response = await fetch('http://localhost:8080/api/user/update-info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });
        if (!response.ok) {
            throw new Error('请求失败');
        }
        const result = await response.json();
        if (result.code === 200) {
            // 更新本地存储的用户信息
            currentUser.username = newUsername;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            showUpdateMessage('✓ 更新成功', 'success');

            // 立即关闭模态框
            setTimeout(() => {
                const modal = document.getElementById('userInfoModal');
                if (modal) {
                    modal.classList.add('hidden');
                    modal.style.display = 'none';
                }
            }, 1000);
        } else {
            showUpdateMessage(result.msg || '更新失败，请重试', 'error');
        }
    } catch (error) {
        console.error('更新用户信息出错:', error);
        showUpdateMessage('网络错误，请检查连接后重试', 'error');
    }
}

// 显示更新消息
function showUpdateMessage(message, type) {
    const updateMessage = document.getElementById('updateMessage');
    if (updateMessage) {
        updateMessage.textContent = message;
        updateMessage.className = '';
        updateMessage.classList.add(type);
        updateMessage.classList.remove('hidden');
    }
}
window.openUserInfoModal = openUserInfoModal;
window.closeUserInfoModal = closeUserInfoModal;
window.fetchErrorWords = fetchErrorWords;
window.startLearning = startLearning;
window.startReview = startReview;
window.startSpelling = startSpelling;
window.openNotebook = openNotebook;
window.openStats = openStats;
window.saveLearningHistory = saveLearningHistory;
window.getLearningHistory = getLearningHistory;