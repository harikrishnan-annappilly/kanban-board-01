from db import db
from models.base import BaseModel


class TaskModel(BaseModel):
    title = db.Column(db.String, nullable=False)
    sort_key = db.Column(db.Integer, nullable=False, default=lambda: TaskModel.query.count())
    status_id = db.Column(db.Integer, db.ForeignKey("status_model.id"), nullable=False)

    def json(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores fugit nihil rem.",
            "columnId": self.status_id,
        }
