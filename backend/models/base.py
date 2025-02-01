from db import db
from sqlalchemy.orm import Query
from typing import TypeVar, Type

T = TypeVar("T", bound="BaseModel")


class BaseModel(db.Model):
    __abstract__ = True
    id = db.Column(db.Integer, primary_key=True)

    def json(self) -> dict:
        return {
            "id": self.id,
        }

    def save(self) -> None:
        db.session.add(self)
        db.session.commit()

    def delete(self) -> None:
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def transaction(cls: Type["T"], items: list[Type["T"]]) -> None:
        db.session.add_all(items)
        db.session.commit()

    @classmethod
    def _find(cls: Type["T"], **kwargs) -> Query:
        return cls.query.filter_by(**kwargs)

    @classmethod
    def find_one(cls: Type["T"], **kwargs) -> "T":
        return cls._find(**kwargs).first()

    @classmethod
    def find_all(cls: Type["T"], **kwargs) -> list["T"]:
        return cls._find(**kwargs).all()

    @classmethod
    def find_all_sorted(cls: Type["T"], **kwargs) -> list["T"]:
        return cls._find(**kwargs).order_by(cls.sort_key).all()

    @classmethod
    def find_count(cls: Type["T"]) -> int:
        return cls.query.count()
