FROM python:3.9.21-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

RUN python populate_db.py

EXPOSE 5000

ENTRYPOINT [ "python", "app.py" ]