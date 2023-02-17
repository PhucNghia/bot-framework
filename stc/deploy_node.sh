
## stop
sudo kill -9 $(pgrep -f bot-stc) &

## start
nohup npm start --prefix /home/ubuntu/home_resources/bot_onehome/stc/bot-framework bot-stc >/dev/null 2>&1 &

## show log
# cd /home/ubuntu/home_resources/bot_onehome/stc/bot-framework
# tail -2000f bot-framework.log

