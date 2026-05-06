import os

_cache = {}
_PROMPTS_DIR = os.path.join(os.path.dirname(__file__), "..", "prompts")


def _load(name):
    if name not in _cache:
        path = os.path.join(_PROMPTS_DIR, f"{name}.txt")
        with open(path, encoding="utf-8") as f:
            _cache[name] = f.read()
    return _cache[name]


def render(name, **kwargs):
    """Load prompts/{name}.txt and replace {{key}} placeholders."""
    template = _load(name)
    for key, val in kwargs.items():
        template = template.replace("{{" + key + "}}", str(val))
    return template
