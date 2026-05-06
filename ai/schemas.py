def normalize_topics(data):
    if not isinstance(data, dict):
        return {"trending": [], "original": []}
    return {
        "trending": data.get("trending") if isinstance(data.get("trending"), list) else [],
        "original": data.get("original") if isinstance(data.get("original"), list) else [],
    }


def normalize_plan(data):
    if not isinstance(data, dict):
        return {}
    data.setdefault("shots", [])
    data.setdefault("tags", [])
    data.setdefault("title_options", [])
    return data


def normalize_persona(data):
    if not isinstance(data, dict):
        return {}
    data.setdefault("recommended_tracks", [])
    data.setdefault("dimensions", {})
    data.setdefault("evidence", {})
    return data


def normalize_review(data):
    if not isinstance(data, dict):
        return {}
    return data


def normalize_persona_update(data):
    if not isinstance(data, dict):
        return {}
    return data


def normalize_account_review(data):
    if not isinstance(data, dict):
        return {}
    return data
