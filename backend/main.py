"""
FastAPI主应用 - KOC AI增长助手后端
"""
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Dict, List, Optional
import uvicorn

# 导入Agent
from agents.diagnosis_agent import create_diagnosis_agent
from agents.topic_agent import create_topic_agent
from agents.content_agent import create_content_agent
from models.state import AgentState

# 创建FastAPI应用
app = FastAPI(
    title="KOC AI增长助手 API",
    description="面向KOC的社交媒体AI Agent后端服务",
    version="1.0.0"
)

# 配置CORS（允许前端访问）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应指定具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 挂载前端静态文件（支持前后端一体化部署）
static_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "")
if os.path.exists(static_path):
    app.mount("/static", StaticFiles(directory=static_path, html=True), name="static")

@app.get("/")
async def serve_frontend():
    """提供前端页面"""
    index_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "KOC AI增长助手 API服务正在运行 - 前端文件未找到"}

# ==================== 数据模型 ====================
from pydantic import ConfigDict, field_validator

class APIConfig(BaseModel):
    """API配置"""
    model_config = ConfigDict(populate_by_name=True)
    
    endpoint: str = "https://api.openai.com/v1"
    api_key: Optional[str] = None
    model: str = "gpt-4-turbo"
    temperature: float = 0.7
    
    @field_validator('api_key', mode='before')
    @classmethod
    def empty_str_to_none(cls, v):
        if v == '':
            return None
        return v

class DiagnosisRequest(BaseModel):
    """诊断请求"""
    api_config: APIConfig
    account_name: str
    account_bio: str
    account_platform: Optional[str] = "未知平台"
    account_category: Optional[str] = "未知类目"
    account_avatar: Optional[str] = ""
    stats: Optional[Dict] = {}
    audience: Optional[Dict] = {}
    recent_content: Optional[List] = []
    content_tags: Optional[List] = []
    focus: Optional[str] = ""

class TopicRequest(BaseModel):
    """选题请求"""
    api_config: APIConfig
    content_category: str = "lifestyle"
    topic_count: int = 5
    creativity_level: str = "balanced"

class ContentRequest(BaseModel):
    """内容创作请求"""
    api_config: APIConfig
    content_type: str  # script, title, copy, cover, game
    video_topic: str
    video_duration: Optional[int] = 60
    style: Optional[str] = "professional"
    target_platform: Optional[str] = "wechat"

class GameRequest(BaseModel):
    """AI小游戏生成请求"""
    api_config: APIConfig
    game_topic: str           # 游戏主题
    game_type: str = "challenge"   # challenge, quiz, interactive, casino
    duration: int = 10             # 游戏时长（秒）
    style: str = "fun"             # fun, cool, cute

class APIResponse(BaseModel):
    """通用API响应"""
    success: bool
    data: Optional[Dict] = None
    error: Optional[str] = None

# ==================== API路由 ====================
@app.get("/")
async def root():
    """根路径"""
    return {
        "message": "KOC AI增长助手 API服务正在运行",
        "version": "1.0.0",
        "endpoints": {
            "诊断": "/api/diagnosis",
            "选题": "/api/topics",
            "内容创作": "/api/content"
        }
    }

@app.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "healthy"}

@app.post("/api/diagnosis", response_model=APIResponse)
async def diagnosis(request: DiagnosisRequest):
    """账号诊断"""
    try:
        # 打印接收到的原始数据（用于调试）
        print("=" * 60)
        print("【诊断请求原始数据】")
        print(f"账号名称: {request.account_name}")
        print(f"账号简介: {request.account_bio}")
        print(f"平台: {request.account_platform}")
        print(f"类目: {request.account_category}")
        print(f"统计数据: {request.stats}")
        print(f"受众画像: {request.audience}")
        print(f"近期内容: {request.recent_content}")
        print(f"内容标签: {request.content_tags}")
        print(f"诊断重点: {request.focus}")
        print("=" * 60)

        # 构建初始状态
        initial_state = AgentState(
            messages=[],
            user_input=f"诊断账号：{request.account_name}",
            api_config=request.api_config.model_dump(),
            account_name=request.account_name,
            account_bio=request.account_bio,
            account_platform=request.account_platform,
            account_category=request.account_category,
            stats=request.stats or {},
            audience=request.audience or {},
            recent_content=request.recent_content or [],
            content_tags=request.content_tags or [],
            focus=request.focus or "",
            diagnosis_result={},
            content_category=request.account_category,
            topic_count=0,
            creativity_level="",
            topics=[],
            content_type="",
            video_topic="",
            video_duration=0,
            style="",
            generated_content="",
            analytics_data={},
            insights=[],
            current_step="diagnosis",
            next_action="",
            error_message="",
            is_complete=False
        )
        
        # 创建并运行Agent
        diagnosis_agent = create_diagnosis_agent()
        result = diagnosis_agent(initial_state)

        # 打印AI返回的原始数据
        print("=" * 60)
        print("【AI返回原始数据】")
        print(f"diagnosis_result: {result.get('diagnosis_result')}")
        print(f"full_report: {result.get('diagnosis_result', {}).get('full_report', '')[:500]}...")
        print("=" * 60)

        return APIResponse(
            success=True,
            data={
                "diagnosis_result": result.get('diagnosis_result'),
                "full_report": result.get('diagnosis_result', {}).get('full_report', '')
            }
        )
        
    except Exception as e:
        return APIResponse(
            success=False,
            error=str(e)
        )

@app.post("/api/topics", response_model=APIResponse)
async def generate_topics(request: TopicRequest):
    """生成选题"""
    try:
        # 构建初始状态
        initial_state = AgentState(
            messages=[],
            user_input=f"生成{request.content_category}赛道选题",
            api_config=request.api_config.model_dump(),
            account_name="",
            account_bio="",
            diagnosis_result={},
            content_category=request.content_category,
            topic_count=request.topic_count,
            creativity_level=request.creativity_level,
            topics=[],
            content_type="",
            video_topic="",
            video_duration=0,
            style="",
            generated_content="",
            analytics_data={},
            insights=[],
            current_step="topics",
            next_action="",
            error_message="",
            is_complete=False
        )
        
        # 创建并运行Agent
        topic_agent = create_topic_agent()
        result = topic_agent(initial_state)
        
        return APIResponse(
            success=True,
            data={
                "topics": result.get('topics', [])
            }
        )
        
    except Exception as e:
        return APIResponse(
            success=False,
            error=str(e)
        )

@app.post("/api/content", response_model=APIResponse)
async def generate_content(request: ContentRequest):
    """生成内容"""
    try:
        # 构建初始状态
        initial_state = AgentState(
            messages=[],
            user_input=f"生成{request.content_type}：{request.video_topic}",
            api_config=request.api_config.model_dump(),
            account_name="",
            account_bio="",
            diagnosis_result={},
            content_category="",
            topic_count=0,
            creativity_level="",
            topics=[],
            content_type=request.content_type,
            video_topic=request.video_topic,
            video_duration=request.video_duration or 60,
            style=request.style or "professional",
            generated_content="",
            analytics_data={},
            insights=[],
            current_step="content",
            next_action="",
            error_message="",
            is_complete=False
        )
        
        # 创建并运行Agent
        content_agent = create_content_agent()
        result = content_agent(initial_state)
        
        return APIResponse(
            success=True,
            data={
                "content": result.get('generated_content', ''),
                "content_type": request.content_type
            }
        )
        
    except Exception as e:
        return APIResponse(
            success=False,
            error=str(e)
        )

@app.post("/api/game", response_model=APIResponse)
async def generate_game(request: GameRequest):
    """AI小游戏生成"""
    try:
        # 构建游戏生成的提示词
        game_type_names = {
            "challenge": "挑战类（如限时挑战、记忆挑战）",
            "quiz": "知识问答类（如性格测试、知识问答）",
            "interactive": "互动测试类（如测试你是哪种类型）",
            "casino": "抽奖类（如转盘、抽签）"
        }
        game_type_text = game_type_names.get(request.game_type, "挑战类")

        style_names = {
            "fun": "欢乐有趣",
            "cool": "酷炫潮流",
            "cute": "可爱清新"
        }
        style_text = style_names.get(request.style, "欢乐有趣")

        user_input = f"""请设计一个AI互动小游戏：

游戏主题：{request.game_topic}
游戏类型：{game_type_text}
时长要求：约{request.duration}秒
风格：{style_text}

请设计完整的游戏方案，返回JSON格式：
{{
    "title": "游戏标题（吸引眼球）",
    "description": "一句话描述",
    "rules": ["规则1", "规则2", ...],
    "scoring": "得分机制描述",
    "share_text": "分享文案，可嵌入{{score}}代表成绩、{{result}}代表结果、{{prize}}代表奖品",
    "virality_tips": ["传播技巧1", "传播技巧2"],
    "assets": ["素材描述1", "素材描述2"]
}}"""

        # 构建初始状态
        initial_state = AgentState(
            messages=[],
            user_input=user_input,
            api_config=request.api_config.model_dump(),
            account_name="",
            account_bio="",
            diagnosis_result={},
            content_category="",
            topic_count=0,
            creativity_level="",
            topics=[],
            content_type="game",
            video_topic=request.game_topic,
            video_duration=request.duration,
            style=request.style,
            generated_content="",
            analytics_data={},
            insights=[],
            current_step="game",
            next_action="",
            error_message="",
            is_complete=False
        )

        # 创建并运行Agent
        content_agent = create_content_agent()
        result = content_agent(initial_state)

        # 解析AI返回的游戏设计
        game_content = result.get('generated_content', '')

        # 尝试解析JSON
        import json
        import re
        game_data = None

        # 尝试从内容中提取JSON
        try:
            # 直接解析
            game_data = json.loads(game_content)
        except:
            # 从文本中提取JSON
            match = re.search(r'\{[\s\S]*\}', game_content)
            if match:
                try:
                    game_data = json.loads(match.group())
                except:
                    pass

        print(f"============================================================")
        print(f"【游戏生成请求原始数据】")
        print(f"游戏主题: {request.game_topic}")
        print(f"游戏类型: {request.game_type} ({game_type_text})")
        print(f"时长: {request.duration}秒 | 风格: {style_text}")
        print(f"============================================================")
        print(f"【AI返回原始数据】")
        print(f"game_content: {game_content[:500] if game_content else '（空）'}")
        print(f"game_data: {game_data}")
        print(f"============================================================")

        return APIResponse(
            success=True,
            data={
                "game": game_data,
                "raw_content": game_content,
                "game_type": request.game_type,
                "duration": request.duration
            }
        )

    except Exception as e:
        import traceback
        print(f"============================================================")
        print(f"【游戏生成异常】")
        print(f"错误类型: {type(e).__name__}")
        print(f"错误信息: {str(e)}")
        traceback.print_exc()
        print(f"============================================================")
        return APIResponse(
            success=False,
            error=str(e)
        )

class ListModelsRequest(BaseModel):
    """获取模型列表请求"""
    api_config: APIConfig

@app.post("/api/models", response_model=APIResponse)
async def list_models(request: ListModelsRequest):
    """获取可用模型列表"""
    try:
        from utils.ai_client import AIClient

        print(f"[获取模型列表] 收到的配置: {request.api_config}")

        client = AIClient(request.api_config.model_dump())
        models = client.list_models()

        print(f"[获取模型列表] 共获取到 {len(models)} 个模型")

        return APIResponse(
            success=True,
            data={"models": models}
        )

    except Exception as e:
        return APIResponse(
            success=False,
            error=str(e)
        )

class TestConnectionRequest(BaseModel):
    """测试连接请求"""
    api_config: APIConfig

@app.post("/api/test", response_model=APIResponse)
async def test_connection(request: TestConnectionRequest):
    """测试API连接"""
    try:
        from utils.ai_client import AIClient

        print(f"[测试连接] 收到的配置: {request.api_config}")

        client = AIClient(request.api_config.model_dump())
        is_connected = client.test_connection()

        print(f"[测试连接] is_connected: {is_connected}")

        if is_connected:
            return APIResponse(
                success=True,
                data={"message": "API连接成功！"}
            )
        else:
            return APIResponse(
                success=False,
                error="API连接失败，请检查配置"
            )
            
    except Exception as e:
        return APIResponse(
            success=False,
            error=str(e)
        )

# ==================== 启动服务 ====================
if __name__ == "__main__":
    print("=" * 60)
    print("KOC AI增长助手 - 后端服务")
    print("=" * 60)
    print("访问地址: http://localhost:8000")
    print("API文档: http://localhost:8000/docs")
    print("=" * 60)

    uvicorn.run(app, host="0.0.0.0", port=8000)
