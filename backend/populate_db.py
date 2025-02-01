from app import app
from db import db
from models.status import StatusModel
from models.task import TaskModel

status_data = [
    {"title": "Todo"},
    {"title": "Doing"},
    {"title": "Done"},
]

task_data = [
    {"title": "If Condition", "status_id": 2},
    {"title": "While Loop", "status_id": 2},
    {"title": "Functions", "status_id": 1},
    {"title": "Classes", "status_id": 1},
    {"title": "Inheritance", "status_id": 1},
]

full_data = [
    {"model": StatusModel, "rows": status_data},
    {"model": TaskModel, "rows": task_data},
]

with app.app_context():
    db.drop_all()
    db.create_all()
    print("Tables re created")

    print("Populating started")
    for entry in full_data:
        model = entry["model"]
        rows = entry["rows"]
        for row in rows:
            obj = model(**row)
            obj.save()
    print("Populating completed")
