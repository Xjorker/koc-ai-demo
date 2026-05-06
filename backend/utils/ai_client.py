"""
AI客户端 - 支持所有OpenAI兼容API
"""
import json
import requests
from typing import List, Dict, Optional
from models.state import AgentState

class AIClient:
    """通用AI客户端，支持OpenAI、混元、DeepSeek等"""
    
    def __init__(self, api_config: Dict):
        self.endpoint = api_config.get('endpoint', 'https://api.openai.com/v1')
        self.api_key = api_config.get('api_key', '')
        self.model = api_config.get('model', 'gpt-4-turbo')
        self.temperature = api_config.get('temperature', 0.7)
        
        # 确保endpoint格式正确
        if not self.endpoint.endswith('/v1'):
            if not self.endpoint.endswith('/'):
                self.endpoint += '/'
            self.endpoint += 'v1'
    
    FALLBACK_MODEL = "gpt-4-turbo"

    def chat_completion(self, messages: List[Dict], temperature: Optional[float] = None) -> str:
        """调用聊天补全API，自动降级到gpt-4-turbo"""
        url = f"{self.endpoint}/chat/completions"

        print(f"[AIClient] 实际请求URL: {url}")
        print(f"[AIClient] API Key前缀: {self.api_key[:10] if self.api_key else 'None'}...")

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }

        # 尝试顺序：用户选择的模型 → gpt-4-turbo
        models_to_try = [self.model] if self.model != self.FALLBACK_MODEL else [self.model]
        if self.model != self.FALLBACK_MODEL:
            models_to_try.append(self.FALLBACK_MODEL)

        last_error = None
        for model in models_to_try:
            payload = {
                "model": model,
                "messages": messages,
                "temperature": temperature if temperature is not None else self.temperature,
                "max_tokens": 4000
            }

            print(f"[AI调用] endpoint: {url}")
            print(f"[AI调用] model: {model}, max_tokens: 4000")

            try:
                response = requests.post(url, headers=headers, json=payload, timeout=300)
                response.raise_for_status()
                result = response.json()
                content = result['choices'][0]['message']['content']
                if model != self.model:
                    print(f"[AI调用] 模型 {model} 可用，已切换")
                return content
            except requests.exceptions.HTTPError as e:
                # 524超时 / 400模型不存在 → 换模型重试
                if e.response is not None and e.response.status_code in (400, 408, 429, 502, 503, 504, 524):
                    print(f"[AI调用] 模型 {model} 不可用({e.response.status_code})，尝试下一个模型...")
                    last_error = e
                    continue
                raise Exception(f"API调用失败: {str(e)}")
            except requests.exceptions.RequestException as e:
                print(f"[AI调用] 网络错误: {str(e)}，尝试下一个模型...")
                last_error = e
                continue

        raise Exception(f"API调用失败: 所有模型均不可用，最后错误: {last_error}")
    
    def test_connection(self) -> bool:
        """测试API连接"""
        try:
            messages = [{"role": "user", "content": "你好，请回复'连接成功'"}]
            response = self.chat_completion(messages, temperature=0.1)
            return "成功" in response or "你好" in response or len(response) > 0
        except:
            return False

    def list_models(self) -> List[Dict]:
        """获取可用模型列表"""
        # 去掉末尾的 /v1，用 /v1/models 获取模型列表
        base_url = self.endpoint.rstrip('/').replace('/v1', '')
        url = f"{base_url}/v1/models"

        headers = {
            "Authorization": f"Bearer {self.api_key}"
        }

        try:
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            result = response.json()

            # OpenAI 格式：{"object": "list", "data": [{"id": "gpt-4", ...}, ...]}
            models = result.get('data', [])
            return [{"id": m.get('id', ''), "object": m.get('object', '')} for m in models]
        except requests.exceptions.RequestException as e:
            raise Exception(f"获取模型列表失败: {str(e)}")

def get_ai_response(state: AgentState, system_prompt: str, user_message: str) -> str:
    """从state中获取配置并调用AI"""
    api_config = state.get('api_config', {})
    client = AIClient(api_config)
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message}
    ]
    
    return client.chat_completion(messages)
