"""
内容创作Agent
"""
from typing import Literal
from models.state import AgentState
from utils.ai_client import get_ai_response

def create_content_agent():
    """创建内容创作Agent"""
    
    def content_node(state: AgentState) -> AgentState:
        """内容生成节点"""
        content_type = state.get('content_type', 'script')
        video_topic = state.get('video_topic', '')
        
        if not video_topic:
            state['error_message'] = '请填写内容主题'
            state['is_complete'] = True
            return state
        
        try:
            if content_type == 'script':
                result = generate_script(state)
            elif content_type == 'title':
                result = generate_titles(state)
            elif content_type == 'copy':
                result = generate_copy(state)
            elif content_type == 'cover':
                result = generate_cover_suggestion(state)
            elif content_type == 'game':
                result = generate_game(state)
            else:
                result = "不支持的内容类型"
            
            state['generated_content'] = result
            state['is_complete'] = True
            
        except Exception as e:
            state['error_message'] = f"内容生成失败: {str(e)}"
            state['is_complete'] = True
        
        return state
    
    return content_node

def generate_script(state: AgentState) -> str:
    """生成视频脚本"""
    topic = state.get('video_topic', '')
    duration = state.get('video_duration', 60)
    style = state.get('style', 'professional')
    
    style_map = {
        'professional': '专业严谨',
        'humorous': '幽默轻松',
        'emotional': '情感共鸣',
        'direct': '直截了当'
    }
    
    system_prompt = """你是专业的短视频脚本创作专家。根据用户提供的主题、时长和风格，生成完整的视频脚本。

脚本要求：
1. 开头吸睛（0-5秒）：用悬念或痛点开场
2. 核心价值传递（主内容）：分步骤讲解，逻辑清晰
3. 互动引导：引导点赞、评论、关注
4. 结尾升华：总结要点，强化记忆

输出格式（Markdown）：
# 视频脚本：{主题}

## 基本信息
- 时长：{X}秒
- 风格：{风格}
- 目标平台：视频号

## 分镜脚本

### 开头吸睛（0-5秒）
{具体台词/画面}

### 核心价值（5-{duration-10}秒）
{分步骤内容}

### 互动引导（{duration-10}-{duration-5}秒）
{引导话术}

### 结尾升华（{duration-5}-{duration}秒）
{结尾内容}

## 拍摄建议
{实用建议}"""

    style_text = style_map.get(style, '专业严谨')
    user_message = f"请生成关于'{topic}'的{duration}秒视频脚本，风格要求：{style_text}"
    
    return get_ai_response(state, system_prompt, user_message)

def generate_titles(state: AgentState) -> str:
    """生成标题建议"""
    topic = state.get('video_topic', '')
    platform = state.get('target_platform', 'wechat')
    
    platform_map = {
        'wechat': '视频号',
        'douyin': '抖音',
        'xiaohongshu': '小红书',
        'bilibili': 'B站'
    }
    
    system_prompt = """你是吸引人的标题创作专家。根据内容主题和目标平台，生成10个吸引人的标题。

标题要求：
1. 吸引点击，但不做标题党
2. 符合平台调性
3. 包含关键词，利于搜索
4. 引发好奇或共鸣

输出格式（JSON）：
{
  "titles": [
    {"text": "标题文本", "score": 95, "reason": "吸引理由"}
  ]
}"""

    platform_text = platform_map.get(platform, '视频号')
    user_message = f"请为'{topic}'生成适合{platform_text}的10个标题"
    
    return get_ai_response(state, system_prompt, user_message)

def generate_copy(state: AgentState) -> str:
    """生成文案"""
    topic = state.get('video_topic', '')
    
    system_prompt = """你是社交媒体文案创作专家。根据主题生成吸引人的文案内容。

文案要求：
1. 开头抓人眼球
2. 内容有价值、有共鸣
3. 结尾有行动号召
4. 适当使用emoji增加亲和力

输出格式：完整的文案文本"""
    
    user_message = f"请生成关于'{topic}'的社交媒体文案"
    
    return get_ai_response(state, system_prompt, user_message)

def generate_cover_suggestion(state: AgentState) -> str:
    """生成封面建议"""
    topic = state.get('video_topic', '')
    
    system_prompt = """你是视频封面设计专家。根据视频主题，提供封面设计建议。

建议包含：
1. 视觉主题和风格
2. 文字排版建议
3. 色彩搭配
4. 关键元素
5. 注意事项

输出格式：详细的封面设计建议"""
    
    user_message = f"请提供'{topic}'的视频封面设计建议"
    
    return get_ai_response(state, system_prompt, user_message)

def generate_game(state: AgentState) -> str:
    """生成AI小游戏设计"""
    topic = state.get('video_topic', '')
    duration = state.get('video_duration', 10)
    style = state.get('style', 'fun')

    game_type_names = {
        "challenge": "挑战类（如限时挑战、记忆挑战）",
        "quiz": "知识问答类（如性格测试、知识问答）",
        "interactive": "互动测试类（如测试你是哪种类型）",
        "casino": "抽奖类（如转盘、抽签）"
    }
    game_type_text = game_type_names.get(state.get('game_type', 'challenge'), "挑战类")

    style_names = {
        "fun": "欢乐有趣",
        "cool": "酷炫潮流",
        "cute": "可爱清新"
    }
    style_text = style_names.get(style, "欢乐有趣")

    system_prompt = f"""你是AI互动小游戏设计专家。根据用户提供的游戏主题、类型和风格，设计完整的小游戏方案。

游戏主题：{topic}
游戏类型：{game_type_text}
时长要求：约{duration}秒
风格：{style_text}

设计要求：
1. 游戏规则简洁明了，适合短视频平台
2. 得分享机制设计巧妙，利于传播
3. 视觉素材描述具体，便于制作
4. 分享文案包含 {{score}}（成绩）、{{result}}（结果）、{{prize}}（奖品）等占位符

输出格式（JSON）：
{{
    "title": "游戏标题（吸引眼球）",
    "description": "一句话描述",
    "rules": ["规则1", "规则2", "规则3"],
    "scoring": "得分机制描述",
    "share_text": "分享文案，可嵌入{{score}}、{{result}}、{{prize}}",
    "virality_tips": ["传播技巧1", "传播技巧2"],
    "assets": ["素材描述1", "素材描述2"],
    "game_flow": "游戏流程简述"
}}

请直接返回JSON，不要有其他内容。"""

    user_message = f"请设计一个关于'{topic}'的AI互动小游戏"

    return get_ai_response(state, system_prompt, user_message)

def should_continue(state: AgentState) -> Literal["continue", "end"]:
    """判断是否继续"""
    if state.get('is_complete', False):
        return "end"
    return "continue"
