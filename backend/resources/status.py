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
        payload = parser.parse_args()

        status = StatusModel(**payload)
        status.save()
        return status.json(), 200


class SingleStatusResource(Resource):
    def put(self, status_id):
        status = StatusModel.find_one(id=status_id)
        parser = reqparse.RequestParser()
        parser.add_argument("title", required=True, type=str)
        payload = parser.parse_args()

        if not status:
            return {"message": "entry not found"}, 404
        status.title = payload["title"]
        status.save()
        return status.json(), 200

    def delete(self, status_id):
        status = StatusModel.find_one(id=status_id)
        if not status:
            return {"message": "entry not found"}, 404
        status.delete()
        return {"message": f"entry with if {status_id} delete"}, 200


class SortStatusResource(Resource):
    def put(self):
        payload = request.get_json()
        status_list = []

        if StatusModel.find_count() != len(payload):
            return {"message": "not all items passes"}, 400

        for status_id in payload:
            status = StatusModel.find_one(id=status_id)
            if not status:
                return {"message": "invalid items passed"}, 400
            status.sort_key = len(status_list)
            status_list.append(status)
        StatusModel.transaction(status_list)

        return {"message": "order changed"}, 200
