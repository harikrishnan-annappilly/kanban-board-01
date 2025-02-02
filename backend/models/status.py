from db import db
from sqlalchemy.orm import Query


class StatusModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    sort_key = db.Column(db.Integer, nullable=False, default=lambda: StatusModel.query.count())

    def json(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "sort_key": self.sort_key,
        }

    def save(self) -> None:
        db.session.add(self)
        db.session.commit()

    def delete(self) -> None:
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def transaction(cls, items):
        db.session.add_all(items)
        db.session.commit()

    @classmethod
    def _find(cls, **kwargs) -> Query:
        return cls.query.filter_by(**kwargs)

    @classmethod
    def find_one(cls, **kwargs) -> "StatusModel":
        return cls._find(**kwargs).first()

    @classmethod
    def find_all(cls, **kwargs) -> list["StatusModel"]:
        return cls._find(**kwargs).all()

    @classmethod
    def find_all_sorted(cls, **kwargs) -> list["StatusModel"]:
        return cls._find(**kwargs).order_by(cls.sort_key).all()

    @classmethod
    def find_count(cls):
        return cls.query.count()
