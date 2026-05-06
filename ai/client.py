import os

_client = None


def get_client():
    global _client
    if _client is None:
        secret_id = os.environ.get("TENCENT_SECRET_ID")
        secret_key = os.environ.get("TENCENT_SECRET_KEY")
        if not secret_id or not secret_key:
            raise RuntimeError("Tencent Hunyuan credentials are not configured")

        from tencentcloud.common import credential
        from tencentcloud.hunyuan.v20230901 import hunyuan_client
        cred = credential.Credential(secret_id, secret_key)
        _client = hunyuan_client.HunyuanClient(cred, "ap-beijing")
    return _client
