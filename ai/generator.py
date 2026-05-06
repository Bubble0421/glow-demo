import json
import os
import re

from .client import get_client
from . import mock

MODEL = os.environ.get("HUNYUAN_MODEL", "hunyuan-pro")


def _use_mock():
    return (
        os.environ.get("GLOW_DEMO_MODE", "").lower() in {"1", "true", "yes"}
        or not os.environ.get("TENCENT_SECRET_ID")
        or not os.environ.get("TENCENT_SECRET_KEY")
    )


def _mock_json(prompt):
    if "Trend Agent" in prompt:
        return mock.topics()
    if "Creator Agent" in prompt:
        topic_match = re.search(r"【话题/主题】\s*(.+)", prompt, re.S)
        topic = topic_match.group(1).strip().splitlines()[0] if topic_match else ""
        return mock.plan(topic)
    if "多条内容数据" in prompt or "【内容列表】" in prompt:
        return mock.account_review()
    if "Memory Agent" in prompt or "最近互动记录" in prompt:
        return mock.persona_update()
    if "Coach Agent" in prompt:
        return mock.review()
    return mock.persona()


def chat(messages, temperature=0.7):
    if _use_mock():
        return mock.refine_reply()

    from tencentcloud.hunyuan.v20230901 import models
    client = get_client()
    if hasattr(models, "ChatCompletionsRequest"):
        req = models.ChatCompletionsRequest()
        req.Model = MODEL
        req.Messages = []
        for m in messages:
            item = models.Message()
            item.Role = m["role"]
            item.Content = m["content"]
            req.Messages.append(item)
        req.Temperature = temperature
        resp = client.ChatCompletions(req)
        return resp.Choices[0].Message.Content

    req = models.ChatProRequest()
    req.Messages = [{"Role": m["role"], "Content": m["content"]} for m in messages]
    req.Temperature = temperature
    chunks = client.ChatPro(req)
    return "".join(getattr(chunk, "Content", "") for chunk in chunks)


def generate_json(prompt, temperature=0.3):
    if _use_mock():
        return _mock_json(prompt)

    text = chat([{"role": "user", "content": prompt}], temperature=temperature)
    text = text.strip()
    text = re.sub(r"^```(?:json)?", "", text).strip()
    text = re.sub(r"```$", "", text).strip()
    return json.loads(text)
