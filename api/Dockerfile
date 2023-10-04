FROM python:3.11-slim
WORKDIR /api
COPY ./reqs.txt reqs.txt
RUN pip install --no-cache-dir -r reqs.txt
COPY ./app /api/app
CMD ["uvicorn", "app:main", "--host", "0.0.0.0", "--port", "9999"]
