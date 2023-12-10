FROM python:3.11-slim

COPY . /api
WORKDIR /api
RUN pip install --no-cache-dir -r reqs.txt
RUN sed -i 's/localhost/db/g' alembic.ini

EXPOSE 8999