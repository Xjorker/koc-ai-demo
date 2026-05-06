# KOC AI增长助手

面向普通KOC的社媒AI Agent，通过AI能力提供内容方向、选题建议、发布策略、互动优化等服务。

## 功能特性

- **AI账号诊断** - 深度分析账号定位与内容策略
- **智能选题引擎** - 基于热点趋势与账号定位的个性化选题推荐
- **内容创作助手** - 一键生成视频脚本、文案、标题等
- **数据看板** - 追踪账号成长，AI提供优化建议
- **AI小游戏生成器** - 互动小游戏创作，助力账号涨粉

## 技术栈

- **前端**：HTML5 + CSS3 + Vanilla JavaScript
- **后端**：FastAPI + Python
- **AI集成**：支持所有OpenAI兼容API（OpenAI、混元、DeepSeek、Claude等）

## 项目结构

```
koc-ai-demo/
├── index.html          # 前端主页面
├── style.css          # 样式文件
├── app.js             # 前端交互逻辑
├── assets/            # 静态资源
├── backend/           # 后端服务
│   ├── main.py        # FastAPI入口
│   ├── requirements.txt
│   ├── agents/        # Agent模块
│   ├── models/        # 数据模型
│   ├── routes/        # 路由
│   ├── services/      # 服务层
│   └── utils/         # 工具函数
└── README.md
```

## 部署

后端已部署至 Railway：https://koc-ai-demo.up.railway.app

## 相关链接

- [OpenAI API文档](https://platform.openai.com/docs)
- [腾讯混元大模型](https://hunyuan.tencent.com/)
