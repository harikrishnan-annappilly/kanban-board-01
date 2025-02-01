from db import db
from models.base import BaseModel


class StatusModel(BaseModel):
    title = db.Column(db.String, nullable=False)
    sort_key = db.Column(db.Integer, nullable=False, default=lambda: StatusModel.query.count())

    def json(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "sort_key": self.sort_key,
        }
