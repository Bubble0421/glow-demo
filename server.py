from flask import Flask, send_from_directory

from routes.api import bp

app = Flask(__name__, static_folder=".", static_url_path="")
app.register_blueprint(bp)


@app.route("/")
def index():
    return send_from_directory(".", "index.html")


if __name__ == "__main__":
    app.run(port=5173, debug=False)
