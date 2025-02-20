# docker run --name mongodb-comfyui -p 27017:27017 -d -v /d/db/mongodb:/data/db mongo --replSet=rs0

# mongodb://localhost:27017/?directConnection=true

docker exec -it mongodb-comfyui /bin/bash

mongosh
rs.initiate()
rs.status()
