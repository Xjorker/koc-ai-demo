"""
账号诊断Agent
"""
from typing import Literal
from langchain_core.messages import HumanMessage, SystemMessage
from models.state import AgentState
from utils.ai_client import get_ai_response

def create_diagnosis_agent():
    """创建账号诊断Agent"""
    
    def diagnosis_node(state: AgentState) -> AgentState:
        """诊断节点"""
        account_name = state.get('account_name', '')
        account_bio = state.get('account_bio', '')
        
        if not account_name or not account_bio:
            state['error_message'] = '请填写账号名称和简介'
            state['is_complete'] = True
            return state
        
        # 构建系统提示词
        system_prompt = """你是专业的社交媒体账号诊断专家。分析用户提供的账号信息，给出详细的诊断报告。

诊断报告应包含：
1. 账号定位分析（优势、不足、改进建议）
2. 内容策略建议（内容矩阵、发布频率、最佳发布时间）
3. 受众画像推测（核心受众、需求、兴趣）
4. 30天涨粉计划（分阶段目标、关键指标）

输出格式要求：
- 使用Markdown格式
- 内容专业、可操作
- 给出具体的数据和建议"""

        # 从state获取完整数据
        account_platform = state.get('account_platform', '未知平台')
        account_category = state.get('account_category', '未知类目')
        stats = state.get('stats', {})
        audience = state.get('audience', {})
        recent_content = state.get('recent_content', [])
        content_tags = state.get('content_tags', [])
        focus = state.get('focus', '')

        user_message = f"""请分析以下社交媒体账号：

【基础信息】
账号名称：{account_name}
账号简介：{account_bio}
所在平台：{account_platform}
内容类目：{account_category}

【账号数据】
粉丝数：{stats.get('followers', '未知')}
总阅读量：{stats.get('views', '未知')}
点赞数：{stats.get('likes', '未知')}
评论数：{stats.get('comments', '未知')}
互动率：{stats.get('engagementRate', '未知')}%'''

【受众画像】
{audience}

【近期内容】
{chr(10).join([f"- {c.get('title', '未知标题')} (播放{c.get('views', 0)}, 点赞{c.get('likes', 0)})" for c in recent_content[:5]]) if recent_content else '暂无'}

【内容标签】
{', '.join(content_tags) if content_tags else '暂无'}

【用户关注重点】
{focus if focus else '无特定关注点'}'''

请提供完整的诊断报告，包括：
1. 账号定位分析（优势、不足、改进建议）
2. 内容策略建议（内容矩阵、发布频率、最佳发布时间）
3. 受众画像详细分析（基于提供的数据）
4. 30天涨粉计划（分阶段目标、关键指标）

输出格式要求：
- 使用Markdown格式
- 内容专业、可操作
- 给出具体的数据和建议"""

        try:
            # 调用AI生成诊断报告
            diagnosis_text = get_ai_response(state, system_prompt, user_message)

            print(f"[DEBUG] diagnosis_text 长度: {len(diagnosis_text) if diagnosis_text else 0}")
            print(f"[DEBUG] diagnosis_text 前200字: {diagnosis_text[:200] if diagnosis_text else 'None'}")

            # 解析诊断结果（简化版，实际应更精细解析）
            state['diagnosis_result'] = {
                'account_name': account_name,
                'full_report': diagnosis_text,
                'positioning_analysis': extract_section(diagnosis_text, '定位分析'),
                'content_strategy': extract_section(diagnosis_text, '内容策略'),
                'audience_profile': extract_section(diagnosis_text, '受众画像'),
                'growth_plan': extract_section(diagnosis_text, '涨粉计划'),
                'score': calculate_score(account_name, account_bio)
            }

            print(f"[DEBUG] diagnosis_result 设置后: {state['diagnosis_result']}")

            state['is_complete'] = True

        except Exception as e:
            print(f"[DEBUG] 诊断异常: {str(e)}")
            import traceback
            traceback.print_exc()
            state['error_message'] = f"诊断失败: {str(e)}"
            state['is_complete'] = True

        return state
    
    return diagnosis_node

def extract_section(text: str, keyword: str) -> str:
    """从AI回复中提取特定部分（简化版）"""
    # 实际应使用更智能的解析方法
    return text  # 暂时返回全文

def calculate_score(name: str, bio: str) -> int:
    """计算账号健康度评分"""
    score = 60
    
    if len(name) > 3:
        score += 10
    if len(bio) > 50:
        score += 15
    if '专业' in bio or '资深' in bio:
        score += 10
    if '分享' in bio or '教程' in bio:
        score += 5
    
    return min(score, 95)

def should_continue(state: AgentState) -> Literal["continue", "end"]:
    """判断是否继续"""
    if state.get('is_complete', False):
        return "end"
    return "continue"
