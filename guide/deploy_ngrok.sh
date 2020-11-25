sudo kill -9 $(pgrep -f -n ngrok)
nohup ngrok start -config /home/ubuntu/home_resources/docker/ngrok-bot.yml bot-framework > /dev/null 2>&1 &
