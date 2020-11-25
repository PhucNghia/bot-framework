# stop image
docker stop $(docker ps | grep ngocnghia97/reminder-bot | awk '{print $1}')

# remove image
docker image rm ngocnghia97/reminder-bot -f

# pull new code
docker pull ngocnghia97/reminder-bot

# run docker
docker run -d -p 7070:7070 ngocnghia97/reminder-bot

#check log
docker logs $(docker ps | grep ngocnghia97/reminder-bot | awk '{print $1}')
