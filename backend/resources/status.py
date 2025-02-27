from flask import request
from flask_restful import Resource, reqparse
from models.status import StatusModel


class SortedStatusResource(Resource):
    def get(self):
        return [status.json() for status in StatusModel.find_all_sorted()]


class StatusResource(Resource):
    def get(self):
        return [status.json() for status in StatusModel.find_all()]

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("title", required=True, type=str)
        parser.add_argument("color", required=True, type=str)
        payload = parser.parse_args()

        status = StatusModel(**payload)
        status.save()
        return status.json(), 200


class SingleStatusResource(Resource):
    def put(self, status_id):
        status = StatusModel.find_one(id=status_id)
        parser = reqparse.RequestParser()
        parser.add_argument("title", required=True, type=str)
        parser.add_argument("color", required=True, type=str)
        payload = parser.parse_args()

        if not status:
            return {"message": f"not found, status id: {status_id}"}, 404
        status.title = payload["title"]
        status.color = payload["color"]
        status.save()
        return status.json(), 200

    def delete(self, status_id):
        status = StatusModel.find_one(id=status_id)
        if not status:
            return {"message": f"not found, status id: {status_id}"}, 404
        status.delete()
        return {"message": f"status deleted, status id: {status_id}"}, 200


class SortStatusResource(Resource):
    def put(self):
        added = set()
        status_ids = [status_id for status_id in request.get_json() if not (status_id in added or added.add(status_id))]
        status_list = []

        count = StatusModel.find_count()
        if count != len(status_ids):
            return {"message": f"provide {count} unique status id"}, 400

        for status_id in status_ids:
            status = StatusModel.find_one(id=status_id)
            if not status:
                return {"message": f"not found, status id: {staticmethod}"}, 404
            status.sort_key = len(status_list)
            status_list.append(status)
        StatusModel.transaction(status_list)

        return {"message": "order changed"}, 200
