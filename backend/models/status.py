from db import db
from models.base import BaseModel
from utilities.colors import get_color


class StatusModel(BaseModel):
    title = db.Column(db.String, nullable=False)
    sort_key = db.Column(db.Integer, nullable=False, default=lambda: StatusModel.query.count())
    tasks = db.relationship("TaskModel", backref="status", cascade="all, delete-orphan")

    def json(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "color": get_color(),
        }
