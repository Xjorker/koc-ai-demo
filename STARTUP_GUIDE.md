# KOC AI增长助手 - 启动指南

## 📋 系统要求

- **Python**: 3.9+ （推荐3.11）
- **Node.js**: 16+ （用于前端开发服务器）
- **pip**: 最新版本

---

## 🚀 快速启动（3步搞定）

### 步骤1：安装Python依赖

打开终端，进入项目目录：

```bash
cd D:\WorkBuddy\koc-ai-demo\backend
```

创建虚拟环境（推荐）：
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
```

安装依赖：
```bash
pip install -r requirements.txt
```

---

### 步骤2：配置API密钥

**方法A：使用前端界面配置（推荐）**

1. 启动前端（见步骤3）
2. 打开 http://localhost:8080
3. 进入"API配置"页面
4. 填写你的API信息：
   - **API端点**：`https://api.openai.com/v1` 或混元/DeepSeek的端点
   - **API密钥**：你的API Key（sk-开头）
   - **模型名称**：`gpt-4-turbo` 或 `hunyuan-pro` 等
   - **温度参数**：0.7（可调整）
5. 点击"测试连接"
6. 点击"保存配置"

配置会自动保存到浏览器LocalStorage。

**方法B：环境变量配置（生产环境）**

创建 `backend\.env` 文件：
```
OPENAI_API_KEY=sk-your-key
OPENAI_API_BASE=https://api.openai.com/v1
DEFAULT_MODEL=gpt-4-turbo
```

---

### 步骤3：启动服务

#### 3.1 启动后端（FastAPI + LangGraph）

打开终端1：
```bash
cd D:\WorkBuddy\koc-ai-demo\backend
venv\Scripts\activate  # 如果使用了虚拟环境
python main.py
```

**成功标志**：
```
============================================================
KOC AI增长助手 - 后端服务
============================================================
访问地址：<ADDRESS_REMOVED>
API文档：<ADDRESS_REMOVED>
============================================================
INFO:     Uvicorn running on http://0.0.0.0:8000
```

#### 3.2 启动前端（HTTP服务器）

打开终端2：
```bash
cd D:\WorkBuddy\koc-ai-demo
python -m http.server 8080
```

**成功标志**：
```
Serving HTTP on :: port 8080 (http://[::]:8080/) ...
```

---

### 步骤4：访问应用

打开浏览器，访问：
- **前端界面**：http://localhost:8080
- **后端API文档**：http://localhost:8000/docs （Swagger UI）

---

## 🧪 测试流程

### 1. 测试API连接

1. 打开 http://localhost:8080
2. 点击左侧"API配置"
3. 填写API信息
4. 点击"测试连接"
5. 看到"API连接测试成功"提示

### 2. 测试账号诊断

1. 点击"账号诊断"
2. 填写账号名称：例如"小明的生活日记"
3. 填写账号简介：例如"分享城市独居生活，教你用最少的钱过最精致的生活"
4. 点击"开始AI诊断"
5. 等待AI生成诊断报告（约10-30秒）

### 3. 测试智能选题

1. 点击"智能选题"
2. 选择内容赛道：例如"生活方式"
3. 选择选题数量：5
4. 选择创意程度："平衡创新"
5. 点击"生成选题"
6. 查看生成的选题列表

### 4. 测试内容创作

1. 点击"内容创作"
2. 选择"视频脚本"标签
3. 填写视频主题："春季穿搭指南"
4. 选择时长："60秒"
5. 选择风格："幽默轻松"
6. 点击"生成脚本"
7. 查看生成的脚本内容

---

## 🐛 常见问题

### Q1：后端启动失败 - "No module named 'langchain'"

**解决方法**：
```bash
pip install langchain langchain-core langgraph
```

### Q2：前端无法连接后端 - "Failed to fetch"

**原因**：后端未启动或端口被占用

**解决方法**：
1. 检查后端是否运行在 http://localhost:8000
2. 检查前端代码中的 `API_BASE_URL` 是否匹配
3. 查看浏览器控制台（F12）的具体错误

### Q3：AI调用失败 - "API调用失败"

**原因**：API密钥错误或余额不足

**解决方法**：
1. 检查API密钥是否正确
2. 检查API端点是否匹配
3. 检查账户余额是否充足
4. 尝试使用混元或DeepSeek（更便宜）

### Q4：诊断/选题生成很慢

**正常现象**：AI生成需要时间，通常10-30秒

**优化方法**：
1. 使用更快的模型（如gpt-3.5-turbo）
2. 降低温度参数（0.3-0.5）
3. 减少生成内容的长度

---

## 📂 项目结构说明

```
koc-ai-demo/
├── backend/                 # 后端（LangGraph + FastAPI）
│   ├── agents/             # LangGraph Agent定义
│   │   ├── diagnosis_agent.py   # 账号诊断Agent
│   │   ├── topic_agent.py       # 智能选题Agent
│   │   └── content_agent.py    # 内容创作Agent
│   ├── models/             # 数据模型
│   │   └── state.py            # LangGraph状态定义
│   ├── utils/              # 工具函数
│   │   └── ai_client.py       # AI客户端（OpenAI兼容）
│   ├── main.py             # FastAPI主应用
│   ├── requirements.txt    # Python依赖
│   └── .env               # 环境变量（需手动创建）
├── index.html              # 前端主页面
├── style.css               # 前端样式
├── app.js                  # 前端逻辑（调用后端API）
├── assets/                 # 静态资源
├── README.md               # 项目说明
├── DEPLOYMENT_GUIDE.md    # 部署指南
├── STARTUP_GUIDE.md       # 本文件
└── package.json           # 项目配置
```

---

## 🎯 下一步

启动成功后，你可以：

1. **测试所有功能** - 确保诊断、选题、创作都正常工作
2. **调整样式** - 修改 `style.css` 自定义界面
3. **优化AI提示词** - 修改 `backend/agents/*.py` 中的system_prompt
4. **部署到线上** - 参考 `DEPLOYMENT_GUIDE.md`
5. **录制演示视频** - 为比赛提交准备材料

---

## 📞 技术支持

遇到问题？

1. **查看日志**：后端终端会显示详细错误信息
2. **查看API文档**：访问 http://localhost:8000/docs 测试API
3. **检查网络连接**：确保前端能访问后端（CORS已配置）
4. **联系开发者**：[你的联系方式]

---

**祝使用愉快！🎉**

如果有任何问题，请随时联系。
