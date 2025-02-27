from db import db
from models.base import BaseModel


class StatusModel(BaseModel):
    title = db.Column(db.String, nullable=False)
    sort_key = db.Column(db.Integer, nullable=False, default=lambda: StatusModel.query.count())
    color = db.Column(db.String)
    tasks = db.relationship("TaskModel", backref="status", cascade="all, delete-orphan")

    def json(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "color": self.color,
        }
