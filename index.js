const bodyParser= require('body-parser')
const https = require('https');
const http = require('http');
const fs = require('fs');
const options = {
  key: fs.readFileSync('certificates/localhost-key.pem'),
  cert: fs.readFileSync('certificates/localhost.pem')
};
const request = require('request');
var schedule = require('node-schedule');
const restify = require('restify');
const botbuilder = require('botbuilder');

// Bot-inspector Create bot adapter, which defines how the bot sends and receives messages.
// var adapter = new botbuilder.BotFrameworkAdapter({
//   appId: "d2df0fd8-3ff3-4ec0-99ae-14adfb685866",
//   appPassword: "-E5UJDO~S~z5hXj3U2dz5m9gT3lcwmp_3J"
// });

// Bot-mini
var adapter = new botbuilder.BotFrameworkAdapter({
  appId: "fd6f34a7-57dd-4030-87ca-ec58d3373a1f",
  appPassword: "6Qehv.pwT.WXHf.PSvTYiD07hqI8D~I~58"
});

// Create HTTPs server.
// let server = restify.createServer(options, (req, res) => {
//   res.writeHead(200);
//   res.end('hello world\n');
// });

// Create HTTP server.
let server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 7070, function () {
  console.log(`\n${server.name} listening to ${server.url}`);
  console.log(`\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator`);
});
var requestInfo = null;
var responseInfo = null;

// Listen for incoming requests at /api/messages.
server.post('/api/messages', (req, res) => {
  // Use the adapter to process the incoming web request into a TurnContext object.
  console.log("req: " + req);
  console.log("res: " + res);
  requestInfo = req;
  responseInfo = res;
  adapter.processActivity(req, res, async (turnContext) => {
    let activity = turnContext.activity;
    console.log("activity type: " + activity.type);
    switch(activity.type) {
      case "conversationUpdate":
        try {
          await turnContext.sendActivity("Welcome!");
          await turnContext.sendActivities([
            // { type: 'typing' },
            // { type: 'delay', value: 4000 },
            { type: 'message', text: 'Hello... How are you?' }
         ]);
        } catch (error) {
          console.log("Removed this Bot");
          requestInfo = responseInfo = null;
        }
        
        break;
      case "message":
        // Get the user's text
        const utterance = activity.text;
        await turnContext.sendActivity(`Every new day is a new opportunity. Good Morning. (happyeyes) `);
        await turnContext.sendActivity(`I heard you say: ${ utterance }`);
        break;
      case "schedule":
        break;
      default:
        break;
    }
  });
});

// ========================================================

server.use(restify.plugins.bodyParser({ mapParams: true }));
server.use(restify.plugins.bodyParser({ mapParams: true }));
server.use(restify.plugins.acceptParser(server.acceptable));

server.get('/', (req, res) => {
  res.send("Hello");
});

// var cronExpress = '*/15 * * * * * *';  // 15s chạy 1 lần
// var cronExpress = '0 5 8 * * THU';     // 8h30p thứ năm hàng tuần
// var cronExpressMorning = '0 0 09 * * THU';
// var cronExpressAfternoon = '0 30 15 * * THU';

var cronExpressMorning = '*/30 * * * * * *';

schedule.scheduleJob(cronExpressMorning, function(fireDate) {
  let content = "hello 1";
  processJob(content);
  console.log(fireDate);
});

// schedule.scheduleJob(cronExpressAfternoon, function(fireDate) {
//   let content = "hello 2";
//   processJob(content);
// });

var processJob = function(content) {
  if(requestInfo == null || responseInfo == null) {
    return;
  }
  request.post('http://localhost:7070/api/notification', {form: {content: content}})
}

server.post('/api/notification', (req, res) => {
  let content = req.body.content;
  console.log("Content: " + content);
  adapter.processActivity(requestInfo, responseInfo, async (turnContext) => {
    await turnContext.sendActivity(content);
  });
  
  res.send("sent");
});
