"""
LangGraph状态定义
"""
from typing import TypedDict, Annotated, Sequence
from langchain_core.messages import BaseMessage
import operator

class AgentState(TypedDict):
    """Agent状态定义"""
    
    # 消息历史
    messages: Annotated[Sequence[BaseMessage], operator.add]
    
    # 用户输入
    user_input: str
    api_config: dict  # API配置（endpoint, api_key, model等）
    
    # 账号诊断相关
    account_name: str
    account_bio: str
    account_platform: str
    account_category: str
    stats: dict
    audience: dict
    recent_content: list
    content_tags: list
    focus: str
    diagnosis_result: dict
    
    # 选题生成相关
    content_category: str
    topic_count: int
    creativity_level: str
    topics: list
    
    # 内容创作相关
    content_type: str  # script, title, copy, cover
    video_topic: str
    video_duration: int
    style: str
    generated_content: str
    
    # 数据分析相关
    analytics_data: dict
    insights: list
    
    # 控制流
    current_step: str
    next_action: str
    error_message: str
    is_complete: bool
