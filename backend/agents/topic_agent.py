"""
智能选题Agent
"""
from typing import List, Literal
from models.state import AgentState
from utils.ai_client import get_ai_response

# 内容赛道映射
CATEGORY_MAP = {
    'lifestyle': '生活方式',
    'tech': '科技数码',
    'food': '美食探店',
    'travel': '旅行户外',
    'fashion': '时尚美妆',
    'fitness': '健身运动',
    'education': '知识教育',
    'entertainment': '娱乐八卦'
}

CREATIVITY_MAP = {
    'conservative': '稳健实用',
    'balanced': '平衡创新',
    'creative': '大胆创新'
}

def create_topic_agent():
    """创建智能选题Agent"""
    
    def topic_node(state: AgentState) -> AgentState:
        """选题生成节点"""
        category = state.get('content_category', 'lifestyle')
        count = state.get('topic_count', 5)
        creativity = state.get('creativity_level', 'balanced')
        
        # 构建系统提示词
        system_prompt = """你是专业的社交媒体内容策划专家。根据用户指定的内容赛道和创意程度，生成吸引人的选题建议。

选题要求：
1. 紧扣赛道主题，符合目标受众兴趣
2. 结合当前社交媒体热点趋势
3. 具备可操作性，用户能实际制作
4. 标题吸引人，能引发点击欲望
5. 标注难度等级（简单上手/中等难度/挑战创意）

输出格式（JSON）：
{
  "topics": [
    {
      "title": "选题标题",
      "description": "选题描述和制作思路",
      "difficulty": "easy/medium/hard",
      "tags": ["标签1", "标签2"]
    }
  ]
}"""

        category_name = CATEGORY_MAP.get(category, '生活方式')
        creativity_name = CREATIVITY_MAP.get(creativity, '平衡创新')
        
        user_message = f"""请为"{category_name}"赛道生成{count}个选题建议。

创意程度要求：{creativity_name}

要求：
- 选题要新颖、有吸引力
- 适合视频号/短视频平台
- 考虑当前季节和时间节点
- 每个选题给出清晰的描述和标签"""

        try:
            # 调用AI生成选题
            topics_text = get_ai_response(state, system_prompt, user_message)
            
            # 解析JSON（简化版，实际应加强错误处理）
            import json
            try:
                topics_data = json.loads(topics_text)
                state['topics'] = topics_data.get('topics', [])
            except:
                # 如果JSON解析失败，返回文本
                state['topics'] = [{
                    'title': 'AI生成的选题',
                    'description': topics_text[:200],
                    'difficulty': 'medium',
                    'tags': [category_name]
                }]
            
            state['is_complete'] = True
            
        except Exception as e:
            state['error_message'] = f"选题生成失败: {str(e)}"
            state['is_complete'] = True
        
        return state
    
    return topic_node

def should_continue(state: AgentState) -> Literal["continue", "end"]:
    """判断是否继续"""
    if state.get('is_complete', False):
        return "end"
    return "continue"
