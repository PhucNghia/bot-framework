
# first run
kill -9 $(pgrep -f -n node) &

# second run
nohup node bot-framework/index.js > bot-framework/bot-framework.log "bot-stc" &


