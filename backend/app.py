from flask import Flask, Blueprint
from flask_restful import Api

from db import db
from resources.status import StatusResource, SortedStatusResource, SingleStatusResource, SortStatusResource

app = Flask(__name__)

app.secret_key = "key"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
bp = Blueprint("api", __name__, url_prefix="/api")
api = Api(bp)

app.register_blueprint(bp)

api.add_resource(StatusResource, "/status")
api.add_resource(SortStatusResource, "/sort-status")
api.add_resource(SortedStatusResource, "/sorted-status")
api.add_resource(SingleStatusResource, "/single-status/<int:status_id>")


@app.before_request
def create_all():
    db.create_all()


if __name__ == "__main__":
    app.run(debug=True)
