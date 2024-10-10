IMAGE_NAME=gc-ide-server
TAG=latest
REMOTE_TAG=dev

docker tag $IMAGE_NAME:$TAG thickstem78/gene-circuit-ide:$REMOTE_TAG
docker push thickstem78/gene-circuit-ide:$REMOTE_TAG
