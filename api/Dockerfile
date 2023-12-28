FROM python:3.11-slim

WORKDIR /api
COPY reqs.txt ./reqs.txt

RUN pip install --no-cache-dir -r reqs.txt

COPY . .
RUN sed -i 's/localhost/db/g' alembic.ini

EXPOSE 8999