FROM python:3.11-slim

WORKDIR /api
COPY reqs.txt ./reqs.txt

RUN pip install --no-cache-dir -r reqs.txt



COPY . .

EXPOSE 8999
