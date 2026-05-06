// KOC AI增长助手 - 主应用逻辑（连接真实后端API）

// ==================== 全局状态管理 ====================
// 后端API地址（生产环境使用相对路径）
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : '';  // 生产环境使用同源（通过FastAPI统一服务）

const AppState = {
    currentPage: 'diagnosis',
    api_config: {
        endpoint: 'https://api.openai.com/v1',
        api_key: '',
        model: 'gpt-4-turbo',
        temperature: 0.7
    },
    isConfigured: false,
    currentAccount: null  // 当前登录的Demo账号
};

// Demo账号数据
const DEMO_ACCOUNTS = [
    {
        id: "koc_001",
        name: "舌尖上的城市",
        category: "food",
        categoryName: "美食探店",
        avatar: "🍜",
        bio: "专注城市美食探店，分享地道小吃与网红餐厅，带你吃遍大街小巷",
        platform: "视频号",
        stats: {
            followers: 45200,
            views: 1280000,
            likes: 89500,
            comments: 12300,
            engagementRate: 7.2
        },
        recentContent: [
            {title: "藏在巷子里的老字号牛肉面", views: 125000, likes: 8900, date: "2026-05-01"},
            {title: "人均30吃到撑的自助火锅", views: 98000, likes: 7200, date: "2026-04-28"},
            {title: "这家人气煎饼果子太绝了", views: 156000, likes: 11200, date: "2026-04-25"}
        ],
        audience: {age: "25-40岁", gender: "女性偏多", location: "一二线城市"},
        contentTags: ["美食探店", "地道小吃", "性价比", "网红餐厅", "周末去哪吃"]
    },
    {
        id: "koc_002",
        name: "科技小达人",
        category: "tech",
        categoryName: "科技数码",
        avatar: "📱",
        bio: "数码产品评测与推荐，带你了解最新科技资讯，拒绝智商税",
        platform: "抖音",
        stats: {
            followers: 128000,
            views: 5600000,
            likes: 432000,
            comments: 28900,
            engagementRate: 8.2
        },
        recentContent: [
            {title: "2000元手机拍照对比测评", views: 890000, likes: 67500, date: "2026-05-03"},
            {title: "这款平替耳机竟然超越原装？", views: 567000, likes: 42300, date: "2026-04-29"},
            {title: "选购指南：笔记本看这篇就够了", views: 432000, likes: 31500, date: "2026-04-26"}
        ],
        audience: {age: "18-35岁", gender: "男性偏多", location: "全国分布"},
        contentTags: ["数码评测", "手机推荐", "笔记本", "耳机测评", "科技资讯"]
    },
    {
        id: "koc_003",
        name: "慢享生活家",
        category: "lifestyle",
        categoryName: "生活方式",
        avatar: "🌿",
        bio: "分享简约生活理念，在忙碌中寻找诗意，追求有品质的慢生活",
        platform: "小红书",
        stats: {
            followers: 78500,
            views: 2100000,
            likes: 186000,
            comments: 15800,
            engagementRate: 9.6
        },
        recentContent: [
            {title: "我的极简家居布置清单", views: 234000, likes: 28900, date: "2026-05-02"},
            {title: "早起的1小时我都做什么", views: 189000, likes: 21500, date: "2026-04-27"},
            {title: "低成本提升幸福感的10件小事", views: 312000, likes: 35600, date: "2026-04-24"}
        ],
        audience: {age: "22-35岁", gender: "女性为主", location: "一二线城市"},
        contentTags: ["极简生活", "自我提升", "日常vlog", "家居好物", "生活方式"]
    },
    {
        id: "koc_004",
        name: "编程星球",
        category: "education",
        categoryName: "知识教育",
        avatar: "💻",
        bio: "编程入门与职业发展指导，让小白也能轻松学编程",
        platform: "B站",
        stats: {
            followers: 256000,
            views: 8900000,
            likes: 678000,
            comments: 45600,
            engagementRate: 8.1
        },
        recentContent: [
            {title: "Python入门保姆级教程", views: 1250000, likes: 98000, date: "2026-05-01"},
            {title: "程序员简历这样写，HR看了贼开心", views: 567000, likes: 43200, date: "2026-04-28"},
            {title: "AI时代学什么语言最吃香", views: 789000, likes: 56700, date: "2026-04-25"}
        ],
        audience: {age: "18-30岁", gender: "男性偏多", location: "全国分布"},
        contentTags: ["编程教程", "Python", "职业规划", "AI工具", "学习方法"]
    },
    {
        id: "koc_005",
        name: "美妆日记",
        category: "fashion",
        categoryName: "时尚美妆",
        avatar: "💄",
        bio: "平价好物推荐与化妆技巧分享，普通女孩的变美指南",
        platform: "视频号",
        stats: {
            followers: 67200,
            views: 1890000,
            likes: 145000,
            comments: 18900,
            engagementRate: 8.6
        },
        recentContent: [
            {title: "学生党必备的5支口红", views: 345000, likes: 42300, date: "2026-05-02"},
            {title: "新手化妆详细步骤分享", views: 289000, likes: 35600, date: "2026-04-29"},
            {title: "这套护肤品用了3年没换过", views: 234000, likes: 28900, date: "2026-04-26"}
        ],
        audience: {age: "18-28岁", gender: "女性为主", location: "二三线城市"},
        contentTags: ["美妆教程", "平价好物", "化妆技巧", "护肤心得", "变美日记"]
    }
];

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // 检查是否已登录
    const savedAccount = localStorage.getItem('koc_current_account');
    const savedApiConfig = localStorage.getItem('koc_ai_config');

    if (savedAccount && savedApiConfig) {
        // 已登录，加载保存的状态
        try {
            AppState.currentAccount = JSON.parse(savedAccount);
            const config = JSON.parse(savedApiConfig);
            AppState.api_config = config;
            AppState.isConfigured = true;

            // 显示主界面
            showMainApp();
            updateAccountUI();
        } catch (e) {
            showLoginPage();
        }
    } else {
        // 未登录，显示登录页面
        showLoginPage();
    }

    // 初始化导航
    initializeNavigation();

    // 初始化温度滑块
    initializeTemperatureSlider();

    // 初始化工具标签
    initializeToolTabs();

    console.log('KOC AI增长助手已初始化，后端API：', API_BASE_URL);
}

// ==================== 登录功能 ====================
function showLoginPage() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('sidebar').style.display = 'none';
    document.querySelector('.main-content').style.display = 'none';
    renderDemoAccounts();
}

function showMainApp() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('sidebar').style.display = 'flex';
    document.querySelector('.main-content').style.display = 'block';
}

function renderDemoAccounts() {
    const container = document.getElementById('demoAccounts');
    let html = '';

    DEMO_ACCOUNTS.forEach(account => {
        html += `
            <div class="demo-account-card" onclick="selectDemoAccount('${account.id}')">
                <div class="demo-avatar">${account.avatar}</div>
                <div class="demo-info">
                    <h3>${account.name}</h3>
                    <p>${account.categoryName} · ${account.platform}</p>
                    <span class="demo-stats">
                        <i class="fas fa-users"></i> ${formatNumber(account.stats.followers)} 粉丝
                    </span>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function selectDemoAccount(accountId) {
    const account = DEMO_ACCOUNTS.find(a => a.id === accountId);
    if (!account) return;

    // 检查是否已配置API
    const apiKey = document.getElementById('loginApiKey').value.trim();
    if (!apiKey) {
        alert('请先填写API密钥！');
        return;
    }

    // 保存账号和API配置
    AppState.currentAccount = account;
    AppState.api_config = {
        endpoint: document.getElementById('loginApiEndpoint').value.trim() || 'https://api.openai.com/v1',
        api_key: apiKey,
        model: document.getElementById('loginModelName').value.trim() || 'gpt-4-turbo',
        temperature: 0.7
    };
    AppState.isConfigured = true;

    localStorage.setItem('koc_current_account', JSON.stringify(account));
    localStorage.setItem('koc_ai_config', JSON.stringify(AppState.api_config));

    showMainApp();
    updateAccountUI();
}

function loginWithCustom() {
    const apiKey = document.getElementById('loginApiKey').value.trim();
    if (!apiKey) {
        alert('请填写API密钥！');
        return;
    }

    // 使用自定义API配置，但不选择demo账号
    AppState.currentAccount = {
        id: "custom",
        name: "自定义账号",
        category: "custom",
        categoryName: "自定义",
        avatar: "👤",
        bio: "使用自定义API配置",
        platform: "自定义",
        stats: {followers: 0, views: 0, likes: 0, comments: 0, engagementRate: 0},
        recentContent: [],
        audience: {age: "未知", gender: "未知", location: "未知"},
        contentTags: []
    };
    AppState.api_config = {
        endpoint: document.getElementById('loginApiEndpoint').value.trim() || 'https://api.openai.com/v1',
        api_key: apiKey,
        model: document.getElementById('loginModelName').value.trim() || 'gpt-4-turbo',
        temperature: 0.7
    };
    AppState.isConfigured = true;

    localStorage.setItem('koc_current_account', JSON.stringify(AppState.currentAccount));
    localStorage.setItem('koc_ai_config', JSON.stringify(AppState.api_config));

    showMainApp();
    updateAccountUI();
}

function logout() {
    // 清除登录状态，但保留API配置
    AppState.currentAccount = null;
    localStorage.removeItem('koc_current_account');
    showLoginPage();
}

function updateAccountUI() {
    const account = AppState.currentAccount;
    if (!account) return;

    // 更新侧边栏账号信息
    const accountDiv = document.getElementById('currentAccount');
    accountDiv.style.display = 'flex';
    document.getElementById('accountAvatar').textContent = account.avatar;
    document.getElementById('accountName').textContent = account.name;
    document.getElementById('accountCategory').textContent = account.categoryName;

    // 更新诊断页面的账号信息
    document.getElementById('diagnosisAccountAvatar').textContent = account.avatar;
    document.getElementById('diagnosisAccountName').textContent = account.name;
    document.getElementById('diagnosisAccountBio').textContent = account.bio;

    // 更新账号统计数据
    const statsHtml = `
        <span><i class="fas fa-users"></i> ${formatNumber(account.stats.followers)}</span>
        <span><i class="fas fa-eye"></i> ${formatNumber(account.stats.views)}</span>
        <span><i class="fas fa-heart"></i> ${formatNumber(account.stats.likes)}</span>
    `;
    document.getElementById('accountStatsMini').innerHTML = statsHtml;

    // 更新数据看板
    updateDashboard(account);

    // 加载API配置到配置页面
    loadConfigToPage();
}

function updateDashboard(account) {
    // 更新统计卡片
    document.getElementById('followerCount').textContent = formatNumber(account.stats.followers);
    document.getElementById('viewCount').textContent = formatNumber(account.stats.views);
    document.getElementById('likeCount').textContent = formatNumber(account.stats.likes);
    document.getElementById('commentCount').textContent = formatNumber(account.stats.comments);

    // 更新变化指示（模拟数据）
    document.getElementById('followerChange').textContent = '+328 本周';
    document.getElementById('viewChange').textContent = '+2,341 本周';
    document.getElementById('likeChange').textContent = '+456 本周';
    document.getElementById('commentChange').textContent = '+89 本周';

    // 更新近期内容
    const contentList = document.getElementById('recentContentList');
    if (contentList && account.recentContent) {
        let html = '<div class="content-list">';
        account.recentContent.forEach(content => {
            html += `
                <div class="content-item">
                    <div class="content-title">${content.title}</div>
                    <div class="content-meta">
                        <span><i class="fas fa-eye"></i> ${formatNumber(content.views)}</span>
                        <span><i class="fas fa-heart"></i> ${formatNumber(content.likes)}</span>
                        <span class="content-date">${content.date}</span>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        contentList.innerHTML = html;
    }

    // 更新受众画像
    const audienceDiv = document.getElementById('audienceProfile');
    if (audienceDiv && account.audience) {
        audienceDiv.innerHTML = `
            <div class="audience-item">
                <i class="fas fa-user"></i>
                <span>年龄：${account.audience.age}</span>
            </div>
            <div class="audience-item">
                <i class="fas fa-venus-mars"></i>
                <span>性别：${account.audience.gender}</span>
            </div>
            <div class="audience-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>地区：${account.audience.location}</span>
            </div>
        `;
    }

    // 更新内容标签
    const tagsDiv = document.getElementById('contentTags');
    if (tagsDiv && account.contentTags) {
        let html = '';
        account.contentTags.forEach(tag => {
            html += `<span class="tag">${tag}</span>`;
        });
        tagsDiv.innerHTML = html;
    }
}

// ==================== 导航功能 ====================
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const pageId = this.getAttribute('data-page');
            switchPage(pageId);
        });
    });
}

function switchPage(pageId) {
    // 更新导航状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === pageId) {
            item.classList.add('active');
        }
    });

    // 更新页面显示
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(`page-${pageId}`).classList.add('active');

    AppState.currentPage = pageId;
}

// ==================== API配置功能 ====================
function loadConfigToPage() {
    const config = AppState.api_config;
    if (document.getElementById('apiEndpoint')) {
        document.getElementById('apiEndpoint').value = config.endpoint || '';
    }
    if (document.getElementById('apiKey')) {
        document.getElementById('apiKey').value = config.api_key || '';
    }
    if (document.getElementById('modelName')) {
        document.getElementById('modelName').value = config.model || '';
    }
    if (document.getElementById('temperature')) {
        document.getElementById('temperature').value = config.temperature || 0.7;
        if (document.getElementById('tempValue')) {
            document.getElementById('tempValue').textContent = config.temperature || 0.7;
        }
    }
}

function loadSavedConfig() {
    const saved = localStorage.getItem('koc_ai_config');
    if (saved) {
        try {
            const config = JSON.parse(saved);
            AppState.api_config = config;
            AppState.isConfigured = true;
        } catch (e) {
            console.error('加载配置失败:', e);
        }
    }
}

function saveConfig() {
    const config = {
        endpoint: document.getElementById('apiEndpoint').value,
        api_key: document.getElementById('apiKey').value,
        model: document.getElementById('modelName').value,
        temperature: parseFloat(document.getElementById('temperature').value)
    };

    localStorage.setItem('koc_ai_config', JSON.stringify(config));
    AppState.api_config = config;
    AppState.isConfigured = true;

    // 同时更新当前账号的API配置
    if (AppState.currentAccount) {
        localStorage.setItem('koc_current_account', JSON.stringify(AppState.currentAccount));
    }

    showStatus('success', '配置保存成功！');
}

async function testConnection() {
    const endpoint = document.getElementById('apiEndpoint').value;
    const apiKey = document.getElementById('apiKey').value;
    const model = document.getElementById('modelName').value;

    if (!apiKey) {
        showStatus('error', '请填写API密钥！');
        return;
    }

    showStatus('info', '正在测试连接...');

    const config = {
        endpoint: endpoint,
        api_key: apiKey,
        model: model,
        temperature: 0.7
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/test`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({api_config: config})
        });

        const result = await response.json();

        if (result.success) {
            showStatus('success', 'API连接测试成功！');
        } else {
            showStatus('error', `测试失败：${result.error}`);
        }
    } catch (error) {
        showStatus('error', `网络错误：${error.message}`);
    }
}

async function fetchModelList() {
    const endpoint = document.getElementById('apiEndpoint').value;
    const apiKey = document.getElementById('apiKey').value;

    if (!apiKey) {
        showStatus('error', '请先填写API密钥！');
        return;
    }

    showStatus('info', '正在获取模型列表...');

    const config = {
        endpoint: endpoint,
        api_key: apiKey,
        model: 'gpt-4-turbo',
        temperature: 0.7
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/models`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({api_config: config})
        });

        const result = await response.json();

        if (result.success) {
            const models = result.data.models || [];
            const select = document.getElementById('modelName');
            const currentVal = select.value || AppState.api_config.model || '';

            select.innerHTML = '';

            if (models.length === 0) {
                select.innerHTML = '<option value="">未获取到模型</option>';
                showStatus('error', '未获取到可用模型，请手动输入');
                return;
            }

            models.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m.id;
                opt.textContent = m.id;
                if (m.id === currentVal) opt.selected = true;
                select.appendChild(opt);
            });

            showStatus('success', `成功获取 ${models.length} 个模型`);
        } else {
            showStatus('error', `获取失败：${result.error}`);
        }
    } catch (error) {
        showStatus('error', `网络错误：${error.message}`);
    }
}

async function fetchModelListLogin() {
    const endpoint = document.getElementById('loginApiEndpoint').value;
    const apiKey = document.getElementById('loginApiKey').value;

    if (!apiKey) {
        alert('请先填写API密钥！');
        return;
    }

    const config = {
        endpoint: endpoint,
        api_key: apiKey,
        model: 'gpt-4-turbo',
        temperature: 0.7
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/models`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({api_config: config})
        });

        const result = await response.json();

        if (result.success) {
            const models = result.data.models || [];
            const select = document.getElementById('loginModelName');
            const currentVal = select.value || 'gpt-4-turbo';

            select.innerHTML = '';

            models.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m.id;
                opt.textContent = m.id;
                if (m.id === currentVal) opt.selected = true;
                select.appendChild(opt);
            });

            if (models.length > 0) {
                alert(`成功获取 ${models.length} 个模型，已填入下拉框`);
            }
        } else {
            alert(`获取失败：${result.error}`);
        }
    } catch (error) {
        alert(`网络错误：${error.message}`);
    }
}

function loadPreset(preset) {
    const presets = {
        openai: {endpoint: 'https://api.openai.com/v1', model: 'gpt-4-turbo'},
        hunyuan: {endpoint: 'https://api.hunyuan.cloud.tencent.com/v1', model: 'hunyuan-pro'},
        deepseek: {endpoint: 'https://api.deepseek.com/v1', model: 'deepseek-chat'},
        custom: {endpoint: '', model: ''}
    };

    const p = presets[preset];
    if (p) {
        document.getElementById('apiEndpoint').value = p.endpoint;
        const modelSelect = document.getElementById('modelName');
        // 尝试在现有选项中选中，否则设为自定义值
        const existingOption = Array.from(modelSelect.options).find(o => o.value === p.model);
        if (existingOption) {
            existingOption.selected = true;
        } else {
            modelSelect.value = p.model;
        }
    }
}

function showStatus(type, message) {
    const statusDiv = document.getElementById('configStatus');
    if (!statusDiv) return;

    const iconClass = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle';
    const color = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';

    statusDiv.innerHTML = `<i class="fas ${iconClass}" style="color:${color}"></i> ${message}`;
    statusDiv.style.display = 'block';

    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 3000);
}

// ==================== 账号诊断功能（使用当前账号）====================
async function startDiagnosis() {
    if (!AppState.currentAccount) {
        alert('请先登录！');
        showLoginPage();
        return;
    }

    if (!AppState.isConfigured) {
        alert('请先配置API连接！');
        switchPage('config');
        return;
    }

    const account = AppState.currentAccount;
    const focus = document.getElementById('diagnosisFocus')?.value || '';

    showLoading('diagnosisResult', 'AI正在分析账号...', 'diagnosisLoading');

    try {
        const requestBody = {
            api_config: AppState.api_config,
            account_name: account.name,
            account_bio: account.bio,
            account_platform: account.platform || '未知平台',
            account_category: account.categoryName || '未知类目',
            account_avatar: account.avatar || '',
            stats: account.stats || {},
            audience: account.audience || {},
            recent_content: account.recentContent || [],
            content_tags: account.contentTags || [],
            focus: focus || ''
        };

        const response = await fetch(`${API_BASE_URL}/api/diagnosis`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(requestBody)
        });

        console.log('[诊断请求数据]', JSON.stringify(requestBody, null, 2));

        const result = await response.json();

        console.log('[AI返回原始数据]', JSON.stringify(result, null, 2));

        if (result.success) {
            displayDiagnosisResult(account, account.name, account.bio, result.data);
        } else {
            alert(`诊断失败：${result.error}`);
            hideLoadingForce('diagnosisLoading');
        }
    } catch (error) {
        alert(`网络错误：${error.message}。请确保后端服务已启动。`);
        hideLoadingForce('diagnosisLoading');
    }
}

function displayDiagnosisResult(account, name, bio, data) {
    // 先隐藏loading层
    const loadingEl = document.getElementById('diagnosisLoading');
    if (loadingEl) loadingEl.style.display = 'none';

    const resultDiv = document.getElementById('diagnosisResult');
    resultDiv.style.display = 'block';

    const fullReport = data.full_report || '';
    const diagnosisResult = data.diagnosis_result || {};

    // 解析报告内容，分块显示
    const sections = parseReportSections(fullReport);

    // 如果AI没有返回具体章节，使用账号原始数据作为后备
    const positioningContent = sections.positioning || fullReport.substring(0, 500) || '<p>暂无定位分析</p>';
    const strategyContent = sections.strategy || '<p>暂无内容策略建议</p>';

    // 受众画像：优先用AI分析的，其次用账号原始数据
    const audienceContent = sections.audience || (account.audience ? `
        <div class="report-text">
            <p><strong>📊 基础画像（基于账号数据）</strong></p>
            <ul>
                <li>年龄分布：${account.audience.age || '未知'}</li>
                <li>性别比例：${account.audience.gender || '未知'}</li>
                <li>地域分布：${account.audience.location || '未知'}</li>
            </ul>
            ${account.contentTags && account.contentTags.length ? `<p><strong>🏷️ 内容标签：</strong>${account.contentTags.join('、')}</p>` : ''}
        </div>
    ` : '<p>暂无受众画像分析</p>');

    const growthContent = sections.growth || '<p>暂无涨粉计划</p>';

    document.getElementById('positioningAnalysis').innerHTML = positioningContent;
    document.getElementById('contentStrategy').innerHTML = strategyContent;
    document.getElementById('audienceProfile').innerHTML = audienceContent;
    document.getElementById('growthPlan').innerHTML = growthContent;

    const score = diagnosisResult.score || 75;
    animateScore(score);

    resultDiv.scrollIntoView({behavior: 'smooth'});
}

function parseReportSections(report) {
    // 尝试从Markdown格式中提取各个部分
    const sections = {};

    // 定位分析
    const positioningMatch = report.match(/[#]*.*定位[分析]?[：:]\s*([\s\S]*?)(?=#|#.*策略|#.*受众|#.*涨粉|##|$)/i);
    if (positioningMatch) {
        sections.positioning = `<div class="report-text">${positioningMatch[1].trim().replace(/\n/g, '<br>')}</div>`;
    }

    // 内容策略
    const strategyMatch = report.match(/[#]*.*内容策略[：:]\s*([\s\S]*?)(?=#|#.*受众|#.*涨粉|##|$)/i);
    if (strategyMatch) {
        sections.strategy = `<div class="report-text">${strategyMatch[1].trim().replace(/\n/g, '<br>')}</div>`;
    }

    // 受众画像
    const audienceMatch = report.match(/[#]*.*受众[画像]?[：:]\s*([\s\S]*?)(?=#|#.*涨粉|##|$)/i);
    if (audienceMatch) {
        sections.audience = `<div class="report-text">${audienceMatch[1].trim().replace(/\n/g, '<br>')}</div>`;
    }

    // 涨粉计划
    const growthMatch = report.match(/[#]*.*涨粉[计划]?[：:]\s*([\s\S]*?)(?=#|##|$)/i);
    if (growthMatch) {
        sections.growth = `<div class="report-text">${growthMatch[1].trim().replace(/\n/g, '<br>')}</div>`;
    }

    return sections;
}

function animateScore(targetScore) {
    const circle = document.getElementById('scoreCircle');
    const text = document.getElementById('scoreText');
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (targetScore / 100) * circumference;

    circle.style.strokeDasharray = `${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;

    setTimeout(() => {
        circle.style.strokeDashoffset = `${offset}`;
    }, 100);

    let current = 0;
    const interval = setInterval(() => {
        current += 1;
        text.textContent = current;
        if (current >= targetScore) clearInterval(interval);
    }, 20);
}

// ==================== 智能选题功能 ====================
async function generateTopics() {
    const category = document.getElementById('contentCategory').value;
    const count = parseInt(document.getElementById('topicCount').value);
    const creativity = document.getElementById('creativityLevel').value;

    if (!AppState.isConfigured) {
        alert('请先配置API连接！');
        switchPage('config');
        return;
    }

    showLoading('topicsList', 'AI正在生成选题...', 'topicsLoading');

    try {
        const requestBody = {
            api_config: AppState.api_config,
            content_category: category,
            topic_count: count,
            creativity_level: creativity
        };

        const response = await fetch(`${API_BASE_URL}/api/topics`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();

        if (result.success) {
            displayTopics(result.data.topics || []);
        } else {
            const errorMsg = result.error || result.message || '未知错误';
            alert(`选题生成失败：${errorMsg}`);
            hideLoadingForce('topicsLoading');
        }
    } catch (error) {
        alert(`网络错误：${error.message}。请确保后端服务已启动。`);
        hideLoadingForce('topicsLoading');
    }
}

function displayTopics(topics) {
    // 先隐藏loading层
    const loadingEl = document.getElementById('topicsLoading');
    if (loadingEl) loadingEl.style.display = 'none';

    const container = document.getElementById('topicsList');

    if (!topics || topics.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-lightbulb"></i>
                <p>暂无选题推荐</p>
            </div>
        `;
        return;
    }

    let html = '';
    topics.forEach((topic, index) => {
        const title = topic.title || topic.topic || `选题 ${index + 1}`;
        const desc = topic.description || topic.reason || topic.brief || '';
        const heat = topic.heat || topic.engagement || 75;

        html += `
            <div class="topic-card">
                <div class="topic-header">
                    <span class="topic-number">${index + 1}</span>
                    <span class="topic-title">${title}</span>
                    <span class="topic-heat">
                        <i class="fas fa-fire"></i> ${heat}%
                    </span>
                </div>
                <p class="topic-desc">${desc}</p>
                <div class="topic-actions">
                    <button class="btn btn-primary btn-small" onclick="useTopic('${title.replace(/'/g, "\\'")}')">
                        <i class="fas fa-pen"></i> 创作内容
                    </button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function useTopic(topicTitle) {
    // 跳转到内容创作页面并填入主题
    switchPage('content');
    const topicInput = document.getElementById('videoTopic');
    if (topicInput) {
        topicInput.value = topicTitle;
    }
}

// ==================== 内容创作功能 ====================
function initializeToolTabs() {
    const tabs = document.querySelectorAll('.tool-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const toolId = this.getAttribute('data-tool');
            switchTool(toolId);
        });
    });
}

function switchTool(toolId) {
    document.querySelectorAll('.tool-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-tool') === toolId) {
            tab.classList.add('active');
        }
    });

    document.querySelectorAll('.tool-content').forEach(content => {
        content.style.display = 'none';
    });

    const targetTool = document.getElementById(`${toolId}Tool`);
    if (targetTool) {
        targetTool.style.display = 'block';
    }
}

async function generateScript() {
    const topic = document.getElementById('videoTopic').value;
    const duration = parseInt(document.getElementById('videoDuration').value);
    const style = document.querySelector('input[name="style"]:checked').value;

    if (!topic) {
        alert('请填写视频主题！');
        return;
    }

    if (!AppState.isConfigured) {
        alert('请先配置API连接！');
        switchPage('config');
        return;
    }

    showLoadingContent();

    try {
        const requestBody = {
            api_config: AppState.api_config,
            content_type: 'script',
            video_topic: topic,
            video_duration: duration,
            style: style
        };

        const response = await fetch(`${API_BASE_URL}/api/content`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();

        if (result.success) {
            displayScript(topic, duration, style, result.data.content);
        } else {
            alert(`脚本生成失败：${result.error}`);
        }
    } catch (error) {
        alert(`网络错误：${error.message}。请确保后端服务已启动。`);
    }
}

function displayScript(topic, duration, style, content) {
    const resultDiv = document.getElementById('contentResult');

    resultDiv.innerHTML = `
        <div class="script-output">
            <h3><i class="fas fa-file-lines"></i> ${topic} - 视频脚本</h3>
            <div class="script-meta">
                <span><i class="fas fa-clock"></i> 时长：${duration}秒</span>
                <span><i class="fas fa-palette"></i> 风格：${getStyleText(style)}</span>
            </div>
            <div class="script-content">
                ${content ? content.replace(/\n/g, '<br>') : '生成失败，请重试。'}
            </div>
            <div class="script-actions">
                <button class="btn btn-primary" onclick="copyContent()"><i class="fas fa-copy"></i> 复制内容</button>
            </div>
        </div>
    `;
}

async function generateTitles() {
    const topic = document.getElementById('titleTopic').value;
    const platform = document.getElementById('targetPlatform').value;

    if (!topic) {
        alert('请填写内容主题！');
        return;
    }

    if (!AppState.isConfigured) {
        alert('请先配置API连接！');
        switchPage('config');
        return;
    }

    showLoadingContent();

    try {
        const requestBody = {
            api_config: AppState.api_config,
            content_type: 'title',
            video_topic: topic,
            target_platform: platform
        };

        const response = await fetch(`${API_BASE_URL}/api/content`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();

        if (result.success) {
            displayTitles(topic, result.data.content);
        } else {
            alert(`标题生成失败：${result.error}`);
        }
    } catch (error) {
        alert(`网络错误：${error.message}。请确保后端服务已启动。`);
    }
}

function displayTitles(topic, content) {
    const resultDiv = document.getElementById('contentResult');

    let titles = [];
    try {
        const parsed = JSON.parse(content);
        titles = parsed.titles || [];
    } catch {
        titles = [{text: content.substring(0, 50) + '...', score: 80}];
    }

    let html = '<div class="title-suggestions">';
    html += `<h3><i class="fas fa-heading"></i> "${topic}" - 标题推荐</h3>`;

    if (titles.length > 0) {
        titles.forEach((title, index) => {
            html += `
                <div class="title-item">
                    <div class="title-text">${title.text || '标题' + (index + 1)}</div>
                    <div class="title-score">吸引力：${title.score || 80}分</div>
                </div>
            `;
        });
    } else {
        html += '<p>生成失败，请重试。</p>';
    }

    html += '</div>';
    resultDiv.innerHTML = html;
}

function getStyleText(style) {
    const map = {professional: '专业严谨', humorous: '幽默轻松', emotional: '情感共鸣', direct: '直截了当'};
    return map[style] || '专业严谨';
}

function copyContent() {
    const content = document.querySelector('.script-content');
    if (content) {
        const text = content.innerText;
        navigator.clipboard.writeText(text).then(() => {
            alert('内容已复制到剪贴板！');
        }).catch(() => {
            alert('复制失败，请手动复制。');
        });
    }
}

// ==================== AI小游戏生成功能 ====================
let selectedGameType = 'challenge';

function selectGameTemplate(element) {
    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('selected');
    });
    element.classList.add('selected');
    selectedGameType = element.getAttribute('data-type');
}

async function generateMiniGame() {
    const topic = document.getElementById('gameTopic').value;
    const duration = parseInt(document.getElementById('gameDuration').value);
    const style = document.querySelector('input[name="gameStyle"]:checked').value;

    if (!topic) {
        alert('请填写游戏主题！');
        return;
    }

    if (!AppState.isConfigured) {
        alert('请先配置API连接！');
        switchPage('config');
        return;
    }

    showLoading('gameResult', 'AI正在设计游戏...', 'gameLoading');

    try {
        const requestBody = {
            api_config: AppState.api_config,
            game_topic: topic,
            game_type: selectedGameType,
            duration: duration,
            style: style
        };

        const response = await fetch(`${API_BASE_URL}/api/game`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();

        if (result.success) {
            // 从 result.data.game 或 result.data.raw_content 获取游戏数据
            displayGameResult(topic, selectedGameType, duration, style, result.data.game || result.data.raw_content);
        } else {
            alert(`小游戏生成失败：${result.error}`);
            hideLoadingForce('gameLoading');
        }
    } catch (error) {
        alert(`网络错误：${error.message}。请确保后端服务已启动。`);
        hideLoadingForce('gameLoading');
    }
}

function displayGameResult(topic, gameType, duration, style, content) {
    // 先隐藏loading层
    const loadingEl = document.getElementById('gameLoading');
    if (loadingEl) loadingEl.style.display = 'none';

    const resultDiv = document.getElementById('gameResult');
    const contentDiv = document.getElementById('gameResultContent');
    resultDiv.style.display = 'block';

    // 解析游戏数据：content 可能是对象（直接用）或 JSON 字符串（需解析）
    let gameData = null;
    if (content) {
        if (typeof content === 'object') {
            gameData = content;
        } else {
            try {
                gameData = JSON.parse(content);
            } catch {
                gameData = null;
            }
        }
    }

    // 使用API数据或生成模拟数据
    const data = gameData || generateMockGameData(topic, gameType, duration, style);

    // HTML转义函数，防止内容破坏模板
    const esc = s => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    const joinRules = arr => (arr || []).map(r => `<li>${esc(r)}</li>`).join('');
    const joinTags = (arr, icon) => (arr || []).map(a => `<span class="asset-tag"><i class="fas fa-${icon}"></i> ${esc(a)}</span>`).join('');
    const shareText = esc(data.share_text || data.shareText || `我在${topic}挑战中得了{score}分！你能超过我吗？`);
    const shareDataText = esc(data.share_text || data.shareText || '');

    contentDiv.innerHTML = `
        <div class="game-design">
            <div class="game-header-card">
                <div class="game-type-badge">${esc(getGameTypeName(gameType))}</div>
                <h3>${esc(data.title || topic)}</h3>
                <p class="game-description">${esc(data.description || getGameDescription(gameType, duration))}</p>
                <div class="game-meta">
                    <span><i class="fas fa-clock"></i> ${esc(duration)}秒</span>
                    <span><i class="fas fa-palette"></i> ${esc(getGameStyleText(style))}</span>
                </div>
            </div>

            <div class="game-rules-section">
                <h4><i class="fas fa-list-check"></i> 游戏规则</h4>
                <ol class="rules-list">
                    ${joinRules(data.rules)}
                </ol>
            </div>

            <div class="game-scoring-section">
                <h4><i class="fas fa-trophy"></i> 得分机制</h4>
                <p>${esc(data.scoring || '根据完成度和正确率计算得分')}</p>
            </div>

            <div class="game-assets-section">
                <h4><i class="fas fa-images"></i> 所需素材</h4>
                <div class="assets-list">
                    ${joinTags(data.assets, 'image')}
                </div>
            </div>

            <div class="game-share-section">
                <h4><i class="fas fa-share-alt"></i> 分享文案</h4>
                <div class="share-card">
                    <p class="share-text">"${shareText}"</p>
                    <button class="btn btn-sm btn-primary" onclick="copyShareText(this)" data-text="${shareDataText}">
                        <i class="fas fa-copy"></i> 复制文案
                    </button>
                </div>
            </div>

            <div class="game-virality-section">
                <h4><i class="fas fa-bullhorn"></i> 病毒传播技巧</h4>
                <ul class="virality-tips">
                    ${(data.virality_tips || data.viralityTips || []).map(tip => `<li><i class="fas fa-check"></i> ${esc(tip)}</li>`).join('')}
                </ul>
            </div>

            <div class="game-actions">
                <button class="btn btn-success" onclick="copyGameDesign()">
                    <i class="fas fa-copy"></i> 复制完整方案
                </button>
                <button class="btn btn-primary" onclick="downloadGameDesign()">
                    <i class="fas fa-download"></i> 下载文档
                </button>
            </div>
        </div>
    `;

    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

function generateMockGameData(topic, gameType, duration, style) {
    const configs = {
        challenge: {
            title: `🔥 ${topic}`,
            description: `一个限时${duration}秒的记忆/反应挑战游戏，玩家需要在规定时间内完成指定任务。`,
            rules: [
                `系统展示挑战内容（${duration}秒内完成）`,
                '玩家集中注意力，快速记忆或反应',
                '时间到后展示任务完成情况',
                '根据完成度计算得分',
                '可分享成绩到朋友圈邀请好友挑战'
            ],
            scoring: '完成度×10=最终得分，满分100分。排行榜激发攀比心理，促进分享。',
            assets: ['挑战物品展示图/视频', '倒计时动画', '结果展示页背景', '轻快BGM'],
            share_text: `我在${topic}挑战中得了{score}分！你能超过我吗？来试试吧！🎮`,
            virality_tips: ['设置排行榜，激发攀比心理', '分享文案使用{score}变量，显示个人成绩', '结尾引导"@好友 来挑战"']
        },
        quiz: {
            title: `🧠 ${topic}`,
            description: `一个有趣的知识问答/性格测试游戏，通过选择题让用户了解自己。`,
            rules: [
                '展示一道选择题或测评问题',
                '玩家从多个选项中选择答案',
                '根据选择展示下一题或结果',
                '完成测评后展示个性化结果',
                '生成专属分享卡片'
            ],
            scoring: '根据答案组合生成个性化结果标签，如"你是XX型人格"等。',
            assets: ['问题展示卡片', '选项按钮样式', '结果生成模板', '分享卡片背景'],
            share_text: `测了才知道！我的${topic}结果是：{result}！你也来测测看~ 🔮`,
            virality_tips: ['结果要有趣、有共鸣点', '分享卡片设计精美，鼓励发朋友圈', '"你是第X个测试的人"营造稀缺感']
        },
        interactive: {
            title: `✨ ${topic}`,
            description: `一个互动测试类游戏，让用户发现自己的某一方面特点。`,
            rules: [
                '展示互动主题，如"测测你是什么风格"',
                '通过几个简单选项了解用户',
                'AI分析选项组合生成结果',
                '展示个性化结果和分析',
                '生成精美分享卡片'
            ],
            scoring: '无分数，根据选择给出定性结果。结果要出人意料又有道理。',
            assets: ['测试说明页', '选项动画', '结果展示页', '分享卡片模板'],
            share_text: `太准了！${topic}说我居然是{result}！你也来试试~ 💫`,
            virality_tips: ['结果要有"哇，好准"的感觉', '分享卡片包含结果+趣味描述', '引导用户@好友一起测试']
        },
        casino: {
            title: `🎰 ${topic}`,
            description: `一个抽奖类互动游戏，通过概率机制激发用户参与欲望。`,
            rules: [
                '展示抽奖入口和奖励内容',
                '玩家点击抽奖按钮',
                '动画展示抽奖过程',
                '揭晓中奖结果',
                '引导分享或再抽一次'
            ],
            scoring: '概率控制，保证用户体验的同时激励分享。设置保底奖励。',
            assets: ['抽奖转盘/老虎机动画', '中奖/未中奖素材', '奖励展示图', '背景音乐'],
            share_text: `运气爆棚！我在${topic}抽中了{prize}！你也来试试手气~ 🎉`,
            virality_tips: ['设置"分享增加抽奖次数"机制', '未中奖也要给"谢谢参与"外的惊喜', '中奖分享给额外奖励，激励晒单']
        }
    };

    return configs[gameType] || configs.challenge;
}

function getGameTypeName(type) {
    const names = {
        challenge: '🎮 挑战类',
        quiz: '📝 问答类',
        interactive: '✨ 互动测试',
        casino: '🎰 抽奖类'
    };
    return names[type] || '挑战类';
}

function getGameStyleText(style) {
    const styles = {
        fun: '欢乐有趣',
        cool: '酷炫潮流',
        cute: '可爱清新'
    };
    return styles[style] || '欢乐有趣';
}

function getGameDescription(gameType, duration) {
    return `一个限时${duration}秒的${gameType === 'challenge' ? '挑战' : gameType === 'quiz' ? '问答' : gameType === 'interactive' ? '互动测试' : '抽奖'}游戏。`;
}

function copyShareText(btn) {
    const text = btn.getAttribute('data-text');
    navigator.clipboard.writeText(text).then(() => {
        alert('分享文案已复制到剪贴板！');
    });
}

function copyGameDesign() {
    const design = document.querySelector('.game-design');
    if (design) {
        const text = design.innerText;
        navigator.clipboard.writeText(text).then(() => {
            alert('游戏设计方案已复制！');
        });
    }
}

function downloadGameDesign() {
    alert('游戏设计方案文档下载功能开发中...');
}

// ==================== 工具函数 ====================
// 显示指定区域的加载动画（叠加层方式，不破坏子元素）
function showLoading(targetId, msg, loadingId) {
    const div = document.getElementById(targetId);
    if (!div) return;
    div.style.display = 'block';
    // 如果传入了明确的 loadingId 就用传入的，否则用 targetId + 'Loading' 拼接
    const actualLoadingId = loadingId || (targetId + 'Loading');
    const loadingEl = document.getElementById(actualLoadingId);
    if (loadingEl) {
        loadingEl.style.display = 'flex';
        const p = loadingEl.querySelector('p');
        if (p) p.textContent = msg || 'AI正在思考中...';
    }
}

// 强制隐藏指定ID的loading层（用于错误处理时清除loading状态）
function hideLoadingForce(loadingId) {
    const loadingEl = document.getElementById(loadingId);
    if (loadingEl) loadingEl.style.display = 'none';
}

function showLoadingContent() {
    // 内容创作区（这里子元素结构不固定，可以直接 innerHTML）
    const resultDiv = document.getElementById('contentResult');
    resultDiv.innerHTML = `
        <div class="inline-loading" id="inlineLoading" style="display:flex; position:absolute; top:0; left:0; right:0; bottom:0; background:rgba(255,255,255,0.95); border-radius:12px;">
            <div class="spinner-sm"></div>
            <p>AI正在思考中...</p>
        </div>
    `;
}

function hideLoading() {
    // 内容创作区的 loading（已在 displayXxx 中被 innerHTML 替换，无需处理）
}

function clearResult() {
    // 清空输出框（内容创作区）
    const resultDiv = document.getElementById('contentResult');
    resultDiv.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-file-lines"></i>
            <p>选择创作工具并生成内容</p>
        </div>
        <div class="inline-loading" id="inlineLoading" style="display:none;">
            <div class="spinner-sm"></div>
            <p>AI正在思考中...</p>
        </div>
    `;
}

function initializeTemperatureSlider() {
    const slider = document.getElementById('temperature');
    const valueDisplay = document.getElementById('tempValue');

    if (slider && valueDisplay) {
        slider.addEventListener('input', function() {
            valueDisplay.textContent = this.value;
        });
    }
}

function formatNumber(num) {
    if (num >= 100000000) return (num / 100000000).toFixed(1) + '亿';
    if (num >= 10000) return (num / 10000).toFixed(1) + '万';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ==================== 全局函数暴露 ====================
window.testConnection = testConnection;
window.saveConfig = saveConfig;
window.loadPreset = loadPreset;
window.startDiagnosis = startDiagnosis;
window.generateTopics = generateTopics;
window.generateScript = generateScript;
window.generateTitles = generateTitles;
window.switchTool = switchTool;
window.copyContent = copyContent;
window.selectDemoAccount = selectDemoAccount;
window.loginWithCustom = loginWithCustom;
window.logout = logout;
window.useTopic = useTopic;
window.generateMiniGame = generateMiniGame;
window.selectGameTemplate = selectGameTemplate;
window.fetchModelList = fetchModelList;
window.fetchModelListLogin = fetchModelListLogin;
