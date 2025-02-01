from flask import request
from flask_restful import Resource, reqparse
from models.status import StatusModel
from models.task import TaskModel

parser = reqparse.RequestParser()
parser.add_argument("title", required=True, type=str)
parser.add_argument("status_id", required=True, type=int)


class SortedTasksResource(Resource):
    def get(self):
        return [task.json() for task in TaskModel.find_all_sorted()]


class TasksResource(Resource):
    def get(self):
        return [task.json() for task in TaskModel.find_all()]

    def post(self):
        payload = parser.parse_args()
        title = payload.get("title")
        status_id = payload.get("status_id")

        if not StatusModel.find_one(id=status_id):
            return {"message": f"not found, status id: {status_id}"}, 404

        task = TaskModel(title=title, status_id=status_id)
        task.save()
        return task.json(), 201


class SingleTaskResource(Resource):
    def put(self, task_id):
        payload = parser.parse_args()
        title = payload.get("title")
        status_id = payload.get("status_id")

        task = TaskModel.find_one(id=task_id)
        if not task:
            return {"message": f"not found, task id: {task_id}"}, 404
        if not StatusModel.find_one(id=status_id):
            return {"message": f"not found, status id: {status_id}"}, 404

        task.status_id = status_id
        task.title = title
        task.save()
        return task.json(), 200

    def delete(self, task_id):
        task = TaskModel.find_one(id=task_id)
        if not task:
            return {"message": f"not found, task id: {task_id}"}, 404
        task.delete()
        return {"message": f"task deleted, task id: {task_id}"}, 200


class SortTaskResource(Resource):
    def put(self):
        added = set()
        task_ids = [task_id for task_id in request.get_json() if not (task_id in added or added.add(task_id))]

        task_count = TaskModel.find_count()
        if task_count != len(task_ids):
            return {"message": f"provide {task_count} unique task id"}, 400

        task_list = []
        for task_id in task_ids:
            task = TaskModel.find_one(id=task_id)
            if not task:
                return {"message": f"not found, task id: {task_id}"}, 404
            task.sort_key = len(task_list)
            task_list.append(task)
        TaskModel.transaction(task_list)
        return {"message": "order changed"}, 200
