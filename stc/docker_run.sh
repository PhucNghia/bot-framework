# stop image
docker stop $(docker ps | grep ngocnghia97/stc | awk '{print $1}')
#docker stop $(docker ps | grep ngocnghia97/bot-framework-compose | awk '{print $1}')

# remove image
docker image rm ngocnghia97/stc -f
#docker image rm ngocnghia97/bot-framework-compose -f

# pull new code or build compose
docker pull ngocnghia97/stc
#docker-compose build

# run docker
docker run -t -d -p 6060:6060 ngocnghia97/stc
#docker run -d -p 7070:7070 ngocnghia97/bot-framework-compose

#check log
docker logs $(docker ps | grep ngocnghia97/stc | awk '{print $1}')
#docker logs $(docker ps | grep ngocnghia97/bot-framework-compose | awk '{print $1}')
