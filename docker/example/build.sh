# TODO This is just a place holder until I get github action to build docker images and push to gcr on tag
docker build -f ../api/api.dockerfile -t numbat_tasks_api:latest ../../.
docker build -f ../frontend/frontend.dockerfile -t numbat_tasks_frontend:latest ../../.