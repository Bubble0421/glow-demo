import json

from flask import Blueprint, jsonify, request

from ai import generator, prompts, schemas, mock as ai_mock

bp = Blueprint("api", __name__, url_prefix="/api")


@bp.route("/ping", methods=["GET", "POST"])
def api_ping():
    return jsonify({"ok": True, "msg": "pong v2"})


@bp.route("/persona", methods=["POST"])
def api_persona():
    body = request.get_json(force=True)
    user_text    = body.get("user_text", "")
    quiz_answers = body.get("quiz_answers", {})
    prompt = prompts.render(
        "persona",
        user_text=user_text or "（用户未提供历史文字，请根据测评答案推断）",
        quiz_answers=json.dumps(quiz_answers, ensure_ascii=False, indent=2),
    )
    try:
        persona = schemas.normalize_persona(generator.generate_json(prompt))
        return jsonify({"ok": True, "persona": persona})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500


@bp.route("/create", methods=["POST"])
def api_create():
    body    = request.get_json(force=True)
    topic   = body.get("topic", "")
    persona = body.get("persona", {})
    prompt = prompts.render(
        "create",
        persona_name=persona.get("persona_name", "细腻观察者"),
        persona_description=persona.get("persona_description", ""),
        topic=topic,
    )
    try:
        plan = schemas.normalize_plan(generator.generate_json(prompt))
        return jsonify({"ok": True, "plan": plan})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500


@bp.route("/topics", methods=["POST"])
def api_topics():
    try:
        body    = request.get_json(force=True)
        persona = body.get("persona", {})
        dims    = persona.get("dimensions", {})
        dims_str = ", ".join(f"{k}={v}" for k, v in dims.items()) if dims else "未知"
        prompt = prompts.render(
            "topics",
            persona_name=persona.get("persona_name", "细腻观察者"),
            persona_description=persona.get("persona_description", ""),
            content_direction=persona.get("content_direction", ""),
            dimensions=dims_str,
        )
        topics = schemas.normalize_topics(generator.generate_json(prompt))
        return jsonify({"ok": True, "topics": topics})
    except Exception as e:
        return jsonify({"ok": True, "topics": ai_mock.topics(), "_fallback": str(e)})


@bp.route("/review", methods=["POST"])
def api_review():
    body    = request.get_json(force=True)
    persona = body.get("persona", {})
    post    = body.get("post", {})
    prompt = prompts.render(
        "review",
        persona_name=persona.get("persona_name", "细腻观察者"),
        post_title=post.get("title", ""),
        likes=post.get("likes", 0),
        comments=post.get("comments", 0),
        followers=post.get("followers", 0),
    )
    try:
        review = schemas.normalize_review(generator.generate_json(prompt))
        return jsonify({"ok": True, "review": review})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500


@bp.route("/persona_update", methods=["POST"])
def api_persona_update():
    body         = request.get_json(force=True)
    persona      = body.get("persona", {})
    interactions = body.get("interactions", [])
    interactions_str = "\n".join(f"- {item}" for item in interactions)
    prompt = prompts.render(
        "persona_update",
        persona_name=persona.get("persona_name", "细腻观察者"),
        persona_description=persona.get("persona_description", ""),
        interactions=interactions_str or "（暂无记录）",
    )
    try:
        update = schemas.normalize_persona_update(generator.generate_json(prompt))
        return jsonify({"ok": True, "update": update})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500


@bp.route("/account_review", methods=["POST"])
def api_account_review():
    body  = request.get_json(force=True)
    persona = body.get("persona", {})
    posts   = body.get("posts", [])
    posts_summary = "\n".join(
        f"- 《{p.get('title', '未命名')}》：点赞 {p.get('likes', 0)}，评论 {p.get('comments', 0)}，涨粉 {p.get('followers', 0)}"
        for p in posts
    )
    prompt = prompts.render(
        "account_review",
        persona_name=persona.get("persona_name", "细腻观察者"),
        posts_summary=posts_summary or "（暂无内容数据）",
    )
    try:
        review = schemas.normalize_account_review(generator.generate_json(prompt))
        return jsonify({"ok": True, "review": review})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500


@bp.route("/refine_chat", methods=["POST"])
def api_refine_chat():
    body    = request.get_json(force=True)
    persona = body.get("persona", {})
    topic   = body.get("topic", "")
    history = body.get("history", [])
    message = body.get("message", "")

    history_parts = []
    for h in history:
        label = "用户" if h.get("role") == "user" else "小光"
        history_parts.append(f"{label}：{h.get('content', '')}")
    history_text = ("【对话记录】\n" + "\n".join(history_parts) + "\n\n") if history_parts else ""

    prompt = prompts.render(
        "refine_chat",
        persona_name=persona.get("persona_name", "细腻观察者"),
        persona_description=persona.get("persona_description", ""),
        topic=topic,
        history_text=history_text,
        message=message,
    )
    try:
        reply = generator.chat([{"role": "user", "content": prompt}], temperature=0.75)
        return jsonify({"ok": True, "reply": reply.strip()})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500
